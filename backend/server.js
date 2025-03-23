// backend/server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001; // Fixed port to 3001

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Local storage for inventory
let inventoryData = [];
const dataPath = path.join(dataDir, 'inventory.json');
try {
  if (fs.existsSync(dataPath)) {
    inventoryData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } else {
    // Create empty inventory file if it doesn't exist
    fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
  }
} catch (error) {
  console.error('Error loading inventory data:', error);
}

// Save inventory data to file
const saveInventoryData = () => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(inventoryData, null, 2));
  } catch (error) {
    console.error('Error saving inventory data:', error);
  }
};

// Inventory routes
app.get('/api/inventory', (req, res) => {
  res.json(inventoryData);
});

app.post('/api/inventory', (req, res) => {
  const newItem = {
    _id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  inventoryData.push(newItem);
  saveInventoryData();
  res.status(201).json(newItem);
});

// Bulk import route
app.post('/api/inventory/bulk-import', (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid data format. Expected an array of items.' });
    }

    const newItems = items.map(item => ({
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...item,
      createdAt: new Date().toISOString()
    }));
    
    inventoryData = [...inventoryData, ...newItems];
    saveInventoryData();
    
    res.status(201).json({
      message: `Successfully imported ${newItems.length} items`,
      items: newItems
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ error: 'Failed to import items: ' + error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
