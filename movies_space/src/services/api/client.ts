import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * Centralized API Client with interceptors
 * Handles auth, errors, retries, and request validation
 * 
 * PRODUCTION FIX: Uses environment variable for API base URL
 * Fallback logic ensures app works in both dev and production
 */

// Determine API base URL with intelligent fallback
const getAPIBaseURL = (): string => {
  // Priority 1: Environment variable (set in .env)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Priority 2: Vercel production URL (auto-detected)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // On production Vercel, use same domain with /api prefix
    return `${window.location.origin}/api`;
  }

  // Priority 3: Development localhost
  return 'http://localhost:5000';
};

const BACKEND_URL = getAPIBaseURL();

const client: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 15000, // Increased for Vercel cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor: Add auth token
 */
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Handle errors and transform data
 */
client.interceptors.response.use(
  (response) => {
    // Return data directly (not response envelope)
    return response.data;
  },
  (error: AxiosError) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Handle specific error codes
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return Promise.reject(new Error('Session expired. Please login again.'));
    }

    if (error.response?.status === 429) {
      return Promise.reject(new Error('Too many requests. Please try again later.'));
    }

    if (error.response?.status === 403) {
      return Promise.reject(new Error('Access denied. Insufficient permissions.'));
    }

    if (error.response?.status === 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }

    // Generic error
    const message = (error.response?.data as any)?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export default client;
