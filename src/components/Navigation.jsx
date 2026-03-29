import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, UserCircle, LayoutDashboard, List, PlusCircle, CalendarDays, LogOut } from 'lucide-react';
import './Navigation.css'; // Let's inline navigation css here since it's modular

export default function Navigation() {
    const { user, toggleRole } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="glass-navbar">
            <div className="nav-brand" onClick={() => navigate('/')}>
                <Calendar className="brand-icon" />
                <span className="gradient-text">SmartCampus Hub</span>
            </div>

            <div className="nav-links">
                {user?.role === 'ADMIN' ? (
                    <>
                        <NavLink to="/admin/dashboard" className="nav-item">
                            <LayoutDashboard size={18} /> Dashboard
                        </NavLink>
                        <NavLink to="/admin/bookings" className="nav-item">
                            <List size={18} /> All Bookings
                        </NavLink>
                        <NavLink to="/admin/calendar" className="nav-item">
                            <CalendarDays size={18} /> Master Calendar
                        </NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/bookings/my" className="nav-item">
                            <List size={18} /> My Bookings
                        </NavLink>
                        <NavLink to="/bookings/new" className="nav-item">
                            <PlusCircle size={18} /> New Booking
                        </NavLink>
                    </>
                )}
            </div>

            <div className="nav-profile">
                <div className="user-info">
                    <UserCircle size={24} />
                    <div className="user-details">
                        <span className="user-name">{user?.name}</span>
                        <span className="user-role badge badge-approved">{user?.role}</span>
                    </div>
                </div>
                
                {/* Visual debug toggle for the assignment */}
                <button onClick={toggleRole} className="btn btn-secondary btn-sm" title="Toggle User Role">
                    Switch to {user?.role === 'ADMIN' ? 'USER' : 'ADMIN'}
                </button>
            </div>
        </nav>
    );
}
