import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const navigate = useNavigate();
  const handleLogin = () => {
    // stubbed login: set dummy token and user
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('user', JSON.stringify({ roles: ['USER'] }));
    navigate('/resources');
  };

  return (
    <div className="page">
      <div className="container">
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="card-header text-center">
            <h2>Login</h2>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Login as USER
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
