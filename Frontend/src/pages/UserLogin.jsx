import React from "react";
import "../App.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
        `${API_BASE_URL}/api/auth/user/login`,
        payload,
        { withCredentials: true }
      );

      console.log("server response:", response.data);

      const user = response.data.user;

      if (user) {

        localStorage.setItem("userId", user._id);

        localStorage.setItem("isLogin", "true");

        if (user.image) {
          localStorage.setItem("userImage", user.image);
        }

      }

      navigate("/app");

    } catch (err) {

      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err.message;

      console.error("login error:", err);

      alert("Login failed: " + serverMsg);
    }
  };

  return (
    <div className="page">

      <div className="form-container">

        <h2>User Login</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <input name="email" type="email" placeholder="Email address" />
          </div>

          <div className="form-group">
            <input name="password" type="password" placeholder="Password" />
          </div>

          <button className="btn" type="submit">
            Sign in
          </button>

        </form>
        <p className="muted small"> <Link to="/user/register">Create New Account</Link></p>
        <p className="muted small">Forgot password?</p>

      </div>

    </div>
  );
};

export default UserLogin;