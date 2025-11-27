// routes/drivers.js
const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const Order = require('../models/Order');
const { io } = require('../utils/socket');

// List drivers
router.get('/', async (req, res) => {
  res.json(await Driver.find());
});

// Driver picks available order (simple manual assign)
router.post('/:id/assign/:orderId', async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  const order = await Order.findById(req.params.orderId);
  if (!driver || !order) return res.status(404).json({ error: 'Not found' });
  order.driver = driver._id;
  order.status = 'picked';
  await order.save();
  driver.currentOrder = order._id;
  await driver.save();

  // notify via socket
  if (io) {
    io.to(`driver_${driver._id}`).emit('assigned_order', order);
    io.to(`restaurant_${order.restaurant}`).emit('order_update', order);
  }

  res.json({ success: true, order });
});

module.exports = router;
