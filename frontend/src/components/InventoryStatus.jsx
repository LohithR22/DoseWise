import React from 'react';

export default function InventoryStatus({ inventory = [] }) {
  // Mock data if none provided (or for initial view)
  const items = inventory.length > 0 ? inventory : [
    { id: 1, name: 'Lisinopril', count: 24, total: 30, unit: 'pills' },
    { id: 2, name: 'Metformin', count: 5, total: 60, unit: 'pills' },
    { id: 3, name: 'Amlodipine', count: 12, total: 30, unit: 'pills' },
  ];

  const getStatusColor = (count, total) => {
    const percentage = (count / total) * 100;
    if (percentage < 20) return 'var(--danger-color)';
    if (percentage < 40) return 'var(--accent-color)';
    return 'var(--secondary-color)';
  };

  return (
    <div className="inventory-status card">
      <ul className="inventory-list">
        {items.map((item) => {
          const color = getStatusColor(item.count, item.total);
          const percentage = (item.count / item.total) * 100;
          const isLow = percentage < 20;

          return (
            <li key={item.id} className="inventory-item">
              <div className="item-header">
                <span className="item-name">{item.name}</span>
                <span className="item-count" style={{ color: isLow ? color : 'inherit' }}>
                  {item.count} left
                </span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${percentage}%`, backgroundColor: color }}
                ></div>
              </div>
              {isLow && <span className="low-stock-warning">⚠️ Low Stock - Refill soon</span>}
            </li>
          );
        })}
      </ul>

      <style jsx>{`
        .inventory-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .inventory-item {
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border-color);
        }
        .inventory-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .item-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        .progress-bar-bg {
            height: 8px;
            background: #e2e8f0;
            border-radius: 9999px;
            overflow: hidden;
        }
        .progress-bar-fill {
            height: 100%;
            border-radius: 9999px;
            transition: width 0.3s ease;
        }
        .low-stock-warning {
            display: block;
            margin-top: 0.5rem;
            color: var(--danger-color);
            font-size: 0.875rem;
            font-weight: 500;
        }
      `}</style>
    </div>
  );
}
