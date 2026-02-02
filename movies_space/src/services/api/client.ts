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
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }

  // Priority 2: Environment variable alternative name
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Priority 3: Vercel production URL (auto-detected)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // On production Vercel, use same domain with /api prefix
    return `${window.location.origin}/api`;
  }

  // Priority 4: Development localhost
  return 'http://localhost:5000';
};

const BACKEND_URL = getAPIBaseURL();
console.log('🔗 API Client initialized with BACKEND_URL:', BACKEND_URL);

const client: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 15000, // Increased for Vercel cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor: Add auth token and handle refresh
 */
client.interceptors.request.use(
  (config) => {
    // Try access token first (from Phase A2 real auth)
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    }

    // Fallback to legacy authToken for backwards compatibility
    const legacyToken = localStorage.getItem('authToken');
    if (legacyToken) {
      config.headers.Authorization = `Bearer ${legacyToken}`;
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Handle errors, token refresh, and transform data
 */
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  isRefreshing = false;
  failedQueue = [];
};

client.interceptors.response.use(
  (response) => {
    // Return data directly (not response envelope)
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Handle 401 (token expired) - try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue request while refreshing
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${BACKEND_URL}/api/auth/refresh-token`,
            { refreshToken }
          );
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          client.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          processQueue(null, accessToken);
          return client(originalRequest);
        } catch (err) {
          processQueue(err, null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          return Promise.reject(err);
        }
      } else {
        // No refresh token - need to login again
        localStorage.removeItem('accessToken');
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
    }

    // Handle other error codes
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
