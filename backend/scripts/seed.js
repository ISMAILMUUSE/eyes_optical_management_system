import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Prescription from '../models/Prescription.js';
import Appointment from '../models/Appointment.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hadadi-eyes-optical';

const categories = [
  { name: 'Eyeglasses', description: 'Prescription and fashion eyeglasses' },
  { name: 'Sunglasses', description: 'UV protection sunglasses' },
  { name: 'Contact Lenses', description: 'Daily and monthly contact lenses' },
  { name: 'Reading Glasses', description: 'Ready-made reading glasses' },
  { name: 'Computer Glasses', description: 'Blue light filtering glasses' }
];

const products = [
  {
    name: 'Classic Black Frames',
    description: 'Timeless black full-rim frames perfect for any occasion',
    price: 129.99,
    category: null, // Will be set after categories are created
    brand: 'Hadadi',
    frameType: 'full-rim',
    gender: 'unisex',
    material: 'Acetate',
    color: 'Black',
    images: ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500'],
    stock: 45,
    isFeatured: true
  },
  {
    name: 'Tortoise Shell Frames',
    description: 'Vintage-inspired tortoise shell frames',
    price: 149.99,
    category: null,
    brand: 'Hadadi',
    frameType: 'full-rim',
    gender: 'women',
    material: 'Acetate',
    color: 'Tortoise',
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500'],
    stock: 32,
    isFeatured: true
  },
  {
    name: 'Sleek Metal Frames',
    description: 'Lightweight metal frames with modern design',
    price: 179.99,
    category: null,
    brand: 'Hadadi',
    frameType: 'semi-rimless',
    gender: 'men',
    material: 'Titanium',
    color: 'Silver',
    images: ['https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500'],
    stock: 28,
    isFeatured: false
  },
  {
    name: 'Rimless Designer Frames',
    description: 'Ultra-light rimless frames for minimal look',
    price: 199.99,
    category: null,
    brand: 'Hadadi',
    frameType: 'rimless',
    gender: 'unisex',
    material: 'Titanium',
    color: 'Gold',
    images: ['https://images.unsplash.com/photo-1556306535-38febf6782e7?w=500'],
    stock: 15,
    isFeatured: false
  },
  {
    name: 'Sport Performance Frames',
    description: 'Durable frames designed for active lifestyle',
    price: 159.99,
    category: null,
    brand: 'Hadadi',
    frameType: 'sports',
    gender: 'unisex',
    material: 'Polycarbonate',
    color: 'Black/Red',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'],
    stock: 22,
    isFeatured: true
  },
  {
    name: 'Kids Colorful Frames',
    description: 'Fun and durable frames for children',
    price: 89.99,
    category: null,
    brand: 'Hadadi',
    frameType: 'kids',
    gender: 'kids',
    material: 'TR-90',
    color: 'Blue',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'],
    stock: 38,
    isFeatured: false
  },
  {
    name: 'Aviator Sunglasses',
    description: 'Classic aviator style with UV400 protection',
    price: 119.99,
    category: null,
    brand: 'Hadadi',
    frameType: 'full-rim',
    gender: 'unisex',
    material: 'Metal',
    color: 'Gold',
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500'],
    stock: 50,
    isFeatured: true
  },
  {
    name: 'Cat-Eye Sunglasses',
    description: 'Fashion-forward cat-eye sunglasses',
    price: 139.99,
    category: null,
    brand: 'Hadadi',
    frameType: 'full-rim',
    gender: 'women',
    material: 'Acetate',
    color: 'Black',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'],
    stock: 41,
    isFeatured: false
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Prescription.deleteMany({});
    await Appointment.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@hadadi.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1234567890'
    });
    console.log('👤 Created admin user');

    // Create staff user
    const staff = await User.create({
      name: 'Staff User',
      email: 'staff@hadadi.com',
      password: 'staff123',
      role: 'staff',
      phone: '+1234567891'
    });
    console.log('👤 Created staff user');

    // Create customer users
    const customer1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'customer123',
      role: 'customer',
      phone: '+1234567892',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      }
    });

    const customer2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'customer123',
      role: 'customer',
      phone: '+1234567893',
      address: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001'
      }
    });
    console.log('👤 Created customer users');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('📁 Created categories');

    // Create products
    const eyeglassesCategory = createdCategories.find(c => c.name === 'Eyeglasses');
    const sunglassesCategory = createdCategories.find(c => c.name === 'Sunglasses');

    const productsToCreate = products.map((product, index) => {
      if (index < 6) {
        product.category = eyeglassesCategory._id;
      } else {
        product.category = sunglassesCategory._id;
      }
      return product;
    });

    const createdProducts = await Product.insertMany(productsToCreate);
    console.log('👓 Created products');

    // Create prescriptions
    const prescription1 = await Prescription.create({
      customer: customer1._id,
      eyeType: 'distance',
      rightEye: {
        sphere: -2.5,
        cylinder: -0.5,
        axis: 180,
        pd: 64
      },
      leftEye: {
        sphere: -2.25,
        cylinder: -0.75,
        axis: 10,
        pd: 64
      },
      optometrist: 'Dr. Sarah Johnson',
      examDate: new Date('2024-01-15'),
      expiryDate: new Date('2026-01-15')
    });

    const prescription2 = await Prescription.create({
      customer: customer2._id,
      eyeType: 'progressive',
      rightEye: {
        sphere: +1.5,
        cylinder: -0.25,
        axis: 90,
        add: +2.0,
        pd: 62
      },
      leftEye: {
        sphere: +1.75,
        cylinder: -0.5,
        axis: 85,
        add: +2.0,
        pd: 62
      },
      optometrist: 'Dr. Michael Chen',
      examDate: new Date('2024-02-20'),
      expiryDate: new Date('2026-02-20')
    });
    console.log('📋 Created prescriptions');

    // Create orders
    const order1 = await Order.create({
      customer: customer1._id,
      items: [
        {
          product: createdProducts[0]._id,
          quantity: 1,
          price: createdProducts[0].price,
          prescription: prescription1._id
        }
      ],
      subtotal: createdProducts[0].price,
      tax: createdProducts[0].price * 0.1,
      shipping: 15,
      total: createdProducts[0].price * 1.1 + 15,
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'card'
    });

    const order2 = await Order.create({
      customer: customer2._id,
      items: [
        {
          product: createdProducts[1]._id,
          quantity: 1,
          price: createdProducts[1].price,
          prescription: prescription2._id
        },
        {
          product: createdProducts[6]._id,
          quantity: 1,
          price: createdProducts[6].price
        }
      ],
      subtotal: createdProducts[1].price + createdProducts[6].price,
      tax: (createdProducts[1].price + createdProducts[6].price) * 0.1,
      shipping: 15,
      total: (createdProducts[1].price + createdProducts[6].price) * 1.1 + 15,
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: 'online'
    });
    console.log('🛒 Created orders');

    // Create appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await Appointment.create({
      customer: customer1._id,
      appointmentDate: tomorrow,
      appointmentTime: '10:00',
      type: 'eye-exam',
      status: 'confirmed',
      optometrist: staff._id
    });

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    await Appointment.create({
      customer: customer2._id,
      appointmentDate: nextWeek,
      appointmentTime: '14:30',
      type: 'follow-up',
      status: 'scheduled'
    });
    console.log('📅 Created appointments');

    console.log('\n✅ Seeding completed successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Admin: admin@hadadi.com / admin123');
    console.log('   Staff: staff@hadadi.com / staff123');
    console.log('   Customer: john@example.com / customer123');
    console.log('   Customer: jane@example.com / customer123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();

