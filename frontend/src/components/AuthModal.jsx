import { useState } from 'react';
import { X } from 'lucide-react';
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
    console.log(tab, form);
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <div className="auth-header">
          <div>
            <p className="auth-brand">Buyoffer.com</p>
            <h2>{user ? 'Your account' : tab === 'login' ? 'Sign in' : 'Create account'}</h2>
          </div>
          <button className="auth-close-btn" onClick={onClose} aria-label="Close" type="button">
            <X size={16} />
          </button>
        </div>

        <div className="auth-body">
          {user ? (
            <div className="auth-dashboard">
              <img
                src={user.avatar}
                alt={user.name}
                className="auth-dash-avatar"
                referrerPolicy="no-referrer"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=00E5FF&color=0A0F1E&size=128`; }}
              />
              <h3 className="auth-dash-name">{user.name}</h3>
              <p className="auth-dash-email">{user.email}</p>
              <div className="auth-dash-stats">
                <div className="auth-stat">
                  <span className="auth-stat-val">{user.savedDeals?.length || 0}</span>
                  <span className="auth-stat-lbl">Saved Deals</span>
                </div>
                <div className="auth-stat">
                  <span className="auth-stat-val">Active</span>
                  <span className="auth-stat-lbl">Account</span>
                </div>
              </div>
              <button className="auth-signout-btn" onClick={() => { logout(); onClose(); }} type="button">Sign Out</button>
            </div>
          ) : (
            <>
              {prompt && (
                <div className="auth-prompt-banner">
                  {prompt}
                </div>
              )}

              <div className="auth-tabs">
                <button
                  className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
                  onClick={() => setTab('login')}
                  type="button"
                >
                  Sign In
                </button>
                <button
                  className={`auth-tab-btn ${tab === 'signup' ? 'active' : ''}`}
                  onClick={() => setTab('signup')}
                  type="button"
                >
                  Register
                </button>
              </div>

              <button className="auth-google-btn" onClick={login} type="button">
                <svg viewBox="0 0 24 24" width="18" height="18" className="auth-google-icon" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84-.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div className="auth-or">
                <span className="auth-or-line" />
                <span className="auth-or-text">or</span>
                <span className="auth-or-line" />
              </div>

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
                  />
                </div>

                <div className="auth-field">
                  <div className="auth-label-row">
                    <label className="auth-label">Password</label>
                    {tab === 'login' && <button type="button" className="auth-forgot">Forgot password?</button>}
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
                    >
                      {showPass ? 'Hide' : 'Show'}
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
                </button>
              </form>

              <p className="auth-switch">
                {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => setTab(t => t === 'login' ? 'signup' : 'login')}
                >
                  {tab === 'login' ? 'Register' : 'Sign in'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
