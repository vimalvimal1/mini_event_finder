import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventService } from '../services/api';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debug logs
  useEffect(() => {
    console.log('🔍 EventDetail Component Mounted');
    console.log('📌 Event ID from URL:', id);
    console.log('📌 Full URL:', window.location.href);
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      console.log('🚀 Starting API call for event ID:', id);
      setLoading(true);
      const response = await eventService.getEvent(id);
      console.log('✅ API Response received:', response);
      setEvent(response.data);
    } catch (err) {
      console.error('❌ Error fetching event:', err);
      console.error('❌ Error message:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
      console.log('🏁 Loading set to false');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getParticipantsStatus = () => {
    if (!event) return { status: 'available', text: 'Spots Available' };
    
    if (event.currentParticipants >= event.maxParticipants) {
      return { status: 'full', text: 'Fully Booked' };
    } else if (event.currentParticipants >= event.maxParticipants * 0.8) {
      return { status: 'almost-full', text: 'Almost Full' };
    } else {
      return { status: 'available', text: 'Spots Available' };
    }
  };

  if (loading) {
    return <div className="loading">Loading event details...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h3>Error loading event</h3>
        <p>{error}</p>
        <Link to="/" className="btn btn-primary">Back to Events</Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="error">
        <h3>Event not found</h3>
        <p>The event you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">Back to Events</Link>
      </div>
    );
  }

  const participantsStatus = getParticipantsStatus();

  return (
    <div>
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '24px' }}>
        ← Back to Events
      </Link>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <span className="event-category" style={{ fontSize: '14px', background: '#e2e8f0', padding: '4px 12px', borderRadius: '20px' }}>
              {event.category}
            </span>
            <h1 style={{ margin: '12px 0 8px 0' }}>{event.title}</h1>
            {event.organizer && (
              <p style={{ color: '#64748b', fontSize: '18px' }}>Hosted by {event.organizer}</p>
            )}
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div className={`participants-status ${participantsStatus.status}`} style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              background: participantsStatus.status === 'full' ? '#fef2f2' : 
                         participantsStatus.status === 'almost-full' ? '#fffbeb' : '#f0fdf4',
              color: participantsStatus.status === 'full' ? '#dc2626' : 
                    participantsStatus.status === 'almost-full' ? '#d97706' : '#16a34a'
            }}>
              {participantsStatus.text}
            </div>
            <p style={{ marginTop: '8px', fontSize: '14px', color: '#64748b' }}>
              {event.currentParticipants} / {event.maxParticipants} participants
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: '32px' }}>
          <div>
            <h3 style={{ marginBottom: '16px' }}>About this event</h3>
            <p style={{ lineHeight: '1.8', fontSize: '16px' }}>{event.description}</p>
          </div>

          <div className="card" style={{ background: '#f8fafc' }}>
            <h4 style={{ marginBottom: '16px' }}>Event Details</h4>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ marginRight: '12px', fontSize: '20px' }}>📅</span>
                <div>
                  <div style={{ fontWeight: '600' }}>Date & Time</div>
                  <div>{formatDate(event.date)}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ marginRight: '12px', fontSize: '20px' }}>📍</span>
                <div>
                  <div style={{ fontWeight: '600' }}>Location</div>
                  <div>{event.location}</div>
                </div>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} disabled={participantsStatus.status === 'full'}>
              {participantsStatus.status === 'full' ? 'Event Full' : 'Join Event'}
            </button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
          <h4 style={{ marginBottom: '16px' }}>Event Information</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <strong>Category:</strong> {event.category}
            </div>
            <div>
              <strong>Capacity:</strong> {event.maxParticipants} people
            </div>
            <div>
              <strong>Current Attendees:</strong> {event.currentParticipants} people
            </div>
            {event.createdAt && (
              <div>
                <strong>Created:</strong> {new Date(event.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// FIX: This line was incorrect - it should be EventDetail, not Event
export default EventDetail;