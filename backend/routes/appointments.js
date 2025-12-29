import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Appointment from '../models/Appointment.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/appointments
// @desc    Get all appointments
// @access  Private
router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional(),
  query('date').optional(),
  query('customer').optional()
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    // Customers can only see their own appointments
    if (req.user.role === 'customer') {
      filter.customer = req.user.id;
    } else if (req.query.customer) {
      filter.customer = req.query.customer;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.date) {
      const date = new Date(req.query.date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.appointmentDate = {
        $gte: date,
        $lt: nextDay
      };
    }

    const appointments = await Appointment.find(filter)
      .populate('customer', 'name email phone')
      .populate('optometrist', 'name email')
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments(filter);

    res.json({
      appointments,
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

// @route   GET /api/appointments/:id
// @desc    Get single appointment
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('optometrist', 'name email');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization
    if (req.user.role === 'customer' && appointment.customer._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/appointments
// @desc    Create appointment
// @access  Private
router.post('/', protect, [
  body('appointmentDate').isISO8601().withMessage('Valid date is required'),
  body('appointmentTime').notEmpty().withMessage('Time is required'),
  body('type').optional().isIn(['eye-exam', 'consultation', 'follow-up', 'fitting'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointmentData = {
      ...req.body,
      customer: req.user.role === 'customer' ? req.user.id : req.body.customer || req.user.id
    };

    // Check for conflicting appointments
    const conflicting = await Appointment.findOne({
      appointmentDate: new Date(req.body.appointmentDate),
      appointmentTime: req.body.appointmentTime,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (conflicting) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }

    const appointment = await Appointment.create(appointmentData);
    await appointment.populate('customer', 'name email phone');
    await appointment.populate('optometrist', 'name email');

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization
    if (req.user.role === 'customer' && appointment.customer.toString() !== req.user.id) {
      // Customers can only cancel their own appointments
      if (req.body.status && req.body.status !== 'cancelled') {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    Object.assign(appointment, req.body);
    await appointment.save();

    await appointment.populate('customer', 'name email phone');
    await appointment.populate('optometrist', 'name email');

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

