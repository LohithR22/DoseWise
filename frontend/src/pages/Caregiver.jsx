import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Caregiver() {
  const [alerts, setAlerts] = useState([]);
  const [selectedMedId, setSelectedMedId] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Mock list of medications for the dropdown
  const medications = [
    { id: 1, name: 'Lisinopril' },
    { id: 2, name: 'Metformin' },
    { id: 3, name: 'Amlodipine' }
  ];

  useEffect(() => {
    // Mock data for alerts
    setAlerts([
      { id: 1, title: 'Missed Dose', message: 'John missed his morning Lisinopril dose.', timestamp: '10 mins ago', severity: 'high' },
      { id: 2, title: 'Low Inventory', message: 'Metformin supply is running low (5 pills left).', timestamp: '2 hours ago', severity: 'medium' }
    ]);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedMedId || !uploadFile) {
      alert('Please select a medication and a file.');
      return;
    }

    setUploading(true);
    try {
      await api.uploadMedicationImage(selectedMedId, uploadFile);
      alert('Image uploaded successfully!');
      setUploadFile(null);
      setSelectedMedId('');
      // clear file input
      e.target.reset();
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed (mock). In a real app this would send to server.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="caregiver-page">
      <h1>Caregiver Dashboard</h1>

      <div className="caregiver-grid">
        <section className="stats-cards">
          <div className="stat-card">
            <h3>Adherence Rate</h3>
            <div className="stat-value">92%</div>
            <div className="stat-trend trend-up">↑ 2% this week</div>
          </div>
          <div className="stat-card">
            <h3>Vitals Status</h3>
            <div className="stat-value">Normal</div>
            <div className="stat-sub">BP: 120/80</div>
          </div>
          <div className="stat-card">
            <h3>Next Check-in</h3>
            <div className="stat-value">2 PM</div>
            <div className="stat-sub">Vitals Request</div>
          </div>
        </section>

        <section className="upload-section">
          <h2>Medication Image Verification</h2>
          <div className="upload-card card">
            <p className="mb-4">Upload a clear picture of the pill to help the patient identify it.</p>
            <form onSubmit={handleUpload} className="upload-form">
              <div className="form-group">
                <label>Select Medication</label>
                <select
                  value={selectedMedId}
                  onChange={(e) => setSelectedMedId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Medication --</option>
                  {medications.map(med => (
                    <option key={med.id} value={med.id}>{med.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </form>
          </div>
        </section>

        <section className="alerts-section">
          <h2>Active Alerts</h2>
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div key={alert.id} className={`alert-card severity-${alert.severity}`}>
                <div className="alert-header">
                  <h3>{alert.title}</h3>
                  <span className="timestamp">{alert.timestamp}</span>
                </div>
                <p>{alert.message}</p>
                <div className="alert-actions">
                  <button className="btn-small">Acknowledge</button>
                  <button className="btn-small btn-outline">Call Patient</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        .caregiver-grid {
            display: grid;
            gap: 2rem;
            grid-template-columns: 1fr;
        }
        @media (min-width: 1024px) {
            .caregiver-grid {
                grid-template-columns: 2fr 1fr;
            }
            .stats-cards {
                grid-column: 1 / -1;
            }
        }
        .stats-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
        }
        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-sm);
        }
        .stat-card h3 {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin: 0 0 0.5rem 0;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: var(--text-primary);
        }
        .stat-trend {
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        .trend-up { color: var(--secondary-color); }
        
        .upload-card {
            background: white;
            padding: 1.5rem;
        }
        
        .alert-card.severity-high {
            border-left: 4px solid var(--danger-color);
            background: #fef2f2;
        }
        .alert-card.severity-medium {
            border-left: 4px solid var(--accent-color);
            background: #fffbeb;
        }
        .alert-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .alert-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        .btn-small {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            border-radius: var(--radius-md);
            background: white;
            border: 1px solid var(--border-color);
            cursor: pointer;
        }
        .btn-small:hover {
            background: #f8fafc;
        }
      `}</style>
    </div>
  );
}
