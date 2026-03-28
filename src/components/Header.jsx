// Header.jsx
import React from 'react';

function Header({ title, subtitle }) {
  return (
    <div className="bg-white border-b border-[#B3CFE5] shadow-sm">
      <div className="ml-64 px-8 py-6">
        <h2 className="text-3xl font-bold text-[#0A1931]">{title}</h2>
        {subtitle && <p className="text-[#1A3D63] mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

export default Header;