import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';

function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        paddingTop: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1
      }}></div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '800px',
        padding: '120px 20px 80px'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: '#ffffff',
          marginBottom: '25px',
          lineHeight: 1.2,
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          fontFamily: "Georgia, 'Times New Roman', serif"
        }}>
          {t('hero_title')}
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: 'rgba(255, 255, 255, 0.95)',
          lineHeight: 1.8,
          marginBottom: '40px',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          {t('hero_subtitle')}
        </p>
        <Link
          to="/register"
          style={{
            display: 'inline-block',
            background: 'var(--accent-primary)',
            color: '#ffffff',
            padding: '16px 40px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '1rem',
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = 'var(--accent-secondary)'}
          onMouseLeave={(e) => e.target.style.background = 'var(--accent-primary)'}
        >
          {t('hero_cta')}
        </Link>
      </div>
    </section>
  );
}

export default Hero;