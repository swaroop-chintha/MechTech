import React from 'react';

const AvailabilityDot = ({ available = false }) => {
  const tooltipText = available ? "Available now" : "Currently unavailable";
  
  return (
    <div 
      title={tooltipText}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'help'
      }}
    >
      <span 
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: available ? 'var(--success)' : 'rgba(255, 255, 255, 0.3)',
          boxShadow: available ? '0 0 8px var(--success)' : 'none',
          animation: available ? 'pulse 2s infinite' : 'none',
          display: 'inline-block'
        }}
      />
      <span style={{ fontSize: '0.8rem', color: available ? 'var(--success)' : 'var(--text2)', fontWeight: 500 }}>
        {available ? 'Available' : 'Unavailable'}
      </span>
    </div>
  );
};

export default AvailabilityDot;
