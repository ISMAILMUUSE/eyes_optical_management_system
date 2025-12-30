import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/analytics/overview
// @desc    Get dashboard overview stats
// @access  Private (Admin/Staff)
router.get('/overview', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Total sales
    const totalSalesResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalSales = totalSalesResult[0]?.total || 0;

    // Orders today
    const ordersToday = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
      status: { $ne: 'cancelled' }
    });

    // Active customers
    const activeCustomers = await User.countDocuments({
      role: 'customer',
      isActive: true
    });

    // Low stock products
    const lowStockProducts = await Product.countDocuments({
      stock: { $lte: { $ifNull: ['$lowStockThreshold', 10] } },
      isActive: true
    });

    // Upcoming appointments (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingAppointments = await Appointment.countDocuments({
      appointmentDate: { $gte: today, $lte: nextWeek },
      status: { $in: ['scheduled', 'confirmed'] }
    });

    res.json({
      totalSales,
      ordersToday,
      activeCustomers,
      lowStockProducts,
      upcomingAppointments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/sales
// @desc    Get sales chart data
// @access  Private (Admin/Staff)
router.get('/sales', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json(salesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/products
// @desc    Get best-selling products
// @access  Private (Admin/Staff)
router.get('/products', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const bestSelling = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          product: {
            _id: '$product._id',
            name: '$product.name',
            images: '$product.images'
          },
          totalSold: 1,
          revenue: 1
        }
      }
    ]);

    res.json(bestSelling);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/categories
// @desc    Get category performance
// @access  Private (Admin/Staff)
router.get('/categories', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const categoryData = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category._id',
          categoryName: { $first: '$category.name' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          unitsSold: { $sum: '$items.quantity' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json(categoryData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/orders
// @desc    Get order status breakdown
// @access  Private (Admin/Staff)
router.get('/orders', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const orderStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(orderStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/customers
// @desc    Get customer growth and repeat rate
// @access  Private (Admin/Staff)
router.get('/customers', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    // Customer growth
    const customerGrowth = await User.aggregate([
      {
        $match: {
          role: 'customer',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Repeat customer rate
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const customersWithMultipleOrders = await Order.aggregate([
      {
        $group: {
          _id: '$customer',
          orderCount: { $sum: 1 }
        }
      },
      {
        $match: {
          orderCount: { $gt: 1 }
        }
      },
      {
        $count: 'repeatCustomers'
      }
    ]);

    const repeatCustomerRate = totalCustomers > 0
      ? ((customersWithMultipleOrders[0]?.repeatCustomers || 0) / totalCustomers * 100).toFixed(2)
      : 0;

    res.json({
      customerGrowth,
      repeatCustomerRate: parseFloat(repeatCustomerRate),
      totalCustomers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

