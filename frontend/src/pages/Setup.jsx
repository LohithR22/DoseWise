import React, { useState } from 'react';

export default function Setup() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    conditions: [],
    medications: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit setup data to API
    console.log('Setup data:', formData);
  };

  return (
    <div className="setup-page">
      <h1>Initial Setup</h1>
      
      <form onSubmit={handleSubmit} className="setup-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="conditions">Medical Conditions</label>
          <textarea
            id="conditions"
            name="conditions"
            value={formData.conditions}
            onChange={handleInputChange}
            placeholder="Enter any medical conditions..."
          />
        </div>

        <button type="submit" className="submit-btn">
          Complete Setup
        </button>
      </form>
    </div>
  );
}
