import mongoose from 'mongoose';
import { baseSchemaOptions } from './baseOptions.js';

const messageSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', default: null },
  body: { type: String, required: true, trim: true, maxlength: 4000 },
  read: { type: Boolean, default: false }
}, baseSchemaOptions);

messageSchema.index({ sender_id: 1, receiver_id: 1, created_at: -1 });
messageSchema.index({ receiver_id: 1, read: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
