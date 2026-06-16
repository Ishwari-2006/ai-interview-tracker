import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getDashboardStats } from '../services/api';
import { T } from '../styles/theme';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const PIE_COLORS = ['#4a7c59', '#8b2e2e', '#c4956a', '#9b7e6e'];

function StatCard({ icon, label, value, sub, subColor }) {
  return (
    <div style={T.statCard}>
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
      <div style={T.statNum}>{value}</div>
      <div style={{ color: '#5c3d2e', fontSize: '13px', fontWeight: '500', marginTop: '4px' }}>{label}</div>
      {sub && <div style={{ fontSize: '12px', color: subColor || '#9b7e6e', marginTop: '4px' }}>{sub}</div>}
    </div>
  );
}

const tooltipStyle = { backgroundColor: '#ffffff', border: '1px solid #ddd0bc', borderRadius: '8px', color: '#2c1a0e', fontSize: '13px' };

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardStats()
      .then(res => setStats(res.data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={T.page}><Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <div style={{ color: '#9b7e6e', fontStyle: 'italic' }}>Loading your dashboard...</div>
      </div>
    </div>
  );

  if (error) return (
    <div style={T.page}><Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <div style={{ color: '#8b2e2e' }}>{error}</div>
      </div>
    </div>
  );

  const outcomeData = [
    { name: 'Pass', value: stats.passed },
    { name: 'Fail', value: stats.failed },
    { name: 'Pending', value: stats.total_interviews - stats.passed - stats.failed },
  ].filter(d => d.value > 0);

  const roundData = stats.round_breakdown.filter(r => r.round !== null);
  const topicData = stats.topic_breakdown.filter(t => t.topic !== null);

  return (
    <div style={T.page}>
      <Navbar />
      <div style={T.container}>

        {/* Header */}
        <div style={T.pageHeader}>
          <div>
            <h1 style={T.pageTitle}>Dashboard</h1>
            <p style={{ color: '#9b7e6e', fontSize: '14px' }}>Here's how your interview prep is going</p>
          </div>
          <button style={T.btnPrimary} onClick={() => navigate('/log')}>+ Log Interview</button>
        </div>

        {stats.total_interviews === 0 ? (
          <div style={{ ...T.card, textAlign: 'center', padding: '64px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', color: '#2c1a0e', marginBottom: '8px' }}>No interviews logged yet</h2>
            <p style={{ color: '#9b7e6e', marginBottom: '24px', fontSize: '14px' }}>Start by logging your first interview to see your stats here.</p>
            <button style={T.btnPrimary} onClick={() => navigate('/log')}>Log Your First Interview →</button>
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <StatCard icon="📋" label="Total Interviews" value={stats.total_interviews} sub="All time" />
              <StatCard icon="✅" label="Pass Rate" value={`${stats.pass_rate}%`} sub={`${stats.passed} passed · ${stats.failed} failed`} subColor="#4a7c59" />
              <StatCard icon="❓" label="Questions Logged" value={stats.total_questions} sub="Across all interviews" />
              <StatCard icon="🎯" label="Stuck Questions" value={stats.stuck_questions} sub={stats.total_questions > 0 ? `${Math.round(stats.stuck_questions / stats.total_questions * 100)}% of total` : ''} subColor="#8b2e2e" />
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div style={T.card}>
                <h2 style={T.sectionTitle}>Interviews by Round</h2>
                <p style={{ color: '#9b7e6e', fontSize: '12px', marginBottom: '16px' }}>Which round types you've appeared for</p>
                {roundData.length === 0 ? (
                  <div style={{ color: '#9b7e6e', textAlign: 'center', padding: '40px', fontSize: '13px' }}>No round data yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={roundData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <XAxis dataKey="round" tick={{ fill: '#9b7e6e', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#9b7e6e', fontSize: 11 }} allowDecimals={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="count" fill="#8b5e3c" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div style={T.card}>
                <h2 style={T.sectionTitle}>Outcome Breakdown</h2>
                <p style={{ color: '#9b7e6e', fontSize: '12px', marginBottom: '16px' }}>Pass vs Fail vs Pending</p>
                {outcomeData.length === 0 ? (
                  <div style={{ color: '#9b7e6e', textAlign: 'center', padding: '40px', fontSize: '13px' }}>No outcome data yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={outcomeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={false}>
                        {outcomeData.map((entry, index) => (
                          <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ color: '#9b7e6e', fontSize: '12px', paddingTop: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Topic breakdown + weak areas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={T.card}>
                <h2 style={T.sectionTitle}>Questions by Topic</h2>
                {topicData.length === 0 ? (
                  <div style={{ color: '#9b7e6e', textAlign: 'center', padding: '40px', fontSize: '13px' }}>No topic data yet</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {topicData.map(t => {
                      const pct = stats.total_questions > 0 ? Math.round(t.count / stats.total_questions * 100) : 0;
                      return (
                        <div key={t.topic}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                            <span style={{ color: '#5c3d2e' }}>{t.topic}</span>
                            <span style={{ color: '#9b7e6e' }}>{t.count}</span>
                          </div>
                          <div style={{ width: '100%', backgroundColor: '#ede6d6', borderRadius: '4px', height: '6px' }}>
                            <div style={{ width: `${pct}%`, backgroundColor: '#8b5e3c', height: '6px', borderRadius: '4px' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={T.card}>
                <h2 style={T.sectionTitle}>🎯 Weak Areas</h2>
                {stats.stuck_by_topic.filter(t => t.topic).length === 0 ? (
                  <div style={{ color: '#9b7e6e', textAlign: 'center', padding: '40px', fontSize: '13px' }}>No stuck questions yet — great!</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {stats.stuck_by_topic.filter(t => t.topic).sort((a, b) => b.count - a.count).map(t => (
                      <div key={t.topic} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fdf0f0', border: '1px solid #f0d0d0', borderRadius: '8px', padding: '10px 14px' }}>
                        <span style={{ color: '#5c3d2e', fontSize: '13px' }}>{t.topic}</span>
                        <span style={{ color: '#8b2e2e', fontSize: '13px', fontWeight: '600' }}>{t.count} stuck</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}