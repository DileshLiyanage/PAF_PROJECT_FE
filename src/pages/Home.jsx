import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <div className="page">
      <div className="container text-center">
        <h1>Welcome to PAF Project</h1>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          Explore and manage resources with ease
        </p>
        <div className="mt-4">
          <Link to="/resources" className="btn btn-primary" style={{ marginRight: '10px' }}>
            Browse Resources
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
