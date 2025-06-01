import { useState, useEffect } from 'react';
import '../styles/PendingApprovals.css';
import axios from 'axios';
// done

const PendingApprovals = () => {
  const [pendingLandlords, setPendingLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [message, setMessage] = useState('');


  useEffect(() => {
    const fetchPendingLandlords = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:44357/api/admin/waitingLandlords');
        setPendingLandlords(response.data);
      } catch (err) {
        console.error(err);
        setMessage('no data more');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingLandlords();
  }, []);

  const handleLandlordAction = async (id, action) => {
    setPendingLandlords(prev => prev.filter(landlord => landlord.userId !== id));

    try {
      const url = `http://localhost:44357/api/admin/${action}-waiting-landlord/${id}`;
      await axios.put(url);
      setSuccessMessage(`Landlord ${action}ed successfully!`);
    } catch (err) {
      console.error(err);
      setError(`Failed to ${action} landlord.`);
      setPendingLandlords(prev => [
        ...prev,
        ...pendingLandlords.filter(landlord => landlord.userId === id),
      ]);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading pending landlords...</p>
      </div>
    );
  }

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-approvals-container">
      <h1>Pending Landlord Approvals</h1>

      {successMessage && <div className="success-message">{successMessage}</div>}

      {pendingLandlords.length > 0 ? (
        <div className="landlords-grid">
          {pendingLandlords.map(landlord => (
            <div key={landlord.userId} className="approval-card">
              <div className="card-header">
                <h3>{landlord.userName}</h3>
                <span className="pending-badge">Pending</span>
              </div>

              <div className="card-body">
                <p><strong>Email:</strong> {landlord.email}</p>
                <p><strong>Username:</strong> {landlord.userName}</p>
              </div>

              <div className="card-actions">
                <div className="approval-buttons">
                  <button
                    onClick={() => handleLandlordAction(landlord.userId, 'accept')}
                    className="approve-button"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleLandlordAction(landlord.userId, 'reject')}
                    className="reject-button"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-items">
          <p>No pending landlord registrations</p>
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;