import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IoMailOutline, IoLockClosedOutline, IoAlertCircle,
  IoEyeOutline, IoEyeOffOutline, IoRocketOutline
} from 'react-icons/io5';
import { useAuth } from '../hooks/useAuth';
import styles from './Auth.module.css';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <IoRocketOutline className={styles.logoIcon} />
          <h1 className={styles.title}>
            Welcome <span className={styles.titleAccent}>Back</span>
          </h1>
          <p className={styles.subtitle}>Sign in to your TaskFlow workspace</p>
        </div>

        <div className={styles.card}>

          {error && (
            <div className={styles.error} id="login-error">
              <IoAlertCircle /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="login-email">Email</label>
              <div className={styles.inputWrapper}>
                <IoMailOutline className={styles.inputIcon} />
                <input
                  id="login-email"
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            {/* Password with show/hide toggle */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="login-password">Password</label>
              <div className={styles.inputWrapper}>
                <IoLockClosedOutline className={styles.inputIcon} />
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  className={`${styles.input} ${styles.inputWithEye}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
              className={styles.submitBtn}
              disabled={loading}
              id="login-submit"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.link}>Create one free</Link>
        </p>

        <p className={styles.footer} style={{ marginTop: '0.5rem' }}>
          <Link to="/landing" className={styles.link}>← Back to home</Link>
        </p>

      </div>
    </div>
  );
}
