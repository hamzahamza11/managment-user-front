import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,

  Stack,

} from '@mui/material';



const AppForm = ({ initialValues = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    description: initialValues.description || '',
 
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
    
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
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
        fullWidth
        label="Description"
        name="description"
        multiline
        rows={3}
        value={formData.description}
        onChange={handleChange}
      />
      
    
      
    

    
      
      <Stack direction="row" spacing={2} sx={{ mt: 3, mb: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ bgcolor: formData.color }}
        >
          {initialValues.id ? 'Update Application' : 'Create Application'}
        </Button>
      </Stack>
    </Box>
  );
};

export default AppForm; 