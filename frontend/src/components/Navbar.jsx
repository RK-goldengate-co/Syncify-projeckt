import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex gap-4">
      <Link to="/dashboard" className="hover:underline">Dashboard</Link>
      <Link to="/socials" className="hover:underline">Mạng Xã Hội</Link>
      <Link to="/profile" className="hover:underline">Thông tin cá nhân</Link>
      <Link to="/analytics" className="hover:underline">Phân tích</Link>
    </nav>
  );
}
