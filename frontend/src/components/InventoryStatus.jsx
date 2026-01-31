import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function InventoryStatus() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch inventory from API
    setLoading(false);
  }, []);

  const handleReorderClick = (medicationId) => {
    // TODO: Trigger reorder process
    console.log(`Reordering medication ${medicationId}`);
  };

  if (loading) {
    return <div>Loading inventory...</div>;
  }

  return (
    <div className="inventory-status">
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Medication</th>
            <th>Stock Level</th>
            <th>Days Remaining</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id} className={`status-${item.status}`}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.daysRemaining}</td>
              <td className="status-badge">{item.status}</td>
              <td>
                {item.status === 'low' && (
                  <button onClick={() => handleReorderClick(item.id)}>
                    Reorder
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
