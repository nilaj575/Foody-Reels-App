import React from 'react';
import '../App.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from "../config/api";

const PartnerLogin = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
  e.preventDefault();

  const email = e.target.email.value.trim().toLowerCase();
  const password = e.target.password.value;

  if (!email || !password) {
    alert("please fill all fields");
    return;
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  try {
  
    const payload = { email, password };

    const response = await axios.post(
      apiUrl("/api/auth/food-partner/login"),
      payload,
      { withCredentials: true }
    );

    console.log("server response:", response.data);

  
    const partnerId = response.data.foodPartner?._id;

    if (partnerId) {
      localStorage.setItem("partnerId", partnerId);
      
    }

    navigate("/partner-home");

  } catch (err) {
    const serverMsg =
      err?.response?.data?.message || err?.response?.data || err.message;

    console.error("login error:", err, "serverMsg:", serverMsg);

    const msgToShow =
      typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg);

    alert("Login failed: " + msgToShow);
  }
};
  return (
    <div className="page">
      <div className="form-container">
        <h2>Partner Login</h2>
        <form onSubmit={handleSubmit}>
          <div  className="form-group">
            <input name="email" type="email" placeholder="Business email" />
          </div>
          <div className="form-group">
            <input name="password" type="password" placeholder="Password" />
          </div>
          <button className="btn" type="submit">Sign in</button>
        </form>
        <p className="muted small"> <Link to="/food-partner/register"> Create Partner Account</Link></p>
        <p className="muted small">Trouble signing in?</p>
      </div>
    </div>
  );
};

export default PartnerLogin;
