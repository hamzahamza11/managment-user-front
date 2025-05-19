import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';
import { authHeader } from '../utils/authHeader';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4001';

export const userService = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile
};

// Get all users
async function getUsers() {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Get user by ID
async function getUserById(id) {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Create a new user
async function createUser(userData) {
  try {
    const response = await axios.post(`${API_URL}/users`, userData, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Update a user
async function updateUser(id, userData) {
  try {
    const response = await axios.put(`${API_URL}/users/${id}`, userData, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Delete a user
async function deleteUser(id) {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Get current user profile
async function getUserProfile() {
  try {
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
} 