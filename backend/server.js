// backend/server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Sequelize, DataTypes } = require('sequelize');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const port = 3001;

// Initialize SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

// Define Inventory model
const Inventory = sequelize.define('Inventory', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Ensure unique names for merging
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unit: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING
  },
  minStockLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Get all inventory items
app.get('/api/inventory', async (req, res) => {
  try {
    const items = await Inventory.findAll({
      order: [['name', 'ASC']] // Sort by name
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Add or update a single item
app.post('/api/inventory', async (req, res) => {
  try {
    const [item, created] = await Inventory.upsert(req.body, {
      returning: true,
      where: { name: req.body.name }
    });
    res.status(created ? 201 : 200).json(item);
  } catch (error) {
    console.error('Error creating/updating item:', error);
    res.status(500).json({ error: 'Failed to create/update item' });
  }
});

// Update an existing item
app.put('/api/inventory/:id', async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    await item.update(req.body);
    res.json(item);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete an item
app.delete('/api/inventory/:id', async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    await item.destroy();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Bulk import with merge functionality
app.post('/api/inventory/bulk-import', upload.single('file'), async (req, res) => {
  try {
    const items = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        const item = {
          name: row.name,
          description: row.description || '',
          price: parseFloat(row.price) || 0,
          quantity: parseInt(row.quantity) || 0,
          unit: row.unit || 'units',
          category: row.category || 'uncategorized',
          minStockLevel: parseInt(row.minStockLevel) || 0
        };
        items.push(item);
      })
      .on('end', async () => {
        try {
          // Process each item individually for upsert
          for (const item of items) {
            await Inventory.upsert(item, {
              where: { name: item.name }
            });
          }
          
          // Delete the temporary file
          fs.unlinkSync(req.file.path);
          
          // Return updated inventory
          const updatedInventory = await Inventory.findAll({
            order: [['name', 'ASC']]
          });
          
          res.json({
            message: `Successfully processed ${items.length} items`,
            inventory: updatedInventory
          });
        } catch (error) {
          console.error('Error processing items:', error);
          res.status(500).json({ error: 'Failed to process items' });
        }
      });
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).json({ error: 'Failed to process CSV file' });
  }
});

// Initialize database and start server
async function initializeServer() {
  try {
    // Sync database without forcing recreation
    await sequelize.sync();
    
    // Check if we need to seed initial data
    const count = await Inventory.count();
    if (count === 0) {
      // Load and execute seed file
      require('./seed');
    }
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to initialize server:', err);
  }
}

initializeServer();

module.exports = app;
