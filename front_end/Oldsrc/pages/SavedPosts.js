import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SavedPosts.css';
// done

const getTenantRole = () => {
  return localStorage.getItem('role');
};
const getTenantId = () => {
  return localStorage.getItem('userId');
};

const tenantId = getTenantId();
const tenantRole = getTenantRole();

const SavedPosts = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');


  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const res = await axios.get(`http://localhost:44357/api/Tenant/My-saved-posts/${tenantId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSavedProperties(res.data);
      } catch (err) {
        setMessage('')
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, []);

  const removeSavedProperty = async (propertyId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:44357/api/Tenant/${tenantId}/cancel-save/${propertyId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSavedProperties(savedProperties.filter(prop => prop.postId !== propertyId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove saved property');
    }
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  if (loading) return <div className="loading">Loading saved properties...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="saved-posts">
      <h1 className="page-title">Your Saved Properties</h1>

      {savedProperties.length > 0 ? (
        <div className="saved-properties-grid">
          {savedProperties.map(property => (
            <div
              key={property.postId}
              className="saved-property-item"
              onClick={() => handlePropertyClick(property.postId)}
            >
              {property.fileBase64 ? (
                <img
                  src={`data:image/png;base64,${property.fileBase64}`}
                  alt={property.title || 'property'}
                  style={{ width: '100px', height: 'auto', borderRadius: '8px' }}
                />
              ) : (
                <span>No image</span>
              )}

              <div className="property-details">
                <h3 className="property-title">{property.title}</h3>
                <div className="price-location">
                  <span className="price">${property.price}</span>
                  <span className="location">{property.location}</span>
                </div>

                <p className="property-description">
                  {property.description?.length > 100
                    ? `${property.description.substring(0, 100)}...`
                    : property.description}
                </p>

                <div className="property-meta">
                  {property.bedrooms && <span className="meta-item">{property.bedrooms} beds</span>}
                  {property.bathrooms && <span className="meta-item">{property.bathrooms} baths</span>}
                  {property.size && <span className="meta-item">{property.size} sqft</span>}
                </div>
              </div>

              <button
                className="remove-btn"
                onClick={(e) => removeSavedProperty(property.postId, e)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-saved-container">
          <p className="no-saved-message">You haven't saved any properties yet</p>
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
