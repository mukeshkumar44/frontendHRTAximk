// frontend/src/config/api.js
const BASE_URL = 'http://localhost:5000';

const createEndpoint = (path) => {
  const cleanPath = path.replace(/^\/+|\/+$/g, '').replace(/^api\//, '');
  return `${BASE_URL}/api/${cleanPath}`;
};

export const API_ENDPOINTS = {
  BASE_URL,

  // Tours
  TOUR_PACKAGES: createEndpoint('tour-packages'),

  // Gallery
  GALLERY: createEndpoint('gallery'),

  // Auth
  LOGIN: createEndpoint('users/login'),
  REGISTER: createEndpoint('users/register'),

  // Taxi
  TAXI_BOOKING: createEndpoint('bookings'),
  TAXI_AVAILABILITY: createEndpoint('taxis/availability'),
  TAXI_REGISTRATION: createEndpoint('taxis/register'),

  // Users
  USER_PROFILE: createEndpoint('users/me'),

  // Admin
  ADMIN_DASHBOARD: createEndpoint('admin/dashboard'),

  // Contact
  CONTACT: createEndpoint('contacts')
};

export default API_ENDPOINTS;
