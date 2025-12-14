import React, { useState, useEffect, useRef } from 'react'; // Recompile trigger
import { Link } from 'react-router-dom';
import Header from './common/Header';
import Footer from './common/Footer';
import Features from './sections/Features';
import Destinations from './sections/Destinations';
import Contact from './sections/Contact';
import WebsiteAssistant from './common/WebsiteAssistant';
import { useLanguage } from '../../context/LanguageContext';
import { dataService } from '../../services/dataService';

// Import Images
import lalibelaImg from '../../assets/images/lalibela.jpg';
import gonderImg from '../../assets/images/gonder.jpg';
import simienImg from '../../assets/images/simien-mountains.jpg';
import baleImg from '../../assets/images/bale.jpg';
import sofomerImg from '../../assets/images/sofomer.jpg';

function Home() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    sites: 50,
    guides: 100,
    visitors: 1000
  });

  // Fetch real statistics on component mount
  useEffect(() => {
    const fetchStats = async () => {
      const realStats = await dataService.getStatsFromAPI();
      setStats(realStats);
    };
    fetchStats();
  }, []);

  return (
    <div>
      <Header />

      {/* Hero Section - Inlined */}
      <section
        id="home"
        style={{
          position: 'relative',
          width: '100vw',
          margin: '0',
          marginLeft: 'calc(-50vw + 50%)',
          minHeight: '100vh',
          paddingTop: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          backgroundImage: `url('/image/home.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
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

      {/* About Section - Inlined */}
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
            {/* Infinite Scroll Image Slider */}
            <div className="slider">
              <div className="slide-track">
                {/* 5 Unique Slides */}
                <div className="slide">
                  <img src={lalibelaImg} alt="Lalibela Rock-Hewn Churches" />
                </div>
                <div className="slide">
                  <img src={gonderImg} alt="Fasil Ghebbi Gondar" />
                </div>
                <div className="slide">
                  <img src={simienImg} alt="Simien Mountains" />
                </div>
                <div className="slide">
                  <img src={baleImg} alt="Bale Mountains" />
                </div>
                <div className="slide">
                  <img src={sofomerImg} alt="Sof Omar Caves" />
                </div>

                {/* 5 Duplicate Slides for Infinite Effect */}
                <div className="slide">
                  <img src={lalibelaImg} alt="Lalibela Rock-Hewn Churches" />
                </div>
                <div className="slide">
                  <img src={gonderImg} alt="Fasil Ghebbi Gondar" />
                </div>
                <div className="slide">
                  <img src={simienImg} alt="Simien Mountains" />
                </div>
                <div className="slide">
                  <img src={baleImg} alt="Bale Mountains" />
                </div>
                <div className="slide">
                  <img src={sofomerImg} alt="Sof Omar Caves" />
                </div>
              </div>
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

              {/* Stats - Now using real data */}
              <div style={{
                display: 'flex',
                gap: '40px',
                flexWrap: 'wrap',
                padding: '25px 0',
                borderTop: '1px solid var(--border-color)'
              }}>
                <StatItem end={stats.sites} label="Historic Sites" suffix="+" />
                <StatItem end={stats.guides} label="Expert Guides" suffix="+" />
                <StatItem end={stats.visitors} label="Happy Visitors" suffix="+" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Destinations />
      <Features />
      <Contact />
      <Footer />
      <WebsiteAssistant />
    </div>

  );
}

export default Home;

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
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let startTimestamp = null;
    const duration = 2000;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress * (2 - progress);
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
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