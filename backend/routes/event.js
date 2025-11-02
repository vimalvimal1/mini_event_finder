import express from 'express';

const router = express.Router();

// In-memory storage
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
  }
];

let nextId = 3;

// GET /api/events - List all events with optional filters
router.get('/', (req, res) => {
  try {
    let filteredEvents = [...events];
    const { location, search } = req.query;

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
        error: 'Missing required fields'
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

export default router;
