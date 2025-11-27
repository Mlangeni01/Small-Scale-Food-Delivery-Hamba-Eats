// models/Driver.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DriverSchema = new Schema({
  name: String,
  phone: { type: String, required: true, unique: true },
  vehicle: String,
  isActive: { type: Boolean, default: true },
  currentOrder: { type: Schema.Types.ObjectId, ref: 'Order' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Driver', DriverSchema);
