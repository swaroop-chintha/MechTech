import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import VerifyOtp from './components/VerifyOtp';
import { ShieldCheck, UserCheck, Key, Power, LogOut, CheckCircle, Smartphone } from 'lucide-react';

const AppContent = () => {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [otpPhone, setOtpPhone] = useState('');

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const handleVerifyPhone = (phone) => {
    setOtpPhone(phone);
    setCurrentPage('verify-otp');
  };

  const handleLoginSuccess = (userProfile) => {
    setCurrentPage('dashboard');
  };

  return (
    <div>
      {/* Premium Glassmorphism Navbar */}
      <header className="navbar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
          <div className="nav-brand" onClick={() => navigateTo('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MechTech</span>
            <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: 'rgba(255, 107, 0, 0.1)', color: 'var(--accent)', borderRadius: '4px', fontWeight: '600' }}>BETA</span>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} style={{ fontSize: '0.9rem', color: currentPage === 'home' ? 'var(--accent)' : 'var(--text2)' }}>Home</a>
            
            {user ? (
              <>
                <span className="nav-link" style={{ fontSize: '0.9rem', color: 'var(--text2)' }}>
                  Hello, <strong style={{ color: 'var(--text)' }}>{user.name}</strong> ({user.role})
                </span>
                <button onClick={logout} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', fontSize: '0.85rem' }}>
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigateTo('login')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Login</button>
                <button onClick={() => navigateTo('register')} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Register</button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content mount */}
      <main className="container" style={{ minHeight: 'calc(100vh - 160px)', paddingTop: '90px', paddingBottom: '40px' }}>
        
        {currentPage === 'home' && (
          <div className="fade-in" style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 107, 0, 0.08)', border: '1px solid rgba(255, 107, 0, 0.15)', padding: '6px 16px', borderRadius: '100px', marginBottom: '24px' }}>
                <ShieldCheck size={16} color="var(--accent)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '600' }}>Level 1 Authentication Completed</span>
              </div>
              <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '16px' }}>
                On-Demand Home Services, <br />
                <span style={{ background: 'linear-gradient(135deg, #FF8F00, #FF5722)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Powered by Verified Experts.</span>
              </h1>
              <p style={{ color: 'var(--text2)', fontSize: '1.1rem', marginBottom: '32px', lineHeight: '1.6' }}>
                MechTech connects you with professional, local providers for automobiles, appliances, electronic gadgets, plumbing, and general home maintenance. Fully secured endpoint architecture.
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                {user ? (
                  <button onClick={() => navigateTo('dashboard')} className="btn btn-primary" style={{ padding: '12px 24px' }}>Go to Dashboard</button>
                ) : (
                  <>
                    <button onClick={() => navigateTo('register')} className="btn btn-primary" style={{ padding: '12px 24px' }}>Get Started</button>
                    <button onClick={() => navigateTo('login')} className="btn btn-secondary" style={{ padding: '12px 24px' }}>Access Account</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'login' && (
          <Login onNavigate={navigateTo} onLoginSuccess={handleLoginSuccess} />
        )}

        {currentPage === 'register' && (
          <Register onNavigate={navigateTo} onVerifyPhone={handleVerifyPhone} />
        )}

        {currentPage === 'verify-otp' && (
          <VerifyOtp phone={otpPhone} onNavigate={navigateTo} />
        )}

        {currentPage === 'dashboard' && (
          <div className="fade-in">
            {user ? (
              <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius)', padding: '32px', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContext: 'center', justifyContent: 'center' }}>
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
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: 'var(--danger)' }}>Session expired. Please log in again.</p>
                <button onClick={() => navigateTo('login')} className="btn btn-primary" style={{ marginTop: '16px' }}>Login</button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--glass-border)', padding: '24px 0', textAlign: 'center', background: 'rgba(10, 10, 12, 0.5)' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>© 2026 MechTech Marketplace Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
