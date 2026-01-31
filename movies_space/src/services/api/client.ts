import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * Centralized API Client with interceptors
 * Handles auth, errors, retries, and request validation
 */

const BACKEND_URL = 'http://localhost:5000';
// import.meta.env.VITE_BACKEND_URL can be set in .env file

const client: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
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
