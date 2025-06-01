import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
    sessionStorage.clear(); 
    localStorage.clear();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <h1 className="navbar-brand">Nestino</h1>

        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? '×' : '☰'}
        </button>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {!user ? (
            <>
              <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/show-all-post" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Browse Properties</Link>
              <Link to="/login" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
            </>
          ) : (
            <>
              {user?.role === 'Admin' && (
                <>
                  <Link to="/admin/dashboard" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                  <Link to="/show-all-post" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Browse Properties</Link>
                  <Link to="/admin/pending-landlords" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Pending Landlords</Link>
                  <Link to="/admin/landlord-applications" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Pending Properties</Link>
                  <Link to="/admin/showAnalytics" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>show Analytics</Link>
                  <Link to="/admin/emailAnalytics" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Email Analytics</Link>
                </>
              )}

              {user?.role === 'landlord' && (
                <>
                  <Link to="/landlord/dashboard" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                  <Link to="/show-all-post" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Browse Properties</Link>
                  <Link to="/landlord/properties" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>My Properties</Link>
                  <Link to="/landlord/proposals" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Proposals</Link>
                  <Link to="/saved-posts" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Saved Posts</Link>
                  <Link to="/messages" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Messages</Link>
                </>
              )}

              {user?.role === 'tenant' && (
                <>
                  <Link to="/tenant/dashboard" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                  <Link to="/show-all-post" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Browse Properties</Link>
                  <Link to="/saved-posts" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Saved Posts</Link>
                  <Link to="/UserProperties" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Your applications</Link>
                  <Link to="/messages" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Messages</Link>
                </>
              )}
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
