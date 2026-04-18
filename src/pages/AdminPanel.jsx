import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminPanel(){
  return (
    <div style={{padding:20}}>
      <h2>Admin Panel (stub)</h2>
      <p><Link to="/admin/resources">Manage Resources</Link></p>
    </div>
  );
}
