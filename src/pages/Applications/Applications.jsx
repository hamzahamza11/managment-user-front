import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,

  TablePagination,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Snackbar,
  CardMedia,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { applicationService } from '../../services';
import { useAuth } from '../../contexts/AuthContextNew';
import AppForm from '../../components/AppForm';

const Applications = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [currentApp, setCurrentApp] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, appId: null, appName: '' });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getApplications();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch applications');
      console.error('Error fetching applications:', err);
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

  const handleOpenForm = (app = null) => {
    setCurrentApp(app);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setCurrentApp(null);
  };

  const handleOpenDeleteConfirm = (appId, appName) => {
    setConfirmDelete({ open: true, appId, appName });
  };

  const handleCloseDeleteConfirm = () => {
    setConfirmDelete({ open: false, appId: null, appName: '' });
  };

  const handleSaveApp = async (appData) => {
    try {
      let result;
      
      if (currentApp) {
        // Update existing app
        result = await applicationService.updateApplication(currentApp.id, appData);
        setApplications(applications.map(app => app.id === currentApp.id ? result : app));
        showSnackbar('Application updated successfully', 'success');
      } else {
        // Create new app
        result = await applicationService.createApplication(appData);
        setApplications([...applications, result]);
        showSnackbar('Application created successfully', 'success');
      }
      
      handleCloseForm();
    } catch (err) {
      showSnackbar(err.message || 'Failed to save application', 'error');
      console.error('Error saving application:', err);
    }
  };

  const handleDeleteApp = async () => {
    const { appId } = confirmDelete;
    
    try {
      await applicationService.deleteApplication(appId);
      setApplications(applications.filter(app => app.id !== appId));
      showSnackbar('Application deleted successfully', 'success');
    } catch (err) {
      showSnackbar('Failed to delete application', 'error');
      console.error('Error deleting application:', err);
    } finally {
      handleCloseDeleteConfirm();
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

  // Filter applications based on search term
  const filteredApps = applications.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.description && app.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading && applications.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const isAdmin = currentUser?.role === 'admin';
console.log("isAdmin" , currentUser)
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Applications
        </Typography>
        {isAdmin && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
          >
            Add Application
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search applications..."
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {filteredApps.length > 0 ? (
        <Grid container spacing={3}>
          {filteredApps
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((app) => (
              <Grid item xs={12} sm={6} md={4} key={app.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="div"
                    sx={{
                      pt: '56.25%', // 16:9 aspect ratio
                      backgroundColor: app.color || '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white'
                      }}
                    >
                      {app.name.substring(0, 2).toUpperCase()}
                    </Typography>
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography gutterBottom variant="h5" component="div">
                        {app.name}
                      </Typography>
                      {isAdmin && (
                        <Box>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenForm(app)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDeleteConfirm(app.id, app.name)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {app.description || 'No description available'}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip 
                        label={app.category || 'General'} 
                        size="small" 
                        sx={{ mr: 1, mb: 1 }} 
                      />
                      <Chip 
                        label={app.url ? 'External' : 'Internal'} 
                        size="small"
                        color={app.url ? 'secondary' : 'default'}
                        sx={{ mb: 1 }} 
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No applications found</Typography>
        </Paper>
      )}

      <TablePagination
        component="div"
        count={filteredApps.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[6, 12, 24]}
      />

      {/* Application Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentApp ? 'Edit Application' : 'Add Application'}
        </DialogTitle>
        <DialogContent>
          <AppForm 
            initialValues={currentApp || {}} 
            onSubmit={handleSaveApp} 
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDelete.open} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Delete Application</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{confirmDelete.appName}"? This will also remove all associated permissions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button onClick={handleDeleteApp} color="error" variant="contained">
            Delete
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

export default Applications; 