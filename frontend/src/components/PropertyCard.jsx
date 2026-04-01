import { Link } from 'react-router-dom';
import { Star, Heart, GitCompare } from 'lucide-react';
import { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import toast from 'react-hot-toast';

function parseImages(value) {
  if (value == null || value === '') return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const PropertyCard = ({ property }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toggle: toggleWishlist, has: inWishlist } = useWishlist();
  const { toggle: toggleCompare, has: inCompare, ids: compareIds } = useCompare();
  const images = parseImages(property?.images);

  const rating = property.avg_rating ? parseFloat(property.avg_rating).toFixed(2) : 'New';
  const firstImage = images.length > 0 ? `/uploads/${images[0]}` : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop';

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(property.id);
    if (!inWishlist(property.id)) {
      toast.success('Added to wishlist');
    } else {
      toast('Removed from wishlist', { icon: '💔' });
    }
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inCompare(property.id) && compareIds.length >= 4) {
      toast.error('You can compare up to 4 properties');
      return;
    }
    toggleCompare(property.id);
    if (!inCompare(property.id)) {
      toast.success('Added to compare');
    } else {
      toast('Removed from compare');
    }
  };

  return (
    <div 
      className="property-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/property/${property.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        
        {/* Image Box */}
        <div className="property-card-image-wrap">
          <img 
            src={firstImage} 
            alt={property.title}
            className="property-card-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop';
            }}
          />
        </div>

        {/* Content Box */}
        <div className="property-card-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 className="property-card-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
              {property.city}, {property.country}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.95rem', fontWeight: 600 }}>
              <Star size={16} fill="var(--warning)" color="var(--warning)" />
              <span>{rating}</span>
            </div>
          </div>
          
          <div className="property-card-location" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {property.title}
          </div>
          
          <div style={{ fontSize: '0.9rem', color: 'var(--neutral-400)', marginTop: '-8px' }}>
            {property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''} · {property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}
          </div>
          
          <div className="property-card-footer">
            <div className="property-card-price">
              ₹{property.price_per_night?.toLocaleString?.() || property.price_per_night} <span style={{ fontWeight: 400, fontSize: '0.9rem', color: 'var(--neutral-400)' }}>/ night</span>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Action Buttons */}
      <div style={{ 
        position: 'absolute', 
        top: '12px', 
        right: '12px', 
        display: 'flex', 
        gap: '8px',
        zIndex: 10
      }}>
        {/* Compare Button */}
        <button 
          style={{ 
            background: inCompare(property.id) ? 'var(--primary)' : 'var(--glass-bg)', 
            backdropFilter: 'var(--glass-blur)',
            border: 'var(--glass-border)', 
            cursor: 'pointer',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            transition: 'all var(--transition-bounce)',
            transform: isHovered ? 'scale(1)' : 'scale(0.8)',
            opacity: isHovered || inCompare(property.id) ? 1 : 0
          }}
          onClick={handleCompareClick}
          title={inCompare(property.id) ? 'Remove from compare' : 'Add to compare'}
        >
          <GitCompare 
            size={18} 
            color={inCompare(property.id) ? 'white' : 'var(--neutral-900)'} 
          />
        </button>

        {/* Wishlist Button */}
        <button 
          style={{ 
            background: inWishlist(property.id) ? 'var(--glass-bg)' : 'var(--glass-bg)', 
            backdropFilter: 'var(--glass-blur)',
            border: 'var(--glass-border)', 
            cursor: 'pointer',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            transition: 'all var(--transition-bounce)',
            transform: isHovered ? 'scale(1)' : 'scale(0.8)',
            opacity: isHovered || inWishlist(property.id) ? 1 : 0
          }}
          onClick={handleWishlistClick}
          title={inWishlist(property.id) ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart 
            size={18} 
            color={inWishlist(property.id) ? 'var(--primary)' : 'var(--neutral-900)'} 
            fill={inWishlist(property.id) ? 'var(--primary)' : 'transparent'} 
            strokeWidth={1.5}
          />
        </button>
      </div>
    </div>
  );
}

export default PropertyCard;
