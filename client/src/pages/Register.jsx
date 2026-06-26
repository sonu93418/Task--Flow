import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IoPersonOutline, IoMailOutline, IoLockClosedOutline,
  IoAlertCircle, IoEyeOutline, IoEyeOffOutline, IoRocketOutline
} from 'react-icons/io5';
import { useAuth } from '../hooks/useAuth';
import styles from './Auth.module.css';

export default function Register() {
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [showPwd, setShowPwd]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const { register }                  = useAuth();
  const navigate                      = useNavigate();

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
      <div className={styles.container}>

        <div className={styles.header}>
          <IoRocketOutline className={styles.logoIcon} />
          <h1 className={styles.title}>
            Create <span className={styles.titleAccent}>Account</span>
          </h1>
          <p className={styles.subtitle}>Start organizing your work today</p>
        </div>

        <div className={styles.card}>

          {error && (
            <div className={styles.error} id="register-error">
              <IoAlertCircle /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="register-name">Full Name</label>
              <div className={styles.inputWrapper}>
                <IoPersonOutline className={styles.inputIcon} />
                <input
                  id="register-name"
                  type="text"
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                  autoFocus
                />
              </div>
            </div>

            {/* Email */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="register-email">Email</label>
              <div className={styles.inputWrapper}>
                <IoMailOutline className={styles.inputIcon} />
                <input
                  id="register-email"
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password with show/hide */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="register-password">Password</label>
              <div className={styles.inputWrapper}>
                <IoLockClosedOutline className={styles.inputIcon} />
                <input
                  id="register-password"
                  type={showPwd ? 'text' : 'password'}
                  className={`${styles.input} ${styles.inputWithEye}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
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

            {/* Confirm Password with show/hide */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="register-confirm">Confirm Password</label>
              <div className={styles.inputWrapper}>
                <IoLockClosedOutline className={styles.inputIcon} />
                <input
                  id="register-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  className={`${styles.input} ${styles.inputWithEye}`}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
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
              className={styles.submitBtn}
              disabled={loading}
              id="register-submit"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

          </form>
        </div>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" className={styles.link}>Sign in</Link>
        </p>

        <p className={styles.footer} style={{ marginTop: '0.5rem' }}>
          <Link to="/landing" className={styles.link}>← Back to home</Link>
        </p>

      </div>
    </div>
  );
}
