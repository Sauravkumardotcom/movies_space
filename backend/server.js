import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import videoRoutes from './routes/videos.js';
import emailRoutes from './routes/email.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

// VERCEL PRODUCTION FIX: Comprehensive CORS configuration
// Handles both local development and production Vercel deployment
const allowedOrigins = [
  'https://movies-space-shakyalabs.vercel.app',
  'https://movies-space-brown.vercel.app',
  'https://movies-space03.vercel.app',
  'https://movies-shakyalabs-backend.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5000'
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (origin.endsWith('.vercel.app')) return true;
  if (origin.includes('localhost')) return true;
  return false;
};

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400,
  preflightContinue: false
};

// Apply CORS before body parsing and security middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet());
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.'
    });
  }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use((req, res, next) => {
  console.log(`[BACKEND] ${req.method} ${req.originalUrl} origin=${req.headers.origin || 'none'}`);
  next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check PostgreSQL connection status only if Prisma is available
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

// Email routes
app.use('/api', emailRoutes);
app.use('/api/email', emailRoutes);

// Video search and listing routes
app.use('/api/videos', videoRoutes);
app.use('/api/search', videoRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const startServer = async () => {
  app.listen(PORT, async () => {
    console.log(`\n🚀 MovieSpace Backend Server Running on http://localhost:${PORT}`);
    console.log(`🌐 CORS Enabled for: All Vercel domains, localhost, and mobile apps\n`);
    console.log('📧 Email service: Configured on Frontend');
    console.log('📊 Google Sheets integration removed; database storage is active');

    // Connect to PostgreSQL for local development only
    try {
      const { connectDB } = await import('./db/connection.js');
      await connectDB();
      console.log('✅ Database layer initialized successfully\n');
    } catch (error) {
      console.error('❌ Failed to connect to PostgreSQL:', error.message);
      console.error('⚠️ Server running but database features will not work');
      console.error('💡 Make sure PostgreSQL is running and DATABASE_URL is configured\n');
    }
  });

  process.on('SIGINT', async () => {
    console.log('\n⏹️ Shutting down server gracefully...');
    try {
      const { disconnectDB } = await import('./db/connection.js');
      await disconnectDB();
    } catch (error) {
      console.warn('⚠️ Error during graceful shutdown:', error.message);
    }
    process.exit(0);
  });
};

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

if (!process.env.VERCEL) {
  startServer();
}

export default app;
