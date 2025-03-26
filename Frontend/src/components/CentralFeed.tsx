import React, { useState, useEffect } from 'react';
import { FaSmile, FaHeart, FaComment, FaShare, FaThumbsDown } from 'react-icons/fa';
import './CentralFeed.css';
import './RightSidebar.css';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { identity, submitPost, getPostsForUser } from 'deso-protocol';

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

/*interface BlockchainPost {
  PostHashHex: string;
  Body: string;
  TimestampNanos: number;
  ProfileEntryResponse: {
    PublicKeyBase58Check: string;
    Username: string;
    ProfilePic: string;
  };
}*/

const CentralFeed: React.FC = () => {
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  //const [blockchainPosts, setBlockchainPosts] = useState<BlockchainPost[]>([]);
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

  const handlePostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  };

  const handlePostSubmit = async () => {
    if (!userWalletAddress){
      alert('Please connect wallet to create a post');
      return;
    };
    if (!postContent.trim()){
      alert('post cannot be empty');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/create-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publickey: userWalletAddress, content: postContent })
      });
      
      /*const response = await submitPost({
        UpdaterPublicKeyBase58Check: identity.snapshot().currentUser?.publicKey!,
        BodyObj: {
          Body: postContent,
          ImageURLs: [],
          VideoURLs: []
        },},
        {nodeURI: 'https://test.deso.org'}
      );*/

      console.log('Post signed and submited:', response);
      const result = await response.json();    //const result = await response
      
      if (result.txn_hash){  //result.submittedTransactionResponse?.TxnHashHex
        // Add to local state and blockchain posts
        const newPost: Post = {
          id: Date.now(),
          content: postContent,
          author: {
            walletAddress: userWalletAddress,
            profilePicture: '/assets/sample-profilepicture.png',
          },
          likes: 0,
          dislikes: 0,
          likedBy: [],
          dislikedBy: [],
          comments: 0,
          commentList: [],
          blockchainData: {
            txnHash: result.txn_hash,  //result.submittedTransactionResponse.TxnHashHex,
            explorerLink: result.explorer_link,   //"https://explorer-testnet.deso.com/txn/" + result.submittedTransactionResponse.TxnHashHex,
          },
        };
        
        setPosts([newPost, ...posts]);
        setPostContent('');
        alert(`Post added to blockchain!\nVerify: ${result.explorer_link}`); //${"https://explorer-testnet.deso.com/txn/" + result.submittedTransactionResponse.TxnHashHex}`);
        //window.location.reload();
      }
    } catch (error) {
      console.error('Blockchain post failed:', error);
      alert('Failed to post to blockchain');
    }
  };

  useEffect(() => {
    const fetchBlockchainPosts = async () => {
      if (!userWalletAddress) {
        console.error('No public key found');
        return;
      }
  
      try {
        const response = await getPostsForUser({
          PublicKeyBase58Check: userWalletAddress,
          NumToFetch: 10,
          MediaRequired: false,
          OnlyPosts: true
        }, {nodeURI: 'https://test.deso.org'});
        
        console.log('Fetched blockchain posts:', response);
        const fetchedPosts = response.Posts || [];
  
        const formattedPosts: Post[] = fetchedPosts.map((post, index) => ({
          id: index + 1,
          content: post.Body,
          author: {
            walletAddress: post.PosterPublicKeyBase58Check,
            profilePicture: '/assets/sample-profilepicture.png',
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
  
    fetchBlockchainPosts();

    /*const fetchBlockchainPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        setBlockchainPosts(data);
      } catch (error) {
        console.error('Error fetching blockchain posts:', error);
      }
    };
    
    fetchBlockchainPosts();*/
  }, [userWalletAddress]);

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

            {posts.length > 0 ? (
              posts.map((post) => (
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
              <p>Please post something ...</p>
            )}
          </section>
          <RightSidebar>{null}</RightSidebar>
        </div>
      </main>
    </div>
  );
};

export default CentralFeed;
