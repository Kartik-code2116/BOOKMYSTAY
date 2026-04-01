import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Search, Globe, Menu, UserCircle, MapPin, Building, LogOut, LayoutDashboard, Heart, GitCompare, MessageCircle } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { count: wishlistCount } = useWishlist();
  const { count: compareCount } = useCompare();

  const readUserFromStorage = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      setUser(null);
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      setUser(parsed && typeof parsed === 'object' ? parsed : null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    readUserFromStorage();
    window.addEventListener('auth-change', readUserFromStorage);
    return () => window.removeEventListener('auth-change', readUserFromStorage);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    window.dispatchEvent(new CustomEvent('auth-change'));
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) auto minmax(120px, 1fr)', alignItems: 'center' }}>
        
        {/* 1. Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '1.25rem' }}>
          <MapPin fill="var(--primary)" color="white" size={28} />
          <span style={{ letterSpacing: '-0.5px' }}>BookMyStay</span>
        </Link>
        
        {/* 2. Search Bar placeholder */}
        <div className="nav-search-bar" onClick={() => navigate('/')}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', paddingRight: '1rem', borderRight: '1px solid var(--neutral-200)' }}>Anywhere</div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', padding: '0 1rem', borderRight: '1px solid var(--neutral-200)' }}>Any week</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--neutral-400)', padding: '0 1rem', fontWeight: 500 }}>Add guests</div>
          <div className="search-btn-icon">
            <Search size={14} strokeWidth={3} />
          </div>
        </div>

        {/* 3. User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
          {/* Wishlist Link - visible when logged in */}
          {user && (
            <Link 
              to="/wishlist"
              style={{ 
                position: 'relative',
                padding: '0.75rem', 
                borderRadius: '50%', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                transition: 'background 0.2s',
                color: 'var(--neutral-600)',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--neutral-50)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              title="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'var(--primary)',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '999px',
                  minWidth: '18px',
                  textAlign: 'center'
                }}>
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>
          )}

          {/* Compare Link */}
          <Link 
            to="/compare"
            style={{ 
              position: 'relative',
              padding: '0.75rem', 
              borderRadius: '50%', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              transition: 'background 0.2s',
              color: 'var(--neutral-600)',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--neutral-50)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            title="Compare"
          >
            <GitCompare size={20} />
            {compareCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                background: 'var(--secondary)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '999px',
                minWidth: '18px',
                textAlign: 'center'
              }}>
                {compareCount > 9 ? '9+' : compareCount}
              </span>
            )}
          </Link>

          {/* Messages Link - visible when logged in */}
          {user && (
            <Link 
              to="/messages"
              style={{ 
                padding: '0.75rem', 
                borderRadius: '50%', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                transition: 'background 0.2s',
                color: 'var(--neutral-600)',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--neutral-50)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              title="Messages"
            >
              <MessageCircle size={20} />
            </Link>
          )}

          {(!user || user.role === 'guest') && (
            <Link 
              to={user ? "/host/onboarding" : "/signup"} 
              style={{ fontWeight: 500, fontSize: '0.875rem', padding: '0.75rem 1rem', borderRadius: '500px', cursor: 'pointer', color: 'var(--neutral-600)', textDecoration: 'none', transition: 'background 0.2s' }}
              className="navbar-host-link"
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--neutral-50)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Become a Host
            </Link>
          )}

          <div 
            style={{ padding: '0.75rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'background 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--neutral-50)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Globe size={18} color="var(--neutral-600)" />
          </div>

          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                border: '1px solid var(--neutral-200)',
                background: 'white',
                padding: '0.5rem 0.5rem 0.5rem 0.75rem',
                borderRadius: '500px',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
                boxShadow: dropdownOpen ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
              }}
              onMouseEnter={(e) => { if(!dropdownOpen) e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)' }}
              onMouseLeave={(e) => { if(!dropdownOpen) e.currentTarget.style.boxShadow = 'none' }}
            >
              <Menu size={18} color="var(--neutral-600)" />
              {user ? (
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--neutral-600)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '0.875rem' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <UserCircle size={30} color="var(--neutral-400)" />
              )}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: '240px',
                background: 'white',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.5rem 0',
                border: '1px solid var(--neutral-100)',
                zIndex: 1000,
                textAlign: 'left'
              }}>
                {user ? (
                  <>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--neutral-100)' }}>
                      <p style={{ margin: 0, fontWeight: 600 }}>{user.name}</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--neutral-400)' }}>{user.email}</p>
                    </div>
                    {user.role === 'host' ? (
                      <>
                        <Link to="/host/dashboard" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: 'var(--neutral-600)', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.background = 'var(--neutral-50)'} onMouseLeave={(e) => e.target.style.background = 'white'}>
                          <LayoutDashboard size={18} /> Host Dashboard
                        </Link>
                        <Link to="/host/add-property" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: 'var(--neutral-600)', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.background = 'var(--neutral-50)'} onMouseLeave={(e) => e.target.style.background = 'white'}>
                          <Building size={18} /> Add Property
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/dashboard" onClick={() => setDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: 'var(--neutral-600)', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.background = 'var(--neutral-50)'} onMouseLeave={(e) => e.target.style.background = 'white'}>
                          <LayoutDashboard size={18} /> Trips
                        </Link>
                      </>
                    )}
                    <div style={{ borderTop: '1px solid var(--neutral-100)', margin: '0.5rem 0' }} />
                    <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: 'var(--neutral-600)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.background = 'var(--neutral-50)'} onMouseLeave={(e) => e.target.style.background = 'white'}>
                      <LogOut size={18} /> Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/signup" onClick={() => setDropdownOpen(false)} style={{ display: 'block', padding: '0.75rem 1rem', color: 'var(--neutral-600)', textDecoration: 'none', fontWeight: 600, transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.background = 'var(--neutral-50)'} onMouseLeave={(e) => e.target.style.background = 'white'}>Sign up</Link>
                    <Link to="/login" onClick={() => setDropdownOpen(false)} style={{ display: 'block', padding: '0.75rem 1rem', color: 'var(--neutral-600)', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.background = 'var(--neutral-50)'} onMouseLeave={(e) => e.target.style.background = 'white'}>Log in</Link>
                    <div style={{ borderTop: '1px solid var(--neutral-100)', margin: '0.5rem 0' }} />
                    <Link to="/signup" onClick={() => setDropdownOpen(false)} style={{ display: 'block', padding: '0.75rem 1rem', color: 'var(--neutral-600)', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.background = 'var(--neutral-50)'} onMouseLeave={(e) => e.target.style.background = 'white'}>Host on BookMyStay</Link>
                    <Link to="/" onClick={() => setDropdownOpen(false)} style={{ display: 'block', padding: '0.75rem 1rem', color: 'var(--neutral-600)', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.background = 'var(--neutral-50)'} onMouseLeave={(e) => e.target.style.background = 'white'}>Help</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
