import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';
import './admin.css';
import { getSummary, getRequests, getPayments, createSite, createUser, getNotifications, markNotificationRead } from './adminService';
import AddSiteModal from './AddSiteModal';
import AddUserModal from './AddUserModal';
import UserProfileMenu from '../common/UserProfileMenu';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [summary, setSummary] = useState(null);
  const [requests, setRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserType, setAddUserType] = useState('site_agent');
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getSummary().then(setSummary);
    getRequests().then(setRequests);
    getPayments().then(setPayments);
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    getNotifications().then(data => {
      const mapped = data.map(n => ({
        id: n.notification_id,
        title: n.title,
        message: n.message,
        read: Number(n.is_read) === 1,
        created_at: n.created_at,
        tone: n.type === 'payment' || n.type === 'success' ? 'success' : (n.type === 'guide_request' || n.type === 'warning' ? 'warning' : 'info')
      }));
      setNotifications(mapped);
      setUnreadCount(mapped.filter(n => !n.read).length);
    }).catch(console.error);
  };

  const refresh = () => {
    getSummary().then(setSummary);
    getRequests().then(setRequests);
    getPayments().then(setPayments);
    loadNotifications();
  };

  const markAsRead = (id) => {
    markNotificationRead(id).then(() => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    });
  };

  const markAllAsRead = () => {
    // TODO: Implement bulk mark read
  };

  const onUserCreated = (user) => { refresh(); };

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
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header">
          <div className="admin-actions">
            <button className="btn-outline" onClick={() => { setAddUserType('site_agent'); setShowAddUser(true); }}>{t('dash_add_agent')}</button>
            <button className="btn-outline" onClick={() => { setAddUserType('researcher'); setShowAddUser(true); }}>{t('dash_add_researcher')}</button>
          </div>


          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ThemeToggle />
            <div style={{ position: 'relative' }}>
              <button
                className="notification-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) markAllAsRead();
                }}
              >
                🔔
                {unreadCount > 0 && (
                  <span className="notification-count">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    {t('dash_notifications')}
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>{t('dash_no_notifications')}</div>
                  ) : (
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {notifications.map(notif => (
                        <li
                          key={notif.id}
                          className={`notification-list-item ${!notif.read ? 'unread' : ''}`}
                        >
                          <div className="notification-title-row">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span className={`notification-dot dot-${notif.tone}`}></span>
                              <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{notif.title}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {!notif.read && (
                                <button
                                  className="btn-sm"
                                  style={{ background: 'var(--bg-primary)', color: 'var(--accent-primary)', border: '1px solid var(--border-color)' }}
                                  onClick={() => markAsRead(notif.id)}
                                >
                                  {t('dash_mark_read')}
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="notification-msg">{notif.message}</div>
                          <div className="notification-time">{new Date(notif.created_at).toLocaleString()}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <UserProfileMenu userType="admin" />
          </div>
        </header>

        {summary ? (
          <section className="charts-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '30px', marginBottom: '40px' }}>
            {/* Bar Chart - System Overview */}
            <div className="panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>System Performance</h3>
                <span style={{ fontSize: '0.8rem', padding: '4px 12px', background: '#f1f5f9', borderRadius: '20px', color: '#64748b' }}>Real-time</span>
              </div>
              <div style={{ height: '350px' }}>
                <Bar
                  data={{
                    labels: ['Users', 'Sites', 'Visits', 'Revenue'],
                    datasets: [
                      {
                        label: 'Metric Value',
                        data: [
                          summary.totalUsers,
                          summary.totalSites,
                          summary.totalVisits,
                          summary.totalPayments
                        ],
                        backgroundColor: [
                          'rgba(99, 102, 241, 0.9)', // Indigo
                          'rgba(16, 185, 129, 0.9)', // Emerald
                          'rgba(245, 158, 11, 0.9)', // Amber
                          'rgba(244, 63, 94, 0.9)',  // Rose
                        ],
                        borderRadius: 6,
                        barThickness: 40,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: '#1e293b',
                        padding: 12,
                        titleFont: { size: 13, family: "'Inter', sans-serif" },
                        bodyFont: { size: 12, family: "'Inter', sans-serif" },
                        cornerRadius: 8,
                        displayColors: false,
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: '#f1f5f9',
                          borderDash: [5, 5],
                        },
                        border: { display: false },
                        ticks: {
                          font: { family: "'Inter', sans-serif", size: 11 },
                          color: '#64748b',
                          padding: 10
                        }
                      },
                      x: {
                        grid: { display: false },
                        border: { display: false },
                        ticks: {
                          font: { family: "'Inter', sans-serif", size: 12, weight: '500' },
                          color: '#64748b'
                        }
                      }
                    },
                  }}
                />
              </div>
            </div>

            {/* Doughnut Chart - Distribution */}
            <div className="panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>Distribution</h3>
                <button style={{ border: 'none', background: 'transparent', color: '#94a3b8' }}>•••</button>
              </div>
              <div style={{ height: '350px', position: 'relative' }}>
                <Doughnut
                  data={{
                    labels: ['Users', 'Sites', 'Visits', 'Revenue'],
                    datasets: [
                      {
                        data: [
                          summary.totalUsers,
                          summary.totalSites,
                          summary.totalVisits,
                          summary.totalPayments
                        ],
                        backgroundColor: [
                          '#6366f1', // Indigo 500
                          '#10b981', // Emerald 500
                          '#f59e0b', // Amber 500
                          '#f43f5e', // Rose 500
                        ],
                        borderWidth: 0,
                        hoverOffset: 4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%', // Thinner ring
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                          font: { family: "'Inter', sans-serif", size: 11 },
                          color: '#64748b'
                        }
                      },
                      tooltip: {
                        backgroundColor: '#1e293b',
                        padding: 12,
                        cornerRadius: 8,
                      }
                    },
                  }}
                />
                {/* Center Text Overlay */}
                <div style={{
                  position: 'absolute',
                  top: '40%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>
                    {summary.totalUsers + summary.totalSites + summary.totalVisits + summary.totalPayments}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Total Events</div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <LoadingSpinner />
        )}
      </main>
      {showAddUser && <AddUserModal defaultType={addUserType} onClose={() => setShowAddUser(false)} onCreated={onUserCreated} />}
    </div>
  );
}
