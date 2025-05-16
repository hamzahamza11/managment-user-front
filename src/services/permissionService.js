// Mock data for permissions
const mockPermissions = [
  { id: 1, userId: 1, appId: 1, permission: "admin" },
  { id: 2, userId: 1, appId: 2, permission: "admin" },
  { id: 3, userId: 2, appId: 1, permission: "viewer" },
  { id: 4, userId: 3, appId: 3, permission: "admin" },
  { id: 5, userId: 4, appId: 2, permission: "viewer" },
  { id: 6, userId: 5, appId: 4, permission: "admin" },
  { id: 7, userId: 3, appId: 5, permission: "viewer" }
];

// Store permissions in localStorage
if (!localStorage.getItem('permissions')) {
  localStorage.setItem('permissions', JSON.stringify(mockPermissions));
}

const permissionService = {
  // Get all permissions
  getPermissions: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const permissions = JSON.parse(localStorage.getItem('permissions')) || [];
        resolve(permissions);
      }, 300);
    });
  },
  
  // Get permissions for a specific user
  getUserPermissions: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const permissions = JSON.parse(localStorage.getItem('permissions')) || [];
        const userPermissions = permissions.filter(p => p.userId === userId);
        resolve(userPermissions);
      }, 300);
    });
  },
  
  // Get permissions for a specific application
  getApplicationPermissions: async (appId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const permissions = JSON.parse(localStorage.getItem('permissions')) || [];
        const appPermissions = permissions.filter(p => p.appId === appId);
        resolve(appPermissions);
      }, 300);
    });
  },
  
  // Get a specific user's permission for a specific app
  getUserAppPermission: async (userId, appId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const permissions = JSON.parse(localStorage.getItem('permissions')) || [];
        const permission = permissions.find(p => p.userId === userId && p.appId === appId);
        resolve(permission || null);
      }, 300);
    });
  },
  
  // Add or update a permission
  setPermission: async (userId, appId, permissionType) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const permissions = JSON.parse(localStorage.getItem('permissions')) || [];
        const existingIndex = permissions.findIndex(p => p.userId === userId && p.appId === appId);
        
        if (existingIndex !== -1) {
          // Update existing permission
          permissions[existingIndex].permission = permissionType;
        } else {
          // Add new permission
          const maxId = permissions.reduce((max, p) => Math.max(max, p.id), 0);
          permissions.push({
            id: maxId + 1,
            userId,
            appId,
            permission: permissionType
          });
        }
        
        localStorage.setItem('permissions', JSON.stringify(permissions));
        resolve({ success: true });
      }, 500);
    });
  },
  
  // Remove a permission
  removePermission: async (permissionId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const permissions = JSON.parse(localStorage.getItem('permissions')) || [];
        const index = permissions.findIndex(p => p.id === permissionId);
        
        if (index !== -1) {
          permissions.splice(index, 1);
          localStorage.setItem('permissions', JSON.stringify(permissions));
          resolve({ success: true });
        } else {
          reject(new Error('Permission not found'));
        }
      }, 500);
    });
  },
  
  // Remove all permissions for a user
  removeUserPermissions: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const permissions = JSON.parse(localStorage.getItem('permissions')) || [];
        const updatedPermissions = permissions.filter(p => p.userId !== userId);
        localStorage.setItem('permissions', JSON.stringify(updatedPermissions));
        resolve({ success: true });
      }, 500);
    });
  },
  
  // Remove all permissions for an application
  removeApplicationPermissions: async (appId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const permissions = JSON.parse(localStorage.getItem('permissions')) || [];
        const updatedPermissions = permissions.filter(p => p.appId !== appId);
        localStorage.setItem('permissions', JSON.stringify(updatedPermissions));
        resolve({ success: true });
      }, 500);
    });
  }
};

export default permissionService; 