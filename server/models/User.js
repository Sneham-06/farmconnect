const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'consumer'], required: true },
  // Farmer specific
  village: { type: String },
  state: { type: String },
  // Consumer specific
  city: { type: String },
  preferred_language: { type: String, enum: ['en', 'hi', 'kn', 'te'], default: 'en' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
