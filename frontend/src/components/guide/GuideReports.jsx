import React, { useState, useEffect } from 'react';
import GuideSidebar from './GuideSidebar';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';
import './guide.css';
import { guideService } from '../../services/guideService';

export default function GuideReports() {
  const { t } = useLanguage();
  const [completedTours, setCompletedTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState('');
  const [reportText, setReportText] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      guideService.getAssignedRequests(user.user_id).then(data => {
        // In a real app, we'd filter for tours that have passed date-wise but aren't reported yet
        // For demo, let's allow reporting on any 'accepted' tour
        const reportable = data.filter(r => r.request_status === 'accepted_by_guide');
        setCompletedTours(reportable);
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTour || !reportText) return;

    const success = await guideService.submitReport({
      request_id: Number(selectedTour),
      report_text: reportText,
      date: new Date().toISOString()
    });

    if (success) {
      setMessage(t('msg_report_success'));
      setReportText('');
      setSelectedTour('');
      // Optionally update the request status to 'completed' here
      await guideService.updateRequestStatus(Number(selectedTour), 'completed');

      // Refresh list
      const user = JSON.parse(localStorage.getItem('user'));
      guideService.getAssignedRequests(user.user_id).then(data => {
        const reportable = data.filter(r => r.request_status === 'accepted_by_guide');
        setCompletedTours(reportable);
      });
    } else {
      setMessage(t('msg_report_fail'));
    }
  };

  return (
    <div className="guide-layout">
      <GuideSidebar />
      <main className="guide-main">
        <header className="guide-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>{t('guide_submit_report')}</h1>
          <ThemeToggle />
        </header>

        <div className="guide-card">
          {message && <div style={{ padding: '10px', background: message === t('msg_report_success') ? '#f6ffed' : '#fff1f0', border: `1px solid ${message === t('msg_report_success') ? '#b7eb8f' : '#ffa39e'}`, marginBottom: '15px', borderRadius: '4px' }}>{message}</div>}

          <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('lbl_select_tour')}</label>
              <select
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                value={selectedTour}
                onChange={(e) => setSelectedTour(e.target.value)}
                required
              >
                <option value="">{t('ph_select_tour')}</option>
                {completedTours.map(tour => (
                  <option key={tour.request_id} value={tour.request_id}>
                    {tour.site_name} - {tour.visitor_name} ({tour.preferred_date})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('lbl_report_details')}</label>
              <textarea
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '150px' }}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder={t('ph_report_details')}
                required
              />
            </div>

            <button type="submit" className="guide-btn btn-primary">{t('btn_submit_report')}</button>
          </form>
        </div>
      </main>
    </div>
  );
}
