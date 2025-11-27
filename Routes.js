// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const Driver = require('../models/Driver');
const { sendOrderNotification } = require('../utils/notify');
const { io } = require('../utils/socket');

// Create order (called from frontend)
router.post('/', async (req, res) => {
  try {
    const { customerName, customerPhone, address, items, restaurantId } = req.body;
    const total = items.reduce((s, it) => s + (it.price * (it.qty || 1)), 0);
    const order = new Order({
      customerName, customerPhone, address, items, total,
      restaurant: restaurantId
    });
    await order.save();

    // Emit realtime event for restaurant
    if (io) io.to(`restaurant_${restaurantId}`).emit('new_order', order);

    // Send WhatsApp/SMS notification to restaurant (via utils/notify)
    const restaurant = await Restaurant.findById(restaurantId);
    if (restaurant) {
      await sendOrderNotification(restaurant.phone, order, restaurant.name);
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get orders for restaurant
router.get('/restaurant/:id', async (req, res) => {
  const orders = await Order.find({ restaurant: req.params.id }).sort('-createdAt');
  res.json(orders);
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, driverId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = status;
    if (driverId) order.driver = driverId;
    await order.save();

    // Notify customer/restaurant/driver via socket
    if (io) {
      io.to(`order_${order._id}`).emit('order_update', order);
      if (order.restaurant) io.to(`restaurant_${order.restaurant}`).emit('order_update', order);
      if (order.driver) io.to(`driver_${order.driver}`).emit('order_update', order);
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
