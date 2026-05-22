import { useState } from 'react';
import { User, Heart, Settings, LogOut, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const NAV_ITEMS = [
  { id: 'profile',  label: 'Profile',     icon: User     },
  { id: 'saved',    label: 'Saved Deals', icon: Heart    },
  { id: 'settings', label: 'Settings',    icon: Settings },
];

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}
function formatJoinDate(dateStr) {
  if (!dateStr) return 'Recently';
  return new Date(dateStr).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

/* ─── Profile Tab ──────────────────────────────────────────────── */
function ProfileTab({ user }) {
  return (
    <div className="pd-profile-tab">
      {/* Cover — 140px, full-width, no clip */}
      <div className="pd-cover">
        <div className="pd-cover-inner" />
        <div className="pd-cover-avatar-wrap">
          <div className="pd-profile-avatar-lg">
            {user.avatar
              ? <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer"
                  onError={e => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
              : null}
            <span className="pd-initials-lg" style={user.avatar ? { display: 'none' } : {}}>
              {getInitials(user.name)}
            </span>
          </div>
        </div>
      </div>

      <div className="pd-profile-body">
        {/* Name/email — pushed below the hanging avatar */}
        <div className="pd-profile-namebox">
          <h2 className="pd-profile-name">{user.name}</h2>
          <p className="pd-profile-email">{user.email}</p>
        </div>

        {/* Stats row — bordered dividers */}
        <div className="pd-stats-row">
          <div className="pd-stat-item">
            <Heart size={14} className="pd-stat-icon" />
            <span className="pd-stat-val">{user.savedDeals?.length || 0}</span>
            <span className="pd-stat-lbl">Saved Deals</span>
          </div>
          <div className="pd-stat-divider" />
          <div className="pd-stat-item">
            <User size={14} className="pd-stat-icon" />
            <span className="pd-stat-lbl">Member since</span>
            <span className="pd-stat-val">{formatJoinDate(user.createdAt)}</span>
          </div>
          <div className="pd-stat-divider" />
          <div className="pd-active-badge">
            <CheckCircle size={12} /> Active
          </div>
        </div>

        {/* Info table */}
        <div className="pd-info-section">
          <div className="pd-info-row">
            <label className="pd-info-label">Display Name</label>
            <div className="pd-info-val">{user.name}</div>
          </div>
          <div className="pd-info-row">
            <label className="pd-info-label">Email</label>
            <div className="pd-info-val">{user.email}</div>
          </div>
          <div className="pd-info-row">
            <label className="pd-info-label">Auth Provider</label>
            <div className="pd-info-val pd-google-badge">
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </div>
          </div>
        </div>

        {/* Fix #4: filled indigo button */}
        <button className="pd-edit-btn" onClick={() => alert('Profile editing coming soon!')}>
          Edit Profile
        </button>
      </div>
    </div>
  );
}

/* ─── Saved Deals Tab ──────────────────────────────────────────── */
function SavedDealsTab({ user, onBrowse }) {
  const deals = user.savedDeals || [];
  if (deals.length === 0) {
    return (
      <div className="pd-empty-state">
        <div className="pd-empty-icon"><Heart size={40} /></div>
        <h3 className="pd-empty-title">No saved deals yet</h3>
        <p className="pd-empty-sub">Start saving deals you love and they'll appear here.</p>
        <button className="pd-browse-btn" onClick={onBrowse}>Browse Deals →</button>
      </div>
    );
  }
  return (
    <div className="pd-saved-grid">
      {deals.map((deal, i) => (
        <div key={i} className="pd-deal-card">
          <div className="pd-deal-brand">{typeof deal === 'string' ? deal : deal.brand?.name || 'Deal'}</div>
          <p className="pd-deal-title">{typeof deal === 'string' ? `Deal #${i + 1}` : deal.title}</p>
          <span className="pd-deal-badge">{typeof deal === 'object' && deal.pricing?.discountPercent ? `${deal.pricing.discountPercent}% OFF` : 'Saved'}</span>
          <button className="pd-view-deal-btn">View Deal →</button>
        </div>
      ))}
    </div>
  );
}



/* ─── Settings Tab ─────────────────────────────────────────────── */
function SettingsTab({ user }) {
  const [dealAlerts, setDealAlerts]     = useState(true);
  const [emailNotif, setEmailNotif]     = useState(false);

  return (
    <div className="pd-settings-tab">
      {/* Fix #7: Two toggles */}
      <div className="pd-settings-section">
        <h4 className="pd-settings-heading">Notifications</h4>
        <div className="pd-toggle-row">
          <div>
            <div className="pd-toggle-label">Deal Alerts</div>
            <div className="pd-toggle-sub">Get notified when new deals match your interests</div>
          </div>
          <button className={`pd-toggle ${dealAlerts ? 'on' : ''}`} onClick={() => setDealAlerts(v => !v)}>
            <span className="pd-toggle-knob" />
          </button>
        </div>
        <div className="pd-toggle-row">
          <div>
            <div className="pd-toggle-label">Email Notifications</div>
            <div className="pd-toggle-sub">Weekly curated deals sent to {user.email}</div>
          </div>
          <button className={`pd-toggle ${emailNotif ? 'on' : ''}`} onClick={() => setEmailNotif(v => !v)}>
            <span className="pd-toggle-knob" />
          </button>
        </div>
      </div>

      <div className="pd-settings-section">
        <h4 className="pd-settings-heading">Account</h4>
        <div className="pd-settings-item">
          <span>Email</span><span className="pd-settings-val">{user.email}</span>
        </div>
        <div className="pd-settings-item">
          <span>Account Type</span><span className="pd-settings-val">Google</span>
        </div>
      </div>

      <div className="pd-danger-zone">
        <h4 className="pd-settings-heading danger">Danger Zone</h4>
        <button className="pd-delete-btn" onClick={() => alert('Account deletion coming soon!')}>
          Delete Account
        </button>
      </div>
    </div>
  );
}

/* ─── Sign Out Confirmation ────────────────────────────────────── */
function SignOutConfirm({ onConfirm, onCancel }) {
  return (
    <div className="pd-signout-confirm">
      <LogOut size={32} className="pd-signout-icon" />
      <h3 className="pd-signout-title">Sign Out?</h3>
      <p className="pd-signout-sub">You'll need to sign in again to access your saved deals.</p>
      <div className="pd-signout-actions">
        <button className="pd-signout-yes" onClick={onConfirm}>Yes, Sign Out</button>
        <button className="pd-signout-cancel" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────── */
export default function ProfileDashboard({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab]         = useState('profile');
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  if (!isOpen || !user) return null;

  const handleLogout = () => { logout(); onClose(); };

  const renderContent = () => {
    if (confirmSignOut) {
      return <SignOutConfirm onConfirm={handleLogout} onCancel={() => setConfirmSignOut(false)} />;
    }
    switch (activeTab) {
      case 'profile':  return <ProfileTab user={user} />;
      case 'saved':    return <SavedDealsTab user={user} onBrowse={onClose} />;
      case 'settings': return <SettingsTab user={user} />;
      default: return null;
    }
  };

  return (
    <div className="pd-overlay" onClick={onClose}>
      <div className="pd-modal" onClick={e => e.stopPropagation()}>

        {/* ── Sidebar ── */}
        <aside className="pd-sidebar">
          <div className="pd-sidebar-user">
            <div className="pd-sidebar-avatar">
              {user.avatar
                ? <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer"
                    onError={e => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                : null}
              <span className="pd-initials" style={user.avatar ? { display: 'none' } : {}}>
                {getInitials(user.name)}
              </span>
            </div>
            <div className="pd-sidebar-info">
              <div className="pd-sidebar-name">{user.name}</div>
              <div className="pd-sidebar-email">{user.email}</div>
            </div>
          </div>

          <nav className="pd-nav">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`pd-nav-item ${activeTab === item.id && !confirmSignOut ? 'active' : ''}`}
                  onClick={() => { setConfirmSignOut(false); setActiveTab(item.id); }}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pd-nav-divider" />
            {/* Fix #8: confirmation before sign out */}
            <button className="pd-nav-item logout" onClick={() => setConfirmSignOut(true)}>
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* ── Right Content ── */}
        <div className="pd-content">
          <button className="pd-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
          <div className="pd-tab-content" key={confirmSignOut ? 'signout' : activeTab}>
            {renderContent()}
          </div>
        </div>

      </div>
    </div>
  );
}
