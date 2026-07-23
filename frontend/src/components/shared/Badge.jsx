import React from 'react';
import { ShieldCheck, Sparkles, Sparkle } from 'lucide-react';

const Badge = ({ type = 'verified', label }) => {
  const badgeConfig = {
    verified: {
      bg: 'rgba(59, 130, 246, 0.1)',
      color: '#3b82f6',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      icon: ShieldCheck,
      defaultLabel: 'Verified'
    },
    featured: {
      bg: 'rgba(139, 92, 246, 0.1)',
      color: '#a78bfa',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      icon: Sparkles,
      defaultLabel: 'Featured'
    },
    new: {
      bg: 'rgba(6, 182, 212, 0.1)',
      color: '#22d3ee',
      border: '1px solid rgba(6, 182, 212, 0.2)',
      icon: Sparkle,
      defaultLabel: 'New'
    }
  };

  const config = badgeConfig[type] || badgeConfig.verified;
  const displayLabel = label || config.defaultLabel;
  const Icon = config.icon;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      borderRadius: '50px',
      fontSize: '0.7rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      backgroundColor: config.bg,
      color: config.color,
      border: config.border,
      width: 'fit-content'
    }}>
      {Icon && <Icon size={12} />}
      {displayLabel}
    </span>
  );
};

export default Badge;
