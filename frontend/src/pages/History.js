import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getInterviews, deleteInterview } from '../services/api';
import { T } from '../styles/theme';

function Badge({ value, type }) {
  const outcomeColors = { 'Pass': 'green', 'Fail': 'red', 'Pending': 'yellow', 'No Response': 'brown' };
  const diffColors = { 'Easy': 'green', 'Medium': 'yellow', 'Hard': 'red' };
  const color = type === 'outcome' ? outcomeColors[value] : diffColors[value];
  return <span style={T.badge(color || 'brown')}>{value || '—'}</span>;
}

export default function History() {
  const [interviews, setInterviews] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getInterviews()
      .then(res => setInterviews(res.data))
      .catch(() => setError('Failed to load interviews.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? interviews : interviews.filter(i => i.outcome === filter);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interview?')) return;
    setDeletingId(id);
    try {
      await deleteInterview(id);
      setInterviews(prev => prev.filter(i => i.id !== id));
    } catch { alert('Failed to delete.'); }
    finally { setDeletingId(null); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  if (loading) return <div style={T.page}><Navbar /><div style={{ textAlign: 'center', padding: '100px', color: '#9b7e6e', fontStyle: 'italic' }}>Loading...</div></div>;

  return (
    <div style={T.page}>
      <Navbar />
      <div style={T.container}>
        <div style={T.pageHeader}>
          <div>
            <h1 style={T.pageTitle}>Interview History</h1>
            <p style={{ color: '#9b7e6e', fontSize: '14px' }}>{interviews.length} interview{interviews.length !== 1 ? 's' : ''} logged</p>
          </div>
          <button style={T.btnPrimary} onClick={() => navigate('/log')}>+ Log Interview</button>
        </div>

        {error && <div style={{ ...T.error, marginBottom: '20px' }}>{error}</div>}

        {interviews.length === 0 ? (
          <div style={{ ...T.card, textAlign: 'center', padding: '64px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', color: '#2c1a0e', marginBottom: '8px' }}>No interviews yet</h2>
            <p style={{ color: '#9b7e6e', marginBottom: '24px', fontSize: '14px' }}>Log your first interview to start tracking.</p>
            <button style={T.btnPrimary} onClick={() => navigate('/log')}>Log First Interview →</button>
          </div>
        ) : (
          <>
            {/* Filter buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {['All', 'Pass', 'Fail', 'Pending', 'No Response'].map(btn => (
                <button key={btn} onClick={() => setFilter(btn)} style={{
                  padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', border: '1.5px solid',
                  backgroundColor: filter === btn ? '#2c1a0e' : '#ffffff',
                  color: filter === btn ? '#f5f0e8' : '#5c3d2e',
                  borderColor: filter === btn ? '#2c1a0e' : '#ddd0bc',
                }}>
                  {btn} <span style={{ opacity: 0.6 }}>{btn === 'All' ? interviews.length : interviews.filter(i => i.outcome === btn).length}</span>
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div style={{ ...T.card, textAlign: 'center', padding: '40px', color: '#9b7e6e', fontSize: '14px' }}>
                No interviews with outcome "{filter}" yet.
              </div>
            ) : (
              <div style={T.card}>
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px', gap: '12px', padding: '12px 16px', borderBottom: '1px solid #ddd0bc', fontSize: '11px', fontWeight: '600', color: '#9b7e6e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <div>Company / Role</div><div>Date</div><div>Round</div><div>Outcome</div><div>Difficulty</div><div>Action</div>
                </div>
                {filtered.map((interview, idx) => (
                  <div key={interview.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px', gap: '12px', padding: '14px 16px', borderBottom: idx !== filtered.length - 1 ? '1px solid #f0e8dc' : 'none', alignItems: 'center', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fdf9f5' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#2c1a0e', fontSize: '14px' }}>{interview.company_name}</div>
                      <div style={{ color: '#9b7e6e', fontSize: '12px' }}>{interview.role || '—'}</div>
                    </div>
                    <div style={{ color: '#6b4c3b', fontSize: '13px' }}>{formatDate(interview.interview_date)}</div>
                    <div style={{ color: '#6b4c3b', fontSize: '13px' }}>{interview.round_type || '—'}</div>
                    <div><Badge value={interview.outcome} type="outcome" /></div>
                    <div><Badge value={interview.difficulty} type="difficulty" /></div>
                    <div>
                      <button onClick={() => handleDelete(interview.id)} disabled={deletingId === interview.id} style={{ ...T.btnDanger, opacity: deletingId === interview.id ? 0.5 : 1 }}>
                        {deletingId === interview.id ? '...' : 'Delete'}
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