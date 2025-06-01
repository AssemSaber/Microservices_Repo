import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../services/api';
import '../styles/EditProperty.css';


// done //
const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    rentalStatus: 'Available',
    image: null,
    existingImages: [],
    fileBase64: null 
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:44357/api/Landlord/get-post/${id}`);
        const { title, description, price, location, rentalStatus, imagePath, fileBase64 } = response.data;

        setFormData(prev => ({
          ...prev,
          title,
          description,
          price,
          location,
          rentalStatus: rentalStatus || 'Available',
          existingImages: imagePath ? [imagePath] : [],
          fileBase64: fileBase64 || null 
        }));
      } catch (err) {
        setMessage(err.response?.data?.message || 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file, fileBase64: null }); 
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const removeImage = (isExisting) => {
    if (isExisting) {
      setFormData({ ...formData, existingImages: [], fileBase64: null });
    } else {
      setFormData({ ...formData, image: null });
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('Title', formData.title);
      formDataToSend.append('Description', formData.description);
      formDataToSend.append('Price', formData.price);
      formDataToSend.append('Location', formData.location);
      formDataToSend.append('RentalStatus', formData.rentalStatus);

      if (formData.image) {
        formDataToSend.append('File', formData.image);
      }

      const response = await axios.put(`http://localhost:44357/api/Landlord/edit-post/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Property updated successfully!');
      setTimeout(() => {
        navigate('/landlord/properties');
      }, 1500);
    } catch (err) {
      console.log(err.response);
      setMessage(err.response?.data?.message || 'Failed to update property');
    } finally {
      setSubmitLoading(false);
    }
  };

  
  if (loading) return <div>Loading property data...</div>;

  return (
    <div className="edit-property">
      <h1>Edit Property</h1>

      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price ($/month)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Rental Status</label>
          <select name="rentalStatus" value={formData.rentalStatus} onChange={handleChange}>
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
          </select>
        </div>

        <div className="form-group">
          <label>Image / File</label>
          <input type="file" accept="image/*,application/pdf" onChange={handleImageChange} />

          <div className="image-previews">
            {formData.existingImages.length > 0 && (
              <div className="image-preview">
                <img
                  src={`data:image/png;base64,${formData.fileBase64}`}
                  alt="property"
                  style={{ width: '210px', height: 'auto', borderRadius: '8px' }}
                />
                <button type="button" onClick={() => removeImage(true)} className="remove-image">×</button>
              </div>
            )}

            {previewImage && (
              <div className="image-preview">
                <img src={previewImage} alt="New" />
                <button type="button" onClick={() => removeImage(false)} className="remove-image">×</button>
              </div>
            )}
          </div>
        </div>

        <button type="submit" disabled={submitLoading}>
          {submitLoading ? 'Updating...' : 'Update Property'}
        </button>
      </form>
    </div>
  );
};

export default EditProperty;
