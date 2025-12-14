import React, { useState } from 'react';
import AdminModal from './AdminModal';
import './admin.css';
import { createSite } from './adminService';
import { useLanguage } from '../../context/LanguageContext';

export default function AddSiteModal({ onClose, onCreated }) {
  const { t } = useLanguage();
  const [siteName, setSiteName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newSite = await createSite({ site_name: siteName, is_approved: false });
      onCreated && onCreated(newSite);
      onClose();
    } catch (err) {
      alert(t('msg_action_failed') + ': ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminModal title={t('dash_add_site')} onClose={onClose}>
      <form onSubmit={submit}>
        <label>{t('lbl_site_name')}</label>
        <input value={siteName} onChange={e => setSiteName(e.target.value)} required />
        <div style={{ marginTop: 12 }}>
          <button className="btn-primary" disabled={submitting}>{submitting ? t('btn_adding') : t('dash_add_site')}</button>
          <button type="button" className="btn-outline" onClick={onClose} style={{ marginLeft: 8 }}>{t('btn_cancel')}</button>
        </div>
      </form>
    </AdminModal>
  );
}
