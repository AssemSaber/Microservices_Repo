import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandlordDashboard.css';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaCheckCircle, FaClock, FaEnvelope, FaComments, FaPlus, FaClipboardList, FaInbox, FaBuilding , FaUsers , FaFileAlt, FaShieldAlt , FaChartLine , FaHandshake , FaUser  } from 'react-icons/fa';
import { RingLoader } from 'react-spinners';
// done

const LandlordDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const userData = profile?.user;

    if (!userData || userData.role?.toLowerCase() !== 'landlord') {
      navigate('/unauthorized');
      return;
    }

    setUser(userData);

    const savedStats = JSON.parse(localStorage.getItem('landlordStats'));
    const savedActivity = JSON.parse(localStorage.getItem('recentActivity'));

    setStats(savedStats || {
      totalProperties: 12,
      activeListings: 8,
      pendingApproval: 3,
      proposalsReceived: 5,
      unreadMessages: 2
    });
    setRecentActivity(savedActivity || []);
    setLoading(false);
  }, [navigate]);

  if (loading || !user || !stats) {
    return (
      <div className="loading-container">
        <RingLoader color="#4a6bff" size={60} />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return (
    <div className="landlord-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, <span className="user-name">{user.name || 'Landlord'}</span>!</h1>
          <div className="date-time">
            <span className="date">{formattedDate}</span>
          </div>
          <p className="subtitle">Here's your property management overview</p>
        </div>
        <div className="user-avatar">
          <div className="avatar-circle">
            {user.name ? user.name.charAt(0).toUpperCase() : 'L'}
          </div>
        </div>
      </div>

      <div className="stats-cards">
  <div className="stat-card platform-stats">
    <div className="stat-icon"><FaShieldAlt /></div>
    <div className="stat-content">
      <h3>Secure Platform</h3>
      <p className="stat-value">100% Verified Listings</p>
      <p className="stat-change">Rigorous property verification</p>
    </div>
  </div>

  <div className="stat-card platform-stats">
    <div className="stat-icon"><FaUsers /></div>
    <div className="stat-content">
      <h3>Trusted Community</h3>
      <p className="stat-value">50,000+ Registered Users</p>
      <p className="stat-change">Quality tenants & landlords</p>
    </div>
  </div>

  <div className="stat-card platform-stats">
    <div className="stat-icon"><FaHandshake /></div>
    <div className="stat-content">
      <h3>Successful Matches</h3>
      <p className="stat-value">10,000+ Rentals Completed</p>
      <p className="stat-change">Proven track record</p>
    </div>
  </div>
</div>
     
     

      <div className="quick-actions">
        <div className="section-header">
          <h2>Quick Actions</h2>
          <Link to="/landlord/properties" className="view-all">View All Properties →</Link>
        </div>
        <div className="actions-grid">
          <Link to="/landlord/properties/new" className="action-card">
            <div className="action-icon"><FaPlus /></div>
            <h3>Add New Property</h3>
            <p>List a new rental property</p>
          </Link>
          <Link to="/landlord/proposals" className="action-card">
            <div className="action-icon"><FaClipboardList /></div>
            <h3>View Proposals</h3>
            <p>Review tenant applications</p>
          </Link>
          <Link to="/messages" className="action-card">
            <div className="action-icon"><FaInbox /></div>
            <h3>Check Messages</h3>
            <p>Communicate with tenants</p>
          </Link>
          <Link to="/landlord/properties" className="action-card">
            <div className="action-icon"><FaBuilding /></div>
            <h3>Manage Properties</h3>
            <p>Edit your listings</p>
          </Link>

          <Link to="/contact" className="action-card">
                      <div className="action-icon contact"><FaUser /></div>
                      <h3>Contact Us</h3>
                      <p>Get help & support</p>
                    </Link>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;