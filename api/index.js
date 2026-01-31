/**
 * Vercel Serverless Function - Main API Handler
 * Handles all API requests for MovieSpace on Vercel
 * No frontend code, no bundling concerns
 */

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.VERCEL_URL 
    ? [`https://${process.env.VERCEL_URL}`, 'http://localhost:3000', 'http://localhost:5173']
    : '*',
  credentials: true
}));

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
app.post('/api/auth/login', (req, res) => {
  try {
    // TODO: Implement actual authentication
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
