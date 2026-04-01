import mongoose from 'mongoose';
import { inMemoryDB } from '../config/inMemoryDB.js';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, default: null },
  role: { type: String, enum: ['guest', 'host'], default: 'guest' },
  avatar: { type: String, default: null },
  payout_details: { type: mongoose.Schema.Types.Mixed, default: null }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

// Wrapper that handles both MongoDB and in-memory fallback
class UserWrapper {
  static isMongoConnected() {
    return mongoose.connection.readyState === 1;
  }

  static async create(data) {
    if (this.isMongoConnected()) {
      const user = await User.create(data);
      return { ...user.toObject(), id: user._id.toString() };
    }
    // Use in-memory fallback
    return await inMemoryDB.createUser(data);
  }

  static async findOne(query) {
    if (this.isMongoConnected()) {
      const user = await User.findOne(query).lean();
      return user ? { ...user, id: user._id.toString() } : null;
    }
    // Use in-memory fallback
    if (query.email) {
      return await inMemoryDB.findUserByEmail(query.email);
    }
    return null;
  }

  static async findById(id) {
    if (this.isMongoConnected()) {
      const user = await User.findById(id).lean();
      return user ? { ...user, id: user._id.toString() } : null;
    }
    // Use in-memory fallback
    return await inMemoryDB.findUserById(id);
  }

  static async findByIdAndUpdate(id, updates) {
    if (this.isMongoConnected()) {
      const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).lean();
      return updatedUser ? { ...updatedUser, id: updatedUser._id.toString() } : null;
    }
    return await inMemoryDB.updateUser(id, updates);
  }

  // Add a test/demo user for development
  static async addDemoUser() {
    const demoUser = {
      email: 'demo@example.com',
      password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password"
      name: 'Demo User',
      phone: null,
      role: 'guest',
      avatar: null
    };
    
    if (this.isMongoConnected()) {
      const exists = await User.findOne({ email: demoUser.email });
      if (!exists) {
        await User.create(demoUser);
        console.log('Demo user created: demo@example.com / password');
      }
    } else {
      const exists = await inMemoryDB.findUserByEmail(demoUser.email);
      if (!exists) {
        await inMemoryDB.createUser(demoUser);
        console.log('Demo user created (in-memory): demo@example.com / password');
      }
    }
  }
}

export default UserWrapper;
