import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';
import { authHeader } from '../utils/authHeader';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4001';

export const permissionService = {
  getPermissions,
  getUserPermissions,
  getUserAppPermission,
  setPermission,
  removePermission,
  removeUserPermissions
};

// Get all permissions
async function getPermissions() {
  try {
    // We don't have a direct endpoint for all permissions, so we'll make a simpler implementation
    // that will be replaced with actual calls to the user permissions endpoint
    const response = await axios.get(`${API_URL}/users`, {
      headers: authHeader()
    });
    const users = response.data;
    
    // Get permissions for each user
    const permissionsPromises = users.map(user => 
      getUserPermissions(user.id)
    );
    
    const allPermissionsArrays = await Promise.all(permissionsPromises);
    // Flatten the array of arrays
    const allPermissions = allPermissionsArrays.flat();
    
    return allPermissions;
  } catch (error) {
    return handleApiError(error);
  }
}

// Get permissions for a specific user
async function getUserPermissions(userId) {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/permissions`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Get a specific user's permission for a specific app
async function getUserAppPermission(userId, appId) {
  try {
    const userPermissions = await getUserPermissions(userId);
    return userPermissions.find(p => p.applicationId === appId) || null;
  } catch (error) {
    return handleApiError(error);
  }
}

// Add or update a permission
async function setPermission(userId, appId, permissionType) {
  try {
    const response = await axios.post(`${API_URL}/users/${userId}/permissions`, {
      applicationId: appId,
      permissionType
    }, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Remove a permission
async function removePermission(userId, appId) {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}/permissions/${appId}`, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Remove all permissions for a user - we'll do this one by one
async function removeUserPermissions(userId) {
  try {
    // First get all permissions for the user
    const userPermissions = await getUserPermissions(userId);
    
    // Delete each permission
    const deletePromises = userPermissions.map(perm => 
      removePermission(userId, perm.applicationId)
    );
    
    await Promise.all(deletePromises);
    return { success: true };
  } catch (error) {
    return handleApiError(error);
  }
} 