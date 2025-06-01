import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import '../styles/Unauthorized.css';


const Home = ()=> {
  localStorage.clear();
  window.location.reload();
  return 0 ;
}
const Unauthorized = () => {
  useEffect(() => {
    const createParticles = () => {
      const particlesContainer = document.querySelector('.unauthorized-page');
      const particleCount = 30;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        const opacity = Math.random() * 0.5 + 0.1;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.opacity = opacity;
        
        particle.style.animationName = 'float';
        particle.style.animationIterationCount = 'infinite';
        particle.style.animationTimingFunction = 'ease-in-out';
        
        particlesContainer.appendChild(particle);
      }
    };
    
    createParticles();
    
    return () => {
      document.querySelectorAll('.particle').forEach(el => el.remove());
    };
  }, []);

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-content">
        <FaLock className="lock-icon" />
        <h1>Access Denied</h1>
        <p>
          Your credentials don't grant you access to this royal chamber. 
          Please contact the administrator if you believe this is a mistake.
        </p>
        <button onClick={Home}> 
        <Link to="/">Return to Home</Link>
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;