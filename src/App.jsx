import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';

// Will create these next
import BookingFormPage from './pages/BookingFormPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import BookingDetailPage from './pages/BookingDetailPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CalendarViewPage from './pages/CalendarViewPage';

const ProtectedRoute = ({ children, requireAdmin }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/" />;
    if (requireAdmin && user.role !== 'ADMIN') return <Navigate to="/bookings/my" />;
    return children;
};

const AppRoutes = () => {
    const { user } = useAuth();
    
    return (
        <>
            <Navigation />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={
                        user?.role === 'ADMIN' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/bookings/my" />
                    } />
                    
                    {/* User Routes */}
                    <Route path="/bookings/new" element={<ProtectedRoute><BookingFormPage /></ProtectedRoute>} />
                    <Route path="/bookings/my" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
                    <Route path="/bookings/:id" element={<ProtectedRoute><BookingDetailPage /></ProtectedRoute>} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminDashboardPage /></ProtectedRoute>} />
                    <Route path="/admin/bookings" element={<ProtectedRoute requireAdmin><AdminBookingsPage /></ProtectedRoute>} />
                    <Route path="/admin/calendar" element={<ProtectedRoute requireAdmin><CalendarViewPage /></ProtectedRoute>} />
                </Routes>
            </main>
        </>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}
