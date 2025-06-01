import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ManageProperties.css';
import axios from 'axios';
// done

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '' });

  const landlordId = localStorage.getItem('landlordId');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`http://localhost:44357/api/Landlord/get-my-posts/${landlordId}`);
        setProperties(res.data);
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [landlordId]);

  const deleteProperty = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`http://localhost:44357/api/Landlord/delete-post/${id}`);
        setProperties(properties.filter(property => property.postId !== id));
      } catch (err) {
        console.error('Error deleting property:', err);
      }
    }
  };

  const filteredProperties = filters.status
    ? properties.filter(property => property.rentalStatus === filters.status)
    : properties;

  if (loading) return <div>Loading your properties...</div>;

  const getPostStatus = (flagWaitingPost) => {
    if (flagWaitingPost === 0) return 'Approved'; 
    if (flagWaitingPost === 1) return 'Pending'; 
    if (flagWaitingPost === 2) return 'Rejected'; 
    return 'Unknown'; 
  };

  return (
    <div className="manage-properties">
      <div className="header">
        <h1>Your Properties</h1>
        <Link to="/landlord/properties/new" className="btn-primary">
          Add New Property
        </Link>
      </div>

      <div className="filters">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Rented">Rented</option>
        </select>
      </div>

      {filteredProperties.length > 0 ? (
        <table className="properties-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Location</th>
              <th>Status</th> 
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map(property => (
              <tr key={property.postId}>
                <td>
                  {property.fileBase64 ? (
                    <img
                      src={`data:image/png;base64,${property.fileBase64}`}
                      alt="property"
                      style={{ width: '100px', height: 'auto', borderRadius: '8px' }}
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </td>
                <td>{property.title}</td>
                <td>${property.price}</td>
                <td>{property.location}</td>
                <td className={`status ${property.rentalStatus.toLowerCase()}`}>
                  {property.rentalStatus} 
                </td>
                <td className={`status ${getPostStatus(property.flagWaitingPost).toLowerCase()}`}>
                  {getPostStatus(property.flagWaitingPost)} 
                </td>
                <td className="actions">
                  <Link to={`/landlord/properties/${property.postId}/edit`} className="btn-edit">
                    Edit
                  </Link>
                  <button onClick={() => deleteProperty(property.postId)} className="btn-delete">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You haven't listed any properties yet</p>
      )}
    </div>
  );
};

export default ManageProperties;
