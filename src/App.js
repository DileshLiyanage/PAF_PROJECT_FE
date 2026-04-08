import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home          from './pages/Home';
import Login         from './pages/Login';
import Register      from './pages/Register';
import OAuthCallback from './pages/OAuthCallback';
import Dashboard     from './pages/Dashboard';
import AdminPanel    from './pages/AdminPanel';
import Profile       from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import ResourceCatalogue from './pages/ResourceCatalogue';
import ResourceDetail    from './pages/ResourceDetail';
import AdminResources    from './pages/admin/ResourceDashboard';
import AddResource       from './pages/admin/AddResource';
import EditResource      from './pages/admin/EditResource';

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
          <Route path="/resources" element={
            <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']}>
              <ResourceCatalogue />
            </ProtectedRoute>
          } />

          <Route path="/resources/:id" element={
            <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']}>
              <ResourceDetail />
            </ProtectedRoute>
          } />

          <Route path="/admin/resources" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminResources />
            </ProtectedRoute>
          } />

          <Route path="/admin/resources/new" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AddResource />
            </ProtectedRoute>
          } />

          <Route path="/admin/resources/:id/edit" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <EditResource />
            </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;