import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
  axiosInstance.get(`/api/tickets/${id}`)
    .then(res => {
      setTicket(res.data);
      setStatus(res.data.status);
    })
    .catch(err => console.error(err));
}, [id]);

  const updateStatus = async () => {
    try {
      await axios.patch(`http://localhost:8089/api/tickets/${id}`, null, {
        params: { status, notes, assignedTo }
      });
      alert('Ticket updated successfully!');
      window.location.reload();
    } catch (err) {
      alert('Update failed');
    }
  };

  if (!ticket) return <div>Loading ticket...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button onClick={() => navigate('/tickets')} className="mb-4 text-blue-600">← Back to List</button>
      <h1 className="text-3xl font-bold">Ticket #{ticket.id}</h1>
      <p className="text-gray-600 mt-2">{ticket.description}</p>

      {/* Status badges */}
      <div className="flex gap-2 mt-6">
        <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full">{ticket.status}</span>
      </div>

      {/* Images */}
      <div className="mt-8">
        <h3 className="font-medium mb-3">Attached Images</h3>
        <div className="flex gap-4">
          {ticket.imageUrls.map((url, i) => (
            <img key={i} src={`http://localhost:8089${url}`} alt="evidence" className="w-40 h-40 object-cover rounded" />
          ))}
        </div>
      </div>

      {/* Technician / Status Update (Admin/Technician only) */}
      <div className="mt-10 bg-gray-50 p-6 rounded-xl">
        <h3 className="font-semibold mb-4">Update Ticket Status</h3>
        <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-3 border rounded mb-4">
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <input type="text" placeholder="Resolution notes" value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-3 border rounded mb-4" />
        <input type="text" placeholder="Assign to (Technician name)" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="w-full p-3 border rounded mb-4" />
        <button onClick={updateStatus} className="bg-green-600 text-white px-8 py-3 rounded">Update Ticket</button>
      </div>
    </div>
  );
};

export default TicketDetail;