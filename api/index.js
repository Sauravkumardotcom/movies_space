import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Videos endpoint (example)
app.get('/api/videos', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Backend API is running on Vercel'
  });
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  res.json({ success: true, message: 'Login endpoint' });
});

app.post('/api/auth/register', (req, res) => {
  res.json({ success: true, message: 'Register endpoint' });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logout endpoint' });
});

// Email endpoint
app.post('/api/send-email', (req, res) => {
  res.json({ success: true, message: 'Email sent' });
});

// Google Drive endpoints
app.get('/api/google-drive/folders', (req, res) => {
  res.json({ success: true, data: [] });
});

app.post('/api/google-drive/upload', (req, res) => {
  res.json({ success: true, message: 'File uploaded' });
});

// Default export for Vercel serverless
export default app;
