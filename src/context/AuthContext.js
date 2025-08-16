import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          // Verify token is still valid
          try {
            // Add your token validation logic here if needed
            setCurrentUser(JSON.parse(userData));
          } catch (err) {
            console.error('Error parsing user data:', err);
            logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      
      // Ensure we have the expected response structure
      if (response.data?.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // The backend returns user data in response.data.user
<<<<<<< HEAD
        if (response.data.user) {
          const userData = {
=======
        let userData;
        if (response.data.user) {
          userData = {
>>>>>>> e609d61 (first commit)
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role,
            isVerified: response.data.user.isVerified
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          setCurrentUser(userData);
<<<<<<< HEAD
=======
          
          // Return the user data including the role for redirection
          return { ...response.data, user: userData };
>>>>>>> e609d61 (first commit)
        } else {
          // If no user data in response, fetch it using the token
          const userResponse = await authService.getCurrentUser();
          if (userResponse.data) {
<<<<<<< HEAD
            localStorage.setItem('user', JSON.stringify(userResponse.data));
            setCurrentUser(userResponse.data);
          }
        }
        
        return response.data;
=======
            userData = userResponse.data;
            localStorage.setItem('user', JSON.stringify(userData));
            setCurrentUser(userData);
            return { ...response.data, user: userData };
          }
        }
>>>>>>> e609d61 (first commit)
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const isAdmin = () => {
    return currentUser && currentUser.role === 'admin';
  };

  const updateUser = () => {
    // Add your update user logic here
  };

  const value = {
    currentUser,
    loading,
    error,
    initialized,
    login,
    logout,
    updateUser,
    isAuthenticated: !!currentUser,
    user: currentUser // Alias for currentUser for backward compatibility
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;