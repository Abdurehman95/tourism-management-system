import React from 'react';
import LoginForm from '../forms/LoginForm';
import '../styles/login.css';

function Login() {
  return (
    <div
      className="login-page"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}
    >
      <LoginForm />
    </div>
  );
}

export default Login;