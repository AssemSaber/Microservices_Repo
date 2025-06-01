import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaFileAlt, FaComments, FaUser, FaHeart, FaSearch, FaEnvelope, FaCalendarAlt, FaBookmark } from 'react-icons/fa';
import '../styles/TenantDashboard.css';
// done

const TenantDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const userData = profile?.user;

    if (!userData || userData.role?.toLowerCase() !== 'tenant') {
      navigate('/unauthorized');
      return;
    }

    setUser(userData);
  }, [navigate]);

  if (!user) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="tenant-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user.name || 'Tenant'}!</h1>
          <p className="subtitle">Here's what's happening with your rentals</p>
          <div className="date-badge">
            <FaCalendarAlt className="calendar-icon" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div className="user-avatar">
          <div className="avatar-circle">
            {user.name ? user.name.charAt(0).toUpperCase() : 'T'}
          </div>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card primary">
          <div className="stat-icon"><FaHome /></div>
          <div className="stat-content">
            <h3>Over 100,000 Properties</h3>
            <p className="stat-value">Across all regions</p>
            <p className="stat-change">Find your perfect place today</p>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon"><FaFileAlt /></div>
          <div className="stat-content">
            <h3>Trusted by Thousands</h3>
            <p className="stat-value">+50,000 Users</p>
            <p className="stat-change">Join our growing community</p>
          </div>
        </div>

        <div className="stat-card accent">
          <div className="stat-icon"><FaComments /></div>
          <div className="stat-content">
            <h3>Verified Listings</h3>
            <p className="stat-value">Reliable & Safe</p>
            <p className="stat-change">Your trust, our priority</p>
          </div>
        </div>
      </div>


      <div className="dashboard-sections">
        <section className="all-posts card">
          <div className="section-header">
            <h2>Available Properties</h2>
            <Link to="/show-all-post" className="view-all">View All <span className="arrow">→</span></Link>
          </div>
          <div className="loading-section">Discover over 100,0000 properties waiting for you</div>
        </section>

        <section className="saved-properties card">
          <div className="section-header">
            <h2>Your Saved Properties</h2>
            <Link to="/saved-posts" className="view-all">View All <span className="arrow">→</span></Link>
          </div>
          <div className="loading-section">Your saved properties are waiting — take a look</div>
        </section>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/show-all-post" className="action-card">
            <div className="action-icon search"><FaSearch /></div>
            <h3>Find Properties</h3>
            <p>Browse available rentals</p>
          </Link>
          <Link to="/saved-posts" className="action-card">
            <div className="action-icon saved"><FaHeart /></div>
            <h3>Your Saves</h3>
            <p>View saved properties</p>
          </Link>

          <Link to="/UserProperties" className="action-card">
          <div className="action-icon FaBookmark"><FaBookmark /></div>
          <h3>Your Applications</h3>
            <p>Learn more about your application</p>
          </Link>

          <Link to="/messages" className="action-card">
            <div className="action-icon messages"><FaEnvelope /></div>
            <h3>Messages</h3>
            <p>Contact landlords</p>
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

export default TenantDashboard;
