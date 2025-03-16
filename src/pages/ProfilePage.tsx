import React from 'react';
import './ProfilePage.css';
import { FaEdit } from 'react-icons/fa';

const ProfilePage: React.FC = () => {
  // Mock data - replace with actual user data
  const user = {
    walletAddress: '0x1234...abcd',
    profilePicture: '/assets/sample-profilepicture.png',
    //email: 'user@example.com',
    bio: 'hello, welcome to my profile.',
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={user.profilePicture} alt="Profile" className="profile-picture" />
        <h1 className="profile-name">User Profile</h1>
      </div>
      <div className="profile-info">
        <div className="profile-detail">
          <span className="detail-label">Wallet Address:</span>
          <span className="detail-value">{user.walletAddress}</span>
        </div>
        {/*<div className="profile-detail">
          <span className="detail-label">email:</span>
          <span className="detail-value">{user.email}</span>
        </div>*/}
        <div className="profile-detail">
          <span className="detail-label">Bio:</span>
          <p className="detail-value">{user.bio}</p>
        </div>
        <button className="edit-button">
          <FaEdit /> Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
