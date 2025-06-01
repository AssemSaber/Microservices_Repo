import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaFileAlt, FaUser, FaCalendarAlt, FaPhone, FaInfoCircle } from 'react-icons/fa';
import { RingLoader } from 'react-spinners';
import '../styles/PropertyProposals.css';
// done

const getLandlordId = () => {
  return localStorage.getItem('userId');
};

const PropertyProposals = () => {
  const [submittedData, setSubmittedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const landlordId = getLandlordId();
  const token = localStorage.getItem('token');

  const fetchAllProposals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:44357/api/Landlord/proposals/${landlordId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSubmittedData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProposals();
  }, []);

  const approveProposal = async (proposalId) => {
    try {
      await axios.put(`http://localhost:44357/api/Landlord/accept-waiting-proposal/${proposalId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedData = submittedData.map((item) =>
        item.proposalId === proposalId ? { ...item, rentalStatus: 'Approved' } : item
      );
      setSubmittedData(updatedData);
    } catch (error) {
      console.error('Error approving proposal:', error);
      alert('Failed to approve proposal. Please try again.');
    }
  };

  const rejectProposal = async (proposalId) => {
    try {
      await axios.put(`http://localhost:44357/api/Landlord/reject-waiting-proposal/${proposalId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedData = submittedData.map((item) =>
        item.proposalId === proposalId ? { ...item, rentalStatus: 'Rejected' } : item
      );
      setSubmittedData(updatedData);
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      alert('Failed to reject proposal. Please try again.');
    }
  };

  const openModal = (proposal) => {
    setSelectedProposal(proposal);
  };

  const closeModal = () => {
    setSelectedProposal(null);
  };

  const getStatusClass = (status) => {
    if (!status) return 'pending';
    return status.toLowerCase();
  };

  return (
    <div className="proposals-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <span className="title-highlight">Rental</span> Applications
        </h1>
        <p className="dashboard-subtitle">Manage tenant proposals for your properties</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <RingLoader color="#4a6bff" size={80} />
          <p className="loading-text">Loading applications...</p>
        </div>
      ) : submittedData.length > 0 ? (
        <div className="proposals-grid">
          {submittedData.map((data) => (
            <div key={data.proposalId} className={`proposal-card ${getStatusClass(data.rentalStatus)}`}>
              <div className="card-header">
                <span className="proposal-id">Application #{data.proposalId}</span>
                <span className="status-badge">
                  {data.rentalStatus || 'Pending Review'}
                </span>
              </div>

              <div className="tenant-info">
                <div className="tenant-avatar">
                  {data.tenantName ? data.tenantName.charAt(0).toUpperCase() : 'T'}
                </div>
                <div className="tenant-details">
                  <h3>{data.tenantName || 'Anonymous Tenant'}</h3>
                  <p className="tenant-contact">
                    <FaPhone /> {data.phone || 'No phone provided'}
                  </p>
                </div>
              </div>

              <div className="rental-period">
                <div className="period-item">
                  <FaCalendarAlt className="period-icon" />
                  <div>
                    <p className="period-label">Move-in Date</p>
                    <p className="period-date">
                      {new Date(data.startRentalDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="period-item">
                  <FaCalendarAlt className="period-icon" />
                  <div>
                    <p className="period-label">Move-out Date</p>
                    <p className="period-date">
                      {new Date(data.endRentalDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {data.fileBase64 && (
                <button 
                  onClick={() => openModal(data)}
                  className="document-btn"
                >
                  <FaFileAlt /> View Application Document
                </button>
              )}

              <div className="action-buttons">
                <button
                  onClick={() => approveProposal(data.proposalId)}
                  className="approve-btn"
                  disabled={data.rentalStatus === 'Approved'}
                >
                  <FaCheck /> {data.rentalStatus === 'Approved' ? 'Approved' : 'Approve'}
                </button>
                <button
                  onClick={() => rejectProposal(data.proposalId)}
                  className="reject-btn"
                  disabled={data.rentalStatus === 'Rejected'}
                >
                  <FaTimes /> {data.rentalStatus === 'Rejected' ? 'Rejected' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <FaInfoCircle />
          </div>
          <h3>No Applications Yet</h3>
          <p>You haven't received any rental applications yet.</p>
        </div>
      )}

      {selectedProposal && (
        <div className="document-modal">
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal-container">
            <div className="modal-header">
              <h2>Tenant Application Document</h2>
              <button onClick={closeModal} className="close-modal">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <embed
                src={`data:application/pdf;base64,${selectedProposal.fileBase64}`}
                type="application/pdf"
                className="document-viewer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyProposals;