// Mock data for applications
const mockApplications = [
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
  },
  {
    id: 4,
    name: "Inventory System",
    description: "Warehouse and Inventory Management System"
  },
  {
    id: 5,
    name: "Accounting Software",
    description: "Financial and Accounting Management Platform"
  }
];

// Store applications in localStorage
if (!localStorage.getItem('applications')) {
  localStorage.setItem('applications', JSON.stringify(mockApplications));
}

const applicationService = {
  // Get all applications
  getApplications: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const applications = JSON.parse(localStorage.getItem('applications')) || [];
        resolve(applications);
      }, 300);
    });
  },
  
  // Get application by ID
  getApplicationById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const applications = JSON.parse(localStorage.getItem('applications')) || [];
        const application = applications.find(a => a.id === id);
        
        if (application) {
          resolve(application);
        } else {
          reject(new Error('Application not found'));
        }
      }, 300);
    });
  },
  
  // Create a new application
  createApplication: async (applicationData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const applications = JSON.parse(localStorage.getItem('applications')) || [];
        
        // Generate a new ID
        const maxId = applications.reduce((max, app) => Math.max(max, app.id), 0);
        const newApplication = {
          ...applicationData,
          id: maxId + 1
        };
        
        // Add to array and save to localStorage
        applications.push(newApplication);
        localStorage.setItem('applications', JSON.stringify(applications));
        
        resolve(newApplication);
      }, 500);
    });
  },
  
  // Update an application
  updateApplication: async (id, applicationData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const applications = JSON.parse(localStorage.getItem('applications')) || [];
        const index = applications.findIndex(a => a.id === id);
        
        if (index !== -1) {
          // Update application data
          applications[index] = { ...applications[index], ...applicationData };
          localStorage.setItem('applications', JSON.stringify(applications));
          resolve(applications[index]);
        } else {
          reject(new Error('Application not found'));
        }
      }, 500);
    });
  },
  
  // Delete an application
  deleteApplication: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const applications = JSON.parse(localStorage.getItem('applications')) || [];
        const index = applications.findIndex(a => a.id === id);
        
        if (index !== -1) {
          // Remove application from array
          applications.splice(index, 1);
          localStorage.setItem('applications', JSON.stringify(applications));
          resolve({ success: true });
        } else {
          reject(new Error('Application not found'));
        }
      }, 500);
    });
  }
};

export default applicationService; 