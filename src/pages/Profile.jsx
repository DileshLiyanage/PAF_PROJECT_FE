import React from 'react';

export default function Profile(){
  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h2>User Profile</h2>
          </div>
          <div>
            <p><strong>Name:</strong> John Doe</p>
            <p><strong>Email:</strong> john@example.com</p>
            <p><strong>Role:</strong> User</p>
            <button className="btn btn-primary mt-3">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}
