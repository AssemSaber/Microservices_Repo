import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.footer-section').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="animated-footer">
      <div className="footer-wave"></div>
      
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section logo-section">
            <div className="logo-animation">
              <h3 className="logo-text">Nes<span>tino</span></h3>
              <div className="logo-circle"></div>
            </div>
            <p className="tagline">Your perfect rental companion</p>
            <div className="social-icons">
              <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          <div className="footer-section links-section">
            <h4 className="section-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/show-all-post" className="hover-effect">Properties</Link></li>
              <li><Link to="/about" className="hover-effect">About Us</Link></li>
              <li><Link to="/contact" className="hover-effect">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section legal-section">
            <h4 className="section-title">Legal</h4>
            <ul className="footer-links">
              <li><Link to="/privacy" className="hover-effect">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover-effect">Terms of Service</Link></li>
              <li><Link to="/faq" className="hover-effect">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-section contact-section">
            <h4 className="section-title">Contact Us</h4>
            <div className="contact-item">
              <i className="fas fa-envelope contact-icon"></i>
              <p>info@rentmate.com</p>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone contact-icon"></i>
              <p>+1 (123) 456-7890</p>
            </div>
            <div className="contact-item">
              <i className="fas fa-map-marker-alt contact-icon"></i>
              <p>123 Rental St, Suite 100</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} RentMate. All rights reserved.</p>
          <div className="scroll-top" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <i className="fas fa-arrow-up"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;