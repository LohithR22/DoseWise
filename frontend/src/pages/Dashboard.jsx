import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PillCard from '../components/PillCard';
import ReminderModal from '../components/ReminderModal';
import InventoryStatus from '../components/InventoryStatus';
import ActionLog from '../components/ActionLog';

export default function Dashboard() {
  const [medications, setMedications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReminder, setActiveReminder] = useState(null);

  useEffect(() => {
    // Simulate fetching data
    const loadData = async () => {
      try {
        // In a real scenario we fetch from API
        // const meds = await api.getMedications();
        // setMedications(meds);

        // Mock data for MVP
        setMedications([
          {
            id: 1,
            name: 'Lisinopril',
            dosage: '10mg',
            time: '08:00 AM',
            instructions: 'Take with food',
            takenToday: false,
            image: 'https://cdn.docprime.com/media/drug/images/lisinopril-10mg-tablet-3605.jpg' // Placeholder
          },
          {
            id: 2,
            name: 'Metformin',
            dosage: '500mg',
            time: '01:00 PM',
            instructions: 'Take after lunch',
            takenToday: false,
            image: 'https://5.imimg.com/data5/SELLER/Default/2023/7/322981329/EX/DI/XN/3890204/metformin-hydrochloride-prolonged-release-tablets-ip.jpg' // Placeholder
          },
          {
            id: 3,
            name: 'Amlodipine',
            dosage: '5mg',
            time: '08:00 PM',
            instructions: 'Take before bed',
            takenToday: false,
            image: 'https://5.imimg.com/data5/SELLER/Default/2022/12/UI/QW/GA/4255304/amlodipine-besylate-tablets-ip-5-mg.jpg' // Placeholder
          }
        ]);

        // Mock Reminder
        setTimeout(() => {
          setActiveReminder({
            id: 1,
            medicationName: 'Lisinopril',
            dosage: '10mg',
            instructions: 'It is time for your morning dose.'
          });
        }, 3000);

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleTakeMedication = (id) => {
    setMedications(medications.map(med =>
      med.id === id ? { ...med, takenToday: true } : med
    ));
    if (activeReminder && activeReminder.id === id) {
      setActiveReminder(null);
    }
  };

  const handleCloseReminder = () => {
    setActiveReminder(null);
  };

  if (loading) return <div className="text-center mt-4">Loading Dashboard...</div>;

  return (
    <div className="dashboard">
      <section className="welcome-banner">
        <h1>Good Morning, John</h1>
        <p className="subtitle">You have 3 medications scheduled for today.</p>
      </section>

      <div className="dashboard-grid">
        <section className="medications-section">
          <div className="section-header">
            <h2>Today's Schedule</h2>
            <span className="badge">3 Pending</span>
          </div>
          <div className="medications-list">
            {medications.map((med) => (
              <PillCard key={med.id} medication={med} onTake={handleTakeMedication} />
            ))}
          </div>
        </section>

        <section className="sidebar">
          <div className="inventory-section mb-4">
            <h2>Inventory Status</h2>
            <InventoryStatus />
          </div>

          <div className="action-log-section">
            <h2>Recent Activity</h2>
            <ActionLog />
          </div>
        </section>
      </div>

      <ReminderModal
        reminder={activeReminder}
        onClose={handleCloseReminder}
        onSnooze={handleCloseReminder}
        onConfirm={(id) => handleTakeMedication(1)} // Hardcoded ID for demo for now
      />

      <style jsx>{`
        .welcome-banner {
            margin-bottom: 2rem;
        }
        .subtitle {
            color: var(--text-secondary);
            font-size: 1.1rem;
        }
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        .badge {
            background: #eff6ff;
            color: var(--primary-color);
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-weight: 600;
            font-size: 0.875rem;
        }
        .sidebar {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
      `}</style>
    </div>
  );
}
