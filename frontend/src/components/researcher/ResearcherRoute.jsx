import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ResearcherRoute({ children }) {
  const token = localStorage.getItem('researcher_token');
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" replace />; // Redirect to main login or specific researcher login
  }
  return children;
}
