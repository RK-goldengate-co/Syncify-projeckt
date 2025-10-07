import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem('syncify-auth') === 'true';
  return isAuth ? children : <Navigate to="/" />;
}
