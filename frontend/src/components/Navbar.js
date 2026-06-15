import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // controls hamburger menu

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-slate-900 border-b border-white/10 relative z-50">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to={isLoggedIn ? '/dashboard' : '/'} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">AI</div>
          <span className="font-bold text-lg text-white">InterviewTracker</span>
        </Link>

        {/* Desktop links — hidden on mobile */}
        <div className="hidden md:flex gap-3 items-center">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-sm text-gray-300 hover:text-white transition">Dashboard</Link>
              <Link to="/log" className="text-sm text-gray-300 hover:text-white transition">Log Interview</Link>
              <Link to="/history" className="text-sm text-gray-300 hover:text-white transition">History</Link>
              <Link to="/questions" className="text-sm text-gray-300 hover:text-white transition">Questions</Link>           
              <Link to="/insights" className="text-sm text-gray-300 hover:text-white transition">AI Insights</Link>
              <Link to="/profile" className="text-sm text-gray-300 hover:text-white transition">Profile</Link>
              <button onClick={handleLogout} className="px-4 py-2 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm text-gray-300 hover:text-white transition">Login</Link>
              <Link to="/register" className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-lg transition font-medium text-white">Get Started Free</Link>
            </>
          )}
        </div>

        {/* Hamburger button — only visible on mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          {/* Three lines of hamburger — animate to X when open */}
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-3 bg-slate-900">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300 hover:text-white py-2 border-b border-white/5">Dashboard</Link>
              <Link to="/log" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300 hover:text-white py-2 border-b border-white/5">Log Interview</Link>
              <Link to="/history" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300 hover:text-white py-2 border-b border-white/5">History</Link>
              <Link to="/questions" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300 hover:text-white py-2 border-b border-white/5">Questions</Link>
              <Link to="/insights" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300 hover:text-white py-2 border-b border-white/5">AI Insights</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300 hover:text-white py-2 border-b border-white/5">Profile</Link>
              <button onClick={handleLogout} className="text-left text-sm text-red-400 hover:text-red-300 py-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300 hover:text-white py-2">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm text-blue-400 hover:text-blue-300 py-2">Get Started Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}