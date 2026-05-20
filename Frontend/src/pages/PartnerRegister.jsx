import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from "../config/api";

const PartnerRegister = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const shop = e.target.shopname.value.trim();
    const owner = e.target.ownername.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const address = e.target.address.value.trim();
    const phone = e.target.phone.value.trim();
    console.log({ shop, owner, email, password: password ? '***' : '', address, phone });
    //Basic client-side validation
    if (!shop || !owner ||!email ||!password ||!address ||!phone){
      alert('please fill all fields');
      return;
    }
    const emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRe.test(email)){
      alert('please enter a valid email address');
      return;
    }
    try{
      // include `name` and `contactName` keys because backend expects `name` and `contactName`
      const payload = { name: shop, shop, contactName: owner, email, password, address, phone };
      const response=await axios.post(apiUrl('/api/auth/food-partner/register'),payload,{withCredentials:true});
      console.log('server response:',response.data);
      // persist email so OTP page can use it
      try { 
        localStorage.setItem('registrationEmail', email);
        // also persist registration info (avoid storing password in localStorage in production)
        const partnerInfo = { shop, contactName: owner, email, address, phone };
        localStorage.setItem('partnerRegistration', JSON.stringify(partnerInfo));
      } catch (err) { console.warn('localStorage unavailable', err); }
      navigate('/food-partner/otp');
    } catch(err){
      const serverMsg=err?.response?.data?.message || err?.response?.data || err.message;
      console.error('register error:',err,'serverMsg:',serverMsg);
      const msgToShow=typeof serverMsg==='string' ? serverMsg : JSON.stringify(serverMsg);
      alert('Registration failed:' + msgToShow);
    }
  };
  return (
    <div className="page">
      <div className="form-container">
        <h2>Food Partner Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input name="shopname" type="text" placeholder="Shop / Business name" />
          </div>
          <div className="form-group">
            <input name="ownername" type="text" placeholder="Owner name" />
          </div>
          <div className="form-group">
            <input name="email" type="email" placeholder="Contact email" />
          </div>
          <div className="form-group">
            <input name="password" type="password" placeholder="Password" />
          </div>
          <div className="form-group">
            <input name="address" type="text" placeholder="Address (street, city, state)" />
          </div>
          <div className="form-group">
            <input name="phone" type="tel" placeholder="Phone" />
          </div>
          <button className="btn" type="submit">Create account</button>
        </form>
        <p className="muted small">Already have an account? <Link to="/food-partner/login">Sign in</Link></p>
        <p className="muted small">We will review your application.</p>
        <p className="muted small">Or <Link to="/user/register">Register as Normal User</Link></p>
      </div>
    </div>
  );
};

export default PartnerRegister;
