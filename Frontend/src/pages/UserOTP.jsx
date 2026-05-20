import React, { useRef } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
// using fetch for credentialed request
import { useNavigate } from 'react-router-dom';
import { apiUrl } from "../config/api";

const UserOTP = () => {
  const inputsRef = useRef([]);
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = Array.from({ length: 6 }).map((_, i) => e.target[`otp${i+1}`].value).join('');
    console.log('Entered OTP:', otp);
      // include email (saved from registration) because backend requires it
      const email = (() => {
        try { return localStorage.getItem('registrationEmail'); } catch (err) { return null; }
      })();
      if (!email) {
        alert('Email not found. Please go back to registration or re-enter your email.');
        return;
      }

      try {
        const res = await fetch(apiUrl('/api/auth/user/verify-otp'), {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp })
        });

        const data = await res.json().catch(() => null);
        if (!res.ok) {
          const msg = data?.message || JSON.stringify(data) || res.statusText;
          throw new Error(msg);
        }

        console.log('OTP verify response:', data);
        try { localStorage.removeItem('registrationEmail'); } catch (err) { /* ignore */ }
        alert('OTP verified successfully.');
        navigate('/app');
      } catch (err) {
        const serverMsg = err?.message || 'Network error';
        console.error('OTP verification error:', err, 'serverMsg:', serverMsg);
        alert('OTP verification failed: ' + serverMsg);
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
        <h2>Verify OTP</h2>
        <p className="muted">We sent a 6-digit code to your email/phone</p>
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
        <p className="muted small">Didn't receive it? Resend</p>
      </div>
    </div>
  );
};

export default UserOTP;
