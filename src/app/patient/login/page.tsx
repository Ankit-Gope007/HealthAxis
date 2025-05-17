'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import loginImage from '@/public/images/loginPageImage.jpeg';
import './page.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState('login');



  return (
    <div className="login-container">
      <div className="left-section">
        <Image src={loginImage} alt="Doctor" className="login-image" />
      </div>
      <div className="right-section">
        <div className="form-wrapper">
          <div className="tabs">
            <button 
              onClick={() => setMode('login')}
              className={`tab ${mode === 'login' ? 'active' : ''}`}
              >Log in</button>
            <button
              onClick={() => setMode('signup')}
              className={`tab ${mode === 'signup' ? 'active' : ''}`}
              >Sign Up</button>
            
          </div>
          <p className="tagline">
            Your health journey starts here, <br />
            log in to connect, consult, and care.
          </p>


        {/* WRITE YOUR OWN EMAIL AND CONTINUE BUTTON */}
          <input
            type="email"
            placeholder="Your Email"
            className="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="continue-btn">{
            mode === 'login' ? 'Log in' : 'Sign Up' 
            }</button>

          <div className="divider">
            <hr />
            <span>OR</span>
            <hr />
          </div>

        {/* CONTINUE WITH GOOGLE BUTTON */}
          <button
            onClick={() => signIn('google', { callbackUrl: '/patient/dashboard' })}
            className="google-btn">

            <img className="google-icon" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" />
            <span className="btn-text">{
              mode === 'login' ? 'Log in' : 'Sign Up'
              } with Google</span>
          </button>


        </div>
      </div>
    </div>
  );
};

export default LoginPage;
