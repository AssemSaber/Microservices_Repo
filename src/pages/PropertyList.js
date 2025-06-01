import { useState, useEffect } from 'react';
import '../styles/PropertyList.css';
import axios from 'axios';
// done

const PropertyList = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    status: 'available'
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get('http://localhost:44357/api/Tenant/all-posts'); 
        setAllProperties(res.data);
        setFilteredProperties(res.data); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const filterProps = () => {
      let filtered = [...allProperties];

      if (searchParams.location) {
        filtered = filtered.filter(p =>
          p.location.toLowerCase().includes(searchParams.location.toLowerCase())
        );
      }

      if (searchParams.minPrice) {
        filtered = filtered.filter(p => p.price >= parseFloat(searchParams.minPrice));
      }

      if (searchParams.maxPrice) {
        filtered = filtered.filter(p => p.price <= parseFloat(searchParams.maxPrice));
      }

      if (searchParams.status) {
        filtered = filtered.filter(p => p.status === searchParams.status);
      }

      setFilteredProperties(filtered);
    };

    filterProps();
  }, [searchParams, allProperties]);

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div>Loading properties...</div>;

  return (
    <div className="property-list">
      <div className="search-filters">
        <h2>Search Properties</h2>
        <div className="filter-group">
          <label>Location</label>
          <input 
            type="text" 
            name="location" 
            value={searchParams.location} 
            onChange={handleSearchChange} 
            placeholder="City, neighborhood..."
          />
        </div>
        
        <div className="filter-group">
          <label>Price Range</label>
          <div className="price-range">
            <input 
              type="number" 
              name="minPrice" 
              value={searchParams.minPrice} 
              onChange={handleSearchChange} 
              placeholder="Min"
            />
            <span>to</span>
            <input 
              type="number" 
              name="maxPrice" 
              value={searchParams.maxPrice} 
              onChange={handleSearchChange} 
              placeholder="Max"
            />
          </div>
        </div>
        
        <div className="filter-group">
          <label>Status</label>
          <select name="status" value={searchParams.status} onChange={handleSearchChange}>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
          </select>
        </div>
      </div>
      
      <div className="properties-grid">
        {filteredProperties.length > 0 ? (
          filteredProperties.map(property => (
            <PropertyCard key={property._id} property={property} />
          ))
        ) : (
          <div>No properties found matching your criteria</div>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
