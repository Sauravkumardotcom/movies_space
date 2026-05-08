import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import videoRoutes from './routes/videos.js';
import emailRoutes from './routes/email.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

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
  optionsSuccessStatus: 204,
  maxAge: 86400,
  preflightContinue: false
};

// Apply CORS BEFORE parsing request bodies
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use((req, res, next) => {
  console.log(`[BACKEND] ${req.method} ${req.originalUrl} origin=${req.headers.origin || 'none'}`);
  next();
});

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && isAllowedOrigin(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept,Origin');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

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
app.use('/api/email', emailRoutes);

// Video search and listing routes
app.use('/api/videos', videoRoutes);
app.use('/api/search', videoRoutes);

// Backward compatibility: /api/send-email route points to email service
app.options('/api/send-email', (req, res) => {
  const origin = req.headers.origin;
  if (isAllowedOrigin(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  res.sendStatus(204);
});

app.post('/api/send-email', (req, res, next) => {
  req.url = '/send-email';
  next();
}, emailRoutes);

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

if (!process.env.VERCEL) {
  startServer();
}

export default app;
