import React from 'react';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About SprechX</h1>
        <p>A Platform for Open Dialogue and Free Expression</p>
      </header>
      <section className="about-content">
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            At SprechX, we believe in the power of open communication and the fundamental right of every individual to express their thoughts and opinions freely. Our mission is to create a safe, inclusive, and vibrant platform where diverse voices can be heard and respected.
          </p>
          <p>
            We strive to foster a community that values open dialogue, critical thinking, and respectful debate. Our goal is to empower users to connect with like-minded individuals, share their perspectives, and learn from others.
          </p>
        </div>
        <div className="about-section">
          <h2>Our Values</h2>
          <ul>
            <li><strong>Freedom of Speech:</strong> We uphold the fundamental right of free speech and protect users' ability to express themselves without fear of censorship.</li>
            <li><strong>Inclusivity:</strong> We strive to create a welcoming and inclusive environment for all users, regardless of their background, beliefs, or perspectives.</li>
            <li><strong>Respect:</strong> We promote respectful discourse and encourage users to treat others with dignity and understanding.</li>
            <li><strong>Transparency:</strong> We are committed to transparency in our operations and decision-making processes.</li>
            <li><strong>Community:</strong> We foster a sense of community and belonging among our users, encouraging them to connect, collaborate, and support one another.</li>
          </ul>
        </div>
      </section>
      <footer className="about-footer">
        <p>&copy; 2024 SprechX. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutPage;