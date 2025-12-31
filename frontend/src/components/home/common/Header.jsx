import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import '../styles/Header.css';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageDropdown, setLanguageDropdown] = useState(false);

  const { language, changeLanguage, t } = useLanguage();

  // Initialize dark mode from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Apply saved theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    const theme = newMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setLanguageDropdown(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when clicking a nav link
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <a href="/" className="logo">
          <span className="logo-text">Tourism MS</span>
        </a>

        <nav className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <a href="#home" onClick={closeMobileMenu}>{t('nav_home')}</a>
          <a href="#destinations" onClick={closeMobileMenu}>{t('nav_discover')}</a>
          <a href="#about" onClick={closeMobileMenu}>{t('nav_about')}</a>
          <a href="#feature" onClick={closeMobileMenu}>{t('nav_feature')}</a>
          <a href="#contact" onClick={closeMobileMenu}>{t('nav_contact')}</a>
          <Link to="/login" className="mobile-signin" onClick={closeMobileMenu}>{t('nav_signin')}</Link>
        </nav>

        <div className="header-actions">
          {/* Language Selector */}
          <div className="language-selector">
            <button
              className="language-toggle"
              onClick={() => setLanguageDropdown(!languageDropdown)}
              aria-label="Change language"
            >
              {language === 'en' ? 'EN' : 'አማ'}
              <span className="language-arrow">▼</span>
            </button>
            {languageDropdown && (
              <div className="language-dropdown">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={language === 'en' ? 'active' : ''}
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => handleLanguageChange('am')}
                  className={language === 'am' ? 'active' : ''}
                >
                  🇪🇹 አማርኛ
                </button>
              </div>
            )}
          </div>

          <button className="theme-toggle" onClick={toggleDarkMode} aria-label="Toggle theme">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <Link to="/login" className="btn-signin">{t('nav_signin')}</Link>

          {/* Mobile Menu Toggle Button */}
          <button
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header >
  );
}

export default Header;
