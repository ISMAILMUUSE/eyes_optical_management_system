import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');
const envContent = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/hadadi-eyes-optical
JWT_SECRET=hadadi-eyes-optical-super-secret-jwt-key-change-in-production-2024
JWT_EXPIRE=30d
NODE_ENV=development
`;

try {
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✅ .env file created successfully!');
    console.log('📝 File location:', envPath);
  } else {
    console.log('⚠️  .env file already exists');
    console.log('📝 File location:', envPath);
  }
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  process.exit(1);
}

