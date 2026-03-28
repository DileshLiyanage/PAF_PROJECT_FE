// Register.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = useCallback(async (response) => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/auth/google-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: response.credential
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        alert('Registration successful! Redirecting to dashboard...');
        navigate('/dashboard');
      } else {
        const data = await res.json();
        setError(data.message || 'Google registration failed');
      }
    } catch (err) {
      setError('An error occurred with Google registration. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleGoogleSignIn = useCallback(() => {
    window.google?.accounts.id.renderButton(
      document.getElementById('google-button-container'),
      { theme: 'outline', size: 'large', width: '100%' }
    );
  }, []);

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        callback: handleGoogleLogin
      });
      handleGoogleSignIn();
    }
  }, [handleGoogleLogin, handleGoogleSignIn]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1931] via-[#1A3D63] to-[#0A1931] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Smart Campus</h1>
          <p className="text-[#B3CFE5]">Create your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#0A1931] mb-1">Create Account</h2>
            <p className="text-[#1A3D63] text-sm">Join Smart Campus today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-600 text-sm">
              {error}
            </div>
          )}

          <div id="google-button-container" className="mb-6 flex justify-center py-2"></div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#B3CFE5]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#1A3D63]">Or register with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-[#1A3D63] mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full px-3 py-2 border border-[#B3CFE5] text-[#0A1931] rounded-lg focus:outline-none focus:border-[#4A7FA7] focus:ring-2 focus:ring-[#4A7FA7]/20 text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-[#1A3D63] mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full px-3 py-2 border border-[#B3CFE5] text-[#0A1931] rounded-lg focus:outline-none focus:border-[#4A7FA7] focus:ring-2 focus:ring-[#4A7FA7]/20 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1A3D63] mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-[#B3CFE5] text-[#0A1931] rounded-lg focus:outline-none focus:border-[#4A7FA7] focus:ring-2 focus:ring-[#4A7FA7]/20 text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#1A3D63] mb-1">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 border border-[#B3CFE5] text-[#0A1931] rounded-lg focus:outline-none focus:border-[#4A7FA7] focus:ring-2 focus:ring-[#4A7FA7]/20 text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#1A3D63] mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full px-3 py-2 border border-[#B3CFE5] text-[#0A1931] rounded-lg focus:outline-none focus:border-[#4A7FA7] focus:ring-2 focus:ring-[#4A7FA7]/20 text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-gradient-to-r from-[#4A7FA7] to-[#1A3D63] hover:from-[#4A7FA7] hover:to-[#0A1931] text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-6"
            >
              {loading ? '⏳ Creating Account...' : '✓ Register Now'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#1A3D63] text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[#4A7FA7] hover:text-[#1A3D63] font-semibold transition-colors"
              >
                Log in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;