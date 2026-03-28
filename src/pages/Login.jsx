// Login.jsx
import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleLoginCallback = useCallback(async (response) => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8089'}/api/auth/google-login`, {
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
        navigate('/dashboard');
      } else {
        const data = await res.json();
        alert(data.message || 'Google login failed');
      }
    } catch (err) {
      alert('An error occurred with Google login. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        callback: handleGoogleLoginCallback
      });
      
      window.google.accounts.id.renderButton(
        document.getElementById('google-login-button'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%'
        }
      );
    }
  }, [handleGoogleLoginCallback]);

  const handleOAuthLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:8089'}/oauth2/authorization/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1931] via-[#1A3D63] to-[#0A1931] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
            <span className="text-3xl">🏫</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Smart Campus</h1>
          <p className="text-[#B3CFE5]">Campus Management System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0A1931] mb-2">Welcome Back</h2>
            <p className="text-[#1A3D63] text-sm">Sign in to your account to continue</p>
          </div>

          <div id="google-login-button" className="mb-6 flex justify-center"></div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#B3CFE5]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#1A3D63] font-medium">Or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOAuthLogin}
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#4A7FA7] to-[#1A3D63] hover:from-[#4A7FA7] hover:to-[#0A1931] text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            🔐 Sign in with Google OAuth2
          </button>

          <div className="mt-6 space-y-3">
            <p className="text-center text-[#1A3D63] text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-[#4A7FA7] hover:text-[#1A3D63] font-semibold transition-colors"
              >
                Create one
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-[#B3CFE5] text-xs mt-8">
          🔒 Protected by industry-standard security
        </p>
      </div>
    </div>
  );
}

export default Login;