import axios from 'axios';

// Use relative path in production (same domain), absolute in development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.origin === 'http://localhost:3000' 
    ? 'http://localhost:5000/api' 
    : '/api');

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if not on checkout page (allow guest checkout)
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/checkout')) {
        const token = localStorage.getItem('token');
        // Only redirect if there was a token (meaning user was logged in but token expired)
        // Don't redirect if no token (guest user)
        if (token) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

