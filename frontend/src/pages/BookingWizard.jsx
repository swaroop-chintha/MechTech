import React from 'react';
import { useBooking } from '../context/BookingContext';

const BookingWizard = () => {
  const { currentStep, selectedProvider, selectedService, resetBooking } = useBooking();

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
      <div className="wizard-body">
        <h2 className="wizard-title">Booking Wizard</h2>
        <p className="wizard-sub">Step {currentStep} of 6</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '20px 0', padding: '20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--glass-border)', textAlign: 'left' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Selected Provider</span>
            <p style={{ fontWeight: 600 }}>{selectedProvider ? selectedProvider.shopName : 'None'}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Selected Service</span>
            <p style={{ fontWeight: 600 }}>{selectedService ? `${selectedService.name} (₹${selectedService.basePrice})` : 'None'}</p>
          </div>
        </div>

        <button onClick={resetBooking} className="btn btn-secondary">Reset Booking State</button>
      </div>
    </div>
  );
};

export default BookingWizard;
