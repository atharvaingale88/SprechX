import React from 'react';
import Profile from '../components/Profile';
import Posts from '../components/Posts';
import Statistics from '../components/Statistics';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>
      <main className="dashboard-main">
        <Profile />
        <Posts />
        <Statistics />
      </main>
    </div>
  );
};

export default Dashboard;
