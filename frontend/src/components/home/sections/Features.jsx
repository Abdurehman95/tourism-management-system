import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: '🏛️',
      title: t('f_sites_title'),
      description: t('f_sites_desc'),
      color: 'var(--accent-primary)'
    },
    {
      icon: '🔍',
      title: t('f_smart_title'),
      description: t('f_smart_desc'),
      color: '#06b6d4'
    },
    {
      icon: '👨‍🏫',
      title: t('f_guides_title'),
      description: t('f_guides_desc'),
      color: '#10b981'
    },
    {
      icon: '🤝',
      title: t('f_match_title'),
      description: t('f_match_desc'),
      color: '#f59e0b'
    },
    {
      icon: '📚',
      title: t('f_content_title'),
      description: t('f_content_desc'),
      color: '#ef4444'
    },
    {
      icon: '📅',
      title: t('f_book_title'),
      description: t('f_book_desc'),
      color: '#8b5cf6'
    }
  ];

  return (
    <section
      id="feature"
      style={{
        padding: '100px 20px',
        background: 'var(--bg-secondary)'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{
            color: 'var(--accent-primary)',
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: '0.85rem',
            letterSpacing: '2px'
          }}>{t('feat_badge')}</span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginTop: '15px',
            marginBottom: '20px'
          }}>
            {t('feat_title')}
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto',
            fontSize: '1.1rem',
            lineHeight: 1.7
          }}>
            {t('feat_desc')}
          </p>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                background: 'var(--card-bg)',
                padding: '35px 30px',
                borderRadius: '16px',
                boxShadow: 'var(--card-shadow)',
                border: '1px solid var(--border-color)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = feature.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '16px',
                background: `${feature.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: '25px',
                margin: '0 auto 25px',
                color: feature.color === 'var(--accent-primary)' ? 'var(--accent-primary)' : feature.color,
                transition: 'all 0.3s ease'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                  e.currentTarget.style.background = feature.color === 'var(--accent-primary)' ? 'var(--accent-primary)' : feature.color;
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.background = `${feature.color}15`;
                  e.currentTarget.style.color = feature.color === 'var(--accent-primary)' ? 'var(--accent-primary)' : feature.color;
                }}
              >
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '12px'
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                fontSize: '1rem',
                margin: 0
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;