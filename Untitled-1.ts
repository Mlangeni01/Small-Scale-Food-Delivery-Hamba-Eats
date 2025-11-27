// models/Restaurant.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

// Menu item sub-schema (no separate _id by default here)
const MenuItemSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  imageUrl: String
}, { _id: false });

// GeoJSON Point sub-schema
const LocationSchema = new Schema({
  type: { type: String, enum: ['Point'], default: 'Point' },
  // coordinates: [ lng, lat ]
  coordinates: { type: [Number], default: [0, 0] }
}, { _id: false });

const RestaurantSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  location: { type: LocationSchema, default: { type: 'Point', coordinates: [0, 0] } },
  logoUrl: { type: String },
  menu: { type: [MenuItemSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

// 2dsphere index for geo queries (important)
RestaurantSchema.index({ location: '2dsphere' });
RestaurantSchema.index({ name: 'text', address: 'text', 'menu.name': 'text', 'menu.description': 'text' });

module.exports = mongoose.model('Restaurant', RestaurantSchema);