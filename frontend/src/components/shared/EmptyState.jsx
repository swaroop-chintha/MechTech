import React from 'react';

const EmptyState = ({ icon: Icon, title, subtitle, action }) => {
  return (
    <div className="empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: '400px', margin: '40px auto', textAlign: 'center' }}>
      {Icon && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '50%',
          padding: '16px',
          color: 'var(--text3)',
          marginBottom: '16px',
          border: '1px solid var(--glass-border)',
          display: 'inline-flex'
        }}>
          <Icon size={40} />
        </div>
      )}
      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>{title}</h3>
      <p style={{ color: 'var(--text2)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: action ? '20px' : '0' }}>{subtitle}</p>
      {action}
    </div>
  );
};

export default EmptyState;
