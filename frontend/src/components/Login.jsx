import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Login = ({ onNavigate, onLoginSuccess }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(username, password);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Invalid email/phone or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '60px auto', padding: '0 20px' }} className="fade-in">
      <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius)', padding: '32px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text2)', fontSize: '0.85rem', marginBottom: '24px', textAlign: 'center' }}>Log in to access your dashboard</p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid var(--danger)', padding: '12px', borderRadius: 'var(--radius-xs)', fontSize: '0.85rem', color: 'var(--danger)', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email or Phone Number</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. name@example.com or 9876543210"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text2)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--accent)' }}
              />
              Remember me
            </label>
            <a href="#forgot" onClick={(e) => e.preventDefault()} style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '600' }}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text2)' }}>
          Don't have an account?{' '}
          <a href="#register" onClick={(e) => { e.preventDefault(); onNavigate('register'); }} style={{ color: 'var(--accent)', fontWeight: '600' }}>
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};
export default Login;
