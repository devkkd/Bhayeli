import mongoose from 'mongoose';
import dbConnect from '../config/db.js';

const InquiryItemSchema = new mongoose.Schema(
  {
    productId:    { type: String, required: true },
    productTitle: { type: String, required: true },
    productImage: { type: String, default: '' },
    moq:          { type: String, default: '' },
    quantity:     { type: Number, default: 1 },
  },
  { _id: false }
);

const InquirySchema = new mongoose.Schema(
  {
    // Contact info
    companyName:     { type: String, required: true, trim: true },
    fullName:        { type: String, required: true, trim: true },
    email:           { type: String, required: true, trim: true, lowercase: true },
    phone:           { type: String, required: true, trim: true },
    country:         { type: String, required: true, trim: true },
    companyWebsite:  { type: String, default: '', trim: true },

    // Inquiry type
    inquiryType: {
      type: String,
      enum: ['Product Related', 'Custom Order', 'Feedback', 'Complain'],
      default: 'Product Related',
    },

    // Message
    message: { type: String, default: '' },

    // Products in cart
    items: { type: [InquiryItemSchema], default: [] },

    // Admin status
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'closed'],
      default: 'new',
    },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true, versionKey: false }
);

InquirySchema.index({ createdAt: -1 });
InquirySchema.index({ status: 1 });

const MongooseInquiry =
  mongoose.models?.Inquiry || mongoose.model('Inquiry', InquirySchema);

export class Inquiry {
  static async find(query = {}) {
    const conn = await dbConnect();
    if (conn) return MongooseInquiry.find(query).sort({ createdAt: -1 }).lean().exec();
    return [];
  }
  static async findById(id) {
    const conn = await dbConnect();
    if (conn) return MongooseInquiry.findById(id).lean().exec();
    return null;
  }
  static async create(data) {
    const conn = await dbConnect();
    if (conn) return MongooseInquiry.create(data);
    return null;
  }
  static async findByIdAndUpdate(id, updateData) {
    const conn = await dbConnect();
    if (conn)
      return MongooseInquiry.findByIdAndUpdate(id, { $set: updateData }, { new: true }).lean().exec();
    return null;
  }
  static async findByIdAndDelete(id) {
    const conn = await dbConnect();
    if (conn) return MongooseInquiry.findByIdAndDelete(id).lean().exec();
    return null;
  }
  static async countDocuments(query = {}) {
    const conn = await dbConnect();
    if (conn) return MongooseInquiry.countDocuments(query).exec();
    return 0;
  }
}
