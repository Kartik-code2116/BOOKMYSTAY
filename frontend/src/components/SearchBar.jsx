import { useState } from 'react';
import { Search, MapPin, Calendar, Users, Home, DollarSign, X } from 'lucide-react';

function SearchBar({ onSearch }) {
  const [filters, setFilters] = useState({
    city: '',
    property_type: '',
    min_price: '',
    max_price: '',
    guests: '',
    check_in: '',
    check_out: ''
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic date validation: check-out must be after check-in
    if (filters.check_in && filters.check_out && filters.check_out <= filters.check_in) {
      alert('Check-out date must be after check-in date.');
      return;
    }

    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      city: '',
      property_type: '',
      min_price: '',
      max_price: '',
      guests: '',
      check_in: '',
      check_out: ''
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="search-bar-modern" style={{ 
      marginBottom: 'var(--spacing-xl)',
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)',
      overflow: 'hidden'
    }}>
      <form onSubmit={handleSubmit}>
        {/* Primary Search Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 0,
          borderBottom: isExpanded ? '1px solid var(--neutral-100)' : 'none'
        }}>
          <div className="search-field" style={{ 
            padding: 'var(--spacing-md) var(--spacing-lg)',
            borderRight: '1px solid var(--neutral-100)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--neutral-600)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <MapPin size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Location
            </label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleChange}
              placeholder="Where are you going?"
              style={{
                border: 'none',
                padding: 0,
                fontSize: '0.95rem',
                color: 'var(--neutral-600)',
                background: 'transparent',
                outline: 'none',
                fontWeight: 500
              }}
            />
          </div>

          <div className="search-field" style={{ 
            padding: 'var(--spacing-md) var(--spacing-lg)',
            borderRight: '1px solid var(--neutral-100)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--neutral-600)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Calendar size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Check-in
            </label>
            <input
              type="date"
              name="check_in"
              value={filters.check_in}
              onChange={handleChange}
              min={today}
              style={{
                border: 'none',
                padding: 0,
                fontSize: '0.95rem',
                color: 'var(--neutral-600)',
                background: 'transparent',
                outline: 'none',
                fontWeight: 500
              }}
            />
          </div>

          <div className="search-field" style={{ 
            padding: 'var(--spacing-md) var(--spacing-lg)',
            borderRight: '1px solid var(--neutral-100)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--neutral-600)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Calendar size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Check-out
            </label>
            <input
              type="date"
              name="check_out"
              value={filters.check_out}
              onChange={handleChange}
              min={filters.check_in || today}
              style={{
                border: 'none',
                padding: 0,
                fontSize: '0.95rem',
                color: 'var(--neutral-600)',
                background: 'transparent',
                outline: 'none',
                fontWeight: 500
              }}
            />
          </div>

          <div className="search-field" style={{ 
            padding: 'var(--spacing-md) var(--spacing-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            position: 'relative'
          }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--neutral-600)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Users size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Guests
            </label>
            <input
              type="number"
              name="guests"
              value={filters.guests}
              onChange={handleChange}
              placeholder="Add guests"
              min="1"
              style={{
                border: 'none',
                padding: 0,
                fontSize: '0.95rem',
                color: 'var(--neutral-600)',
                background: 'transparent',
                outline: 'none',
                fontWeight: 500,
                width: '60%'
              }}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ 
                position: 'absolute', 
                right: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                padding: '12px 20px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Search size={18} />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: '100%',
            padding: '8px',
            background: 'var(--neutral-50)',
            border: 'none',
            borderTop: '1px solid var(--neutral-100)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            color: 'var(--neutral-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          {isExpanded ? (
            <><X size={14} /> Less filters</>
          ) : (
            <><span>More filters</span></>
          )}
        </button>

        {/* Expanded Filters */}
        {isExpanded && (
          <div style={{ 
            padding: 'var(--spacing-lg)', 
            background: 'var(--neutral-50)',
            borderTop: '1px solid var(--neutral-100)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-md)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--neutral-600)' }}>
                <Home size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Property Type
              </label>
              <select
                name="property_type"
                value={filters.property_type}
                onChange={handleChange}
                className="form-select"
                style={{ background: 'white' }}
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="cabin">Cabin</option>
                <option value="hotel">Hotel</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--neutral-600)' }}>
                <DollarSign size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Min Price
              </label>
              <input
                type="number"
                name="min_price"
                value={filters.min_price}
                onChange={handleChange}
                placeholder="Min ₹"
                className="form-input"
                style={{ background: 'white' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--neutral-600)' }}>
                <DollarSign size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Max Price
              </label>
              <input
                type="number"
                name="max_price"
                value={filters.max_price}
                onChange={handleChange}
                placeholder="Max ₹"
                className="form-input"
                style={{ background: 'white' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button 
                type="button" 
                onClick={handleReset} 
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Reset all
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default SearchBar;
