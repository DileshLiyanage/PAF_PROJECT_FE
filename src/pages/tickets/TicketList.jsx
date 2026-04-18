import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { getRole, getToken } from '../../utils/auth';

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

const extractCategoryParts = (value) => {
  if (!value) {
    return { main: 'N/A', sub: 'N/A' };
  }

  const tokens = value.split('_');
  if (tokens.length === 1) {
    return { main: formatCategory(tokens[0]), sub: 'N/A' };
  }

  return {
    main: formatCategory(tokens[0]),
    sub: formatCategory(tokens.slice(1).join('_'))
  };
};

const getPriorityTextClass = (priority) => {
  const normalized = (priority || '').toUpperCase();
  if (normalized === 'LOW') return 'text-emerald-600';
  if (normalized === 'MEDIUM') return 'text-amber-500';
  if (normalized === 'HIGH') return 'text-rose-600';
  return 'text-slate-600';
};

const getStatusPillClass = (status) => {
  const normalized = (status || '').toUpperCase();
  if (normalized === 'OPEN') return 'bg-amber-100 text-amber-700 border-amber-300/70';
  if (normalized === 'IN_PROGRESS') return 'bg-sky-100 text-sky-700 border-sky-300/70';
  if (normalized === 'RESOLVED') return 'bg-emerald-100 text-emerald-700 border-emerald-300/70';
  if (normalized === 'CLOSED') return 'bg-slate-200 text-slate-700 border-slate-300/70';
  if (normalized === 'REJECTED') return 'bg-rose-100 text-rose-700 border-rose-300/70';
  return 'bg-indigo-100 text-indigo-700 border-indigo-300/70';
};

const getTicketPageBackground = (isSubmittedTicketsPage, isMyTicketsPage) => {
  if (isSubmittedTicketsPage) {
    return "linear-gradient(125deg, rgba(5, 17, 38, 0.86), rgba(25, 58, 105, 0.66)), url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1800&q=80')";
  }

  if (isMyTicketsPage) {
    return "linear-gradient(125deg, rgba(4, 18, 41, 0.82), rgba(18, 61, 122, 0.64)), url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=80')";
  }

  return "linear-gradient(125deg, rgba(9, 20, 41, 0.76), rgba(33, 87, 141, 0.58)), url('https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1800&q=80')";
};

const getPriorityFilterClass = (priority, active) => {
  if (priority === 'LOW') return active ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-emerald-300 bg-emerald-100 text-emerald-700';
  if (priority === 'MEDIUM') return active ? 'border-amber-500 bg-amber-500 text-white' : 'border-amber-300 bg-amber-100 text-amber-700';
  if (priority === 'HIGH') return active ? 'border-rose-500 bg-rose-500 text-white' : 'border-rose-300 bg-rose-100 text-rose-700';
  return active ? 'border-slate-700 bg-slate-700 text-white' : 'border-slate-300 bg-slate-100 text-slate-700';
};

const toDisplayTicketId = (index) => `Ticket${String(index + 1).padStart(4, '0')}`;

const getDisplayTicketIdByRecord = (allTickets, recordId) => {
  const idx = allTickets.findIndex((ticket) => ticket.id === recordId);
  return toDisplayTicketId(idx >= 0 ? idx : 0);
};

const getCurrentUserId = () => {
  try {
    const token = getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.email || payload.sub || payload.username || null;
  } catch {
    return null;
  }
};

const getCurrentUserTokens = () => {
  try {
    const token = getToken();
    if (!token) return [];
    const payload = JSON.parse(atob(token.split('.')[1]));

    return [
      payload.sub,
      payload.email,
      payload.username,
      payload.name,
      payload.preferred_username
    ]
      .filter(Boolean)
      .map((item) => String(item).trim().toLowerCase());
  } catch {
    return [];
  }
};

const matchesAssignedToUser = (assignedTo, userTokens) => {
  if (!assignedTo || userTokens.length === 0) return false;
  const assigned = String(assignedTo).trim().toLowerCase();
  return userTokens.some((token) => assigned === token || assigned.includes(token));
};

const getUserDisplayName = (user) => {
  if (!user) return 'Technician';
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return user.name || name || user.email || 'Technician';
};

