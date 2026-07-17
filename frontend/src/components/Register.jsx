import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Register = ({ onNavigate, onVerifyPhone }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.phone,
        formData.password,
        formData.role
      );
      setSuccess('Registration successful! Redirecting to verify phone OTP...');
      setTimeout(() => {
        onVerifyPhone(formData.phone);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '40px auto', padding: '0 20px' }} className="fade-in">
      <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius)', padding: '32px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>Create Account</h2>
        <p style={{ color: 'var(--text2)', fontSize: '0.85rem', marginBottom: '24px', textAlign: 'center' }}>Join MechTech Home Services Marketplace</p>

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
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Rajesh Kumar"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">I want to register as a</label>
            <select
              name="role"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="customer">Customer (Looking for Services)</option>
              <option value="mechanic">Service Provider / Mechanic</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ marginTop: '12px' }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text2)' }}>
          Already have an account?{' '}
          <a href="#login" onClick={(e) => { e.preventDefault(); onNavigate('login'); }} style={{ color: 'var(--accent)', fontWeight: '600' }}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};
export default Register;
