import React from 'react';
import './Posts.css';

const Posts: React.FC = () => {
  return (
    <div className="posts">
      <h2>Your Posts</h2>
      <ul className="posts-list">
        <li className="post-item">
          <p>Post content here...</p>
          <button>Edit</button>
          <button>Delete</button>
        </li>
        {/* Add more posts here */}
      </ul>
    </div>
  );
};

export default Posts;
