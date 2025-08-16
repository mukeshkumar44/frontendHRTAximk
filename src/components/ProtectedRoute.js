import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAdmin = false }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If admin route but user is not admin
  if (isAdmin && (!user || user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
