import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import ConsentModal from './components/ConsentModal';
import AuthModal from './components/AuthModal';
import ProfileDashboard from './components/ProfileDashboard';
import { useAuth } from './hooks/useAuth';
import { Sun, Moon } from 'lucide-react';
import { PrivacyPolicy, AffiliateDisclosure, AboutUs } from './components/LegalPages';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const CATEGORIES = [
  { id: 'all', label: 'All Deals', icon: '✨', color: '#00d7ff' },
  { id: 'home', label: 'Home', icon: '🏠', color: '#d435e6' },
  { id: 'traveling', label: 'Traveling', icon: '✈️', color: '#e6195e' },
  { id: 'food', label: 'Food point', icon: '🍜', color: '#279c50' },
  { id: 'grocery', label: 'Grocery', icon: '🛒', color: '#f58020' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#7a3ccb' },
];

const SORT_OPTIONS = [
  { value: 'discount', label: 'Best Discount' },
  { value: 'price_low', label: 'Price: Low → High' },
  { value: 'price_high', label: 'Price: High → Low' },
  { value: 'newest', label: 'Newest First' },
];


export default function App() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchCtx, setSearchCtx] = useState('');

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('discount');
  const [priceMax, setPriceMax] = useState('');

  // Location state
  const [locations, setLocations] = useState({ states: [] });
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedArea] = useState('');
  const [areaInput, setAreaInput] = useState('');


  // UI
  const [showFilters, setShowFilters] = useState(false);
  const [searched, setSearched] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authPrompt, setAuthPrompt] = useState('');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { user, login, logout, saveDeal } = useAuth();

  useEffect(() => {
    const onPopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  const debounceRef = useRef(null);

  // Sync theme to root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load locations on mount
  useEffect(() => {
    fetch(`${API}/api/locations`)
      .then(r => r.json())
      .then(setLocations)
      .catch(() => {});
  }, []);

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

      const res = await fetch(`${API}/api/offers/search?${p}`);
      const data = await res.json();
      let results = data.offers || [];

      // Client-side sort
      results = sortOffers(results, sortBy);
      if (priceMax) results = results.filter(o => (o.pricing?.discountedPrice || 0) <= Number(priceMax));

      setOffers(results);
      setSearchCtx(data.searchContext || '');
    } catch {
      setError('Search failed. Check your API key and try again.');
    } finally {
      setLoading(false);
    }
  }, [query, activeCategory, selectedState, selectedCity, areaInput, sortBy, priceMax]);

  function sortOffers(list, by) {
    return [...list].sort((a, b) => {
      if (by === 'discount') return (b.pricing?.discountPercent || 0) - (a.pricing?.discountPercent || 0);
      if (by === 'price_low') return (a.pricing?.discountedPrice || 0) - (b.pricing?.discountedPrice || 0);
      if (by === 'price_high') return (b.pricing?.discountedPrice || 0) - (a.pricing?.discountedPrice || 0);
      return 0;
    });
  }

  // Load all deals on mount
  useEffect(() => {
    fetchOffers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-search when category/location changes
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
      setAuthPrompt('Please sign in or create an account to unlock this deal!');
      setAuthModalOpen(true);
      return;
    }
    let finalLink = offer.affiliate?.link;

    try {
      const res = await fetch(`${API}/api/clicks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId: offer.id, category: offer.category, affiliateLink: offer.affiliate?.link })
      });
      const data = await res.json();
      if (data.redirect) {
        finalLink = data.redirect;
      }
    } catch (err) {
      console.error("Failed to track click or check redirect:", err);
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

  return (
    <div className="app">
      <ConsentModal />
      {/* Show ProfileDashboard for logged-in users, AuthModal for login flow */}
      {user
        ? <ProfileDashboard isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        : <AuthModal isOpen={authModalOpen} onClose={() => { setAuthModalOpen(false); setAuthPrompt(''); }} prompt={authPrompt} />
      }
      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="nav-inner">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="logo-text" style={{ letterSpacing: '-0.5px' }}>
              <span style={{ color: '#5d2588' }}>Buy</span><span style={{ color: '#d435e6' }}>offer</span> <small style={{ fontSize: '12px', opacity: 0.5 }}>v2.1</small>
            </span>
          </div>
          <div className="nav-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button className="theme-toggle" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
              <span className="theme-icon icon-sun"><Sun size={18} /></span>
              <span className="theme-icon icon-moon"><Moon size={18} /></span>
            </button>
            <button className="btn-ghost" onClick={() => setShowFilters(v => !v)}>
              {showFilters ? '✕ Close' : '⚙ Filters'}
            </button>
            {user ? (
              <div className="nav-user" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  width="32" 
                  height="32" 
                  style={{ borderRadius: '50%', border: '2px solid #d435e6', objectFit: 'cover', cursor: 'pointer' }} 
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=d435e6&color=fff` }}
                  onClick={() => setAuthModalOpen(true)} 
                />
                <span className="nav-username" style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: '12px' }} onClick={logout}>Logout</button>
              </div>
            ) : (
              <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setAuthModalOpen(true)}>
                <svg viewBox="0 0 24 24" width="14" height="14" style={{ flexShrink: 0 }}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#fff"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff"/>
                </svg>
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {currentPath === '/' && (
        <>
          {/* ── HERO ── */}
          <header className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb1" />
          <div className="hero-orb orb2" />
          <div className="hero-orb orb3" />
          <div className="hero-grid" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">Live Deals & Discounts</div>

          {/* ── SEARCH BAR ── */}
          <form className="search-form" onSubmit={e => { e.preventDefault(); handleSearch(); }}>
            <div className="search-box">
              <span className="search-icon">⌕</span>
              <input
                className="search-input"
                type="text"
                placeholder="Search any deal — food, hotels, grocery, shopping..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoComplete="off"
              />
              {query && <button type="button" className="search-clear" onClick={() => setQuery('')}>✕</button>}
              <button type="submit" className="search-btn" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Search →'}
              </button>
            </div>
          </form>


          {/* ── CATEGORY BAR ── */}
          <div className="hero-cat-bar">
            <div className="cat-inner">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`cat-pill ${activeCategory === cat.id ? 'active' : ''}`}
                  style={{ '--cat-color': cat.color }}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>



      {/* ── FILTER PANEL ── */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-inner">
            <div className="filter-group">
              <label className="filter-label">📍 State</label>
              <select className="filter-select" value={selectedState} onChange={e => { setSelectedState(e.target.value); setSelectedCity(''); }}>
                <option value="">All India</option>
                {locations.states?.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">🏙️ City</label>
              <input 
                className="filter-input" 
                list="city-list" 
                placeholder={selectedState ? "Search city..." : "Select State First"} 
                value={selectedCity} 
                onChange={e => { setSelectedCity(e.target.value); setAreaInput(''); }} 
                disabled={!selectedState} 
                autoComplete="off"
              />
              <datalist id="city-list">
                {availableCities.map(c => <option key={c.name} value={c.name} />)}
              </datalist>
            </div>
            <div className="filter-group">
              <label className="filter-label">🗺️ Area / Locality</label>
              <input 
                className="filter-input" 
                list="area-list"
                placeholder={selectedCity ? "Search area..." : "e.g. Bandra..."} 
                value={areaInput} 
                onChange={e => setAreaInput(e.target.value)} 
                autoComplete="off"
              />
              <datalist id="area-list">
                {availableAreas.map(a => <option key={a} value={a} />)}
              </datalist>
            </div>
            <div className="filter-group">
              <label className="filter-label">💰 Max Price (₹)</label>
              <input className="filter-input" type="number" placeholder="e.g. 5000" value={priceMax} onChange={e => setPriceMax(e.target.value)} />
            </div>
            <div className="filter-group">
              <label className="filter-label">✨ Sort By</label>
              <select className="filter-select" value={sortBy} onChange={e => { setSortBy(e.target.value); setOffers(o => sortOffers(o, e.target.value)); }}>
                {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <button className="btn-apply" onClick={() => { fetchOffers(); setShowFilters(false); }}>Apply Filters →</button>
            <button className="btn-reset" onClick={() => { setSelectedState(''); setSelectedCity(''); setAreaInput(''); setPriceMax(''); setSortBy('discount'); }}>Reset</button>
          </div>
        </div>
      )}

      {/* ── RESULTS AREA ── */}
      <main className="main">
        {/* Results header */}
        {searched && !loading && (
          <div className="results-header">
            <div className="results-meta">
              {offers.length > 0
                ? <><span className="results-count">{offers.length}</span> deals found {searchCtx && <span className="results-ctx">— {searchCtx}</span>}</>
                : 'No deals found'
              }
            </div>
            {selectedState && <div className="loc-tag">📍 {[selectedArea || areaInput, selectedCity, selectedState].filter(Boolean).join(', ')}</div>}
          </div>
        )}

        {/* Loading skeletons */}
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

        {/* Error */}
        {error && <div className="error-state"><span>⚠</span> {error}</div>}

        {/* Offers grid */}
        {!loading && offers.length > 0 && (
          <div className="offers-grid">
            {offers.map((offer, i) => (
              <OfferCard key={offer.id || i} offer={offer} onDeal={handleGetDeal} index={i} user={user} onSave={saveDeal} onLogin={login} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && searched && offers.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-icon">◎</div>
            <h3>No deals found</h3>
            <p>Try a different search term or broaden your location filter</p>
            <button className="btn-primary" onClick={() => { setActiveCategory('all'); setSelectedState(''); setSelectedCity(''); setAreaInput(''); fetchOffers({ category: 'all' }); }}>
              Clear Filters
            </button>
          </div>
        )}

      </main>
      </>
      )}

      {currentPath === '/privacy' && <PrivacyPolicy onClose={() => navigate('/')} />}
      {currentPath === '/disclosure' && <AffiliateDisclosure onClose={() => navigate('/')} />}
      {currentPath === '/about' && <AboutUs onClose={() => navigate('/')} />}

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <p className="footer-logo">Buyoffer</p>
          <p className="footer-disc"> We hunt the best deals so you don't have to. Buying through our links might earn us a small high-five (commission) to keep the site running—at absolute zero extra cost to you. Happy savings! </p>
          <div className="footer-links">
            <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}>Privacy Policy</a>
            <a href="/disclosure" onClick={(e) => { e.preventDefault(); navigate('/disclosure'); }}>Affiliate Disclosure</a>
            <a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>About</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── OFFER CARD COMPONENT ───────────────────────────────────────────────────
export function OfferCard({ offer, onDeal, index, user, onSave, onLogin }) {
  const cat = CATEGORIES.find(c => c.id === offer.category) || CATEGORIES[0];
  const hasDiscount = offer.pricing?.discountPercent > 0;
  const isSaved = user?.savedDeals?.some(d => (d._id || d) === offer.id);

  const handleSave = (e) => {
    e.stopPropagation();
    if (!user) { onLogin(); return; }
    onSave(offer.id);
  };
  const isExpiringSoon = offer.validity?.endDate && (new Date(offer.validity.endDate) - Date.now()) < 3 * 24 * 60 * 60 * 1000;

  return (
    <div 
      className="offer-card" 
      onClick={() => onDeal(offer)}
      style={{ 
        animationDelay: `${Math.min(index * 40, 400)}ms`, 
        '--cat-color': cat.color,
        cursor: 'pointer'
      }}
    >
      {/* Image */}
      <div className="card-img-wrap">
        {offer.meta?.imageUrl ? (
          <img
            src={offer.meta.imageUrl}
            alt={offer.title}
            className="card-img"
            onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x400/1a1a2e/ffffff?text=Deal'; }}
          />
        ) : (
          <div className="card-img-placeholder">{cat.icon}</div>
        )}
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="card-top-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="card-brand">{offer.brand?.name}</span>
          <span className="inline-cat-badge" style={{ background: `${cat.color}15`, color: cat.color, fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
            {cat.icon} {cat.label}
          </span>
        </div>

        <h3 className="card-title" style={{ marginTop: '6px' }}>{offer.title}</h3>
        {offer.description && <p className="card-desc">{offer.description}</p>}

        {/* Meta row */}
        <div className="card-meta-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
          {offer.meta?.rating && <span className="meta-badge rating">⭐ {offer.meta.rating}</span>}
          {offer.meta?.openNow !== null && offer.meta?.openNow !== undefined && (
            <span className={`meta-badge ${offer.meta.openNow ? 'open' : 'closed'}`}>
              {offer.meta.openNow ? '● Live' : '○ Closed'}
            </span>
          )}
          {offer.distance !== undefined && (
            <span className="meta-badge distance">📍 {offer.distance < 1 ? `${Math.round(offer.distance * 1000)}m` : `${offer.distance.toFixed(1)}km`}</span>
          )}
          {offer.location?.type && offer.location.type !== 'online' && (
            <span className="meta-badge type" style={{ background: 'var(--bg-glass)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              {offer.location.type === 'both' ? 'Online+Offline' : offer.location.type}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="price-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
          {offer.pricing?.discountedPrice > 0 ? (
            <>
              {offer.pricing.originalPrice > offer.pricing.discountedPrice && (
                <span className="price-original">₹{offer.pricing.originalPrice.toLocaleString('en-IN')}</span>
              )}
              <span className="price-current">₹{offer.pricing.discountedPrice.toLocaleString('en-IN')}</span>
              {hasDiscount && (
                <span className="price-discount-percent" style={{ color: '#ff416c', fontWeight: 700, fontSize: '13px' }}>
                  ({offer.pricing.discountPercent}% OFF)
                </span>
              )}
            </>
          ) : (
            hasDiscount && (
              <span className="price-current" style={{ color: '#ff416c' }}>
                {offer.pricing.discountPercent}% OFF
              </span>
            )
          )}
        </div>

        {/* Coupon code */}
        {offer.meta?.couponCode && (
          <div className="coupon-row" onClick={(e) => e.stopPropagation()} style={{ marginTop: '6px' }}>
            <span className="coupon-label">Code:</span>
            <span className="coupon-code">{offer.meta.couponCode}</span>
            <button className="coupon-copy" onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(offer.meta.couponCode); }}>Copy</button>
          </div>
        )}

        {/* Location */}
        {offer.location?.cities?.length > 0 && (
          <div className="card-location" style={{ marginTop: '4px' }}>📌 {offer.location.cities.slice(0, 2).join(', ')}</div>
        )}

        {/* Expiry */}
        {isExpiringSoon && <div className="expiry-warn" style={{ marginTop: '4px' }}>⏳ Expires soon!</div>}

        {/* Source and Save Button */}
        <div className="card-bottom-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
          <div className="card-source">via {offer.source}</div>
          <button 
            className={`save-btn ${isSaved ? 'saved' : ''}`} 
            onClick={handleSave} 
            title={isSaved ? 'Saved' : 'Save Deal'}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '4px',
              transition: 'transform 0.2s ease',
            }}
          >
            {isSaved ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  );
}
