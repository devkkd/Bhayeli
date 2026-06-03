import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { hashPassword } from '../utils/auth.js';

// Setup ES module filename resolver equivalents
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

console.log('──────────────────────────────────────────────────');
console.log('🌱   BHAYELI MASTER ADMIN SEEDING UTILITY   🌱');
console.log('──────────────────────────────────────────────────');

// 1. Manually parse .env file to extract MONGODB_URI securely without dotenv dependency
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) return;
      const index = trimmedLine.indexOf('=');
      if (index !== -1) {
        const key = trimmedLine.substring(0, index).trim();
        let value = trimmedLine.substring(index + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    });
    console.log('✅ Environment variables loaded from .env');
  } else {
    console.log('⚠️  No .env file found at project root. Using system environment.');
  }
} catch (err) {
  console.error('❌ Failed to parse .env file:', err.message);
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is missing or empty!');
  console.log('   Please make sure MONGODB_URI is specified in your .env file.');
  console.log('──────────────────────────────────────────────────');
  process.exit(1);
}

// 2. Define Admin Schema inside the script context to prevent import path/Next.js transpiler issues
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const AdminModel = mongoose.models?.Admin || mongoose.model('Admin', AdminSchema);

async function runSeed() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log('✅ Connected successfully to MongoDB via Mongoose.');

    const adminUsername = 'admin';
    const adminPassword = 'bhayeliAdmin123';

    console.log(`🔎 Checking for existing admin account with username "${adminUsername}"...`);
    const existingAdmin = await AdminModel.findOne({ username: adminUsername });

    if (existingAdmin) {
      console.log(`⚠️  Admin "${adminUsername}" already exists!`);
      console.log('🔄 Re-seeding / Updating password to ensure standard credentials are reset...');
      
      const newHashedPassword = hashPassword(adminPassword);
      existingAdmin.password = newHashedPassword;
      await existingAdmin.save();
      
      console.log('✨ Admin account password updated successfully!');
    } else {
      console.log(`🚀 Creating new master admin: "${adminUsername}"`);
      const hashedPassword = hashPassword(adminPassword);
      
      await AdminModel.create({
        username: adminUsername,
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('✨ Master Admin created successfully!');
    }

    console.log('\n🌟 Seeding Completed! Credentials details:');
    console.log(`   👉 Username: ${adminUsername}`);
    console.log(`   👉 Password: ${adminPassword}`);
    console.log('   Please make sure to change your password in production.');

  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
  } finally {
    console.log('🔌 Disconnecting from database...');
    await mongoose.disconnect();
    console.log('👋 Seeder finished.');
    console.log('──────────────────────────────────────────────────');
  }
}

runSeed();
