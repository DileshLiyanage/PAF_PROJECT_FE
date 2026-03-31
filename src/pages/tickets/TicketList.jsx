import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
  axiosInstance.get('/api/tickets')
    .then(res => setTickets(res.data))
    .catch(err => console.error(err));
}, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Incident Tickets</h1>
      <div className="grid gap-4">
        {tickets.map(ticket => (
          <div key={ticket.id} className="border p-4 rounded-lg hover:shadow">
            <Link to={`/tickets/${ticket.id}`} className="text-blue-600 font-medium">
              #{ticket.id} - {ticket.category}
            </Link>
            <p className="text-sm text-gray-600">{ticket.description.substring(0, 80)}...</p>
            <span className={`inline-block px-3 py-1 text-xs rounded-full mt-2 ${ticket.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
              {ticket.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketList;