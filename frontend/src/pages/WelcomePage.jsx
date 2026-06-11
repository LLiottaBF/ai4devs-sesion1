import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WebGLBackground from '../components/WebGLBackground';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function WelcomePage() {
  const { token, username, expiresIn, logout } = useAuth();
  const navigate = useNavigate();

  const [userInfo, setUserInfo]   = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      try {
        const res = await fetch(`${API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 401) {
            logout();
            navigate('/login', { replace: true });
            return;
          }
          throw new Error('Failed to fetch user info');
        }
        const data = await res.json();
        if (!cancelled) setUserInfo(data);
      } catch (err) {
        if (!cancelled) setUserError(err.message);
      } finally {
        if (!cancelled) setLoadingUser(false);
      }
    }

    fetchUser();
    return () => { cancelled = true; };
  }, [token, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const displayName = userInfo?.username || username || 'User';

  return (
    <div style={styles.page}>
      <WebGLBackground />

      <div style={styles.layout}>
        {/* Top navbar */}
        <nav style={styles.nav}>
          <div style={styles.navInner}>
            <div style={styles.navBrand}>
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <rect width="28" height="28" rx="8" fill="#0F172A" />
                <path d="M7 14h14M14 7v14" stroke="#E0E7FF" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span style={styles.navBrandName}>Compliance Platform</span>
            </div>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10.5 11l3-3-3-3M13.5 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sign out
            </button>
          </div>
        </nav>

        {/* Main content */}
        <main style={styles.main}>
          {/* Welcome hero */}
          <div style={styles.heroShell}>
            <div style={styles.heroCard}>
              {loadingUser ? (
                <p style={styles.loadingText}>Loading…</p>
              ) : userError ? (
                <div role="alert" style={styles.errorBox}>
                  <span aria-hidden="true">⚠</span> {userError}
                </div>
              ) : (
                <>
                  <div style={styles.greetingRow}>
                    <div style={styles.avatar} aria-hidden="true">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h1 style={styles.welcomeHeading}>
                        Welcome back, <span style={styles.namePill}>{displayName}</span>
                      </h1>
                      <p style={styles.welcomeSub}>You are successfully authenticated.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stats grid */}
          <div style={styles.statsGrid}>
            {[
              { label: 'Session Status', value: 'Active', icon: '●', color: '#059669' },
              { label: 'Auth Method',    value: 'JWT Bearer', icon: '🔑', color: '#0F172A' },
              { label: 'Token Expiry',   value: expiresIn != null ? `${expiresIn}s` : '—', icon: '⏱', color: '#64748B' },
            ].map(({ label, value, icon, color }) => (
              <div key={label} style={styles.statShell}>
                <div style={styles.statCard}>
                  <span style={{ ...styles.statIcon, color }}>{icon}</span>
                  <div>
                    <p style={styles.statLabel}>{label}</p>
                    <p style={{ ...styles.statValue, color }}>{value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  page: {
    position: 'relative',
    minHeight: '100vh',
  },
  layout: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  nav: {
    borderBottom: '0.8px solid #F1F5F9',
    backgroundColor: 'rgba(250,250,250,0.8)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  navInner: {
    maxWidth: '1120px',
    margin: '0 auto',
    padding: '0 24px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  navBrandName: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '15px',
    fontWeight: 600,
    color: '#0F172A',
    letterSpacing: '-0.01em',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    color: '#64748B',
    background: 'none',
    border: 'none',
    padding: '6px 0',
    cursor: 'pointer',
    transition: 'color 160ms ease',
  },
  main: {
    flex: 1,
    maxWidth: '1120px',
    width: '100%',
    margin: '0 auto',
    padding: '64px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  heroShell: {
    padding: '1px',
    borderRadius: '17px',
    background: 'linear-gradient(to right bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.5), rgba(203,213,225,0.3))',
    boxShadow: 'rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0.04) 0px 0px 0px 1px inset, rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.06) 0px 1px 1px -0.5px, rgba(0,0,0,0.06) 0px 3px 3px -1.5px, rgba(0,0,0,0.06) 0px 6px 6px -3px, rgba(0,0,0,0.06) 0px 12px 12px -6px, rgba(0,0,0,0.06) 0px 24px 24px -12px',
  },
  heroCard: {
    backgroundColor: 'rgba(248,249,250,0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: '40px 36px',
    border: '0.8px solid #F1F5F9',
  },
  greetingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    backgroundColor: '#E0E7FF',
    color: '#0F172A',
    fontFamily: 'Inter, sans-serif',
    fontSize: '22px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  welcomeHeading: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '28px',
    fontWeight: 600,
    lineHeight: '36px',
    letterSpacing: '-0.025em',
    color: '#0F172A',
    marginBottom: '6px',
  },
  namePill: {
    color: '#0F172A',
  },
  welcomeSub: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    color: '#64748B',
  },
  loadingText: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    color: '#64748B',
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
    color: '#7F1D1D',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
  },
  statShell: {
    padding: '1px',
    borderRadius: '17px',
    background: 'linear-gradient(to right bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.5), rgba(203,213,225,0.3))',
    boxShadow: 'rgba(0,0,0,0.04) 0px 0px 0px 1px inset, rgba(0,0,0,0.06) 0px 1px 1px -0.5px',
  },
  statCard: {
    backgroundColor: 'rgba(248,249,250,0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: '18px',
    border: '0.8px solid #F1F5F9',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  statIcon: {
    fontSize: '20px',
    flexShrink: 0,
  },
  statLabel: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '16px',
    color: '#64748B',
    marginBottom: '2px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statValue: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '15px',
    fontWeight: 500,
    lineHeight: '20px',
  },
};
