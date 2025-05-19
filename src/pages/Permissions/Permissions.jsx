import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { permissionService, userService, applicationService } from '../../services';
import { useAuth } from '../../contexts/AuthContextNew';

const Permissions = () => {
  const { currentUser } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedApp, setSelectedApp] = useState('');
  const [permissionType, setPermissionType] = useState('viewer');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    userId: null,
    appId: null,
    userName: '',
    appName: ''
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all required data in parallel
      const [usersData, applicationsData] = await Promise.all([
        userService.getUsers(),
        applicationService.getApplications()
      ]);
      
      setUsers(usersData);
      setApplications(applicationsData);
      
      // Now fetch permissions for each user
      const allPermissions = [];
      for (const user of usersData) {
        try {
          const userPermissions = await permissionService.getUserPermissions(user.id);
          // Add user info to each permission for easier display
          userPermissions.forEach(perm => {
            allPermissions.push({
              ...perm,
              userName: user.name,
              userEmail: user.email
            });
          });
        } catch (err) {
          console.error(`Error fetching permissions for user ${user.id}:`, err);
        }
      }
      
      setPermissions(allPermissions);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleAddPermission = async () => {
    if (selectedUser && selectedApp) {
      try {
        await permissionService.setPermission(
          parseInt(selectedUser), 
          parseInt(selectedApp), 
          permissionType
        );
        
        showSnackbar('Permission assigned successfully', 'success');
        
        // Refetch permissions for this user to update the table
        const user = users.find(u => u.id === parseInt(selectedUser));
        const userPermissions = await permissionService.getUserPermissions(parseInt(selectedUser));
        
        // Update permissions state with the new data
        const updatedPermissions = permissions.filter(p => p.userId !== parseInt(selectedUser));
        userPermissions.forEach(perm => {
          updatedPermissions.push({
            ...perm,
            userName: user.name,
            userEmail: user.email
          });
        });
        
        setPermissions(updatedPermissions);
        
        // Reset selection
        setSelectedUser('');
        setSelectedApp('');
        setPermissionType('viewer');
      } catch (err) {
        showSnackbar('Failed to assign permission', 'error');
        console.error('Error assigning permission:', err);
      }
    }
  };

  const openDeleteConfirm = (userId, appId, userName, appName) => {
    setConfirmDialog({
      open: true,
      userId,
      appId,
      userName,
      appName
    });
  };

  const handleDeletePermission = async () => {
    const { userId, appId } = confirmDialog;
    
    try {
      await permissionService.removePermission(userId, appId);
      
      // Remove from the permissions list
      setPermissions(permissions.filter(
        p => !(p.userId === userId && p.applicationId === appId)
      ));
      
      showSnackbar('Permission removed successfully', 'success');
    } catch (err) {
      showSnackbar('Failed to remove permission', 'error');
      console.error('Error removing permission:', err);
    } finally {
      setConfirmDialog({ ...confirmDialog, open: false });
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Function to get permission entries with user and app details
  const getPermissionEntries = () => {
    return permissions.filter(perm => {
      const appName = applications.find(a => a.id === perm.applicationId)?.name || 'Unknown';
      
      return (
        perm.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perm.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }).map(perm => {
      const app = applications.find(a => a.id === perm.applicationId);
      return {
        ...perm,
        appName: app ? app.name : 'Unknown'
      };
    });
  };

  const permissionEntries = getPermissionEntries();
  const isAdmin = currentUser?.role === 'admin';
    console.log("isAdmin" , currentUser?.role , currentUser)

  if (loading && permissions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        User Permissions
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Form to add/edit permissions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Assign Permissions" />
            <Divider />
            <CardContent>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>User</InputLabel>
                <Select
                  value={selectedUser}
                  label="User"
                  onChange={(e) => setSelectedUser(e.target.value)}
                  disabled={!isAdmin}
                >
                  <MenuItem value="">
                    <em>Select a user</em>
                  </MenuItem>
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Application</InputLabel>
                <Select
                  value={selectedApp}
                  label="Application"
                  onChange={(e) => setSelectedApp(e.target.value)}
                  disabled={!isAdmin}
                >
                  <MenuItem value="">
                    <em>Select an application</em>
                  </MenuItem>
                  {applications.map(app => (
                    <MenuItem key={app.id} value={app.id}>
                      {app.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Permission</InputLabel>
                <Select
                  value={permissionType}
                  label="Permission"
                  onChange={(e) => setPermissionType(e.target.value)}
                  disabled={!isAdmin}
                >
                  <MenuItem value="viewer">Viewer</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>

              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                startIcon={<AddIcon />}
                onClick={handleAddPermission}
                disabled={!selectedUser || !selectedApp || !isAdmin}
              >
                Assign Permission
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Table of existing permissions */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={handleSearch}
                sx={{ width: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <TableContainer>
              <Table aria-label="permissions table">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Application</TableCell>
                    <TableCell>Permission</TableCell>
                    {isAdmin && <TableCell>Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {permissionEntries.length > 0 ? (
                    permissionEntries
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((entry) => (
                        <TableRow key={`${entry.userId}-${entry.applicationId}`}>
                          <TableCell>{entry.userName}</TableCell>
                          <TableCell>{entry.userEmail}</TableCell>
                          <TableCell>{entry.appName}</TableCell>
                          <TableCell>
                            <Chip 
                              label={entry.permissionType} 
                              color={entry.permissionType === 'admin' ? 'primary' : 'default'} 
                              size="small" 
                            />
                          </TableCell>
                          {isAdmin && (
                            <TableCell>
                              <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => openDeleteConfirm(
                                  entry.userId, 
                                  entry.applicationId,
                                  entry.userName,
                                  entry.appName
                                )}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 5 : 4} align="center">
                        No permissions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={permissionEntries.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      >
        <DialogTitle>Remove Permission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove {confirmDialog.userName}'s permission for the application "{confirmDialog.appName}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>Cancel</Button>
          <Button onClick={handleDeletePermission} color="error" variant="contained">
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Permissions; 