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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hadadi-eyes-optical';

async function verify() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const userCount = await User.countDocuments();
    const categoryCount = await Category.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const prescriptionCount = await Prescription.countDocuments();
    const appointmentCount = await Appointment.countDocuments();

    console.log('📊 Database Verification:');
    console.log('='.repeat(50));
    console.log(`   Users: ${userCount} (Expected: 100)`);
    console.log(`   Categories: ${categoryCount} (Expected: 100)`);
    console.log(`   Products: ${productCount} (Expected: 100)`);
    console.log(`   Orders: ${orderCount} (Expected: 100)`);
    console.log(`   Prescriptions: ${prescriptionCount} (Expected: 100)`);
    console.log(`   Appointments: ${appointmentCount} (Expected: 100)`);
    console.log('='.repeat(50));

    // Check user roles
    const adminCount = await User.countDocuments({ role: 'admin' });
    const staffCount = await User.countDocuments({ role: 'staff' });
    const customerCount = await User.countDocuments({ role: 'customer' });

    console.log('\n👤 User Breakdown:');
    console.log(`   Admins: ${adminCount}`);
    console.log(`   Staff: ${staffCount}`);
    console.log(`   Customers: ${customerCount}`);

    // Check order statuses
    const orderStatuses = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    console.log('\n🛒 Order Status Breakdown:');
    orderStatuses.forEach(status => {
      console.log(`   ${status._id}: ${status.count}`);
    });

    // Check appointment statuses
    const appointmentStatuses = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    console.log('\n📅 Appointment Status Breakdown:');
    appointmentStatuses.forEach(status => {
      console.log(`   ${status._id}: ${status.count}`);
    });

    // Verify relationships
    const ordersWithProducts = await Order.countDocuments({
      'items.0': { $exists: true }
    });
    const ordersWithPrescriptions = await Order.countDocuments({
      'items.prescription': { $exists: true, $ne: null }
    });
    const appointmentsWithOptometrists = await Appointment.countDocuments({
      optometrist: { $exists: true, $ne: null }
    });

    console.log('\n🔗 Relationship Verification:');
    console.log(`   Orders with items: ${ordersWithProducts}`);
    console.log(`   Orders with prescriptions: ${ordersWithPrescriptions}`);
    console.log(`   Appointments with optometrists: ${appointmentsWithOptometrists}`);

    const allCorrect = 
      userCount === 100 &&
      categoryCount === 100 &&
      productCount === 100 &&
      orderCount === 100 &&
      prescriptionCount === 100 &&
      appointmentCount === 100;

    if (allCorrect) {
      console.log('\n✅ All data verified successfully!');
    } else {
      console.log('\n⚠️  Some data counts do not match expected values.');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Verification error:', error);
    process.exit(1);
  }
}

verify();

