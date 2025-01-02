import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CentralFeed from './components/CentralFeed'; 
import Dashboard from './pages/Dashboard';
import AboutPage from './pages/AboutPage';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<CentralFeed />} /> {/* Updated route */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
