import mongoose from 'mongoose';
import dbConnect from '../config/db.js';

const CustomInquirySchema = new mongoose.Schema(
  {
    // Contact Info
    companyName:     { type: String, default: '', trim: true },
    fullName:        { type: String, required: true, trim: true },
    email:           { type: String, required: true, trim: true, lowercase: true },
    phone:           { type: String, required: true, trim: true },
    country:         { type: String, required: true, trim: true },
    companyWebsite:  { type: String, default: '', trim: true },

    // Selection lists from multi-select options
    interests:       [{ type: String, trim: true }],
    techniques:      [{ type: String, trim: true }],
    quantities:      [{ type: String, trim: true }],

    // Product description
    message:         { type: String, required: true, trim: true },

    // Reference images uploaded
    referenceImages: [{ type: String, trim: true }],

    // Admin workflow fields
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'closed'],
      default: 'new',
    },
    adminNotes:      { type: String, default: '' },
  },
  { timestamps: true, versionKey: false }
);

CustomInquirySchema.index({ createdAt: -1 });
CustomInquirySchema.index({ status: 1 });

const MongooseCustomInquiry =
  mongoose.models?.CustomInquiry || mongoose.model('CustomInquiry', CustomInquirySchema);

export class CustomInquiry {
  static async find(query = {}) {
    const conn = await dbConnect();
    if (conn) return MongooseCustomInquiry.find(query).sort({ createdAt: -1 }).lean().exec();
    return [];
  }
  static async findById(id) {
    const conn = await dbConnect();
    if (conn) return MongooseCustomInquiry.findById(id).lean().exec();
    return null;
  }
  static async create(data) {
    const conn = await dbConnect();
    if (conn) return MongooseCustomInquiry.create(data);
    return null;
  }
  static async findByIdAndUpdate(id, updateData) {
    const conn = await dbConnect();
    if (conn)
      return MongooseCustomInquiry.findByIdAndUpdate(id, { $set: updateData }, { new: true }).lean().exec();
    return null;
  }
  static async findByIdAndDelete(id) {
    const conn = await dbConnect();
    if (conn) return MongooseCustomInquiry.findByIdAndDelete(id).lean().exec();
    return null;
  }
  static async countDocuments(query = {}) {
    const conn = await dbConnect();
    if (conn) return MongooseCustomInquiry.countDocuments(query).exec();
    return 0;
  }
}
