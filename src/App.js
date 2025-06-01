import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import PendingApprovals from './pages/PendingApprovals';
import LandlordApplicationDetail from './pages/LandlordApplicationDetail';
import LandlordDashboard from './pages/LandlordDashboard';
import ManageProperties from './pages/ManageProperties';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import PropertyProposals from './pages/PropertyProposals';
import TenantDashboard from './pages/TenantDashboard';
import SavedPosts from './pages/SavedPosts';
import Messages from './pages/Messages';
import Contact from './pages/contact';
import Unauthorized from './components/Unauthorized';
import UserProperties from './pages/UserProperties';
import SystemReports from './pages/SystemReports';
import ShowAllPost from './pages/ShowAllPosts';
import ShowAnalytics from './pages/showAnalytics';
import ShowEmails from './pages/ShowEmails';

function App() {
  const location = useLocation();

  const hideNavbarFooter = 
    location.pathname === '/login' || 
    location.pathname === '/register' || 
    location.pathname === '/unauthorized' ||
    location.pathname.startsWith('/messages'); 

  return (
    <AuthProvider>
      <div className="app">
        {!hideNavbarFooter && <Navbar />}

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/properties/:postId" element={<PropertyDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/show-all-post" element={<ShowAllPost />} />

            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/pending-landlords" element={<PendingApprovals />} />
            <Route path="/admin/landlord-applications" element={<LandlordApplicationDetail />} />
            <Route path="/admin/SystemReports" element={<SystemReports />} />
            <Route path="/admin/showAnalytics" element={<ShowAnalytics />} />
            <Route path="/admin/emailAnalytics" element={<ShowEmails />} />

            <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
            <Route path="/landlord/properties" element={<ManageProperties />} />
            <Route path="/landlord/properties/new" element={<AddProperty />} />
            <Route path="/landlord/properties/:id/edit" element={<EditProperty />} />
            <Route path="/landlord/proposals" element={<PropertyProposals />} />

            <Route path="/tenant/dashboard" element={<TenantDashboard />} />
            <Route path="/saved-posts" element={<SavedPosts />} />
            <Route path="/UserProperties" element={<UserProperties />} />

            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:receiverId" element={<Messages />} />

            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </main>

        {!hideNavbarFooter && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
