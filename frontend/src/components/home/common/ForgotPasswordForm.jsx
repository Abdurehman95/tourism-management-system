import React, { useState } from "react";
import { useLanguage } from '../../../context/LanguageContext';

function ForgotPasswordForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${t('forgot_alert')} ${email}`);
  };

  return (
    <div className="forgot-container">
      <form onSubmit={handleSubmit} className="forgot-form">
        <h2>{t('forgot_title')}</h2>

        <label>{t('forgot_email_label')}</label>
        <input
          type="email"
          className="input-box"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('login_email_ph')}
          required
        />

        <button type="submit" className="btnn">
          {t('forgot_btn')}
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;
