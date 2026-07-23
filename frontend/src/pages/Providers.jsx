import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import useApi from '../hooks/useApi';
import ProviderCard from '../components/providers/ProviderCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import EmptyState from '../components/shared/EmptyState';
import { SlidersHorizontal, MapPin, X, Compass, ChevronLeft, ChevronRight } from 'lucide-react';

const SkeletonCard = () => (
  <div className="provider-card" style={{ opacity: 0.4, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div className="provider-header" style={{ display: 'flex', gap: '14px', alignItems: 'center', margin: 0 }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: '14px', width: '60%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ height: '10px', width: '40%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }} />
      </div>
    </div>
    <div style={{ height: '12px', width: '80%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }} />
    <div style={{ height: '12px', width: '50%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }} />
    <div style={{ display: 'flex', gap: '6px' }}>
      <div style={{ height: '22px', width: '60px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }} />
      <div style={{ height: '22px', width: '60px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }} />
    </div>
    <div className="provider-details" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '14px', margin: 0 }}>
      <div style={{ height: '20px', width: '80px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }} />
      <div style={{ height: '28px', width: '90px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }} />
    </div>
  </div>
);

const Providers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedCategory, selectedCity, selectedArea, setCategory, setLocation } = useBooking();

  // Mobile filters visibility toggle
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Retrieve current filters from URL search params
  const categoryId = searchParams.get('categoryId') || '';
  const cityId = searchParams.get('cityId') || '';
  const areaId = searchParams.get('areaId') || '';
  const sort = searchParams.get('sort') || 'rating';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const lat = searchParams.get('lat') || '';
  const lng = searchParams.get('lng') || '';
  const page = parseInt(searchParams.get('page') || '0', 10);

  // Local state for debouncing price filters
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  // Call lookup APIs
  const { data: categories } = useApi('/api/categories');
  const { data: cities } = useApi('/api/cities');

  // Load nested areas of the selected city
  const selectedCityObj = cities ? cities.find(c => c.id.toString() === cityId) : null;
  const areas = selectedCityObj ? selectedCityObj.areas : [];

  // Sync url param updates back to local price inputs
  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  // Handle prefill from BookingContext on mount if no search URL parameters exist
  useEffect(() => {
    if (searchParams.toString() === '') {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        if (selectedCategory) next.set('categoryId', selectedCategory.id.toString());
        if (selectedCity) next.set('cityId', selectedCity.id.toString());
        if (selectedArea) next.set('areaId', selectedArea.id.toString());
        return next;
      });
    }
  }, []);

  // Debounce Price range inputs (500ms delay)
  useEffect(() => {
    if (localMinPrice === minPrice && localMaxPrice === maxPrice) {
      return;
    }
    const timer = setTimeout(() => {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        if (localMinPrice) next.set('minPrice', localMinPrice);
        else next.delete('minPrice');
        if (localMaxPrice) next.set('maxPrice', localMaxPrice);
        else next.delete('maxPrice');
        next.set('page', '0');
        return next;
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [localMinPrice, localMaxPrice, minPrice, maxPrice, setSearchParams]);

  // Construct final search params for GET /api/providers
  const getProvidersQueryString = () => {
    const apiParams = new URLSearchParams();
    if (categoryId) apiParams.append('categoryId', categoryId);
    if (cityId) apiParams.append('cityId', cityId);
    if (areaId) apiParams.append('areaId', areaId);
    if (sort) apiParams.append('sort', sort);
    if (minPrice) apiParams.append('minPrice', minPrice);
    if (maxPrice) apiParams.append('maxPrice', maxPrice);
    if (lat) apiParams.append('lat', lat);
    if (lng) apiParams.append('lng', lng);
    apiParams.append('page', page.toString());
    apiParams.append('size', '10');
    return apiParams.toString();
  };

  const { data: providersPage, loading: loadingProviders, error: errorProviders, refetch: refetchProviders } = useApi(
    `/api/providers?${getProvidersQueryString()}`
  );

  // Filter setters that immediately trigger URL search params update
  const handleFilterChange = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      
      // If changing city, clear area selection
      if (key === 'cityId') {
        next.delete('areaId');
        if (cities) {
          const selectedCity = cities.find(c => c.id.toString() === value);
          setLocation(selectedCity || null, null);
        }
      }

      if (key === 'categoryId' && categories) {
        const selectedCat = categories.find(c => c.id.toString() === value);
        setCategory(selectedCat || null);
      }

      next.set('page', '0'); // Reset page to 0 on filter change
      return next;
    });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set('lat', position.coords.latitude.toString());
            next.set('lng', position.coords.longitude.toString());
            next.set('sort', 'distance');
            next.set('page', '0');
            return next;
          });
        },
        (error) => {
          console.error("GPS Error:", error);
          alert("Could not fetch geolocation. Please allow location permissions in your browser.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handlePageChange = (newPage) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('page', newPage.toString());
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Find Service Providers</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Book background-verified local technicians in your area
          </p>
        </div>
        <button 
          onClick={() => setShowFiltersMobile(!showFiltersMobile)} 
          style={{ display: 'none', gap: '8px', padding: '10px 16px' }}
          className="btn btn-secondary mobile-filter-btn"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="providers-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* Left Panel — Filters */}
        <aside className={`filters-panel ${showFiltersMobile ? 'open' : ''}`} style={{
          background: 'var(--glass)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius)',
          padding: '24px',
          position: 'sticky',
          top: '90px',
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto',
          boxShadow: 'var(--shadow)',
          zIndex: 90
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={18} color="var(--accent)" /> Filters
            </h3>
            <button 
              onClick={() => setShowFiltersMobile(false)} 
              style={{ display: 'none', background: 'none', color: 'var(--text2)', border: 'none' }}
              className="filters-close-btn"
            >
              <X size={20} />
            </button>
          </div>

          {/* Location button */}
          <div style={{ marginBottom: '24px' }}>
            <button 
              onClick={handleGetLocation} 
              className="btn btn-secondary btn-block"
              style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Compass size={16} /> {lat && lng ? 'Location Synced' : 'Use My Location'}
            </button>
            {lat && lng && (
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--success)', marginTop: '6px', textAlign: 'center' }}>
                GPS coordinates active ({parseFloat(lat).toFixed(4)}, {parseFloat(lng).toFixed(4)})
              </span>
            )}
          </div>

          {/* Sort By filter */}
          <div className="form-group">
            <label className="form-label">Sort By</label>
            <select 
              className="form-input" 
              value={sort} 
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              style={{ textIndent: '0.01px' }}
            >
              <option value="rating">Highest Rating</option>
              <option value="price">Lowest Base Price</option>
              {lat && lng && <option value="distance">Shortest Distance</option>}
            </select>
          </div>

          {/* Category filter */}
          <div style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ marginBottom: '12px' }}>Category</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input 
                  type="radio" 
                  name="category" 
                  checked={categoryId === ''} 
                  onChange={() => handleFilterChange('categoryId', '')} 
                  style={{ accentColor: 'var(--accent)' }}
                />
                <span>All Categories</span>
              </label>
              {categories && categories.map(cat => (
                <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input 
                    type="radio" 
                    name="category" 
                    value={cat.id} 
                    checked={categoryId === cat.id.toString()} 
                    onChange={() => handleFilterChange('categoryId', cat.id.toString())} 
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* City filter */}
          <div style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ marginBottom: '12px' }}>City</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input 
                  type="radio" 
                  name="city" 
                  checked={cityId === ''} 
                  onChange={() => handleFilterChange('cityId', '')} 
                  style={{ accentColor: 'var(--accent)' }}
                />
                <span>All Cities</span>
              </label>
              {cities && cities.map(c => (
                <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input 
                    type="radio" 
                    name="city" 
                    value={c.id} 
                    checked={cityId === c.id.toString()} 
                    onChange={() => handleFilterChange('cityId', c.id.toString())} 
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  <span>{c.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Area filter */}
          {cityId && areas.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ marginBottom: '12px' }}>Area</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '8px', borderLeft: '1px solid var(--glass-border)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input 
                    type="radio" 
                    name="area" 
                    checked={areaId === ''} 
                    onChange={() => handleFilterChange('areaId', '')} 
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  <span>All Areas</span>
                </label>
                {areas.map(a => (
                  <label key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input 
                      type="radio" 
                      name="area" 
                      value={a.id} 
                      checked={areaId === a.id.toString()} 
                      onChange={() => handleFilterChange('areaId', a.id.toString())} 
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    <span>{a.name} ({a.pincode})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range filter */}
          <div style={{ marginBottom: '24px' }}>
            <label className="form-label">Price Range (₹)</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="number" 
                className="form-input" 
                placeholder="Min" 
                value={localMinPrice} 
                onChange={(e) => setLocalMinPrice(e.target.value)} 
                style={{ fontSize: '0.8rem' }}
              />
              <input 
                type="number" 
                className="form-input" 
                placeholder="Max" 
                value={localMaxPrice} 
                onChange={(e) => setLocalMaxPrice(e.target.value)} 
                style={{ fontSize: '0.8rem' }}
              />
            </div>
          </div>

          <button 
            onClick={handleReset} 
            className="btn btn-secondary btn-block" 
            style={{ marginTop: '12px' }}
          >
            Reset Filters
          </button>
        </aside>

        {/* Right Panel — Results */}
        <main style={{ flex: 1 }}>
          
          {loadingProviders ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ height: '14px', width: '150px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }} />
              </div>
              <div className="provider-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <SkeletonCard key={idx} />
                ))}
              </div>
            </div>
          ) : errorProviders ? (
            <ErrorMessage message={errorProviders} onRetry={refetchProviders} />
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ color: 'var(--text2)', fontSize: '0.9rem', fontWeight: 500 }}>
                  {providersPage?.total || 0} providers found
                </span>
              </div>

              {(!providersPage || providersPage.providers.length === 0) ? (
                <EmptyState 
                  icon={MapPin} 
                  title="No providers available" 
                  subtitle="We couldn't find any service providers matching your current filter selections. Try resetting filters." 
                  action={(
                    <button onClick={handleReset} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                      Reset Filters
                    </button>
                  )}
                />
              ) : (
                <>
                  <div className="provider-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {providersPage.providers.map(provider => (
                      <ProviderCard key={provider.id} provider={provider} />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {providersPage.totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '40px' }}>
                      <button 
                        onClick={() => handlePageChange(page - 1)} 
                        disabled={page === 0}
                        className="btn btn-secondary" 
                        style={{ padding: '8px 12px', opacity: page === 0 ? 0.5 : 1, cursor: page === 0 ? 'not-allowed' : 'pointer' }}
                      >
                        <ChevronLeft size={16} /> Prev
                      </button>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text2)' }}>
                        Page {page + 1} of {providersPage.totalPages}
                      </span>
                      <button 
                        onClick={() => handlePageChange(page + 1)} 
                        disabled={page >= providersPage.totalPages - 1}
                        className="btn btn-secondary" 
                        style={{ padding: '8px 12px', opacity: page >= providersPage.totalPages - 1 ? 0.5 : 1, cursor: page >= providersPage.totalPages - 1 ? 'not-allowed' : 'pointer' }}
                      >
                        Next <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>

      <style>{`
        /* Responsive Filter overrides */
        @media(max-width: 768px) {
          .providers-layout {
            grid-template-columns: 1fr !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
          .filters-panel {
            display: none;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            max-height: 100vh !important;
            width: 100vw !important;
            z-index: 9999 !important;
            background: var(--bg) !important;
            border: none !important;
            border-radius: 0 !important;
          }
          .filters-panel.open {
            display: block !important;
          }
          .filters-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Providers;
