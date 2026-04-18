import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const ResourceCard = ({ r, onClick }) => (
  <div onClick={onClick} style={{border:'1px solid #ddd',padding:12,borderRadius:6,cursor:'pointer'}}>
    <h3>{r.name}</h3>
    <div>Type: {r.type}</div>
    <div>Capacity: {r.capacity}</div>
    <div>Location: {r.location}</div>
    <div style={{marginTop:6}}>
      <span style={{padding:'4px 8px',borderRadius:4,background: r.status==='ACTIVE'? '#d1fae5':'#fee2e2',color: r.status==='ACTIVE'? '#065f46':'#991b1b'}}>{r.status}</span>
    </div>
  </div>
);

export default function ResourceCatalogue(){
  const [resources, setResources] = useState([]);
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  useEffect(()=>{ fetchResources(); },[q,type,status,location]);

  const fetchResources = async () => {
    try{
      const res = await axios.get('/resources', { params: { q, type, status, location } });
      setResources(res.data || []);
    }catch(e){
      console.error(e);
    }
  };

  const filtered = resources;

  const types = Array.from(new Set(resources.map(r=>r.type))).filter(Boolean);
  const locations = Array.from(new Set(resources.map(r=>r.location))).filter(Boolean);

  return (
    <div style={{padding:20}}>
      <h2>Resource Catalogue</h2>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <input placeholder="Search by name" value={q} onChange={e=>setQ(e.target.value)} />
        <select value={type} onChange={e=>setType(e.target.value)}>
          <option value="">All types</option>
          {types.map(t=> <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">All status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
        </select>
        <select value={location} onChange={e=>setLocation(e.target.value)}>
          <option value="">All locations</option>
          {locations.map(l=> <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
        {filtered.map(r=> (
          <ResourceCard key={r.id} r={r} onClick={()=>navigate(`/resources/${r.id}`)} />
        ))}
      </div>
    </div>
  );
}
