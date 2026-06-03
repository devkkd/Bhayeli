import mongoose from 'mongoose';
import dbConnect from '../config/db.js';

import { hashPassword } from '../utils/auth.js';

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const MongooseAdmin = mongoose.models?.Admin || mongoose.model('Admin', AdminSchema);

// In-memory array for admin fallback when MongoDB is disabled/offline
// Pre-seeded with default admin credentials for convenience in development/testing
let mockAdmins = [
  {
    _id: 'admin_default',
    username: 'admin',
    password: hashPassword('bhayeliAdmin123'),
    role: 'admin',
    createdAt: new Date()
  }
];

const MockAdmin = {
  find: async (query = {}) => {
    let results = [...mockAdmins];
    Object.keys(query).forEach((key) => {
      results = results.filter((item) => item[key] === query[key]);
    });
    return results;
  },

  findOne: async (query = {}) => {
    const list = await MockAdmin.find(query);
    return list[0] || null;
  },

  create: async (data) => {
    const newAdmin = {
      _id: `admin_${Date.now()}`,
      username: data.username || 'admin',
      password: data.password || '',
      role: data.role || 'admin',
      createdAt: new Date(),
      ...data
    };
    mockAdmins.push(newAdmin);
    return newAdmin;
  }
};

export class Admin {
  static async find(query = {}) {
    const conn = await dbConnect();
    if (conn) {
      return MongooseAdmin.find(query).exec();
    }
    return MockAdmin.find(query);
  }

  static async findOne(query = {}) {
    const conn = await dbConnect();
    if (conn) {
      return MongooseAdmin.findOne(query).exec();
    }
    return MockAdmin.findOne(query);
  }

  static async create(data) {
    const conn = await dbConnect();
    if (conn) {
      return MongooseAdmin.create(data);
    }
    return MockAdmin.create(data);
  }
}
