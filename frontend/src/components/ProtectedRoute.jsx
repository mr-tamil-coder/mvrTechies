import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Protects customer-only routes — redirects to /login if not authenticated
export const ProtectedRoute = ({ children }) => {
  const { currentUser } = useApp();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Protects admin-only routes — redirects to /admin/login if not admin
export const AdminRoute = ({ children }) => {
  const { currentUser } = useApp();
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};
