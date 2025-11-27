// routes/admin.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Driver = require('../models/Driver');
const Restaurant = require('../models/Restaurant');

// Admin: list all orders
router.get('/orders', async (req, res) => {
  res.json(await Order.find().sort('-createdAt').populate('restaurant').populate('driver'));
});

// Admin: payouts report (very simple)
router.get('/payouts', async (req, res) => {
  const orders = await Order.find({ status: 'delivered' });
  // process a basic report
  const totalDelivered = orders.length;
  // You can extend to calculate revenues by restaurant or driver
  res.json({ totalDelivered });
});

module.exports = router;
