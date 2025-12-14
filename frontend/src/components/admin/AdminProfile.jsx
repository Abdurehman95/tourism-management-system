import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { changePassword, updateProfile } from './adminService';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminProfile() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: ''
  });
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        setProfileData({
          firstName: parsedUser.first_name || '',
          lastName: parsedUser.last_name || '',
          email: parsedUser.email || '',
          username: parsedUser.user_type || 'admin'
        });
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });
    try {
      const res = await updateProfile(user.email, {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email
      });

      const updatedUser = {
        ...user,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email
      };
      localStorage.setItem('admin_user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      setProfileMessage({ type: 'success', text: t('msg_profile_success') });
      setIsEditing(false);
    } catch (err) {
      setProfileMessage({ type: 'error', text: t('msg_profile_fail') });
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: t('msg_password_mismatch') });
      return;
    }

    try {
      await changePassword(user.username, passwordData.currentPassword, passwordData.newPassword);
      setPasswordMessage({ type: 'success', text: t('msg_password_success') });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
    } catch (err) {
      setPasswordMessage({ type: 'error', text: e.message ? e.message : t('msg_password_fail') });
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header">
          <h1>{t('title_edit_profile')}</h1>
          <ThemeToggle />
        </header>

        <div className="panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {profileData.firstName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{profileData.firstName} {profileData.lastName}</h2>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{profileData.username}</p>
              </div>
            </div>
            {!isEditing && (
              <button className="btn-primary" onClick={() => setIsEditing(true)}>
                {t('btn_edit_profile')}
              </button>
            )}
          </div>

          {/* Profile Form/View */}
          {isEditing ? (
            <form onSubmit={submitProfile}>
              {profileMessage.text && (
                <div style={{ padding: '10px', borderRadius: '4px', marginBottom: '15px', background: profileMessage.type === 'error' ? '#fff1f0' : '#f6ffed', color: profileMessage.type === 'error' ? '#cf1322' : '#389e0d' }}>
                  {profileMessage.text}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>{t('lbl_first_name')}</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="form-group">
                  <label>{t('lbl_last_name')}</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{t('lbl_username')}</label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  disabled // Username usually not editable easily
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px' }}>
                <button type="button" className="btn-outline" onClick={() => setIsEditing(false)}>{t('btn_cancel') || 'Cancel'}</button>
                <button type="submit" className="btn-primary">{t('dash_save') || 'Save'}</button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('lbl_first_name')}</label>
                <div style={{ fontWeight: '500' }}>{profileData.firstName}</div>
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('lbl_last_name')}</label>
                <div style={{ fontWeight: '500' }}>{profileData.lastName}</div>
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t('lbl_username')}</label>
                <div style={{ fontWeight: '500' }}>{profileData.username}</div>
              </div>
            </div>
          )}

          {/* Security Section */}
          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t('title_security')}</h3>
              {!isChangingPassword && (
                <button className="btn-outline" onClick={() => setIsChangingPassword(true)}>{t('btn_change_password')}</button>
              )}
            </div>

            {isChangingPassword && (
              <form onSubmit={submitPassword}>
                {passwordMessage.text && (
                  <div style={{ padding: '10px', borderRadius: '4px', marginBottom: '15px', background: passwordMessage.type === 'error' ? '#fff1f0' : '#f6ffed', color: passwordMessage.type === 'error' ? '#cf1322' : '#389e0d' }}>
                    {passwordMessage.text}
                  </div>
                )}
                <div className="form-group">
                  <label>{t('lbl_current_password')}</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="form-group">
                  <label>{t('lbl_new_password')}</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="form-group">
                  <label>{t('lbl_confirm_password')}</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px' }}>
                  <button type="button" className="btn-outline" onClick={() => setIsChangingPassword(false)}>{t('btn_cancel') || 'Cancel'}</button>
                  <button type="submit" className="btn-primary">{t('btn_update_password')}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
