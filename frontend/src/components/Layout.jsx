import React, { useMemo } from 'react';
import LeftRail from './LeftRail';
import SidePanel from './SidePanel';
import { logout } from '../utils/auth';
import ChatBot from './ChatBot';

export default function Layout({ children }) {
  const currentUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('syncify-current-user') || 'null'); } catch { return null; }
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        <LeftRail />
        <SidePanel />
        <main className="flex-1 min-h-screen">
          {/* Global Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
              <div className="font-semibold">Syncify</div>
              <div className="flex items-center gap-3">
                {currentUser && (
                  <div className="text-sm text-gray-700">
                    {currentUser.name || currentUser.email}
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-600">
                      {currentUser.role}
                    </span>
                  </div>
                )}
                <button onClick={handleLogout} className="text-sm bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-black">
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
          {children}
          <ChatBot />
        </main>
      </div>
    </div>
  );
}
