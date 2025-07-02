import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      // Don't reload in development to avoid losing work
      if (import.meta.env.PROD) {
        window.location.reload();
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      error.message = 'Network connection failed. Please check your internet connection and ensure the backend server is running.';
    }
    
    return Promise.reject(error);
  }
);

export default api;