import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, lastAttempt: 0 };
}

async function dbConnect() {
  if (!MONGODB_URI) {
    console.warn(
      '⚠️ MONGODB_URI is not defined in your environmental variables. The API will fall back to using an in-memory/JSON-file database.'
    );
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  // If the database connection failed within the last 30 seconds, bypass and fallback immediately.
  const cooldown = 30000;
  if (Date.now() - (cached.lastAttempt || 0) < cooldown) {
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Wait at most 5s for selection
    };

    cached.lastAttempt = Date.now();
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ Connected to MongoDB successfully via Mongoose.');
      return mongooseInstance;
    }).catch((err) => {
      console.error('❌ Failed to connect to MongoDB:', err.message);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.warn(
      '⚠️ MongoDB connection failed. Falling back to the local in-memory/JSON database.'
    );
    return null;
  }

  return cached.conn;
}

export default dbConnect;
