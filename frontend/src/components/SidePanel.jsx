import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

const conversations = [
  { id: 1, name: 'Monica', badge: 'AI' },
  { id: 2, name: 'GPT-5', badge: 'Lab' },
  { id: 3, name: 'Claude 4', badge: 'Pro' },
  { id: 4, name: 'DeepSeek V3', badge: 'New' },
  { id: 5, name: 'Grok 4', badge: '' },
];

export default function SidePanel() {
  const location = useLocation();
  const currentUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('syncify-current-user') || 'null'); } catch { return null; }
  }, []);
  const role = currentUser?.role || 'user';

  return (
    <aside className="w-72 shrink-0 h-screen sticky top-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-3 border-b">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {/* App navigation with role-based visibility */}
        <div className="mt-3 space-y-1 text-sm">
          <Link to="/dashboard" className={`block px-2 py-1 rounded ${location.pathname.startsWith('/dashboard') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>🏠 Dashboard</Link>
          <Link to="/socials" className={`block px-2 py-1 rounded ${location.pathname.startsWith('/socials') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>🌐 Mạng xã hội</Link>
          {role === 'admin' && (
            <Link to="/analytics" className={`block px-2 py-1 rounded ${location.pathname.startsWith('/analytics') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>📈 Phân tích (Admin)</Link>
          )}
          <Link to="/profile" className={`block px-2 py-1 rounded ${location.pathname.startsWith('/profile') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>👤 Hồ sơ</Link>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {conversations.map((c) => {
          const active = location.pathname.includes(String(c.id)) && false; // placeholder
          return (
            <Link
              key={c.id}
              to="/dashboard"
              className={`flex items-center justify-between px-3 py-2 border-b text-sm hover:bg-gray-50 ${
                active ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <span className="truncate">{c.name}</span>
              {c.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{c.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t text-xs text-gray-500">Danh sách mẫu</div>
    </aside>
  );
}
