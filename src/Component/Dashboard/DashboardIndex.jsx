import React, { useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../../AuthProvider/authProvider';
import AdminDashboard from './Admin/AdminDashboard';
import ManageProducts from './Manager/ManageProducts';
import MyOrders from './Buyer/MyOrders';
import LoadingSpinner from '../../Shared/LoadingSpinner';

export default function DashboardIndex() {
  const { dbUser, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  const role = dbUser?.role || 'buyer';

  if (role === 'admin') {
    return <AdminDashboard />;
  }

  if (role === 'manager') {
    return <ManageProducts />;
  }

  return <MyOrders />;
}
