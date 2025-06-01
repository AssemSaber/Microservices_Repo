import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import '../styles/Navbar.css';
import '../styles/Footer.css';
// done
const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();



  const testimonials = [
    {
      id: 1,
      name: "Ahmed Mohamed",
      comment: "Found my dream apartment within days. Excellent service and support throughout the process!",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      name: "Sara Ali",
      comment: "The team was very professional and helped me find a perfect home for my family. Highly recommended!",
      rating: 4,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      name: "Youssef Ibrahim",
      comment: "Great platform with a wide selection of properties. Made my search so much easier.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/75.jpg"
    },
    {
      id: 4,
      name: "Fatima Hassan",
      comment: "Excellent customer service and quick response time. Found exactly what I was looking for!",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/63.jpg"
    }
  ];

  const services = [
    {
      id: 1,
      title: "Property Search",
      description: "Access thousands of verified properties with detailed information and photos.",
      icon: "🔍"
    },
    {
      id: 2,
      title: "Virtual Tours",
      description: "Explore properties from the comfort of your home with our virtual tour feature.",
      icon: "🏠"
    },
    {
      id: 4,
      title: "Secure Payments",
      description: "Safe and transparent payment process with multiple options available.",
      icon: "💰"
    },
    {
      id: 5,
      title: "24/7 Support",
      description: "Round-the-clock customer service to assist you whenever you need help.",
      icon: "📞"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Properties Listed" },
    { value: "95%", label: "Customer Satisfaction" },
    { value: "24h", label: "Average Response Time" },
    { value: "50+", label: "Cities Covered" }
  ];

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Find Your Perfect <span>Rental Home</span></h1>
          <p>Discover the best properties for rent in your desired location with our premium service</p>
          <div className="hero-buttons">
            <Link to="/show-all-post" className="btn-primary">
              Browse Properties
            </Link>
            <Link to="/about" className="btn-outline">
              Learn More
            </Link>
          </div>
        </div>
      </section>
         

      <section className="company-section">
        <div className="container">
          <div className="company-content">
            <div className="company-text">
              <h2>About <span>Our Company</span></h2>
              <p className="highlight">Since 2010, we've been connecting people with their perfect homes across the region.</p>
              <p>Our team of dedicated professionals combines local expertise with innovative technology to make your property search seamless and stress-free. We pride ourselves on transparency, integrity, and exceptional customer service.</p>
              <div className="company-stats">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <h3>{stat.value}</h3>
                    <p>{stat.label}</p>
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn-primary">
                Our Story
              </Link>
            </div>
            <div className="company-images">
              <div className="image-grid">
                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Our team" className="image-main" />
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Office" className="image-secondary" />
                <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Happy clients" className="image-tertiary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Our <span>Services</span></h2>
            <p>We provide comprehensive solutions for all your rental needs</p>
          </div>
          <div className="services-container">
            {services.map(service => (
              <div key={service.id} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-learn-more">
                  <Link to="/services">Learn more →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Client <span>Testimonials</span></h2>
            <p>Hear from people who found their perfect home through us</p>
          </div>
          <div className="testimonials-container">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="rating">
                  {Array(testimonial.rating).fill().map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.comment}"</p>
                <div className="client-info">
                  <img src={testimonial.avatar} alt={testimonial.name} className="client-avatar" />
                  <div className="client-details">
                    <span className="client-name">{testimonial.name}</span>
                    <span className="client-status">Verified Client</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-overlay"></div>
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Find Your New Home?</h2>
            <p>Join thousands of satisfied clients who found their perfect rental property with us</p>
            <div className="cta-buttons">
              <Link to="/show-all-post" className="btn-primary">
                Browse Listings
              </Link>
              <Link to="/contact" className="btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
  
    </div>
  );
};

export default Home;