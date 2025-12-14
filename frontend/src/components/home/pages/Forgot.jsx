import React from "react";
import "../styles/forgot.css";
import ForgotPasswordForm from '../common/ForgotPasswordForm';
import ThemeToggle from '../../common/ThemeToggle';

function Forgot() {
  return (
    <div className="login-page" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>
        <ThemeToggle />
      </div>
      <ForgotPasswordForm />
    </div>
  );
}

export default Forgot;
