import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Get user data from localStorage or fetch from API
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
          setLoading(false);
        } else {
          // Fetch user data from API if not in localStorage
          const response = await authService.getCurrentUser();
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to load profile. Please try again.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl font-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">My Profile</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {user && (
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                <p className="text-lg font-semibold">{user.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                <p className="text-lg font-semibold">{user.email}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                <p className="text-lg font-semibold">{user.phone || 'Not provided'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Account Status</h3>
                <p className="text-lg font-semibold">
                  {user.isVerified ? (
                    <span className="text-green-600">Verified</span>
                  ) : (
                    <span className="text-red-600">Not Verified</span>
                  )}
                </p>
              </div>
            </div>
            
<<<<<<< HEAD
            <div className="mt-8 flex justify-center space-x-4">
=======
            <div className="mt-8 flex flex-wrap justify-center gap-4">
>>>>>>> e609d61 (first commit)
              <button 
                onClick={() => navigate('/booking')} 
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-300"
              >
                Book a Taxi
              </button>
              
              <button 
                onClick={() => navigate('/my-bookings')} 
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-300"
              >
                My Bookings
              </button>
<<<<<<< HEAD
=======

              {user.role === 'driver' && (
                <button 
                  onClick={() => navigate('/taxi-status')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-300"
                >
                  My Taxi Status
                </button>
              )}
>>>>>>> e609d61 (first commit)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;