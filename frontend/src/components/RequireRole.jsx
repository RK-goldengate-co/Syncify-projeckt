import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RequireRole({ roles = [], children }) {
  const isAuth = localStorage.getItem('syncify-auth') === 'true';
  if (!isAuth) return <Navigate to="/" />;
  let user = null;
  try { user = JSON.parse(localStorage.getItem('syncify-current-user') || 'null'); } catch {}
  const role = user?.role || 'user';
  if (roles.length > 0 && !roles.includes(role)) {
    // Không đủ quyền → quay về dashboard
    return <Navigate to="/dashboard" />;
  }
  return children;
}
