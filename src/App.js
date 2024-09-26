import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import Dashboard from './components/Dashboard';
import EventsPage from './pages/EventsPage';
import ParticipantsPage from './pages/ParticipantsPage';
import OrganizersPage from './pages/OrganizersPage';
import Footer from './components/Footer';
import './styles/App.css'; // Importando o CSS para os temas

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Estado para o modo escuro

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className={darkMode ? 'dark-theme' : 'light-theme'}>
        <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        {isLoggedIn ? (
          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/participants" element={<ParticipantsPage />} />
              <Route path="/organizers" element={<OrganizersPage />} />
            </Routes>
            <Footer />
          </div>
        ) : (
          <LoginPage onLogin={setIsLoggedIn} />
        )}
      </div>
    </Router>
  );
};

export default App;
