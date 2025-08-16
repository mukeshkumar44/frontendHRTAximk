import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedDriverRoute = () => {
  const { currentUser, initialized } = useAuth();

  // Show loading state while auth is initializing
  if (!initialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: '/driver/dashboard' }} replace />;
  }

  // If authenticated, render the protected content
  return <Outlet />;
};

export default ProtectedDriverRoute;
