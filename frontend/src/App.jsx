import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Login from './components/Login';
import Register from './components/Register';
import VerifyOtp from './components/VerifyOtp';
import Home from './pages/Home';
import Providers from './pages/Providers';
import ProviderDetail from './pages/ProviderDetail';
import BookingWizard from './pages/BookingWizard';
import BookingConfirmation from './pages/BookingConfirmation';
import { ShieldCheck, UserCheck, Key, Power, LogOut, CheckCircle, Smartphone } from 'lucide-react';

const DashboardView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: 'var(--danger)' }}>Session expired. Please log in again.</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ marginTop: '16px' }}>Login</button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius)', padding: '32px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Active User Session</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Authenticated via Spring Boot JWT Secure API</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Name</span>
            <p style={{ fontWeight: '600' }}>{user.name}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Email Address</span>
            <p style={{ fontWeight: '600' }}>{user.email}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Phone Number</span>
            <p style={{ fontWeight: '600' }}>{user.phone}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Platform Role</span>
            <p style={{ fontWeight: '600', textTransform: 'capitalize' }}>{user.role}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Verification Status</span>
            <p style={{ fontWeight: '600', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={16} /> Verified & Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

const VerifyOtpWrapper = ({ onNavigate }) => {
  const location = useLocation();
  const phone = location.state?.phone || '';
  return <VerifyOtp phone={phone} onNavigate={onNavigate} />;
};

const AppContent = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (page) => {
    if (page === 'register') navigate('/register');
    else if (page === 'login') navigate('/login');
    else if (page === 'verify-otp') navigate('/verify');
    else navigate('/');
  };

  const handleVerifyPhone = (phone) => {
    navigate('/verify', { state: { phone } });
  };

  const handleLoginSuccess = (userProfile) => {
    navigate('/dashboard');
  };

  return (
    <div>
      {/* Premium Glassmorphism Navbar */}
      <header className="navbar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
          <div className="nav-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MechTech</span>
            <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: 'rgba(255, 107, 0, 0.1)', color: 'var(--accent)', borderRadius: '4px', fontWeight: '600' }}>BETA</span>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} style={{ fontSize: '0.9rem', color: location.pathname === '/' ? 'var(--accent)' : 'var(--text2)' }}>Home</Link>
            <Link to="/providers" className={`nav-link ${location.pathname.startsWith('/providers') ? 'active' : ''}`} style={{ fontSize: '0.9rem', color: location.pathname.startsWith('/providers') ? 'var(--accent)' : 'var(--text2)' }}>Find Providers</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} style={{ fontSize: '0.9rem', color: location.pathname === '/dashboard' ? 'var(--accent)' : 'var(--text2)' }}>
                  Hello, <strong style={{ color: 'var(--text)' }}>{user.name}</strong> ({user.role})
                </Link>
                <button onClick={() => { logout(); navigate('/'); }} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', fontSize: '0.85rem' }}>
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Login</button>
                <button onClick={() => navigate('/register')} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Register</button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content mount */}
      <main className="container" style={{ minHeight: 'calc(100vh - 160px)', paddingTop: '90px', paddingBottom: '40px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/providers/:id" element={<ProviderDetail />} />
          <Route path="/book" element={<BookingWizard />} />
          <Route path="/booking/:id" element={<BookingConfirmation />} />
          
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" replace /> : <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
          } />
          <Route path="/register" element={
            user ? <Navigate to="/dashboard" replace /> : <Register onNavigate={handleNavigate} onVerifyPhone={handleVerifyPhone} />
          } />
          <Route path="/verify" element={<VerifyOtpWrapper onNavigate={handleNavigate} />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardView />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer style={{ borderTop: '1px solid var(--glass-border)', padding: '24px 0', textAlign: 'center', background: 'rgba(10, 10, 12, 0.5)' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>© 2026 MechTech Marketplace Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <AppContent />
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
