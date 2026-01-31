import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Setup from './pages/Setup';
import Caregiver from './pages/Caregiver';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>DoseWise</h1>
          <nav className="app-nav">
            <a href="/">Dashboard</a>
            <a href="/caregiver">Caregiver</a>
            {user && <span className="user-name">{user.name}</span>}
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/caregiver" element={<Caregiver />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2025 DoseWise - Smart Medication Management</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
