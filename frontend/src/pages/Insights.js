import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getInterviews, getQuestions, getDashboardStats, generateInsights as callInsightsAPI } from '../services/api';

export default function Insights() {
  const [interviews, setInterviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [insights, setInsights] = useState(null);  // AI response stored here
  const [error, setError] = useState('');

  // Fetch all data when page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [iRes, qRes, sRes] = await Promise.all([
          getInterviews(),
          getQuestions(),
          getDashboardStats(),
        ]);
        setInterviews(iRes.data);
        setQuestions(qRes.data);
        setStats(sRes.data);
      } catch (err) {
        setError('Failed to load your data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

 
  const generateInsights = async () => {
    if (interviews.length === 0) {
      alert('Please log at least one interview before generating insights!');
      return;
    }

    setGenerating(true);
    setInsights(null);
    setError('');

    try {
      // Send all data to our backend, which calls Claude
      const res = await callInsightsAPI({
        interviews,
        questions,
        total_interviews: stats.total_interviews,
        pass_rate: stats.pass_rate,
        total_questions: stats.total_questions,
        stuck_questions: stats.stuck_questions,
        stuck_by_topic: stats.stuck_by_topic,
      });

      setInsights(res.data.insights);

    } catch (err) {
      setError('Failed to generate insights. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // Parse Claude's markdown response into sections
  // Split by ## headings so we can style each section differently
  const parseSections = (text) => {
    if (!text) return [];
    const lines = text.split('\n');
    const sections = [];
    let current = null;

    lines.forEach(line => {
      if (line.startsWith('## ')) {
        // Save previous section
        if (current) sections.push(current);
        // Start new section
        current = { title: line.replace('## ', ''), content: [] };
      } else if (current) {
        current.content.push(line);
      }
    });
    // Push last section
    if (current) sections.push(current);
    return sections;
  };

  // Icon for each section header
  const sectionIcon = {
    'Performance Summary': '📊',
    'Weak Areas': '🎯',
    '2-Week Study Plan': '📅',
    'Recommended Resources': '📚',
    'Keep Going!': '💪',
  };

  // Color accent for each section
  const sectionColor = {
    'Performance Summary': 'border-blue-500/30',
    'Weak Areas': 'border-red-500/30',
    '2-Week Study Plan': 'border-yellow-500/30',
    'Recommended Resources': 'border-green-500/30',
    'Keep Going!': 'border-purple-500/30',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-400 animate-pulse">Loading your data...</div>
        </div>
      </div>
    );
  }

  const sections = parseSections(insights);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">AI Insights</h1>
          <p className="text-gray-400 mt-1">
            AI analyzes your interview data and builds you a personalized study plan
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Data summary card — shows what groq AI will analyze */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            📋 Data ready for analysis
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Interviews', value: stats?.total_interviews || 0, icon: '🏢' },
              { label: 'Questions', value: stats?.total_questions || 0, icon: '❓' },
              { label: 'Stuck On', value: stats?.stuck_questions || 0, icon: '🔴' },
              { label: 'Pass Rate', value: `${stats?.pass_rate || 0}%`, icon: '✅' },
            ].map(s => (
              <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-xl font-bold text-white">{s.value}</div>
                <div className="text-gray-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Generate button */}
          <button
            onClick={generateInsights}
            disabled={generating || interviews.length === 0}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-base transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                AI is analyzing your data...
              </>
            ) : (
              <>
                🤖 Generate AI Insights
              </>
            )}
          </button>

          {interviews.length === 0 && (
            <p className="text-center text-gray-600 text-xs mt-3">
              Log at least one interview to generate insights
            </p>
          )}
        </div>

        {/* AI Response sections */}
        {sections.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-2">
              ✨ Your Personalized Analysis
            </h2>
            {sections.map((section) => (
              <div
                key={section.title}
                className={`bg-white/5 border ${sectionColor[section.title] || 'border-white/10'} rounded-2xl p-6`}
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  {sectionIcon[section.title] || '•'} {section.title}
                </h3>
                <div className="text-gray-300 text-sm leading-relaxed space-y-1">
                  {section.content.map((line, i) => {
                    if (line.trim() === '') return null;
                    // Bold lines that start with ** (markdown bold)
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return (
                        <p key={i} className="font-semibold text-white">
                          {line.replace(/\*\*/g, '')}
                        </p>
                      );
                    }
                    // Lines starting with - are bullet points
                    if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                      return (
                        <div key={i} className="flex gap-2">
                          <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                          <span>{line.replace(/^[-•]\s*/, '')}</span>
                        </div>
                      );
                    }
                    // Lines starting with numbers (1. 2. etc)
                    if (/^\d+\./.test(line.trim())) {
                      return (
                        <div key={i} className="flex gap-2">
                          <span className="text-blue-400 shrink-0 font-medium">
                            {line.match(/^\d+\./)[0]}
                          </span>
                          <span>{line.replace(/^\d+\.\s*/, '')}</span>
                        </div>
                      );
                    }
                    return <p key={i}>{line}</p>;
                  })}
                </div>
              </div>
            ))}

            {/* Regenerate button */}
            <button
              onClick={generateInsights}
              disabled={generating}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-sm transition disabled:opacity-50"
            >
              🔄 Regenerate Analysis
            </button>
          </div>
        )}

      </div>
    </div>
  );
}