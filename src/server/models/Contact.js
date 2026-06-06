import mongoose from 'mongoose';
import dbConnect from '../config/db.js';

const ContactSchema = new mongoose.Schema(
  {
    // Contact info
    companyName:     { type: String, default: '', trim: true },
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
    message: { type: String, required: true, trim: true },

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

ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ status: 1 });

const MongooseContact =
  mongoose.models?.Contact || mongoose.model('Contact', ContactSchema);

export class Contact {
  static async find(query = {}) {
    const conn = await dbConnect();
    if (conn) return MongooseContact.find(query).sort({ createdAt: -1 }).lean().exec();
    return [];
  }
  static async findById(id) {
    const conn = await dbConnect();
    if (conn) return MongooseContact.findById(id).lean().exec();
    return null;
  }
  static async create(data) {
    const conn = await dbConnect();
    if (conn) return MongooseContact.create(data);
    return null;
  }
  static async findByIdAndUpdate(id, updateData) {
    const conn = await dbConnect();
    if (conn)
      return MongooseContact.findByIdAndUpdate(id, { $set: updateData }, { new: true }).lean().exec();
    return null;
  }
  static async findByIdAndDelete(id) {
    const conn = await dbConnect();
    if (conn) return MongooseContact.findByIdAndDelete(id).lean().exec();
    return null;
  }
  static async countDocuments(query = {}) {
    const conn = await dbConnect();
    if (conn) return MongooseContact.countDocuments(query).exec();
    return 0;
  }
}
