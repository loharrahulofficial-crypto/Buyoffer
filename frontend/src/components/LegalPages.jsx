import React from 'react';

export function PrivacyPolicy({ onClose }) {
  return (
    <main className="main legal-page" onClick={onClose}>
      <div className="legal-content" onClick={(e) => e.stopPropagation()}>
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <section>
          <h2>1. Information We Collect</h2>
          <p>We do not collect any personal information unless you explicitly provide it (e.g., when creating an account). We may collect non-personal information such as browser type, location, and usage data to improve our services.</p>
        </section>
        <section>
          <h2>2. How We Use Your Information</h2>
          <p>The information we collect is used to personalize your experience, show relevant deals in your area, and improve the functionality of Buyoffer.</p>
        </section>
        <section>
          <h2>3. Cookies and Tracking</h2>
          <p>We use cookies to enhance your browsing experience, save your preferences, and track affiliate link clicks to support the platform.</p>
        </section>
        <section>
          <h2>4. Third-Party Links</h2>
          <p>Our website contains links to external sites (affiliates and merchants). We are not responsible for the privacy practices or content of these third-party websites.</p>
        </section>
      </div>
    </main>
  );
}

export function AffiliateDisclosure({ onClose }) {
  return (
    <main className="main legal-page" onClick={onClose}>
      <div className="legal-content" onClick={(e) => e.stopPropagation()}>
        <h1>Affiliate Disclosure</h1>
        <section>
          <h2>Transparency is our priority</h2>
          <p>Buyoffer is a deal aggregator dedicated to finding you the best offers and discounts. To keep our platform free for users, we participate in various affiliate marketing programs.</p>
        </section>
        <section>
          <h2>What does this mean?</h2>
          <p>When you click on links to various merchants on our site and make a purchase, this can result in this site earning a commission. This comes at <strong>absolutely zero extra cost to you</strong>.</p>
        </section>
        <section>
          <h2>Our Promise</h2>
          <p>We only list deals that we believe bring genuine value to our users. The presence of an affiliate link does not influence the deals we choose to display.</p>
        </section>
      </div>
    </main>
  );
}

export function AboutUs({ onClose }) {
  return (
    <main className="main legal-page" onClick={onClose}>
      <div className="legal-content" onClick={(e) => e.stopPropagation()}>
        <h1>About Buyoffer</h1>
        <section>
          <h2>Our Mission</h2>
          <p>At Buyoffer, we hunt for the best deals so you don't have to. We aggregate discounts, offers, and sales across multiple categories including Food, Travel, Shopping, and more.</p>
        </section>
        <section>
          <h2>How It Works</h2>
          <p>We constantly scan our partner networks and merchants to bring you the latest verified deals. You can search by location, category, or specific brands to find exactly what you're looking for.</p>
        </section>
        <section>
          <h2>Contact Us</h2>
          <p>Have questions, feedback, or found a bug? We'd love to hear from you. Reach out to our support team.</p>
        </section>
      </div>
    </main>
  );
}
