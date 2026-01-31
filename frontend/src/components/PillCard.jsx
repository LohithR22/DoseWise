import React, { useState } from 'react';
import api from '../services/api';

export default function PillCard({ medication, onTake }) {
  const [loading, setLoading] = useState(false);
  const [taken, setTaken] = useState(medication.takenToday);

  const handleMarkAsTaken = async () => {
    setLoading(true);
    try {
      await api.confirmDose(medication.id);
      setTaken(true);
      if (onTake) onTake(medication.id);
    } catch (error) {
      console.error('Failed to confirm dose:', error);
      alert('Failed to record dose. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`pill-card ${taken ? 'taken-card' : ''}`}>
      <div className="pill-header">
        <div className="pill-title-group">
          <h3>{medication.name}</h3>
          <span className="dosage">{medication.dosage}</span>
        </div>
      </div>

      <div className="pill-content">
        {medication.image && (
          <div className="pill-image-container">
            <img src={medication.image} alt={medication.name} className="pill-image" />
          </div>
        )}

        <div className="pill-details">
          <div className="detail-item">
            <span className="icon">🕒</span>
            <span>{medication.time}</span>
          </div>
          <div className="detail-item">
            <span className="icon">📝</span>
            <span>{medication.instructions}</span>
          </div>
        </div>
      </div>

      <div className="pill-actions">
        <button
          onClick={handleMarkAsTaken}
          disabled={taken || loading}
          className={`btn-large ${taken ? 'btn-success' : 'btn-primary'}`}
        >
          {loading ? 'Processing...' : taken ? '✓ Taken Today' : 'Confirm Intake'}
        </button>
      </div>

      <style jsx>{`
        .pill-card {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .pill-title-group {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        .pill-content {
            display: flex;
            gap: 1rem;
            align-items: start;
        }
        .pill-image-container {
            width: 80px;
            height: 80px;
            border-radius: var(--radius-md);
            overflow: hidden;
            border: 1px solid var(--border-color);
            background: #f8fafc;
        }
        .pill-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .detail-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
            color: var(--text-secondary);
        }
        .btn-success {
            background-color: var(--secondary-color);
            color: white;
        }
        .taken-card {
            border-left-color: var(--secondary-color);
            opacity: 0.8;
        }
      `}</style>
    </div>
  );
}
