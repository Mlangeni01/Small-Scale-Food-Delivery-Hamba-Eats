// models/Order.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
  name: String,
  price: Number,
  qty: { type: Number, default: 1 }
}, { _id: false });

const OrderSchema = new Schema({
  customerName: String,
  customerPhone: String,
  address: String,
  items: [OrderItemSchema],
  total: Number,
  deliveryFee: { type: Number, default: 40 },
  commission: { type: Number, default: 30 },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
  driver: { type: Schema.Types.ObjectId, ref: 'Driver' },
  status: {
    type: String,
    enum: ['pending','accepted','preparing','ready','picked','delivered','cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
