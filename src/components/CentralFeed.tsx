import React, { useState } from 'react';
import { FaSmile, FaHeart, FaComment, FaShare, FaThumbsDown } from 'react-icons/fa';
import './CentralFeed.css';
import './RightSidebar.css';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';

interface Comment {
  id: number;
  content: string;
  author: string;
}

interface Post {
  id: number;
  content: string;
  author: {
    walletAddress: string;
    profilePicture: string;
  };
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  comments: number;
  commentList: Comment[];
}

const CentralFeed: React.FC = () => {
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentInputState, setCommentInputState] = useState<Record<number, string>>({});
  const [commentBoxVisible, setCommentBoxVisible] = useState<Record<number, boolean>>({});
  const userWalletAddress = '0x1234567890abcdef';

  const handlePostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  };

  const handlePostSubmit = () => {
    if (!postContent.trim()) return;
    const newPost: Post = {
      id: Date.now(),
      content: postContent,
      author: {
        walletAddress: userWalletAddress,
        profilePicture: 'https://via.placeholder.com/40',
      },
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: [],
      comments: 0,
      commentList: [],
    };
    setPosts([newPost, ...posts]);
    setPostContent('');
  };

  const handleInteraction = (postId: number, type: 'like' | 'dislike') => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          if (
            (type === 'like' && post.likedBy.includes(userWalletAddress)) ||
            (type === 'dislike' && post.dislikedBy.includes(userWalletAddress))
          ) {
            return post;
          }
          return {
            ...post,
            [type === 'like' ? 'likes' : 'dislikes']:
              post[type === 'like' ? 'likes' : 'dislikes'] + 1,
            [type === 'like' ? 'likedBy' : 'dislikedBy']: [
              ...(type === 'like' ? post.likedBy : post.dislikedBy),
              userWalletAddress,
            ],
          };
        }
        return post;
      })
    );
  };

  const handleCommentInputChange = (postId: number, content: string) => {
    setCommentInputState((prevState) => ({
      ...prevState,
      [postId]: content,
    }));
  };

  const handleComment = (postId: number, commentContent: string) => {
    if (!commentContent.trim()) return;
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments + 1,
              commentList: [
                ...post.commentList,
                {
                  id: Date.now(),
                  content: commentContent,
                  author: userWalletAddress,
                },
              ],
            }
          : post
      )
    );
    setCommentInputState((prevState) => ({ ...prevState, [postId]: '' }));
    setCommentBoxVisible((prevState) => ({ ...prevState, [postId]: false }));
  };

  const toggleCommentBox = (postId: number) => {
    setCommentBoxVisible((prevState) => ({ ...prevState, [postId]: !prevState[postId] }));
  };

  return (
    <div className="central-feed">
      <main className="central-feed-main">
        <div className="central-feed-columns">
          <LeftSidebar />
          <section className="central-feed-posts">
            <div className="post-creator">
              <textarea
                className="post-input"
                placeholder="Express yourself..."
                value={postContent}
                onChange={handlePostChange}
              />
              <div className="post-actions">
                <button className="emoji-button" title="Add Emoji">
                  <FaSmile />
                </button>
                <button className="button" onClick={handlePostSubmit}>
                  Post
                </button>
              </div>
            </div>

            {posts.map((post) => (
              <div className="post" key={post.id}>
                <div className="post-header">
                  <img
                    src={post.author.profilePicture}
                    alt={post.author.walletAddress}
                    className="profile-picture"
                  />
                  <span className="wallet-address">{post.author.walletAddress}</span>
                </div>
                <p className="post-content">{post.content}</p>
                <div className="post-actions">
                  <button
                    className="like-button"
                    onClick={() => handleInteraction(post.id, 'like')}
                  >
                    <FaHeart /> {post.likes}
                  </button>
                  <button
                    className="dislike-button"
                    onClick={() => handleInteraction(post.id, 'dislike')}
                  >
                    <FaThumbsDown /> {post.dislikes}
                  </button>
                  <button
                    className="comment-button"
                    onClick={() => toggleCommentBox(post.id)}
                  >
                    <FaComment /> {post.comments}
                  </button>
                  <button className="share-button">
                    <FaShare />
                  </button>
                </div>

                {commentBoxVisible[post.id] && (
                  <div className="comments-section">
                    <textarea
                      className="comment-input"
                      value={commentInputState[post.id] || ''}
                      onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                      placeholder="Write a comment..."
                    />
                    <button
                      className="comment-submit-button"
                      onClick={() => handleComment(post.id, commentInputState[post.id])}
                    >
                      Add Comment
                    </button>
                    {post.commentList.map((comment) => (
                      <div key={comment.id} className="comment">
                        <span className="comment-author">{comment.author}</span>
                        <p className="comment-content">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
          <RightSidebar>{null}</RightSidebar>
        </div>
      </main>
    </div>
  );
};

export default CentralFeed;
