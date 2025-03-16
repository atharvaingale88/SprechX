import React from 'react';
import './Profile.css';

const Profile: React.FC = () => {
  return (
    <div className="profile">
      <h2>Profile</h2>
      <div className="profile-info">
        <img src="/assets/profile-placeholder.png" alt="Profile" className="profile-pic" />
        <div className="profile-details">
          <h3>Username</h3>
          <p>Email: user@example.com</p>
          <p>Wallet Address: 0x1234...abcd</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
