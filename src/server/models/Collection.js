import mongoose from 'mongoose';
import dbConnect from '../config/db.js';
import { MockCollection } from './mockDb.js';

const CollectionSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  tag: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const MongooseCollection = mongoose.models?.Collection || mongoose.model('Collection', CollectionSchema);

export class Collection {
  static async find(query = {}) {
    const conn = await dbConnect();
    if (conn) {
      return MongooseCollection.find(query).exec();
    }
    return MockCollection.find(query);
  }

  static async findOne(query = {}) {
    const conn = await dbConnect();
    if (conn) {
      return MongooseCollection.findOne(query).exec();
    }
    return MockCollection.findOne(query);
  }

  static async create(data) {
    const conn = await dbConnect();
    if (conn) {
      return MongooseCollection.create(data);
    }
    return MockCollection.create(data);
  }
}
