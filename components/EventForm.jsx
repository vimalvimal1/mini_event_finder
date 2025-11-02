import React, { useState } from 'react';
import { eventService } from '../services/api';

const EventForm = ({ onEventCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    maxParticipants: '',
    category: 'General',
    organizer: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await eventService.createEvent(formData);
      onEventCreated(response.data);
      setFormData({
        title: '',
        description: '',
        location: '',
        date: '',
        maxParticipants: '',
        category: 'General',
        organizer: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '24px' }}>Create New Event</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Event Title *</label>
          <input
            type="text"
            name="title"
            className="form-input"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            name="description"
            className="form-input"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Location *</label>
          <input
            type="text"
            name="location"
            className="form-input"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Date and Time *</label>
          <input
            type="datetime-local"
            name="date"
            className="form-input"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Maximum Participants *</label>
          <input
            type="number"
            name="maxParticipants"
            className="form-input"
            min="1"
            value={formData.maxParticipants}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            name="category"
            className="form-input"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="General">General</option>
            <option value="Music">Music</option>
            <option value="Workshop">Workshop</option>
            <option value="Networking">Networking</option>
            <option value="Sports">Sports</option>
            <option value="Food">Food & Drink</option>
            <option value="Arts">Arts & Culture</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Organizer Name</label>
          <input
            type="text"
            name="organizer"
            className="form-input"
            value={formData.organizer}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;