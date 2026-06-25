import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: 'var(--space-4)', textAlign: 'center'
    }}>
      <div>
        <div style={{ fontSize: '5rem', marginBottom: 'var(--space-4)' }}>🏔️</div>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-4xl)',
          fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--text-primary)'
        }}>
          404
        </h1>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-xl)',
          fontWeight: 400, marginBottom: 'var(--space-4)', color: 'var(--text-secondary)'
        }}>
          This path leads nowhere
        </h2>
        <p style={{
          color: 'var(--text-muted)', fontSize: 'var(--font-size-base)',
          marginBottom: 'var(--space-8)', maxWidth: '400px', margin: '0 auto var(--space-8)'
        }}>
          Like a stone garden path that fades into mist, the page you seek does not exist.
        </p>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
          padding: 'var(--space-3) var(--space-8)', borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--sakura-deep), var(--indigo))',
          color: 'white', fontWeight: 600, fontSize: 'var(--font-size-md)',
          textDecoration: 'none', transition: 'all 200ms ease'
        }}>
          🌸 Return Home
        </Link>
      </div>
    </div>
  );
}
