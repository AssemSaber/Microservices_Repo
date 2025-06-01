import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/UserProperties.css';
import { FaCalendarAlt, FaTrashAlt, FaEnvelope } from 'react-icons/fa';
import { RingLoader } from 'react-spinners';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// done

const getUserId = () => localStorage.getItem('userId');
const getToken = () => localStorage.getItem('token');

const MyProperties = () => {
  const [myProperties, setMyProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const tenantId = getUserId();
  const token = getToken();

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const response = await axios.get(`http://localhost:44357/api/Tenant/my-proposals/${tenantId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMyProperties(response.data);
      } catch (err) {
        console.error('Error fetching user properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyProperties();
  }, [tenantId, token]);

  const deleteProperty = async (proposalId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`http://localhost:44357/api/Tenant/cancel-proposal/${proposalId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMyProperties(myProperties.filter((property) => property.proposalId !== proposalId));
      } catch (err) {
        console.error('Error deleting property:', err);
        alert('Failed to delete property. Please try again later.');
      }
    }
  };

  const renderStatusButton = (status) => {
    switch (status) {
      case 'Pending':
        return <button className="status-button pending">Pending</button>;
      case 'Approved':
        return <button className="status-button accepted">Approved</button>;
      case 'Rejected':
        return <button className="status-button rejected">Rejected</button>;
      default:
        return <button className="status-button unknown">Unknown</button>;
    }
  };

  const handleMessageClick = (userId) => {
    if (!localStorage.getItem('token')) {
      alert('You need to login to send a message');
      navigate('/login');
      return;
    } else {
      navigate(`/messages/${userId}`); 
    }
  };
  
  return (
    <div className="my-properties-container">
      <h1 className="my-properties-header">My Properties</h1>

      {loading ? (
        <div className="loading-spinner">
          <RingLoader color="#3498db" size={60} />
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : myProperties.length > 0 ? (
        <div className="properties-list">
          {myProperties.map((property) => (
            <div key={property.postId} className="property-card">
              <div className="property-file">
                {property.fileBase64 && property.fileName?.endsWith('.pdf') ? (
                  <embed
                    src={`data:application/pdf;base64,${property.fileBase64}`}
                    type="application/pdf"
                    width="100%"
                    height="500px"
                    alt="Property Document"
                  />
                ) : (
                  <div className="no-file">No PDF File</div>
                )}
              </div>
              <div className="property-info">
                <h3>{property.phone}</h3>
                <p><FaCalendarAlt /> From: {new Date(property.startRentalDate).toLocaleDateString()}</p>
                <p><FaCalendarAlt /> To: {new Date(property.endRentalDate).toLocaleDateString()}</p>
                <p>Status: {property.rentalStatus}</p>
                {renderStatusButton(property.rentalStatus)}
                {property.rentalStatus === 'Approved' && (
                  <button
                    className="message-button"
                    onClick={() => handleMessageClick(property.landlordId)} 
                  >
                    <FaEnvelope /> Message User
                  </button>
                )}
              </div>
              <div className="property-actions">
                <button onClick={() => deleteProperty(property.proposalId)} className="delete-button">
                  <FaTrashAlt /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-properties">
          <p>You haven’t posted any properties yet</p>
        </div>
      )}
    </div>
  );
};

export default MyProperties;
