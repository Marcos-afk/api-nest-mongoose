import mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isConfirmed: { type: Boolean, default: false },
  confirmationCode: { type: String, required: true, unique: true },
});
