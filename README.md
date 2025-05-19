# User Management Console

This is a mini administration console for managing users, applications, and permissions.

## Features

- User management (CRUD operations)
- Application management (CRUD operations)
- Permission management
- Role-based access control (admin/viewer)
- JWT authentication

## Tech Stack

### Frontend
- React
- Material UI
- React Router
- Axios for API requests
- JWT for authentication

### Backend
- Node.js
- Express
- JWT for authentication
- In-memory data store (for demo purposes)

## Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Backend Setup
1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm run dev
```
The server will run on http://localhost:4001

### Frontend Setup
1. Navigate to the root directory and install dependencies:
```bash
npm install
```

2. Start the React application:
```bash
npm start
```
The application will run on http://localhost:3000

## Usage

1. Login with any email address and password (for demo purposes)
2. Switch between admin and viewer roles using the toggle in the navbar
3. Admin users can create, edit, and delete resources
4. Viewer users can only view resources

## API Endpoints

### Authentication
- `POST /auth/login` - Authenticate user

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user
- `PUT /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user

### Applications
- `GET /applications` - Get all applications
- `GET /applications/:id` - Get application by ID
- `POST /applications` - Create a new application
- `PUT /applications/:id` - Update an application
- `DELETE /applications/:id` - Delete an application

### Permissions
- `GET /permissions` - Get all permissions
- `GET /users/:id/permissions` - Get permissions for a user
- `GET /applications/:id/permissions` - Get permissions for an application
- `POST /users/:id/permissions` - Create/update user permission
- `DELETE /permissions/:id` - Delete a permission

## Project Structure

```
├── public/               # Static files
├── server/               # Backend server
│   ├── server.js         # Express server setup
│   └── package.json      # Backend dependencies
├── src/
│   ├── components/       # Reusable UI components
│   ├── layouts/          # Page layouts
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── routes/           # Route configuration
│   ├── App.js            # Main component
│   └── index.js          # Entry point
└── package.json          # Frontend dependencies
```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
