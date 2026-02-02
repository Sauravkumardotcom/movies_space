import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { validateAppsScriptRequest } from './middleware/validators.js';
import { connectDB, disconnectDB } from './db/connection.js';
import authRoutes from './routes/auth.js';
import videoRoutes from './routes/videos.js';
import googleRoutes from './routes/google.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// PRODUCTION FIX: Comprehensive CORS configuration
// Allows both local development and production Vercel deployment
const allowedOrigins = [
  // Development
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:5000',
  
  // Production - from environment variables
  'https://movies-space03.vercel.app',
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  
  // Fallback for any Vercel preview deployments
  process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:*'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow Vercel preview deployments (*.vercel.app)
    if (origin && origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Reject other origins
    console.warn(`CORS rejected: ${origin}`);
    return callback(new Error('Not allowed by CORS'), false);
  },
  methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // Cache preflight for 24 hours
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check MongoDB connection status
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

// Google integration routes
app.use('/api/google', googleRoutes);

// Proxy endpoint for Google Apps Script requests (handles CORS)
app.post('/api/apps-script', validateAppsScriptRequest, async (req, res) => {
  try {
    const GOOGLE_APPS_SCRIPT_URL = process.env.VITE_GOOGLE_APPS_SCRIPT_URL;
    
    if (!GOOGLE_APPS_SCRIPT_URL) {
      return res.status(400).json({ 
        success: false, 
        error: 'VITE_GOOGLE_APPS_SCRIPT_URL not configured in .env' 
      });
    }

    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Apps Script proxy error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`\n🚀 MovieSpace Backend Server Running on http://localhost:${PORT}`);
  console.log(`🌐 CORS Origins: ${allowedOrigins.join(', ')}\n`);
  console.log('📧 Email service: Configured on Frontend');
  console.log('📊 Google Sheets: Using Apps Script Web App\n');

  // Connect to MongoDB
  try {
    await connectDB();
    console.log('✅ Database layer initialized successfully\n');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.error('⚠️ Server running but database features will not work');
    console.error('💡 Make sure MongoDB is running locally or MONGODB_URI is configured\n');
  }

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n⏹️ Shutting down server gracefully...');
    await disconnectDB();
    process.exit(0);
  });
});
