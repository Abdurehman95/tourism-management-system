import React, { useState, useEffect } from 'react';
import GuideSidebar from './GuideSidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import ThemeToggle from '../common/ThemeToggle';
import './guide.css';
import { guideService } from '../../services/guideService';
import { useLanguage } from '../../context/LanguageContext';

export default function GuideRequests() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      guideService.getAssignedRequests(user.user_id).then(data => {
        setRequests(data);
        setLoading(false);
      });
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'accepted_by_guide': return t('status_accepted');
      case 'rejected_by_guide': return t('status_rejected_by_guide');
      case 'assigned': return t('status_assigned');
      case 'approved': return t('dash_approved');
      case 'pending': return t('dash_pending');
      case 'rejected': return t('status_rejected');
      default: return status.replace(/_/g, ' ');
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const guideId = user?.user_id;

    if (window.confirm(t('msg_confirm_guide_action'))) {
      try {
        await guideService.updateRequestStatus(requestId, newStatus, undefined, guideId);
        loadRequests();
      } catch (err) {
        console.error('Failed to update status:', err);
        alert(t('msg_update_fail') + ': ' + (err.message || 'Unknown error'));
      }
    }
  };

  return (
    <div className="guide-layout">
      <GuideSidebar />
      <main className="guide-main">
        <header className="guide-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>{t('guide_assigned_requests')}</h1>
          <ThemeToggle />
        </header>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="guide-card">
            {requests.length === 0 ? (
              <p>{t('msg_no_assigned_requests')}</p>
            ) : (
              <table className="guide-table">
                <thead>
                  <tr>
                    <th>{t('th_visitor')}</th>
                    <th>{t('th_site_name')}</th>
                    <th>{t('th_date')}</th>
                    <th>{t('th_group_size')}</th>
                    <th>{t('th_status')}</th>
                    <th>{t('th_actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req.request_id}>
                      <td>{req.visitor_name}</td>
                      <td>{req.site_name}</td>
                      <td>{req.preferred_date}</td>
                      <td>{req.group_size || req.number_of_visitors}</td>
                      <td>
                        <span className={`status-badge status-${req.request_status}`}>
                          {formatStatus(req.request_status)}
                        </span>
                      </td>
                      <td>
                        {(req.request_status === 'assigned' || req.request_status === 'approved') && (
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              className="guide-btn btn-primary"
                              onClick={() => handleStatusChange(req.request_id, 'accepted_by_guide')}
                            >
                              {t('status_accepted')}
                            </button>
                            <button
                              className="guide-btn btn-danger"
                              onClick={() => handleStatusChange(req.request_id, 'rejected_by_guide')}
                            >
                              {t('btn_reject')}
                            </button>
                          </div>
                        )}
                        {req.request_status === 'accepted_by_guide' && (
                          <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{t('status_accepted')}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
