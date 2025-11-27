// routes/restaurants.js
const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// Create restaurant (admin)
router.post('/', async (req, res) => {
  const rest = new Restaurant(req.body);
  await rest.save();
  res.json(rest);
});

// List restaurants
router.get('/', async (req, res) => {
  const list = await Restaurant.find();
  res.json(list);
});

// Get one restaurant
router.get('/:id', async (req, res) => {
  const r = await Restaurant.findById(req.params.id);
  res.json(r);
});

// Update menu or details
router.patch('/:id', async (req, res) => {
  const r = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(r);
});

module.exports = router;
