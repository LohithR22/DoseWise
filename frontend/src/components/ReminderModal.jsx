import React, { useState } from 'react';

export default function ReminderModal({ reminders }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSnooze = (reminderId, minutes = 15) => {
    // TODO: Send snooze request to API
    console.log(`Snoozed reminder ${reminderId} for ${minutes} minutes`);
  };

  const handleDismiss = (reminderId) => {
    // TODO: Send dismiss request to API
    console.log(`Dismissed reminder ${reminderId}`);
  };

  return (
    <div className="reminder-modal">
      <button onClick={() => setIsOpen(!isOpen)} className="modal-toggle">
        {reminders.length} Pending Reminders
      </button>

      {isOpen && (
        <div className="modal-content">
          {reminders.length === 0 ? (
            <p>No pending reminders</p>
          ) : (
            <ul className="reminders-list">
              {reminders.map((reminder) => (
                <li key={reminder.id} className="reminder-item">
                  <div className="reminder-info">
                    <h4>{reminder.medicationName}</h4>
                    <p>{reminder.dosage}</p>
                    <span className="time">{reminder.time}</span>
                  </div>
                  <div className="reminder-actions">
                    <button onClick={() => handleSnooze(reminder.id)}>
                      Snooze
                    </button>
                    <button onClick={() => handleDismiss(reminder.id)}>
                      Dismiss
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
