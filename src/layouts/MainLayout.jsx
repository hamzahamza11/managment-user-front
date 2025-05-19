import React from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import { useAuth } from '../contexts/AuthContextNew';

const MainLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Navbar 
        userRole={currentUser?.role || 'viewer'} 
        onLogout={handleLogout} 
      />
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Container>
    </Box>
  );
};

export default MainLayout; 