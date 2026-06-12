import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col items-center text-center px-6 pt-24 pb-16">
        <div className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
          ✨ AI-Powered Interview Preparation
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-3xl mb-6">
          Track Interviews.<br />
          <span className="text-blue-400">Identify Weaknesses.</span><br />
          Get Hired Faster.
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mb-10">
          Log every interview, track questions asked, and let AI analyze your patterns to give you a personalized study plan.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/register" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-white transition text-sm">
            Start Tracking Free →
          </Link>
          <Link to="/login" className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-white transition text-sm">
            Login
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex justify-center gap-12 py-10 border-y border-white/10 mx-8 flex-wrap">
        {[
          { number: '10x', label: 'Better Preparation' },
          { number: '100%', label: 'Free Forever' },
          { number: 'AI', label: 'Powered Insights' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold text-blue-400">{stat.number}</div>
            <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="px-8 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Everything you need to crack interviews</h2>
        <p className="text-gray-400 text-center mb-14">Stop winging it. Start tracking it.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '📋', title: 'Log Interviews', desc: 'Record every interview with company, role, round type, difficulty and outcome in seconds.' },
            { icon: '❓', title: 'Track Questions', desc: 'Save every question asked, tag by topic, mark what you were stuck on.' },
            { icon: '🤖', title: 'AI Study Plan', desc: 'AI analyzes your data and generates a personalized 2-week study plan for your weak areas.' },
            { icon: '📊', title: 'Visual Dashboard', desc: 'See your pass rate, round breakdown, and topic heatmap at a glance.' },
            { icon: '🎯', title: 'Spot Weak Areas', desc: 'Know exactly which topics are costing you offers — DSA, System Design, HR or others.' },
            { icon: '🚀', title: '100% Free', desc: 'No credit card. No subscription. Built for students by a student.' },
          ].map((f) => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="px-8 py-20 border-t border-white/10 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">How it works</h2>
        <p className="text-gray-400 text-center mb-14">Three simple steps to interview mastery</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Log your interviews', desc: 'After every interview, spend 2 minutes logging the company, round type, questions asked and outcome.' },
            { step: '02', title: 'Track your questions', desc: 'Add every question you were asked. Tag it by topic. Mark if you were stuck.' },
            { step: '03', title: 'Get AI insights', desc: 'Click Generate Insights and AI analyzes all your data to give you a personalized study plan.' },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 font-bold text-lg mx-auto mb-4">{s.step}</div>
              <h3 className="font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center px-8 py-20 border-t border-white/10">
        <h2 className="text-3xl font-bold mb-4">Ready to land your dream internship?</h2>
        <p className="text-gray-400 mb-8">Join students who track smarter, not harder.</p>
        <Link to="/register" className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-white transition inline-block">
          Get Started — It's Free 🚀
        </Link>
      </div>

      {/* Footer */}
      <div className="text-center py-6 border-t border-white/10 text-gray-500 text-sm">
        Built with 💙 · AI Interview Tracker 2026
      </div>

    </div>
  );
}