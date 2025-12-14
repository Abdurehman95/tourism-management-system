import React, { useState, useEffect } from 'react';
import GuideSidebar from './GuideSidebar';
import ThemeToggle from '../common/ThemeToggle';
import './guide.css';
import { guideService } from '../../services/guideService';
import PhoneInput from '../common/PhoneInput';

export default function GuideProfile() {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    specialization: '',
    languages: '',
    profile_picture: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('guide_user'));
    if (user) {
      setProfile({
        ...user,
        specialization: user.specialization || 'General History',
        languages: user.languages || 'English, Amharic',
        profile_picture: user.profile_picture || ''
      });
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profile_picture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await guideService.updateProfile(profile);
    if (success) {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      // Update local storage to reflect changes immediately
      localStorage.setItem('guide_user', JSON.stringify(profile));
    } else {
      setMessage('Failed to update profile.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) {
      alert('New passwords do not match');
      return;
    }
    try {
      await guideService.changePassword(passData.new);
      setMessage('Password changed successfully.');
      setPassData({ current: '', new: '', confirm: '' });
    } catch (err) {
      alert('Password change failed: ' + err.message);
    }
  };

  return (
    <div className="guide-layout">
      <GuideSidebar />
      <main className="guide-main">
        <header className="guide-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>My Profile</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {!isEditing && (
              <button className="guide-btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
            <ThemeToggle />
          </div>
        </header>

        <div className="guide-card" style={{ maxWidth: '600px' }}>
          {message && <div style={{ padding: '10px', marginBottom: '15px', background: '#f0f5ff', color: '#1890ff' }}>{message}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: '#f0f0f0',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #1890ff'
              }}>
                {profile.profile_picture ? (
                  <img src={profile.profile_picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '2rem', color: '#ccc' }}>📷</span>
                )}
              </div>
              {isEditing && (
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', cursor: 'pointer', color: '#1890ff' }}>
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>Recommended: Square JPG/PNG</p>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={true} // Email usually not editable
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', background: '#f5f5f5' }}
              />
            </div>

            <div className="form-group" style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone</label>
              <PhoneInput
                value={profile.phone}
                onChange={(value) => setProfile({ ...profile, phone: value })}
                disabled={!isEditing}
                placeholder="Phone Number"
                style={{ width: '100%' }}
              />
            </div>

            <div className="form-group" style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Specialization</label>
              <input
                type="text"
                name="specialization"
                value={profile.specialization}
                onChange={handleChange}
                disabled={!isEditing}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div className="form-group" style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Languages</label>
              <input
                type="text"
                name="languages"
                value={profile.languages}
                onChange={handleChange}
                disabled={!isEditing}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            {isEditing && (
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button type="submit" className="guide-btn btn-primary">Save Changes</button>
                <button type="button" className="guide-btn btn-danger" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            )}
          </form>
        </div>

        <div className="guide-card" style={{ maxWidth: '600px', marginTop: '30px' }}>
          <h3>Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>New Password</label>
              <input
                type="password"
                value={passData.new}
                onChange={e => setPassData({ ...passData, new: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              />
            </div>
            <div className="form-group" style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Confirm New Password</label>
              <input
                type="password"
                value={passData.confirm}
                onChange={e => setPassData({ ...passData, confirm: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              />
            </div>
            <button type="submit" className="guide-btn btn-primary" style={{ marginTop: '20px' }}>Update Password</button>
          </form>
        </div>
      </main>
    </div>
  );
}
