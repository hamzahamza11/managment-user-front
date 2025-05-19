/**
 * Handle API errors in a consistent way across the application
 * @param {Error} error - The error object from axios 
 * @returns {Promise<never>} - A rejected promise with a standardized error message
 */
export const handleApiError = (error) => {
  // Extract error information
  let errorMessage = 'An unexpected error occurred';
  
  if (error.response) {
    // The server responded with a status code outside of 2xx range
    const status = error.response.status;
    const serverError = error.response.data?.message || error.response.statusText;
    
    if (status === 401) {
      errorMessage = 'You are not authorized to perform this action';
      // Optionally, you might want to redirect to login page or refresh token
    } else if (status === 403) {
      errorMessage = 'You don\'t have permission to access this resource';
    } else if (status === 404) {
      errorMessage = 'The requested resource was not found';
    } else if (status >= 500) {
      errorMessage = 'Server error: ' + serverError;
    } else {
      errorMessage = serverError || errorMessage;
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'No response received from the server. Please check your network connection.';
  } else {
    // Something happened in setting up the request
    errorMessage = error.message;
  }

  // Log the error for debugging purposes
  console.error('API Error:', error);
  
  // Return a rejected promise with the error message
  return Promise.reject(new Error(errorMessage));
}; 