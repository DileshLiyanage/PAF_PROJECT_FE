import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const getStatusStyles = (status) => {
  const normalized = (status || '').toUpperCase();

  if (normalized === 'OPEN') return 'bg-amber-100 text-amber-700 border-amber-300/70';
  if (normalized === 'IN_PROGRESS') return 'bg-sky-100 text-sky-700 border-sky-300/70';
  if (normalized === 'RESOLVED') return 'bg-emerald-100 text-emerald-700 border-emerald-300/70';
  if (normalized === 'CLOSED') return 'bg-slate-200 text-slate-700 border-slate-300/70';
  if (normalized === 'REJECTED') return 'bg-rose-100 text-rose-700 border-rose-300/70';

  return 'bg-indigo-100 text-indigo-700 border-indigo-300/70';
};

const formatDateTime = (value) => {
  if (!value) return 'N/A';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
};

const formatCategory = (value) => {
  if (!value) return 'N/A';
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await axiosInstance.get('/api/tickets');
        const sortedTickets = [...(res.data || [])].sort((a, b) => {
          const aTime = new Date(a.createdAt || 0).getTime();
          const bTime = new Date(b.createdAt || 0).getTime();
          return bTime - aTime;
        });
        setTickets(sortedTickets);
      } catch (err) {
        console.error(err);
        setError('Failed to load your tickets. Please refresh and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const closeModal = () => setSelectedTicket(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-3xl border border-white/70 bg-white/45 p-6 shadow-lg backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-slate-800 md:text-4xl">My Incident Tickets</h1>
          <p className="mt-2 text-sm text-slate-600">View all submitted tickets and click any card to see full details.</p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-white/70 bg-white/50 p-6 text-slate-700 shadow-md backdrop-blur-lg">
            Loading tickets...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-md">
            {error}
          </div>
        )}

        {!loading && !error && tickets.length === 0 && (
          <div className="rounded-2xl border border-white/70 bg-white/50 p-8 text-center text-slate-600 shadow-md backdrop-blur-lg">
            No tickets found yet.
          </div>
        )}

        {!loading && !error && tickets.length > 0 && (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                onClick={() => setSelectedTicket(ticket)}
                className="w-full rounded-2xl border border-white/70 bg-white/45 p-5 text-left shadow-md backdrop-blur-lg transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-800">
                      #{ticket.id}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-600">
                      {formatCategory(ticket.category)}
                      {ticket.resourceId ? ` • ${ticket.resourceId}` : ''}
                    </p>
                    <p className="mt-2 max-w-3xl text-sm text-slate-700">
                      {ticket.description?.length > 120 ? `${ticket.description.slice(0, 120)}...` : (ticket.description || 'No description')}
                    </p>
                  </div>

                  <div className="md:text-right">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(ticket.status)}`}>
                      {ticket.status || 'N/A'}
                    </span>
                    <p className="mt-2 text-xs text-slate-500">Created: {formatDateTime(ticket.createdAt)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedTicket && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4"
          onClick={closeModal}
          role="presentation"
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Ticket Details</h2>
                <p className="text-sm text-slate-600">#{selectedTicket.id}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
              >
                Close
              </button>
            </div>

            <div className="grid gap-3 rounded-2xl border border-white/70 bg-white/40 p-4 text-sm text-slate-700 md:grid-cols-2">
              <p><span className="font-semibold">Category:</span> {formatCategory(selectedTicket.category)}</p>
              <p><span className="font-semibold">Item Code:</span> {selectedTicket.resourceId || 'N/A'}</p>
              <p><span className="font-semibold">Priority:</span> {selectedTicket.priority || 'N/A'}</p>
              <p><span className="font-semibold">Status:</span> {selectedTicket.status || 'N/A'}</p>
              <p><span className="font-semibold">Assigned To:</span> {selectedTicket.assignedTo || 'Not assigned'}</p>
              <p><span className="font-semibold">Created At:</span> {formatDateTime(selectedTicket.createdAt)}</p>
              <p><span className="font-semibold">Updated At:</span> {formatDateTime(selectedTicket.updatedAt)}</p>
              <p><span className="font-semibold">User:</span> {selectedTicket.userId || 'N/A'}</p>
            </div>

            <div className="mt-4 rounded-2xl border border-white/70 bg-white/40 p-4">
              <h3 className="text-sm font-semibold text-slate-700">Description</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{selectedTicket.description || 'N/A'}</p>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/70 bg-white/40 p-4 text-sm text-slate-700">
                <h3 className="font-semibold">Preferred Contact</h3>
                <p className="mt-2"><span className="font-semibold">Email:</span> {selectedTicket.contactEmail || 'N/A'}</p>
                <p><span className="font-semibold">Phone:</span> {selectedTicket.contactPhone || 'N/A'}</p>
              </div>

              <div className="rounded-2xl border border-white/70 bg-white/40 p-4 text-sm text-slate-700">
                <h3 className="font-semibold">Resolution Notes</h3>
                <p className="mt-2 whitespace-pre-wrap">{selectedTicket.resolutionNotes || 'Not available yet.'}</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/70 bg-white/40 p-4">
              <h3 className="text-sm font-semibold text-slate-700">Evidence Images</h3>
              {selectedTicket.imageUrls?.length ? (
                <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {selectedTicket.imageUrls.map((url) => (
                    <a key={url} href={url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-white/70">
                      <img src={url} alt="ticket evidence" className="h-24 w-full object-cover" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-600">No evidence images attached.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketList;