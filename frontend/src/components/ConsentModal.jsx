import { useState, useEffect } from 'react';

const PRIVACY_POLICY = `
  <h3>Privacy Policy</h3>
  <p>Last updated: May 14, 2026</p>
  <p>Welcome to Buyoffer.com. We respect your privacy and are committed to protecting your personal data.</p>
  <p><strong>1. Information We Collect:</strong> We collect information you provide directly to us, such as when you search for deals or interact with our platform.</p>
  <p><strong>2. How We Use Your Information:</strong> We use the information we collect to provide, maintain, and improve our services, and to develop new ones.</p>
  <p><strong>3. Cookies:</strong> We use cookies and similar tracking technologies to track the activity on our service and hold certain information.</p>
  <p><strong>4. Third-Party Links:</strong> Our service contains links to third-party websites (like Amazon, Flipkart, etc.). We are not responsible for their privacy practices.</p>
`;

const TERMS_CONDITIONS = `
  <h3>Terms & Conditions</h3>
  <p>Last updated: May 14, 2026</p>
  <p>By accessing Buyoffer.com, you agree to be bound by these Terms and Conditions.</p>
  <p><strong>1. Use of Service:</strong> You agree to use the service only for lawful purposes and in a way that does not infringe the rights of others.</p>
  <p><strong>2. Affiliate Disclosure:</strong> Buyoffer.com is a deal aggregator. We may earn a commission when you click on links and make a purchase. This does not affect the price you pay.</p>
  <p><strong>3. Accuracy of Information:</strong> While we strive to provide accurate deal information, we do not warrant that deal descriptions or other content are accurate, complete, or error-free.</p>
  <p><strong>4. Limitation of Liability:</strong> Buyoffer.com shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.</p>
`;

export default function ConsentModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('privacy');
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('buyoffer_consent');
    if (!consent) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleAccept = () => {
    if (isAccepted) {
      localStorage.setItem('buyoffer_consent', 'true');
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Welcome to Buyoffer.com</h2>
          <p className="modal-subtitle">Please review and accept our policies to continue.</p>
        </div>

        <div className="modal-tabs">
          <button 
            className={`modal-tab ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy Policy
          </button>
          <button 
            className={`modal-tab ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            Terms & Conditions
          </button>
        </div>

        <div className="modal-body" dangerouslySetInnerHTML={{ __html: activeTab === 'privacy' ? PRIVACY_POLICY : TERMS_CONDITIONS }} />

        <div className="modal-footer">
          <label className="modal-checkbox-label">
            <input 
              type="checkbox" 
              checked={isAccepted}
              onChange={(e) => setIsAccepted(e.target.checked)}
              className="modal-checkbox"
            />
            <span className="checkbox-text">I have read and agree to the Privacy Policy and Terms & Conditions.</span>
          </label>
          
          <button 
            className={`modal-accept-btn ${!isAccepted ? 'disabled' : ''}`}
            onClick={handleAccept}
            disabled={!isAccepted}
          >
            Accept and Continue
          </button>
        </div>
      </div>
    </div>
  );
}
