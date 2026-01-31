import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Caregiver() {
  const [caregiverData, setCaregiverData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch caregiver dashboard data from API
    setLoading(false);
  }, []);

  const handleAcknowledgeAlert = (alertId) => {
    // TODO: Send acknowledgment to API
    setAlerts(alerts.filter((alert) => alert.id !== alertId));
  };

  if (loading) {
    return <div>Loading caregiver dashboard...</div>;
  }

  return (
    <div className="caregiver-page">
      <h1>Caregiver Dashboard</h1>

      <section className="alerts-section">
        <h2>Active Alerts</h2>
        {alerts.length === 0 ? (
          <p>No active alerts</p>
        ) : (
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div key={alert.id} className="alert-card">
                <h3>{alert.title}</h3>
                <p>{alert.message}</p>
                <p className="timestamp">{alert.timestamp}</p>
                <button onClick={() => handleAcknowledgeAlert(alert.id)}>
                  Acknowledge
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="patient-status-section">
        <h2>Patient Status</h2>
        {caregiverData && (
          <div className="status-details">
            <p><strong>Patient:</strong> {caregiverData.patientName}</p>
            <p><strong>Last Check-in:</strong> {caregiverData.lastCheckIn}</p>
            <p><strong>Medication Adherence:</strong> {caregiverData.adherenceRate}%</p>
          </div>
        )}
      </section>
    </div>
  );
}
