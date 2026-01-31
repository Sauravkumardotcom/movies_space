import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { validateAppsScriptRequest } from './middleware/validators.js';
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['POST', 'GET', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Backend server is running' });
});

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
app.listen(PORT, () => {
  console.log(`\n🚀 MovieSpace Backend Server Running on http://localhost:${PORT}`);
  console.log(`🌐 CORS Origins: ${allowedOrigins.join(', ')}\n`);
  console.log('📧 Email service: Configured on Frontend');
  console.log('📊 Google Sheets: Using Apps Script Web App\n');
});
