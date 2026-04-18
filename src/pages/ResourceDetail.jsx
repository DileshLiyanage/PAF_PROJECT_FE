import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';

export default function ResourceDetail(){
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{ if(id) fetchResource(); },[id]);

  const fetchResource = async ()=>{
    try{
      const res = await axios.get(`/resources/${id}`);
      setResource(res.data);
    }catch(e){ console.error(e); }
  };

  if(!resource) return <div style={{padding:20}}>Loading...</div>;

  return (
    <div style={{padding:20}}>
      <h2>{resource.name}</h2>
      <div>Type: {resource.type}</div>
      <div>Capacity: {resource.capacity}</div>
      <div>Location: {resource.location}</div>
      <div style={{marginTop:8}}>
        <strong>Status: </strong>
        <span style={{padding:'4px 8px',borderRadius:4,background: resource.status==='ACTIVE'? '#d1fae5':'#fee2e2',color: resource.status==='ACTIVE'? '#065f46':'#991b1b'}}>{resource.status}</span>
        {resource.status === 'OUT_OF_SERVICE' && (
          <span style={{marginLeft:12,color:'#7c2d12',background:'#fff4f2',padding:'4px 8px',borderRadius:4}}>Warning: Out of Service</span>
        )}
      </div>

      <div style={{marginTop:12}}>
        <h4>Availability Windows</h4>
        {resource.availability && resource.availability.length>0 ? (
          <ul>{resource.availability.map((a,idx)=> <li key={idx}>{a}</li>)}</ul>
        ) : <div>No availability data.</div>}
      </div>

      <div style={{marginTop:20}}>
        <button onClick={()=> navigate(`/bookings?resourceId=${resource.id}`)} disabled={resource.status==='OUT_OF_SERVICE'}>Book this Resource</button>
        <button style={{marginLeft:8}} onClick={()=>navigate('/resources')}>Back</button>
      </div>
    </div>
  );
}
