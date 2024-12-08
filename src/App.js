import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Dashboard from './components/Dashboard';
import EventsPage from './pages/EventsPage';
import ParticipantsPage from './pages/ParticipantsPage';
import OrganizersPage from './pages/OrganizersPage';
import Footer from './components/Footer';
import './styles/App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Define como logado se o token existir
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/login'; // Redireciona após logout
  };

  return (
    <Router>
      <div>
        <Navbar isAuthenticated={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage onLogin={setIsLoggedIn} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Rotas principais */}
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/participants" element={<ParticipantsPage />} />
              <Route path="/organizers" element={<OrganizersPage />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
