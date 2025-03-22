// backend/routes/inventory.js
const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// GET: Retrieve all inventory items
router.get('/', async (req, res, next) => {
  try {
    const inventory = await Inventory.find({});
    res.status(200).json({ inventory });
  } catch (error) {
    next(error);
  }
});

// POST: Add a new inventory item
router.post('/', async (req, res, next) => {
  try {
    const { name, quantity, threshold } = req.body;
    if (!name || quantity === undefined || threshold === undefined) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
    const newItem = new Inventory({ name, quantity, threshold });
    await newItem.save();
    res.status(201).json({ message: 'Item added', item: newItem });
  } catch (error) {
    next(error);
  }
});

// PUT: Update an inventory item (e.g., after meal preparation)
router.put('/:id', async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const { quantity } = req.body;
    const updatedItem = await Inventory.findByIdAndUpdate(
      itemId,
      { quantity },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Inventory updated', item: updatedItem });
  } catch (error) {
    next(error);
  }
});

// DELETE: Remove an inventory item
router.delete('/:id', async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const removedItem = await Inventory.findByIdAndRemove(itemId);
    if (!removedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item removed', item: removedItem });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
