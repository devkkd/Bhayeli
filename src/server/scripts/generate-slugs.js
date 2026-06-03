import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

// ES module path resolver
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

console.log('──────────────────────────────────────────────────');
console.log('🌱   BHAYELI PRODUCT SLUG GENERATION UTILITY   🌱');
console.log('──────────────────────────────────────────────────');

// 1. Manually parse .env file
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
    console.log('⚠️  No .env file found at project root.');
  }
} catch (err) {
  console.error('❌ Failed to parse .env file:', err.message);
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is missing or empty!');
  process.exit(1);
}

// 2. Define Product Schema inside the script context
const AttributeSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  title:          { type: String, required: true, trim: true },
  slug:           { type: String, unique: true, sparse: true, trim: true },
  collectionSlug: { type: String, required: true, trim: true },
  image:          { type: String, required: true },
  gallery:        { type: [String], default: [] },
  moq:            { type: String, default: 'MOQ: 50 pcs' },
  description:    { type: String, default: '' },
  spotlight:      { type: String, default: '' },
  size:           { type: String, default: 'Free Size' },
  oemService:     { type: String, default: 'Available' },
  customization:  { type: String, default: 'Anything can be customize as per your requirement' },
  customizedLogo: { type: String, default: 'Min. order: 300 pieces' },
  customizedPackaging: { type: String, default: 'Min. order: 300 pieces' },
  attributes:     { type: [AttributeSchema], default: [] },
  technique:      { type: String, default: '' },
  createdAt:      { type: Date, default: Date.now },
});

const ProductModel = mongoose.models?.Product || mongoose.model('Product', ProductSchema);

const slugify = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

async function runMigration() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log('✅ Connected successfully to MongoDB.');

    console.log('🔎 Retrieving all products...');
    const products = await ProductModel.find({});
    console.log(`📦 Found ${products.length} products in database.`);

    let updatedCount = 0;
    const slugsUsed = new Set();

    for (let product of products) {
      let baseSlug = slugify(product.title);
      if (!baseSlug) baseSlug = 'product';

      let slug = baseSlug;
      let counter = 1;

      // Handle duplicate slugs in existing db list
      while (slugsUsed.has(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Check if we need to update it
      if (!product.slug || product.slug !== slug) {
        console.log(`⚙️ Generating slug for "${product.title}": ${product.slug || '(empty)'} ➔ ${slug}`);
        product.slug = slug;
        
        // Also set other figma fields default if they don't exist
        if (!product.size) product.size = 'Free Size';
        if (!product.oemService) product.oemService = 'Available';
        if (!product.customization) product.customization = 'Anything can be customize as per your requirement';
        if (!product.customizedLogo) product.customizedLogo = 'Min. order: 300 pieces';
        if (!product.customizedPackaging) product.customizedPackaging = 'Min. order: 300 pieces';
        
        await product.save();
        updatedCount++;
      }
      slugsUsed.add(slug);
    }

    console.log(`\n🎉 Migration Completed! Updated ${updatedCount} products with slugs and default Figma fields.`);

  } catch (error) {
    console.error('❌ Migration failed with error:', error);
  } finally {
    console.log('🔌 Disconnecting from database...');
    await mongoose.disconnect();
    console.log('👋 Migration utility finished.');
    console.log('──────────────────────────────────────────────────');
  }
}

runMigration();
