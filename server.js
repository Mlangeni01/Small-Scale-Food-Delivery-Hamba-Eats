// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const { initSocket } = require('./utils/socket');

const ordersRouter = require('./routes/orders');
const restaurantsRouter = require('./routes/restaurants');
const driversRouter = require('./routes/drivers');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/drivers', driversRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Initialize socket.io for realtime notifications
initSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
