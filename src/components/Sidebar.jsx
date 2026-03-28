// Sidebar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { removeToken, getRole } from '../utils/auth';

function Sidebar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = getRole();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { label: 'Profile', icon: '👤', path: '/dashboard', roles: ['USER', 'ADMIN', 'TECHNICIAN'] },
    { label: 'Users', icon: '👥', path: '/admin', roles: ['ADMIN'] },
    { label: 'Control panel', icon: '⚙️', path: '/admin', roles: ['ADMIN'] },
    { label: 'Projects', icon: '📁', path: '#', roles: ['ADMIN', 'TECHNICIAN'] },
    { label: 'Tasks', icon: '✓', path: '#', roles: ['ADMIN', 'TECHNICIAN'] },
    { label: 'Logs', icon: '📋', path: '#', roles: ['ADMIN'] },
    { label: 'Group chats', icon: '💬', path: '#', roles: ['USER', 'ADMIN', 'TECHNICIAN'] },
    { label: 'Reports', icon: '📊', path: '#', roles: ['ADMIN'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-64 bg-gradient-to-b from-[#0A1931] to-[#1A3D63] min-h-screen shadow-xl fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#4A7FA7]">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          🏫 Smart Campus
        </h1>
        <p className="text-[#B3CFE5] text-sm mt-2">Admin Dashboard</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-6 space-y-2">
        {filteredItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={(e) => item.path === '#' && e.preventDefault()}
            className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium flex items-center gap-3 ${
              isActive(item.path)
                ? 'bg-[#F6FAFD] text-[#0A1931] shadow-lg'
                : 'text-[#B3CFE5] hover:bg-[#4A7FA7] hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-[#4A7FA7] p-6 space-y-4">
        {user && (
          <div className="text-[#B3CFE5] text-sm">
            <p className="truncate font-semibold text-white">{user.name}</p>
            <p className="truncate text-xs text-[#B3CFE5]">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;