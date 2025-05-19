import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';
import { authHeader } from '../utils/authHeader';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4001';

export const applicationService = {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  getUserApplications
};

// Get all applications
async function getApplications() {
  try {
    const response = await axios.get(`${API_URL}/applications`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Get application by ID
async function getApplicationById(id) {
  try {
    const response = await axios.get(`${API_URL}/applications/${id}`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Create a new application
async function createApplication(applicationData) {
  try {
    const response = await axios.post(`${API_URL}/applications`, applicationData, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Update an application
async function updateApplication(id, applicationData) {
  try {
    const response = await axios.put(`${API_URL}/applications/${id}`, applicationData, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Delete an application
async function deleteApplication(id) {
  try {
    const response = await axios.delete(`${API_URL}/applications/${id}`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Get applications for a specific user
async function getUserApplications(userId) {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/applications`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
} 