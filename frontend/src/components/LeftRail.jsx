import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Item = ({ to, label, icon }) => {
  const location = useLocation();
  const active = location.pathname.startsWith(to);
  return (
    <Link
      to={to}
      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
        active ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'
      }`}
      title={label}
    >
      {icon}
    </Link>
  );
};

export default function LeftRail() {
  return (
    <div className="w-16 shrink-0 h-screen sticky top-0 bg-white border-r border-gray-200 p-3 flex flex-col items-center gap-2">
      <Item to="/dashboard" label="Dashboard" icon={<span className="text-sm">🏠</span>} />
      <Item to="/socials" label="Mạng xã hội" icon={<span className="text-sm">🌐</span>} />
      <Item to="/analytics" label="Phân tích" icon={<span className="text-sm">📈</span>} />
      <Item to="/profile" label="Hồ sơ" icon={<span className="text-sm">👤</span>} />
      <div className="mt-auto">
        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100" title="Cài đặt">⚙️</a>
      </div>
    </div>
  );
}
