import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

// Social icons as inline SVGs since lucide-react version doesn't include them
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

function Footer() {
  const socialLinks = [
    { icon: FacebookIcon, href: '#', label: 'Facebook' },
    { icon: TwitterIcon, href: '#', label: 'Twitter' },
    { icon: InstagramIcon, href: '#', label: 'Instagram' },
    { icon: YoutubeIcon, href: '#', label: 'Youtube' }
  ];

  return (
    <footer style={{ background: 'white', padding: 'var(--spacing-2xl) 0 var(--spacing-md)', marginTop: 'auto', borderTop: '1px solid var(--neutral-200)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xl)', borderBottom: '1px solid var(--neutral-200)' }}>
        
        <div>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '1.25rem', marginBottom: 'var(--spacing-md)' }}>
            <MapPin fill="var(--primary)" color="white" size={28} />
            <span>BookMyStay</span>
          </Link>
          <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Discover amazing places to stay around the world. Your perfect getaway is just a click away.
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--neutral-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--neutral-600)',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--neutral-100)';
                  e.currentTarget.style.color = 'var(--neutral-600)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
        
        <div>
          <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Support</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <li><Link to="/" style={{ color: 'var(--neutral-500)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration='underline'} onMouseLeave={(e) => e.target.style.textDecoration='none'}>Help Centre</Link></li>
            <li><Link to="/" style={{ color: 'var(--neutral-500)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration='underline'} onMouseLeave={(e) => e.target.style.textDecoration='none'}>AirCover</Link></li>
            <li><Link to="/" style={{ color: 'var(--neutral-500)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration='underline'} onMouseLeave={(e) => e.target.style.textDecoration='none'}>Anti-discrimination</Link></li>
            <li><Link to="/" style={{ color: 'var(--neutral-500)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration='underline'} onMouseLeave={(e) => e.target.style.textDecoration='none'}>Disability support</Link></li>
            <li><Link to="/" style={{ color: 'var(--neutral-500)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration='underline'} onMouseLeave={(e) => e.target.style.textDecoration='none'}>Cancellation options</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Hosting</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <li><Link to="/signup" style={{ color: 'var(--neutral-500)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration='underline'} onMouseLeave={(e) => e.target.style.textDecoration='none'}>Host on BookMyStay</Link></li>
            <li><Link to="/" style={{ color: 'var(--neutral-500)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration='underline'} onMouseLeave={(e) => e.target.style.textDecoration='none'}>AirCover for Hosts</Link></li>
            <li><Link to="/" style={{ color: 'var(--neutral-500)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration='underline'} onMouseLeave={(e) => e.target.style.textDecoration='none'}>Hosting resources</Link></li>
            <li><Link to="/" style={{ color: 'var(--neutral-500)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration='underline'} onMouseLeave={(e) => e.target.style.textDecoration='none'}>Community forum</Link></li>
            <li><Link to="/" style={{ color: 'var(--neutral-500)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration='underline'} onMouseLeave={(e) => e.target.style.textDecoration='none'}>Hosting responsibly</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ marginBottom: 'var(--spacing-md)' }}>BookMyStay</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <li><Link to="/" style={{ color: 'var(--neutral-500)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration='underline'} onMouseLeave={(e) => e.target.style.textDecoration='none'}>Newsroom</Link></li>
            <li><Link to="/" style={{ color: 'var(--neutral-500)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration='underline'} onMouseLeave={(e) => e.target.style.textDecoration='none'}>New features</Link></li>
            <li><Link to="/" style={{ color: 'var(--neutral-500)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration='underline'} onMouseLeave={(e) => e.target.style.textDecoration='none'}>Careers</Link></li>
            <li><Link to="/" style={{ color: 'var(--neutral-500)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration='underline'} onMouseLeave={(e) => e.target.style.textDecoration='none'}>Investors</Link></li>
          </ul>
        </div>

      </div>
      
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--neutral-500)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span>© 2026 BookMyStay, Inc.</span>
          <span style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ margin: '0 0.2rem' }}>·</span> 
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color='var(--primary)'} onMouseLeave={(e) => e.target.style.color='inherit'}>Terms</Link>
            <span style={{ margin: '0 0.2rem' }}>·</span> 
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color='var(--primary)'} onMouseLeave={(e) => e.target.style.color='inherit'}>Sitemap</Link>
            <span style={{ margin: '0 0.2rem' }}>·</span> 
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color='var(--primary)'} onMouseLeave={(e) => e.target.style.color='inherit'}>Privacy</Link>
            <span style={{ margin: '0 0.2rem' }}>·</span> 
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color='var(--primary)'} onMouseLeave={(e) => e.target.style.color='inherit'}>Your Privacy Choices</Link>
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: 'var(--neutral-600)', cursor: 'pointer' }}>
            <MapPin size={18} /> 
            <span style={{ textDecoration: 'underline' }}>English (IN)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: 'var(--neutral-600)' }}>
            <span style={{ fontSize: '1.1rem' }}>₹</span> 
            <span style={{ textDecoration: 'underline' }}>INR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
