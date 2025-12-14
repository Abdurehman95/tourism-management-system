import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './admin.css';

// Icons ... (Keeping existing icons)
const DashboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="10" width="4" height="10" rx="1" fill="#8e44ad" />
    <rect x="10" y="6" width="4" height="14" rx="1" fill="#3498db" />
    <rect x="16" y="14" width="4" height="6" rx="1" fill="#2ecc71" />
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11Z" fill="#9b59b6" />
    <path d="M8 11C9.66 11 11 9.66 11 8C11 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11Z" fill="#3498db" />
    <path d="M8 13C5.33 13 0 14.34 0 17V19H16V17C16 14.34 10.67 13 8 13Z" fill="#3498db" />
    <path d="M16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 17V19H24V17C24 14.34 18.67 13 16 13Z" fill="#9b59b6" />
  </svg>
);

const SitesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="2" fill="#3498db" />
    <path d="M2 16L8 10L14 16L18 12L22 16V20H2V16Z" fill="#2ecc71" />
    <circle cx="17" cy="8" r="2" fill="#f1c40f" />
  </svg>
);

const RequestsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#bdc3c7" />
    <path d="M14 2V8H20" fill="#95a5a6" />
    <path d="M16.3 11.7L15.3 10.7L9.3 16.7V17.7H10.3L16.3 11.7Z" fill="#e67e22" />
  </svg>
);

const PaymentsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5" width="20" height="14" rx="2" fill="#3498db" />
    <rect x="2" y="9" width="20" height="3" fill="#2c3e50" />
    <rect x="4" y="14" width="4" height="2" rx="1" fill="#ecf0f1" />
  </svg>
);

const ReportsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#ecf0f1" />
    <path d="M6 16L10 10L14 14L18 6" stroke="#9b59b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" fill="#9b59b6" />
    <path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" fill="#9b59b6" />
  </svg>
);

export default function AdminSidebar() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const signout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/login');
  };
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => setCollapsed(v => !v);
  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    // prevent body scroll when mobile sidebar is open
    if (mobileOpen) {
      document.body.classList.add('admin-mobile-open');
    } else {
      document.body.classList.remove('admin-mobile-open');
    }
    return () => document.body.classList.remove('admin-mobile-open');
  }, [mobileOpen]);

  return (
    <>
      <button className="mobile-menu-button" onClick={openMobile} aria-label="Open menu">☰</button>
      {mobileOpen && <div className="admin-mobile-backdrop" onClick={closeMobile} />}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="admin-brand">
          <span>{t('admin_brand')}</span>
          <button className="collapse-toggle" onClick={toggleCollapsed} aria-label="Toggle sidebar">{collapsed ? '»' : '«'}</button>
          <button className="mobile-close" onClick={closeMobile} aria-label="Close menu">✕</button>
        </div>
        <nav>
          <div className="admin-nav-links">
            <NavLink to="/admin/dashboard" onClick={closeMobile}>
              <span className="nav-icon"><DashboardIcon /></span>
              <span className="nav-label">{t('admin_dashboard')}</span>
            </NavLink>
            <NavLink to="/admin/users" onClick={closeMobile}>
              <span className="nav-icon"><UsersIcon /></span>
              <span className="nav-label">{t('admin_users')}</span>
            </NavLink>
            <NavLink to="/admin/sites" onClick={closeMobile}>
              <span className="nav-icon"><SitesIcon /></span>
              <span className="nav-label">{t('admin_sites')}</span>
            </NavLink>
            <NavLink to="/admin/requests" onClick={closeMobile}>
              <span className="nav-icon"><RequestsIcon /></span>
              <span className="nav-label">{t('admin_requests')}</span>
            </NavLink>
            <NavLink to="/admin/payments" onClick={closeMobile}>
              <span className="nav-icon"><PaymentsIcon /></span>
              <span className="nav-label">{t('admin_payments')}</span>
            </NavLink>
            <NavLink to="/admin/reports" onClick={closeMobile}>
              <span className="nav-icon"><ReportsIcon /></span>
              <span className="nav-label">{t('admin_reports')}</span>
            </NavLink>
            <NavLink to="/admin/profile" onClick={closeMobile}>
              <span className="nav-icon"><ProfileIcon /></span>
              <span className="nav-label">{t('admin_profile')}</span>
            </NavLink>
          </div>
          <div className="admin-nav-bottom">
            <button className="nav-logout" onClick={signout}>
              <span className="logout-icon">🚪</span> <span className="nav-label">{t('admin_logout')}</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
