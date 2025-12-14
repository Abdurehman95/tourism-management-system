import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './researcher.css';

// Icons ... (Keep existing icons)
const DashboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="10" width="4" height="10" rx="1" fill="#8e44ad" />
    <rect x="10" y="6" width="4" height="14" rx="1" fill="#3498db" />
    <rect x="16" y="14" width="4" height="6" rx="1" fill="#2ecc71" />
  </svg>
);

const SitesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="2" fill="#3498db" />
    <path d="M2 16L8 10L14 16L18 12L22 16V20H2V16Z" fill="#2ecc71" />
    <circle cx="17" cy="8" r="2" fill="#f1c40f" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" fill="#9b59b6" />
    <path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" fill="#9b59b6" />
  </svg>
);

export default function ResearcherSidebar() {
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('researcher_token');
    localStorage.removeItem('researcher_user');
    navigate('/login');
  };

  return (
    <aside className={`researcher-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="researcher-brand">
        <span>{collapsed ? 'R' : t('res_brand')}</span>
        <button className="collapse-toggle" onClick={() => setCollapsed(!collapsed)} title={collapsed ? "Expand" : "Collapse"}>
          {collapsed ? '»' : '«'}
        </button>
      </div>

      <nav>
        <div className="researcher-nav-links">
          <NavLink to="/researcher/dashboard" className={({ isActive }) => isActive ? 'active' : ''} title={collapsed ? t('res_dashboard') : ""}>
            <span className="nav-icon"><DashboardIcon /></span>
            <span className="nav-label">{t('res_dashboard')}</span>
          </NavLink>
          <NavLink to="/researcher/sites" className={({ isActive }) => isActive ? 'active' : ''} title={collapsed ? t('res_sites') : ""}>
            <span className="nav-icon"><SitesIcon /></span>
            <span className="nav-label">{t('res_sites')}</span>
          </NavLink>
          <NavLink to="/researcher/profile" className={({ isActive }) => isActive ? 'active' : ''} title={collapsed ? t('res_profile') : ""}>
            <span className="nav-icon"><ProfileIcon /></span>
            <span className="nav-label">{t('res_profile')}</span>
          </NavLink>
        </div>

        <div className="researcher-nav-bottom">
          <button className="nav-logout" onClick={handleLogout} title={collapsed ? t('res_logout') : ""}>
            <span className="logout-icon">🚪</span>
            {!collapsed && t('res_logout')}
          </button>
        </div>
      </nav>
    </aside>
  );
}
