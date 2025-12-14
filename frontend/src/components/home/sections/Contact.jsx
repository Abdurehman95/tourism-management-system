import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';

function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${t('contact_success')} ${formData.name}! ${t('contact_success_msg')}`);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" style={{
      padding: '100px 20px',
      background: 'var(--bg-primary)'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '15px'
          }}>
            {t('contact_title')}
          </h2>
          <div style={{
            width: '60px',
            height: '3px',
            background: 'var(--accent-primary)',
            margin: '0 auto'
          }}></div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} style={{
          background: 'var(--card-bg)',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: 'var(--card-shadow)'
        }}>
          {/* Name and Email Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <input
              type="text"
              name="name"
              placeholder={t('contact_name_ph')}
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                padding: '14px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <input
              type="email"
              name="email"
              placeholder={t('contact_email_ph')}
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                padding: '14px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Message Textarea */}
          <textarea
            name="message"
            placeholder={t('contact_msg_ph')}
            value={formData.message}
            onChange={handleChange}
            required
            rows="6"
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '15px',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              marginBottom: '25px',
              resize: 'vertical',
              fontFamily: 'inherit',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              padding: '14px 32px',
              background: 'var(--accent-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--accent-secondary)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--accent-primary)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }}
          >
            {t('contact_btn')}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;