const formatAssignedProfile = (assignedTo) => {
  const raw = String(assignedTo || '').trim();
  if (!raw) {
    return { name: 'Not assigned', email: '', raw: '' };
  }

  const match = raw.match(/^(.*?)(?:\s*<(.+?)>)?$/);
  const name = match?.[1]?.trim() || raw;
  const email = match?.[2]?.trim() || '';

  return { name, email, raw };
};

const modalScrollbarStyles = `
  .ticket-modal-scroll::-webkit-scrollbar {
    width: 6px;
  }

  .ticket-modal-scroll::-webkit-scrollbar-track {
    margin-top: 18px;
    margin-bottom: 18px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.2);
  }

  .ticket-modal-scroll::-webkit-scrollbar-thumb {
    border-radius: 9999px;
    background: rgba(100, 116, 139, 0.6);
  }

  .ticket-modal-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 116, 139, 0.8);
  }
`;

const TicketList = () => {
  const location = useLocation();
  const currentRole = getRole();
  const currentUserId = getCurrentUserId();
  const currentUserTokens = useMemo(() => getCurrentUserTokens(), []);
  const isStaff = currentRole === 'ADMIN' || currentRole === 'TECHNICIAN';
  const isSubmittedTicketsPage = location.pathname === '/admin/tickets';
  const isAssignedTicketsPage = location.pathname === '/technician/assigned-tickets';
  const isMyTicketsPage = location.pathname === '/tickets';

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusInput, setStatusInput] = useState('OPEN');
  const [notesInput, setNotesInput] = useState('');
  const [assignedToInput, setAssignedToInput] = useState('');
  const [updatingTicket, setUpdatingTicket] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentInput, setEditingCommentInput] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [inlineStatusUpdateId, setInlineStatusUpdateId] = useState(null);
  const [technicianOptions, setTechnicianOptions] = useState([]);
  const [techniciansLoading, setTechniciansLoading] = useState(false);

  const prioritySummary = {
    LOW: tickets.filter((ticket) => (ticket.priority || '').toUpperCase() === 'LOW').length,
    MEDIUM: tickets.filter((ticket) => (ticket.priority || '').toUpperCase() === 'MEDIUM').length,
    HIGH: tickets.filter((ticket) => (ticket.priority || '').toUpperCase() === 'HIGH').length
  };

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await axiosInstance.get('/api/tickets');
        let filteredTickets = [...(res.data || [])];

        if (isMyTicketsPage && currentUserId) {
          const normalizedUserEmail = String(currentUserId).trim().toLowerCase();
          filteredTickets = filteredTickets.filter(
            (ticket) => String(ticket.userId || '').trim().toLowerCase() === normalizedUserEmail
          );
        }

        if (isAssignedTicketsPage) {
          filteredTickets = filteredTickets.filter((ticket) => matchesAssignedToUser(ticket.assignedTo, currentUserTokens));
        }

        const sortedTickets = filteredTickets.sort((a, b) => {
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

    const intervalId = setInterval(fetchTickets, 30000);
    return () => clearInterval(intervalId);
  }, [currentUserId, currentUserTokens, isAssignedTicketsPage, isMyTicketsPage]);

  useEffect(() => {
    if (!isSubmittedTicketsPage || !isStaff) {
      setTechnicianOptions([]);
      return;
    }

    let isMounted = true;

    const fetchTechnicians = async () => {
      setTechniciansLoading(true);
      try {
        const response = await axiosInstance.get('/api/admin/users');
        const technicians = (response.data || [])
          .filter((user) => String(user.role || '').toUpperCase() === 'TECHNICIAN')
          .map((user) => {
            const displayName = getUserDisplayName(user);
            const email = user.email || '';
            return {
              value: email ? `${displayName} <${email}>` : displayName,
              label: email ? `${displayName} (${email})` : displayName,
              profileName: displayName,
              profileEmail: email
            };
          });

        if (isMounted) {
          setTechnicianOptions(technicians);
        }
      } catch (err) {
        if (isMounted) {
          setTechnicianOptions([]);
        }
      } finally {
        if (isMounted) {
          setTechniciansLoading(false);
        }
      }
    };

    fetchTechnicians();

    return () => {
      isMounted = false;
    };
  }, [isStaff, isSubmittedTicketsPage]);

  const openTicketModal = (ticket) => {
    setSelectedTicket(ticket);
    setStatusInput(ticket.status || 'OPEN');
    setNotesInput(ticket.resolutionNotes || '');
    setAssignedToInput(ticket.assignedTo || '');
    setCommentInput('');
    setEditingCommentId(null);
    setEditingCommentInput('');
    setModalError('');
  };

  const closeModal = () => {
    setSelectedTicket(null);
    setModalError('');
  };

  const syncUpdatedTicket = (updated) => {
    setTickets((prev) => prev.map((ticket) => (ticket.id === updated.id ? updated : ticket)));
    setSelectedTicket(updated);
    setStatusInput(updated.status || 'OPEN');
    setNotesInput(updated.resolutionNotes || '');
    setAssignedToInput(updated.assignedTo || '');
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;

    try {
      setUpdatingTicket(true);
      setModalError('');
      const response = await axiosInstance.patch(`/api/tickets/${selectedTicket.id}`, null, {
        params: {
          status: statusInput,
          notes: notesInput || undefined,
          assignedTo: assignedToInput || undefined
        }
      });
      syncUpdatedTicket(response.data);
      window.alert('Ticket updated successfully!');
      closeModal();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update ticket';
      setModalError(message);
      window.alert(`Update failed: ${message}`);
    } finally {
      setUpdatingTicket(false);
    }
  };

  const handleInlineStatusUpdate = async (ticketId, status) => {
    try {
      setInlineStatusUpdateId(ticketId);
      const response = await axiosInstance.patch(`/api/tickets/${ticketId}`, null, {
        params: { status }
      });
      setTickets((prev) => prev.map((ticket) => (ticket.id === ticketId ? response.data : ticket)));
      if (selectedTicket?.id === ticketId) {
        syncUpdatedTicket(response.data);
      }
      window.alert('Ticket status updated successfully!');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update ticket status';
      window.alert(`Update failed: ${message}`);
    } finally {
      setInlineStatusUpdateId(null);
    }
  };

  const handleAddComment = async () => {
    if (!selectedTicket || !commentInput.trim()) return;

    try {
      setCommentLoading(true);
      setModalError('');
      const response = await axiosInstance.post(`/api/tickets/${selectedTicket.id}/comments`, null, {
        params: { content: commentInput }
      });
      setCommentInput('');
      syncUpdatedTicket(response.data);
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleUpdateComment = async () => {
    if (!selectedTicket || !editingCommentId || !editingCommentInput.trim()) return;

    try {
      setCommentLoading(true);
      setModalError('');
      const response = await axiosInstance.put(
        `/api/tickets/${selectedTicket.id}/comments/${editingCommentId}`,
        null,
        { params: { content: editingCommentInput } }
      );
      setEditingCommentId(null);
      setEditingCommentInput('');
      syncUpdatedTicket(response.data);
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to update comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!selectedTicket) return;

    try {
      setCommentLoading(true);
      setModalError('');
      const response = await axiosInstance.delete(`/api/tickets/${selectedTicket.id}/comments/${commentId}`);
      syncUpdatedTicket(response.data);
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to delete comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const visibleTickets = tickets.filter((ticket) => {
    const normalizedPriority = (ticket.priority || '').toUpperCase();
    const normalizedStatus = (ticket.status || 'OPEN').toUpperCase();
    const haystack = [
      ticket.id,
      ticket.category,
      ticket.resourceId,
      ticket.description,
      ticket.userId,
      ticket.assignedTo,
      ticket.priority,
      normalizedStatus
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const keywordOk = !searchKeyword.trim() || haystack.includes(searchKeyword.trim().toLowerCase());
    const priorityOk = priorityFilter === 'ALL' || normalizedPriority === priorityFilter;

    return keywordOk && priorityOk;
  });

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 py-8 md:px-8"
      style={{ backgroundImage: getTicketPageBackground(isSubmittedTicketsPage, isMyTicketsPage) }}
    >
      <style>{modalScrollbarStyles}</style>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 w-full rounded-2xl border border-white/45 bg-white/18 px-6 py-5 shadow-lg backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            {isSubmittedTicketsPage ? 'Submitted Tickets' : isAssignedTicketsPage ? 'Assigned Tickets' : 'My Incident Tickets'}
          </h1>
          <p className="mt-2 text-sm text-slate-100/90">
            {isSubmittedTicketsPage
              ? 'A technician (or staff member) can be assigned to a ticket and can update status and add resolution notes.'
              : isAssignedTicketsPage
                ? 'Technicians can see tickets assigned to them and update progress.'
              : 'View all submitted tickets and click any card to see full details.'}
          </p>
        </div>

        {isSubmittedTicketsPage && (
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-between">
            <div className="w-full rounded-2xl border border-white/45 bg-white/15 p-4 backdrop-blur-xl lg:max-w-xl">
              <input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search by ticket ID, category, item code, status, or assigned staff..."
                className="w-full rounded-xl border border-white/50 bg-white/85 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
              />
            </div>

            <div className="w-full rounded-2xl border border-white/45 bg-white/15 p-4 backdrop-blur-xl lg:w-auto">
              <div className="flex flex-wrap gap-2">
              {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map((priority) => {
                const active = priorityFilter === priority;
                const count = priority === 'ALL' ? tickets.length : prioritySummary[priority] || 0;
                const priorityClass = getPriorityFilterClass(priority, active);
                return (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setPriorityFilter(priority)}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${priorityClass}`}
                  >
                    {priority} ({count})
                  </button>
                );
              })}
              </div>
            </div>
          </div>
        )}

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

        {!loading && !error && visibleTickets.length === 0 && (
          <div className="rounded-2xl border border-white/70 bg-white/50 p-8 text-center text-slate-600 shadow-md backdrop-blur-lg">
            No tickets found yet.
          </div>
        )}

        {!loading && !error && visibleTickets.length > 0 && (
          <div className="grid gap-4">
            {visibleTickets.map((ticket, index) => {
              const categoryParts = extractCategoryParts(ticket.category);
              const ticketStatus = (ticket.status || 'OPEN').toUpperCase();
              return (
              <button
                key={ticket.id}
                type="button"
                onClick={() => openTicketModal(ticket)}
                className="w-full rounded-2xl border border-white/70 bg-white/45 p-5 text-left shadow-md backdrop-blur-lg transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-800">
                      {getDisplayTicketIdByRecord(tickets, ticket.id)}
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      <span className="font-semibold">Category:</span> {categoryParts.main}
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      <span className="font-semibold">Sub Category:</span> {categoryParts.sub}
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      <span className="font-semibold">Item Code:</span> {ticket.resourceId || 'N/A'}
                    </p>
                  </div>

                  <div className="md:self-center md:text-right">
                    <select
                      value={ticketStatus}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onChange={(e) => handleInlineStatusUpdate(ticket.id, e.target.value)}
                      disabled={inlineStatusUpdateId === ticket.id}
                      className={`inline-flex min-w-[140px] justify-center rounded-full border px-4 py-2 text-sm font-bold tracking-wide outline-none ${getStatusPillClass(ticketStatus)}`}
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="CLOSED">CLOSED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                    <p className="mt-2 text-xs text-slate-500">Created: {formatDateTime(ticket.createdAt)}</p>
                  </div>
                </div>
              </button>
              );
            })}
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
            className="ticket-modal-scroll max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/60 bg-white/70 p-6 shadow-2xl backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Ticket Details</h2>
                <p className="text-sm text-slate-600">{getDisplayTicketIdByRecord(tickets, selectedTicket.id)}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600"
                aria-label="Close ticket details"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M6 6L18 18" />
                  <path d="M18 6L6 18" />
                </svg>
              </button>
            </div>

            {modalError && (
              <div className="mb-4 rounded-xl border border-red-300/70 bg-red-100/70 p-3 text-sm text-red-700">
                {modalError}
              </div>
            )}

            {(() => {
              const categoryParts = extractCategoryParts(selectedTicket.category);
              return (
            <div className="grid gap-3 rounded-2xl border border-white/70 bg-white/40 p-4 text-sm text-slate-700 md:grid-cols-2">
              <p><span className="font-semibold">Category:</span> {categoryParts.main}</p>
              <p><span className="font-semibold">Sub Category:</span> {categoryParts.sub}</p>
              <p><span className="font-semibold">Item Code:</span> {selectedTicket.resourceId || 'N/A'}</p>
              <p>
                <span className="font-semibold">Priority:</span>{' '}
                <span className={`font-semibold ${getPriorityTextClass(selectedTicket.priority)}`}>{selectedTicket.priority || 'N/A'}</span>
              </p>
              <p><span className="font-semibold">Status:</span> {selectedTicket.status || 'N/A'}</p>
              <p><span className="font-semibold">Assigned To:</span> {selectedTicket.assignedTo || 'Not assigned'}</p>
              <p><span className="font-semibold">Created At:</span> {formatDateTime(selectedTicket.createdAt)}</p>
              <p><span className="font-semibold">Updated At:</span> {formatDateTime(selectedTicket.updatedAt)}</p>
              <p><span className="font-semibold">User:</span> {selectedTicket.userId || 'N/A'}</p>
            </div>
              );
            })()}

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

            {isAssignedTicketsPage && selectedTicket.assignedTo && (
              <div className="mt-4 rounded-2xl border border-sky-200/70 bg-sky-50/80 p-4">
                <h3 className="text-sm font-semibold text-slate-700">Assigned Technician Profile</h3>
                {(() => {
                  const assignedProfile = formatAssignedProfile(selectedTicket.assignedTo);
                  const profileInitial = (assignedProfile.name || assignedProfile.email || 'T').charAt(0).toUpperCase();
                  return (
                    <div className="mt-3 flex items-center gap-3 rounded-2xl border border-sky-200/70 bg-white/80 px-3 py-2">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                        {profileInitial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">{assignedProfile.name}</p>
                        <p className="truncate text-xs text-slate-600">{assignedProfile.email || assignedProfile.raw}</p>
                      </div>
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                        Technician
                      </span>
                    </div>
                  );
                })()}
              </div>
            )}

            {isStaff && !isMyTicketsPage && !isAssignedTicketsPage && (
              <div className="mt-4 rounded-2xl border border-white/70 bg-white/40 p-4">
                <h3 className="text-sm font-semibold text-slate-700">Technician / Staff Update</h3>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                  {technicianOptions.length > 0 ? (
                    <select
                      value={assignedToInput}
                      onChange={(e) => setAssignedToInput(e.target.value)}
                      disabled={techniciansLoading}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                    >
                      <option value="">Unassigned</option>
                      {assignedToInput && !technicianOptions.some((option) => option.value === assignedToInput) && (
                        <option value={assignedToInput}>{assignedToInput}</option>
                      )}
                      {technicianOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={assignedToInput}
                      onChange={(e) => setAssignedToInput(e.target.value)}
                      placeholder={techniciansLoading ? 'Loading technicians...' : 'Assign to technician/staff'}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                    />
                  )}
                </div>
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Add resolution notes"
                  rows={3}
                  className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                />
                <button
                  type="button"
                  onClick={handleUpdateTicket}
                  disabled={updatingTicket}
                  className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {updatingTicket ? 'Updating...' : 'Update Ticket'}
                </button>
              </div>
            )}

            {!isSubmittedTicketsPage && (
              <div className="mt-4 rounded-2xl border border-white/70 bg-white/40 p-4">
                <h3 className="text-sm font-semibold text-slate-700">Comments</h3>

                <div className="mt-3 flex gap-2">
                  <input
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Add a comment"
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  />
                  <button
                    type="button"
                    onClick={handleAddComment}
                    disabled={commentLoading || !commentInput.trim()}
                    className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:opacity-60"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {selectedTicket.comments?.length ? (
                    [...selectedTicket.comments].reverse().map((comment) => {
                      const canManageComment = !!currentUserId && comment.userId === currentUserId;

                      return (
                        <div key={comment.id} className="rounded-xl border border-slate-200 bg-white/80 p-3">
                        <p className="text-xs font-semibold text-slate-500">{comment.userName || comment.userId || 'User'}</p>

                        {editingCommentId === comment.id ? (
                          <>
                            <textarea
                              value={editingCommentInput}
                              onChange={(e) => setEditingCommentInput(e.target.value)}
                              rows={2}
                              className="mt-2 w-full rounded-lg border border-slate-200 px-2 py-1 text-sm text-slate-700"
                            />
                            <div className="mt-2 flex gap-2">
                              <button
                                type="button"
                                onClick={handleUpdateComment}
                                disabled={commentLoading || !editingCommentInput.trim()}
                                className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white disabled:opacity-60"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditingCommentInput('');
                                }}
                                className="rounded-lg bg-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <p className="mt-1 text-sm text-slate-700">{comment.content}</p>
                        )}

                        <p className="mt-1 text-[11px] text-slate-500">{formatDateTime(comment.updatedAt || comment.createdAt)}</p>

                        {canManageComment && editingCommentId !== comment.id && (
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCommentId(comment.id);
                                setEditingCommentInput(comment.content || '');
                              }}
                              className="rounded-lg bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="rounded-lg bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-slate-600">No comments yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketList;