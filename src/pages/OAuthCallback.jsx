import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OAuthCallback(){
  const navigate = useNavigate();
  useEffect(()=>{
    // in real app parse token from URL
    navigate('/resources');
  },[]);
  return <div style={{padding:20}}>Processing OAuth callback...</div>;
}
