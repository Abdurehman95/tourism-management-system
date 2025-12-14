import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import ThemeToggle from '../../common/ThemeToggle';
import { useLanguage } from '../../../context/LanguageContext';

function LoginForm() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    setError('');

    try {
      const user = await authService.login(email, password);

      if (user) {
        if (user.is_active === false || user.is_active === 0) {
          alert('Your account has been deactivated. Please contact the administrator.');
          return;
        }

        const userType = user.user_type ? user.user_type.toLowerCase().trim() : 'visitor';

        // Store role-specific tokens for compatibility
        const token = localStorage.getItem('token');
        if (userType === 'admin') {
          localStorage.setItem('admin_token', token);
          localStorage.setItem('admin_user', JSON.stringify(user));
          navigate('/admin/dashboard');
        } else if (userType === 'researcher') {
          localStorage.setItem('researcher_token', token);
          localStorage.setItem('researcher_user', JSON.stringify(user));
          navigate('/researcher/dashboard');
        } else if (userType === 'guide' || userType === 'site_agent') {
          localStorage.setItem('guide_token', token);
          localStorage.setItem('guide_user', JSON.stringify(user));
          navigate('/guide/dashboard');
        } else {
          localStorage.setItem('visitor_token', token);
          localStorage.setItem('visitor_user', JSON.stringify(user));
          navigate('/visitor/dashboard');
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid credentials. Please check your email and password.');
    }
  };

  return (
    <div className="login-container" style={{ position: 'relative' }}>
      {/* Theme Toggle inside the box */}
      <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10 }}>
        <ThemeToggle />
      </div>

      <div className="login-box">
        <h2 style={{
          textAlign: 'center',
          marginBottom: '10px',
          fontSize: '24px',
          color: 'var(--text-primary)'
        }}>
          {t('login_title')}
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'var(--text-secondary)',
          marginBottom: '25px',
          fontSize: '14px'
        }}>
          {t('login_subtitle')}
        </p>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder={t('login_email_ph')}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <div className="password-wrapper">
              <input
                type="password"
                name="password"
                placeholder={t('login_password_ph')}
                value={formData.password}
                onChange={handleChange}
                required
                id="password"
              />
            </div>
          </div>

          <button type="submit">{t('login_btn')}</button>
        </form>

        <div className="forgot-password">
          <Link to="/forgot">{t('login_forgot')}</Link>
        </div>

        <div className="register-link">
          <p>{t('login_register_text')} <Link to="/register">{t('login_register_link')}</Link></p>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '0.9rem'
        }}>
          <Link
            to="/"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
            onMouseLeave={(e) => e.target.style.color = '#6b7280'}
          >
            {t('back_home')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
