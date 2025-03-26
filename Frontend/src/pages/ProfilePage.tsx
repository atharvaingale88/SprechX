import React, {useState, useEffect} from 'react';
import './ProfilePage.css';
import { FaEdit } from 'react-icons/fa';
import { identity } from 'deso-protocol';

const ProfilePage: React.FC = () => {
  const address = identity.snapshot().currentUser?.publicKey;
  const [desobalance, setdesobalance] = useState<string | null>(null)

  useEffect(() => {
      const fetchBalace = async () => {
        if (!address) {
          alert("Please connect your wallet to see your profile.");
          console.error('No public key found');
          return;
        }

        try {
          const response = await fetch(`http://localhost:5000/api/balance?publickey=${address}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setdesobalance(data.deso_balance);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      };
      
      fetchBalace();
    }, [address]);

  // Mock data - replace with actual user data
  const user = {
    walletAddress: address,
    balance: desobalance,
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
          <span className="detail-label">Balance:</span>
          <span className="detail-value">{user.balance}</span>
        </div>
        {/*<div className="profile-detail">
          <span className="detail-label">email:</span>
          <span className="detail-value">{user.email}</span>
        </div>*/}
        <div className="profile-detail">
          <span className="detail-label">Bio:</span>
          {address && <p className="detail-value">{user.bio}</p>}
        </div>
        <button className="edit-button">
          <FaEdit /> Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
