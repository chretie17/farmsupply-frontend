import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import FieldOfficerDashboard from './pages/FieldOfficerDashboard';
import TraineeDashboard from './pages/TraineeDashboard';
import Login from './pages/Login';
import ProtectedRoute from './protectedRoute';
import Sidebar from './pages/Sidebar';
import UserManagement from './pages/ManageUsers'; 
import FarmerManagement from './pages/ManageFarmers';
import ManageTrainings from './pages/ManageTrainings'; 
import FieldOfficerTrainings from './pages/FieldOfficerTrainings';
import { Box } from '@mui/material';

const drawerWidth = 100; // Set a fixed width for the sidebar

const AppLayout = () => {
  const location = useLocation();

  // Check if the current route is the login page
  const isLoginPage = location.pathname === '/';

  return (
    <Box sx={{ display: 'flex' }}>
      {!isLoginPage && <Sidebar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          marginLeft: !isLoginPage ? `${drawerWidth}px` : '0', // Add left margin if not on the login page
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/field-officer/dashboard"
            element={
              <ProtectedRoute roleRequired="field-officer">
                <FieldOfficerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trainee/dashboard"
            element={
              <ProtectedRoute roleRequired="trainee">
                <TraineeDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roleRequired="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/trainings"
            element={
              <ProtectedRoute roleRequired="admin">
                <ManageTrainings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/farmer-management"
            element={
              <ProtectedRoute roleRequired={['admin', 'field-officer']}>
                <FarmerManagement />
              </ProtectedRoute>
            }
          />
          <Route
  path="/field-officer/trainings"
  element={
    <ProtectedRoute roleRequired="field-officer">
      <FieldOfficerTrainings />
    </ProtectedRoute>
  }
/>
        </Routes>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
