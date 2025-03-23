// backend/server.js
require('dotenv').config(); // Ensure .env contains MONGO_URI
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventory');
const orderRoutes = require('./routes/orders');
const { auth } = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// MongoDB Connection Configuration
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
  maxPoolSize: 10,
  connectTimeoutMS: 10000,
  retryWrites: true,
};

// MongoDB Connection with retry logic
const connectDB = async (retries = 5, interval = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, mongooseOptions);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (err) {
      console.error('MongoDB connection error:', err.message);
      
      if (i === retries - 1) {
        console.error('Max retries reached. Exiting...');
        process.exit(1);
      }
      
      console.log(`Retrying in ${interval/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  return false;
};

// Initial connection
connectDB().catch(console.error);

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
  // Attempt to reconnect
  setTimeout(() => {
    mongoose.connect(process.env.MONGO_URI, mongooseOptions).catch(console.error);
  }, 5000);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected. Attempting to reconnect...');
  setTimeout(() => {
    connectDB().catch(console.error);
  }, 5000);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', auth, inventoryRoutes);
app.use('/api/orders', auth, orderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    mongoConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    mongoReadyState: mongoose.connection.readyState
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  res.status(500).json({ error: 'Internal Server Error' });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't exit the process, just log the error
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('Received shutdown signal. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });

  // If server hasn't finished in 10 seconds, shut down process
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Handle various shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;


// gt.html

const fs = require('fs');
const csv = require('csv-parser');


const PORT = 3000;
const CSV_FILE = path.join(__dirname, 'grocery_list.csv');

app.use(express.json());
app.use(cors());

// Ensure CSV file has headers
if (!fs.existsSync(CSV_FILE)) {
    fs.writeFileSync(CSV_FILE, 'Item,Quantity,Price\n', 'utf8');
}

// Function to read CSV data
const readCSV = () => {
    return new Promise((resolve, reject) => {
        let results = [];
        fs.createReadStream(CSV_FILE)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (err) => reject(err));
    });
};

// Route to get all items
app.get('/items', async (req, res) => {
    try {
        let items = await readCSV();
        res.json(items);
    } catch (err) {
        res.status(500).send('Error reading CSV file');
    }
});

// Route to add or update an item
app.post('/add-item', async (req, res) => {
    const { item, quantity, price } = req.body;
    if (!item || !quantity || !price) {
        return res.status(400).send('Missing fields');
    }

    let items = await readCSV();
    let found = false;

    // Update quantity if item exists
    items = items.map((entry) => {
        if (entry.Item.toLowerCase() === item.toLowerCase()) {
            entry.Quantity = parseInt(entry.Quantity) + parseInt(quantity);
            entry.Price = price; // Update price
            found = true;
        }
        return entry;
    });

    // Add new item if not found
    if (!found) {
        items.push({ Item: item, Quantity: quantity, Price: price });
    }

    // Write back to CSV
    const csvContent = 'Item,Quantity,Price\n' + items.map(row => `${row.Item},${row.Quantity},${row.Price}`).join('\n');
    fs.writeFileSync(CSV_FILE, csvContent, 'utf8');

    res.send('Item added/updated successfully');
});

// Route to delete an item
app.delete('/delete-item', async (req, res) => {
    const { item } = req.body;
    if (!item) {
        return res.status(400).send('Item name required');
    }

    let items = await readCSV();
    items = items.filter(entry => entry.Item.toLowerCase() !== item.toLowerCase());

    const csvContent = 'Item,Quantity,Price\n' + items.map(row => `${row.Item},${row.Quantity},${row.Price}`).join('\n');
    fs.writeFileSync(CSV_FILE, csvContent, 'utf8');

    res.send('Item removed successfully');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// gt.html ends
