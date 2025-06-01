import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/LandlordApplicationDetail.css';
// done

const LandlordApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchPendingProperties = async () => {
    try {
      const response = await fetch('http://localhost:44357/api/admin/waitingPosts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending properties');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch pending properties');
    }
  };

  const approveProperty = async (id) => {
    try {
      const response = await fetch(`https://localhost:44357/api/admin/accept-post/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Approve Error:', errorText);
        throw new Error(errorText);
      }
      window.location.reload();
      return true;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to approve property');
    }
  };

  const rejectProperty = async (id) => {
    try {
      const response = await fetch(`https://localhost:44357/api/admin/reject-post/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Reject Error:', errorText);
        throw new Error(errorText);
      }
      window.location.reload();

      return true;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to reject property');
    }
  };

  useEffect(() => {
    if (id) {
      localStorage.setItem('currentApplicationId', id);
    }

    const fetchData = async () => {
      try {
        const res = await fetchPendingProperties();
        const applicationData = res.find(item => String(item.id) === String(id));
        setApplication(applicationData || null);
      } catch (error) {
        setMessage('');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleApprove = async () => {
    try {
      console.log('Approving ID:', id);
      await approveProperty(id);
      navigate('/admin/pending-properties');
    } catch (error) {
      setMessage('Failed to approve application');
    }
  };

  const handleReject = async () => {
    try {
      console.log('Rejecting ID:', id);
      await rejectProperty(id);
      navigate('/admin/pending-properties');
    } catch (error) {
      setMessage('Failed to reject application');
    }
  };

  if (loading) return <div className="loading">Loading application details...</div>;

  if (!application) {
    return (
      <div className="alert alert-warning">
        {message || 'No more data .'}
        </div>
    );
  }

  return (
    <div className="landlord-application-detail">
      <h2>Landlord Application Details</h2>
      {message && <div className="alert alert-danger">{message}</div>}

      <div className="application-card">
        <div className="application-header">
          {application.fileBase64 ? (
            <img
              src={`data:image/png;base64,${application.fileBase64}`}
              alt="property"
              style={{ width: '2600px', height: 'auto', borderRadius: '8px' }}
            />
          ) : (
            <span>No image</span>
          )}
        </div>

        <div className="application-body">
          <div className="detail-row">
            <span className="detail-label">Title:</span>
            <span className="detail-value">{application.title || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Description:</span>
            <span className="detail-value">{application.description || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{application.location || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Price:</span>
            <span className="detail-value">{application.price || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Rental Status:</span>
            <span className={`status-badge ${application.rentalStatus || ''}`}>
              {application.rentalStatus || 'N/A'}
            </span>
          </div>
        </div>

        <div className="application-actions">
          <button onClick={() => approveProperty(application.postId)} className="btn btn-success action-btn">
            Approve Application
          </button>
          <button onClick={() => rejectProperty(application.postId)} className="btn btn-danger action-btn">
            Reject Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandlordApplicationDetail;
