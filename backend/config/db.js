import mongoose from 'mongoose';

const rawMongoUri = process.env.MONGO_URI || '';
const dbName = process.env.DB_NAME || 'bookmystay01';

const isPlaceholderUri = (uri) => {
  if (!uri) return false;
  return (
    uri.includes('yourusername') ||
    uri.includes('yourpassword') ||
    uri.includes('cluster0.mongodb.net/?')
  );
};

const buildMongoUri = () => {
  if (!rawMongoUri || isPlaceholderUri(rawMongoUri)) {
    return `mongodb://127.0.0.1:27017/${dbName}`;
  }

  if (rawMongoUri.startsWith('mongodb://') && !rawMongoUri.includes('/', 10)) {
    return `${rawMongoUri}/${dbName}`;
  }

  return rawMongoUri;
};

const MONGO_URI = buildMongoUri();

export const connectDB = async () => {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

// Helper to check connection status
export const isMongoConnected = () => mongoose.connection.readyState === 1;

export default mongoose;
