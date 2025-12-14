import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './guide.css';

// Icons ... (Keep existing icons)
const DashboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="10" width="4" height="10" rx="1" fill="#8e44ad" />
    <rect x="10" y="6" width="4" height="14" rx="1" fill="#3498db" />
    <rect x="16" y="14" width="4" height="6" rx="1" fill="#2ecc71" />
  </svg>
);

const RequestsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#bdc3c7" />
    <path d="M14 2V8H20" fill="#95a5a6" />
    <path d="M16.3 11.7L15.3 10.7L9.3 16.7V17.7H10.3L16.3 11.7Z" fill="#e67e22" />
  </svg>
);

const ScheduleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" fill="#3498db" />
    <path d="M3 8H21" stroke="#2980b9" strokeWidth="2" />
    <path d="M8 2V6" stroke="#2980b9" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 2V6" stroke="#2980b9" strokeWidth="2" strokeLinecap="round" />
    <circle cx="8" cy="14" r="1" fill="white" />
    <circle cx="12" cy="14" r="1" fill="white" />
    <circle cx="16" cy="14" r="1" fill="white" />
    <circle cx="8" cy="18" r="1" fill="white" />
    <circle cx="12" cy="18" r="1" fill="white" />
    <circle cx="16" cy="18" r="1" fill="white" />
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

export default function GuideSidebar() {
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('guide_user');
    navigate('/login');
  };

  return (
    <aside className={`guide-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="guide-brand">
        <span>{collapsed ? 'SA' : t('guide_brand')}</span>
        <button className="collapse-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '»' : '«'}
        </button>
      </div>

      <nav>
        <div className="guide-nav-links">
          <NavLink to="/guide/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon"><DashboardIcon /></span>
            <span className="nav-label">{t('guide_dashboard')}</span>
          </NavLink>
          <NavLink to="/guide/requests" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon"><RequestsIcon /></span>
            <span className="nav-label">{t('guide_requests')}</span>
          </NavLink>
          <NavLink to="/guide/schedule" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon"><ScheduleIcon /></span>
            <span className="nav-label">{t('guide_schedule')}</span>
          </NavLink>
          <NavLink to="/guide/reports" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon"><ReportsIcon /></span>
            <span className="nav-label">{t('guide_reports')}</span>
          </NavLink>
          <NavLink to="/guide/profile" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon"><ProfileIcon /></span>
            <span className="nav-label">{t('guide_profile')}</span>
          </NavLink>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button className="nav-logout" onClick={handleLogout}>
            <span className="nav-icon" style={{ fontSize: '18px', marginRight: collapsed ? 0 : '10px' }}>🚪</span>
            {!collapsed && <span className="nav-label">{t('guide_logout')}</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
}
