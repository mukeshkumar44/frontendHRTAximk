import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Create axios instance with auth token
const apiClient = axios.create({
  baseURL: '', // Base URL is now handled by API_ENDPOINTS
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add auth token to requests
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const driverService = {
  // Get driver's profile
  getProfile: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DRIVER_PROFILE);
      return response;
    } catch (error) {
      console.error('Error fetching driver profile:', error);
      throw error;
    }
  },
  
  // Note: Removed getMyTaxi function since we get taxi data from the profile
  
  // Get driver's bookings
  getMyBookings: async (status = '') => {
    try {
      console.log('Fetching driver bookings...');
      const params = status ? { status } : {};
      const response = await apiClient.get(API_ENDPOINTS.DRIVER_BOOKINGS, { params });
      return response;
    } catch (error) {
      console.error('Error fetching driver bookings:', error);
      throw error;
    }
  },
  
  // Update booking status (accept/reject/complete)
  updateBookingStatus: async (bookingId, status) => {
    try {
      const response = await apiClient.patch(`${API_ENDPOINTS.DRIVER_BOOKINGS}/${bookingId}`, { status });
      return response;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },
  
  // Update driver's current location
  updateLocation: async (location) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.DRIVER_LOCATION, location);
      return response;
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  },
  
  // Update taxi status (online/offline)
  updateTaxiStatus: async (isOnline) => {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.DRIVER_STATUS, { isOnline });
      return response;
    } catch (error) {
      console.error('Error updating taxi status:', error);
      throw error;
    }
  },
  
  // Get today's earnings
  getTodayEarnings: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DRIVER_EARNINGS_TODAY);
      return response;
    } catch (error) {
      console.error('Error fetching today\'s earnings:', error);
      throw error;
    }
  }
};

export default driverService;
