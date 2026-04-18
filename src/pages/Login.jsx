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
    <div style={{padding:20}}>
      <h2>Login (stub)</h2>
      <button onClick={handleLogin}>Login as USER</button>
    </div>
  );
}
