import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav style={{ backgroundColor: '#f5f0e8', borderBottom: '1px solid #ddd0bc' }} className="relative z-50">
      <div className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto">
        {/* Logo */}
        <Link to={isLoggedIn ? '/dashboard' : '/'} className="flex items-center gap-2">
          <div style={{ backgroundColor: '#2c1a0e' }} className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            AI
          </div>
          <span style={{ color: '#2c1a0e', fontFamily: 'Playfair Display, serif' }} className="font-bold text-lg">
            InterviewTracker
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-6 items-center">
          {isLoggedIn ? (
            <>
              {[
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/log', label: 'Log Interview' },
                { to: '/history', label: 'History' },
                { to: '/questions', label: 'Questions' },
                { to: '/insights', label: 'AI Insights' },
                { to: '/profile', label: 'Profile' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{ color: '#5c3d2e' }}
                  className="text-sm hover:opacity-70 transition font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                style={{ backgroundColor: '#2c1a0e', color: '#f5f0e8' }}
                className="px-4 py-2 text-sm rounded-lg hover:opacity-80 transition font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#5c3d2e' }} className="text-sm font-medium hover:opacity-70 transition">
                Login
              </Link>
              <Link
                to="/register"
                style={{ backgroundColor: '#2c1a0e', color: '#f5f0e8' }}
                className="px-4 py-2 text-sm rounded-lg font-medium hover:opacity-80 transition"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-2">
          <span style={{ backgroundColor: '#2c1a0e' }} className={`block w-6 h-0.5 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span style={{ backgroundColor: '#2c1a0e' }} className={`block w-6 h-0.5 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span style={{ backgroundColor: '#2c1a0e' }} className={`block w-6 h-0.5 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ backgroundColor: '#f5f0e8', borderTop: '1px solid #ddd0bc' }} className="md:hidden px-6 py-4 flex flex-col gap-3">
          {isLoggedIn ? (
            <>
              {[
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/log', label: 'Log Interview' },
                { to: '/history', label: 'History' },
                { to: '/questions', label: 'Questions' },
                { to: '/insights', label: 'AI Insights' },
                { to: '/profile', label: 'Profile' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  style={{ color: '#5c3d2e', borderBottom: '1px solid #ddd0bc' }}
                  className="text-sm font-medium py-2"
                >
                  {link.label}
                </Link>
              ))}
              <button onClick={handleLogout} style={{ color: '#8b2e2e' }} className="text-left text-sm font-medium py-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ color: '#5c3d2e' }} className="text-sm py-2">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{ color: '#8b5e3c' }} className="text-sm py-2">Get Started Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}