import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getParticipantsText = () => {
    if (event.currentParticipants >= event.maxParticipants) {
      return 'Fully Booked';
    }
    return `${event.currentParticipants}/${event.maxParticipants} attending`;
  };

  return (
    <div className="card event-card">
      <div className="event-header">
        <h3 className="event-title">{event.title}</h3>
        <span className="event-category">{event.category}</span>
      </div>
      
      <p className="event-description">{event.description}</p>
      
      <div className="event-details">
        <div className="event-detail">
          <span className="detail-icon">📍</span>
          <span>{event.location}</span>
        </div>
        
        <div className="event-detail">
          <span className="detail-icon">📅</span>
          <span>{formatDate(event.date)}</span>
        </div>
        
        <div className="event-detail">
          <span className="detail-icon">👥</span>
          <span className={event.currentParticipants >= event.maxParticipants ? 'full' : ''}>
            {getParticipantsText()}
          </span>
        </div>
        
        {event.organizer && (
          <div className="event-detail">
            <span className="detail-icon">🎯</span>
            <span>By {event.organizer}</span>
          </div>
        )}
      </div>
      
      <Link to={`/events/${event.id}`} className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
        View Details
      </Link>
    </div>
  );
};

export default EventCard;