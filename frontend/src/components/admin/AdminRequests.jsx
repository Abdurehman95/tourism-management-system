import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { getRequests, getPayments, approveRequest, rejectRequest, assignGuide } from './adminService';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminRequests() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [assigningId, setAssigningId] = useState(null);
  const [guideIdInput, setGuideIdInput] = useState('');
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    getRequests().then(setRequests);
    getPayments().then(setPayments);
  }, []);

  const refresh = () => {
    getRequests().then(setRequests);
    getPayments().then(setPayments);
    setAssigningId(null);
    setGuideIdInput('');
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'accepted_by_guide': return t('status_accepted');
      case 'rejected_by_guide': return t('status_rejected_by_guide');
      case 'assigned': return t('status_assigned');
      case 'approved': return t('dash_approved');
      case 'pending': return t('dash_pending');
      case 'rejected': return t('status_rejected');
      default: return status;
    }
  };

  const handleApprove = async (id) => {
    const hasVerifiedPayment = payments.some(p => p.request_id === id && p.payment_status === 'confirmed');
    if (!hasVerifiedPayment) {
      alert(t('msg_payment_not_verified'));
      return;
    }
    try { await approveRequest(id); refresh(); } catch (err) { alert(t('msg_update_fail') + ': ' + err.message); }
  };

  const handleReject = async (id) => {
    try { await rejectRequest(id); refresh(); } catch (err) { alert(t('msg_update_fail') + ': ' + err.message); }
  };

  const startAssign = (id) => {
    setAssigningId(id);
    setGuideIdInput('');
  };

  const submitAssign = async (id) => {
    if (!guideIdInput) return;
    try { await assignGuide(id, { guide_id: parseInt(guideIdInput) }); refresh(); } catch (err) { alert(t('msg_update_fail') + ': ' + err.message); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>{t('admin_visitor_requests')}</h1>
          <ThemeToggle />
        </header>
        <section className="panel">
          <table className="table">
            <thead>
              <tr>
                <th>{t('th_id')}</th>
                <th>{t('th_visitor')}</th>
                <th>{t('th_site_name')}</th>
                <th>{t('th_date')}</th>
                <th>{t('th_group_size')}</th>
                <th>{t('th_status')}</th>
                <th>{t('th_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.request_id}>
                  <td>{r.request_id}</td>
                  <td>{r.visitor_name}</td>
                  <td>{r.site_name}</td>
                  <td>{r.preferred_date}</td>
                  <td>{r.number_of_visitors}</td>
                  <td>{formatStatus(r.request_status)}</td>
                  <td>
                    {r.request_status === 'pending' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <button className="btn-sm" onClick={() => handleApprove(r.request_id)}>{t('btn_approve')}</button>
                        <button className="btn-sm btn-danger" onClick={() => handleReject(r.request_id)}>{t('btn_reject')}</button>
                      </div>
                    )}
                    {r.request_status === 'approved' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {assigningId === r.request_id ? (
                          <>
                            <input
                              type="number"
                              placeholder={t('th_id')}
                              value={guideIdInput}
                              onChange={e => setGuideIdInput(e.target.value)}
                              style={{ width: '60px', padding: '4px', margin: 0, fontSize: '0.8rem' }}
                            />
                            <button className="btn-sm" onClick={() => submitAssign(r.request_id)}>{t('btn_save')}</button>
                            <button className="btn-sm btn-outline" onClick={() => setAssigningId(null)} style={{ padding: '4px 8px' }}>✕</button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn-sm"
                              style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                              onClick={() => startAssign(r.request_id)}
                            >
                              {t('btn_assign_agent')}
                            </button>
                            <button className="btn-sm btn-danger" onClick={() => handleReject(r.request_id)}>{t('btn_reject')}</button>
                          </>
                        )}
                      </div>
                    )}
                    {r.request_status === 'rejected' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <button className="btn-sm" onClick={() => handleApprove(r.request_id)}>{t('btn_approve')}</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
