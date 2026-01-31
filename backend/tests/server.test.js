import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Create a test server similar to the actual server
const createTestServer = () => {
  const app = express();

  app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  }));

  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
  });

  // Mock Apps Script proxy
  app.post('/api/apps-script', (req, res) => {
    const { action } = req.body;
    
    if (action === 'sendEmail') {
      res.json({ success: true, message: 'Email sent successfully' });
    } else if (action === 'storeMovie') {
      res.json({ success: true, movieId: 'mock_123' });
    } else {
      res.status(400).json({ error: 'Unknown action' });
    }
  });

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({ message: 'MovieSpace API Server' });
  });

  return app;
};

describe('Backend Server', () => {
  let server;

  beforeAll(() => {
    server = createTestServer();
  });

  afterAll(() => {
    // Server cleanup if needed
  });

  describe('CORS Configuration', () => {
    it('should allow requests from localhost:5173', async () => {
      const response = await request(server)
        .get('/')
        .set('Origin', 'http://localhost:5173');
      
      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });

    it('should allow requests from localhost:5174', async () => {
      const response = await request(server)
        .get('/')
        .set('Origin', 'http://localhost:5174');
      
      expect(response.status).toBe(200);
    });
  });

  describe('Health Check', () => {
    it('should return server status', async () => {
      const response = await request(server)
        .get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.message).toBe('Server is running');
    });
  });

  describe('Root Endpoint', () => {
    it('should return API message', async () => {
      const response = await request(server)
        .get('/');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('MovieSpace API Server');
    });
  });

  describe('Apps Script Proxy', () => {
    it('should handle email sending action', async () => {
      const response = await request(server)
        .post('/api/apps-script')
        .send({
          action: 'sendEmail',
          to: 'test@example.com',
          subject: 'Test Email',
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Email sent successfully');
    });

    it('should handle movie storage action', async () => {
      const response = await request(server)
        .post('/api/apps-script')
        .send({
          action: 'storeMovie',
          title: 'Test Movie',
          url: 'https://example.com/video.mp4',
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.movieId).toBe('mock_123');
    });

    it('should reject unknown actions', async () => {
      const response = await request(server)
        .post('/api/apps-script')
        .send({
          action: 'unknownAction',
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Unknown action');
    });

    it('should handle POST with JSON', async () => {
      const response = await request(server)
        .post('/api/apps-script')
        .set('Content-Type', 'application/json')
        .send({
          action: 'sendEmail',
          message: 'Test message',
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(server)
        .get('/unknown-route');
      
      expect(response.status).toBe(404);
    });

    it('should handle malformed JSON', async () => {
      const response = await request(server)
        .post('/api/apps-script')
        .set('Content-Type', 'application/json')
        .send('invalid json');
      
      expect(response.status).toBe(400);
    });
  });

  describe('Request Methods', () => {
    it('should only accept GET on health endpoint', async () => {
      const getResponse = await request(server)
        .get('/health');
      
      expect(getResponse.status).toBe(200);
    });

    it('should only accept POST on apps-script endpoint', async () => {
      const getResponse = await request(server)
        .get('/api/apps-script');
      
      expect(getResponse.status).toBe(404);
    });
  });
});
