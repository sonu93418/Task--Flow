import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
  IoMailOutline, IoLockClosedOutline, IoAlertCircle,
  IoEyeOutline, IoEyeOffOutline, IoLogoGoogle, IoLogoGithub
} from 'react-icons/io5';
import { useAuth } from '../hooks/useAuth';
import styles from './Auth.module.css';

import logoSvg from '../assets/logo.svg';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [searchParams]          = useSearchParams();
  const [error, setError]       = useState(searchParams.get('error') || '');
  const { login }               = useAuth();
  const navigate                = useNavigate();

  useEffect(() => {
    const errParam = searchParams.get('error');
    if (errParam) {
      setError(errParam);
    }
  }, [searchParams]);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.message === 'Account not found. Please register first.') {
        navigate(`/register?error=${encodeURIComponent(err.message)}`);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          {/* Decorative background elements matching the reference template */}
          <div className={styles.decorOrbTopLeft} />
          <div className={styles.decorOrbBottomRight} />
          <div className={styles.decorSunburstBottomLeft}>
            <svg viewBox="0 0 100 100" className={styles.sunburstSvg}>
              <circle cx="50" cy="50" r="14" fill="var(--kitsune)" />
              <rect x="46" y="10" width="8" height="24" rx="4" fill="var(--kitsune)" />
              <rect x="46" y="66" width="8" height="24" rx="4" fill="var(--kitsune)" />
              <rect x="10" y="46" width="24" height="8" rx="4" fill="var(--kitsune)" />
              <rect x="66" y="46" width="24" height="8" rx="4" fill="var(--kitsune)" />
              <g transform="rotate(45 50 50)">
                <rect x="46" y="10" width="8" height="24" rx="4" fill="var(--kitsune)" />
                <rect x="46" y="66" width="8" height="24" rx="4" fill="var(--kitsune)" />
                <rect x="10" y="46" width="24" height="8" rx="4" fill="var(--kitsune)" />
                <rect x="66" y="46" width="24" height="8" rx="4" fill="var(--kitsune)" />
              </g>
              <g transform="rotate(22.5 50 50)">
                <rect x="47" y="15" width="6" height="18" rx="3" fill="var(--kitsune)" />
                <rect x="47" y="67" width="6" height="18" rx="3" fill="var(--kitsune)" />
                <rect x="15" y="47" width="18" height="6" rx="3" fill="var(--kitsune)" />
                <rect x="67" y="47" width="18" height="6" rx="3" fill="var(--kitsune)" />
              </g>
              <g transform="rotate(67.5 50 50)">
                <rect x="47" y="15" width="6" height="18" rx="3" fill="var(--kitsune)" />
                <rect x="47" y="67" width="6" height="18" rx="3" fill="var(--kitsune)" />
                <rect x="15" y="47" width="18" height="6" rx="3" fill="var(--kitsune)" />
                <rect x="67" y="47" width="18" height="6" rx="3" fill="var(--kitsune)" />
              </g>
            </svg>
          </div>

          {/* Left Column: Form */}
          <div className={styles.formSection}>
            <div className={styles.logoRow}>
              <RouterLink to="/landing" className={styles.logoLink}>
                <img src={logoSvg} className={styles.logoImg} alt="TaskFlow" />
                <span className={styles.logoText}>TaskFlow</span>
              </RouterLink>
            </div>

            <div className={styles.authTitleRow}>
              <h1 className={styles.authTitle}>Welcome</h1>
              <div className={styles.pointingHand}>
                <svg viewBox="0 0 100 100" className={styles.pointingHandSvg}>
                  {/* Wrist cuff */}
                  <rect x="5" y="32" width="10" height="36" rx="4" fill="var(--sakura)" />
                  {/* Hand back / palm */}
                  <path d="M15 30 h35 a12 12 0 0 1 12 12 v16 a12 12 0 0 1 -12 12 h-35 z" fill="var(--indigo)" />
                  {/* Index finger pointing right */}
                  <path d="M60 36 h30 a6 6 0 0 1 6 6 v2 a6 6 0 0 1 -6 6 h-30" fill="var(--matcha)" />
                  {/* Middle finger folded */}
                  <path d="M58 48 h16 a5 5 0 0 1 5 5 v0 a5 5 0 0 1 -5 5 h-16" fill="var(--indigo-light)" />
                  {/* Ring finger folded */}
                  <path d="M56 58 h12 a5 5 0 0 1 5 5 v0 a5 5 0 0 1 -5 5 h-12" fill="var(--indigo-light)" />
                  {/* Little finger folded */}
                  <path d="M52 68 h8 a4 4 0 0 1 4 4 v0 a4 4 0 0 1 -4 4 h-8" fill="var(--indigo-light)" />
                  {/* Thumb */}
                  <path d="M30 30 c2 -8 8 -8 12 -4 c4 4 0 10 -4 12" fill="var(--kitsune)" />
                </svg>
              </div>
            </div>
            <p className={styles.authSubtitle}>We are glad to see you back with us.</p>

            {error && (
              <div className={styles.error} id="login-error">
                <IoAlertCircle /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.authForm}>
              {/* Email */}
              <div className={styles.field}>
                <div className={styles.inputWrapper}>
                  <IoMailOutline className={styles.inputIcon} />
                  <input
                    id="login-email"
                    type="email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Username or Email"
                    required
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div className={styles.field}>
                <div className={styles.inputWrapper}>
                  <IoLockClosedOutline className={styles.inputIcon} />
                  <input
                    id="login-password"
                    type={showPwd ? 'text' : 'password'}
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPwd(v => !v)}
                    tabIndex={-1}
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                  >
                    {showPwd ? <IoEyeOffOutline /> : <IoEyeOutline />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={styles.primaryButton}
                disabled={loading}
                id="login-submit"
              >
                {loading ? 'SIGNING IN...' : 'NEXT'}
              </button>
            </form>

            <div className={styles.socialDivider}>
              <span>Login with Others</span>
            </div>

            <div className={styles.socialButtons}>
              <button
                type="button"
                className={styles.socialButton}
                onClick={() => { window.location.href = `${API_BASE}/auth/google?action=login`; }}
              >
                <IoLogoGoogle className={styles.googleIcon} />
                <span>Login with Google</span>
              </button>
              <button
                type="button"
                className={styles.socialButton}
                onClick={() => { window.location.href = `${API_BASE}/auth/github?action=login`; }}
              >
                <IoLogoGithub className={styles.githubIcon} />
                <span>Login with GitHub</span>
              </button>
            </div>

            <p className={styles.authFooter}>
              Don't have an account?{' '}
              <RouterLink to="/register" className={styles.authLink}>Create one free</RouterLink>
            </p>

            <p className={styles.authFooter} style={{ marginTop: '0.5rem' }}>
              <RouterLink to="/landing" className={styles.authLink}>← Back to home</RouterLink>
            </p>
          </div>

          {/* Right Column: Framed Vector Space Illustration */}
          <div className={styles.illustrationSection} style={{ background: 'var(--kitsune)' }}>
            <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', padding: '1rem' }}>
              {/* Space Elements (White & Indigo) */}
              <circle cx="35" cy="40" r="2" fill="#ffffff" />
              <circle cx="165" cy="55" r="3" fill="var(--indigo-deep)" opacity="0.3" />
              <circle cx="50" cy="140" r="1.5" fill="#ffffff" />
              <circle cx="150" cy="160" r="2" fill="#ffffff" />
              
              {/* Big Stylized Moon (Indigo) */}
              <circle cx="155" cy="50" r="22" fill="var(--indigo)" />
              <circle cx="145" cy="42" r="4" fill="var(--indigo-deep)" opacity="0.4" />
              <circle cx="162" cy="58" r="3" fill="var(--indigo-deep)" opacity="0.4" />

              {/* Orbit line (Indigo) */}
              <path d="M40 120 C80 90 140 120 180 150" stroke="var(--indigo)" strokeWidth="2.5" strokeDasharray="4 4" fill="none" />

              {/* Floating Star / Sparkle (White) */}
              <path d="M35 110 L38 115 L43 118 L38 121 L35 126 L32 121 L27 118 L32 115 Z" fill="#ffffff" />

              {/* Astronaut Character (Solid Shapes) */}
              {/* Suit Body */}
              <rect x="80" y="110" width="40" height="50" rx="15" fill="#ffffff" />
              
              {/* Suit Chest Panel */}
              <rect x="88" y="120" width="24" height="18" rx="4" fill="var(--indigo-deep)" />
              <circle cx="94" cy="129" r="2.5" fill="var(--sakura)" />
              <circle cx="102" cy="129" r="2.5" fill="var(--matcha)" />
              <rect x="94" y="134" width="12" height="2" rx="1" fill="#ffffff" />

              {/* Arms / Gloves (Waving) */}
              <path d="M78 115 C65 110 58 95 62 90 C66 85 75 98 80 110" fill="#ffffff" />
              <circle cx="60" cy="88" r="6" fill="var(--sakura)" /> {/* Left Glove */}

              <path d="M122 115 C135 120 142 135 138 140 C134 145 125 132 120 110" fill="#ffffff" />
              <circle cx="140" cy="142" r="6" fill="var(--sakura)" /> {/* Right Glove */}

              {/* Legs / Boots */}
              <rect x="85" y="155" width="12" height="20" rx="4" fill="#ffffff" />
              <rect x="103" y="155" width="12" height="20" rx="4" fill="#ffffff" />
              <rect x="82" y="172" width="16" height="6" rx="3" fill="var(--indigo-deep)" />
              <rect x="102" y="172" width="16" height="6" rx="3" fill="var(--indigo-deep)" />

              {/* Helmet */}
              <circle cx="100" cy="82" r="26" fill="#ffffff" />
              {/* Visor */}
              <rect x="82" y="68" width="36" height="22" rx="9" fill="var(--indigo-deep)" />
              <path d="M86 72 C92 70 102 72 106 76" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" fill="none" />
              {/* Antenna */}
              <line x1="100" y1="56" x2="100" y2="44" stroke="#ffffff" stroke-width="2.5" />
              <circle cx="100" cy="42" r="4" fill="var(--sakura)" />
            </svg>
          </div>

        </div>
      </div>
    </div>
  );
}
