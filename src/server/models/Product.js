import mongoose from 'mongoose';
import dbConnect from '../config/db.js';
import { MockProduct } from './mockDb.js';

// ── Sub-schema: extra overflow attributes (label/value pairs) ──────────────
const AttributeSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

// ── Main Product Schema ────────────────────────────────────────────────────
const ProductSchema = new mongoose.Schema(
  {
    // Core
    title:               { type: String, required: true, trim: true },
    slug:                { type: String, trim: true, default: '' },
    categorySlug:        { type: String, required: true, trim: true },
    technique:           { type: String, default: '' },

    // Images
    image:               { type: String, required: true },
    gallery:             { type: [String], default: [] },

    // MOQ
    moq:                 { type: String, default: 'MOQ: 50 pcs' },

    // Product Description block
    description:         { type: String, default: '' },
    size:                { type: String, default: '' },
    oemService:          { type: String, default: '' },
    customization:       { type: String, default: '' },
    customizedLogo:      { type: String, default: '' },
    customizedPackaging: { type: String, default: '' },

    // Product Spotlights
    spotlight:           { type: String, default: '' },

    // ── Key Attributes (all optional) ─────────────────────
    // Left column
    material:            { type: String, default: '' },
    weavingMethod:       { type: String, default: '' },
    feature:             { type: String, default: '' },
    style:               { type: String, default: '' },
    itemType:            { type: String, default: '' },
    sleeveStyle:         { type: String, default: '' },
    patternType:         { type: String, default: '' },
    season:              { type: String, default: '' },
    thickness:           { type: String, default: '' },
    liningMaterial:      { type: String, default: '' },
    shellMaterial:       { type: String, default: '' },
    fillingMaterial:     { type: String, default: '' },
    fabricType:          { type: String, default: '' },
    customizationAttr:   { type: String, default: '' },

    // Right column
    technics:            { type: String, default: '' },
    supplyType:          { type: String, default: '' },
    support:             { type: String, default: '' },
    seamlessFusing:      { type: String, default: '' },
    modelNumber:         { type: String, default: '' },
    processingType:      { type: String, default: '' },
    placeOfOrigin:       { type: String, default: '' },
    brandName:           { type: String, default: 'BHAYELI' },
    clothingLength:      { type: String, default: '' },
    oemOdm:              { type: String, default: '' },
    materialRight:       { type: String, default: '' },
    deliveryTime:        { type: String, default: '' },
    quality:             { type: String, default: '' },

    // Extra custom key-value pairs (overflow / product-specific)
    attributes:          { type: [AttributeSchema], default: [] },
  },
  {
    timestamps: true,   // adds createdAt + updatedAt automatically
    versionKey: false,  // removes __v field
  }
);

// Indexes for common query patterns
ProductSchema.index({ categorySlug: 1, createdAt: -1 });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ title: 'text', technique: 'text' });

// Prevent OverwriteModelError on Next.js hot-reload
const MongooseProduct =
  mongoose.models?.Product || mongoose.model('Product', ProductSchema);

// ── Data-access wrapper (MongoDB ↔ MockDB) ─────────────────────────────────
export class Product {
  static async find(query = {}) {
    const conn = await dbConnect();
    if (conn) return MongooseProduct.find(query).sort({ createdAt: -1 }).lean().exec();
    return MockProduct.find(query);
  }

  static async findOne(query = {}) {
    const conn = await dbConnect();
    if (conn) return MongooseProduct.findOne(query).lean().exec();
    return MockProduct.findOne(query);
  }

  static async findById(id) {
    const conn = await dbConnect();
    if (conn) return MongooseProduct.findById(id).lean().exec();
    return MockProduct.findById(id);
  }

  static async create(data) {
    const conn = await dbConnect();
    if (conn) return MongooseProduct.create(data);
    return MockProduct.create(data);
  }

  static async findByIdAndUpdate(id, updateData) {
    const conn = await dbConnect();
    if (conn)
      return MongooseProduct.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).lean().exec();
    return MockProduct.findByIdAndUpdate(id, updateData);
  }

  static async findByIdAndDelete(id) {
    const conn = await dbConnect();
    if (conn) return MongooseProduct.findByIdAndDelete(id).lean().exec();
    return MockProduct.findByIdAndDelete(id);
  }

  static async countDocuments(query = {}) {
    const conn = await dbConnect();
    if (conn) return MongooseProduct.countDocuments(query).exec();
    const results = await MockProduct.find(query);
    return results.length;
  }
}
