import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaHeart, FaRegHeart, FaPaperPlane, FaEnvelope,
  FaComment, FaMapMarkerAlt, FaDollarSign, FaUser,
  FaClock, FaHome, FaTimes
} from 'react-icons/fa';
import '../styles/ShowAllPosts.css';

const ShowAllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [message, setMessage] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:44357/api/Tenant/all-posts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        const safePosts = res.data.map(post => ({
          ...post,
          images: post.images || [],
          fileBase64: post.fileBase64 || null,
          commentCount: post.commentCount || 0
        }));

        setPosts(safePosts);
        setFilteredPosts(safePosts);
      } catch (err) {
        setMessage('No posts found. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCardClick = (postId, e) => {
    if (!e.target.closest('.post-actions')) {
      navigate(`/properties/${postId}`);
    }
  };

  const handleSavePost = async (postId, e) => {
    e.stopPropagation();

    if (!localStorage.getItem('token')) {
      alert('You need to login to save posts');
      navigate('/login');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User not authenticated properly');
      return;
    }

    try {
      if (savedPosts.includes(postId)) {
        alert("You've already saved this post");
        return;
      }

      await axios.post(
        `http://localhost:44357/api/Tenant/${userId}/save-post/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSavedPosts([...savedPosts, postId]);
    } catch (err) {
      alert("You've already saved this post");
    }
  };

  const fetchPostComments = async (postId) => {
    try {
      const res = await axios.get(
        `http://localhost:44357/api/Comments/Post/get-comments/${postId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setComments(res.data || []);
    } catch (err) {
      setError('Failed to load comments');
    }
  };

  const openCommentsModal = async (post, e) => {
    e.stopPropagation();
    setSelectedPost(post);

    if (!localStorage.getItem('token')) {
      alert('You need to login to view comments');
      navigate('/login');
      return;
    }

    await fetchPostComments(post.postId);
    setShowComments(true);
  };

  const closeCommentsModal = () => {
    setShowComments(false);
    setSelectedPost(null);
    setComments([]);
    setNewComment('');
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('You must be logged in to comment');
      navigate('/login');
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:44357/api/Comments/${userId}/add-comment/${selectedPost.postId}`,
        { Comment_description: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const newCommentData = {
        ...res.data,
        user_name: localStorage.getItem('userName') || 'Anonymous'
      };

      setComments([...comments, newCommentData]);
      setNewComment('');

      const updatedPosts = posts.map(post =>
        post.postId === selectedPost.postId
          ? { ...post, commentCount: (post.commentCount || 0) + 1 }
          : post
      );

      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
    }
  };

  const handleSearch = () => {
    const filtered = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = (minPrice ? post.price >= Number(minPrice) : true) &&
        (maxPrice ? post.price <= Number(maxPrice) : true);
      return matchesSearch && matchesPrice;
    });

    setFilteredPosts(filtered);
    setMessage(filtered.length === 0 ? 'No posts found matching your criteria.' : '');
  };

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="posts-container">
      <h1 className="page-title">All Available Properties</h1>

      <div className="search-filters">
        <input
          type="text"
          placeholder="Search by title or location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>

        <div className="price-filters">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
            className="price-input"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
            className="price-input"
          />
          <button onClick={handleSearch} className="filter-button">Apply Filters</button>
        </div>
      </div>

      {message && <div className="message">{message}</div>}

      <div className="posts-grid">
        {filteredPosts.map(post => (
          <div
            key={post.postId}
            className="post-card"
            onClick={(e) => handleCardClick(post.postId, e)}
          >
            {post.fileBase64 ? (
              <img
                src={`data:image/png;base64,${post.fileBase64}`}
                alt={post.title}
                className="post-image"
              />
            ) : (
              <div className="no-image">
                <FaHome className="no-image-icon" />
                <span>No Image Available</span>
              </div>
            )}

            <div className="post-details">
              <h3 className="post-title">{post.title}</h3>
              <div className="post-meta">
                <span className="post-price">
                  <FaDollarSign /> {post.price.toLocaleString()}
                </span>
                <span className="post-location">
                  <FaMapMarkerAlt /> {post.location}
                </span>
              </div>
              <p className="post-description">
                {post.description.length > 100
                  ? `${post.description.substring(0, 100)}...`
                  : post.description}
              </p>

              <div className="post-footer">
                <div className="post-date">
                  <FaClock /> {new Date(post.datePost).toLocaleDateString()}
                </div>

                <div className="post-actions">
                  {userRole !== 'admin' && (
                    <>
                      <button
                        className={`save-btn ${savedPosts.includes(post.postId) ? 'saved' : ''}`}
                        onClick={(e) => handleSavePost(post.postId, e)}
                      >
                        {savedPosts.includes(post.postId) ? (
                          <>
                            <FaHeart /> Saved
                          </>
                        ) : (
                          <>
                            <FaRegHeart /> Save
                          </>
                        )}
                      </button>

                      <button
                        className="comment-btn"
                        onClick={(e) => openCommentsModal(post, e)}
                      >
                        <FaComment /> Comments
                      </button>
                    </>
                  )}
                </div>

              </div>
            </div>

          </div>
        ))}
      </div>





      {showComments && selectedPost && (
        <div className="comments-modal-overlay">
          <div className="comments-modal">
            <div className="modal-header">
              <h2>
                <FaComment /> Comments ({comments.length})
              </h2>
              <button className="close-button" onClick={closeCommentsModal}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="post-info">
                <h3>{selectedPost.title}</h3>
                <p className="post-meta">
                  <span className="price">
                    <FaDollarSign /> {selectedPost.price.toLocaleString()}
                  </span>
                  <span className="location">
                    <FaMapMarkerAlt /> {selectedPost.location}
                  </span>
                </p>
              </div>

              <form onSubmit={handleSubmitComment} className="comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment..."
                  required
                  className="comment-input"
                />
                <button type="submit" className="submit-button">
                  <FaPaperPlane /> Post Comment
                </button>
              </form>

              <div className="comments-list">
                {comments.length === 0 ? (
                  <p className="no-comments">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map(comment => (
                    <div key={comment.comment_Id} className="comment-item">
                      <div className="comment-header">
                        <span className="comment-author">
                          <FaUser /> {comment.user_name || 'Anonymous'}
                        </span>
                        <span className="comment-date">
                          {new Date(comment.date_comment).toLocaleString()}
                        </span>
                      </div>
                      <p className="comment-text">{comment.comment_description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowAllPosts;