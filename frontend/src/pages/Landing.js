import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import heroImage from '../styles/interview-hero.avif';

export default function Landing() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate('/dashboard');
  }, [isLoggedIn, navigate]);

  const S = {
    page: {
      backgroundColor: '#f5f0e8',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
    },

    hero: {
      position: 'relative',
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 24px',
      backgroundImage: `linear-gradient(
        rgba(0, 0, 0, 0.55),
        rgba(0, 0, 0, 0.55)
      ), url(${heroImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    },

    heroInner: {
      maxWidth: '900px',
      textAlign: 'center',
    },

    eyebrow: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      backgroundColor: 'rgba(255,255,255,0.15)',
      border: '1px solid rgba(255,255,255,0.25)',
      color: '#ffffff',
      fontSize: '12px',
      fontWeight: '500',
      padding: '6px 14px',
      borderRadius: '20px',
      marginBottom: '20px',
    },

    h1: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '58px',
      fontWeight: '700',
      color: '#ffffff',
      lineHeight: '1.15',
      marginBottom: '20px',
    },

    accent: {
      color: '#d4b08c',
    },

    subtext: {
      color: '#f0f0f0',
      fontSize: '18px',
      lineHeight: '1.7',
      marginBottom: '32px',
      maxWidth: '650px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },

    btnPrimary: {
      backgroundColor: '#d4b08c',
      color: '#2c1a0e',
      padding: '14px 28px',
      borderRadius: '10px',
      fontWeight: '600',
      fontSize: '15px',
      textDecoration: 'none',
      display: 'inline-block',
      marginRight: '12px',
    },

    btnSecondary: {
      backgroundColor: 'transparent',
      color: '#ffffff',
      padding: '14px 28px',
      borderRadius: '10px',
      fontWeight: '600',
      fontSize: '15px',
      textDecoration: 'none',
      display: 'inline-block',
      border: '1.5px solid #ffffff',
    },

    statsRow: {
      backgroundColor: '#ede6d6',
      borderTop: '1px solid #ddd0bc',
      borderBottom: '1px solid #ddd0bc',
      padding: '28px 24px',
    },

    statsInner: {
      maxWidth: '700px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      gap: '20px',
    },

    statNum: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '32px',
      fontWeight: '700',
      color: '#8b5e3c',
    },

    statLabel: {
      color: '#6b4c3b',
      fontSize: '13px',
      marginTop: '4px',
    },

    section: {
      padding: '80px 24px',
      maxWidth: '1100px',
      margin: '0 auto',
    },

    sectionTitle: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '36px',
      fontWeight: '700',
      color: '#2c1a0e',
      textAlign: 'center',
      marginBottom: '12px',
    },

    sectionSub: {
      color: '#6b4c3b',
      textAlign: 'center',
      marginBottom: '48px',
      fontSize: '16px',
    },

    grid3: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
    },

    card: {
      backgroundColor: '#ffffff',
      border: '1px solid #ddd0bc',
      borderRadius: '16px',
      padding: '28px',
    },

    cardIcon: {
      fontSize: '28px',
      marginBottom: '16px',
    },

    cardTitle: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '18px',
      color: '#2c1a0e',
      marginBottom: '8px',
      fontWeight: '600',
    },

    cardText: {
      color: '#6b4c3b',
      fontSize: '14px',
      lineHeight: '1.7',
    },

    stepNum: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '48px',
      fontWeight: '700',
      color: '#ddd0bc',
      marginBottom: '8px',
    },

    stepTitle: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '18px',
      color: '#2c1a0e',
      marginBottom: '8px',
      fontWeight: '600',
    },

    cta: {
      backgroundColor: '#2c1a0e',
      padding: '80px 24px',
      textAlign: 'center',
    },

    ctaTitle: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '36px',
      color: '#f5f0e8',
      marginBottom: '16px',
      fontWeight: '700',
    },

    ctaSub: {
      color: '#c4956a',
      marginBottom: '32px',
      fontSize: '16px',
    },

    ctaBtn: {
      backgroundColor: '#f5f0e8',
      color: '#2c1a0e',
      padding: '16px 36px',
      borderRadius: '10px',
      fontWeight: '700',
      fontSize: '16px',
      textDecoration: 'none',
      display: 'inline-block',
    },

    footer: {
      backgroundColor: '#ede6d6',
      borderTop: '1px solid #ddd0bc',
      textAlign: 'center',
      padding: '20px',
      color: '#9b7e6e',
      fontSize: '13px',
    },
  };

  return (
    <div style={S.page}>
      <Navbar />

      {/* HERO */}
      <div style={S.hero}>
        <div style={S.heroInner}>

          <h1 style={S.h1}>
            Track Interviews.
            <br />
            Identify Weaknesses.
            <br />
            <span style={S.accent}>Get Hired Faster.</span>
          </h1>

          <p style={S.subtext}>
            Log every interview, track questions asked, and let AI analyze
            your patterns to generate a personalized study plan that helps
            you crack your dream job.
          </p>

          <div>
            <Link to="/register" style={S.btnPrimary}>
              Start Tracking Free →
            </Link>

            <Link to="/login" style={S.btnSecondary}>
              Login
            </Link>
          </div>
        </div>
      </div>

             {/* STATS */}
      <div style={S.statsRow}>
        <div style={S.statsInner}>
          {[
            { num: '10x', label: 'Better Preparation' },
            { num: '100%', label: 'Free Forever' },
            { num: 'AI', label: 'Powered Insights' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={S.statNum}>{s.num}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={S.section}>
        <h2 style={S.sectionTitle}>Everything you need to crack interviews</h2>
        <p style={S.sectionSub}>Stop winging it. Start tracking it.</p>
        <div style={S.grid3}>
          {[
            { icon: '📋', title: 'Log Interviews', desc: 'Record every interview with company, role, round type, difficulty and outcome in seconds.' },
            { icon: '❓', title: 'Track Questions', desc: 'Save every question asked, tag by topic, mark what you were stuck on.' },
            { icon: '🤖', title: 'AI Study Plan', desc: 'AI analyzes your data and generates a personalized 2-week study plan for your weak areas.' },
            { icon: '📊', title: 'Visual Dashboard', desc: 'See your pass rate, round breakdown, and topic heatmap at a glance.' },
            { icon: '🎯', title: 'Spot Weak Areas', desc: 'Know exactly which topics are costing you offers — DSA, System Design, HR or others.' },
            { icon: '🚀', title: '100% Free', desc: 'No credit card. No subscription. Built for students by a student.' },
          ].map(f => (
            <div key={f.title} style={S.card}>
              <div style={S.cardIcon}>{f.icon}</div>
              <div style={S.cardTitle}>{f.title}</div>
              <div style={S.cardText}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ backgroundColor: '#ede6d6', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={S.sectionTitle}>How it works</h2>
          <p style={S.sectionSub}>Three simple steps to interview mastery</p>
          <div style={S.grid3}>
            {[
              { step: '01', title: 'Log your interviews', desc: 'After every interview, spend 2 minutes logging the company, round type, questions asked and outcome.' },
              { step: '02', title: 'Track your questions', desc: 'Add every question you were asked. Tag it by topic. Mark if you were stuck.' },
              { step: '03', title: 'Get AI insights', desc: 'Click Generate Insights and AI analyzes all your data to give you a personalized study plan.' },
            ].map(s => (
              <div key={s.step} style={{ textAlign: 'center', padding: '20px' }}>
                <div style={S.stepNum}>{s.step}</div>
                <div style={S.stepTitle}>{s.title}</div>
                <div style={S.cardText}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={S.cta}>
        <h2 style={S.ctaTitle}>Ready to land your dream job?</h2>
        <p style={S.ctaSub}>Join students who track smarter, not harder.</p>
        <Link to="/register" style={S.ctaBtn}>Get Started !</Link>
      </div>

      <div style={S.footer}>Built with 💙 · AI Interview Tracker 2026</div>
    </div>
  );
}