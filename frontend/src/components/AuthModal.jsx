import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function AuthModal({ isOpen, onClose, prompt }) {
  const { user, login, logout } = useAuth();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);

  if (!isOpen) return null;

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    // Email/password logic placeholder
    console.log(tab, form);
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>

        {/* ── Left Panel ── */}
        <div className="auth-left">
          <div className="auth-left-inner">
            <div className="auth-brand">
              <span className="auth-brand-b">Buy</span>
              <span className="auth-brand-o">offer</span>
              <span className="auth-brand-dot">.com</span>
            </div>
            <h2 className="auth-left-title">
              {tab === 'login' ? 'Welcome back.' : 'Join thousands\nof smart shoppers.'}
            </h2>
            <p className="auth-left-sub">
              {tab === 'login'
                ? 'Access your saved deals, price alerts and personalised recommendations.'
                : 'Create a free account and start saving on every purchase across 50+ platforms.'}
            </p>
            <div className="auth-feature-list">
              <div className="auth-feature">
                <span className="auth-feature-dot" />
                Save deals across all categories
              </div>
              <div className="auth-feature">
                <span className="auth-feature-dot" />
                Get notified on price drops
              </div>
              <div className="auth-feature">
                <span className="auth-feature-dot" />
                Personalised deal recommendations
              </div>
            </div>
          </div>
          <div className="auth-left-orb" />
          <div className="auth-left-orb2" />
        </div>

        {/* ── Right Panel ── */}
        <div className="auth-right">
          <button className="auth-close-btn" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {user ? (
            /* ── Logged-in View ── */
            /* ── Logged-in Dashboard View ── */
            <div className="auth-dashboard">
              <div className="auth-dash-cover"></div>
              <div className="auth-dash-header">
                <div className="auth-avatar-wrapper">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="auth-dash-avatar" 
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=d435e6&color=fff&size=128` }}
                  />
                  <button className="auth-avatar-edit" aria-label="Change Avatar">📷</button>
                </div>
                <div className="auth-dash-info">
                  <h3 className="auth-dash-name">{user.name}</h3>
                  <p className="auth-dash-email">{user.email}</p>
                </div>
              </div>

              <div className="auth-dash-stats">
                <div className="auth-stat">
                  <span className="auth-stat-val">{user.savedDeals?.length || 0}</span>
                  <span className="auth-stat-lbl">Saved Deals</span>
                </div>
                <div className="auth-stat">
                  <span className="auth-stat-val">Active</span>
                  <span className="auth-stat-lbl">Subscription</span>
                </div>
              </div>

              <div className="auth-dash-actions">
                <button className="auth-edit-btn" onClick={() => alert('Profile settings coming soon!')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit Profile
                </button>
                <button className="auth-signout-btn" onClick={() => { logout(); onClose(); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ── Prompt Banner ── */}
              {prompt && (
                <div className="auth-prompt-banner" style={{
                  background: 'rgba(212, 53, 230, 0.1)',
                  border: '1px solid rgba(212, 53, 230, 0.3)',
                  color: '#d435e6',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>🔒</span>
                  <span>{prompt}</span>
                </div>
              )}

              {/* ── Tabs ── */}
              <div className="auth-tabs">
                <button
                  className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
                  onClick={() => setTab('login')}
                >
                  Sign In
                </button>
                <button
                  className={`auth-tab-btn ${tab === 'signup' ? 'active' : ''}`}
                  onClick={() => setTab('signup')}
                >
                  Create Account
                </button>
              </div>

              {/* ── Google Button ── */}
              <button className="auth-google-btn" onClick={login}>
                <svg viewBox="0 0 24 24" width="18" height="18" className="auth-google-icon">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84-.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              {/* ── Divider ── */}
              <div className="auth-or">
                <span className="auth-or-line" />
                <span className="auth-or-text">or</span>
                <span className="auth-or-line" />
              </div>

              {/* ── Form ── */}
              <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
                {tab === 'signup' && (
                  <div className="auth-field">
                    <label className="auth-label">Full Name</label>
                    <input
                      className="auth-input"
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      required
                      autoFocus
                    />
                  </div>
                )}

                <div className="auth-field">
                  <label className="auth-label">Email Address</label>
                  <input
                    className="auth-input"
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoFocus={tab === 'login'}
                  />
                </div>

                <div className="auth-field">
                  <div className="auth-label-row">
                    <label className="auth-label">Password</label>
                    {tab === 'login' && (
                      <button type="button" className="auth-forgot">Forgot password?</button>
                    )}
                  </div>
                  <div className="auth-input-wrap">
                    <input
                      className="auth-input"
                      type={showPass ? 'text' : 'password'}
                      name="password"
                      placeholder="Min. 8 characters"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="auth-eye"
                      onClick={() => setShowPass(v => !v)}
                      aria-label="Toggle password"
                    >
                      {showPass ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {tab === 'signup' && (
                  <div className="auth-field">
                    <label className="auth-label">Confirm Password</label>
                    <input
                      className="auth-input"
                      type="password"
                      name="confirm"
                      placeholder="Re-enter your password"
                      value={form.confirm}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <button type="submit" className="auth-submit">
                  {tab === 'login' ? 'Sign In' : 'Create Account'}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </form>

              {/* ── Footer Link ── */}
              <p className="auth-switch">
                {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => setTab(t => t === 'login' ? 'signup' : 'login')}
                >
                  {tab === 'login' ? 'Create one' : 'Sign in'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
