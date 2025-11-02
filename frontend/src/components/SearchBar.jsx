import React, { useState } from 'react';

const SearchBar = ({ onSearch, onLocationChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleLocationChange = (e) => {
    const newLocation = e.target.value;
    setLocation(newLocation);
    onLocationChange(newLocation);
  };

  const handleClear = () => {
    setSearchTerm('');
    setLocation('');
    onSearch('');
    onLocationChange('');
  };

  return (
    <div className="search-section">
      <form onSubmit={handleSearch} className="search-row">
        <div className="form-group">
          <label className="form-label">Search Events</label>
          <input
            type="text"
            className="form-input"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-input"
            placeholder="Filter by location..."
            value={location}
            onChange={handleLocationChange}
          />
        </div>
        
        <div className="form-group">
          <button type="submit" className="btn btn-primary" style={{ marginBottom: '8px' }}>
            Search
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleClear} style={{ width: '100%' }}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;