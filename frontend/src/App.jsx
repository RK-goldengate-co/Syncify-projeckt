import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import RequireRole from './components/RequireRole';
import Dashboard from './pages/Dashboard';
import SocialManager from './pages/SocialManager';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import { seedAdmin } from './utils/auth';

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem('syncify-auth') === 'true');

  const handleLogin = () => {
    setIsAuth(true);
  };

  useEffect(() => {
    // Seed admin account once
    seedAdmin();
  }, []);

  return (
    <Router>
      {isAuth ? (
        <Layout>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/socials" element={<SocialManager />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/analytics"
              element={
                <RequireRole roles={["admin"]}>
                  <Analytics />
                </RequireRole>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireRole roles={["admin"]}>
                  <Admin />
                </RequireRole>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
