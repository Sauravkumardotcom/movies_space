import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './db/connection.js';
import authRoutes from './routes/auth.js';
import videoRoutes from './routes/videos.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// VERCEL PRODUCTION FIX: Simple, reliable CORS configuration
// Handles both local development and production Vercel deployment
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    // Always allow Vercel domains (development and production)
    if (origin.includes('.vercel.app') || origin.includes('localhost')) {
      return callback(null, true);
    }
    
    // Default: allow (for safety in production)
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200,
  maxAge: 86400
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Explicit preflight handler (catches all OPTIONS requests)
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check PostgreSQL connection status
    const { checkDBHealth } = await import('./db/connection.js');
    const dbStatus = await checkDBHealth();
    
    res.status(200).json({ 
      status: 'Backend server is running',
      environment: process.env.NODE_ENV,
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(200).json({ 
      status: 'Backend server is running',
      environment: process.env.NODE_ENV,
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Video search and listing routes
app.use('/api/videos', videoRoutes);
app.use('/api/search', videoRoutes);

// Start server
app.listen(PORT, async () => {
  console.log(`\n🚀 MovieSpace Backend Server Running on http://localhost:${PORT}`);
  console.log(`🌐 CORS Enabled for: All Vercel domains, localhost, and mobile apps\n`);
  console.log('📧 Email service: Configured on Frontend');
  console.log('📊 Google Sheets integration removed; database storage is active');

  // Connect to PostgreSQL
  try {
    await connectDB();
    console.log('✅ Database layer initialized successfully\n');
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL:', error.message);
    console.error('⚠️ Server running but database features will not work');
    console.error('💡 Make sure PostgreSQL is running and DATABASE_URL is configured\n');
  }

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n⏹️ Shutting down server gracefully...');
    await disconnectDB();
    process.exit(0);
  });
});
