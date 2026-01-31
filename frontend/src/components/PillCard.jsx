import React, { useState } from 'react';

export default function PillCard({ medication }) {
  const [taken, setTaken] = useState(false);

  const handleMarkAsTaken = () => {
    setTaken(true);
    // TODO: Send to API to record dose
    console.log(`Marked ${medication.name} as taken`);
  };

  return (
    <div className="pill-card">
      <div className="pill-header">
        <h3>{medication.name}</h3>
        <span className="dosage">{medication.dosage}</span>
      </div>

      <div className="pill-details">
        <p><strong>Frequency:</strong> {medication.frequency}</p>
        <p><strong>Time:</strong> {medication.time}</p>
        <p><strong>Instructions:</strong> {medication.instructions}</p>
      </div>

      <div className="pill-actions">
        <button
          onClick={handleMarkAsTaken}
          disabled={taken}
          className={taken ? 'taken' : ''}
        >
          {taken ? 'Marked as Taken' : 'Mark as Taken'}
        </button>
      </div>
    </div>
  );
}
