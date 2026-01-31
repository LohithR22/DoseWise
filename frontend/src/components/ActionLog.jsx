import React, { useState, useEffect } from 'react';

export default function ActionLog() {
  const [actions, setActions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch action log from API
    setLoading(false);
  }, []);

  const filteredActions = filter === 'all' 
    ? actions 
    : actions.filter((action) => action.type === filter);

  if (loading) {
    return <div>Loading action log...</div>;
  }

  return (
    <div className="action-log">
      <div className="log-filters">
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'active' : ''}
        >
          All
        </button>
        <button
          onClick={() => setFilter('reminder')}
          className={filter === 'reminder' ? 'active' : ''}
        >
          Reminders
        </button>
        <button
          onClick={() => setFilter('reorder')}
          className={filter === 'reorder' ? 'active' : ''}
        >
          Reorders
        </button>
        <button
          onClick={() => setFilter('alert')}
          className={filter === 'alert' ? 'active' : ''}
        >
          Alerts
        </button>
      </div>

      <div className="log-entries">
        {filteredActions.length === 0 ? (
          <p>No actions in this category</p>
        ) : (
          <ul>
            {filteredActions.map((action) => (
              <li key={action.id} className={`log-entry ${action.type}`}>
                <span className="timestamp">{action.timestamp}</span>
                <span className="action-type">{action.type}</span>
                <span className="action-description">{action.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
