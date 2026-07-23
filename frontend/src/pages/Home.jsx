import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import useApi from '../hooks/useApi';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import { Search, MapPin, Award } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { setCategory, setLocation } = useBooking();

  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Call APIs for categories and cities
  const { data: categories, loading: loadingCats, error: errorCats, refetch: refetchCats } = useApi('/api/categories');
  const { data: cities, loading: loadingCities, error: errorCities, refetch: refetchCities } = useApi('/api/cities');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCategoryId) params.append('categoryId', selectedCategoryId);
    if (selectedCityId) params.append('cityId', selectedCityId);

    // Save selection in BookingContext if selected
    if (selectedCategoryId && categories) {
      const cat = categories.find(c => c.id.toString() === selectedCategoryId);
      if (cat) setCategory(cat);
    }
    if (selectedCityId && cities) {
      const city = cities.find(c => c.id.toString() === selectedCityId);
      if (city) setLocation(city, null); // Selected city, area initially null
    }

    navigate(`/providers?${params.toString()}`);
  };

  const handleCategorySelect = (category) => {
    setCategory(category);
    navigate(`/providers?categoryId=${category.id}`);
  };

  const retryAll = () => {
    refetchCats();
    refetchCities();
  };

  if (loadingCats || loadingCities) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <LoadingSpinner message="Loading MechTech Marketplace..." size="lg" />
      </div>
    );
  }

  if (errorCats || errorCities) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <ErrorMessage message={errorCats || errorCities} onRetry={retryAll} />
      </div>
    );
  }

  // Map category slugs to emojis
  const getCategoryEmoji = (slug) => {
    const map = {
      automobiles: '🚗',
      appliances: '🔌',
      electronics: '💻',
      plumbing: '🚰',
      cleaning: '🧹',
      electrical: '⚡',
      maintenance: '🛠️'
    };
    return map[slug.toLowerCase()] || '🛠️';
  };

  return (
    <div className="fade-in">
      {/* 1. Hero Section */}
      <section className="hero" style={{ padding: '60px 0 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.15)', padding: '6px 16px', borderRadius: '100px', marginBottom: '24px' }}>
            <Award size={16} color="var(--accent)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '600' }}>Your Trusted Home Service Partner</span>
          </div>
          <h1>
            Your City. Your Service. <br />
            <span>On Demand.</span>
          </h1>
          <p>
            Trusted mechanics, appliance repair & more at your doorstep. Verified professionals and secure booking in seconds.
          </p>

          {/* Search bar */}
          <div style={{
            background: 'var(--glass)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius)',
            padding: '16px',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'center',
            maxWidth: '700px',
            margin: '0 auto 40px',
            boxShadow: 'var(--shadow)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ flex: '1', minWidth: '180px', position: 'relative' }}>
              <select
                className="form-input"
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
                style={{ paddingLeft: '38px', height: '48px', textIndent: '0.01px' }}
              >
                <option value="">Select your city</option>
                {cities && cities.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <MapPin size={18} color="rgba(255, 255, 255, 0.4)" style={{ position: 'absolute', left: '14px', top: '15px', pointerEvents: 'none' }} />
            </div>

            <div style={{ flex: '1', minWidth: '180px', position: 'relative' }}>
              <select
                className="form-input"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                style={{ paddingLeft: '38px', height: '48px', textIndent: '0.01px' }}
              >
                <option value="">What service do you need?</option>
                {categories && categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <Search size={18} color="rgba(255, 255, 255, 0.4)" style={{ position: 'absolute', left: '14px', top: '15px', pointerEvents: 'none' }} />
            </div>

            <button
              onClick={handleSearch}
              className="btn btn-primary"
              style={{ height: '48px', padding: '0 24px', whiteSpace: 'nowrap' }}
            >
              Find Providers
            </button>
          </div>
        </div>
      </section>

      {/* 2. CategoryGrid section */}
      <section className="section" style={{ borderTop: '1px solid var(--glass-border)' }}>
        <h2 className="section-title">What do you need help with?</h2>
        <p className="section-sub">Explore our service categories and book expert support instantly</p>

        <div className="cat-grid">
          {categories && categories.map(cat => (
            <div
              key={cat.id}
              className="cat-card"
              onClick={() => handleCategorySelect(cat)}
            >
              <div className="cat-icon">
                {getCategoryEmoji(cat.slug)}
              </div>
              <h3>{cat.name}</h3>
              <p>{cat.description || 'Verified local professionals ready to assist.'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. How it works section */}
      <section className="section" style={{ borderTop: '1px solid var(--glass-border)' }}>
        <h2 className="section-title">How MechTech Works</h2>
        <p className="section-sub">Get your service sorted in three simple steps</p>

        <div className="how-grid">
          <div className="how-step">
            <div className="how-num">1</div>
            <h3>Search Providers</h3>
            <p>Filter local experts by service category, city, area, price range, and star rating.</p>
          </div>
          <div className="how-step">
            <div className="how-num">2</div>
            <h3>Book Slot & Confirm</h3>
            <p>Pick a date and convenient time window. Provide details and choose your payment method.</p>
          </div>
          <div className="how-step">
            <div className="how-num">3</div>
            <h3>Get Professional Service</h3>
            <p>A background-verified technician arrives at your door to get the job done right.</p>
          </div>
        </div>
      </section>

      {/* 4. Stats bar */}
      <section style={{
        background: 'rgba(99, 102, 241, 0.03)',
        borderTop: '1px solid var(--glass-border)',
        borderBottom: '1px solid var(--glass-border)',
        padding: '32px 0',
        marginTop: '20px'
      }}>
        <div className="hero-stats" style={{ margin: 0 }}>
          <div className="hero-stat">
            <div className="num">500+</div>
            <div className="label">Verified Providers</div>
          </div>
          <div className="hero-stat">
            <div className="num">3</div>
            <div className="label">Cities Supported</div>
          </div>
          <div className="hero-stat">
            <div className="num">10,000+</div>
            <div className="label">Services Fulfilled</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
