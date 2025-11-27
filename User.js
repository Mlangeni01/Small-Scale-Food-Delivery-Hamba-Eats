// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['admin','restaurant','driver','customer'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
