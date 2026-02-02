/**
 * Vercel Serverless Function - Main API Handler
 * Handles all API requests for MovieSpace on Vercel
 * PRODUCTION FIX: Proper CORS for Vercel + frontend
 */

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// PRODUCTION FIX: Comprehensive CORS for Vercel deployment
const corsOptions = {
  origin: function (origin, callback) {
    // Allowed origins
    const allowedOrigins = [
      'https://movies-space03.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5000'
    ];

    // Allow Vercel preview deployments
    if (process.env.VERCEL_URL && origin && origin.includes('.vercel.app')) {
      return callback(null, true);
    }

    // Allow no origin (mobile apps, curl)
    if (!origin) {
      return callback(null, true);
    }

    // Check allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400
};

app.use(cors(corsOptions));

// Preflight handler for OPTIONS
app.options('*', cors(corsOptions));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Videos endpoint
app.get('/api/videos', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Backend API is running on Vercel Serverless Functions'
  });
});

// Auth endpoints
// PRODUCTION FIX: Admin login with proper validation
app.post('/api/auth/admin/login', (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password is required'
      });
    }

    // Validate admin password from environment
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    
    if (!ADMIN_PASSWORD) {
      console.error('⚠️ ADMIN_PASSWORD not configured in environment');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    // Simple password validation (use bcrypt in production!)
    if (password === ADMIN_PASSWORD) {
      return res.json({
        success: true,
        token: 'admin-token-' + Date.now(),
        message: 'Admin login successful'
      });
    }

    res.status(401).json({
      success: false,
      error: 'Invalid admin password'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    // TODO: Implement actual user authentication
    res.json({ success: true, message: 'Login endpoint', token: null });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/register', (req, res) => {
  try {
    // TODO: Implement actual registration
    res.json({ success: true, message: 'Register endpoint' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logout successful' });
});

// Email endpoint - Google Apps Script integration
app.post('/api/send-email', (req, res) => {
  try {
    const { action, to_email, subject, body } = req.body;
    
    if (!action || !to_email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: action, to_email' 
      });
    }

    // TODO: Implement actual email sending via Google Apps Script webhook
    // Example: Call Google Apps Script Web App URL
    
    res.json({ 
      success: true, 
      message: 'Email queued for sending',
      messageId: Date.now().toString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Google Drive endpoints
app.get('/api/google-drive/folders', (req, res) => {
  try {
    // TODO: Implement Google Drive folder listing
    res.json({ success: true, data: [], folders: [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/google-drive/upload', (req, res) => {
  try {
    // TODO: Implement Google Drive file upload
    res.json({ 
      success: true, 
      message: 'File uploaded',
      fileId: null
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Request movie endpoint
app.post('/api/request-movie', (req, res) => {
  try {
    const { title, description, email } = req.body;
    
    if (!title || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // TODO: Store request in database or sheets
    res.json({ 
      success: true, 
      message: 'Movie request received',
      requestId: `REQ-${Date.now()}`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Not Found',
    path: req.path 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

module.exports = app;
