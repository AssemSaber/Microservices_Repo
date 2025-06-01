import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';
import '../styles/AddProperty.css';
// done
const AddProperty = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    image: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });

    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewImage(preview);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const landlordId = localStorage.getItem('landlordId');
      if (!landlordId) {
        setMessage('Landlord ID not found. Please login again.');
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('Title', formData.title);
      formDataToSend.append('Description', formData.description);
      formDataToSend.append('Price', formData.price);
      formDataToSend.append('Location', formData.location);
      formDataToSend.append('Image', formData.image); 

      await axios.post(`http://localhost:44357/api/Landlord/create-post/${landlordId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      setMessage('Property added successfully! Waiting for admin approval.');
      setTimeout(() => {
        navigate('/landlord/properties');
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-property">
      <h1>Add New Property</h1>

      {message && <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price ($/month)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />

          {previewImage && (
            <div className="image-previews">
              <img src={previewImage} alt="Preview" />
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Add Property'}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
