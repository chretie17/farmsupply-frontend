
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard';
import FieldOfficerDashboard from './pages/field officer/FieldOfficerDashboard';
import TraineeDashboard from './pages/TraineeDashboard';
import Login from './pages/Login';
import ProtectedRoute from './protectedRoute';
import Sidebar from './pages/Sidebar';
import UserManagement from './pages/admin/ManageUsers';
import FarmerManagement from './pages/ManageFarmers';
import ManageTrainings from './pages/ManageTrainings';
import FieldOfficerTrainings from './pages/field officer/FieldOfficerTrainings';
import FieldOfficerProducts from './pages/field officer/FieldOfficerProducts';
import FinanceOfficerDashboard from './pages/financeDashboard';
import FinanceOrders from './pages/FinanceManageOrderStatus';
import FieldOfficerOrders from './pages/field officer/FieldOfficerOrders';
import AdminOrders from './pages/admin/AdminOrders';
import Report from './pages/admin/report';
import { Box } from '@mui/material';

const drawerWidth = 240; // Set a fixed width for the sidebar

const AppLayout = () => {
  const location = useLocation();

  // Check if the current route is the login page
  const isLoginPage = location.pathname === '/';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {!isLoginPage && <Sidebar />} {/* Render Sidebar only if not on login page */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          marginLeft: !isLoginPage ? `${drawerWidth}px` : '0', // Add left margin if not on the login page
          transition: 'margin-left 0.3s ease', // Smooth transition for margin change
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
          <Route
            path="/field-officer/products"
            element={
              <ProtectedRoute roleRequired="field-officer">
                <FieldOfficerProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finance/dashboard"
            element={
              <ProtectedRoute roleRequired="finance-officer">
                <FinanceOfficerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finance/orders"
            element={
              <ProtectedRoute roleRequired="admin">
                <FinanceOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/field-officer/orders"
            element={
              <ProtectedRoute roleRequired="field-officer">
                <FieldOfficerOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute roleRequired="admin">
                <Report />
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
