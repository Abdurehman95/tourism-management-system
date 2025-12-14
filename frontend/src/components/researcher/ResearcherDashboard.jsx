import React, { useEffect, useState } from 'react';
import ResearcherSidebar from './ResearcherSidebar';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';
import './researcher.css';
import { getResearcherSummary } from './researcherService';
import UserProfileMenu from '../common/UserProfileMenu';

// Icon Components
const SitesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const PendingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const ApprovedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default function ResearcherDashboard() {
  const { t } = useLanguage();
  const [summary, setSummary] = useState({ totalSites: 0, pending: 0, approved: 0 });
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = JSON.parse(localStorage.getItem('researcher_user') || '{}');

  useEffect(() => {
    if (user.user_id) {
      getResearcherSummary(user.user_id)
        .then(data => setSummary(data))
        .catch(err => console.error(err));
    }
  }, [user.user_id]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications) {
        const notificationDropdown = document.querySelector('.notification-dropdown');
        const notificationBtn = document.querySelector('.notification-btn');

        if (notificationDropdown && notificationBtn) {
          if (!notificationDropdown.contains(event.target) && !notificationBtn.contains(event.target)) {
            setShowNotifications(false);
          }
        }
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);


  return (
    <div className="researcher-layout">
      <ResearcherSidebar />
      <main className="researcher-main">
        <header className="researcher-main-header">
          <div>
            <h1>{t('welcome_back')}, {user.first_name || 'Researcher'}</h1>
            <p className="subtitle">Here's what's happening with your contributions today.</p>
          </div>
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ThemeToggle />
            <div style={{ position: 'relative' }}>
              <button
                className="notification-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) setUnreadCount(0);
                }}
              >
                🔔
                {unreadCount > 0 && (
                  <span className="notification-count">{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">{t('dash_recent_activity')}</div>
                  <ul className="notification-list">
                    {summary.recentActivity && summary.recentActivity.length > 0 ? (
                      summary.recentActivity.map((site, index) => (
                        <li key={index} className="notification-item" style={{ borderLeft: site.is_approved ? '4px solid #10b981' : '4px solid #f59e0b', background: '#f8fafc', margin: '10px', padding: '10px', borderRadius: '4px' }}>
                          <div className="notif-content">
                            <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>{site.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              Status: {site.is_approved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li style={{ padding: '15px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        {t('dash_no_notifications')}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            {/* Date badge removed */}
            <UserProfileMenu userType="researcher" />
          </div>
        </header>

        <section className="researcher-cards">
          <div className="card stat-card">
            <div className="stat-icon sites-icon"><SitesIcon /></div>
            <div className="stat-info">
              <h3>{t('dash_sites')}</h3>
              <div className="card-value">{summary.totalSites}</div>
              <span className="stat-label">Contributed</span>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon pending-icon"><PendingIcon /></div>
            <div className="stat-info">
              <h3>{t('dash_pending')}</h3>
              <div className="card-value" style={{ color: '#d97706' }}>{summary.pending}</div>
              <span className="stat-label">Awaiting Approval</span>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon approved-icon"><ApprovedIcon /></div>
            <div className="stat-info">
              <h3>{t('dash_approved')}</h3>
              <div className="card-value" style={{ color: '#059669' }}>{summary.approved}</div>
              <span className="stat-label">Published Live</span>
            </div>
          </div>
        </section>

        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
          <section className="panel quick-actions-panel">
            <h3>{t('dash_quick_actions')}</h3>
            <div className="action-buttons">
              <button className="btn-primary action-btn" onClick={() => window.location.href = '/researcher/sites?action=add'}>
                <span className="icon">+</span> {t('dash_add_site')}
              </button>

            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
