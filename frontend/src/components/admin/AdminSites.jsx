import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { getSites, deleteSite, getUsers, updateSiteStatus } from './adminService';
import AdminModal from './AdminModal';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminSites() {
  const { t } = useLanguage();
  const [sites, setSites] = useState([]);
  const [users, setUsers] = useState([]);
  const [viewSite, setViewSite] = useState(null);
  const [actionDropdown, setActionDropdown] = useState(null);

  useEffect(() => {
    Promise.all([getSites(), getUsers()]).then(([sitesData, usersData]) => {
      setSites(sitesData);
      setUsers(usersData);
    });

    const handleClickOutside = () => setActionDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const refresh = () => getSites().then(setSites);

  const handleStatusChange = async (siteId, isApproved) => {
    try {
      await updateSiteStatus(siteId, isApproved);
      refresh();
      setActionDropdown(null);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || err.message;
      alert(t('msg_update_fail') + ': ' + errorMsg);
    }
  };

  const getResearcherName = (site) => {
    if (site.researcher) return site.researcher; // Legacy
    if (site.researcher_id) {
      const user = users.find(u => u.user_id === site.researcher_id);
      return user ? `${user.first_name} ${user.last_name}` : t('lbl_unknown');
    }
    return 'N/A';
  };

  const handleDelete = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(t('msg_confirm_site_delete'))) return;
    try {
      await deleteSite(id);
      refresh();
    } catch (err) { alert(t('msg_delete_fail') + ': ' + err.message); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header">
          <h1>{t('admin_sites')}</h1>
          <ThemeToggle />
        </header>
        <section className="panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3>{t('admin_sites')}</h3>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>{t('th_id')}</th>
                  <th>{t('th_site_name')}</th>
                  <th>{t('th_researcher')}</th>
                  <th>{t('th_approved')}</th>
                  <th>{t('th_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((s, index) => (
                  <tr key={`${s.site_id}-${index}`}>
                    <td>{s.site_id}</td>
                    <td>{s.site_name}</td>
                    <td>{getResearcherName(s)}</td>
                    <td>
                      <span style={{
                        color: s.status === 'rejected' ? '#ff4d4f' : (s.is_approved ? '#52c41a' : '#fa8c16'),
                        fontWeight: 'bold'
                      }}>
                        {s.status === 'rejected' ? t('status_rejected') : (s.is_approved ? t('dash_approved') : t('dash_pending'))}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <button className="btn-sm" onClick={() => setViewSite(s)}>{t('btn_view')}</button>

                        <div className="action-dropdown-container">
                          <button
                            className="action-menu-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionDropdown(actionDropdown === index ? null : index);
                            }}
                          >
                            {t('btn_edit')} <span>▼</span>
                          </button>
                          {actionDropdown === index && (
                            <div
                              className="action-menu-content"
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                top: index >= sites.length - 3 ? 'auto' : '100%',
                                bottom: index >= sites.length - 3 ? '100%' : 'auto'
                              }}
                            >
                              <button
                                className={`action-menu-item ${s.is_approved ? 'disabled' : 'activate'}`}
                                disabled={s.is_approved}
                                onClick={() => !s.is_approved && handleStatusChange(s.site_id, true)}
                              >
                                ✓ {t('btn_approve')}
                              </button>
                              <button
                                className={`action-menu-item ${(s.status === 'rejected') ? 'disabled' : 'danger'}`}
                                disabled={s.status === 'rejected'}
                                onClick={() => s.status !== 'rejected' && handleStatusChange(s.site_id, false)}
                              >
                                ✕ {t('btn_reject')}
                              </button>
                              <button
                                className="action-menu-item danger"
                                style={{ borderTop: '1px solid var(--border-color)' }}
                                onClick={() => {
                                  setActionDropdown(null);
                                  handleDelete(s.site_id);
                                }}
                              >
                                🗑 {t('btn_delete')}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {viewSite && (
        <AdminModal title={t('modal_site_details')} onClose={() => setViewSite(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {viewSite.image && (
              <img
                src={viewSite.image}
                alt={viewSite.site_name}
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
              />
            )}
            <div>
              <label style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>{t('lbl_site_name')}</label>
              <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{viewSite.site_name}</div>
            </div>
            <div>
              <label style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>{t('lbl_location')}</label>
              <div style={{ color: 'var(--text-primary)' }}>{viewSite.location}</div>
            </div>
            <div>
              <label style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>{t('lbl_description')}</label>
              <div style={{ lineHeight: '1.5', color: 'var(--text-primary)' }}>{viewSite.description}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>{t('lbl_price')}</label>
                <div style={{ color: 'var(--text-primary)' }}>{viewSite.price} ETB</div>
              </div>
              <div>
                <label style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>{t('lbl_agent_fee')}</label>
                <div style={{ color: 'var(--text-primary)' }}>{viewSite.guide_fee} ETB</div>
              </div>
            </div>
            <div>
              <label style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>{t('th_status')}</label>
              <div>
                <span className={`status-badge status-${viewSite.is_approved ? 'approved' : 'pending'}`}>
                  {viewSite.is_approved ? t('dash_approved') : t('status_pending_approval')}
                </span>
              </div>
            </div>
            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <button className="btn-primary" onClick={() => setViewSite(null)}>{t('btn_close')}</button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
