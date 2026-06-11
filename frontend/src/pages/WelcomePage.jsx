import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WebGLBackground from '../components/WebGLBackground';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CERTIFICATIONS = [
  {
    code: 'AI-900',
    name: 'Microsoft Azure AI Fundamentals',
    level: 'Beginner',
    role: 'AI Engineer · Data Scientist',
    description: 'Demonstrate foundational knowledge of machine learning and AI concepts and related Microsoft Azure services.',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/',
  },
  {
    code: 'AI-901',
    name: 'Azure AI Fundamentals (2026 Edition)',
    level: 'Beginner',
    role: 'AI Engineer · Developer',
    description: 'Updated April 2026 — covers Azure AI Foundry, Content Understanding, and next-generation AI solution development.',
    gradient: 'linear-gradient(135deg, #312e81 0%, #4f46e5 60%, #6366f1 100%)',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-901/',
  },
  {
    code: 'AI-102',
    name: 'Azure AI Engineer Associate',
    level: 'Intermediate',
    role: 'AI Engineer',
    description: 'Design and implement Azure AI solutions using Azure AI services, Azure AI Search, and Azure OpenAI.',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 60%, #60a5fa 100%)',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/',
  },
  {
    code: 'AZ-104',
    name: 'Microsoft Azure Administrator',
    level: 'Intermediate',
    role: 'Administrator',
    description: 'Implement, manage, and monitor an organization\'s Microsoft Azure environment including virtual networks, storage, compute, and identity.',
    gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 60%, #8b5cf6 100%)',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/',
  },
  {
    code: 'AZ-204',
    name: 'Azure Developer Associate',
    level: 'Intermediate',
    role: 'Developer',
    description: 'Design, build, test, and maintain cloud applications and services on Microsoft Azure using a variety of Azure services.',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #7c3aed 100%)',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/',
  },
  {
    code: 'AZ-500',
    name: 'Azure Security Engineer Associate',
    level: 'Intermediate',
    role: 'Security Engineer',
    description: 'Implement security controls, maintain security posture, and identify and remediate vulnerabilities in Azure environments.',
    gradient: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #a78bfa 100%)',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-security-engineer/',
  },
];

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

          {/* Microsoft Certifications 2026 */}
          <section aria-labelledby="certs-heading">
            <h2 id="certs-heading" style={styles.certsHeading}>Microsoft Certifications 2026</h2>
            <p style={styles.certsSub}>Highlighted credentials from Microsoft Learn — validate your cloud &amp; AI skills.</p>
            <div style={styles.certsGrid}>
              {CERTIFICATIONS.map((cert) => (
                <a
                  key={cert.code}
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...styles.certCard, background: cert.gradient }}
                  aria-label={`${cert.code}: ${cert.name}`}
                >
                  <div style={styles.certHeader}>
                    <span style={styles.certCode}>{cert.code}</span>
                    <span style={styles.certBadge}>{cert.level}</span>
                  </div>
                  <p style={styles.certName}>{cert.name}</p>
                  <p style={styles.certDesc}>{cert.description}</p>
                  <span style={styles.certRole}>{cert.role}</span>
                </a>
              ))}
            </div>
          </section>
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
  certsHeading: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '20px',
    fontWeight: 600,
    color: '#0F172A',
    marginBottom: '6px',
    letterSpacing: '-0.015em',
  },
  certsSub: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    color: '#64748B',
    marginBottom: '20px',
  },
  certsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  certCard: {
    display: 'block',
    borderRadius: '16px',
    padding: '24px',
    textDecoration: 'none',
    color: '#fff',
    transition: 'transform 160ms ease, box-shadow 160ms ease',
    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
  },
  certHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  certCode: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    opacity: 0.9,
  },
  certBadge: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '11px',
    fontWeight: 500,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '999px',
    padding: '2px 10px',
    letterSpacing: '0.04em',
  },
  certName: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '22px',
    marginBottom: '8px',
    color: '#fff',
  },
  certDesc: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    lineHeight: '19px',
    color: 'rgba(255,255,255,0.82)',
    marginBottom: '14px',
  },
  certRole: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '11px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.65)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
};
