import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleProtectedRoute = ({ allowedRole, children }) => {
  const role = sessionStorage.getItem("role");

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (role !== allowedRole) {
    return <Navigate to="/restaurants" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
