import express from 'express';
import mongoose from 'mongoose';
import { authenticateToken } from '../middleware/authMiddleware.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Property from '../models/Property.js';

const router = express.Router();

const toId = (v) => (v == null ? null : String(v));

// Send a message
router.post('/', authenticateToken, async (req, res) => {
  try {
    let { receiver_id, property_id, body } = req.body;
    const senderId = req.user.id;

    if (!body || typeof body !== 'string' || !body.trim()) {
      return res.status(400).json({ error: 'Message body is required' });
    }

    if (property_id && !receiver_id) {
      const prop = await Property.findById(property_id).select('host_id').lean();
      if (!prop) return res.status(404).json({ error: 'Property not found' });
      const hostId = String(prop.host_id);
      if (hostId === String(senderId)) {
        return res.status(400).json({ error: 'Use receiver_id when replying to a guest' });
      }
      receiver_id = hostId;
    }

    if (!receiver_id) {
      return res.status(400).json({ error: 'receiver_id or property_id is required' });
    }

    if (toId(receiver_id) === toId(senderId)) {
      return res.status(400).json({ error: 'Cannot message yourself' });
    }

    const peer = await User.findById(receiver_id);
    if (!peer) return res.status(404).json({ error: 'Recipient not found' });

    const msg = await Message.create({
      sender_id: senderId,
      receiver_id,
      property_id: property_id || null,
      body: body.trim()
    });

    const populated = await Message.findById(msg._id)
      .populate('sender_id', 'name email avatar')
      .populate('receiver_id', 'name email avatar')
      .populate('property_id', 'title city')
      .lean({ virtuals: true });

    res.status(201).json(formatMessage(populated));
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

function formatMessage(m) {
  if (!m) return null;
  const s = m.sender_id && typeof m.sender_id === 'object' && m.sender_id._id
    ? m.sender_id
    : { _id: m.sender_id };
  const r = m.receiver_id && typeof m.receiver_id === 'object' && m.receiver_id._id
    ? m.receiver_id
    : { _id: m.receiver_id };
  const p = m.property_id && typeof m.property_id === 'object' && m.property_id._id
    ? m.property_id
    : null;
  return {
    id: m._id.toString(),
    sender_id: s._id ? s._id.toString() : String(m.sender_id),
    receiver_id: r._id ? r._id.toString() : String(m.receiver_id),
    sender_name: s.name || null,
    receiver_name: r.name || null,
    property_id: p?._id ? p._id.toString() : (m.property_id ? String(m.property_id) : null),
    property_title: p?.title || null,
    body: m.body,
    read: m.read,
    created_at: m.created_at
  };
}

// Inbox: grouped threads (peer + optional property)
router.get('/inbox', authenticateToken, async (req, res) => {
  try {
    const userIdStr = String(req.user.id);
    const userOid = new mongoose.Types.ObjectId(req.user.id);
    const rows = await Message.find({
      $or: [{ sender_id: userOid }, { receiver_id: userOid }]
    })
      .sort({ created_at: -1 })
      .populate('sender_id', 'name avatar')
      .populate('receiver_id', 'name avatar')
      .populate('property_id', 'title city')
      .lean();

    const threads = new Map();
    for (const m of rows) {
      const senderStr = m.sender_id?._id ? m.sender_id._id.toString() : String(m.sender_id);
      const receiverStr = m.receiver_id?._id ? m.receiver_id._id.toString() : String(m.receiver_id);
      const peerId = senderStr === userIdStr ? receiverStr : senderStr;
      const propKey = m.property_id?._id ? m.property_id._id.toString() : '_';
      const key = `${peerId}|${propKey}`;
      if (threads.has(key)) {
        const t = threads.get(key);
        if (!m.read && receiverStr === userIdStr) t.unread += 1;
        continue;
      }
      const unread = !m.read && receiverStr === userIdStr ? 1 : 0;
      const peer = senderStr === userIdStr ? m.receiver_id : m.sender_id;
      const peerDocId = peer?._id ? peer._id.toString() : peerId;
      threads.set(key, {
        peer_id: peerDocId,
        peer_name: peer?.name || 'User',
        peer_avatar: peer?.avatar || null,
        property_id: m.property_id?._id?.toString() || null,
        property_title: m.property_id?.title || null,
        last_message: m.body,
        last_at: m.created_at,
        unread
      });
    }

    res.json(Array.from(threads.values()).sort((a, b) => new Date(b.last_at) - new Date(a.last_at)));
  } catch (err) {
    console.error('Inbox error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Messages with one user (optional property filter)
router.get('/thread/:peerId', authenticateToken, async (req, res) => {
  try {
    const self = new mongoose.Types.ObjectId(req.user.id);
    const peer = new mongoose.Types.ObjectId(req.params.peerId);
    const { property_id } = req.query;

    const filter = {
      $or: [
        { sender_id: self, receiver_id: peer },
        { sender_id: peer, receiver_id: self }
      ]
    };
    if (property_id) {
      filter.property_id = new mongoose.Types.ObjectId(property_id);
    }

    const list = await Message.find(filter)
      .sort({ created_at: 1 })
      .populate('sender_id', 'name avatar')
      .populate('receiver_id', 'name avatar')
      .populate('property_id', 'title')
      .lean();

    await Message.updateMany(
      { sender_id: peer, receiver_id: self, read: false },
      { $set: { read: true } }
    );

    res.json(list.map(formatMessage));
  } catch (err) {
    console.error('Thread error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const n = await Message.countDocuments({ receiver_id: req.user.id, read: false });
    res.json({ count: n });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
