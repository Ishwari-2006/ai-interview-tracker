import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getDashboardStats } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Colors for the pie chart slices
const PIE_COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#6b7280'];

// A single stat card component — we reuse this 4 times
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-2">
      <div className={`text-2xl`}>{icon}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-sm font-medium text-gray-300">{label}</div>
      {sub && <div className={`text-xs ${color || 'text-gray-500'}`}>{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);   // will hold all our data from backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // When the page loads, fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []); // empty [] means "run once when page loads"

  // Show spinner while loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-400 text-lg animate-pulse">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  // Show error if fetch failed
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  // Build the pie chart data from pass/fail/pending numbers
  const outcomeData = [
    { name: 'Pass', value: stats.passed },
    { name: 'Fail', value: stats.failed },
    { name: 'Pending', value: stats.total_interviews - stats.passed - stats.failed },
  ].filter(d => d.value > 0); // hide slices with 0 value

  // round_breakdown from backend looks like [{round: "DSA", count: 3}, ...]
  // Recharts needs it in this shape already — so we use it directly
  const roundData = stats.round_breakdown.filter(r => r.round !== null);

  // topic_breakdown for the bar chart
  const topicData = stats.topic_breakdown.filter(t => t.topic !== null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Page header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Here's how your interview prep is going 📊</p>
          </div>
          <button
            onClick={() => navigate('/log')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition"
          >
            + Log Interview
          </button>
        </div>

        {/* If no data yet, show an empty state */}
        {stats.total_interviews === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-white mb-2">No interviews logged yet</h2>
            <p className="text-gray-400 mb-6">Start by logging your first interview to see your stats here.</p>
            <button
              onClick={() => navigate('/log')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition"
            >
              Log Your First Interview →
            </button>
          </div>
        ) : (
          <>
            {/* ── STAT CARDS ROW ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon="📋"
                label="Total Interviews"
                value={stats.total_interviews}
                sub="All time"
              />
              <StatCard
                icon="✅"
                label="Pass Rate"
                value={`${stats.pass_rate}%`}
                sub={`${stats.passed} passed · ${stats.failed} failed`}
                color="text-green-400"
              />
              <StatCard
                icon="❓"
                label="Questions Logged"
                value={stats.total_questions}
                sub="Across all interviews"
              />
              <StatCard
                icon="🔴"
                label="Stuck Questions"
                value={stats.stuck_questions}
                sub={stats.total_questions > 0 ? `${Math.round(stats.stuck_questions / stats.total_questions * 100)}% of total` : ''}
                color="text-red-400"
              />
            </div>

            {/* ── CHARTS ROW ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

              {/* Bar Chart: Interviews by Round Type */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-1">Interviews by Round</h2>
                <p className="text-gray-500 text-xs mb-4">Which round types you've appeared for</p>
                {roundData.length === 0 ? (
                  <div className="text-gray-500 text-sm text-center py-8">No round data yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={roundData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      {/* XAxis shows the round names */}
                      <XAxis dataKey="round" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                      {/* YAxis shows the count numbers */}
                      <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} allowDecimals={false} />
                      {/* Tooltip is the popup that appears on hover */}
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                      />
                      {/* Bar is the actual bar — dataKey="count" means use the count field */}
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Pie Chart: Pass / Fail / Pending */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-1">Outcome Breakdown</h2>
                <p className="text-gray-500 text-xs mb-4">Pass vs Fail vs Pending</p>
                {outcomeData.length === 0 ? (
                  <div className="text-gray-500 text-sm text-center py-8">No outcome data yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie
                        data={outcomeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="value"
                        label={false}
                        >
                        {outcomeData.map((entry, index) => (
                            <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                        formatter={(value, name) => [value, name]}
                        />
                        <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ color: '#9ca3af', fontSize: '12px', paddingTop: '12px' }}
                        />
                    </PieChart>
                    </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* ── TOPIC BREAKDOWN + STUCK TOPICS ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Questions by Topic */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-1">Questions by Topic</h2>
                <p className="text-gray-500 text-xs mb-4">Which topics come up most</p>
                {topicData.length === 0 ? (
                  <div className="text-gray-500 text-sm text-center py-8">No topic data yet</div>
                ) : (
                  <div className="space-y-3">
                    {topicData.map((t) => {
                      // Calculate what % this topic is of total questions
                      const pct = stats.total_questions > 0 ? Math.round(t.count / stats.total_questions * 100) : 0;
                      return (
                        <div key={t.topic}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">{t.topic}</span>
                            <span className="text-gray-500">{t.count} questions</span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Stuck Topics — where you struggled most */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-1">🔴 Weak Areas</h2>
                <p className="text-gray-500 text-xs mb-4">Topics where you were stuck most</p>
                {stats.stuck_by_topic.length === 0 ? (
                  <div className="text-gray-500 text-sm text-center py-8">No stuck questions yet — great!</div>
                ) : (
                  <div className="space-y-3">
                    {stats.stuck_by_topic
                      .filter(t => t.topic !== null)
                      .sort((a, b) => b.count - a.count)  // sort highest first
                      .map((t) => (
                        <div key={t.topic} className="flex items-center justify-between bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-3">
                          <span className="text-gray-300 text-sm">{t.topic}</span>
                          <span className="text-red-400 text-sm font-semibold">{t.count} stuck</span>
                        </div>
                      ))
                    }
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