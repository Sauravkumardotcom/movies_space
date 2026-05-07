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

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(server)
        .get('/unknown-route');
      
      expect(response.status).toBe(404);
    });

    it('should handle malformed JSON', async () => {
      const response = await request(server)
        .post('/health')
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

    it('should reject POST on health endpoint', async () => {
      const postResponse = await request(server)
        .post('/health')
        .send({});
      
      expect(postResponse.status).toBe(404);
    });
  });
});
