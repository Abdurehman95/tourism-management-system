import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { getSummary, getRequests, getPayments } from './adminService';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminReports() {
  const { t } = useLanguage();
  const [summary, setSummary] = useState(null);
  const [requests, setRequests] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    getSummary().then(setSummary);
    getRequests().then(setRequests);
    getPayments().then(setPayments);
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header">
          <h1>{t('title_reports_analytics')}</h1>
          <ThemeToggle />
        </header>

        <section className="panel">
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-info">
                <h4>{t('lbl_visits_report')}</h4>
                <p><strong>{t('lbl_total_requests')}:</strong> {requests.length}</p>
                <p><strong>{t('lbl_completed_visits')}:</strong> {requests.filter(r => r.request_status === 'completed').length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <h4>{t('lbl_payments_report')}</h4>
                <p><strong>{t('lbl_total_payments')}:</strong> {payments.length}</p>
                <p><strong>{t('lbl_confirmed_revenue')}:</strong> {payments.filter(p => p.payment_status === 'confirmed').reduce((acc, curr) => acc + Number(curr.amount), 0)} ETB</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <h4>{t('lbl_user_activity')}</h4>
                <p><strong>{t('lbl_total_users')}:</strong> {summary?.totalUsers || 0}</p>
                <p><strong>{t('lbl_active_sites')}:</strong> {summary?.totalSites || 0}</p>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: '10px' }}>
            <button className="btn-primary">{t('btn_export_csv')}</button>
            <button className="btn-outline">{t('btn_export_pdf')}</button>
          </div>
        </section>
      </main>
    </div>
  );
}
