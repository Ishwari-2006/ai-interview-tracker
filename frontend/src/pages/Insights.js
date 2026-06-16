import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getInterviews, getQuestions, getDashboardStats, generateInsights as callInsightsAPI } from '../services/api';
import { T } from '../styles/theme';

export default function Insights() {
  const [interviews, setInterviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    Promise.all([getInterviews(), getQuestions(), getDashboardStats()])
      .then(([iRes, qRes, sRes]) => { setInterviews(iRes.data); setQuestions(qRes.data); setStats(sRes.data); })
      .catch(() => setError('Failed to load your data.'))
      .finally(() => setLoading(false));
  }, []);

  const generateInsights = async () => {
    if (interviews.length === 0) { alert('Please log at least one interview first!'); return; }
    setCooldown(true);
    setTimeout(() => setCooldown(false), 30000);
    setGenerating(true);
    setInsights(null);
    setError('');
    try {
      const res = await callInsightsAPI({
        interviews, questions,
        total_interviews: stats.total_interviews,
        pass_rate: stats.pass_rate,
        total_questions: stats.total_questions,
        stuck_questions: stats.stuck_questions,
        stuck_by_topic: stats.stuck_by_topic,
      });
      setInsights(res.data.insights);
    } catch { setError('Failed to generate insights. Please try again.'); }
    finally { setGenerating(false); }
  };

  const parseSections = (text) => {
    if (!text) return [];
    const lines = text.split('\n');
    const sections = [];
    let current = null;
    lines.forEach(line => {
      if (line.startsWith('## ')) {
        if (current) sections.push(current);
        current = { title: line.replace('## ', ''), content: [] };
      } else if (current) current.content.push(line);
    });
    if (current) sections.push(current);
    return sections;
  };

  const sectionIcon = { 'Performance Summary': '📊', 'Weak Areas': '🎯', '2-Week Study Plan': '📅', 'Recommended Resources': '📚', 'Keep Going!': '💪' };
  const sectionAccent = { 'Performance Summary': '#ddeeff', 'Weak Areas': '#fdf0f0', '2-Week Study Plan': '#fdf8f0', 'Recommended Resources': '#f0faf4', 'Keep Going!': '#f5f0ff' };
  const sectionBorder = { 'Performance Summary': '#c0d8f0', 'Weak Areas': '#f0d0d0', '2-Week Study Plan': '#f0ddb0', 'Recommended Resources': '#c0dfc8', 'Keep Going!': '#d8c0f0' };

  if (loading) return <div style={T.page}><Navbar /><div style={{ textAlign: 'center', padding: '100px', color: '#9b7e6e', fontStyle: 'italic' }}>Loading your data...</div></div>;

  const sections = parseSections(insights);

  return (
    <div style={T.page}>
      <Navbar />
      <div style={T.container}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={T.pageTitle}>AI Insights</h1>
          <p style={{ color: '#9b7e6e', fontSize: '14px' }}>AI analyzes your interview data and builds you a personalized study plan</p>
        </div>

        {error && <div style={{ ...T.error, marginBottom: '20px' }}>{error}</div>}

        {/* Data summary */}
        <div style={{ ...T.card, marginBottom: '32px' }}>
          <h2 style={{ ...T.sectionTitle, marginBottom: '20px' }}>📋 Data ready for analysis</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Interviews', value: stats?.total_interviews || 0, icon: '🏢' },
              { label: 'Questions', value: stats?.total_questions || 0, icon: '❓' },
              { label: 'Stuck On', value: stats?.stuck_questions || 0, icon: '🎯' },
              { label: 'Pass Rate', value: `${stats?.pass_rate || 0}%`, icon: '✅' },
            ].map(s => (
              <div key={s.label} style={{ ...T.statCard, backgroundColor: '#f9f5ef' }}>
                <div style={{ fontSize: '20px', marginBottom: '6px' }}>{s.icon}</div>
                <div style={{ ...T.statNum, fontSize: '22px' }}>{s.value}</div>
                <div style={T.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
          <button onClick={generateInsights} disabled={generating || interviews.length === 0 || cooldown}
            style={{ ...T.btnFull, opacity: (generating || interviews.length === 0 || cooldown) ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {generating ? (
              <><span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(245,240,232,0.3)', borderTop: '2px solid #f5f0e8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />Analyzing your data...</>
            ) : cooldown ? '⏳ Wait 30s before regenerating...' : '🤖 Generate AI Insights'}
          </button>
          {interviews.length === 0 && <p style={{ textAlign: 'center', color: '#9b7e6e', fontSize: '12px', marginTop: '8px' }}>Log at least one interview to generate insights</p>}
        </div>

        {/* AI Response */}
        {sections.length > 0 && (
          <div>
            <h2 style={{ ...T.sectionTitle, marginBottom: '20px', fontSize: '22px' }}>✨ Your Personalized Analysis</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sections.map(section => (
                <div key={section.title} style={{ backgroundColor: sectionAccent[section.title] || '#f9f5ef', border: `1px solid ${sectionBorder[section.title] || '#ddd0bc'}`, borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#2c1a0e', marginBottom: '12px', fontWeight: '600' }}>
                    {sectionIcon[section.title] || '•'} {section.title}
                  </h3>
                  <div style={{ color: '#5c3d2e', fontSize: '14px', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {section.content.map((line, i) => {
                      if (!line.trim()) return null;
                      if (line.trim().startsWith('-') || line.trim().startsWith('•')) return (
                        <div key={i} style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ color: '#8b5e3c', flexShrink: 0 }}>•</span>
                          <span>{line.replace(/^[-•]\s*/, '')}</span>
                        </div>
                      );
                      if (/^\d+\./.test(line.trim())) return (
                        <div key={i} style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ color: '#8b5e3c', flexShrink: 0, fontWeight: '600' }}>{line.match(/^\d+\./)[0]}</span>
                          <span>{line.replace(/^\d+\.\s*/, '')}</span>
                        </div>
                      );
                      return <p key={i}>{line}</p>;
                    })}
                  </div>
                </div>
              ))}
              <button onClick={generateInsights} disabled={generating || cooldown}
                style={{ ...T.btnSecondary, opacity: (generating || cooldown) ? 0.6 : 1 }}>
                {cooldown ? '⏳ Wait 30s...' : '🔄 Regenerate Analysis'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}