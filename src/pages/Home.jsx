// Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1931] via-[#1A3D63] to-[#0A1931] text-white flex flex-col">

      <header className="bg-white/5 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏫</div>
            <h1 className="text-2xl font-bold">Smart Campus</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors duration-200 border border-white/20"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-6xl md:text-7xl font-black mb-6">
            Smart Campus
          </h1>
          <p className="text-2xl md:text-3xl text-[#B3CFE5] mb-4 font-light">
            Manage your campus efficiently and intelligently
          </p>
          <p className="text-lg text-[#B3CFE5] max-w-2xl mx-auto mb-12 leading-relaxed">
            A comprehensive solution for campus management with intuitive dashboards,
            user management tools, and administrative controls. Built with modern technology for optimal performance.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-4 bg-white text-[#0A1931] hover:bg-[#B3CFE5] rounded-lg font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started — Login with Google
            </button>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-16">
              Powerful Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              <div className="bg-white/10 backdrop-blur rounded-xl p-8 border border-white/20 hover:border-[#4A7FA7] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-br from-[#4A7FA7] to-[#B3CFE5] rounded-lg flex items-center justify-center mb-4 text-2xl">
                  📊
                </div>
                <h3 className="text-2xl font-bold mb-3">Dashboard</h3>
                <p className="text-[#B3CFE5] leading-relaxed">
                  Track campus activities and metrics in real-time with beautiful visualizations and detailed reports
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-8 border border-white/20 hover:border-[#4A7FA7] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-br from-[#4A7FA7] to-[#B3CFE5] rounded-lg flex items-center justify-center mb-4 text-2xl">
                  👥
                </div>
                <h3 className="text-2xl font-bold mb-3">Admin Panel</h3>
                <p className="text-[#B3CFE5] leading-relaxed">
                  Manage users, resources, and system settings with advanced role-based access control
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-8 border border-white/20 hover:border-[#4A7FA7] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-br from-[#4A7FA7] to-[#B3CFE5] rounded-lg flex items-center justify-center mb-4 text-2xl">
                  🔐
                </div>
                <h3 className="text-2xl font-bold mb-3">Secure Access</h3>
                <p className="text-[#B3CFE5] leading-relaxed">
                  OAuth 2.0 authentication and JWT tokens for enterprise-grade security
                </p>
              </div>

            </div>
          </div>
        </div>

        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#4A7FA7]/20 to-[#1A3D63]/20 border border-[#4A7FA7]/30 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Why Choose Smart Campus?</h3>
              <ul className="space-y-3 text-[#B3CFE5]">
                <li className="flex items-center gap-3">
                  <span className="text-[#4A7FA7] text-xl">✓</span>
                  Role-based access control (User, Technician, Admin)
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#4A7FA7] text-xl">✓</span>
                  Real-time data synchronization
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#4A7FA7] text-xl">✓</span>
                  Mobile-responsive design
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#4A7FA7] text-xl">✓</span>
                  Advanced security with OAuth 2.0 and JWT
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">10K+</div>
                <p className="text-[#B3CFE5]">Active Users</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">99.9%</div>
                <p className="text-[#B3CFE5]">Uptime</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <p className="text-[#B3CFE5]">Support</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">150+</div>
                <p className="text-[#B3CFE5]">Campuses</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 bg-white/5 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[#B3CFE5]">
          <p>&copy; 2026 Smart Campus. All rights reserved.</p>
          <p className="mt-2 text-sm">Built with React, Spring Boot, and Tailwind CSS</p>
        </div>
      </footer>

    </div>
  );
}

export default Home;