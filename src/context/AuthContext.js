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
      console.log('Starting login process...');
      const response = await authService.login(credentials);
      
      console.log('Login response received:', {
        hasToken: !!response.data?.token,
        userData: response.data?.user,
        fullResponse: response.data
      });
      
      // Ensure we have the expected response structure
      if (response.data?.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // The backend returns user data in response.data.user
        let userData;
        if (response.data.user) {
          // Ensure role is set correctly - check both possible locations for role
          const roleFromResponse = response.data.user.role || response.data.role;
          const userRole = roleFromResponse || 'user';
          
          console.log('Creating user data with role:', userRole);
          
          userData = {
            id: response.data.user.id || response.data.user._id,
            name: response.data.user.name,
            email: response.data.user.email,
            role: userRole.toLowerCase(), // Ensure lowercase for consistency
            isVerified: response.data.user.isVerified || false
          };
          
          console.log('Final user data being set:', userData);
          localStorage.setItem('user', JSON.stringify(userData));
          setCurrentUser(userData);
          return { ...response.data, user: userData };
        } else {
          console.log('No user data in response, fetching user info...');
          // If no user data in response, fetch it using the token
          try {
            const userResponse = await authService.getCurrentUser();
            console.log('Fetched user data:', userResponse.data);
            
            if (userResponse.data) {
              userData = {
                ...userResponse.data,
                role: (userResponse.data.role || 'user').toLowerCase()
              };
              console.log('Setting fetched user data:', userData);
              localStorage.setItem('user', JSON.stringify(userData));
              setCurrentUser(userData);
              return { ...response.data, user: userData };
            }
          } catch (fetchError) {
            console.error('Error fetching user data:', fetchError);
            throw new Error('Failed to fetch user information');
          }
        }
      } else {
        console.error('Login failed:', response.data?.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      throw new Error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      return response.data;
    } catch (err) {
      console.error('Signup error:', err);
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