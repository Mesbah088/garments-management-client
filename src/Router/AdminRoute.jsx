import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../AuthProvider/authProvider';
import LoadingSpinner from '../Shared/LoadingSpinner';

export default function AdminRoute({ children }) {
  const { user, dbUser, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner text="Checking administrative privileges..." />;
  }

  if (user && dbUser?.role === 'admin') {
    return children;
  }

  return <Navigate to="/dashboard/profile" state={{ from: location }} replace />;
}
