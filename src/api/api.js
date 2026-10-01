import axios from 'axios';

export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
    if (!isLocal) {
      // In production deployment (Firebase, Vercel, Netlify)
      if (envUrl && !envUrl.includes('localhost')) {
        return envUrl.replace(/\/+$/, '');
      }
      return 'https://garments-tracker-server.vercel.app';
    }
  }

  return (envUrl || 'http://localhost:5000').replace(/\/+$/, '');
};

export const API_BASE_URL = getApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to attach authorization header if present
api.interceptors.request.use(
  (config) => {
    if (!config.baseURL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && config.baseURL.includes('localhost'))) {
      config.baseURL = getApiBaseUrl();
    }
    const token = localStorage.getItem('garments_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
