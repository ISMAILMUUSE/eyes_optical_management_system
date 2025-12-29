import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Prescription from '../models/Prescription.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/prescriptions
// @desc    Get all prescriptions
// @access  Private
router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('customer').optional()
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    // Customers can only see their own prescriptions
    if (req.user.role === 'customer') {
      filter.customer = req.user.id;
    } else if (req.query.customer) {
      filter.customer = req.query.customer;
    }

    const prescriptions = await Prescription.find(filter)
      .populate('customer', 'name email phone')
      .sort({ examDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Prescription.countDocuments(filter);

    res.json({
      prescriptions,
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

// @route   GET /api/prescriptions/:id
// @desc    Get single prescription
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('customer', 'name email phone');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Check authorization
    if (req.user.role === 'customer' && prescription.customer._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(prescription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/prescriptions
// @desc    Create prescription
// @access  Private
router.post('/', protect, [
  body('eyeType').isIn(['distance', 'reading', 'bifocal', 'progressive', 'computer']),
  body('rightEye').optional().isObject(),
  body('leftEye').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const prescriptionData = {
      ...req.body,
      customer: req.user.role === 'customer' ? req.user.id : req.body.customer || req.user.id
    };

    const prescription = await Prescription.create(prescriptionData);
    await prescription.populate('customer', 'name email');

    res.status(201).json(prescription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/prescriptions/:id
// @desc    Update prescription
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Check authorization
    if (req.user.role === 'customer' && prescription.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(prescription, req.body);
    await prescription.save();

    await prescription.populate('customer', 'name email');

    res.json(prescription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

