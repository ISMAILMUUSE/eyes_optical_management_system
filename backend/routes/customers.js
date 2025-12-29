import express from 'express';
import { query } from 'express-validator';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/customers
// @desc    Get all customers
// @access  Private (Admin/Staff)
router.get('/', protect, authorize('admin', 'staff'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional()
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { role: 'customer' };

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const customers = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/customers/:id
// @desc    Get single customer with stats
// @access  Private (Admin/Staff)
router.get('/:id', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');

    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Get customer stats
    const totalOrders = await Order.countDocuments({ customer: customer._id });
    const totalSpent = await Order.aggregate([
      { $match: { customer: customer._id, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.json({
      customer,
      stats: {
        totalOrders,
        totalSpent: totalSpent[0]?.total || 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

