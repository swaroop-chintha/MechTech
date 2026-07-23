import React from 'react';
import { useParams, Link } from 'react-router-dom';

const BookingConfirmation = () => {
  const { id } = useParams();

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
      <div className="wizard-body" style={{ borderColor: 'var(--success)' }}>
        <h2 className="wizard-title" style={{ color: 'var(--success)' }}>Booking Confirmed!</h2>
        <p className="wizard-sub">Your booking has been successfully placed</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '20px 0', padding: '20px', background: 'rgba(34, 197, 94, 0.05)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.2)', textAlign: 'left' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Booking ID</span>
            <p style={{ fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--success)' }}>#{id}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Status</span>
            <p style={{ fontWeight: 600 }}>CONFIRMED</p>
          </div>
        </div>

        <Link to="/" className="btn btn-primary">Go Back Home</Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;
