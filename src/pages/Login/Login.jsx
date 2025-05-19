import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContextNew';
import apiClient from '../../services/apiService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('admin'); // Default role
  const [apiStatus, setApiStatus] = useState({ testing: false, status: '' });
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    if (currentUser) {
      console.log('User is authenticated, redirecting to homepage');
      navigate('/');
    }
  }, [navigate, currentUser]);

  // Function to check if the API is accessible
  const checkApiConnection = async () => {
    setApiStatus({ testing: true, status: 'Testing connection to backend...' });
    
    try {
      // Try to connect to the backend
      const response = await apiClient.get('/');
      console.log('API connection test response:', response);
      setApiStatus({ 
        testing: false, 
        status: 'Backend is accessible! You can now login.' 
      });
    } catch (error) {
      console.error('API connection test error:', error);
      if (error.code === 'ERR_NETWORK') {
        setApiStatus({ 
          testing: false, 
          status: 'Cannot reach backend server. Please make sure your backend is running on port 3001.' 
        });
      } else {
        setApiStatus({ 
          testing: false, 
          status: `Backend is accessible but returned error: ${error.message}` 
        });
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      console.log('Login page: Attempting login with:', { email, role: userRole });
      
      // Call auth context login method and pass the role as well
      // Your backend should handle the role parameter if needed
      const userData = await login(email, password);
      console.log('Login page: Login successful, user data:', userData);
      
      if (!userData || !userData.token) {
        throw new Error('Login failed: No valid user data received');
      }
      
      console.log('Login successful, navigating to homepage');
      
      // Navigate to homepage after successful login
      navigate('/');
    } catch (err) {
      console.error('Login page: Login error:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Network error: Cannot connect to backend server. Please make sure your backend is running on port 3001.');
      } else if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Authentication failed: ${err.response.data?.message || err.response.statusText || 'Server error'}`);
      } else {
        setError(err.message || 'Authentication failed. Please check your credentials and ensure the backend server is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes, this function allows login without a backend
  const handleDemoLogin = () => {
    setLoading(true);
    
    // Create a demo user object
    const demoUser = {
      id: 1,
      name: 'Demo User',
      email: email || 'demo@example.com',
      role: userRole,
      token: 'demo-token-' + Math.random().toString(36).substring(2, 15),
    };
    
    // Store it in localStorage manually
    localStorage.setItem('user', JSON.stringify(demoUser));
    
    // Set a timeout to simulate API call
    setTimeout(() => {
      setLoading(false);
      window.location.href = '/'; // Force a full reload to reinitialize the auth state
    }, 1000);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Admin Console Login
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={userRole === 'admin'} 
                  onChange={() => setUserRole(userRole === 'admin' ? 'viewer' : 'admin')}
                  color="primary"
                  disabled={loading}
                />
              }
              label={`Login as: ${userRole}`}
              sx={{ mt: 2 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={loading || !email || !password}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2, mb: 2 }}
              onClick={handleDemoLogin}
              disabled={loading}
            >
              Demo Login (No Backend)
            </Button>
            
            <Typography variant="body2" color="text.secondary" align="center">
              * For the real login to work, your backend must be running.
            </Typography>
          </Box>
          
          <Divider sx={{ width: '100%', my: 2 }} />
          
          <Box sx={{ width: '100%', mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Having trouble logging in?
            </Typography>
            
            <Button 
              variant="outlined" 
              color="primary"
              onClick={checkApiConnection}
              disabled={apiStatus.testing}
              sx={{ mt: 1 }}
              fullWidth
            >
              {apiStatus.testing ? <CircularProgress size={24} /> : 'Test Backend Connection'}
            </Button>
            
            {apiStatus.status && (
              <Alert 
                severity={apiStatus.status.includes('Cannot') ? 'error' : 'info'} 
                sx={{ mt: 2 }}
              >
                {apiStatus.status}
              </Alert>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 