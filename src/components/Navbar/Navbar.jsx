import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Box,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Person as PersonIcon, 
  Apps as AppsIcon, 
  VpnKey as VpnKeyIcon, 
  Dashboard as DashboardIcon,
  ExitToApp as LogoutIcon 
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContextNew';

const Navbar = ({ userRole, onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback if no onLogout prop provided
      navigate('/login');
    }
  };

  const menuItems = [
    // { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Users', icon: <PersonIcon />, path: '/' },
    { text: 'Applications', icon: <AppsIcon />, path: '/applications' },
    { text: 'Permissions', icon: <VpnKeyIcon />, path: '/permissions' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Console
          </Typography>
          
          {!isMobile && menuItems.map((item) => (
            <Button 
              color="inherit" 
              key={item.text} 
              component={Link} 
              to={item.path}
              startIcon={item.icon}
              sx={{ mx: 1 }}
            >
              {item.text}
            </Button>
          ))}
          
          <Chip
            label={`Role: ${userRole}`}
            color={userRole === 'admin' ? 'secondary' : 'default'}
            variant="outlined"
            sx={{ mx: 2, color: 'white', borderColor: 'white' }}
          />
          
          <IconButton color="inherit" onClick={handleLogout} aria-label="logout">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar; 