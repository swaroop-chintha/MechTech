import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import useApi from '../hooks/useApi';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import StarRating from '../components/shared/StarRating';
import AvailabilityDot from '../components/shared/AvailabilityDot';
import Badge from '../components/shared/Badge';
import { MapPin, Clock, Calendar, ChevronRight, BookOpen, MessageSquare } from 'lucide-react';

const ProviderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const servicesRef = useRef(null);

  const { selectedService, setService, setProvider } = useBooking();

  // Load provider details from API
  const { data: provider, loading, error } = useApi(`/api/providers/${id}`);

  // Handle 404 error redirect to /providers after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        navigate('/providers');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <LoadingSpinner message="Fetching provider details..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '20px' }}>
        <ErrorMessage 
          message={`${error}. Redirecting to search page in 3 seconds...`} 
          onRetry={() => navigate('/providers')} 
        />
      </div>
    );
  }

  if (!provider) return null;

  const {
    shopName,
    bio,
    rating,
    reviewCount,
    isVerified,
    isAvailable,
    city,
    area,
    address,
    profilePhotoUrl,
    services = [],
    recentReviews = []
  } = provider;

  // Generate initials for placeholder avatar
  const getInitials = (name) => {
    if (!name) return 'P';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const handleSelectService = (service) => {
    setProvider(provider);
    setService(service);
  };

  const handleBookNow = () => {
    if (selectedService) {
      navigate('/book');
    } else {
      servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
      const sec = document.getElementById('services-section');
      if (sec) {
        sec.style.border = '1px solid var(--accent)';
        sec.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.2)';
        setTimeout(() => {
          sec.style.border = '1px solid var(--glass-border)';
          sec.style.boxShadow = 'none';
        }, 2000);
      }
    }
  };

  const lowestPrice = services.length > 0 
    ? Math.min(...services.map(s => s.basePrice).filter(p => p !== null)) 
    : 0;

  return (
    <div className="fade-in" style={{ paddingBottom: '80px' }}>
      
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '24px' }}>
        <Link to="/" style={{ color: 'var(--text2)' }}>Home</Link>
        <ChevronRight size={14} />
        <Link to="/providers" style={{ color: 'var(--text2)' }}>Providers</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text)' }}>{shopName}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px', alignItems: 'flex-start' }} className="detail-layout">
        
        {/* Main Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Top profile section */}
          <div style={{
            background: 'var(--glass)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius)',
            padding: '32px',
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            alignItems: 'center',
            boxShadow: 'var(--shadow)'
          }}>
            {profilePhotoUrl ? (
              <img 
                src={profilePhotoUrl} 
                alt={shopName} 
                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--glass-border)' }} 
              />
            ) : (
              <div className="provider-avatar" style={{ width: '100px', height: '100px', fontSize: '2.5rem', margin: 0 }}>
                {getInitials(shopName)}
              </div>
            )}

            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>{shopName}</h2>
                {isVerified && <Badge type="verified" />}
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '12px' }}>
                <AvailabilityDot available={isAvailable} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <StarRating rating={rating ? parseFloat(rating) : 0} size="md" />
                  <strong style={{ fontSize: '0.9rem', color: 'var(--warning)' }}>
                    {rating ? parseFloat(rating).toFixed(1) : '0.0'}
                  </strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>
                    ({reviewCount || 0} reviews)
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.9rem', color: 'var(--text2)' }}>
                <MapPin size={16} color="var(--text3)" style={{ marginTop: '3px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 500 }}>{area}, {city}</p>
                  {address && <p style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: '2px' }}>{address}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div style={{
            background: 'var(--glass)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius)',
            padding: '32px'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="var(--accent)" /> About Shop
            </h3>
            <p style={{ color: 'var(--text2)', fontSize: '0.95rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              {bio || "This provider is a background-verified local partner committed to offering fast, high-quality home maintenance, installations, and emergency troubleshooting. Connect to coordinate customizable options."}
            </p>
          </div>

          {/* Services Section */}
          <div 
            ref={servicesRef} 
            id="services-section" 
            style={{
              background: 'var(--glass)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius)',
              padding: '32px',
              transition: 'all 0.3s ease'
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '6px' }}>Services Offered</h3>
            <p style={{ color: 'var(--text3)', fontSize: '0.85rem', marginBottom: '24px' }}>
              Select a service from the offerings below to configure your booking slot
            </p>

            {(!services || services.length === 0) ? (
              <p style={{ color: 'var(--text2)', fontStyle: 'italic' }}>No services currently listed by this provider.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {services.map(service => {
                  const isSelected = selectedService && selectedService.id === service.id;
                  return (
                    <div 
                      key={service.id} 
                      style={{
                        padding: '20px',
                        background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? '1px solid var(--accent)' : '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: isSelected ? 'var(--text)' : 'var(--text)' }}>
                          {service.name}
                        </h4>
                        {service.description && (
                          <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginTop: '4px', lineHeight: '1.4' }}>
                            {service.description}
                          </p>
                        )}
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '10px', fontSize: '0.75rem', color: 'var(--text3)' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> {service.durationMins} mins
                          </span>
                          <span>•</span>
                          <span>Category: {service.categoryName}</span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text)' }}>
                          ₹{service.basePrice}
                        </span>
                        <button 
                          onClick={() => handleSelectService(service)}
                          className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                          style={{ padding: '6px 14px' }}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div style={{
            background: 'var(--glass)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius)',
            padding: '32px'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} color="var(--accent)" /> Customer Reviews
            </h3>

            {(!recentReviews || recentReviews.length === 0) ? (
              <p style={{ color: 'var(--text2)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                No reviews yet. Be the first!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentReviews.map(review => (
                  <div 
                    key={review.id}
                    style={{
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{review.reviewerName}</span>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: '1.4' }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Sidebar Action Block */}
        <aside style={{
          background: 'var(--glass)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius)',
          padding: '24px',
          position: 'sticky',
          top: '90px',
          boxShadow: 'var(--shadow)'
        }} className="detail-sidebar">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>Booking Summary</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text2)' }}>Provider</span>
              <span style={{ fontWeight: 600 }}>{shopName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text2)' }}>Service</span>
              <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '180px' }}>
                {selectedService ? selectedService.name : 'None selected'}
              </span>
            </div>
            {selectedService && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text2)' }}>Duration</span>
                <span style={{ fontWeight: 600 }}>{selectedService.durationMins} mins</span>
              </div>
            )}
            <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>Price</span>
              <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text)' }}>
                ₹{selectedService ? selectedService.basePrice : lowestPrice}
              </span>
            </div>
          </div>

          <button 
            onClick={handleBookNow} 
            className="btn btn-primary btn-block"
            style={{ padding: '12px' }}
          >
            {selectedService ? 'Book Now' : 'Select a Service'}
          </button>
        </aside>
      </div>

      {/* Sticky Bottom Bar for Mobile Screen sizes */}
      <div 
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(10, 14, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--glass-border)',
          padding: '16px 20px',
          zIndex: 100,
          display: 'none',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        className="sticky-bottom-bar"
      >
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text)', display: 'block' }}>{shopName}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>
            {selectedService ? `${selectedService.name} (₹${selectedService.basePrice})` : `Starting at ₹${lowestPrice}`}
          </span>
        </div>
        <button 
          onClick={handleBookNow} 
          className="btn btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          {selectedService ? 'Book Now' : 'Select Service'}
        </button>
      </div>

      <style>{`
        @media(max-width: 768px) {
          .detail-layout {
            grid-template-columns: 1fr !important;
          }
          .detail-sidebar {
            display: none !important;
          }
          .sticky-bottom-bar {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProviderDetail;
