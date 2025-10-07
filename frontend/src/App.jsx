import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import SocialManager from './pages/SocialManager';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Login from './pages/Login';

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem('syncify-auth') === 'true');

  const handleLogin = () => {
    setIsAuth(true);
  };

  if (!isAuth) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/socials" element={<SocialManager />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
