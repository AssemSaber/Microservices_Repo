import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Register.css';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
// done 

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'tenant',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const requestData = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        role_name: formData.role
      };
      
      const res = await axios.post('http://localhost:44357/api/Auth/register', requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setMessage({
        text:
          formData.role === 'tenant'
            ? 'Registration successful! Redirecting to login...'
            : 'Landlord registration submitted! Admin approval required.',
        type: 'success',
      });

      if (formData.role === 'tenant') {
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
       console.log(error);
      console.error('Registration error:', error);
      setMessage({
        text:
          error.response?.data?.message ||
          error.response?.data?.errors?.join(', ') ||
          'Registration failed Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const enterAsGuest = () => {
    navigate('/');
  };

  return (
    <div className="auth-container">
      <h2>Create Your Account</h2>

      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            required
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            required
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="role">Account Type</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange}>
            <option value="tenant">Tenant (Looking for property)</option>
            <option value="landlord">Landlord (List property)</option>
          </select>
          {formData.role === 'landlord' && (
            <p className="role-hint">
              Note: Landlord accounts require admin approval before you can login.
            </p>
          )}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div className="guest-section">
        <p>Or continue as guest</p>
        <button onClick={enterAsGuest} className="guest-btn">
          Enter as Guest
        </button>
      </div>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};

export default Register;
