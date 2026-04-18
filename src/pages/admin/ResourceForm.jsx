import React, { useState } from 'react';

export default function ResourceForm({ initial = {}, onSubmit, submitLabel = 'Save' }){
  const [form, setForm] = useState({
    name: initial.name || '',
    type: initial.type || '',
    capacity: initial.capacity || '',
    location: initial.location || '',
    availability: initial.availability ? initial.availability.join('\n') : '',
    status: initial.status || 'ACTIVE'
  });

  const [errors, setErrors] = useState({});

  const validate = ()=>{
    const e = {};
    if(!form.name) e.name = 'Name is required';
    if(!form.type) e.type = 'Type is required';
    if(!form.capacity || isNaN(Number(form.capacity)) || Number(form.capacity) < 1) e.capacity = 'Capacity must be a positive number';
    if(!form.location) e.location = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev)=>{
    ev.preventDefault();
    if(!validate()) return;
    const payload = {
      ...initial,
      name: form.name,
      type: form.type,
      capacity: Number(form.capacity),
      location: form.location,
      availability: form.availability.split('\n').map(s=>s.trim()).filter(Boolean),
      status: form.status
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} style={{display:'grid',gap:8,maxWidth:720}}>
      <div>
        <label>Name</label><br/>
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        {errors.name && <div style={{color:'red'}}>{errors.name}</div>}
      </div>

      <div>
        <label>Type</label><br/>
        <input value={form.type} onChange={e=>setForm({...form,type:e.target.value})} />
        {errors.type && <div style={{color:'red'}}>{errors.type}</div>}
      </div>

      <div>
        <label>Capacity</label><br/>
        <input value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})} />
        {errors.capacity && <div style={{color:'red'}}>{errors.capacity}</div>}
      </div>

      <div>
        <label>Location</label><br/>
        <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} />
        {errors.location && <div style={{color:'red'}}>{errors.location}</div>}
      </div>

      <div>
        <label>Availability (one per line)</label><br/>
        <textarea rows={4} value={form.availability} onChange={e=>setForm({...form,availability:e.target.value})} />
      </div>

      <div>
        <label>Status</label><br/>
        <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
        </select>
      </div>

      <div>
        <button type="submit">{submitLabel}</button>
      </div>
    </form>
  );
}
