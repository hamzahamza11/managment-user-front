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
  IconButton,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// Mock data for initial development
const initialApplications = [
  {
    id: 1,
    name: "HR Portal",
    description: "Human Resources Management Portal"
  },
  {
    id: 2,
    name: "CRM System",
    description: "Customer Relationship Management System"
  },
  {
    id: 3,
    name: "Analytics Dashboard",
    description: "Business Intelligence Dashboard"
  }
];

const Applications = ({ userRole }) => {
  const [applications, setApplications] = useState(initialApplications);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

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

  const filteredApplications = applications.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddApplication = () => {
    // To be implemented: Open a modal/form to add a new application
    console.log("Add application clicked");
  };

  const handleEditApplication = (appId) => {
    // To be implemented: Open a modal/form to edit the application
    console.log("Edit application:", appId);
  };

  const handleDeleteApplication = (appId) => {
    // To be implemented: Confirm and delete the application
    console.log("Delete application:", appId);
  };

  const handleViewDetails = (app) => {
    setSelectedApp(app);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Applications
        </Typography>
        {userRole === 'admin' && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleAddApplication}
          >
            Add Application
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={selectedApp ? 8 : 12}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search applications..."
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
              <Table aria-label="applications table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredApplications
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>{app.id}</TableCell>
                        <TableCell>{app.name}</TableCell>
                        <TableCell>{app.description}</TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            color="info" 
                            onClick={() => handleViewDetails(app)}
                          >
                            <InfoIcon fontSize="small" />
                          </IconButton>
                          {userRole === 'admin' && (
                            <>
                              <IconButton 
                                size="small" 
                                color="primary" 
                                onClick={() => handleEditApplication(app.id)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => handleDeleteApplication(app.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredApplications.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>

        {selectedApp && (
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Application Details
                </Typography>
                <Typography variant="subtitle1">
                  {selectedApp.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {selectedApp.description}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  Application ID
                </Typography>
                <Typography variant="body2" paragraph>
                  {selectedApp.id}
                </Typography>
                
                {/* More details can be added here */}
                
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => setSelectedApp(null)}
                  >
                    Close Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Applications; 