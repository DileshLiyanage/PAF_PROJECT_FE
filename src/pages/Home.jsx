import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <div style={{padding:20}}>
      <h1>Welcome</h1>
      <p>This is the PAF Project front-end.</p>
      <p><Link to="/resources">Browse Resources</Link></p>
    </div>
  );
}
