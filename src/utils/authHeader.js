/**
 * Returns an object containing the Authorization header with the JWT token
 * Used for making authenticated API requests
 * @returns {Object} Headers object with Authorization token
 */
export const authHeader = () => {
  // Get the current user from local storage
  const user = JSON.parse(localStorage.getItem('user'));

  // If there is a logged in user with a token, return the Authorization header
  if (user && user.token) {
    return { 
      'Authorization': `Bearer ${user.token}`,
      'Content-Type': 'application/json' 
    };
  } else {
    // Return an empty object if user is not logged in or doesn't have a token
    return { 'Content-Type': 'application/json' };
  }
}; 