import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axiosInstance';
import ResourceForm from './ResourceForm';

export default function AddResource(){
  const navigate = useNavigate();

  const handleSubmit = async (payload)=>{
    try{
      await axios.post('/resources', payload);
      navigate('/admin/resources');
    }catch(e){ console.error(e); }
  };

  return (
    <div style={{padding:20}}>
      <h2>Add New Resource</h2>
      <ResourceForm onSubmit={handleSubmit} submitLabel="Create" />
    </div>
  );
}
