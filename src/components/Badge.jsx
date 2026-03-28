// Badge.jsx
import React from 'react';

function Badge({ status, text }) {
  const getStyles = (status) => {
    switch(status) {
      case 'active':
      case 'Active':
        return 'bg-emerald-100 text-emerald-800';
      case 'inactive':
      case 'Inactive':
        return 'bg-rose-100 text-rose-800';
      case 'pending':
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      case 'ADMIN':
        return 'bg-[#4A7FA7] text-white';
      case 'TECHNICIAN':
        return 'bg-[#B3CFE5] text-[#0A1931]';
      case 'USER':
        return 'bg-[#1A3D63] text-[#F6FAFD]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStyles(status)}`}>
      {text || status}
    </span>
  );
}

export default Badge;