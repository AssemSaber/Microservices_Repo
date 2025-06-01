import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import '../styles/contact.css';
// done

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    complaintType: 'general'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Your message has been received. We will contact you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      complaintType: 'general'
    });
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Contact Us</h1>
          <p>We're here to help with any inquiries or complaints you may have</p>
        </div>
      </section>

      <div className="contact-container">
        <section className="contact-info-section">
          <div className="contact-info-card">
            <div className="contact-icon">
              <FaPhone />
            </div>
            <h3>Phone</h3>
            <p>+20 123 456 7890</p>
            <p>+20 987 654 3210</p>
          </div>

          <div className="contact-info-card">
            <div className="contact-icon">
              <FaEnvelope />
            </div>
            <h3>Email</h3>
            <p>info@realestate.com</p>
            <p>support@realestate.com</p>
          </div>

          <div className="contact-info-card">
            <div className="contact-icon">
              <FaMapMarkerAlt />
            </div>
            <h3>Address</h3>
            <p>123 Tahrir Street, Cairo, Egypt</p>
          </div>
        </section>

        <section className="contact-main">
          <div className="contact-map-form">
          <div className="contact-map" style={{ position: 'relative', height: '400px' }}>
          <iframe 
                title="Our Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.123456789!2d31.233408!3d30.047987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458409a8f8f1e0d%3A0x8e6a5a5a5a5a5a5a!2sEgyptian%20Museum!5e0!3m2!1sen!2seg!4v1620000000000!5m2!1sen!2seg"                height="400" 
                style={{ 
                  border: 0, 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%' 
                }} 
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
            </div>

            <div className="contact-form">
              <h2>Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="complaintType">Message Type</label>
                  <select 
                    id="complaintType" 
                    name="complaintType"
                    value={formData.complaintType}
                    onChange={handleChange}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="complaint">Complaint</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="technical">Technical Support</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            </div>
          </div>
        </section>

        <section className="social-media">
          <h2>Connect With Us on Social Media</h2>
          <div className="social-icons">
            <a href="#" className="social-icon facebook">
              <FaFacebook />
            </a>
            <a href="#" className="social-icon twitter">
              <FaTwitter />
            </a>
            <a href="#" className="social-icon instagram">
              <FaInstagram />
            </a>
            <a href="#" className="social-icon linkedin">
              <FaLinkedin />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;