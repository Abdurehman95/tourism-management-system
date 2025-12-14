import React, { useState, useEffect } from 'react';
import GuideSidebar from './GuideSidebar';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';
import './guide.css';
import { guideService } from '../../services/guideService';

export default function GuideSchedule() {
  const { t } = useLanguage();
  const [schedule, setSchedule] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      guideService.getAssignedRequests(user.user_id).then(data => {
        // Filter only accepted requests
        const accepted = data.filter(r => r.request_status === 'accepted_by_guide');
        // Sort by date
        accepted.sort((a, b) => new Date(a.preferred_date) - new Date(b.preferred_date));
        setSchedule(accepted);
      });
    }
  }, []);

  // Calendar helpers
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={{ padding: '10px', background: '#f9f9f9' }}></div>);
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const toursOnDay = schedule.filter(s => s.preferred_date === dateStr);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      days.push(
        <div key={i} style={{
          padding: '10px',
          border: '1px solid #eee',
          minHeight: '80px',
          background: isToday ? '#e6f7ff' : 'white',
          position: 'relative'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px', color: isToday ? '#1890ff' : '#333' }}>{i}</div>
          {toursOnDay.map(tour => (
            <div key={tour.request_id} style={{
              fontSize: '0.75rem',
              background: '#1890ff',
              color: 'white',
              padding: '2px 4px',
              borderRadius: '4px',
              marginBottom: '2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              cursor: 'pointer'
            }} title={`${tour.site_name} - ${tour.preferred_time}`}>
              {tour.preferred_time} {tour.site_name}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  return (
    <div className="guide-layout">
      <GuideSidebar />
      <main className="guide-main">
        <header className="guide-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>{t('guide_schedule')}</h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => setViewMode('list')}
              className={`guide-btn ${viewMode === 'list' ? 'btn-primary' : ''}`}
              style={{ background: viewMode === 'list' ? '#1890ff' : 'white', color: viewMode === 'list' ? 'white' : '#333', border: '1px solid #ddd' }}
            >
              {t('btn_list_view')}
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`guide-btn ${viewMode === 'calendar' ? 'btn-primary' : ''}`}
              style={{ background: viewMode === 'calendar' ? '#1890ff' : 'white', color: viewMode === 'calendar' ? 'white' : '#333', border: '1px solid #ddd' }}
            >
              {t('btn_calendar_view')}
            </button>
            <ThemeToggle />
          </div>
        </header>

        <div className="guide-card">
          {viewMode === 'list' ? (
            schedule.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📅</div>
                <p>{t('msg_no_tours_scheduled')}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {schedule.map(item => (
                  <div key={item.request_id} style={{
                    border: '1px solid #eee',
                    padding: '15px',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderLeft: '4px solid #1890ff'
                  }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px' }}>{item.site_name}</h3>
                      <p style={{ margin: 0, color: '#666' }}>
                        <strong>{t('th_date')}:</strong> {item.preferred_date} | <strong>Time:</strong> {item.preferred_time || '09:00 AM'}
                      </p>
                      <p style={{ margin: '5px 0 0', color: '#666' }}>
                        <strong>{t('th_visitor')}:</strong> {item.visitor_name} ({item.group_size || item.number_of_visitors} people)
                      </p>
                    </div>
                    <div>
                      <span className="status-badge status-accepted_by_guide">{t('status_accepted')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={() => changeMonth(-1)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&lt;</button>
                <h2 style={{ margin: 0 }}>{currentDate.toLocaleString(t('locale'), { month: 'long', year: 'numeric' })}</h2>
                <button onClick={() => changeMonth(1)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&gt;</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center', fontWeight: 'bold', marginBottom: '10px' }}>
                <div>{t('day_sun')}</div>
                <div>{t('day_mon')}</div>
                <div>{t('day_tue')}</div>
                <div>{t('day_wed')}</div>
                <div>{t('day_thu')}</div>
                <div>{t('day_fri')}</div>
                <div>{t('day_sat')}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
                {renderCalendar()}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
