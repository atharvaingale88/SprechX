import React from 'react';
import './Statistics.css';

const Statistics: React.FC = () => {
  return (
    <div className="statistics">
      <h2>Statistics</h2>
      <div className="stats-item">
        <h3>Total Posts</h3>
        <p>10</p>
      </div>
      <div className="stats-item">
        <h3>Followers</h3>
        <p>250</p>
      </div>
      <div className="stats-item">
        <h3>Likes</h3>
        <p>1,200</p>
      </div>
    </div>
  );
};

export default Statistics;
