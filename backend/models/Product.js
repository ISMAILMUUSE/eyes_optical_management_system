import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    unique: true,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  comparePrice: {
    type: Number,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  brand: {
    type: String,
    trim: true
  },
  frameType: {
    type: String,
    enum: ['full-rim', 'semi-rimless', 'rimless', 'sports', 'kids'],
    required: true
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'unisex', 'kids'],
    default: 'unisex'
  },
  material: {
    type: String
  },
  color: {
    type: String
  },
  images: [{
    type: String
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  specifications: {
    lensWidth: Number,
    bridgeWidth: Number,
    templeLength: Number
  }
}, {
  timestamps: true
});

// Index for search
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

export default mongoose.model('Product', productSchema);

