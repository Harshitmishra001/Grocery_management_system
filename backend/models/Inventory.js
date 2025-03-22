// backend/models/Inventory.js
const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  threshold: { type: Number, required: true }
});

module.exports = mongoose.model('Inventory', InventorySchema);
