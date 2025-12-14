import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { getUsers, toggleUserStatus, deleteUser } from './adminService';
import AddUserModal from './AddUserModal';
import AdminModal from './AdminModal';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminUsers() {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [actionDropdown, setActionDropdown] = useState(null);

  useEffect(() => {
    getUsers().then(data => setUsers(data.filter(u => u.user_id !== 1)));

    const handleClickOutside = () => setActionDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const refresh = () => getUsers().then(data => setUsers(data.filter(u => u.user_id !== 1)));
  const onUserCreated = () => { refresh(); };

  const handleToggleStatus = async (user) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(t('msg_confirm_status'))) return;
    try {
      await toggleUserStatus(user.user_id, !user.is_active);
      refresh();
    } catch (err) {
      alert(t('msg_action_failed') + ': ' + err.message);
    }
  };

  const handleDelete = async (user) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(t('msg_confirm_delete'))) return;
    try {
      await deleteUser(user.user_id);
      refresh();
    } catch (err) {
      alert(t('msg_action_failed') + ': ' + err.message);
    }
  };

  const formatType = (type, role, fallbackType, label) => {
    const raw = (label || type || role || fallbackType || '').toLowerCase();
    if (raw === 'site_agent' || raw === 'site agent' || raw === 'guide') return t('label_site_agent');
    if (raw === 'researcher') return t('label_researcher');
    if (raw === 'visitor') return t('label_visitor');
    if (raw === 'admin') return t('label_admin');
    if (!raw) return t('label_site_agent');
    return label || type || role || fallbackType || '—';
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header">
          <h1>{t('admin_users')}</h1>
          <ThemeToggle />
        </header>
        <section className="panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3>{t('admin_users')}</h3>
            <div>
              <button className="btn-primary" onClick={() => setShowAddUser(true)}>{t('btn_add_user')}</button>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>{t('th_id')}</th>
                  <th>{t('th_name')}</th>
                  <th>{t('th_email')}</th>
                  <th>{t('th_type')}</th>
                  <th>{t('th_status')}</th>
                  <th>{t('th_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr key={`${u.user_id}-${index}`}>
                    <td>{u.user_id}</td>
                    <td>{u.first_name} {u.last_name}</td>
                    <td>{u.email}</td>
                    <td>{formatType(u.user_type, u.role, u.type, u.user_type_label)}</td>
                    <td>{u.is_active ? t('label_active') || 'Active' : t('label_inactive') || 'Inactive'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <button className="btn-sm" onClick={() => setViewUser(u)}>{t('btn_view')}</button>

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
                              /* Vertical positioning logic preserved via inline style if complex, but simple CSS helps. 
                                 If clip issues occur, 'bottom: 100%' logic from orig file can be used dynamically, 
                                 but standard absolute top:100% is usually fine for most rows. 
                                 I'll keep the dynamic positioning logic in style prop just in case. */
                              style={{
                                top: index >= users.length - 3 ? 'auto' : '100%',
                                bottom: index >= users.length - 3 ? '100%' : 'auto'
                              }}
                            >
                              <button
                                className={`action-menu-item ${u.is_active ? 'deactivate' : 'activate'}`}
                                onClick={() => {
                                  setActionDropdown(null);
                                  handleToggleStatus(u);
                                }}
                              >
                                {u.is_active ? `✕ ${t('btn_deactivate')}` : `✓ ${t('btn_activate')}`}
                              </button>
                              <button
                                className="action-menu-item danger"
                                onClick={() => {
                                  setActionDropdown(null);
                                  handleDelete(u);
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
        {showAddUser && <AddUserModal onClose={() => setShowAddUser(false)} onCreated={onUserCreated} />}
        {viewUser && (
          <AdminModal title={t('modal_user_details')} onClose={() => setViewUser(null)}>
            <div className="user-details">
              <p><strong>{t('th_id')}:</strong> {viewUser.user_id}</p>
              <p><strong>{t('th_name')}:</strong> {viewUser.first_name} {viewUser.last_name}</p>
              <p><strong>{t('th_email')}:</strong> {viewUser.email}</p>
              <p><strong>Username:</strong> {viewUser.username}</p>
              <p><strong>{t('th_type')}:</strong> {formatType(viewUser.user_type, viewUser.role, viewUser.type, null)}</p>
              <p><strong>{t('th_status')}:</strong> {viewUser.is_active ? t('label_active') : t('label_inactive')}</p>
              <div style={{ marginTop: 20, textAlign: 'right' }}>
                <button
                  className="btn-danger"
                  onClick={() => {
                    if (window.confirm(t('msg_confirm_delete'))) {
                      deleteUser(viewUser.user_id).then(() => {
                        setViewUser(null);
                        refresh();
                      });
                    }
                  }}
                  style={{ marginRight: '10px' }}
                >
                  {t('btn_delete')}
                </button>
                <button className="btn-primary" onClick={() => setViewUser(null)}>{t('btn_close')}</button>
              </div>
            </div>
          </AdminModal>
        )}
      </main>
    </div>
  );
}
