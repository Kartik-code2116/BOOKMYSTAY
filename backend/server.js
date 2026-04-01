import 'dotenv/config'; // Must be first to load env vars before other imports
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import hostRoutes from './routes/hostRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// Import database connection
import mongoose, { connectDB, isMongoConnected } from './config/db.js';
import User from './models/User.js';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/host', hostRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'BookMyStay API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        me: 'GET /api/auth/me'
      }
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    dbConnected: isMongoConnected(),
    mongoState: mongoose.connection.readyState
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Start server (DB connection optional)
let dbConnected = false;
const startServer = async () => {
  try {
    await connectDB();
    dbConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    dbConnected = false;
    console.error('MongoDB connection failed:', err.message);
    console.log('Server starting without DB - using in-memory storage');
    console.log('Login will work with demo user: demo@example.com / password');
  }

  await User.addDemoUser();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
    console.log(`DB Status: ${dbConnected ? 'Connected' : 'Using In-Memory Storage'}`);
  });
};

startServer();
