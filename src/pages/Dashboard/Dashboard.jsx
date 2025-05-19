import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Paper, 
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Apps as AppsIcon, 
  VpnKey as VpnKeyIcon 
} from '@mui/icons-material';
import { userService, applicationService, permissionService } from '../../services';

const Dashboard = ({ userRole }) => {
  const [stats, setStats] = useState([
    { title: 'Total Users', count: 0, icon: <PersonIcon fontSize="large" color="primary" /> },
    { title: 'Applications', count: 0, icon: <AppsIcon fontSize="large" color="primary" /> },
    { title: 'Permissions', count: 0, icon: <VpnKeyIcon fontSize="large" color="primary" /> }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all required data in parallel
        const [users, applications, permissions] = await Promise.all([
          userService.getUsers(),
          applicationService.getApplications(),
          permissionService.getPermissions()
        ]);
        
        // Update stats with actual counts
        setStats([
          { title: 'Total Users', count: users.length, icon: <PersonIcon fontSize="large" color="primary" /> },
          { title: 'Applications', count: applications.length, icon: <AppsIcon fontSize="large" color="primary" /> },
          { title: 'Permissions', count: permissions.length, icon: <VpnKeyIcon fontSize="large" color="primary" /> }
        ]);
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again.');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Welcome to the User Management Console. You are logged in as: <strong>{userRole}</strong>
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h5" component="div">
                    {stat.count}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
                {stat.icon}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mt: 4 }}>
        <CardHeader title="System Overview" />
        <Divider />
        <CardContent>
          <Typography variant="body1" paragraph>
            This admin console allows you to manage users, applications, and user permissions 
            across different applications. Use the navigation menu to access different sections.
          </Typography>
          <Typography variant="body1">
            As an {userRole}, you can {userRole === 'admin' ? 'view and modify' : 'only view'} 
            the data in the system. Toggle your role using the switch in the navigation bar.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard; 