import React from 'react';
import { Link } from 'react-router-dom';
import './LeftSidebar.css';
import { FaHome, FaBell, FaCompass, FaEnvelope, FaUser, FaEllipsisH } from 'react-icons/fa';

const LeftSidebar: React.FC = () => {
  return (
    <aside className="homepage-sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li><Link to="/" className="nav-button"><FaHome /> Home</Link></li>
          <li><Link to="/notifications" className="nav-button"><FaBell /> Notifications</Link></li>
          <li><Link to="/discover" className="nav-button" ><FaCompass /> Discover</Link></li>
          <li><Link to="/message" className="nav-button" ><FaEnvelope /> Messages</Link></li>
          <li><Link to="/profile" className="nav-button"><FaUser /> Profile</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default LeftSidebar;
