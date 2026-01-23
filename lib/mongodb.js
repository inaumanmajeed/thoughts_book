import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Connection state: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
const CONNECTED = 1;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  // Check if connection is already established and ready
  if (cached.conn && mongoose.connection.readyState === CONNECTED) {
    return cached.conn;
  }

  // If connection exists but is not ready, check if it's in the process of connecting
  if (mongoose.connection.readyState === 2) {
    // Connection is in progress, wait for it
    if (cached.promise) {
      try {
        cached.conn = await cached.promise;
        return cached.conn;
      } catch (e) {
        cached.promise = null;
        cached.conn = null;
        // Fall through to create new connection
      }
    }
  }

  // If connection is disconnected or in error state, clear cache and reconnect
  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    cached.conn = null;
    cached.promise = null;
  }

  // Create new connection if no promise exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 1, // Minimal pool for serverless
      minPoolSize: 0, // Allow connection cleanup
      serverSelectionTimeoutMS: 3000, // Faster server selection
      connectTimeoutMS: 10000, // Connection timeout
      socketTimeoutMS: 10000, // Socket timeout (reduced for serverless)
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB: Connected successfully');
        
        // Set up connection event listeners for better debugging
        mongoose.connection.on('error', (err) => {
          console.error('❌ MongoDB: Connection error:', err.message);
          cached.conn = null;
          cached.promise = null;
        });

        mongoose.connection.on('disconnected', () => {
          console.warn('⚠️ MongoDB: Connection disconnected');
          cached.conn = null;
          cached.promise = null;
        });

        mongoose.connection.on('reconnected', () => {
          console.log('✅ MongoDB: Reconnected successfully');
        });

        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB: Connection error:', error.message);
        cached.promise = null;
        cached.conn = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    
    // Verify connection is actually ready before returning
    if (mongoose.connection.readyState !== CONNECTED) {
      throw new Error('MongoDB connection not ready after connect');
    }
    
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    throw e;
  }
}

export default connectDB;
