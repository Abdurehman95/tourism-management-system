import React, { useState } from 'react';
import ResearcherSidebar from './ResearcherSidebar';
import ThemeToggle from '../common/ThemeToggle';
import './researcher.css';
import { updateUser, changePassword } from './researcherService';

export default function ResearcherProfile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('researcher_user') || '{}'));
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateUser(user.user_id, {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        image: user.image // Save image URL
      });
      localStorage.setItem('researcher_user', JSON.stringify(updated));
      setUser(updated);
      setMessage('Profile updated successfully.');
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate upload by creating a local URL
      // In a real app, you'd upload to server and get a URL back
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, image: imageUrl });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) {
      alert('New passwords do not match');
      return;
    }
    try {
      // In a real app, we'd verify 'current' password on server. 
      // Here we just call the service which updates it directly in mock data.
      await changePassword(user.user_id, passData.new);
      setMessage('Password changed successfully.');
      setPassData({ current: '', new: '', confirm: '' });
    } catch (err) {
      alert('Password change failed: ' + err.message);
    }
  };

  return (
    <div className="researcher-layout">
      <ResearcherSidebar />
      <main className="researcher-main">
        <header className="researcher-main-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>Profile Settings</h1>
          <ThemeToggle />
        </header>

        <div className="profile-container" style={{background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'}}>
          
          <div className="profile-header" style={{display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '20px'}}>
            <div className="profile-avatar" style={{position: 'relative', width: '100px', height: '100px'}}>
              <img 
                src={user.image || 'https://via.placeholder.com/100'} 
                alt="Profile" 
                style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f0f0f0'}}
              />
              <label htmlFor="avatar-upload" style={{
                position: 'absolute', bottom: '0', right: '0', 
                background: '#1890ff', color: 'white', 
                width: '32px', height: '32px', borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', border: '2px solid white'
              }}>
                📷
              </label>
              <input id="avatar-upload" type="file" accept="image/*" style={{display: 'none'}} onChange={handleImageUpload} />
            </div>
            <div>
              <h2 style={{margin: '0 0 5px 0'}}>{user.first_name} {user.last_name}</h2>
              <p style={{margin: 0, color: '#666'}}>{user.user_type} • {user.email}</p>
            </div>
          </div>

          <div className="profile-forms-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px'}}>
            <form onSubmit={handleUpdateProfile}>
              <h3 style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px'}}>Personal Information</h3>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>First Name</label>
              <input 
                value={user.first_name || ''} 
                onChange={e => setUser({...user, first_name: e.target.value})} 
                style={{width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ddd'}}
                required 
              />
              
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Last Name</label>
              <input 
                value={user.last_name || ''} 
                onChange={e => setUser({...user, last_name: e.target.value})} 
                style={{width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ddd'}}
                required 
              />
              
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Email</label>
              <input 
                type="email"
                value={user.email || ''} 
                onChange={e => setUser({...user, email: e.target.value})} 
                style={{width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ddd'}}
                required 
              />
              
              <button className="btn-primary" style={{marginTop: '10px'}}>Save Changes</button>
            </form>

            <form onSubmit={handleChangePassword}>
              <h3 style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px'}}>Change Password</h3>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>New Password</label>
              <input 
                type="password" 
                value={passData.new} 
                onChange={e => setPassData({...passData, new: e.target.value})} 
                style={{width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ddd'}}
                required 
              />
              
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Confirm Password</label>
              <input 
                type="password" 
                value={passData.confirm} 
                onChange={e => setPassData({...passData, confirm: e.target.value})} 
                style={{width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ddd'}}
                required 
              />
              
              <button className="btn-outline" style={{marginTop: '10px'}}>Update Password</button>
            </form>
          </div>
          
          {message && <div style={{marginTop: '20px', padding: '10px', background: '#f6ffed', border: '1px solid #b7eb8f', color: '#52c41a', borderRadius: '6px'}}>{message}</div>}
        </div>
      </main>
    </div>
  );
}
