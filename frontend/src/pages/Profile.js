import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getProfile, updateProfile, getDashboardStats } from '../services/api';
import { T } from '../styles/theme';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [targetCompanies, setTargetCompanies] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    Promise.all([getProfile(), getDashboardStats()])
      .then(([pRes, sRes]) => {
        setProfile(pRes.data); setStats(sRes.data);
        setName(pRes.data.name); setTargetRole(pRes.data.target_role || ''); setTargetCompanies(pRes.data.target_companies || '');
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, target_role: targetRole || null, target_companies: targetCompanies || null });
      setProfile(prev => ({ ...prev, name, target_role: targetRole, target_companies: targetCompanies }));
      setEditing(false); setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      if (err.response?.status === 429) alert('Too many attempts! Please wait 1 minute.');
      else alert('Failed to save. Please try again.');
    } finally { setSaving(false); }
  };

  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://ai-interview-tracker-backend.onrender.com/pdf/report', { headers: { 'Authorization': `Bearer ${token}` } });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'interview-report.pdf';
      document.body.appendChild(a); a.click();
      window.URL.revokeObjectURL(url); document.body.removeChild(a);
    } catch { alert('Failed to download report.'); }
  };

  const getInitials = (n) => n ? n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  if (loading) return <div style={T.page}><Navbar /><div style={{ textAlign: 'center', padding: '100px', color: '#9b7e6e', fontStyle: 'italic' }}>Loading profile...</div></div>;
  if (error) return <div style={T.page}><Navbar /><div style={{ textAlign: 'center', padding: '100px', color: '#8b2e2e' }}>{error}</div></div>;

  return (
    <div style={T.page}>
      <Navbar />
      <div style={T.container}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={T.pageTitle}>Profile</h1>
          <p style={{ color: '#9b7e6e', fontSize: '14px' }}>Manage your account details</p>
        </div>

        {saveSuccess && <div style={{ ...T.success, marginBottom: '20px' }}>✅ Profile updated successfully!</div>}

        {/* Profile banner */}
        <div style={{ background: 'linear-gradient(135deg, #ede6d6 0%, #f5f0e8 100%)', border: '1px solid #ddd0bc', borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#2c1a0e', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5f0e8', fontWeight: '700', fontSize: '28px', flexShrink: 0, fontFamily: 'Playfair Display, serif' }}>
              {getInitials(profile.name)}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', color: '#2c1a0e', marginBottom: '4px' }}>{profile.name}</h2>
              <p style={{ color: '#9b7e6e', fontSize: '14px' }}>{profile.email}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                {profile.target_role && <span style={T.badge('brown')}>🎯 {profile.target_role}</span>}
                {profile.target_companies && <span style={{ ...T.badge('brown'), backgroundColor: '#f5f0ff', color: '#5c3d8f', borderColor: '#d8c0f0' }}>🏢 {profile.target_companies}</span>}
              </div>
              <p style={{ color: '#c4956a', fontSize: '12px', marginTop: '8px' }}>🗓️ Member since {formatDate(profile.created_at)}</p>
            </div>
            {!editing && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => setEditing(true)} style={T.btnSecondary}>✏️ Edit Profile</button>
                <button onClick={downloadPDF} style={T.btnPrimary}>📄 Download Report</button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Interviews', value: stats.total_interviews, icon: '🏢', color: '#2c1a0e' },
              { label: 'Pass Rate', value: `${stats.pass_rate}%`, icon: '✅', color: '#4a7c59' },
              { label: 'Questions', value: stats.total_questions, icon: '❓', color: '#8b5e3c' },
              { label: 'Stuck On', value: stats.stuck_questions, icon: '🎯', color: '#8b2e2e' },
            ].map(s => (
              <div key={s.label} style={T.statCard}>
                <div style={{ fontSize: '20px', marginBottom: '6px' }}>{s.icon}</div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', fontWeight: '700', color: s.color }}>{s.value}</div>
                <div style={T.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* Account info */}
          <div style={T.card}>
            <h2 style={T.sectionTitle}>👤 Account Info</h2>
            {editing ? (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div><label style={T.label}>Full Name *</label><input type="text" value={name} onChange={e => setName(e.target.value)} style={T.input} required /></div>
                <div><label style={T.label}>Email</label><input type="text" value={profile.email} style={{ ...T.input, opacity: 0.5, cursor: 'not-allowed' }} disabled /><p style={{ fontSize: '11px', color: '#9b7e6e', marginTop: '4px' }}>Email cannot be changed</p></div>
                <div><label style={T.label}>Target Role</label><input type="text" value={targetRole} onChange={e => setTargetRole(e.target.value)} style={T.input} placeholder="e.g. Software Engineer Intern" /></div>
                <div><label style={T.label}>Target Companies</label><input type="text" value={targetCompanies} onChange={e => setTargetCompanies(e.target.value)} style={T.input} placeholder="e.g. Google, Microsoft" /></div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" disabled={saving} style={{ ...T.btnFull, opacity: saving ? 0.6 : 1 }}>{saving ? 'Saving...' : '💾 Save'}</button>
                  <button type="button" onClick={() => { setEditing(false); setName(profile.name); setTargetRole(profile.target_role || ''); setTargetCompanies(profile.target_companies || ''); }} style={T.btnSecondary}>Cancel</button>
                </div>
              </form>
            ) : (
              <div>
                {[
                  { label: 'Full Name', value: profile.name, icon: '👤' },
                  { label: 'Email', value: profile.email, icon: '📧' },
                  { label: 'Target Role', value: profile.target_role || 'Not set', icon: '🎯' },
                  { label: 'Target Companies', value: profile.target_companies || 'Not set', icon: '🏢' },
                ].map(field => (
                  <div key={field.label} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f0e8dc' }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{field.icon}</span>
                    <div>
                      <div style={{ fontSize: '11px', color: '#9b7e6e', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{field.label}</div>
                      <div style={{ fontSize: '14px', color: field.value === 'Not set' ? '#c4956a' : '#2c1a0e', fontStyle: field.value === 'Not set' ? 'italic' : 'normal' }}>{field.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity summary */}
          <div style={T.card}>
            <h2 style={T.sectionTitle}>📊 Activity Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#5c3d2e' }}>Pass Rate</span>
                  <span style={{ color: '#4a7c59', fontWeight: '600' }}>{stats?.pass_rate || 0}%</span>
                </div>
                <div style={{ backgroundColor: '#ede6d6', borderRadius: '4px', height: '8px' }}>
                  <div style={{ width: `${stats?.pass_rate || 0}%`, backgroundColor: '#4a7c59', height: '8px', borderRadius: '4px' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#5c3d2e' }}>Questions Stuck On</span>
                  <span style={{ color: '#8b2e2e', fontWeight: '600' }}>{stats?.total_questions > 0 ? Math.round(stats.stuck_questions / stats.total_questions * 100) : 0}%</span>
                </div>
                <div style={{ backgroundColor: '#ede6d6', borderRadius: '4px', height: '8px' }}>
                  <div style={{ width: `${stats?.total_questions > 0 ? Math.round(stats.stuck_questions / stats.total_questions * 100) : 0}%`, backgroundColor: '#8b2e2e', height: '8px', borderRadius: '4px' }} />
                </div>
              </div>
              {stats?.stuck_by_topic?.filter(t => t.topic).length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', color: '#9b7e6e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Top Weak Areas</div>
                  {stats.stuck_by_topic.filter(t => t.topic).sort((a, b) => b.count - a.count).slice(0, 3).map(t => (
                    <div key={t.topic} style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#fdf0f0', border: '1px solid #f0d0d0', borderRadius: '8px', padding: '8px 12px', marginBottom: '6px' }}>
                      <span style={{ color: '#5c3d2e', fontSize: '13px' }}>{t.topic}</span>
                      <span style={{ color: '#8b2e2e', fontSize: '13px', fontWeight: '600' }}>{t.count} stuck</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ borderTop: '1px solid #ddd0bc', paddingTop: '16px' }}>
                <div style={{ fontSize: '11px', color: '#9b7e6e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Quick Actions</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[{ label: '+ Log Interview', to: '/log' }, { label: '📊 Dashboard', to: '/dashboard' }, { label: '❓ Questions', to: '/questions' }, { label: '🤖 AI Insights', to: '/insights' }].map(link => (
                    <a key={link.label} href={link.to} style={{ textAlign: 'center', fontSize: '12px', color: '#5c3d2e', backgroundColor: '#f9f5ef', border: '1px solid #ddd0bc', borderRadius: '8px', padding: '8px', textDecoration: 'none', display: 'block' }}>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}