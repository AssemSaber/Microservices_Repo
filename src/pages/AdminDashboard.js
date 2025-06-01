import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUsers, FiHome, FiCheckCircle, FiServer, FiCalendar, FiActivity } from 'react-icons/fi';
import { RingLoader } from 'react-spinners';
import '../styles/AdminDashboard.css';
// done

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const userData = profile?.user;

    if (!userData || userData.role?.toLowerCase() !== 'admin') {
      navigate('/unauthorized');
      return;
    }

    setUser(userData);

    const savedStats = JSON.parse(localStorage.getItem('adminStats'));
    const savedActivity = JSON.parse(localStorage.getItem('recentActivity'));

    setStats(savedStats || {
      pendingLandlords: 12,
      pendingProperties: 8,
      totalLandlords: 45,
      totalTenants: 128,
      totalProperties: 76
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

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const serverStatus = {
    status: "operational",
    uptime: "99.98%",
    responseTime: "142ms",
    lastIncident: "None in 30 days",
    resources: {
      cpu: "32%",
      memory: "45%",
      storage: "28%"
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="welcome-message">
          <h1>Welcome back, <span>{user.name || 'Admin'}</span></h1>
          <div className="date-info">
            <FiCalendar className="date-icon" />
            <p>{currentDate}</p>
          </div>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card warning">
          <div className="card-content">
            <div className="card-icon"><FiUsers /></div>
            <div className="card-text">
              <h3>Pending Landlords</h3>
              <p>{stats.pendingLandlords}</p>
            </div>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="card-content">
            <div className="card-icon"><FiHome /></div>
            <div className="card-text">
              <h3>Pending Properties</h3>
              <p>{stats.pendingProperties}</p>
            </div>
          </div>
        </div>
        <div className="stat-card info">
          <div className="card-content">
            <div className="card-icon"><FiUsers /></div>
            <div className="card-text">
              <h3>Total Landlords</h3>
              <p>{stats.totalLandlords}</p>
            </div>
          </div>
        </div>
        <div className="stat-card info">
          <div className="card-content">
            <div className="card-icon"><FiUsers /></div>
            <div className="card-text">
              <h3>Total Tenants</h3>
              <p>{stats.totalTenants}</p>
            </div>
          </div>
        </div>
        <div className="stat-card success">
          <div className="card-content">
            <div className="card-icon"><FiHome /></div>
            <div className="card-text">
              <h3>Total Properties</h3>
              <p>{stats.totalProperties}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <section className="quick-actions-section">
          <h2 className="section-title">
            <FiActivity className="title-icon" />
            Quick Actions
          </h2>
          <div className="actions-grid">
            <Link to="/admin/pending-landlords" className="action-card">
              <div className="action-icon"><FiCheckCircle /></div>
              <h3>Approve Landlords</h3>
              <p>Review new registration requests</p>
            </Link>
            <Link to="/show-all-post" className="action-card">
              <div className="action-icon"><FiHome /></div>
              <h3>Review Properties</h3>
              <p>Check All property</p>
            </Link>
            <Link to="/admin/landlord-applications" className="action-card">
              <div className="action-icon"><FiUsers /></div>
              <h3>Manage Properties</h3>
              <p>Check pending property listings</p>
            </Link>
            <Link to="/admin/SystemReports" className="action-card">
              <div className="action-icon"><FiServer /></div>
              <h3>System Reports</h3>
              <p>View system performance reports</p>
            </Link>
          </div>
        </section>

        <section className="server-status-section">
          <h2 className="section-title">
            <FiServer className="title-icon" />
            Server Status
          </h2>
          <div className="status-card">
            <div className={`status-indicator ${serverStatus.status}`}>
              <div className="status-light"></div>
              <span>{serverStatus.status.charAt(0).toUpperCase() + serverStatus.status.slice(1)}</span>
            </div>
            <div className="status-details">
              <div className="status-item">
                <span className="status-label">Uptime:</span>
                <span className="status-value">{serverStatus.uptime}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Response Time:</span>
                <span className="status-value">{serverStatus.responseTime}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Last Incident:</span>
                <span className="status-value">{serverStatus.lastIncident}</span>
              </div>
            </div>
            <div className="resource-usage">
              <h4>Resource Usage</h4>
              <div className="resource-bars">
                <div className="resource-bar">
                  <div className="bar-label">CPU</div>
                  <div className="bar-container">
                    <div className="bar-fill cpu" style={{ width: serverStatus.resources.cpu }}></div>
                    <span>{serverStatus.resources.cpu}</span>
                  </div>
                </div>
                <div className="resource-bar">
                  <div className="bar-label">Memory</div>
                  <div className="bar-container">
                    <div className="bar-fill memory" style={{ width: serverStatus.resources.memory }}></div>
                    <span>{serverStatus.resources.memory}</span>
                  </div>
                </div>
                <div className="resource-bar">
                  <div className="bar-label">Storage</div>
                  <div className="bar-container">
                    <div className="bar-fill storage" style={{ width: serverStatus.resources.storage }}></div>
                    <span>{serverStatus.resources.storage}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
