import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from '../shared/StarRating';
import AvailabilityDot from '../shared/AvailabilityDot';
import Badge from '../shared/Badge';
import { MapPin } from 'lucide-react';

const ProviderCard = ({ provider }) => {
  const navigate = useNavigate();
  
  const {
    id,
    shopName,
    rating,
    reviewCount,
    isVerified,
    isAvailable,
    city,
    area,
    profilePhotoUrl,
    services = [],
    distanceKm
  } = provider;

  // Calculate lowest base price from services
  const basePrices = services.map(s => s.basePrice).filter(p => p !== undefined && p !== null);
  const minPrice = basePrices.length > 0 ? Math.min(...basePrices) : null;

  // Generate initials for avatar placeholder
  const getInitials = (name) => {
    if (!name) return 'P';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const handleCardClick = () => {
    navigate(`/providers/${id}`);
  };

  return (
    <div 
      className="provider-card" 
      onClick={handleCardClick}
      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}
    >
      <div>
        {/* Card Header */}
        <div className="provider-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: 0, marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            {profilePhotoUrl ? (
              <img 
                src={profilePhotoUrl} 
                alt={shopName} 
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} 
              />
            ) : (
              <div className="provider-avatar" style={{ margin: 0 }}>
                {getInitials(shopName)}
              </div>
            )}
            <div>
              <h3 className="provider-name" style={{ margin: 0, color: 'var(--text)' }}>{shopName}</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                <AvailabilityDot available={isAvailable} />
                {distanceKm !== undefined && distanceKm !== null && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
                    • {distanceKm.toFixed(1)} km
                  </span>
                )}
              </div>
            </div>
          </div>
          {isVerified && <Badge type="verified" />}
        </div>

        {/* Rating Section */}
        <div className="provider-rating" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <StarRating rating={rating ? parseFloat(rating) : 0} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text2)', fontWeight: 500 }}>
            {rating ? parseFloat(rating).toFixed(1) : '0.0'}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>
            ({reviewCount || 0})
          </span>
        </div>

        {/* Location Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '16px' }}>
          <MapPin size={14} color="var(--text3)" />
          <span>{area}, {city}</span>
        </div>

        {/* Service tags */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {services.slice(0, 3).map((service, idx) => (
            <span 
              key={service.id || idx} 
              style={{
                fontSize: '0.75rem',
                padding: '4px 8px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text2)'
              }}
            >
              {service.name}
            </span>
          ))}
          {services.length > 3 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text3)', alignSelf: 'center' }}>
              +{services.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Card Details / Price Section */}
      <div className="provider-details" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '14px', marginTop: 'auto', margin: 0 }}>
        <div className="provider-price" style={{ margin: 0 }}>
          {minPrice !== null ? (
            <>
              <span style={{ fontSize: '0.75rem', color: 'var(--text3)', display: 'block' }}>Starting from</span>
              <span style={{ color: 'var(--text)' }}>₹{minPrice}</span>
            </>
          ) : (
            <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>No services listed</span>
          )}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }} 
          className="btn btn-primary btn-sm"
        >
          View & Book
        </button>
      </div>
    </div>
  );
};

export default ProviderCard;
