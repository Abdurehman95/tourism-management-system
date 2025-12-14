import React, { useState, useEffect } from 'react';
import GuideSidebar from './GuideSidebar';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';
import './guide.css';
import { guideService } from '../../services/guideService';
import UserProfileMenu from '../common/UserProfileMenu';

export default function GuideDashboard() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    today: 0,
    completed: 0
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('guide_user'));
    if (userData) {
      setUser(userData);
      guideService.getAssignedRequests(userData.user_id).then(requests => {
        const today = new Date().toISOString().split('T')[0];
        setStats({
          pending: requests.filter(r => r.request_status === 'approved' || r.request_status === 'assigned').length,
          today: requests.filter(r => r.preferred_date === today && r.request_status === 'accepted_by_guide').length,
          completed: requests.filter(r => r.request_status === 'completed').length
        });
      });
    }
  }, []);

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
    <div className="guide-layout">
      <GuideSidebar />
      <main className="guide-main">
        <header className="guide-header">
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>{t('welcome_back')}, {user ? user.first_name : 'Site Agent'}</h1>
            <p style={{ margin: '5px 0 0', color: 'var(--text-secondary)' }}>{t('dash_overview_msg')}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ThemeToggle />
            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                className="notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notifications"
              >
                🔔
                {unread && <span className="notification-count"></span>}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    {t('dash_notifications')}
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <li style={{ padding: '15px', textAlign: 'center', color: 'var(--text-secondary)' }}>{t('dash_no_notifications')}</li>
                    ) : (
                      notifications.map(notif => (
                        <li key={notif.id} className="notification-list-item">
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ fontSize: '1.2rem' }}>{notif.icon}</div>
                            <div>
                              <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--accent-primary)' }}>{notif.title}</strong>
                              <span style={{ color: 'var(--text-secondary)' }}>{notif.message}</span>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '5px' }}>{notif.time}</div>
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                  <div style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
                    <button
                      onClick={() => { setUnread(false); setShowNotifications(false); }}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      {t('dash_mark_read')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <UserProfileMenu userType="guide" />
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div className="guide-card">
            <h3 style={{ margin: '0 0 10px', color: '#fa8c16' }}>{t('dash_pending_requests')}</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.pending}</div>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{t('dash_msg_waiting')}</p>
          </div>
          <div className="guide-card">
            <h3 style={{ margin: '0 0 10px', color: '#1890ff' }}>{t('dash_todays_tours')}</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.today}</div>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{t('dash_msg_scheduled')}</p>
          </div>
          <div className="guide-card">
            <h3 style={{ margin: '0 0 10px', color: '#52c41a' }}>{t('dash_completed')}</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.completed}</div>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{t('dash_msg_finished')}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
