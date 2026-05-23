import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CheckCircle,
  Flame,
  Heart,
  Home,
  MapPin,
  Plane,
  Search,
  Shirt,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
  Utensils,
} from 'lucide-react';
import './App.css';
import ConsentModal from './components/ConsentModal';
import AuthModal from './components/AuthModal';
import ProfileDashboard from './components/ProfileDashboard';
import { useAuth } from './hooks/useAuth';
import { PrivacyPolicy, AffiliateDisclosure, AboutUs } from './components/LegalPages';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORIES = [
  { id: 'all', label: 'All Deals', Icon: Sparkles },
  { id: 'traveling', label: 'Travel', Icon: Plane },
  { id: 'food', label: 'Food Point', Icon: Utensils },
  { id: 'grocery', label: 'Groceries', Icon: ShoppingCart },
  { id: 'shopping', label: 'Shopping', Icon: Shirt },
];

const SORT_OPTIONS = [
  { value: 'discount', label: 'Top picks by discount' },
  { value: 'price_low', label: 'Price: low to high' },
  { value: 'price_high', label: 'Price: high to low' },
  { value: 'newest', label: 'Newest first' },
];

const FALLBACK_OFFERS = [
  {
    id: 'demo-booking',
    title: 'Luxury hotel stays with Genius-style savings',
    description: 'Curated travel discounts for weekend breaks and business trips.',
    category: 'traveling',
    brand: { name: 'Booking.com' },
    pricing: { originalPrice: 8500, discountedPrice: 5950, discountPercent: 30 },
    affiliate: { link: 'https://www.booking.com', network: 'booking_com' },
    location: { type: 'online', cities: ['Mumbai', 'Delhi'] },
    validity: { isActive: true },
    meta: { rating: 4.7, couponCode: 'STAY30', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80' },
    source: 'Booking.com'
  },
  {
    id: 'demo-food',
    title: 'Flat 45% off on restaurant orders',
    description: 'Top-rated food deals from nearby restaurants and cloud kitchens.',
    category: 'food',
    brand: { name: 'Food Point' },
    pricing: { originalPrice: 799, discountedPrice: 439, discountPercent: 45 },
    affiliate: { link: 'https://example.com/food', network: 'direct' },
    location: { type: 'both', cities: ['Bengaluru', 'Pune'] },
    validity: { isActive: true },
    meta: { rating: 4.5, couponCode: 'FOOD45', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80' },
    source: 'Buyoffer'
  },
  {
    id: 'demo-grocery',
    title: 'Weekly grocery basket saver',
    description: 'Fresh staples, snacks, and household essentials at lower prices.',
    category: 'grocery',
    brand: { name: 'Grocery Mart' },
    pricing: { originalPrice: 2499, discountedPrice: 1699, discountPercent: 32 },
    affiliate: { link: 'https://example.com/grocery', network: 'direct' },
    location: { type: 'both', cities: ['Hyderabad', 'Chennai'] },
    validity: { isActive: true },
    meta: { rating: 4.4, couponCode: 'BASKET32', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80' },
    source: 'Buyoffer'
  }
];

function requestJson(url, options = {}) {
  const fetchFn = typeof window !== 'undefined' && typeof window.fetch === 'function'
    ? window.fetch.bind(window)
    : typeof fetch === 'function'
      ? fetch
      : null;

  if (fetchFn) {
    return fetchFn(url, options).then(res => res.json());
  }

  if (typeof XMLHttpRequest !== 'function') {
    return Promise.reject(new Error('Browser request APIs are unavailable'));
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method || 'GET', url);
    Object.entries(options.headers || {}).forEach(([key, value]) => xhr.setRequestHeader(key, value));
    xhr.onload = () => {
      try {
        resolve(JSON.parse(xhr.responseText || '{}'));
      } catch (error) {
        reject(error);
      }
    };
    xhr.onerror = reject;
    xhr.send(options.body || null);
  });
}

export default function App() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchCtx, setSearchCtx] = useState('');

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('discount');
  const [priceMax, setPriceMax] = useState('');

  const [locations, setLocations] = useState({ states: [] });
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedArea] = useState('');
  const [areaInput, setAreaInput] = useState('');

  const [showFilters, setShowFilters] = useState(false);
  const [searched, setSearched] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authPrompt, setAuthPrompt] = useState('');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { user, logout, saveDeal } = useAuth();

  const debounceRef = useRef(null);

  useEffect(() => {
    const onPopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    requestJson(`${API}/api/locations`)
      .then(setLocations)
      .catch(() => {});
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  function sortOffers(list, by) {
    return [...list].sort((a, b) => {
      if (by === 'discount') return (b.pricing?.discountPercent || 0) - (a.pricing?.discountPercent || 0);
      if (by === 'price_low') return (a.pricing?.discountedPrice || 0) - (b.pricing?.discountedPrice || 0);
      if (by === 'price_high') return (b.pricing?.discountedPrice || 0) - (a.pricing?.discountedPrice || 0);
      return 0;
    });
  }

  const fetchOffers = useCallback(async (params = {}) => {
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const p = new URLSearchParams();
      if (params.q || query) p.set('q', params.q ?? query);
      const cat = params.category || activeCategory;
      if (cat && cat !== 'all') p.set('category', cat);
      if (selectedState) p.set('state', selectedState);
      if (selectedCity) p.set('city', selectedCity);
      if (areaInput) p.set('area', areaInput);

      const data = await requestJson(`${API}/api/offers/search?${p}`);
      let results = data.offers || [];

      results = sortOffers(results, sortBy);
      if (priceMax) results = results.filter(o => (o.pricing?.discountedPrice || 0) <= Number(priceMax));

      setOffers(results);
      setSearchCtx(data.searchContext || '');
    } catch {
      setOffers(sortOffers(FALLBACK_OFFERS, sortBy));
      setSearchCtx('Preview deals');
      setError('');
    } finally {
      setLoading(false);
    }
  }, [query, activeCategory, selectedState, selectedCity, areaInput, sortBy, priceMax]);

  useEffect(() => {
    fetchOffers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!searched) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchOffers(), 400);
    return () => clearTimeout(debounceRef.current);
  }, [activeCategory, selectedState, selectedCity, areaInput, fetchOffers, searched]);

  function handleSearch() {
    fetchOffers();
  }

  function handleCategoryClick(catId) {
    setActiveCategory(catId);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchOffers({ category: catId }), 200);
  }

  async function handleGetDeal(offer) {
    if (!user) {
      setAuthPrompt('Please sign in or create an account to unlock this deal.');
      setAuthModalOpen(true);
      return;
    }

    let finalLink = offer.affiliate?.link;

    try {
      const data = await requestJson(`${API}/api/clicks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId: offer.id, category: offer.category, affiliateLink: offer.affiliate?.link })
      });
      if (data.redirect) {
        finalLink = data.redirect;
      }
    } catch (err) {
      console.error('Failed to track click or check redirect:', err);
    }

    if (!finalLink) return;
    if (offer.affiliate?.network === 'booking_com') {
      window.location.href = finalLink;
    } else {
      window.open(finalLink, '_blank', 'noopener');
    }
  }

  const availableCities = locations.states?.find(s => s.name === selectedState)?.cities || [];
  const selectedCityData = availableCities.find(c => c.name === selectedCity);
  const availableAreas = selectedCityData?.areas || [];
  const allCityNames = locations.states?.flatMap(state => state.cities?.map(city => city.name) || []) || [];
  const selectedLocationLabel = [selectedArea || areaInput, selectedCity, selectedState].filter(Boolean).join(', ');

  return (
    <div className="app">
      <ConsentModal />
      {user
        ? <ProfileDashboard isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        : <AuthModal isOpen={authModalOpen} onClose={() => { setAuthModalOpen(false); setAuthPrompt(''); }} prompt={authPrompt} />
      }

      <nav className="navbar">
        <div className="nav-inner">
          <button className="logo" onClick={() => navigate('/')} type="button" aria-label="Buyoffer home">
            <span className="logo-mark">B</span>
            <span className="logo-text">Buyoffer.com</span>
          </button>

          <div className="nav-actions">

            {user ? (
              <div className="nav-user">
                <button className="avatar-button" onClick={() => setAuthModalOpen(true)} type="button">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=00E5FF&color=0A0F1E`; }}
                  />
                </button>
                <span className="nav-username">{user.name}</span>
              </div>
            ) : (
              <>
                <button className="btn-nav" onClick={() => setAuthModalOpen(true)} type="button">Register</button>
                <button className="btn-nav btn-nav-solid" onClick={() => setAuthModalOpen(true)} type="button">Sign in</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {currentPath === '/' && (
        <>
          <header className="hero">
            <div className="hero-content">

              <form className="booking-search" onSubmit={e => { e.preventDefault(); handleSearch(); }}>
                <label className="booking-search-field">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search by brand, city, or keyword..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    autoComplete="off"
                  />
                </label>
                <button type="submit" className="search-btn" disabled={loading}>
                  {loading ? <span className="spinner" /> : 'Search'}
                </button>
              </form>
            </div>
          </header>

          <section className="category-tabs" aria-label="Deal categories">
            <div className="category-tabs-inner">
              {CATEGORIES.map(cat => {
                const Icon = cat.Icon;
                return (
                  <button
                    key={cat.id}
                    className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(cat.id)}
                    type="button"
                  >
                    <Icon size={18} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="deals-section">
          <main className="main">

            <div className="sort-filter-bar">
              <label className="sort-control">
                <span>Sort</span>
                <select value={sortBy} onChange={e => { setSortBy(e.target.value); setOffers(o => sortOffers(o, e.target.value)); }}>
                  {SORT_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>

            </div>

            {searched && !loading && (
              <div className="results-header">
                <div className="results-meta">
                  {offers.length > 0
                    ? <><span className="results-count">{offers.length}</span> deals found {searchCtx && <span className="results-ctx">- {searchCtx}</span>}</>
                    : 'No deals found'
                  }
                </div>
                {selectedLocationLabel && <div className="loc-tag"><MapPin size={14} /> {selectedLocationLabel}</div>}
              </div>
            )}

            {loading && (
              <div className="offers-grid">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="offer-card skeleton-card">
                    <div className="skeleton sk-img" />
                    <div className="sk-body">
                      <div className="skeleton sk-line" />
                      <div className="skeleton sk-line short" />
                      <div className="skeleton sk-price" />
                      <div className="skeleton sk-btn" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && <div className="error-state">{error}</div>}

            {!loading && offers.length > 0 && (
              <div className="offers-grid">
                {offers.map((offer, i) => (
                  <OfferCard
                    key={offer.id || i}
                    offer={offer}
                    onDeal={handleGetDeal}
                    index={i}
                    user={user}
                    onSave={saveDeal}
                    onLogin={() => {
                      setAuthPrompt('Please sign in to save this deal.');
                      setAuthModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}

            {!loading && searched && offers.length === 0 && !error && (
              <div className="empty-state">
                <div className="empty-icon"><Search size={32} /></div>
                <h3>No deals found</h3>
                <p>Try a different search term or broaden your location filter.</p>
                <button className="btn-primary" onClick={() => { setActiveCategory('all'); setSelectedState(''); setSelectedCity(''); setAreaInput(''); fetchOffers({ category: 'all' }); }} type="button">
                  Clear Filters
                </button>
              </div>
            )}
          </main>
          </div>{/* end deals-section */}
        </>
      )}

      {currentPath === '/privacy' && <PrivacyPolicy onClose={() => navigate('/')} />}
      {currentPath === '/disclosure' && <AffiliateDisclosure onClose={() => navigate('/')} />}
      {currentPath === '/about' && <AboutUs onClose={() => navigate('/')} />}

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <p className="footer-logo">Buyoffer.com</p>
            <p className="footer-disc">Deals for hotels, food, groceries, fashion, and everyday services across India.</p>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            <button onClick={() => handleCategoryClick('traveling')} type="button">Travel</button>
            <button onClick={() => handleCategoryClick('food')} type="button">Food</button>
            <button onClick={() => handleCategoryClick('grocery')} type="button">Grocery</button>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>About</a>
            <a href="/disclosure" onClick={(e) => { e.preventDefault(); navigate('/disclosure'); }}>Affiliate Disclosure</a>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}>Privacy Policy</a>
            <button type="button" onClick={() => setAuthModalOpen(true)}>Account help</button>
          </div>
        </div>
        <div className="footer-bottom">Copyright 2026 Lots of Offers. All rights reserved.</div>
      </footer>
    </div>
  );
}

export function OfferCard({ offer, onDeal, index, user, onSave, onLogin }) {
  const cat = CATEGORIES.find(c => c.id === offer.category) || CATEGORIES[0];
  const Icon = cat.Icon;
  const hasDiscount = offer.pricing?.discountPercent > 0;
  const isSaved = user?.savedDeals?.some(d => (d._id || d) === offer.id);
  const rating = Number(offer.meta?.rating) || 4.4;
  const reviewScore = Math.min(9.6, Math.max(7.8, rating * 2)).toFixed(1);
  const locationText = offer.location?.cities?.length > 0
    ? offer.location.cities.slice(0, 2).join(', ')
    : offer.location?.type === 'online'
      ? 'Online deal'
      : 'India';
  const isExpiringSoon = offer.validity?.endDate && (new Date(offer.validity.endDate) - Date.now()) < 3 * 24 * 60 * 60 * 1000;

  const handleSave = (e) => {
    e.stopPropagation();
    if (!user) {
      onLogin();
      return;
    }
    onSave(offer.id);
  };

  return (
    <article
      className="offer-card"
      onClick={() => onDeal(offer)}
      style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
    >
      <div className="card-img-wrap">
        {offer.meta?.imageUrl ? (
          <img
            src={offer.meta.imageUrl}
            alt={offer.title}
            className="card-img"
            onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x400/003580/ffffff?text=Buyoffer'; }}
          />
        ) : (
          <div className={`card-img-placeholder ${offer.category}`}>
            <Icon size={42} />
          </div>
        )}
        {hasDiscount && <span className="discount-flag">{offer.pricing.discountPercent}% off</span>}
      </div>

      <div className="card-body">
        <div className="card-chip-row">
          <span className="category-chip">
            <Icon size={14} />
            {cat.label}
          </span>
          <button
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleSave}
            title={isSaved ? 'Saved' : 'Save Deal'}
            type="button"
            aria-label={isSaved ? 'Saved deal' : 'Save deal'}
          >
            <Heart size={17} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <p className="card-brand">{offer.brand?.name || 'Buyoffer partner'}</p>
        <h3 className="card-title">{offer.title}</h3>
        <p className="card-location"><MapPin size={14} /> {locationText}</p>

        <div className="rating-row">
          <span className="stars" aria-label={`${rating} stars`}>
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill={i < Math.round(rating) ? 'currentColor' : 'none'} />)}
          </span>
          <span className="review-score">{reviewScore} Excellent</span>
        </div>

        {offer.description && <p className="card-desc">{offer.description}</p>}

        <div className="benefit-list">
          <span className="benefit"><CheckCircle size={14} /> Free delivery / cancellation</span>
          {(isExpiringSoon || hasDiscount) && <span className="urgency"><Flame size={14} /> Only a few left</span>}
          {offer.distance !== undefined && (
            <span className="benefit"><MapPin size={14} /> {offer.distance < 1 ? `${Math.round(offer.distance * 1000)}m` : `${offer.distance.toFixed(1)}km`} away</span>
          )}
        </div>

        {offer.meta?.couponCode && (
          <div className="coupon-row" onClick={(e) => e.stopPropagation()}>
            <span className="coupon-label"><Tag size={14} /> Code</span>
            <span className="coupon-code">{offer.meta.couponCode}</span>
            <button className="coupon-copy" onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(offer.meta.couponCode); }} type="button">Copy</button>
          </div>
        )}

        <div className="card-footer">
          <div className="price-row">
            <div className="price-block">
              {offer.pricing?.discountedPrice > 0 ? (
                <>
                  <span className="price-current">₹{offer.pricing.discountedPrice.toLocaleString('en-IN')}</span>
                  {offer.pricing.originalPrice > offer.pricing.discountedPrice && (
                    <span className="price-original">₹{offer.pricing.originalPrice.toLocaleString('en-IN')}</span>
                  )}
                  {hasDiscount && <span className="price-discount-percent">Save {offer.pricing.discountPercent}%</span>}
                </>
              ) : (
                <span className="price-current">{hasDiscount ? `${offer.pricing.discountPercent}% off` : 'Special offer'}</span>
              )}
            </div>
            <span className="card-source">via {offer.source}</span>
          </div>
          <button className="deal-btn" onClick={(e) => { e.stopPropagation(); onDeal(offer); }} type="button">
            See Deal
          </button>
        </div>
      </div>
    </article>
  );
}
