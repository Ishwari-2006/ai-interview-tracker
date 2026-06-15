import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getClusteredQuestions } from '../services/api';

export default function Clustering() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCluster, setExpandedCluster] = useState(null);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const res = await getClusteredQuestions();
        setData(res.data);
      } catch (err) {
        setError('Failed to load clusters.');
      } finally {
        setLoading(false);
      }
    };
    fetchClusters();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">🧠</div>
            <div className="text-gray-400 animate-pulse">
              Analyzing question patterns...
            </div>
            <div className="text-gray-600 text-sm mt-2">
              This may take a moment on first load
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Question Clusters</h1>
          <p className="text-gray-400 mt-1">
            AI automatically groups similar questions by meaning — not just keywords
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Stats row */}
        {data && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Questions', value: data.total_questions, icon: '❓' },
              { label: 'Unique Clusters', value: data.total_clusters, icon: '🔗' },
              { label: 'Repeated Patterns', value: data.clusters?.filter(c => c.question_count > 1).length || 0, icon: '🔄' },
            ].map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-gray-500 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {data?.total_questions === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center">
            <div className="text-5xl mb-4">🧠</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              No questions to cluster yet
            </h2>
            <p className="text-gray-400 mb-6">
              Log some interview questions first, then come back here to see patterns!
            </p>
            <a href="/questions" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition inline-block">
              Add Questions →
            </a>
          </div>
        ) : (
          <div className="space-y-4">

            {/* Repeated patterns section */}
            {data.clusters.filter(c => c.question_count > 1).length > 0 && (
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4 mb-6">
                <h2 className="text-yellow-400 font-semibold text-sm mb-1">
                  ⚠️ Recurring Question Patterns Detected
                </h2>
                <p className="text-gray-400 text-xs">
                  These questions appeared across multiple interviews with similar meaning.
                  Focus on these topics — companies keep asking them!
                </p>
              </div>
            )}

            {/* Cluster cards */}
            {data.clusters.map((cluster) => (
              <div
                key={cluster.cluster_id}
                className={`bg-white/5 border rounded-2xl overflow-hidden transition ${
                  cluster.question_count > 1
                    ? 'border-blue-500/30'
                    : 'border-white/10'
                }`}
              >
                {/* Cluster header — click to expand */}
                <button
                  onClick={() => setExpandedCluster(
                    expandedCluster === cluster.cluster_id ? null : cluster.cluster_id
                  )}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3">
                    {/* Badge showing question count */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                      cluster.question_count > 1
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-white/10 text-gray-400'
                    }`}>
                      {cluster.question_count}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">
                        {cluster.theme}
                      </div>
                      <div className="text-gray-500 text-xs mt-0.5">
                        {cluster.question_count === 1
                          ? '1 question'
                          : `${cluster.question_count} similar questions grouped`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cluster.question_count > 1 && (
                      <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-full">
                        Recurring
                      </span>
                    )}
                    <span className="text-gray-500 text-sm">
                      {expandedCluster === cluster.cluster_id ? '▲' : '▼'}
                    </span>
                  </div>
                </button>

                {/* Expanded questions list */}
                {expandedCluster === cluster.cluster_id && (
                  <div className="border-t border-white/10 divide-y divide-white/5">
                    {cluster.questions.map((q, idx) => (
                      <div key={q.id} className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <span className="text-gray-600 text-xs mt-1 shrink-0">
                            {idx + 1}.
                          </span>
                          <div className="flex-1">
                            <p className="text-gray-200 text-sm leading-relaxed">
                              {q.question_text}
                            </p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {q.topic_tag && (
                                <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-full">
                                  {q.topic_tag}
                                </span>
                              )}
                              {q.was_stuck && (
                                <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-full">
                                  🔴 Was Stuck
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}