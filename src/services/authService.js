// Mock API service for authentication

import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4001';

export const authService = {
  login,
  logout,
  register,
  refreshToken,
  getCurrentUser,
  isAuthenticated,
  getUserRole,
  getUserId
};

async function login(email, password) {
  try {
    console.log('Attempting login to:', `${API_URL}/auth/login`);
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    
    console.log('Login response:', response.data);
    
    // Store user details and token in local storage
    if (response.data && response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
      console.log('User data stored in localStorage:', response.data);
    } else {
      console.error('No token found in response', response.data);
      return Promise.reject(new Error('Authentication failed: No token received'));
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error in authService:', error);
    return handleApiError(error);
  }
}

function logout() {
  // Remove user from local storage
  localStorage.removeItem('user');
  console.log('User logged out, localStorage cleared');
}

async function register(userData) {
  try {
    // Remove role from userData if it exists
    const { role, ...userDataWithoutRole } = userData;
    
    const response = await axios.post(`${API_URL}/auth/register`, userDataWithoutRole);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

async function refreshToken() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.refreshToken) {
      return Promise.reject(new Error('No refresh token available'));
    }
    
    const response = await axios.post(`${API_URL}/auth/refresh-token`, {
      refreshToken: user.refreshToken
    });
    
    // Update stored user with new tokens
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify({
        ...user,
        token: response.data.token,
        refreshToken: response.data.refreshToken
      }));
    }
    
    return response.data;
  } catch (error) {
    // If refresh token fails, log the user out
    logout();
    return handleApiError(error);
  }
}

// Get current user
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    const userData = JSON.parse(userStr);
    // Validate that we have the required data
    if (!userData || !userData.token) {
      localStorage.removeItem('user');
      return null;
    }
    return userData;
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
    localStorage.removeItem('user');
    return null;
  }
}

// Check if user is authenticated
function isAuthenticated() {
  const user = getCurrentUser();
  return !!user && !!user.token;
}

// Get current user role
function getUserRole() {
  const user = getCurrentUser();
  if (!user) return 'viewer';
  
  // Handle both nested and flat user objects
  if (user.user && user.user.role) {
    return user.user.role;
  }
  
  if (user.role) {
    return user.role;
  }
  
  return 'viewer';
}

// Get current user ID
function getUserId() {
  const user = getCurrentUser();
  if (!user) return null;
  
  // Handle both nested and flat user objects
  if (user.user && user.user.id) {
    return user.user.id;
  }
  
  return user.id || null;
} 