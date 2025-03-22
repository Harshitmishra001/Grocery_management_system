const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { isAdmin } = require('../middleware/auth');

// GET: Get all orders (admin) or user's orders
router.get('/', async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user._id };
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      orders,
      count: orders.length
    });
  } catch (error) {
    next(error);
  }
});

// POST: Create a new order
router.post('/', async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      status: 'pending'
    });

    await order.save();
    
    // Populate user and product details
    await order.populate('user', 'name email');
    await order.populate('items.product');

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    next(error);
  }
});

// GET: Get order by ID
router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    })
    .populate('user', 'name email')
    .populate('items.product');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
});

// PATCH: Update order status (admin only)
router.patch('/:id/status', isAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    next(error);
  }
});

// DELETE: Cancel order (if pending)
router.delete('/:id', async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: 'pending'
    });

    if (!order) {
      return res.status(404).json({ 
        error: 'Order not found or cannot be cancelled' 
      });
    }

    await order.remove();

    res.status(200).json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 