import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { createInterview } from '../services/api';
import { T } from '../styles/theme';

export default function LogInterview() {
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [roundType, setRoundType] = useState('');
  const [outcome, setOutcome] = useState('Pending');
  const [difficulty, setDifficulty] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createInterview({
        company_name: companyName,
        role: role || null,
        interview_date: interviewDate || null,
        round_type: roundType || null,
        outcome,
        difficulty: difficulty || null,
        notes: notes || null,
      });
      setSuccess(true);
      setTimeout(() => navigate('/history'), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to log interview.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={T.page}>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={T.pageTitle}>Log New Interview</h1>
          <p style={{ color: '#9b7e6e', fontSize: '14px' }}>Fill in the details of your interview below.</p>
        </div>

        {success && <div style={{ ...T.success, marginBottom: '20px' }}>✅ Interview logged successfully! Redirecting...</div>}
        {error && <div style={{ ...T.error, marginBottom: '20px' }}>❌ {error}</div>}

        <div style={T.card}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={T.label}>Company Name *</label>
                <input value={companyName} onChange={e => setCompanyName(e.target.value)} style={T.input} placeholder="e.g. Google, TCS" required />
              </div>
              <div>
                <label style={T.label}>Role</label>
                <input value={role} onChange={e => setRole(e.target.value)} style={T.input} placeholder="e.g. SWE Intern" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={T.label}>Interview Date</label>
                <input type="date" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} style={T.input} />
              </div>
              <div>
                <label style={T.label}>Round Type</label>
                <select value={roundType} onChange={e => setRoundType(e.target.value)} style={T.select}>
                  <option value="">-- Select Round --</option>
                  {['HR', 'Technical', 'DSA', 'System Design', 'Managerial'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={T.label}>Outcome</label>
                <select value={outcome} onChange={e => setOutcome(e.target.value)} style={T.select}>
                  {['Pending', 'Pass', 'Fail', 'No Response'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={T.label}>Difficulty</label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={T.select}>
                  <option value="">-- Select --</option>
                  {['Easy', 'Medium', 'Hard'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={T.label}>Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} style={{ ...T.textarea, minHeight: '100px' }} placeholder="What happened? What topics came up?" />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" disabled={loading} style={{ ...T.btnPrimary, flex: 1, opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Saving...' : '📋 Log Interview'}
              </button>
              <button type="button" onClick={() => navigate('/history')} style={T.btnSecondary}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}