// backend/models/Inventory.js
const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Item name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: { 
    type: Number, 
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  threshold: { 
    type: Number, 
    required: [true, 'Threshold is required'],
    min: [0, 'Threshold cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true,
    default: 'pieces'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
InventorySchema.index({ name: 1, createdBy: 1 }, { unique: true });

// Virtual for checking if item is below threshold
InventorySchema.virtual('belowThreshold').get(function() {
  return this.quantity <= this.threshold;
});

// Method to update quantity
InventorySchema.methods.updateQuantity = async function(amount) {
  const newQuantity = this.quantity + amount;
  if (newQuantity < 0) {
    throw new Error('Cannot reduce quantity below 0');
  }
  this.quantity = newQuantity;
  return this.save();
};

module.exports = mongoose.model('Inventory', InventorySchema);
