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

// Request interceptor to add auth token (use sessionStorage for tab isolation)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Check sessionStorage first (tab-specific), then localStorage (for backward compatibility)
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
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
      // Clear invalid token and user state
      if (typeof window !== 'undefined') {
        // Check both sessionStorage and localStorage for token
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        // Only redirect if there was a token (meaning user was logged in but token expired)
        // Don't redirect if no token (guest user)
        if (token) {
          // Clear all auth-related storage (both sessionStorage and localStorage for cleanup)
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('refreshToken');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          
          // Clear Zustand store auth state
          // Import store dynamically to avoid circular dependency
          import('./store').then(({ useStore }) => {
            const store = useStore.getState();
            if (store.user) {
              store.setUser(null);
              store.setToken(null);
            }
          });
          
          // Only redirect to login if not on checkout or cart page (allow guest checkout)
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/checkout') && !currentPath.includes('/cart')) {
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

