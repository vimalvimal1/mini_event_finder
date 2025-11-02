import React, { useState, useEffect } from 'react';
import { eventService } from '../services/api';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import EventForm from '../components/EventForm';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEvents(filters);
      setEvents(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm
    }));
  };

  const handleLocationChange = (location) => {
    setFilters(prev => ({
      ...prev,
      location: location
    }));
  };

  const handleEventCreated = (newEvent) => {
    setEvents(prev => [newEvent, ...prev]);
    setShowCreateForm(false);
  };

  if (loading && events.length === 0) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1>Upcoming Events</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? '← Back to Events' : '+ Create Event'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showCreateForm ? (
        <EventForm 
          onEventCreated={handleEventCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      ) : (
        <>
          <SearchBar 
            onSearch={handleSearch}
            onLocationChange={handleLocationChange}
          />
          
          {events.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <h3>No events found</h3>
              <p>Try adjusting your search criteria or create a new event.</p>
            </div>
          ) : (
            <>
              <p style={{ marginBottom: '20px', color: '#64748b' }}>
                Found {events.length} event{events.length !== 1 ? 's' : ''}
              </p>
              <div className="events-grid">
                {events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default EventList;