// FastAPI client for DoseWise frontend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = {
  // Medications
  getMedications: async () => {
    const response = await fetch(`${API_BASE_URL}/medications`);
    return response.json();
  },

  addMedication: async (medication) => {
    const response = await fetch(`${API_BASE_URL}/medications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medication),
    });
    return response.json();
  },

  // Vitals
  getVitals: async () => {
    const response = await fetch(`${API_BASE_URL}/vitals`);
    return response.json();
  },

  recordVitals: async (vitals) => {
    const response = await fetch(`${API_BASE_URL}/vitals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vitals),
    });
    return response.json();
  },

  // Reminders
  getReminders: async () => {
    const response = await fetch(`${API_BASE_URL}/reminders`);
    return response.json();
  },

  snoozeReminder: async (reminderId, minutes) => {
    const response = await fetch(`${API_BASE_URL}/reminders/${reminderId}/snooze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutes }),
    });
    return response.json();
  },

  dismissReminder: async (reminderId) => {
    const response = await fetch(`${API_BASE_URL}/reminders/${reminderId}/dismiss`, {
      method: 'POST',
    });
    return response.json();
  },
};

export default api;
