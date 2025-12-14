import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { getPayments, verifyPayment } from './adminService';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminPayments() {
  const { t } = useLanguage();
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  useEffect(() => { getPayments().then(setPayments); }, []);

  const refresh = () => getPayments().then(setPayments);

  const handleVerify = async (id) => {
    try {
      await verifyPayment(id);
      refresh();
      setSelectedPayment(null);
    } catch (err) { alert(t('msg_update_fail') + ': ' + err.message); }
  };

  const formatAmount = (p) => {
    const amt = p.total_amount ?? p.amount ?? 0;
    return `${amt} ETB`;
  };

  const getStatusLabel = (s) => {
    if (s === 'confirmed') return t('status_verified');
    if (s === 'pending') return t('dash_pending');
    return s;
  };

  const sortedPayments = [...payments].sort((a, b) => {
    const byId = (b.payment_id || 0) - (a.payment_id || 0);
    if (byId !== 0) return byId;
    return new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0);
  });

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>{t('admin_payments')}</h1>
          <ThemeToggle />
        </header>
        <section className="panel">
          <table className="table">
            <thead>
              <tr>
                <th>{t('th_id')}</th>
                <th>{t('th_amount')}</th>
                <th>{t('th_status')}</th>
                <th>{t('th_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedPayments.map(p => (
                <tr key={p.payment_id}>
                  <td>{p.payment_id}</td>
                  <td>{formatAmount(p)}</td>
                  <td><span className={`status-badge status-${p.payment_status}`}>{getStatusLabel(p.payment_status)}</span></td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn-sm btn-outline"
                      style={{ color: '#0d6efd', borderColor: '#0d6efd' }}
                      onClick={() => setSelectedPayment(p)}
                    >
                      {t('btn_view')}
                    </button>
                    <button
                      className="btn-sm"
                      style={{ background: '#28a745', color: 'white' }}
                      onClick={() => handleVerify(p.payment_id)}
                    >
                      {t('btn_verify')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {selectedPayment && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal" style={{ maxWidth: '520px' }}>
              <div className="admin-modal-header">
                <h3>{t('admin_payments')} #{selectedPayment.payment_id}</h3>
                <button className="btn-ghost" onClick={() => setSelectedPayment(null)}>✕</button>
              </div>
              <div className="admin-modal-body">
                <p><strong>{t('lbl_req_id')}:</strong> {selectedPayment.request_id || '—'}</p>
                <p><strong>{t('th_visitor')}:</strong> {selectedPayment.visitor_name || '—'}</p>
                <p><strong>{t('th_site_name')}:</strong> {selectedPayment.site || selectedPayment.site_name || '—'}</p>
                <p><strong>{t('th_amount')}:</strong> {formatAmount(selectedPayment)}</p>
                <p><strong>{t('lbl_payment_method')}:</strong> {selectedPayment.payment_method || selectedPayment.method || 'Chapa'}</p>
                <p><strong>{t('lbl_ref_code')}:</strong> {selectedPayment.reference_code || selectedPayment.tx_ref || '—'}</p>
                <p><strong>{t('th_date')}:</strong> {selectedPayment.created_at || selectedPayment.date || '—'}</p>
                <p><strong>{t('th_status')}:</strong> <span className={`status-badge status-${selectedPayment.payment_status}`}>{getStatusLabel(selectedPayment.payment_status)}</span></p>
                {selectedPayment.proof_url && (
                  <p><strong>{t('lbl_proof')}:</strong> <a href={selectedPayment.proof_url} target="_blank" rel="noreferrer">{t('btn_view')}</a></p>
                )}
              </div>
              <div className="admin-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button className="btn-sm btn-outline" onClick={() => setSelectedPayment(null)}>{t('btn_close')}</button>
                <button className="btn-sm" style={{ background: '#28a745', color: 'white' }} onClick={() => handleVerify(selectedPayment.payment_id)}>{t('btn_verify')}</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
