import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home          from './pages/Home';
import Login         from './pages/Login';
import Register      from './pages/Register';
import OAuthCallback from './pages/OAuthCallback';
import Dashboard     from './pages/Dashboard';
import AdminPanel    from './pages/AdminPanel';
import Profile       from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

// ==================== MEMBER 3 - MODULE C TICKETS ====================
import TicketCreate from './pages/tickets/TicketCreate';
import TicketList   from './pages/tickets/TicketList';
import TicketDetail from './pages/tickets/TicketDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                 element={<Home />} />
        <Route path="/login"            element={<Login />} />
        <Route path="/register"         element={<Register />} />
        <Route path="/oauth2/callback"  element={<OAuthCallback />} />
        <Route path="/unauthorized"     element={
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>Access Denied</h1>
            <p>You don't have permission to access this page.</p>
            <button onClick={() => window.location.href = '/'}>Go Home</button>
          </div>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']}>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']}>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminPanel />
          </ProtectedRoute>
        } />

{/* ==================== MODULE C - INCIDENT TICKETS (Member 3) ==================== */}
        <Route path="/tickets" element={
          <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']}>
            <TicketList />
          </ProtectedRoute>
        } />

        <Route path="/tickets/create" element={
          <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']}>
            <TicketCreate />
          </ProtectedRoute>
        } />

        <Route path="/tickets/:id" element={
          <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']}>
            <TicketDetail />
          </ProtectedRoute>
        } />
        {/* ================================================================== */}

          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;