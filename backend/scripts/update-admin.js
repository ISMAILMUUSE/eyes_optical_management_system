import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hadadi-eyes-optical';

async function updateAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Delete existing admin accounts
    console.log('🗑️  Deleting existing admin accounts...');
    const deleteResult = await User.deleteMany({ role: 'admin' });
    console.log(`✅ Deleted ${deleteResult.deletedCount} admin account(s)\n`);

    // Create new admin account
    console.log('👤 Creating new main admin account...');
    // Use plain password - it will be hashed by the pre-save hook
    const newAdmin = await User.create({
      name: 'eyesadmin',
      email: 'eyesadmin@hadadi.com',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'admin',
      phone: '+1234567890',
      isActive: true
    });

    console.log('✅ Created main admin account:');
    console.log(`   Name: ${newAdmin.name}`);
    console.log(`   Email: ${newAdmin.email}`);
    console.log(`   Password: admin123`);
    console.log(`   Role: ${newAdmin.role}\n`);

    console.log('✅ Admin account updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

updateAdmin();

