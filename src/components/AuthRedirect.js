import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthRedirect = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthRedirect - currentUser:', currentUser); // Debug log
    
    if (currentUser) {
      console.log('User role:', currentUser.role); // Debug log
      
      // Redirect based on user role
      if (currentUser.role === 'admin') {
        console.log('Redirecting to admin dashboard');
        navigate('/admin/dashboard');
      } else if (currentUser.role === 'driver') {
        console.log('Redirecting to driver dashboard');
        navigate('/driver/dashboard');
      } else {
        console.log('No specific role, redirecting to home');
        navigate('/');
      }
    } else {
      console.log('No current user, redirecting to home');
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Show loading spinner while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <div className="ml-4 text-gray-600">Redirecting...</div>
    </div>
  );
};

export default AuthRedirect;
