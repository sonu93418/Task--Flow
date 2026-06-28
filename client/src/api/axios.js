import axios from 'axios';

// Centralised API base URL.
// In dev:  reads from .env  (VITE_API_URL=http://localhost:5000/api)
// In prod: reads from .env.production  (VITE_API_URL=https://task-flow-bnp3.onrender.com/api)
// Never falls back to a hardcoded localhost — misconfiguration must be caught early.
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn('[TaskFlow] VITE_API_URL is not set. API calls will fail.');
}

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30 s — accounts for Render free-tier cold start
});

// ── Request interceptor: attach JWT ──────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: unified error handling ─────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error / backend offline (no response object at all)
    if (!error.response) {
      const networkErr = new Error(
        'Cannot reach the server. Please check your connection or try again later.'
      );
      networkErr.type = 'NETWORK_ERROR';
      return Promise.reject(networkErr);
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        // Token expired or invalid — clear session and redirect to login
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
        if (
          !window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/register')
        ) {
          window.location.href = '/login';
        }
        break;

      case 403:
        error.message = data?.message || 'You do not have permission to perform this action.';
        error.type = 'FORBIDDEN';
        break;

      case 422:
      case 400:
        // Validation errors — surface the first message from the backend
        error.message =
          data?.errors?.[0] || data?.message || 'Validation error. Please check your input.';
        error.type = 'VALIDATION_ERROR';
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        error.message =
          data?.message || 'Server error. Please try again in a moment.';
        error.type = 'SERVER_ERROR';
        break;

      default:
        error.message = data?.message || error.message || 'An unexpected error occurred.';
        break;
    }

    return Promise.reject(error);
  }
);

export default api;
