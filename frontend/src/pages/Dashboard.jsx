import React, { useState, useEffect } from 'react';
import PillCard from '../components/PillCard';
import ReminderModal from '../components/ReminderModal';
import InventoryStatus from '../components/InventoryStatus';
import ActionLog from '../components/ActionLog';

export default function Dashboard() {
  const [medications, setMedications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch medications and reminders from API
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Medication Dashboard</h1>
      
      <div className="dashboard-grid">
        <section className="medications-section">
          <h2>Current Medications</h2>
          <div className="medications-list">
            {medications.map((med) => (
              <PillCard key={med.id} medication={med} />
            ))}
          </div>
        </section>

        <section className="reminders-section">
          <h2>Reminders</h2>
          <ReminderModal reminders={reminders} />
        </section>

        <section className="inventory-section">
          <h2>Inventory Status</h2>
          <InventoryStatus />
        </section>

        <section className="action-log-section">
          <h2>Action Log</h2>
          <ActionLog />
        </section>
      </div>
    </div>
  );
}
