import React, { useState, useEffect } from 'react';
import { identity, getPostsStateless, getHotFeed} from 'deso-protocol';
import { FaHeart, FaComment, FaShare, FaThumbsDown } from 'react-icons/fa';
import './Discover.css';

interface Comment {
  id: number;
  content: string;
  author: string;
}

interface BlockchainData {
  txnHash: string;
  explorerLink: string;
}

interface Post {
  id: number;
  content: string;
  author: {
    walletAddress: string | undefined;
    profilePicture: string;
  };
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  comments: number;
  commentList: Comment[];
  blockchainData?: BlockchainData;
}

const Discover: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [commentInputState, setCommentInputState] = useState<Record<number, string>>({});
  const [commentBoxVisible, setCommentBoxVisible] = useState<Record<number, boolean>>({});
  const userWalletAddress = identity.snapshot().currentUser?.publicKey;

  identity.configure({
        spendingLimitOptions: {
          // NOTE: this value is in Deso nanos, 1000000000 nanos (or 1e9) = 1 Deso
          GlobalDESOLimit: 1 * 1e9,
          TransactionCountLimitMap: {
            SUBMIT_POST: 'UNLIMITED',
          },
          //IsUnlimited: true,
        },
        network: 'testnet',
        nodeURI: 'https://test.deso.org',
        appName: 'SprechX',
      });
  
  useEffect(() => {
    const fetchPosts = async () => {
      if (!userWalletAddress) {
        alert("Please connect your wallet to see posts.");
        return;
      }
        
        try {
          const response = await getPostsStateless({
            ReaderPublicKeyBase58Check: userWalletAddress,
            OrderBy: 'Newest',
            OnlyPosts: true,
            MediaRequired: true,
          }, {nodeURI: 'https://test.deso.org'});
          
          console.log('Fetched blockchain posts:', response);
          const fetchedPosts = response.PostsFound || [];
    
          const formattedPosts: Post[] = fetchedPosts.map((post, index) => ({
            id: index + 1,
            content: post.Body,
            author: {
              walletAddress: post.PosterPublicKeyBase58Check,
              profilePicture: post.ProfileEntryResponse?.ExtraData?.LargeProfilePicURL || '/assets/sample-profilepicture.png',
            },
            likes: post.LikeCount,
            dislikes: 0,
            likedBy: [],
            dislikedBy: [],
            comments: post.CommentCount,
            commentList: [],
            blockchainData: {
              txnHash: post.PostHashHex,
              explorerLink: `https://explorer-testnet.deso.com/txn/${post.PostHashHex}`,
            }
          }));
    
          setPosts(formattedPosts);
        } catch (error) {
          console.error('Error fetching posts from blockchain:', error);
        }
      };

    fetchPosts();
  }, [userWalletAddress]);

  const filteredposts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInteraction = (postId: number, type: 'like' | 'dislike') => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          if (
            (type === 'like' && post.likedBy.includes(userWalletAddress!)) ||
            (type === 'dislike' && post.dislikedBy.includes(userWalletAddress!))
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
                  author: userWalletAddress!,
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
    <div className="discover">
      <div className="discover-header">
        <h1>Discover</h1>
        <input
          type="text"
          placeholder="Search posts"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>
      <div className="discover-main">
        {filteredposts.length > 0 ? (
          filteredposts.map((post) => (
            <div className="post" key={post.id}>
              <div className="post-header">
                <img
                  src={post.author.profilePicture}
                  alt=""
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
              {post.blockchainData && (
                <div className="blockchain-verification">
                  <a href={post.blockchainData.explorerLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="blockchain-link">
                    🔗 View on Blockchain Explorer
                  </a>
                </div>
              )}
            </div>
          ))) : (
          <p>No posts found</p>
        )}
      </div>
    </div>
  );
};

export default Discover;
