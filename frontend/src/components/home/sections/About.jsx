import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../../context/LanguageContext';

function About() {
  const { t } = useLanguage();

  return (
    <section
      id="about"
      style={{
        padding: '100px 20px',
        background: 'var(--bg-primary)'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
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
          }}>{t('about_badge')}</span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '20px',
            lineHeight: 1.3
          }}>
            {t('about_title')}
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.7
          }}>
            {t('about_desc')}
          </p>
        </div>

        {/* Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '50px',
          alignItems: 'center'
        }}>
          {/* Image */}
          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: 'var(--card-shadow)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--card-shadow)';
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=600&q=80"
              alt="Ethiopian Heritage"
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
          </div>

          {/* Text Content */}
          <div>
            <h3 style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '20px'
            }}>
              {t('about_card_title')}
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.8,
              marginBottom: '15px'
            }}>
              {t('about_card_desc1')}
            </p>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.8,
              marginBottom: '30px'
            }}>
              {t('about_card_desc2')}
            </p>

            {/* Stats */}
            <div style={{
              display: 'flex',
              gap: '40px',
              flexWrap: 'wrap',
              padding: '25px 0',
              borderTop: '1px solid var(--border-color)'
            }}>
              <StatItem end={50} label={t('stats_sites')} suffix="+" />
              <StatItem end={100} label={t('stats_guides')} suffix="+" />
              <StatItem end={1000} label={t('stats_visitors')} suffix="+" />
            </div>
            {/* Countdown Timer */}
            <CountdownTimer targetDate={new Date().getTime() + 7 * 24 * 60 * 60 * 1000} />
          </div>
        </div>
      </div>
    </section>
  );
}

const StatItem = ({ end, label, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 } // Trigger when 10% visible
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let startTimestamp = null;
    const duration = 2000; // 2 seconds animation

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Easing function (easeOutQuad) for smoother effect
      // t * (2 - t)
      const easeProgress = progress * (2 - progress);

      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end); // Ensure it lands exactly on end
      }
    };

    window.requestAnimationFrame(step);
  }, [hasAnimated, end]);

  return (
    <div ref={ref}>
      <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-primary)', minWidth: '80px' }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  );
};

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval] && timeLeft[interval] !== 0) {
      return;
    }

    timerComponents.push(
      <span key={interval} style={{ margin: '0 5px' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
          {timeLeft[interval]}
        </span>
        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginLeft: '3px' }}>
          {interval}
        </span>
      </span>
    );
  });

  return (
    <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '12px', textAlign: 'center' }}>
      <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-primary)' }}>Next Season Starts In:</h4>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
        {timerComponents.length ? timerComponents : <span>Time's up!</span>}
      </div>
    </div>
  );
};

export default About;