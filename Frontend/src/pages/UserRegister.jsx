import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from "../config/api";
const UserRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullname = e.target.fullname.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const contact=e.target.contact.value.trim();
    // Basic client-side validation
    if (!fullname || !email || !password || !contact) {
      alert('Please fill all fields.');
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Send both `name` and `fullname` to be compatible with different backends
    const payload = { name: fullname, fullname, email, password,contact };
    console.log('Register payload:', payload);

    try {
      // Send to backend with axios
      const response = await axios.post(apiUrl('/api/auth/user/register'), payload,{withCredentials:true});
      console.log('Server response:', response.data);
      // persist email so OTP page can use it
      try { localStorage.setItem('registrationEmail', email); } catch (err) { console.warn('localStorage unavailable', err); }
      // Navigate to OTP page after successful registration
      navigate('/user/otp');
    } catch (err) {
      // Surface server validation messages when available
      const serverMsg = err?.response?.data?.message || err?.response?.data || err.message;
      console.error('Registration error:', err, 'serverMsg:', serverMsg);
      const msgToShow = typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg);
      alert('Registration failed: ' + msgToShow);
    }
  };
  return (
    <div className="page">
      <div className="form-container">
        <h2>User Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input name="fullname" type="text" placeholder="Full name" />
          </div>
          <div className="form-group">
            <input name="email" type="email" placeholder="Email" />
          </div>
          <div className="form-group">
            <input name="password" type="password" placeholder="Password" />
          </div>
          <div className="form-group">
            <input name="contact" type="text" placeholder="Contact Number" />
          </div>

          <button className="btn" type="submit">Create account</button>
        </form>
        <p className="muted">By creating an account you agree to our terms.</p>
        <p className="muted small">Already have an account? <Link to="/user/login">Sign in</Link></p>
        <p className="muted small">Or <Link to="/food-partner/register">Register as Food Partner</Link></p>
      </div>
    </div>
  );
};

export default UserRegister;
