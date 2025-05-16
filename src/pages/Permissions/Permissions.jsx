import React, { useState } from 'react';
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
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';

// Mock data for initial development
const mockUsers = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "viewer" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "admin" }
];

const mockApplications = [
  { id: 1, name: "HR Portal", description: "Human Resources Management Portal" },
  { id: 2, name: "CRM System", description: "Customer Relationship Management System" },
  { id: 3, name: "Analytics Dashboard", description: "Business Intelligence Dashboard" }
];

const mockPermissions = [
  { id: 1, userId: 1, appId: 1, permission: "admin" },
  { id: 2, userId: 1, appId: 2, permission: "admin" },
  { id: 3, userId: 2, appId: 1, permission: "viewer" },
  { id: 4, userId: 3, appId: 3, permission: "admin" }
];

const Permissions = ({ userRole }) => {
  const [permissions, setPermissions] = useState(mockPermissions);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [permissionType, setPermissionType] = useState('viewer');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Function to get permission entries with user and app details
  const getPermissionEntries = () => {
    return permissions.map(perm => {
      const user = mockUsers.find(u => u.id === perm.userId);
      const app = mockApplications.find(a => a.id === perm.appId);
      return {
        id: perm.id,
        userId: perm.userId,
        appId: perm.appId,
        permission: perm.permission,
        userName: user ? user.name : 'Unknown',
        userEmail: user ? user.email : 'Unknown',
        appName: app ? app.name : 'Unknown'
      };
    }).filter(perm => 
      perm.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleAddPermission = () => {
    if (selectedUser && selectedApp) {
      // Check if permission already exists
      const existingPermIndex = permissions.findIndex(
        perm => perm.userId === selectedUser && perm.appId === selectedApp
      );

      if (existingPermIndex >= 0) {
        // Update existing permission
        const updatedPermissions = [...permissions];
        updatedPermissions[existingPermIndex] = {
          ...updatedPermissions[existingPermIndex],
          permission: permissionType
        };
        setPermissions(updatedPermissions);
      } else {
        // Add new permission
        const newPermission = {
          id: permissions.length + 1,
          userId: selectedUser,
          appId: selectedApp,
          permission: permissionType
        };
        setPermissions([...permissions, newPermission]);
      }

      // Reset selection
      setSelectedUser(null);
      setSelectedApp(null);
      setPermissionType('viewer');
    }
  };

  const handleDeletePermission = (permissionId) => {
    setPermissions(permissions.filter(perm => perm.id !== permissionId));
  };

  const permissionEntries = getPermissionEntries();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        User Permissions
      </Typography>

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
                  value={selectedUser || ''}
                  label="User"
                  onChange={(e) => setSelectedUser(e.target.value)}
                  disabled={userRole !== 'admin'}
                >
                  <MenuItem value="">
                    <em>Select a user</em>
                  </MenuItem>
                  {mockUsers.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Application</InputLabel>
                <Select
                  value={selectedApp || ''}
                  label="Application"
                  onChange={(e) => setSelectedApp(e.target.value)}
                  disabled={userRole !== 'admin'}
                >
                  <MenuItem value="">
                    <em>Select an application</em>
                  </MenuItem>
                  {mockApplications.map(app => (
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
                  disabled={userRole !== 'admin'}
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
                disabled={!selectedUser || !selectedApp || userRole !== 'admin'}
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
                    {userRole === 'admin' && <TableCell>Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {permissionEntries
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.userName}</TableCell>
                        <TableCell>{entry.userEmail}</TableCell>
                        <TableCell>{entry.appName}</TableCell>
                        <TableCell>
                          <Chip 
                            label={entry.permission} 
                            color={entry.permission === 'admin' ? 'primary' : 'default'} 
                            size="small" 
                          />
                        </TableCell>
                        {userRole === 'admin' && (
                          <TableCell>
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => handleDeletePermission(entry.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
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
    </Box>
  );
};

export default Permissions; 