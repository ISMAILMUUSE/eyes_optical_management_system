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

async function checkAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin exists
    const adminEmail = 'eyesadmin@hadadi.com';
    const admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      console.log('❌ Admin account not found!');
      console.log(`   Looking for: ${adminEmail}\n`);
      
      // List all admins
      const allAdmins = await User.find({ role: 'admin' });
      console.log(`Found ${allAdmins.length} admin account(s):`);
      allAdmins.forEach(a => {
        console.log(`   - ${a.email} (${a.name})`);
      });
      
      console.log('\n💡 Run: npm run update-admin to create the admin account');
    } else {
      console.log('✅ Admin account found:');
      console.log(`   Name: ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Active: ${admin.isActive}\n`);
      
      // Test password
      const testPassword = 'admin123';
      const passwordMatch = await bcrypt.compare(testPassword, admin.password);
      
      if (passwordMatch) {
        console.log('✅ Password is correct!');
        console.log(`   You can login with:`);
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: ${testPassword}`);
      } else {
        console.log('❌ Password does not match!');
        console.log('   Updating password...');
        
        admin.password = testPassword; // Will be hashed by pre-save hook
        await admin.save();
        console.log('✅ Password updated successfully!');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

checkAdmin();

