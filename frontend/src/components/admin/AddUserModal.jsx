import React, { useState } from 'react';
import AdminModal from './AdminModal';
import './admin.css';
import { createUser } from './adminService';
import { useLanguage } from '../../context/LanguageContext';
import PhoneInput from '../common/PhoneInput';

export default function AddUserModal({ onClose, onCreated, defaultType = 'site_agent' }) {
  const { t } = useLanguage();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userType, setUserType] = useState(defaultType);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newUser = await createUser({
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
        user_type: userType
      });
      onCreated && onCreated(newUser);
      onClose();
    } catch (err) {
      alert(t('msg_create_fail') + ': ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getTypeLabel = (type) => {
    if (type === 'site_agent') return t('label_site_agent');
    if (type === 'researcher') return t('label_researcher');
    return type;
  };

  return (
    <AdminModal title={`${t('btn_add')} ${getTypeLabel(userType)}`} onClose={onClose}>
      <form onSubmit={submit}>
        <label>{t('reg_fname_ph')}</label>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} required />
        <label>{t('reg_lname_ph')}</label>
        <input value={lastName} onChange={e => setLastName(e.target.value)} required />
        <label>{t('th_email')}</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>{t('reg_phone_ph')}</label>
        <PhoneInput
          value={phoneNumber}
          onChange={(value) => setPhoneNumber(value)}
          placeholder={t('reg_phone_ph')}
        />
        <label>{t('th_type')}</label>
        <select value={userType} onChange={e => setUserType(e.target.value)}>
          <option value="site_agent">{t('label_site_agent')}</option>
          <option value="researcher">{t('label_researcher')}</option>
        </select>
        <div style={{ marginTop: 12 }}>
          <button className="btn-primary" disabled={submitting}>{submitting ? t('btn_adding') : t('btn_add')}</button>
          <button type="button" className="btn-outline" onClick={onClose} style={{ marginLeft: 8 }}>{t('btn_cancel')}</button>
        </div>
      </form>
    </AdminModal>
  );
}
