import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state by checking for stored user on app load
  useEffect(() => {
    try {
      const user = authService.getCurrentUser();
      console.log('Auth initialization, user from localStorage:', user);
      setCurrentUser(user);
    } catch (err) {
      console.error('Error during auth initialization:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    
    try {
      console.log('AuthContext: Attempting login with:', { email });
      
      const userData = await authService.login(email, password);
      console.log('AuthContext: Login successful, user data:', userData);
      
      if (!userData || !userData.token) {
        const errorMsg = 'Login failed: No valid user data or token received';
        console.error(errorMsg);
        setError(errorMsg);
        throw new Error(errorMsg);
      }
      
      setCurrentUser(userData);
      return userData;
    } catch (err) {
      console.error('AuthContext: Login error:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    console.log('AuthContext: Logging out user');
    authService.logout();
    setCurrentUser(null);
  };

  // Register function
  const register = async (userData) => {
    setError(null);
    setLoading(true);
    
    try {
      const result = await authService.register(userData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh token
  const refreshUserToken = async () => {
    if (!currentUser) return null;
    
    try {
      const result = await authService.refreshToken();
      const updatedUser = { ...currentUser, token: result.token };
      setCurrentUser(updatedUser);
      return result;
    } catch (err) {
      // If refresh fails, log the user out
      logout();
      setError('Your session has expired. Please login again.');
      throw err;
    }
  };

  // Value object to be provided by the context
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    register,
    refreshUserToken,
    isAdmin: currentUser?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 