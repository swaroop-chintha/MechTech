import React from 'react';

const LoadingSpinner = ({ message = '', size = 'md' }) => {
  const sizeMap = {
    sm: { width: '20px', height: '20px', borderSize: '2px' },
    md: { width: '40px', height: '40px', borderSize: '3px' },
    lg: { width: '60px', height: '60px', borderSize: '4px' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const spinnerStyle = {
    width: currentSize.width,
    height: currentSize.height,
    border: `${currentSize.borderSize} solid rgba(255, 255, 255, 0.1)`,
    borderTop: `${currentSize.borderSize} solid var(--accent)`,
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 1s linear infinite'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', gap: '12px', width: '100%' }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={spinnerStyle} />
      {message && <p style={{ color: 'var(--text2)', fontSize: '0.9rem', fontWeight: 500 }}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
