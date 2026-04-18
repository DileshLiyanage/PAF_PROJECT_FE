import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import '../../styles/ResourceDashboard.css';

export default function ResourceDashboard(){
  const [resources, setResources] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{ fetchResources(); },[]);

  const fetchResources = async ()=>{
    try{
      const res = await axios.get('/resources');
      setResources(res.data || []);
    }catch(e){ console.error(e); }
  };

  const remove = async (id)=>{
    if(!window.confirm('Delete this resource?')) return;
    try{ await axios.delete(`/resources/${id}`); fetchResources(); }catch(e){ console.error(e); }
  };

  const toggleStatus = async (r)=>{
    const newStatus = r.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
    try{ await axios.put(`/resources/${r.id}`, {...r, status: newStatus}); fetchResources(); }catch(e){ console.error(e); }
  };

  return (
    <div style={{padding:20}}>
      <h2>Admin Resource Dashboard</h2>
      <div style={{marginBottom:12}}>
        <button onClick={()=>navigate('/admin/resources/new')}>Add New Resource</button>
      </div>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr style={{textAlign:'left',borderBottom:'1px solid #ddd'}}>
            <th>Name</th><th>Type</th><th>Capacity</th><th>Location</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map(r=> (
            <tr key={r.id} style={{borderBottom:'1px solid #f3f3f3'}}>
              <td>{r.name}</td>
              <td>{r.type}</td>
              <td>{r.capacity}</td>
              <td>{r.location}</td>
              <td>{r.status}</td>
              <td>
                <button onClick={()=>navigate(`/admin/resources/${r.id}/edit`)}>Edit</button>
                <button onClick={()=>remove(r.id)} style={{marginLeft:8}}>Delete</button>
                <button onClick={()=>toggleStatus(r)} style={{marginLeft:8}}>Toggle Status</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
