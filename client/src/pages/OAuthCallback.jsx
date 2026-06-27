import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Auth.module.css';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Authentication failed. Please try again.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (!token) {
      setError('No authentication token received.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    // Use the token to log in
    loginWithToken(token)
      .then(() => {
        navigate('/dashboard', { replace: true });
      })
      .catch((err) => {
        setError(err.message || 'Login failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      });
  }, [searchParams, loginWithToken, navigate]);

  return (
    <div className={styles.page}>
      <div className={styles.authContainer}>
        <div className={styles.authCard} style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '3rem',
            textAlign: 'center'
          }}>
            {error ? (
              <>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', color: '#ef4444'
                }}>
                  ✕
                </div>
                <h2 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.25rem' }}>
                  Authentication Failed
                </h2>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{error}</p>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem' }}>
                  Redirecting to login...
                </p>
              </>
            ) : (
              <>
                <div className={styles.oauthSpinner} />
                <h2 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.25rem' }}>
                  Completing Sign In...
                </h2>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                  Please wait while we verify your identity.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
