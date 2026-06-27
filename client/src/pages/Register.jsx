import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  IoPersonOutline, IoMailOutline, IoLockClosedOutline,
  IoAlertCircle, IoEyeOutline, IoEyeOffOutline, IoLogoGoogle, IoLogoGithub
} from 'react-icons/io5';
import { useAuth } from '../hooks/useAuth';
import styles from './Auth.module.css';

import logoSvg from '../assets/logo.svg';

export default function Register() {
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [showPwd, setShowPwd]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [searchParams]                = useSearchParams();
  const [error, setError]             = useState(searchParams.get('error') || '');
  const { register }                  = useAuth();
  const navigate                      = useNavigate();

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

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
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
              <Link to="/landing" className={styles.logoLink}>
                <img src={logoSvg} className={styles.logoImg} alt="TaskFlow" />
                <span className={styles.logoText}>TaskFlow</span>
              </Link>
            </div>

            <div className={styles.authTitleRow}>
              <h1 className={styles.authTitle}>Get Started</h1>
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
            <p className={styles.authSubtitle}>Create your account to organize your tasks.</p>

            {error && (
              <div className={styles.error} id="register-error">
                <IoAlertCircle /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.authForm}>
              {/* Name */}
              <div className={styles.field}>
                <div className={styles.inputWrapper}>
                  <IoPersonOutline className={styles.inputIcon} />
                  <input
                    id="register-name"
                    type="text"
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    required
                    autoComplete="name"
                    autoFocus
                  />
                </div>
              </div>

              {/* Email */}
              <div className={styles.field}>
                <div className={styles.inputWrapper}>
                  <IoMailOutline className={styles.inputIcon} />
                  <input
                    id="register-email"
                    type="email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className={styles.field}>
                <div className={styles.inputWrapper}>
                  <IoLockClosedOutline className={styles.inputIcon} />
                  <input
                    id="register-password"
                    type={showPwd ? 'text' : 'password'}
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (min. 6 characters)"
                    required
                    autoComplete="new-password"
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

              {/* Confirm Password */}
              <div className={styles.field}>
                <div className={styles.inputWrapper}>
                  <IoLockClosedOutline className={styles.inputIcon} />
                  <input
                    id="register-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    className={styles.input}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Confirm Password"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowConfirm(v => !v)}
                    tabIndex={-1}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <IoEyeOffOutline /> : <IoEyeOutline />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={styles.primaryButton}
                disabled={loading}
                id="register-submit"
              >
                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </button>
            </form>

            <div className={styles.socialDivider}>
              <span>Register with Others</span>
            </div>

            <div className={styles.socialButtons}>
              <button
                type="button"
                className={styles.socialButton}
                onClick={() => { window.location.href = `${API_BASE}/auth/google?action=register`; }}
              >
                <IoLogoGoogle className={styles.googleIcon} />
                <span>Sign up with Google</span>
              </button>
              <button
                type="button"
                className={styles.socialButton}
                onClick={() => { window.location.href = `${API_BASE}/auth/github?action=register`; }}
              >
                <IoLogoGithub className={styles.githubIcon} />
                <span>Sign up with GitHub</span>
              </button>
            </div>

            <p className={styles.authFooter}>
              Already have an account?{' '}
              <Link to="/login" className={styles.authLink}>Sign in</Link>
            </p>

            <p className={styles.authFooter} style={{ marginTop: '0.5rem' }}>
              <Link to="/landing" className={styles.authLink}>← Back to home</Link>
            </p>
          </div>

          {/* Right Column: Framed Vector Developer Illustration */}
          <div className={styles.illustrationSection} style={{ background: 'var(--indigo-deep)' }}>
            <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', padding: '1rem' }}>
              {/* Code Background Elements (White & Sakura) */}
              <circle cx="35" cy="40" r="1.5" fill="#ffffff" />
              <circle cx="165" cy="35" r="2" fill="var(--sakura)" />
              <circle cx="150" cy="160" r="1" fill="#ffffff" />

              {/* Code syntax lines in background */}
              <rect x="25" y="60" width="30" height="4" rx="2" fill="var(--sakura)" opacity="0.4" />
              <rect x="25" y="70" width="45" height="4" rx="2" fill="var(--matcha)" opacity="0.4" />
              <rect x="35" y="80" width="20" height="4" rx="2" fill="var(--kitsune)" opacity="0.4" />

              {/* Laptop (Matcha & White) */}
              <rect x="60" y="125" width="80" height="48" rx="6" fill="var(--indigo-deep)" stroke="#ffffff" strokeWidth="2" />
              {/* Laptop screen content (solid code lines) */}
              <rect x="68" y="132" width="25" height="4" rx="2" fill="var(--sakura)" />
              <rect x="96" y="132" width="35" height="4" rx="2" fill="var(--matcha)" />
              <rect x="68" y="140" width="48" height="4" rx="2" fill="var(--kitsune)" />
              <rect x="68" y="148" width="30" height="4" rx="2" fill="#ffffff" />
              
              {/* Laptop Base (White keyboard panel) */}
              <path d="M50 173 L150 173 L142 182 L58 182 Z" fill="#ffffff" />
              <line x1="85" y1="177" x2="115" y2="177" stroke="var(--indigo-deep)" strokeWidth="2.5" strokeLinecap="round" />

              {/* Coffee Mug (Sakura) */}
              <rect x="156" y="145" width="16" height="20" rx="3" fill="var(--sakura)" />
              <path d="M172 150 C176 150 176 160 172 160" stroke="var(--sakura)" strokeWidth="3" fill="none" />
              {/* Hot steam lines */}
              <path d="M160 135 Q162 138 160 141" stroke="#ffffff" stroke-width="1.5" fill="none" />
              <path d="M165 135 Q167 138 165 141" stroke="#ffffff" stroke-width="1.5" fill="none" />

              {/* Character (Developer Coding) */}
              {/* Suit/Shirt (Matcha) */}
              <path d="M80 115 C80 95 120 95 120 115 L125 126 L75 126 Z" fill="var(--matcha)" />
              
              {/* Head (Kitsune / Face tone) */}
              <circle cx="100" cy="85" r="18" fill="var(--washi)" />
              {/* Hair (Indigo Deep) */}
              <path d="M82 85 C82 72 118 72 118 85 C118 78 112 73 100 73 C88 73 82 78 82 85 Z" fill="var(--indigo-deep)" />
              {/* Glasses (Indigo Deep) */}
              <rect x="88" y="80" width="10" height="8" rx="2" fill="none" stroke="var(--indigo-deep)" strokeWidth="2" />
              <rect x="102" y="80" width="10" height="8" rx="2" fill="none" stroke="var(--indigo-deep)" strokeWidth="2" />
              <line x1="98" y1="84" x2="102" y2="84" stroke="var(--indigo-deep)" stroke-width="2" />

              {/* Waving developer hands */}
              <circle cx="70" cy="130" r="5" fill="var(--washi)" />
              <circle cx="130" cy="130" r="5" fill="var(--washi)" />
            </svg>
          </div>

        </div>
      </div>
    </div>
  );
}
