import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

const ErrorMessage = ({ message = 'An error occurred', onRetry }) => {
  return (
    <div style={{
      background: 'rgba(239, 68, 68, 0.06)',
      border: '1px solid rgba(239, 68, 68, 0.15)',
      borderRadius: 'var(--radius)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      maxWidth: '480px',
      margin: '20px auto',
      textAlign: 'center',
      backdropFilter: 'blur(10px)',
      boxShadow: 'var(--shadow)'
    }}>
      <div style={{
        background: 'rgba(239, 68, 68, 0.12)',
        borderRadius: '50%',
        padding: '12px',
        color: 'var(--danger)',
        display: 'inline-flex'
      }}>
        <AlertCircle size={28} />
      </div>
      <div>
        <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text)' }}>Something went wrong</h4>
        <p style={{ color: 'var(--text2)', fontSize: '0.875rem', lineHeight: '1.5' }}>{message}</p>
      </div>
      {onRetry && (
        <button 
          onClick={onRetry} 
          className="btn btn-secondary" 
          style={{ 
            fontSize: '0.8rem', 
            padding: '8px 16px',
            borderColor: 'rgba(239, 68, 68, 0.25)',
            background: 'rgba(239, 68, 68, 0.05)',
            color: 'var(--text)'
          }}
        >
          <RotateCcw size={14} /> Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
