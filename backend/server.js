// backend/server.js
require('dotenv').config(); // Ensure .env contains MONGO_URI
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventory');

app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
