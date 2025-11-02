import express from 'express';
import { calculateDistance } from '../utils/distanceCalculator.js';

const router = express.Router();

// In-memory storage (replace with database in production)
let events = [
  {
    id: 1,
    title: "React Workshop",
    description: "Learn React fundamentals with hands-on projects",
    location: "New York, NY",
    date: "2024-11-15T18:00:00Z",
    maxParticipants: 50,
    currentParticipants: 23,
    category: "Workshop",
    organizer: "Tech Community"
  },
  {
    id: 2,
    title: "Jazz Night",
    description: "Live jazz performance featuring local artists",
    location: "Brooklyn, NY",
    date: "2024-11-12T20:00:00Z",
    maxParticipants: 100,
    currentParticipants: 45,
    category: "Music",
    organizer: "Brooklyn Arts"
  },
  {
    id: 3,
    title: "Startup Networking",
    description: "Connect with entrepreneurs and investors",
    location: "Manhattan, NY",
    date: "2024-11-20T17:00:00Z",
    maxParticipants: 80,
    currentParticipants: 62,
    category: "Networking",
    organizer: "NYC Startups"
  }
];

let nextId = 4;

// GET /api/events - List all events with optional filters
router.get('/', (req, res) => {
  try {
    let filteredEvents = [...events];
    const { location, search, category, lat, lng, radius } = req.query;

    // Location filter
    if (location) {
      filteredEvents = filteredEvents.filter(event =>
        event.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Search filter (title + description)
    if (search) {
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (category) {
      filteredEvents = filteredEvents.filter(event =>
        event.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Distance filter (bonus feature)
    if (lat && lng && radius) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const maxDistance = parseFloat(radius);

      filteredEvents = filteredEvents.filter(event => {
        const eventCoords = getCoordinatesForLocation(event.location);
        if (!eventCoords) return true; // If no coordinates, include event
        
        const distance = calculateDistance(
          userLat, userLng, 
          eventCoords.lat, eventCoords.lng
        );
        return distance <= maxDistance;
      });
    }

    res.json({
      success: true,
      data: filteredEvents,
      total: filteredEvents.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    });
  }
});

// GET /api/events/:id - Get event details
router.get('/:id', (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = events.find(e => e.id === eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event'
    });
  }
});

// POST /api/events - Create a new event
router.post('/', (req, res) => {
  try {
    const { 
      title, 
      description, 
      location, 
      date, 
      maxParticipants, 
      category = 'General',
      organizer = 'Anonymous'
    } = req.body;

    // Validation
    if (!title || !description || !location || !date || !maxParticipants) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, description, location, date, maxParticipants'
      });
    }

    const newEvent = {
      id: nextId++,
      title,
      description,
      location,
      date: new Date(date).toISOString(),
      maxParticipants: parseInt(maxParticipants),
      currentParticipants: 0,
      category,
      organizer,
      createdAt: new Date().toISOString()
    };

    events.push(newEvent);

    res.status(201).json({
      success: true,
      data: newEvent,
      message: 'Event created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create event'
    });
  }
});

// Helper function to get coordinates for locations
function getCoordinatesForLocation(location) {
  const coordinates = {
    'new york, ny': { lat: 40.7128, lng: -74.0060 },
    'brooklyn, ny': { lat: 40.6782, lng: -73.9442 },
    'manhattan, ny': { lat: 40.7831, lng: -73.9712 },
    'queens, ny': { lat: 40.7282, lng: -73.7949 },
    'bronx, ny': { lat: 40.8448, lng: -73.8648 }
  };
  
  return coordinates[location.toLowerCase()];
}

export default router;