import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useWishlist } from '../context/WishlistContext';
import PropertyCard from '../components/PropertyCard';
import { Heart } from 'lucide-react';

function Wishlist() {
  const { ids, clear } = useWishlist();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!ids.length) {
        setProperties([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get('/api/properties');
        const map = new Map(res.data.map((p) => [p.id, p]));
        const ordered = ids.map((id) => map.get(id)).filter(Boolean);
        if (!cancelled) setProperties(ordered);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [ids]);

  if (loading) return <div className="spinner" />;

  return (
    <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-2xl)' }}>
      <div className="page-header-modern" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={30} fill="var(--primary)" color="var(--primary)" /> Saved places
          </h1>
          <p>Your shortlist of stays — compare them or book when you are ready.</p>
        </div>
        {ids.length > 0 && (
          <button type="button" className="btn btn-outline" onClick={clear}>Clear saved</button>
        )}
      </div>

      {properties.length === 0 ? (
        <div className="glass-panel" style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
          <p style={{ color: 'var(--neutral-500)' }}>Tap the heart on any listing to save it here.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 'var(--spacing-md)' }}>Explore</Link>
        </div>
      ) : (
        <div className="grid grid-4" style={{ marginTop: 'var(--spacing-xl)' }}>
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
