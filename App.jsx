import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="container">
            <Link to="/" className="logo">
              🎉 EventFinder
            </Link>
            <nav>
              <Link to="/" className="btn btn-primary">Create Event</Link>
            </nav>
          </div>
        </header>

        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<EventList />} />
              <Route path="/events/:id" element={<EventDetail />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;