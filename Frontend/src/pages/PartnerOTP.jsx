import React, { useRef } from 'react';
import '../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from "../config/api";

const PartnerOTP = () => {
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = Array.from({ length: 6 }).map((_, i) => e.target[`otp${i+1}`].value).join('');
    console.log('Partner OTP:', otp);
    // include email (saved from registration) because backend requires it
    const email = (() => {
      try { return localStorage.getItem('registrationEmail'); } catch (err) { console.warn('localStorage unavailable', err); }
    })();
    // read partner registration info (if needed by UI)
    const partnerInfo = (() => {
      try { const raw = localStorage.getItem('partnerRegistration'); return raw ? JSON.parse(raw) : null; } catch (err) { console.warn('localStorage parse error', err); return null; }
    })();
    if (partnerInfo) console.log('Partner registration info (from storage):', partnerInfo);
    if(!email){
      alert('Email not found.please go back to registration or re-enter your email.');
      return;
    }
    try{
      const payload={email,otp};
      const response = await axios.post(apiUrl('/api/auth/food-partner/verify-otp'), payload, { withCredentials: true });
      console.log('otp verify response:', response.data);
      try {localStorage.removeItem('registrationEmail');} catch(err) { console.warn('localStorage unavailable', err); }
      try { localStorage.removeItem('partnerRegistration'); } catch (err) { /* ignore */ }
      alert('OTP verified successfully.');
      navigate('/create-food');

    } catch(err){
      const serverMsg=err?.response?.data?.message ||err?.response?.data || err.message;
      console.error('OTP verification error:',err,"serverMsg:",serverMsg);
      const msgToShow=typeof serverMsg==='string' ? serverMsg : JSON.stringify(serverMsg);
      alert('OTP verification failed: ' + msgToShow);

    }
  };

  const handleInput = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '');
    e.target.value = val.slice(-1);
    if (val && idx < 5) {
      const next = inputsRef.current[idx + 1];
      if (next) next.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !e.target.value && idx > 0) {
      const prev = inputsRef.current[idx - 1];
      if (prev) prev.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    paste.split('').forEach((ch, i) => {
      const input = inputsRef.current[i];
      if (input) input.value = ch;
    });
    const focusIndex = Math.min(paste.length, 5);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div className="page">
      <div className="form-container">
        <h2>Partner OTP</h2>
        <p className="muted">Enter the 6-digit code sent to your business number</p>
        <form onSubmit={handleSubmit}>
          <div className="otp-row" aria-label="6 digit code" onPaste={handlePaste}>
            <input
              name="otp1"
              className="otp"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              aria-label="digit 1"
              ref={(el) => (inputsRef.current[0] = el)}
              onChange={(e) => handleInput(e, 0)}
              onKeyDown={(e) => handleKeyDown(e, 0)}
            />
            <input
              name="otp2"
              className="otp"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              aria-label="digit 2"
              ref={(el) => (inputsRef.current[1] = el)}
              onChange={(e) => handleInput(e, 1)}
              onKeyDown={(e) => handleKeyDown(e, 1)}
            />
            <input
              name="otp3"
              className="otp"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              aria-label="digit 3"
              ref={(el) => (inputsRef.current[2] = el)}
              onChange={(e) => handleInput(e, 2)}
              onKeyDown={(e) => handleKeyDown(e, 2)}
            />
            <input
              name="otp4"
              className="otp"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              aria-label="digit 4"
              ref={(el) => (inputsRef.current[3] = el)}
              onChange={(e) => handleInput(e, 3)}
              onKeyDown={(e) => handleKeyDown(e, 3)}
            />
            <input
              name="otp5"
              className="otp"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              aria-label="digit 5"
              ref={(el) => (inputsRef.current[4] = el)}
              onChange={(e) => handleInput(e, 4)}
              onKeyDown={(e) => handleKeyDown(e, 4)}
            />
            <input
              name="otp6"
              className="otp"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              aria-label="digit 6"
              ref={(el) => (inputsRef.current[5] = el)}
              onChange={(e) => handleInput(e, 5)}
              onKeyDown={(e) => handleKeyDown(e, 5)}
            />
          </div>
          <button className="btn" type="submit">Verify</button>
        </form>
        <p className="muted small">Resend code</p>
      </div>
    </div>
  );
};

export default PartnerOTP;
