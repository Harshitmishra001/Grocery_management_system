// backend/routes/inventory.js
const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const { isAdmin } = require('../middleware/auth');

// GET: Retrieve all inventory items
router.get('/', async (req, res, next) => {
  try {
    const inventory = await Inventory.find({ createdBy: req.user._id })
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ 
      inventory,
      count: inventory.length
    });
  } catch (error) {
    next(error);
  }
});

// GET: Get low stock items
router.get('/low-stock', async (req, res, next) => {
  try {
    const inventory = await Inventory.find({
      createdBy: req.user._id,
      $expr: { $lte: ['$quantity', '$threshold'] }
    });
    
    res.status(200).json({ 
      inventory,
      count: inventory.length
    });
  } catch (error) {
    next(error);
  }
});

// POST: Add a new inventory item
router.post('/', async (req, res, next) => {
  try {
    const { name, description, quantity, threshold, unit, category, price } = req.body;

    // Log the received data
    console.log('Received inventory data:', req.body);

    // Check for existing item
    const existingItem = await Inventory.findOne({ 
      name: name?.trim(),
      createdBy: req.user._id 
    });

    if (existingItem) {
      return res.status(400).json({ error: 'Item already exists' });
    }

    // Create new item with all required fields
    const newItem = new Inventory({
      name: name?.trim(),
      description: description?.trim(),
      quantity: Number(quantity) || 0,
      threshold: Number(threshold) || 0,
      unit: unit?.trim(),
      category: category?.trim(),
      price: Number(price) || 0,
      createdBy: req.user._id,
      lastModifiedBy: req.user._id
    });

    // Log the item being saved
    console.log('Saving inventory item:', newItem);

    await newItem.save();
    
    await newItem.populate('createdBy', 'name email');
    await newItem.populate('lastModifiedBy', 'name email');

    // Log the saved item
    console.log('Successfully saved item:', newItem);

    res.status(201).json({ 
      message: 'Item added successfully',
      item: newItem
    });
  } catch (error) {
    console.error('Error adding inventory item:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    next(error);
  }
});

// PUT: Update an inventory item
router.put('/:id', async (req, res, next) => {
  try {
    const { quantity, threshold, unit, category } = req.body;
    const itemId = req.params.id;

    const item = await Inventory.findOne({ 
      _id: itemId,
      createdBy: req.user._id
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Update fields if provided
    if (quantity !== undefined) item.quantity = quantity;
    if (threshold !== undefined) item.threshold = threshold;
    if (unit) item.unit = unit;
    if (category) item.category = category;
    
    item.lastModifiedBy = req.user._id;

    await item.save();
    
    await item.populate('createdBy', 'name email');
    await item.populate('lastModifiedBy', 'name email');

    res.status(200).json({ 
      message: 'Item updated successfully',
      item
    });
  } catch (error) {
    next(error);
  }
});

// PATCH: Update quantity
router.patch('/:id/quantity', async (req, res, next) => {
  try {
    const { adjustment } = req.body;
    const itemId = req.params.id;

    const item = await Inventory.findOne({ 
      _id: itemId,
      createdBy: req.user._id
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await item.updateQuantity(adjustment);
    item.lastModifiedBy = req.user._id;
    await item.save();

    await item.populate('createdBy', 'name email');
    await item.populate('lastModifiedBy', 'name email');

    res.status(200).json({ 
      message: 'Quantity updated successfully',
      item
    });
  } catch (error) {
    next(error);
  }
});

// DELETE: Remove an inventory item (Admin only)
router.delete('/:id', isAdmin, async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const item = await Inventory.findOneAndDelete({ 
      _id: itemId,
      createdBy: req.user._id
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json({ 
      message: 'Item deleted successfully',
      item
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
