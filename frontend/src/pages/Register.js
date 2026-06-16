import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate('/dashboard');
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await registerUser({ name, email, password });
      navigate('/login');
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Too many attempts! Please wait 1 minute and try again.');
      } else {
        setError(err.response?.data?.detail || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const S = {
    page: { backgroundColor: '#f5f0e8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, sans-serif' },
    card: { backgroundColor: '#ffffff', border: '1px solid #ddd0bc', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(44,26,14,0.08)' },
    back: { display: 'flex', alignItems: 'center', gap: '6px', color: '#9b7e6e', fontSize: '13px', marginBottom: '24px', cursor: 'pointer', background: 'none', border: 'none', padding: 0 },
    logo: { display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '24px' },
    logoBox: { width: '32px', height: '32px', backgroundColor: '#2c1a0e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5f0e8', fontWeight: 'bold', fontSize: '13px' },
    logoText: { fontFamily: 'Playfair Display, serif', fontWeight: '700', fontSize: '18px', color: '#2c1a0e' },
    title: { fontFamily: 'Playfair Display, serif', fontSize: '26px', fontWeight: '700', color: '#2c1a0e', textAlign: 'center', marginBottom: '6px' },
    sub: { color: '#9b7e6e', textAlign: 'center', fontSize: '14px', marginBottom: '28px' },
    error: { backgroundColor: '#fdf0f0', border: '1px solid #f0d0d0', color: '#8b2e2e', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '500', color: '#5c3d2e', marginBottom: '6px' },
    input: { width: '100%', backgroundColor: '#f9f5ef', border: '1.5px solid #ddd0bc', color: '#2c1a0e', borderRadius: '10px', padding: '11px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
    inputWrapper: { position: 'relative' },
    eyeBtn: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' },
    btn: { width: '100%', backgroundColor: '#2c1a0e', color: '#f5f0e8', padding: '13px', borderRadius: '10px', fontWeight: '600', fontSize: '15px', border: 'none', cursor: 'pointer', marginTop: '8px' },
    footer: { textAlign: 'center', fontSize: '13px', color: '#9b7e6e', marginTop: '20px' },
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <button style={S.back} onClick={() => navigate('/')}>← Back to home</button>
        <div style={S.logo}>
          <div style={S.logoBox}>AI</div>
          <span style={S.logoText}>InterviewTracker</span>
        </div>
        <h1 style={S.title}>Create your account</h1>
        <p style={S.sub}>Start tracking your interviews today</p>
        {error && <div style={S.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={S.label}>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={S.input} placeholder="Your name" required />
          </div>
          <div>
            <label style={S.label}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={S.input} placeholder="abc@example.com" required />
          </div>
          <div>
            <label style={S.label}>Password</label>
            <div style={S.inputWrapper}>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} style={{ ...S.input, paddingRight: '44px' }} placeholder="••••••••" required />
              <button type="button" style={S.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button type="submit" style={S.btn} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>
        <p style={S.footer}>Already have an account? <Link to="/login" style={{ color: '#8b5e3c', fontWeight: '600' }}>Login</Link></p>
      </div>
    </div>
  );
}