import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Prescription from '../models/Prescription.js';
import Appointment from '../models/Appointment.js';

// Import seed data
import { categories } from './seedData/categories.js';
import { generateUsers } from './seedData/users.js';
import { generateProducts } from './seedData/products.js';
import { generatePrescriptions } from './seedData/prescriptions.js';
import { generateAppointments } from './seedData/appointments.js';
import { generateOrders } from './seedData/orders.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hadadi-eyes-optical';

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Prescription.deleteMany({});
    await Appointment.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create Categories (100)
    console.log('\n📁 Creating 100 categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create Users (100)
    console.log('\n👤 Creating 100 users...');
    const usersData = await generateUsers();
    const createdUsers = await User.insertMany(usersData);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Separate users by role
    const adminUsers = createdUsers.filter(u => u.role === 'admin');
    const staffUsers = createdUsers.filter(u => u.role === 'staff');
    const customerUsers = createdUsers.filter(u => u.role === 'customer');
    console.log(`   - ${adminUsers.length} admin (main: eyesadmin)`);
    console.log(`   - ${staffUsers.length} staff`);
    console.log(`   - ${customerUsers.length} customers`);

    // Create Products (100)
    console.log('\n👓 Creating 100 products...');
    const categoryIds = createdCategories.map(c => c._id);
    const productsData = generateProducts(categoryIds);
    const createdProducts = await Product.insertMany(productsData);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create Prescriptions (100)
    console.log('\n📋 Creating 100 prescriptions...');
    const customerIds = customerUsers.map(u => u._id);
    const prescriptionsData = generatePrescriptions(customerIds);
    const createdPrescriptions = await Prescription.insertMany(prescriptionsData);
    console.log(`✅ Created ${createdPrescriptions.length} prescriptions`);

    // Create Appointments (100)
    console.log('\n📅 Creating 100 appointments...');
    const staffIds = staffUsers.map(u => u._id);
    const appointmentsData = generateAppointments(customerIds, staffIds);
    const createdAppointments = await Appointment.insertMany(appointmentsData);
    console.log(`✅ Created ${createdAppointments.length} appointments`);

    // Create Orders (100)
    console.log('\n🛒 Creating 100 orders...');
    const productIds = createdProducts.map(p => p._id);
    const prescriptionIds = createdPrescriptions.map(p => p._id);
    const ordersData = generateOrders(customerIds, productIds, prescriptionIds);
    
    // Insert orders without timestamps first, then update
    const createdOrders = await Order.insertMany(ordersData, { ordered: false });
    console.log(`✅ Created ${createdOrders.length} orders`);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log('\n📊 Database Summary:');
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Products: ${createdProducts.length}`);
    console.log(`   Prescriptions: ${createdPrescriptions.length}`);
    console.log(`   Appointments: ${createdAppointments.length}`);
    console.log(`   Orders: ${createdOrders.length}`);
    console.log('\n🔑 Sample Login Credentials:');
    console.log('   Admin: eyesadmin@hadadi.com / admin123');
    console.log('   Staff: staff@hadadi.com / staff123');
    console.log('   Customer: customer@example.com / customer123');
    console.log('\n💡 Note: All users use the same password pattern:');
    console.log('   - Admins: admin123');
    console.log('   - Staff: staff123');
    console.log('   - Customers: customer123');
    console.log('='.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding error:', error);
    if (error.errors) {
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
    }
    process.exit(1);
  }
}

seed();
