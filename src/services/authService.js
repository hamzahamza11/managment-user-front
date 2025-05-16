// Mock API service for authentication

const authService = {
  // Login function - in a real app this would call an API
  login: async (email, password, role) => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Store user data in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', role);
        localStorage.setItem('userEmail', email);
        
        resolve({
          success: true,
          user: {
            email,
            role
          }
        });
      }, 800);
    });
  },
  
  // Logout function
  logout: () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    return Promise.resolve({ success: true });
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('isLoggedIn') === 'true';
  },
  
  // Get current user role
  getUserRole: () => {
    return localStorage.getItem('userRole') || 'viewer';
  },
  
  // Get current user email
  getUserEmail: () => {
    return localStorage.getItem('userEmail') || '';
  }
};

export default authService; 