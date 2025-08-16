// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// WebSocket Configuration
export const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:5000';

// Other configuration constants
export const APP_NAME = 'HR Taxi Service';
export const APP_VERSION = '1.0.0';

// Export all configuration
export default {
  API_URL,
  WS_URL,
  APP_NAME,
  APP_VERSION
};
