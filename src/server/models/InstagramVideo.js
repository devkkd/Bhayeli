import mongoose from 'mongoose';
import dbConnect from '../config/db.js';

const InstagramVideoSchema = new mongoose.Schema(
  {
    videoUrl:     { type: String, required: true, trim: true },
    thumbnailUrl: { type: String, default: '', trim: true },
    instagramUrl: { type: String, default: '', trim: true },
    views:        { type: Number, default: 0 },
    order:        { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true, versionKey: false }
);

InstagramVideoSchema.index({ order: 1, createdAt: -1 });

const MongooseInstagramVideo =
  mongoose.models?.InstagramVideo || mongoose.model('InstagramVideo', InstagramVideoSchema);

export class InstagramVideo {
  static async find(query = {}) {
    const conn = await dbConnect();
    if (conn) return MongooseInstagramVideo.find(query).sort({ order: 1, createdAt: -1 }).lean().exec();
    return [];
  }
  static async findById(id) {
    const conn = await dbConnect();
    if (conn) return MongooseInstagramVideo.findById(id).lean().exec();
    return null;
  }
  static async create(data) {
    const conn = await dbConnect();
    if (conn) return MongooseInstagramVideo.create(data);
    return null;
  }
  static async findByIdAndUpdate(id, updateData) {
    const conn = await dbConnect();
    if (conn)
      return MongooseInstagramVideo.findByIdAndUpdate(id, { $set: updateData }, { new: true }).lean().exec();
    return null;
  }
  static async findByIdAndDelete(id) {
    const conn = await dbConnect();
    if (conn) return MongooseInstagramVideo.findByIdAndDelete(id).lean().exec();
    return null;
  }
  static async countDocuments(query = {}) {
    const conn = await dbConnect();
    if (conn) return MongooseInstagramVideo.countDocuments(query).exec();
    return 0;
  }
}
