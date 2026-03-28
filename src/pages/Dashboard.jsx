// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Badge from '../components/Badge';
import axiosInstance from '../api/axiosInstance';
import { getRole } from '../utils/auth';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userRole = getRole();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/auth/me');
      setUser(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load user data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F6FAFD]">
        <Sidebar user={user} />
        <div className="flex-1 ml-64">
          <Header title="Dashboard" />
          <div className="p-8 text-center text-[#1A3D63]">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F6FAFD]">
      <Sidebar user={user} />
      <div className="flex-1 ml-64 flex flex-col">
        <Header title="Dashboard" subtitle="Welcome back to Smart Campus" />
        <div className="flex-1 p-8">
          {error && (
            <div className="mb-6 p-4 bg-rose-100 border border-rose-400 rounded-lg text-rose-800">
              {error}
            </div>
          )}

          {user && (
            <div className="mb-8 bg-gradient-to-r from-[#B3CFE5] to-[#F6FAFD] rounded-lg shadow-md p-8 border-l-4 border-[#4A7FA7]">
              <div className="flex items-center gap-6">
                {user.picture && (
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-[#4A7FA7] shadow-md object-cover"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-[#0A1931] mb-2">Welcome, {user.name}!</h2>
                  <p className="text-[#1A3D63] mb-3">📧 {user.email}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1A3D63]">👤 Role:</span>
                    <Badge status={user.role} text={user.role} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-[#4A7FA7]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#1A3D63] text-sm font-medium">Campus Events</p>
                  <p className="text-3xl font-bold text-[#0A1931]">24</p>
                </div>
                <div className="text-4xl">📅</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-emerald-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#1A3D63] text-sm font-medium">My Tasks</p>
                  <p className="text-3xl font-bold text-[#0A1931]">8</p>
                </div>
                <div className="text-4xl">✓</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-amber-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#1A3D63] text-sm font-medium">Messages</p>
                  <p className="text-3xl font-bold text-[#0A1931]">3</p>
                </div>
                <div className="text-4xl">💬</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-rose-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#1A3D63] text-sm font-medium">Announcements</p>
                  <p className="text-3xl font-bold text-[#0A1931]">5</p>
                </div>
                <div className="text-4xl">📢</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-[#0A1931] mb-4">📅 Upcoming Events</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-[#B3CFE5] rounded-lg hover:bg-[#F6FAFD] transition-colors">
                    <div>
                      <p className="font-semibold text-[#0A1931]">Orientation Week</p>
                      <p className="text-sm text-[#1A3D63]">March 30 - April 5, 2026</p>
                    </div>
                    <Badge status="pending" text="Upcoming" />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-[#B3CFE5] rounded-lg hover:bg-[#F6FAFD] transition-colors">
                    <div>
                      <p className="font-semibold text-[#0A1931]">Campus Sports Day</p>
                      <p className="text-sm text-[#1A3D63]">April 15, 2026</p>
                    </div>
                    <Badge status="pending" text="Upcoming" />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-[#B3CFE5] rounded-lg hover:bg-[#F6FAFD] transition-colors">
                    <div>
                      <p className="font-semibold text-[#0A1931]">Cultural Festival</p>
                      <p className="text-sm text-[#1A3D63]">May 1 - 3, 2026</p>
                    </div>
                    <Badge status="pending" text="Upcoming" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-[#0A1931] mb-4">📝 Recent Activity</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3 pb-3 border-b border-[#B3CFE5]">
                    <div className="text-2xl">✔️</div>
                    <div>
                      <p className="font-medium text-[#0A1931]">Completed Task: Physics Assignment</p>
                      <p className="text-[#1A3D63]">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pb-3 border-b border-[#B3CFE5]">
                    <div className="text-2xl">📌</div>
                    <div>
                      <p className="font-medium text-[#0A1931]">Registered for Workshop</p>
                      <p className="text-[#1A3D63]">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">💬</div>
                    <div>
                      <p className="font-medium text-[#0A1931]">Received Group Announcement</p>
                      <p className="text-[#1A3D63]">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-[#0A1931] mb-4">⚡ Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-[#4A7FA7] hover:bg-[#1A3D63] text-white font-semibold rounded-lg transition-colors duration-200">
                    📚 Browse Courses
                  </button>
                  <button className="w-full px-4 py-2 bg-[#4A7FA7] hover:bg-[#1A3D63] text-white font-semibold rounded-lg transition-colors duration-200">
                    🗓️ Book Lab
                  </button>
                  <button className="w-full px-4 py-2 bg-[#4A7FA7] hover:bg-[#1A3D63] text-white font-semibold rounded-lg transition-colors duration-200">
                    🎓 View Grades
                  </button>
                  <button className="w-full px-4 py-2 bg-[#4A7FA7] hover:bg-[#1A3D63] text-white font-semibold rounded-lg transition-colors duration-200">
                    💡 Submit Feedback
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-[#0A1931] mb-4">ℹ️ Campus Info</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-[#1A3D63]">📍 Location</p>
                    <p className="font-medium text-[#0A1931]">Building A, Floor 3</p>
                  </div>
                  <div>
                    <p className="text-[#1A3D63]">📞 Support</p>
                    <p className="font-medium text-[#0A1931]">+1 234 567 8900</p>
                  </div>
                  <div>
                    <p className="text-[#1A3D63]">📧 Email</p>
                    <p className="font-medium text-[#0A1931] truncate">support@smartcampus.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {userRole === 'ADMIN' && (
            <div className="mt-8 bg-gradient-to-r from-[#B3CFE5] to-[#F6FAFD] rounded-lg shadow p-6 border-l-4 border-[#4A7FA7]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#0A1931] mb-2">🔒 Admin Panel</h3>
                  <p className="text-[#1A3D63]">Manage users, roles, and campus settings</p>
                </div>
                <a
                  href="/admin"
                  className="px-6 py-3 bg-[#4A7FA7] hover:bg-[#1A3D63] text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  Go to Admin Panel →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;