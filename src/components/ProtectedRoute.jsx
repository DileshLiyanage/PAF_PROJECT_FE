import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  let roles = [];
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    roles = Array.isArray(user.roles) ? user.roles : [];
  } catch (e) {
    roles = [];
  }

  if (allowedRoles.length > 0 && !roles.some(r => allowedRoles.includes(r))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
