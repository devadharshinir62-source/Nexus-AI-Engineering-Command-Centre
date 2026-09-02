import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicOnlyRoute: React.FC = () => {
  const { token } = useAuth();
  if (token) {
    // If already logged in, redirect to dashboard
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default PublicOnlyRoute;
