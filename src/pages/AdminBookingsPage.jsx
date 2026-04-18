import React, { useEffect, useState } from 'react';
import { bookingService, resourceService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import './Table.css';

export default function AdminBookingsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [statusFilter, setStatusFilter] = useState('');
    const [resourceFilter, setResourceFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { searchQuery } = useSearch();

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const params = {};
            if (statusFilter) params.status = statusFilter;
            if (resourceFilter) params.resourceId = resourceFilter;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            
            const res = await bookingService.getAllBookings(params);
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        resourceService.getResources().then(res => setResources(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [statusFilter, resourceFilter, startDate, endDate, user?.role]);

    const handleApprove = async (id) => {
        if (!window.confirm('Approve this booking?')) return;
        try {
            await bookingService.updateStatus(id, 'APPROVED');
            fetchBookings();
        } catch (err) {
            alert('Failed to approve booking.');
        }
    };

    const handleReject = async (id) => {
        const reason = window.prompt("Please provide a reason for rejection:");
        if (reason === null) return; // User cancelled
        if (!reason.trim()) return alert("Rejection reason is required.");
        
        try {
            await bookingService.updateStatus(id, 'REJECTED', reason);
            fetchBookings();
        } catch (err) {
            alert('Failed to reject booking.');
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Manage Bookings</h1>
            
            <div className="glass-panel filter-bar">
                <div className="filter-group">
                    <label>Status</label>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-input">
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="NO_SHOW">No Show</option>
                    </select>
                </div>
                
                <div className="filter-group">
                    <label>Resource</label>
                    <select value={resourceFilter} onChange={e => setResourceFilter(e.target.value)} className="form-input">
                        <option value="">All Resources</option>
                        {resources.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                </div>
                
                <div className="filter-group">
                    <label>From Date</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="form-input"/>
                </div>
                
                <div className="filter-group">
                    <label>To Date</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="form-input"/>
                </div>
            </div>

            <div className="glass-panel table-container">
                {loading ? (
                    <div className="loader">Loading Bookings...</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Resource</th>
                                <th>Date & Time</th>
                                <th>Purpose</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                const filteredBookings = bookings.filter(b => {
                                    const q = searchQuery.toLowerCase();
                                    return !q || 
                                        (b.purpose && b.purpose.toLowerCase().includes(q)) || 
                                        (b.userName && b.userName.toLowerCase().includes(q)) ||
                                        (b.userEmail && b.userEmail.toLowerCase().includes(q)) ||
                                        (b.resourceId && b.resourceId.toLowerCase().includes(q));
                                });
                                return (
                                    <>
                                        {filteredBookings.map(booking => (
                                <tr key={booking.id}>
                                    <td>
                                        <div className="user-cell">
                                            <strong>{booking.userName}</strong>
                                            <span className="text-muted">{booking.userEmail}</span>
                                        </div>
                                    </td>
                                    <td>{booking.resourceId}</td>
                                    <td>
                                        <div className="time-cell">
                                            <span>{booking.date}</span>
                                            <span className="text-muted">{booking.startTime} - {booking.endTime}</span>
                                        </div>
                                    </td>
                                    <td className="purpose-cell" title={booking.purpose}>{booking.purpose}</td>
                                    <td>
                                        <span className={`badge badge-${booking.status.toLowerCase()}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="btn btn-secondary btn-icon"
                                                onClick={() => navigate(`/bookings/${booking.id}`)}
                                                title="View Details"
                                            >
                                                <Eye size={16}/>
                                            </button>
                                            
                                            {booking.status === 'PENDING' && (
                                                <>
                                                    <button 
                                                        className="btn btn-primary btn-icon"
                                                        onClick={() => handleApprove(booking.id)}
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button 
                                                        className="btn btn-danger btn-icon"
                                                        onClick={() => handleReject(booking.id)}
                                                        title="Reject"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                
                                {filteredBookings.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">No bookings found.</td>
                                    </tr>
                                )}
                                    </>
                                );
                            })()}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
