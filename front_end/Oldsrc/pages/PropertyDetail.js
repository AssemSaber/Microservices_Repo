import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaHeart, FaRegHeart, FaPaperPlane, FaEnvelope, FaCalendarAlt, FaPhone,
  FaFileUpload, FaComment, FaMapMarkerAlt, FaDollarSign, FaUser, FaClock, 
  FaHome, FaTimes, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import '../styles/PropertyDetail.css';

const PropertyDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    startRentalDate: '',
    endRentalDate: '',
    file: null,
  });
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const getTenantRole = () => localStorage.getItem('role');
  const getTenantId = () => localStorage.getItem('userId');

  const tenantId = getTenantId();
  const tenantRole = getTenantRole();

  const isAdmin = tenantRole === 'admin';
  const isLandlord = tenantRole === 'landlord';
  const isTenant = tenantRole === 'tenant';

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:44357/api/Landlord/get-post/${postId}`);
        setPost(res.data);
      } catch (err) {
        setError('Failed to load post details.');
      }
    };
    if (postId) fetchPost();
  }, [postId]);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const goToPrevImage = (e) => {
    e.stopPropagation();
    if (post.fileBase64s && post.fileBase64s.length > 0) {
      setCurrentImageIndex(prevIndex => 
        prevIndex === 0 ? post.fileBase64s.length - 1 : prevIndex - 1
      );
    }
  };

  const goToNextImage = (e) => {
    e.stopPropagation();
    if (post.fileBase64s && post.fileBase64s.length > 0) {
      setCurrentImageIndex(prevIndex => 
        prevIndex === post.fileBase64s.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handleMessageClick = () => {
    if (!localStorage.getItem('token')) {
      alert('You need to login to send a message');
      navigate('/login');
      return;
    } else {
      navigate(`/messages/${post.userId}`); 
    }
  };
  
  const handleApplyClick = () => {
    try {
      if (!tenantRole) {
        alert('You must be logged in'); 
        navigate("/login");
        return; 
      }
      setShowForm(true); 
    } catch (err) {
      console.error('Error in handleApplyClick:', err);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value, 
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const toISOStringSafe = (value) => {
      try {
        return new Date(value).toISOString();
      } catch {
        return '';
      }
    };
    const data = new FormData();
    data.append('TenantId', tenantId);
    data.append('Phone', formData.phone);
    data.append('StartRentalDate', toISOStringSafe(formData.startRentalDate));
    data.append('EndRentalDate', toISOStringSafe(formData.endRentalDate));
    data.append('File', formData.file);
    try {
      await axios.post(`http://localhost:44357/api/Tenant/submit-proposal/${postId}`, data);
      alert('Application submitted successfully!');
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data || 'Failed to submit the application.');
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const tenantId = localStorage.getItem('userId');
      if (!token || !tenantId) {
        alert('Please log in first');
        navigate("/login")
        return;
      }
      const response = await axios.post(
        `http://localhost:44357/api/Tenant/${tenantId}/save-post/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSaved(true);
    } catch (error) {
      alert("You've already saved this post");
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:44357/api/Comments/Post/get-comments/${postId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setComments(res.data || []);
      setShowComments(true);
    } catch (err) {
      setComments([]);
      setShowComments(true);
    }
  };

  const handleSubmitComment = async (e) => {
    try {
      if (!tenantRole) {
        alert('You must be logged in'); 
        navigate("/login");
        return; 
      }
      e.preventDefault();
      const res = await axios.post(
        `http://localhost:44357/api/Comments/${tenantId}/add-comment/${postId}`,
        { Comment_description: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (err) {
      setError('Failed to post comment');
    }
  };
  

  if (error) {
    return (
      <div className="error-message">
        {typeof error === 'object' ? (
          <div>
            <h4>{error.title || 'Error'}</h4>
            {error.errors && Object.entries(error.errors).map(([key, messages], index) => (
              <p key={index}><strong>{key}:</strong> {messages.join(', ')}</p>
            ))}
          </div>
        ) : (
          <p>{error}</p>
        )}
      </div>
    );
  }

  if (!post) return <div className="loading">Loading property details...</div>;

  return (
    <div className="property-detail-container">
      <div className="property-header">
        <h1 className="property-title">{post.title}</h1>
        <div className="property-price">
          <FaDollarSign className="price-icon" />
          <span>{post.price.toLocaleString()}</span>
          <span className="price-period">/month</span>
        </div>
      </div>

      <div className="property-gallery-container">
        <div 
          className="property-main-image-wrapper"
          onClick={() => openLightbox(currentImageIndex)}
        >
          {post.fileBase64s && post.fileBase64s.length > 0 ? (
            <img 
              src={`data:image/png;base64,${post.fileBase64s[currentImageIndex]}`} 
              alt={`Property ${currentImageIndex + 1}`} 
              className="property-main-image"
            />
          ) : post.fileBase64 ? (
            <img 
              src={`data:image/png;base64,${post.fileBase64}`} 
              alt="Property" 
              className="property-main-image"
            />
          ) : (
            <div className="no-image-placeholder">
              <FaHome className="no-image-icon" />
              <p>No images available</p>
            </div>
          )}
        </div>

        {post.fileBase64s && post.fileBase64s.length > 1 && (
          <div className="property-thumbnails">
            {post.fileBase64s.map((img, index) => (
              <div 
                key={index} 
                className={`thumbnail-container ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img
                  src={`data:image/png;base64,${img}`}
                  alt={`Thumbnail ${index + 1}`}
                  className="property-thumbnail"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="property-details">
        <div className="details-section">
          <h2 className="section-title">
            <FaMapMarkerAlt className="section-icon" />
            Location
          </h2>
          <p className="location-text">{post.location}</p>
        </div>

        <div className="details-section">
          <h2 className="section-title">
            <FaHome className="section-icon" />
            Description
          </h2>
          <p className="description-text">{post.description}</p>
        </div>

        <div className="property-meta">
          <div className="meta-item">
            <FaUser className="meta-icon" />
            <span>Posted by: {post.userName}</span>
          </div>
          <div className="meta-item">
            <FaClock className="meta-icon" />
            <span>Posted on: {new Date(post.datePost).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="property-actions">
        {isTenant && (
          <button className="action-button message" onClick={handleMessageClick}>
            <FaEnvelope className="button-icon" />
            Message
          </button>
        )}
        {!isAdmin && !isLandlord && (
          <button className="action-button apply" onClick={handleApplyClick}>
            <FaPaperPlane className="button-icon" />
            Apply
          </button>
        )}
        {!isAdmin && (
          <>
            <button className={`action-button save ${saved ? 'saved' : ''}`} onClick={handleSave}>
              {saved ? (
                <>
                  <FaHeart className="button-icon" />
                  Saved
                </>
              ) : (
                <>
                  <FaRegHeart className="button-icon" />
                  Save
                </>
              )}
            </button>
            <button className="action-button comments" onClick={fetchComments}>
              <FaComment className="button-icon" />
              Comments
            </button>
          </>
        )}
      </div>

      {showForm && (
        <div className="application-modal">
          <div className="modal-content">
            <h2 className="modal-title">
              <FaPaperPlane className="title-icon" />
              Application Form
            </h2>
            <form onSubmit={handleSubmit} className="application-form">
              <div className="form-group">
                <label>
                  <FaPhone className="input-icon" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  required
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>
                  <FaCalendarAlt className="input-icon" />
                  Start Rental Date
                </label>
                <input
                  type="datetime-local"
                  name="startRentalDate"
                  required
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>
                  <FaCalendarAlt className="input-icon" />
                  End Rental Date
                </label>
                <input
                  type="datetime-local"
                  name="endRentalDate"
                  required
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>
                  <FaFileUpload className="input-icon" />
                  Upload Documents (PDF/Image)
                </label>
                <input
                  type="file"
                  name="file"
                  accept="image/*,application/pdf"
                  required
                  onChange={handleInputChange}
                  className="file-input"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showComments && (
        <div className="comments-modal">
          <div className="modal-content">
            <div className="comments-header">
              <h2 className="modal-title">
                <FaComment className="title-icon" />
                Comments ({comments.length})
              </h2>
              <button className="close-button" onClick={() => setShowComments(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitComment} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                required
                className="comment-input"
              />
              <button type="submit" className="submit-comment">
                <FaPaperPlane className="submit-icon" />
                Post Comment
              </button>
            </form>

            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="no-comments">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.comment_Id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">
                        <FaUser className="comment-icon" />
                        {comment.user_name || 'Anonymous'}
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
      )}

      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <button 
            className="lightbox-close" 
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
          >
            <FaTimes />
          </button>
          
          <div 
            className="lightbox-content" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="lightbox-nav prev" 
              onClick={goToPrevImage}
            >
              <FaChevronLeft />
            </button>
            
            <img 
              src={`data:image/png;base64,${
                post.fileBase64s 
                  ? post.fileBase64s[currentImageIndex] 
                  : post.fileBase64
              }`} 
              alt="Enlarged view" 
              className="lightbox-image"
            />
            
            <button 
              className="lightbox-nav next" 
              onClick={goToNextImage}
            >
              <FaChevronRight />
            </button>
          </div>
          
          {post.fileBase64s && post.fileBase64s.length > 1 && (
            <div className="lightbox-thumbnails">
              {post.fileBase64s.map((img, index) => (
                <img
                  key={index}
                  src={`data:image/png;base64,${img}`}
                  alt={`Thumb ${index + 1}`}
                  className={`lightbox-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;