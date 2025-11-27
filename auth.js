// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register (simple version for restaurants/drivers)
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;
    const hashed = password ? await bcrypt.hash(password, 10) : undefined;
    const user = new User({ name, phone, password: hashed, role });
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (user.password) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
