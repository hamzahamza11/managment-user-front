import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Users from '../pages/Users/Users';
import Applications from '../pages/Applications/Applications';
import Permissions from '../pages/Permissions/Permissions';
import Login from '../pages/Login/Login';
import { useAuth } from '../contexts/AuthContextNew';

// Private route wrapper component
const PrivateRoute = () => {
  const { currentUser } = useAuth();
  console.log('PrivateRoute check - isAuthenticated:', !!currentUser);
  
  return currentUser ? (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          {/* <Route path="/" element={<Dashboard />} /> */}
          <Route path="/" element={<Users />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/permissions" element={<Permissions />} />
        </Route>
        
        {/* Redirect any unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes; 