import axios from 'axios';
import { authHeader } from '../utils/authHeader';

const API_URL = 'http://localhost:4001';

console.log('Configuring API client with base URL:', API_URL);

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Add a timeout
  timeout: 10000
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  config => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      console.log(`Adding auth token to request: ${config.method.toUpperCase()} ${config.url}`);
      config.headers['Authorization'] = `Bearer ${user.token}`;
    } else {
      console.log(`No auth token for request: ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  response => {
    console.log(`Response from ${response.config.url}: Status ${response.status}`);
    return response;
  },
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - backend server might be offline');
    } else if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.response.statusText}`);
      console.error('Response data:', error.response.data);
      
      // Handle 401 unauthorized errors (token expired or invalid)
      if (error.response.status === 401) {
        console.log('Received 401 unauthorized, clearing auth data');
        localStorage.removeItem('user');
        
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/login') {
          console.log('Redirecting to login page');
          window.location.href = '/login';
        }
      }
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient; 