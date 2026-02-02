import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movies-space';

/**
 * Connect to MongoDB
 * Called on server startup
 */
async function connectDB() {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB already connected');
      return;
    }

    console.log('🔗 Attempting to connect to MongoDB...');
    console.log(`📍 Database URI: ${MONGODB_URI.replace(/\/\/.+@/, '//***:***@')}`); // Mask credentials in logs

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority'
    });

    console.log('✅ MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    return mongoose.connection;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 * Called on server shutdown
 */
async function disconnectDB() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('✅ MongoDB disconnected');
    }
  } catch (error) {
    console.error('❌ Error disconnecting MongoDB:', error.message);
    throw error;
  }
}

/**
 * Check MongoDB health status
 * Used by /api/health endpoint
 */
async function checkDBHealth() {
  try {
    const readyState = mongoose.connection.readyState;
    
    if (readyState === 1) {
      // Connected
      const admin = mongoose.connection.db.admin();
      const status = await admin.ping();
      return status ? 'connected' : 'connected';
    } else if (readyState === 0) {
      return 'disconnected';
    } else if (readyState === 2) {
      return 'connecting';
    } else if (readyState === 3) {
      return 'disconnecting';
    }
    return 'unknown';
  } catch (error) {
    return 'error';
  }
}

export { connectDB, disconnectDB, checkDBHealth };
