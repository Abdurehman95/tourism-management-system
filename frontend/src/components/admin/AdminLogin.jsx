import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';
import { authenticate } from './adminService';
import ThemeToggle from '../common/ThemeToggle';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authenticate(email, password);
      
      if (res.user.user_type === 'researcher') {
        localStorage.setItem('researcher_token', res.token);
        localStorage.setItem('researcher_user', JSON.stringify(res.user));
        navigate('/researcher/dashboard');
      } else {
        // Default to admin
        localStorage.setItem('admin_token', res.token);
        localStorage.setItem('admin_user', JSON.stringify(res.user));
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrap" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>
        <ThemeToggle />
      </div>
      <form className="admin-login-card" onSubmit={submit}>
        <h2>Admin Sign In</h2>
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <div className="admin-error">{error}</div>}
        <button className="btn-primary" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}
