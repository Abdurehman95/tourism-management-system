import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './visitor.css';

// Icons ... (Keep existing icons)
const DashboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="10" width="4" height="10" rx="1" fill="#e67e22" />
    <rect x="10" y="6" width="4" height="14" rx="1" fill="#3498db" />
    <rect x="16" y="14" width="4" height="6" rx="1" fill="#2ecc71" />
    <path d="M4 10L12 4L20 10" stroke="#e67e22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ExploreSitesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#3498db" />
    <path d="M2 12H22" stroke="#2ecc71" strokeWidth="2" />
    <path d="M12 2C14.5 5 15.5 8.5 15.5 12C15.5 15.5 14.5 19 12 22C9.5 19 8.5 15.5 8.5 12C8.5 8.5 9.5 5 12 2Z" fill="#2ecc71" fillOpacity="0.5" />
  </svg>
);

const MyVisitsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" fill="#e0e0e0" />
    <path d="M3 8H21" stroke="#3498db" strokeWidth="4" />
    <path d="M8 2V6" stroke="#3498db" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 2V6" stroke="#3498db" strokeWidth="2" strokeLinecap="round" />
    <circle cx="8" cy="14" r="1.5" fill="#9b59b6" />
    <circle cx="12" cy="14" r="1.5" fill="#9b59b6" />
    <circle cx="16" cy="14" r="1.5" fill="#9b59b6" />
    <circle cx="8" cy="18" r="1.5" fill="#9b59b6" />
    <circle cx="12" cy="18" r="1.5" fill="#9b59b6" />
    <circle cx="16" cy="18" r="1.5" fill="#9b59b6" />
  </svg>
);

const PaymentsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5" width="20" height="14" rx="2" fill="#3498db" />
    <rect x="2" y="9" width="20" height="3" fill="#2c3e50" />
    <rect x="4" y="14" width="4" height="2" rx="1" fill="#ecf0f1" />
    <circle cx="18" cy="16" r="2" fill="#f1c40f" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" fill="#9b59b6" />
    <path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" fill="#9b59b6" />
  </svg>
);

export default function VisitorSidebar() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const signout = () => {
    localStorage.removeItem('visitor_token');
    localStorage.removeItem('visitor_user');
    navigate('/login');
  };
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => setCollapsed(v => !v);
  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('visitor-mobile-open');
    } else {
      document.body.classList.remove('visitor-mobile-open');
    }
    return () => document.body.classList.remove('visitor-mobile-open');
  }, [mobileOpen]);

  return (
    <>
      <button className="mobile-menu-button" onClick={openMobile} aria-label="Open menu">☰</button>
      {mobileOpen && <div className="visitor-mobile-backdrop" onClick={closeMobile} />}
      <aside className={`visitor-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="visitor-brand">
          <span>{t('vis_brand')}</span>
          <button className="collapse-toggle" onClick={toggleCollapsed} aria-label="Toggle sidebar">{collapsed ? '»' : '«'}</button>
          <button className="mobile-close" onClick={closeMobile} aria-label="Close menu">✕</button>
        </div>
        <nav>
          <div className="visitor-nav-links">
            <NavLink to="/visitor/dashboard" onClick={closeMobile}>
              <span className="nav-icon"><DashboardIcon /></span>
              <span className="nav-label">{t('vis_dashboard')}</span>
            </NavLink>
            <NavLink to="/visitor/sites" onClick={closeMobile}>
              <span className="nav-icon"><ExploreSitesIcon /></span>
              <span className="nav-label">{t('vis_explore')}</span>
            </NavLink>
            <NavLink to="/visitor/history" onClick={closeMobile}>
              <span className="nav-icon"><MyVisitsIcon /></span>
              <span className="nav-label">{t('vis_history')}</span>
            </NavLink>
            <NavLink to="/visitor/payments" onClick={closeMobile}>
              <span className="nav-icon"><PaymentsIcon /></span>
              <span className="nav-label">{t('vis_payments')}</span>
            </NavLink>
            <NavLink to="/visitor/profile" onClick={closeMobile}>
              <span className="nav-icon"><ProfileIcon /></span>
              <span className="nav-label">{t('vis_profile')}</span>
            </NavLink>
          </div>
          <div className="visitor-nav-bottom">
            <button className="nav-logout" onClick={signout}>
              <span className="nav-icon">🚪</span>
              <span className="nav-label">{t('vis_logout')}</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
