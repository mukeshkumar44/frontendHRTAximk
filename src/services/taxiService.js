import axios from 'axios';
import { API_URL } from '../config';

// Get current user's taxi status
export const getMyTaxi = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/taxis/my-taxi`, config);
  return response.data;
};

// Get taxi by ID
export const getTaxi = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/taxis/${id}`, config);
  return response.data;
};

// Update taxi status (for drivers)
export const updateTaxiStatus = async (taxiId, statusData, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.patch(
    `${API_URL}/taxis/${taxiId}/status`,
    statusData,
    config
  );
  return response.data;
};

// Upload taxi documents
export const uploadTaxiDocuments = async (formData, token) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API_URL}/taxis/upload-documents`,
    formData,
    config
  );
  return response.data;
};
