import axios from 'axios';

const API_URL = 'https://backendhrtaxi.onrender.com/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    console.log('Token for request:', token ? 'Token exists' : 'No token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('API Error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

// API services
export const bookingService = {
  createBooking: async (bookingData) => {
    try {
      console.log('Sending booking data:', bookingData);
      const response = await apiClient.post('/bookings', bookingData);
      console.log('Booking response:', response.data);
      return response;
    } catch (error) {
      console.error('Booking error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      throw error;
    }
  },
  getBookings: () => apiClient.get('/bookings'),
  getBookingById: (id) => apiClient.get(`/bookings/${id}`),
  updateBookingStatus: (id, status) => apiClient.patch(`/bookings/${id}/status`, { status })
};

export const contactService = {
  sendMessage: (contactData) => apiClient.post('/contact', contactData)
};

export const authService = {
  register: (userData) => apiClient.post('/users/register', userData),
  login: async (credentials) => {
    console.log('Login request data before sending:', JSON.stringify(credentials, null, 2));
    try {
      const response = await apiClient.post('/users/login', {
        email: credentials?.email?.trim() || '',
        password: credentials?.password || ''
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Login successful - Full response:', {
        status: response.status,
        headers: response.headers,
        data: response.data,
        user: response.data?.user,
        role: response.data?.user?.role
      });
      
      // Ensure response has the expected structure
      if (response.data && response.data.user) {
        console.log('User role from API:', response.data.user.role);
      } else {
        console.warn('Login response missing user data:', response.data);
      }
      
      return response;
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        request: error.request,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      throw error;
    }
  },
  getCurrentUser: () => apiClient.get('/users/me'),
  // OTP related endpoints
  sendOtp: (email) => apiClient.post('/users/send-otp', { email }),
  verifyOtp: (email, otp) => apiClient.post('/users/verify-otp', { email, otp }),
  resetPassword: (email, otp, newPassword) => 
    apiClient.post('/users/reset-password', { email, otp, newPassword })
};

// Admin service
export const adminService = {
  // Users management
  getAllUsers: () => apiClient.get('/admin/users'),
  getUserById: (id) => apiClient.get(`/admin/users/${id}`),
  updateUser: (id, userData) => apiClient.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
  
  // Bookings management
  getAllBookings: () => apiClient.get('/admin/bookings'),
  updateBooking: (id, bookingData) => apiClient.put(`/admin/bookings/${id}`, bookingData),
  deleteBooking: (id) => apiClient.delete(`/admin/bookings/${id}`),
  
  // Taxi management
  getAllTaxis: () => apiClient.get('/admin/taxis'),
  getTaxiById: (id) => apiClient.get(`/admin/taxis/${id}`),
  updateTaxiStatus: (id, status, rejectionReason = '') => {
    console.log('Updating taxi status:', { id, status, rejectionReason });
    const requestData = { 
      status,
      ...(status === 'rejected' && rejectionReason && { rejectionReason })
    };
    console.log('Sending request data:', requestData);
    return apiClient.patch(`/admin/taxis/${id}/status`, requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  deleteTaxi: (id) => apiClient.delete(`/admin/taxis/${id}`),
  
  // Dashboard statistics
  getDashboardStats: async () => {
    try {
      console.log('Fetching dashboard stats...');
      const response = await apiClient.get('/admin/dashboard');
      console.log('Dashboard stats response:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      throw error;
    }
  }
};

export default {
  bookingService,
  contactService,
  authService,
  adminService
};