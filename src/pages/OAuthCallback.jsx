// OAuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../utils/auth';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get('token');

    if (token) {
      saveToken(token);
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1931] via-[#1A3D63] to-[#0A1931] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#4A7FA7] to-[#B3CFE5] rounded-full mb-6 animate-spin">
          <div className="absolute w-12 h-12 bg-gradient-to-br from-[#0A1931] via-[#1A3D63] to-[#0A1931] rounded-full"></div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Logging you in...</h2>
        <p className="text-[#B3CFE5]">Please wait while we authenticate your account</p>
      </div>
    </div>
  );
};

export default OAuthCallback;