'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import loginImage from '@/public/images/loginPageImage.jpeg';
import './page.css';
import toast, { Toaster } from 'react-hot-toast';
import { registerPatient } from '@/src/actions/Patient/patient.action';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/src/store/useSessionStore';
import { getPatientIdByEmail } from '@/src/actions/Patient/patient.action';

const LoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleValidSignIn = () => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return false;
    }
    if (mode === 'signup' && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };
  const handleValidLogIn = () => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return false;
    }
    return true;
  };

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    if (!handleValidSignIn()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      await registerPatient(formData);
      toast.success('Registration successful! Redirecting to dashboard...');
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.ok) {
        toast.success('Login successful!');
        // Redirect to the patient dashboard
        router.push('/patient/dashboard');
      } else {
        toast.error('Invalid email or password');
      }

    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (!handleValidLogIn()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);


    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (!res) {
        toast.error('Login failed. Please try again.');
        setIsLoading(false);
        return;
      }

      if (res?.ok) {
        toast.success('Login successful!');
        router.push('/patient/dashboard');
      } else {
        toast.error('Invalid email or password');
      }
      setIsLoading(false);
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="login-container">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="left-section">
        <Image src={loginImage} alt="Doctor" className="login-image" />
      </div>

      <div className="right-section">
        <div className="form-wrapper">
          <div className="tabs">
            <button

              onClick={() => setMode('login')}
              className={`tab ${mode === 'login' ? 'active' : ''}`}
            >
              Log in
            </button>
            <button

              onClick={() => setMode('signup')}
              className={`tab ${mode === 'signup' ? 'active' : ''}`}
            >
              Sign Up
            </button>
          </div>

          {mode === 'login' ? (
            <>
              <p className="tagline">
                Your health journey starts here, <br />
                log in to connect, consult, and care.
              </p>

              <input
                type="email"
                placeholder="Your Email"
                className="email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Your Password"
                className="email-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                className="continue-btn"
                onClick={handleLogin}
                disabled={isLoading}
                
              >
                Log in
              </button>

              <div className="divider">
                <hr />
                <span>OR</span>
                <hr />
              </div>

              <button
                disabled={isLoading}
                onClick={() =>
                  signIn('google', { callbackUrl: '/patient/dashboard' })
                }
                className="google-btn"
              >
                <img
                  className="google-icon"
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google logo"
                />
                <span className="btn-text">Log in with Google</span>
              </button>
            </>
          ) : (
            // Sign Up Form
            <>
              <p className="tagline">
                Join us today and take the first step <br />
                towards better health and well-being.
              </p>

              <form className='form-signup' onSubmit={handleSignUp}>
                <input
                  name='email'
                  type="email"
                  placeholder="Your Email"
                  className="email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  name='password'
                  type="password"
                  placeholder="Set Password"
                  className="email-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  name='confirmPassword'
                  type="password"
                  placeholder="Confirm Password"
                  className="email-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  disabled={isLoading}
                  type="submit"
                  className="continue-btn">Sign Up</button>
              </form>
              <div className="divider">
                <hr />
                <span>OR</span>
                <hr />
              </div>

              <button
                disabled={isLoading}
                onClick={() => signIn('google', { callbackUrl: '/patient/dashboard' })}
                className="google-btn"
              >
                <img className="google-icon" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" />
                <span className="btn-text">Sign Up with Google</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;