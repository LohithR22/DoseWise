import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const api = {
  // --- Medications & State ---
  getCurrentState: async () => {
    // Equivalent to get current state of medication schedule for the day
    const response = await apiClient.get('/state');
    return response.data;
  },

  getMedications: async () => {
    const response = await apiClient.get('/medications');
    return response.data;
  },

  confirmDose: async (medicationId) => {
    const response = await apiClient.post(`/medications/${medicationId}/confirm`, {
      timestamp: new Date().toISOString(),
    });
    return response.data;
  },

  // --- Setup & Config ---
  submitSetup: async (setupData) => {
    const response = await apiClient.post('/setup', setupData);
    return response.data;
  },

  // --- Vitals ---
  submitVitals: async (vitalData) => {
    const response = await apiClient.post('/vitals', vitalData);
    return response.data;
  },

  getHealthTrends: async () => {
    const response = await apiClient.get('/vitals/trends');
    return response.data;
  },

  // --- Caregiver & Alerts ---
  getAlerts: async () => {
    const response = await apiClient.get('/alerts');
    return response.data;
  },

  acknowledgeAlert: async (alertId) => {
    const response = await apiClient.post(`/alerts/${alertId}/acknowledge`);
    return response.data;
  },

  // --- Images ---
  uploadMedicationImage: async (medicationId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/medications/${medicationId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;
