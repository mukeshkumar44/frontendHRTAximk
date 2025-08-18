import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth token
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

const driverService = {
  // Get driver's profile
  getProfile: () => apiClient.get('/driver/me'),
  
  // Update driver's profile
  updateProfile: (data) => apiClient.put('/driver/me', data),
  
  // Get driver's bookings
  getMyBookings: (status = '') => {
    const params = {};
    if (status) params.status = status;
    return apiClient.get('/driver/bookings', { params });
  },
  
  // Get booking details
  getBookingDetails: (bookingId) => apiClient.get(`/driver/bookings/${bookingId}`),
  
  // Update booking status (accept/reject/complete)
  updateBookingStatus: (bookingId, data) => 
    apiClient.patch(`/driver/bookings/${bookingId}/status`, data),
  
  // Update driver's current location
  updateLocation: (location) => 
    apiClient.post('/driver/location', location),
  
  // Accept a booking
  acceptBooking: (bookingId) => 
    apiClient.patch(`/driver/bookings/${bookingId}/accept`),
    
  // Reject a booking
  rejectBooking: (bookingId) => 
    apiClient.patch(`/driver/bookings/${bookingId}/reject`),
    
  // Complete a booking
  completeBooking: (bookingId) => 
    apiClient.patch(`/driver/bookings/${bookingId}/complete`),
  
  // Get today's earnings
  getTodayEarnings: () => apiClient.get('/driver/earnings/today'),
  
  // Get driver's performance stats
  getPerformanceStats: (period = 'week') => 
    apiClient.get(`/driver/performance?period=${period}`),
    
  // Get driver's taxi information
  getMyTaxi: () => apiClient.get('/driver/my-taxi'),
  
  // Update taxi status (online/offline)
  updateTaxiStatus: (isOnline) => 
    apiClient.patch('/driver/taxi/status', { isOnline })
};

export default driverService;
