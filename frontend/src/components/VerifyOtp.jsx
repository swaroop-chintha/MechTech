import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const VerifyOtp = ({ phone, onNavigate }) => {
  const { verifyOtp } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Timer for Resend OTP (60 seconds)
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await verifyOtp(phone, otp);
      setSuccess('OTP verified successfully! Redirecting to login page...');
      setTimeout(() => {
        onNavigate('login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    // In production, we'd trigger a resend endpoint
    setTimer(60);
    setSuccess('A new verification code has been printed to backend console.');
  };

  return (
    <div style={{ maxWidth: '420px', margin: '60px auto', padding: '0 20px' }} className="fade-in">
      <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius)', padding: '32px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>Verify Phone</h2>
        <p style={{ color: 'var(--text2)', fontSize: '0.85rem', marginBottom: '24px', textAlign: 'center' }}>
          Enter the 6-digit OTP code printed on your backend console for <strong style={{ color: 'var(--text)' }}>{phone}</strong>
        </p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid var(--danger)', padding: '12px', borderRadius: 'var(--radius-xs)', fontSize: '0.85rem', color: 'var(--danger)', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', borderLeft: '3px solid var(--success)', padding: '12px', borderRadius: 'var(--radius-xs)', fontSize: '0.85rem', color: 'var(--success)', marginBottom: '20px' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'center' }}>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 123456"
              maxLength={6}
              style={{ fontSize: '1.5rem', letterSpacing: '8px', textAlign: 'center', fontWeight: '700' }}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ marginTop: '16px' }}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify & Activate'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem' }}>
          {timer > 0 ? (
            <span style={{ color: 'var(--text3)' }}>Resend code in {timer}s</span>
          ) : (
            <button
              onClick={handleResend}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: '600', cursor: 'pointer' }}
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default VerifyOtp;
