import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * MongoDB Connection Module
 * Handles database connection with error handling
 */

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not configured in .env');
  console.error('Add: MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/moviespace');
  process.exit(1);
}

// Connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

/**
 * Connect to MongoDB
 */
export async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ MongoDB disconnect failed:', error.message);
    process.exit(1);
  }
}

/**
 * Health check
 */
export function getDBStatus() {
  return {
    connected: mongoose.connection.readyState === 1,
    host: mongoose.connection.host || 'not connected',
    database: mongoose.connection.name || 'not connected',
    timestamp: new Date().toISOString(),
  };
}

export default mongoose;
