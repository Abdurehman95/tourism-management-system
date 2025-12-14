import React, { useState, useEffect } from 'react';
import VisitorSidebar from './VisitorSidebar';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';
import './visitor.css';
import { Link } from 'react-router-dom';
import { visitorService } from '../../services/visitorService';
import UserProfileMenu from '../common/UserProfileMenu';

export default function VisitorDashboard() {
  const { t } = useLanguage();
  const [summary, setSummary] = useState({
    upcomingVisits: 0,
    pendingRequests: 0,
    completedVisits: 0
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('visitor_user'));
    if (userData) {
      setUser(userData);
      visitorService.getHistory(userData.user_id).then(requests => {
        if (!Array.isArray(requests)) {
          // console.error("VisitorDashboard: Expected array, got", requests);
          return;
        }
        setSummary({
          upcomingVisits: requests.filter(r => r.request_status === 'approved').length,
          pendingRequests: requests.filter(r => r.request_status === 'pending').length,
          completedVisits: requests.filter(r => r.request_status === 'completed').length
        });
      }).catch(console.error);
    }
  }, []);

  return (
    <div className="visitor-layout">
      <VisitorSidebar />
      <main className="visitor-main">
        <header className="visitor-main-header">
          <h1 style={{ margin: 0 }}>{t('welcome_back')}, {user ? user.first_name : 'Visitor'}!</h1>

          <div className="dashboard-profile-display">
            <ThemeToggle />
            <UserProfileMenu userType="visitor" />
          </div>
        </header>

        <section className="visitor-cards">
          <div className="card">
            <h3>{t('dash_upcoming')}</h3>
            <div className="card-value">{summary.upcomingVisits}</div>
          </div>
          <div className="card">
            <h3>{t('dash_pending_requests')}</h3>
            <div className="card-value">{summary.pendingRequests}</div>
          </div>
          <div className="card">
            <h3>{t('dash_completed_visits')}</h3>
            <div className="card-value">{summary.completedVisits}</div>
          </div>
        </section>

        <section className="quick-actions-section">
          <h2>{t('dash_quick_actions')}</h2>
          <div className="quick-actions-buttons">
            <Link to="/visitor/sites" className="btn btn-primary">{t('vis_explore')}</Link>
            <Link to="/visitor/history" className="btn btn-outline-primary">{t('dash_view_history')}</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
