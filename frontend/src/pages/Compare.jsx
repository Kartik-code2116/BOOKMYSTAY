import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCompare } from '../context/CompareContext';
import { GitCompare, Trash2, MapPin, Star } from 'lucide-react';

function Compare() {
  const { ids, remove, clear } = useCompare();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!ids.length) {
        setItems([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const results = await Promise.all(
          ids.map((id) => axios.get(`/api/properties/${id}`).then((r) => r.data).catch(() => null))
        );
        if (!cancelled) setItems(results.filter(Boolean));
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
            <GitCompare size={32} strokeWidth={1.5} /> Compare stays
          </h1>
          <p>Side‑by‑side view of nightly rate, space, and guest ratings (up to 4 listings).</p>
        </div>
        {ids.length > 0 && (
          <button type="button" className="btn btn-outline" onClick={clear} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Trash2 size={18} />
            Clear all
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="glass-panel" style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
          <p style={{ marginBottom: 'var(--spacing-md)', color: 'var(--neutral-500)' }}>Add properties from the home grid or listing page using <strong>Compare</strong>.</p>
          <Link to="/" className="btn btn-primary">Browse listings</Link>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: 'var(--spacing-xl)' }}>
          <table className="compare-table">
            <thead>
              <tr>
                <th>Listing</th>
                {items.map((p) => (
                  <th key={p.id}>
                    <button type="button" className="btn-icon-remove" onClick={() => remove(p.id)} aria-label="Remove">×</button>
                    <Link to={`/property/${p.id}`} style={{ fontWeight: 600, color: 'var(--neutral-600)' }}>{p.title}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Location</td>
                {items.map((p) => (
                  <td key={p.id}><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />{p.city}, {p.country}</td>
                ))}
              </tr>
              <tr>
                <td>Type</td>
                {items.map((p) => <td key={p.id}>{p.property_type}</td>)}
              </tr>
              <tr>
                <td>Price / night</td>
                {items.map((p) => (
                  <td key={p.id}>
                    {p.offer_active ? (
                      <>
                        <span style={{ textDecoration: 'line-through', color: 'var(--neutral-400)', marginRight: 8 }}>₹{p.price_per_night}</span>
                        <strong style={{ color: 'var(--secondary)' }}>₹{p.effective_price_per_night}</strong>
                      </>
                    ) : (
                      <strong>₹{p.price_per_night}</strong>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Rooms snapshot</td>
                {items.map((p) => (
                  <td key={p.id}>
                    {p.bedrooms} bed · {p.bathrooms} bath · {p.max_guests} guests
                    {p.room_summary ? <div style={{ fontSize: '0.8rem', color: 'var(--neutral-400)', marginTop: 4 }}>{p.room_summary}</div> : null}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Rating</td>
                {items.map((p) => (
                  <td key={p.id}>
                    <Star size={14} fill="var(--warning)" color="var(--warning)" style={{ verticalAlign: 'middle' }} />
                    {' '}{p.avg_rating ? Number(p.avg_rating).toFixed(1) : 'New'} ({p.review_count || 0})
                  </td>
                ))}
              </tr>
              <tr>
                <td>Action</td>
                {items.map((p) => (
                  <td key={p.id}>
                    <Link to={`/property/${p.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>View</Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Compare;
