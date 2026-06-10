import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-slate-900 border-b border-white/10">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">AI</div>
        <span className="font-bold text-lg text-white">InterviewTracker</span>
      </Link>
      <div className="flex gap-3 items-center">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="text-sm text-gray-300 hover:text-white transition">Dashboard</Link>
            <Link to="/log" className="text-sm text-gray-300 hover:text-white transition">Log Interview</Link>
            <Link to="/history" className="text-sm text-gray-300 hover:text-white transition">History</Link>
            <Link to="/questions" className="text-sm text-gray-300 hover:text-white transition">Questions</Link>
            <button onClick={handleLogout} className="px-4 py-2 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 text-sm text-gray-300 hover:text-white transition">Login</Link>
            <Link to="/register" className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-lg transition font-medium text-white">Get Started Free</Link>
          </>
        )}
      </div>
    </nav>
  );
}