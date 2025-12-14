import React, { useState, useEffect } from 'react';
import VisitorSidebar from './VisitorSidebar';
import './visitor.css';
import { visitorService } from '../../services/visitorService';
import ThemeToggle from '../common/ThemeToggle';

export default function VisitorProfile() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Visitor',
    status: 'Active',
    image: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('visitor_user'));
    if (user) {
      setProfile({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        role: 'Visitor',
        status: user.is_active ? 'Active' : 'Inactive',
        image: user.image || ''
      });
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, image: imageUrl }));
      // Auto-save image update
      const user = JSON.parse(localStorage.getItem('visitor_user'));
      if (user) {
        const updatedUser = { ...user, image: imageUrl };
        visitorService.updateProfile(updatedUser);
        localStorage.setItem('visitor_user', JSON.stringify(updatedUser));
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('visitor_user'));
    if (user) {
      const updatedUser = {
        ...user,
        first_name: profile.firstName,
        last_name: profile.lastName,
        email: profile.email,
        image: profile.image
      };
      
      await visitorService.updateProfile(updatedUser);
      localStorage.setItem('visitor_user', JSON.stringify(updatedUser));
      setIsEditing(false);
      alert('Profile updated successfully!');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
        alert('Passwords do not match!');
        return;
    }
    
    const user = JSON.parse(localStorage.getItem('visitor_user'));
    if (user) {
      await visitorService.changePassword(user.user_id, password.new);
      alert('Password changed successfully!');
      setPassword({ current: '', new: '', confirm: '' });
      setShowPasswordForm(false);
    }
  };

  return (
    <div className="visitor-layout">
      <VisitorSidebar />
      <main className="visitor-main">
        <header className="visitor-main-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>Profile Settings</h1>
          <ThemeToggle />
        </header>

        <div className="profile-grid" style={{gridTemplateColumns: '1fr'}}>
            {/* Profile Card Removed - Moved to Dashboard Header */}

            {/* Main Content: Edit Profile & Settings */}
            <div className="profile-details">
                <div className="details-card">
                    <div className="details-header">
                        <h3>Edit Profile Information</h3>
                        {!isEditing && (
                          <button className="btn-primary" onClick={() => setIsEditing(true)} style={{padding: '6px 16px', fontSize: '0.9rem'}}>Edit Profile</button>
                        )}
                    </div>
                    
                    {/* Avatar Upload Section (Integrated into Edit Form) */}
                    <div className="d-flex align-items-center mb-4" style={{gap: '20px'}}>
                        <div className="profile-avatar-container" style={{position: 'relative', display: 'inline-block'}}>
                          <div className="profile-avatar" style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            backgroundImage: profile.image ? `url(${profile.image})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            fontSize: '2rem'
                          }}>
                              {!profile.image && (profile.firstName ? profile.firstName.charAt(0) : 'V')}
                          </div>
                          {isEditing && (
                            <>
                              <label htmlFor="avatar-upload" className="avatar-edit-btn" style={{
                                position: 'absolute', bottom: '0', right: '0',
                                background: '#1890ff', color: 'white', borderRadius: '50%',
                                width: '28px', height: '28px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', border: '2px solid white'
                              }}>
                                📷
                              </label>
                              <input 
                                id="avatar-upload" 
                                type="file" 
                                accept="image/*" 
                                style={{display: 'none'}} 
                                onChange={handleImageUpload}
                              />
                            </>
                          )}
                        </div>
                        <div>
                            <h4 style={{margin: 0}}>{profile.firstName} {profile.lastName}</h4>
                            <p style={{margin: 0, color: '#666', fontSize: '0.9rem'}}>{profile.email}</p>
                        </div>
                    </div>

                    <form onSubmit={handleProfileUpdate}>
                        <div className="row">
                          <div className="col-md-6 form-group">
                              <label className="form-label">First Name:</label>
                              {isEditing ? (
                                <input 
                                  className="form-control" 
                                  value={profile.firstName} 
                                  onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                                  required
                                />
                              ) : (
                                <div style={{fontWeight: 500, padding: '8px 0', borderBottom: '1px solid #eee'}}>{profile.firstName}</div>
                              )}
                          </div>
                          <div className="col-md-6 form-group">
                              <label className="form-label">Last Name:</label>
                              {isEditing ? (
                                <input 
                                  className="form-control" 
                                  value={profile.lastName} 
                                  onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                                  required
                                />
                              ) : (
                                <div style={{fontWeight: 500, padding: '8px 0', borderBottom: '1px solid #eee'}}>{profile.lastName}</div>
                              )}
                          </div>
                        </div>
                        <div className="form-group mt-3">
                            <label className="form-label">Email Address:</label>
                            {isEditing ? (
                                <input 
                                  type="email"
                                  className="form-control" 
                                  value={profile.email} 
                                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                                  required
                                />
                              ) : (
                                <div style={{fontWeight: 500, padding: '8px 0', borderBottom: '1px solid #eee'}}>{profile.email}</div>
                              )}
                        </div>
                        
                        {isEditing && (
                          <div className="mt-4 d-flex gap-2">
                            <button type="submit" className="btn btn-success">Save Changes</button>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                          </div>
                        )}
                    </form>

                    {/* Change Password Section - Integrated */}
                    <div className="mt-5 pt-4 border-top">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 style={{margin: 0}}>Security</h4>
                            <button 
                              className="btn-warning" 
                              onClick={() => setShowPasswordForm(!showPasswordForm)}
                              style={{padding: '6px 16px', fontSize: '0.9rem'}}
                            >
                              {showPasswordForm ? 'Cancel' : 'Change Password'}
                            </button>
                        </div>
                        
                        {showPasswordForm && (
                          <form onSubmit={handlePasswordChange} className="mt-3 bg-light p-3 rounded">
                            <div className="form-group mb-3">
                              <label className="form-label">Current Password</label>
                              <input 
                                type="password" 
                                className="form-control" 
                                value={password.current}
                                onChange={(e) => setPassword({...password, current: e.target.value})}
                                required
                              />
                            </div>
                            <div className="form-group mb-3">
                              <label className="form-label">New Password</label>
                              <input 
                                type="password" 
                                className="form-control" 
                                value={password.new}
                                onChange={(e) => setPassword({...password, new: e.target.value})}
                                required
                              />
                            </div>
                            <div className="form-group mb-3">
                              <label className="form-label">Confirm New Password</label>
                              <input 
                                type="password" 
                                className="form-control" 
                                value={password.confirm}
                                onChange={(e) => setPassword({...password, confirm: e.target.value})}
                                required
                              />
                            </div>
                            <button type="submit" className="btn btn-primary">Update Password</button>
                          </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
