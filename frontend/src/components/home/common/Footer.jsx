import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import '../styles/components/Footer.css';

function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with: ${email}`);
      setEmail('');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-container">
          {/* Left Column - Brand & Social */}
          <div className="footer-brand">
            <div className="footer-logo">
              <h2>Tourism MS</h2>
            </div>
            <p className="footer-description">
              {t('footer_desc')}
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X">
                <i className="fab fa-x-twitter"></i>
              </a>
            </div>
          </div>

          {/* Middle Column - Newsletter */}
          <div className="footer-newsletter">
            <h3>{t('footer_newsletter_title')}</h3>
            <p>{t('footer_newsletter_desc')}</p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder={t('footer_email_ph')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">{t('footer_subscribe_btn')}</button>
            </form>
          </div>

          {/* Right Column - Image */}
          <div className="footer-image">
            <img
              src="https://media.licdn.com/dms/image/v2/C4D12AQE-m1-nr8-How/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1526892052518?e=2147483647&v=beta&t=92tghX60UuFdYT_PnK97ieedz2SLiA4cbW6SU84oemU"
              alt="Ethiopian Historical Sites"
            />
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="footer-copyright">
        <p>© {new Date().getFullYear()} {t('footer_copyright')}</p>
      </div>
    </footer>
  );
}

export default Footer;