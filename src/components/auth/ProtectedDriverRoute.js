import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedDriverRoute = () => {
  const { currentUser, initialized } = useAuth();
  const location = useLocation();

  // Debug logs
  useEffect(() => {
    console.log('ProtectedDriverRoute - currentUser:', currentUser);
    console.log('ProtectedDriverRoute - pathname:', location.pathname);
  }, [currentUser, location]);

  // Show loading state while auth is initializing
  if (!initialized) {
    console.log('Auth not yet initialized, showing loading...');
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading driver dashboard...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    console.log('No current user, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has driver role
  if (currentUser.role !== 'driver') {
    console.log('User role is not driver, redirecting to unauthorized. Role:', currentUser.role);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('User has driver role, rendering driver dashboard');
  // If authenticated and has driver role, render the protected content
  return <Outlet />;
};

export default ProtectedDriverRoute;
