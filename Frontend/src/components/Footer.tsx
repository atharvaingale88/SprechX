import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer footer-black">  {/* Added black class for dark theme */}
      <div className="footer-left">
        <img src="/assets/logo.png" alt="SprechX Logo" className="footer-logo footer-logo-small" /> {/* Added small logo class */}
      </div>
      <div className="footer-right">
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>
        <div className="footer-socials">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
        <div className="footer-info">
          <p>&copy; 2024 SprechX. All rights reserved.</p>
          <p>
            <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;