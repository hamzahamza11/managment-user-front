import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
 
  Stack
} from '@mui/material';

const UserForm = ({ initialValues = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    email: initialValues.email || '',
    password: '',
    role: initialValues.role || 'viewer'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is not valid';
    }
    
    // Only validate password for new users
    if (!initialValues.id && !formData.password) {
      newErrors.password = 'Password is required for new users';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // For existing users, only include password if it's been changed
      const dataToSubmit = { ...formData };
      if (initialValues.id && !formData.password) {
        delete dataToSubmit.password;
      }
      onSubmit(dataToSubmit);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        label="Name"
        name="name"
        autoFocus
        value={formData.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
      />
      
      <TextField
        margin="normal"
        required={!initialValues.id}
        fullWidth
        label={initialValues.id ? 'New Password (leave blank to keep current)' : 'Password'}
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
      />
      
      {/* <FormControl 
        fullWidth 
        margin="normal"
        error={!!errors.role}
      >
        <InputLabel>Role</InputLabel>
        <Select
          name="role"
          value={formData.role}
          label="Role"
          onChange={handleChange}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="viewer">Viewer</MenuItem>
        </Select>
        {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
      </FormControl> */}
      
      <Stack direction="row" spacing={2} sx={{ mt: 3, mb: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
        >
          {initialValues.id ? 'Update User' : 'Create User'}
        </Button>
      </Stack>
    </Box>
  );
};

export default UserForm; 