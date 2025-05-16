// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    role: "admin",
    isActive: true,
    createdAt: "2024-01-01T12:00:00Z"
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@example.com",
    role: "viewer",
    isActive: true,
    createdAt: "2024-01-02T12:00:00Z"
  },
  {
    id: 3,
    name: "Charlie",
    email: "charlie@example.com",
    role: "admin",
    isActive: false,
    createdAt: "2024-01-03T12:00:00Z"
  },
  {
    id: 4,
    name: "David",
    email: "david@example.com",
    role: "viewer",
    isActive: true,
    createdAt: "2024-01-04T12:00:00Z"
  },
  {
    id: 5,
    name: "Eve",
    email: "eve@example.com",
    role: "admin",
    isActive: true,
    createdAt: "2024-01-05T12:00:00Z"
  }
];

// Store users in localStorage
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify(mockUsers));
}

const userService = {
  // Get all users
  getUsers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        resolve(users);
      }, 300);
    });
  },
  
  // Get user by ID
  getUserById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.id === id);
        
        if (user) {
          resolve(user);
        } else {
          reject(new Error('User not found'));
        }
      }, 300);
    });
  },
  
  // Create a new user
  createUser: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Generate a new ID
        const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
        const newUser = {
          ...userData,
          id: maxId + 1,
          createdAt: new Date().toISOString()
        };
        
        // Add to array and save to localStorage
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        resolve(newUser);
      }, 500);
    });
  },
  
  // Update a user
  updateUser: async (id, userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const index = users.findIndex(u => u.id === id);
        
        if (index !== -1) {
          // Update user data
          users[index] = { ...users[index], ...userData };
          localStorage.setItem('users', JSON.stringify(users));
          resolve(users[index]);
        } else {
          reject(new Error('User not found'));
        }
      }, 500);
    });
  },
  
  // Delete a user
  deleteUser: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const index = users.findIndex(u => u.id === id);
        
        if (index !== -1) {
          // Remove user from array
          users.splice(index, 1);
          localStorage.setItem('users', JSON.stringify(users));
          resolve({ success: true });
        } else {
          reject(new Error('User not found'));
        }
      }, 500);
    });
  }
};

export default userService; 