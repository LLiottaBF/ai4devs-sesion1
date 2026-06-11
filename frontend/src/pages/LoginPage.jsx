import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WebGLBackground from '../components/WebGLBackground';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const body = new URLSearchParams({ username, password });
      const res = await fetch(`${API_BASE}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || 'Invalid username or password.');
        return;
      }

      const { access_token } = await res.json();
      login(access_token, username);
      navigate('/welcome', { replace: true });
    } catch {
      setError('Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <WebGLBackground />

      <div style={styles.centered}>
        {/* Gradient border shell */}
        <div style={styles.cardShell}>
          <div style={styles.card}>
            <header style={styles.header}>
              <div style={styles.logoMark} aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect width="28" height="28" rx="8" fill="#0F172A" />
                  <path d="M7 14h14M14 7v14" stroke="#E0E7FF" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h1 style={styles.title}>Compliance Platform</h1>
              <p style={styles.subtitle}>Sign in to your account</p>
            </header>

            <form onSubmit={handleSubmit} style={styles.form} noValidate>
              <div style={styles.fieldGroup}>
                <label htmlFor="username" style={styles.label}>Username</label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={styles.input}
                  placeholder="Enter your username"
                />
              </div>

              <div style={styles.fieldGroup}>
                <label htmlFor="password" style={styles.label}>Password</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div role="alert" style={styles.errorBox}>
                  <span style={styles.errorIcon} aria-hidden="true">⚠</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '64px 16px',
  },
  centered: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '420px',
  },
  cardShell: {
    padding: '1px',
    borderRadius: '17px',
    background: 'linear-gradient(to right bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.5), rgba(203,213,225,0.3))',
    boxShadow: 'rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0.04) 0px 0px 0px 1px inset, rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.06) 0px 1px 1px -0.5px, rgba(0,0,0,0.06) 0px 3px 3px -1.5px, rgba(0,0,0,0.06) 0px 6px 6px -3px, rgba(0,0,0,0.06) 0px 12px 12px -6px, rgba(0,0,0,0.06) 0px 24px 24px -12px',
  },
  card: {
    backgroundColor: 'rgba(248,249,250,0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: '40px 36px 36px',
    border: '0.8px solid #F1F5F9',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  logoMark: {
    display: 'inline-flex',
    marginBottom: '16px',
  },
  title: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: '32px',
    letterSpacing: '-0.025em',
    color: '#0F172A',
    marginBottom: '6px',
  },
  subtitle: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    color: '#64748B',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    color: '#0F172A',
  },
  input: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#0F172A',
    backgroundColor: 'rgba(255,255,255,0.8)',
    border: '0.8px solid #E2E8F0',
    borderRadius: '8px',
    padding: '10px 12px',
    outline: 'none',
    width: '100%',
    transition: 'border-color 160ms ease, box-shadow 160ms ease',
  },
  button: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    color: '#FAFAFA',
    backgroundColor: '#0F172A',
    border: 'none',
    borderRadius: '8px',
    padding: '11px 20px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '4px',
    transition: 'background-color 160ms ease, opacity 160ms ease',
    letterSpacing: '0.01em',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(254,226,226,0.7)',
    border: '0.8px solid rgba(252,165,165,0.6)',
    borderRadius: '8px',
    padding: '10px 12px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#7F1D1D',
  },
  errorIcon: {
    flexShrink: 0,
    fontSize: '14px',
  },
};
