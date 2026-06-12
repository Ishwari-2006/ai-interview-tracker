import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getInterviews, deleteInterview } from '../services/api';

// Badge component — shows colored pill for outcome and difficulty
function Badge({ value, type }) {
  // Outcome colors
  const outcomeColors = {
    'Pass':        'bg-green-500/10 text-green-400 border-green-500/20',
    'Fail':        'bg-red-500/10 text-red-400 border-red-500/20',
    'Pending':     'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'No Response': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };
  // Difficulty colors
  const difficultyColors = {
    'Easy':   'bg-green-500/10 text-green-400 border-green-500/20',
    'Medium': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'Hard':   'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const colors = type === 'outcome' ? outcomeColors : difficultyColors;
  const colorClass = colors[value] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
      {value || '—'}
    </span>
  );
}

export default function History() {
  const [interviews, setInterviews] = useState([]);  // all interviews from backend
  const [filter, setFilter] = useState('All');       // active filter button
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null); // tracks which row is being deleted
  const navigate = useNavigate();

  // Fetch interviews when page loads
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await getInterviews();
        setInterviews(res.data);
      } catch (err) {
        setError('Failed to load interviews.');
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []); // empty [] = run once on load

  // Filter the list based on active filter button
  // If filter is 'All', show everything. Otherwise only show matching outcome.
  const filtered = filter === 'All'
    ? interviews
    : interviews.filter(i => i.outcome === filter);

  // Handle delete button click
  const handleDelete = async (id) => {
    // Ask user to confirm before deleting
    const confirmed = window.confirm('Are you sure you want to delete this interview?');
    if (!confirmed) return;

    setDeletingId(id); // show loading on that specific row
    try {
      await deleteInterview(id);
      // Remove it from local state without re-fetching
      setInterviews(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      alert('Failed to delete. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Format date nicely — "2026-06-11" → "11 Jun 2026"
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filterButtons = ['All', 'Pass', 'Fail', 'Pending', 'No Response'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-400 animate-pulse">Loading your interviews...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Interview History</h1>
            <p className="text-gray-400 mt-1">
              {interviews.length} interview{interviews.length !== 1 ? 's' : ''} logged
            </p>
          </div>
          <button
            onClick={() => navigate('/log')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition"
          >
            + Log Interview
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Empty state — shown when no interviews at all */}
        {interviews.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="text-xl font-semibold text-white mb-2">No interviews logged yet</h2>
            <p className="text-gray-400 mb-6">Log your first interview to start tracking your progress.</p>
            <button
              onClick={() => navigate('/log')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition"
            >
              Log Your First Interview →
            </button>
          </div>
        ) : (
          <>
            {/* Filter buttons */}
            <div className="flex gap-2 flex-wrap mb-6">
              {filterButtons.map(btn => (
                <button
                  key={btn}
                  onClick={() => setFilter(btn)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                    filter === btn
                      ? 'bg-blue-600 border-blue-600 text-white'        // active
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10' // inactive
                  }`}
                >
                  {btn}
                  {/* Show count next to each filter */}
                  <span className="ml-1.5 opacity-60">
                    {btn === 'All'
                      ? interviews.length
                      : interviews.filter(i => i.outcome === btn).length}
                  </span>
                </button>
              ))}
            </div>

            {/* No results for this filter */}
            {filtered.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-gray-500">
                No interviews with outcome "{filter}" yet.
              </div>
            ) : (
              /* Interview table */
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-7 gap-4 px-6 py-3 border-b border-white/10 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-2">Company / Role</div>
                  <div>Date</div>
                  <div>Round</div>
                  <div>Outcome</div>
                  <div>Difficulty</div>
                  <div>Action</div>
                </div>

                {/* Table rows */}
                {filtered.map((interview, index) => (
                  <div
                    key={interview.id}
                    className={`grid grid-cols-7 gap-4 px-6 py-4 items-center text-sm transition hover:bg-white/5 ${
                      index !== filtered.length - 1 ? 'border-b border-white/5' : ''
                    }`}
                  >
                    {/* Company + Role */}
                    <div className="col-span-2">
                      <div className="font-medium text-white">{interview.company_name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{interview.role || '—'}</div>
                    </div>

                    {/* Date */}
                    <div className="text-gray-400">
                      {formatDate(interview.interview_date)}
                    </div>

                    {/* Round type */}
                    <div className="text-gray-400">
                      {interview.round_type || '—'}
                    </div>

                    {/* Outcome badge */}
                    <div>
                      <Badge value={interview.outcome} type="outcome" />
                    </div>

                    {/* Difficulty badge */}
                    <div>
                      <Badge value={interview.difficulty} type="difficulty" />
                    </div>

                    {/* Delete button */}
                    <div>
                      <button
                        onClick={() => handleDelete(interview.id)}
                        disabled={deletingId === interview.id}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-xs transition disabled:opacity-50"
                      >
                        {deletingId === interview.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}