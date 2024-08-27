import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

 

  if (!token) {
    // User is not authenticated, redirect to login
    return <Navigate to="/" />;
  }

  if (roleRequired.includes(role)) {
    // User is authorized, render the component
    return children;
  } else {
    // User is not authorized, redirect to login
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
