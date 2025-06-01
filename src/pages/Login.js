
// بص لو عايز تدخل عندك اعمل كومنت للكود الي تحت الخط 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const adminEmail = "admin@a.com";
    const adminPassword = "123456789";

    if (
      formData.usernameOrEmail === adminEmail &&
      formData.password === adminPassword
    ) {
      const fakeAdmin = {
        userId: 'admin123',
        email: adminEmail,
        role: 'Admin',
      };

      const fakeToken = 'fake-admin-token';

      localStorage.setItem('profile', JSON.stringify({ user: fakeAdmin, token: fakeToken }));
      localStorage.setItem('token', fakeToken);
      localStorage.setItem('userId', fakeAdmin.userId);
      localStorage.setItem('role', 'admin');

      navigate('/admin/dashboard');
      window.location.reload();
      return;
    }

    try {
      const res = await axios.post('http://localhost:44357/api/Auth/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { user, token } = res.data;

      if (!user || !token) {
        setMessage("Invalid response from server. Please try again.");
        return;
      }

      const userId = user.userId || user.id || user.Id || user._id;
      const role = user.role?.toLowerCase();
      localStorage.setItem("role", role);

      if (!userId || !role) {
        setMessage("User ID or role not found in response.");
        return;
      }

      localStorage.setItem('profile', JSON.stringify({ user, token }));
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);

      if (role === 'landlord') {
        localStorage.setItem('landlordId', userId);

        const statusRes = await axios.get(
          `http://localhost:44357/api/admin/landlord-status/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const landlordData = statusRes.data[0];
        const landlordStatus = landlordData.flagWaitingUser;

        if (landlordStatus === 0) {
          navigate('/landlord/dashboard');
          window.location.reload();
        } else if (landlordStatus === 1) {
          setMessage('Your landlord account is pending approval.');
        } else if (landlordStatus === 2) {
          setMessage('Your landlord account has been rejected.');
        } else {
          setMessage('Unknown landlord status.');
        }
      } else {
        switch (role) {
          case 'tenant':
            navigate('/tenant/dashboard');
            window.location.reload();
            break;
          default:
            navigate('/');
        }
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        setMessage(error.response.data.message || 'Login failed.');
      } else if (error.request) {
        setMessage('No response from server. Please try again later.');
      } else {
        setMessage('An unexpected error occurred during login.');
      }
    }
  };

  const enterAsGuest = () => {
    localStorage.setItem('guestMode', 'true');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username or Email</label>
          <input
            type="text"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <div className="guest-section">
        <p>Or continue as guest</p>
        <button onClick={enterAsGuest} className="guest-btn">
          Enter as Guest
        </button>
      </div>

      {message && <div className="message">{message}</div>}

      Don't have an account? <Link to="/register">Register</Link>
    </div>
  );
};

export default Login;



// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------

// // done 

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/Login.css';
// import { Link } from 'react-router-dom';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     usernameOrEmail: '',
//     password: '',
//   });

//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');

//     try {
//       const res = await axios.post('https://localhost:44357/api/Auth/login', formData, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       const { user, token } = res.data;

//       if (!user || !token) {
//         setMessage("Invalid response from server. Please try again.");
//         return;
//       }

//       const userId = user.userId || user.id || user.Id || user._id;
//       const role = user.role?.toLowerCase();
//       localStorage.setItem("role", role);

//       if (!userId || !role) {
//         setMessage("User ID or role not found in response.");
//         return;
//       }

//       localStorage.setItem('profile', JSON.stringify({ user, token }));
//       localStorage.setItem('token', token);
//       localStorage.setItem("userId", userId);

//       localStorage.setItem('guestMode', 'false'); 

//       if (role === 'landlord') {
//         localStorage.setItem('landlordId', userId);

//         const statusRes = await axios.get(
//           `https://localhost:44357/api/admin/landlord-status/${userId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const landlordData = statusRes.data[0];
//         const landlordStatus = landlordData.flagWaitingUser;

//         if (landlordStatus === 0) {
//           navigate('/landlord/dashboard');
//           window.location.reload();
//         } else if (landlordStatus === 1) {
//           setMessage('Your landlord account is pending approval.');
//         } else if (landlordStatus === 2) {
//           setMessage('Your landlord account has been rejected.');
//         } else {
//           setMessage('Unknown landlord status.');
//         }
//       } else {
//         switch (role) {
//           case 'admin':
//             navigate('/admin/dashboard');
//             window.location.reload();
//             break;
//           case 'tenant':
//             navigate('/tenant/dashboard');
//             window.location.reload();
//             break;
//           default:
//             navigate('/');
//         }
//       }
//     } catch (error) {
//       console.error(error);
//       if (error.response) {
//         setMessage(error.response.data.message || 'Login failed.');
//       } else if (error.request) {
//         setMessage('No response from server. Please try again later.');
//       } else {
//         setMessage('An unexpected error occurred during login.');
//       }
//     }
//   };

//   const enterAsGuest = () => {
//     localStorage.setItem('guestMode', 'true');
//     navigate('/');
//   };

//   return (
//     <div className="auth-container">
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Username or Email</label>
//           <input
//             type="text"
//             name="usernameOrEmail"
//             value={formData.usernameOrEmail}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <button type="submit">Login</button>
//       </form>

//       <div className="guest-section">
//         <p>Or continue as guest</p>
//         <button onClick={enterAsGuest} className="guest-btn">
//           Enter as Guest
//         </button>
//       </div>

//       {message && <div className="message">{message}</div>}

//       Don't have an account? <Link to="/register">Register</Link>
//     </div>
//   );
// };

// export default Login;
