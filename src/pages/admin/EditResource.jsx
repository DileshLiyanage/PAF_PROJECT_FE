import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axiosInstance';
import ResourceForm from './ResourceForm';
import '../../styles/AddEditResource.css';

export default function EditResource(){
  const { id } = useParams();
  const [initial, setInitial] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{ if(id) fetch(); },[id]);

  const fetch = async ()=>{
    try{
      const res = await axios.get(`/resources/${id}`);
      setInitial(res.data);
    }catch(e){ console.error(e); }
  };

  const handleSubmit = async (payload)=>{
    try{
      await axios.put(`/resources/${id}`, payload);
      navigate('/admin/resources');
    }catch(e){ console.error(e); }
  };

  if(!initial) return <div style={{padding:20}}>Loading...</div>;

  return (
    <div style={{padding:20}}>
      <h2>Edit Resource</h2>
      <ResourceForm initial={initial} onSubmit={handleSubmit} submitLabel="Update" />
    </div>
  );
}
