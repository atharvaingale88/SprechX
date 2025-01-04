import React, { useState, useEffect } from 'react';
import './Discover.css';

interface Post {
  id: number;
  user: string;
  content: string;
  likes: number;
  tags: string[];
}

const Discover: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      const data: Post[] = [
        { id: 1, user: '0x1234...abcd', content: 'Exploring the beauty of nature! #travel #photography', likes: 120, tags: ['travel', 'photography'] },
        { id: 2, user: '0x1234...abcd', content: 'Just made this delicious recipe! #cooking #food', likes: 95, tags: ['cooking', 'food'] },
        { id: 3, user: '0x1234...abcd', content: 'The future is tech! #AI #blockchain', likes: 150, tags: ['AI', 'blockchain'] },
      ];
      setPosts(data);
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="discover">
      <div className="discover-header">
        <h1>Discover</h1>
        <input
          type="text"
          placeholder="Search posts or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>
      <div className="discover-main">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <h2>@{post.user}</h2>
              <p>{post.content}</p>
              <div className="post-info">
                <span>{post.likes} likes</span>
                <div className="tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>
    </div>
  );
};

export default Discover;
