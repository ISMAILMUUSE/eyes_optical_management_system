import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eyeType: {
    type: String,
    enum: ['distance', 'reading', 'bifocal', 'progressive', 'computer'],
    required: true
  },
  rightEye: {
    sphere: Number,
    cylinder: Number,
    axis: Number,
    add: Number,
    pd: Number // Pupillary Distance
  },
  leftEye: {
    sphere: Number,
    cylinder: Number,
    axis: Number,
    add: Number,
    pd: Number
  },
  optometrist: {
    type: String
  },
  examDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  notes: {
    type: String
  },
  prescriptionImage: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Prescription', prescriptionSchema);

