// AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Badge from '../components/Badge';
import axiosInstance from '../api/axiosInstance';
import { removeToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [filterRole, setFilterRole] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/me');
      setUserData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axiosInstance.get('/api/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setSuccessMessage('');
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) {
      setError('Please select a user and role');
      return;
    }

    try {
      setUpdating(true);
      setError('');
      await axiosInstance.patch(`/api/admin/users/${selectedUser.id}/role`, null, {
        params: { role: newRole }
      });
      setSuccessMessage(`User role updated to ${newRole}`);
      setSelectedUser({ ...selectedUser, role: newRole });
      fetchUsers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update role: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axiosInstance.delete(`/api/admin/users/${userId}`);
      setSuccessMessage('User deleted successfully');
      setSelectedUser(null);
      fetchUsers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete user: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const handleFilter = () => {
    if (filterRole === 'ALL') {
      return users;
    }
    return users.filter(user => user.role === filterRole);
  };

  const filteredUsers = handleFilter();

  return (
    <div className="flex min-h-screen bg-[#F6FAFD]">
      <Sidebar user={userData} />
      <div className="flex-1 ml-64 flex flex-col">
        <Header title="Members" subtitle="Total members: 2000 | Current used: 1800" />
        <div className="flex-1 p-8">
          {error && (
            <div className="mb-6 p-4 bg-rose-100 border border-rose-400 rounded-lg text-rose-800">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-100 border border-emerald-400 rounded-lg text-emerald-800">
              {successMessage}
            </div>
          )}

          <div className="mb-6 flex justify-between items-center">
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-[#4A7FA7] hover:bg-[#1A3D63] text-white font-semibold rounded-lg transition-colors duration-200"
              >
                + Add new
              </button>
              <button className="px-4 py-2 bg-[#B3CFE5] hover:bg-[#4A7FA7] hover:text-white text-[#0A1931] font-semibold rounded-lg transition-colors duration-200">
                📥 Import members
              </button>
              <button className="px-4 py-2 bg-[#B3CFE5] hover:bg-[#4A7FA7] hover:text-white text-[#0A1931] font-semibold rounded-lg transition-colors duration-200">
                📤 Export members (Excel)
              </button>
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 bg-[#4A7FA7] hover:bg-[#1A3D63] text-white font-semibold rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <option value="ALL">🔍 All Members</option>
              <option value="USER">👤 Users</option>
              <option value="TECHNICIAN">🔧 Technicians</option>
              <option value="ADMIN">🔐 Admins</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12 text-[#1A3D63]">
              <div className="inline-block animate-spin">⏳</div> Loading users...
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#B3CFE5] border-b border-[#4A7FA7]">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#0A1931]">Photo</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#0A1931]">Member name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#0A1931]">Mobile</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#0A1931]">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#0A1931]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#B3CFE5]">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-[#1A3D63]">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr 
                        key={user.id} 
                        className="hover:bg-[#F6FAFD] transition-colors duration-200 cursor-pointer"
                        onClick={() => handleSelectUser(user)}
                      >
                        <td className="px-6 py-4">
                          {user.picture ? (
                            <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#B3CFE5] flex items-center justify-center text-sm font-bold text-[#0A1931]">
                              {user.name.charAt(0)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium text-[#0A1931]">{user.name}</td>
                        <td className="px-6 py-4 text-[#1A3D63]">{user.phone || '—'}</td>
                        <td className="px-6 py-4 text-[#1A3D63]">{user.email}</td>
                        <td className="px-6 py-4">
                          <Badge status={user.role} text={user.role} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {selectedUser && (
            <div className="mt-8 bg-white rounded-lg shadow-md p-8 border-l-4 border-[#4A7FA7]">
              <h2 className="text-2xl font-bold text-[#0A1931] mb-6">Update User Role</h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1A3D63] mb-2">Name:</label>
                  <p className="text-[#0A1931] bg-[#F6FAFD] p-3 rounded-lg">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1A3D63] mb-2">Email:</label>
                  <p className="text-[#0A1931] bg-[#F6FAFD] p-3 rounded-lg">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1A3D63] mb-2">Current Role:</label>
                  <Badge status={selectedUser.role} text={selectedUser.role} />
                </div>
                <div>
                  <label htmlFor="role-select" className="block text-sm font-semibold text-[#1A3D63] mb-2">
                    Assign New Role:
                  </label>
                  <div className="relative">
                    <select
                      id="role-select"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      disabled={updating}
                      className="w-full px-4 py-2 border border-[#B3CFE5] text-[#0A1931] rounded-lg focus:outline-none focus:border-[#4A7FA7] focus:ring-2 focus:ring-[#4A7FA7]/20 disabled:opacity-60 disabled:cursor-not-allowed appearance-none"
                    >
                      <option value="USER">👤 User</option>
                      <option value="TECHNICIAN">🔧 Technician</option>
                      <option value="ADMIN">🔐 Admin</option>
                    </select>
                    {updating && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin">
                        ⏳
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdateRole}
                  disabled={updating || newRole === selectedUser.role}
                  className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Updating...
                    </>
                  ) : (
                    '✓ Update Role'
                  )}
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 px-4 py-3 bg-[#B3CFE5] hover:bg-[#4A7FA7] text-[#0A1931] hover:text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Add New Member Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold text-[#0A1931] mb-6">Add New Member</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#1A3D63] mb-2">Email:</label>
                    <input type="email" placeholder="member@example.com" className="w-full px-4 py-2 border border-[#B3CFE5] rounded-lg focus:outline-none focus:border-[#4A7FA7]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A3D63] mb-2">Full Name:</label>
                    <input type="text" placeholder="John Doe" className="w-full px-4 py-2 border border-[#B3CFE5] rounded-lg focus:outline-none focus:border-[#4A7FA7]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A3D63] mb-2">Role:</label>
                    <select className="w-full px-4 py-2 border border-[#B3CFE5] rounded-lg focus:outline-none focus:border-[#4A7FA7]">
                      <option value="USER">👤 User</option>
                      <option value="TECHNICIAN">🔧 Technician</option>
                      <option value="ADMIN">🔐 Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    Add Member
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-[#B3CFE5] hover:bg-[#4A7FA7] text-[#0A1931] hover:text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;