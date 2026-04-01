import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import PropertyMap from '../components/PropertyMap';

function Home() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMap, setShowMap] = useState(false);

  const fetchProperties = async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`/api/properties?${params.toString()}`);
      setProperties(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-bg-gradient" />
        <div className="container hero-content">
          <h1>Find Your Perfect Stay</h1>
          <p>Discover amazing places to stay around the world. From cozy cabins to luxury villas, find the perfect getaway for your next adventure.</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">500K+</span>
              <span className="hero-stat-label">Active Listings</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">1M+</span>
              <span className="hero-stat-label">Happy Guests</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">190+</span>
              <span className="hero-stat-label">Countries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Results */}
      <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xl)' }}>
        <SearchBar onSearch={fetchProperties} />

        {loading ? (
          <div className="spinner"></div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: 'var(--error)', padding: 'var(--spacing-xl)' }}>
            {error}
          </div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <h3>No properties found</h3>
            <p>Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
              <h2 style={{ marginBottom: 0 }}>
                {properties.length} Properties Available
              </h2>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowMap((prev) => !prev)}
              >
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>
            </div>

            {showMap && (
              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <PropertyMap
                  properties={properties}
                  onMarkerClick={(property) => navigate(`/property/${property.id}`)}
                />
              </div>
            )}
            <div className="grid grid-4">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
