import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not set — falling back to in-memory store.');
    return null;
  }

  // Return existing live connection
  if (cached.conn) return cached.conn;

  // Start a new connection attempt if not already in progress
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    })
      .then(m => {
        console.log('✅ MongoDB connected.');
        return m;
      })
      .catch(err => {
        console.error('❌ MongoDB connection failed:', err.message);
        cached.promise = null; // allow retry on next request
        return null;
      });
  }

  try {
    const result = await cached.promise;
    if (result) {
      cached.conn = result;
      return cached.conn;
    }
    // Connection failed — reset so next request retries
    cached.promise = null;
    return null;
  } catch {
    cached.promise = null;
    return null;
  }
}

export default dbConnect;
