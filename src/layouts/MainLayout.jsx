import React, { useState } from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import Navbar from '../components/Navbar/Navbar';

const MainLayout = ({ children }) => {
  const [userRole, setUserRole] = useState('admin'); // Default role is admin

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Navbar userRole={userRole} setUserRole={setUserRole} />
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        {React.cloneElement(children, { userRole })}
      </Container>
    </Box>
  );
};

export default MainLayout; 