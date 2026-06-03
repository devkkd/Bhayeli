import mongoose from 'mongoose';
import dbConnect from '../config/db.js';
import { MockCategory } from './mockDb.js';

const CategorySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const MongooseCategory = mongoose.models?.Category || mongoose.model('Category', CategorySchema);

export class Category {
  static async find(query = {}) {
    const conn = await dbConnect();
    if (conn) {
      return MongooseCategory.find(query).exec();
    }
    return MockCategory.find(query);
  }

  static async findOne(query = {}) {
    const conn = await dbConnect();
    if (conn) {
      return MongooseCategory.findOne(query).exec();
    }
    return MockCategory.findOne(query);
  }

  static async findById(id) {
    const conn = await dbConnect();
    if (conn) {
      return MongooseCategory.findById(id).exec();
    }
    return MockCategory.findById(id);
  }

  static async create(data) {
    const conn = await dbConnect();
    if (conn) {
      return MongooseCategory.create(data);
    }
    return MockCategory.create(data);
  }

  static async findByIdAndUpdate(id, updateData) {
    const conn = await dbConnect();
    if (conn) {
      return MongooseCategory.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }
    return MockCategory.findByIdAndUpdate(id, updateData);
  }

  static async findByIdAndDelete(id) {
    const conn = await dbConnect();
    if (conn) {
      return MongooseCategory.findByIdAndDelete(id).exec();
    }
    return MockCategory.findByIdAndDelete(id);
  }
}
