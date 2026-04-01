import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { authenticateToken } from '../middleware/authMiddleware.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import { getNightlyPriceBreakdown, computeStayTotal } from '../utils/pricing.js';

const router = express.Router();

let razorpayInstance = null;
const getRazorpay = () => {
  if (razorpayInstance) return razorpayInstance;
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return null;
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  return razorpayInstance;
};

const hasOverlap = async (propertyId, checkIn, checkOut) => {
  const overlapping = await Booking.find({
    property_id: propertyId,
    status: { $ne: 'cancelled' },
    $or: [
      { check_in: { $lte: checkIn }, check_out: { $gt: checkIn } },
      { check_in: { $lt: checkOut }, check_out: { $gte: checkOut } },
      { check_in: { $gte: checkIn }, check_out: { $lte: checkOut } }
    ]
  }).lean();

  return overlapping.length > 0;
};

// Create Razorpay order (amount in INR; we send paise to Razorpay)
router.post('/create-order', authenticateToken, async (req, res) => {
  const razorpay = getRazorpay();
  if (!razorpay) {
    return res.status(503).json({ error: 'Payment is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env' });
  }
  try {
    const { property_id, check_in, check_out, guests_count } = req.body;

    if (!property_id || !check_in || !check_out || !guests_count) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const property = await Property.findById(property_id).lean();
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (Number(guests_count) > property.max_guests) {
      return res.status(400).json({ error: `Max ${property.max_guests} guests allowed` });
    }

    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    const overlap = await hasOverlap(property._id, checkInDate, checkOutDate);
    if (overlap) {
      return res.status(400).json({ error: 'Property not available for selected dates' });
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const { effectiveNightly } = getNightlyPriceBreakdown(property);
    const totalPrice = computeStayTotal(effectiveNightly, nights);
    const amountPaise = Math.round(totalPrice * 100); // INR to paise

    if (amountPaise < 100) {
      return res.status(400).json({ error: 'Minimum amount is ₹1' });
    }

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `book_${property_id}_${Date.now()}`
    });

    res.json({
      orderId: order.id,
      amount: totalPrice,
      amountPaise,
      currency: 'INR',
      nights,
      nightly_rate: effectiveNightly
    });
  } catch (error) {
    console.error('Create order error:', error);
    if (error.code === 'BAD_REQUEST_ERROR') {
      return res.status(400).json({ error: error.description || 'Invalid request' });
    }
    res.status(500).json({ error: 'Payment service error: ' + (error.error?.description || error.message || JSON.stringify(error)) });
  }
});

// Verify payment and create booking (only after successful payment)
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      property_id,
      check_in,
      check_out,
      guests_count
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature ||
        !property_id || !check_in || !check_out || !guests_count) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    if (expected !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    const property = await Property.findById(property_id).lean();
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    const overlap = await hasOverlap(property._id, checkInDate, checkOutDate);
    if (overlap) {
      return res.status(400).json({ error: 'Property no longer available for these dates' });
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const { effectiveNightly } = getNightlyPriceBreakdown(property);
    const totalPrice = computeStayTotal(effectiveNightly, nights);

    const booking = await Booking.create({
      property_id: property._id,
      guest_id: req.user.id,
      check_in: checkInDate,
      check_out: checkOutDate,
      total_price: totalPrice,
      guests_count,
      status: 'confirmed'
    });

    await Payment.create({
      booking_id: booking._id,
      razorpay_order_id,
      razorpay_payment_id,
      amount: totalPrice,
      currency: 'INR',
      status: 'captured'
    });

    res.status(201).json({
      message: 'Booking confirmed',
      bookingId: booking.id,
      totalPrice,
      nights
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Payment history for current guest
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ guest_id: req.user.id }).select('_id').lean();
    const bookingIds = bookings.map((b) => b._id);

    const payments = await Payment.find({ booking_id: { $in: bookingIds } })
      .sort({ created_at: -1 })
      .populate({
        path: 'booking_id',
        select: 'check_in check_out total_price guests_count status property_id',
        populate: { path: 'property_id', select: 'title city country images' }
      })
      .lean({ virtuals: true });

    const rows = payments.map((p) => {
      const b = p.booking_id;
      const prop = b?.property_id;
      return {
        id: p._id.toString(),
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        razorpay_payment_id: p.razorpay_payment_id,
        created_at: p.created_at,
        booking_id: b?._id?.toString() || null,
        check_in: b?.check_in,
        check_out: b?.check_out,
        booking_status: b?.status,
        property_title: prop?.title || null,
        property_city: prop?.city || null,
        property_country: prop?.country || null
      };
    });

    res.json(rows);
  } catch (err) {
    console.error('Payment history error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
