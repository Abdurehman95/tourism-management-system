import React from 'react';
import RegisterForm from '../forms/RegisterForm';
import '../styles/register.css';

function Register() {
  return (
    <div
      className="register-page"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}
    >
      <RegisterForm />
    </div>
  );
}

export default Register;