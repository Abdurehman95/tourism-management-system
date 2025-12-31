import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

function Destinations() {
  const { t } = useLanguage();

  const destinations = [
    {
      title: t('dest_1_title'),
      image: "/image/c2.avif",
      description: t('dest_1_desc')
    },
    {
      title: t('dest_2_title'),
      image: "/image/bale.jpg",
      description: t('dest_2_desc')
    },
    {
      title: t('dest_3_title'),
      image: "/image/c5.jpg",
      description: t('dest_3_desc')
    },
    {
      title: t('dest_4_title'),
      image: "/image/c1.avif",
      description: t('dest_4_desc')
    },
    {
      title: t('dest_5_title'),
      image: "/image/c3.avif",
      description: t('dest_5_desc')
    },
    {
      title: t('dest_6_title'),
      image: "/image/c6.avif",
      description: t('dest_6_desc')
    }
  ];

  return (
    <section
      id="destinations"
      style={{
        padding: '100px 20px',
        background: 'var(--bg-primary)'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{
            display: 'inline-block',
            background: 'var(--accent-primary)',
            color: '#ffffff',
            padding: '8px 20px',
            borderRadius: '50px',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '20px',
            opacity: 0.9
          }}>{t('dest_badge')}</span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '20px',
            lineHeight: 1.3
          }}>
            {t('dest_title')}
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.7
          }}>
            {t('dest_desc')}
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px'
        }}>
          {destinations.map((dest, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                height: '400px',
                cursor: 'pointer',
                boxShadow: 'var(--card-shadow)',
                group: 'card' // conceptual group for hover
              }}
              onMouseEnter={(e) => {
                e.currentTarget.querySelector('.bg-image').style.transform = 'scale(1.1)';
                e.currentTarget.querySelector('.overlay').style.background = 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.querySelector('.bg-image').style.transform = 'scale(1)';
                e.currentTarget.querySelector('.overlay').style.background = 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%)';
              }}
            >
              {/* Background Image */}
              <div
                className="bg-image"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${dest.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              />

              {/* Gradient Overlay */}
              <div
                className="overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%)',
                  transition: 'background 0.3s ease',
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end'
                }}
              >
                <div style={{
                  position: 'relative',
                  zIndex: 2,
                  transform: 'translateY(0)',
                  transition: 'transform 0.3s ease'
                }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    marginBottom: '10px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    lineHeight: 1.3
                  }}>
                    {dest.title}
                  </h3>

                  {/* Decorative Line */}
                  <div style={{
                    width: '60px',
                    height: '4px',
                    background: 'var(--accent-primary)',
                    marginBottom: '15px',
                    borderRadius: '2px'
                  }}></div>

                  <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    margin: 0,
                    maxWidth: '90%'
                  }}>
                    {dest.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Destinations;
