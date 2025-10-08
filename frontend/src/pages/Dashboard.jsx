import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalPosts: 0,
    scheduledPosts: 0,
    engagementRate: 4.2,
  });
  const [lastUpdated, setLastUpdated] = useState('Chưa cập nhật');

  const { recentHistory, upcomingSchedules, accounts } = useMemo(() => {
    const accStr = localStorage.getItem('syncify-accounts');
    const accounts = accStr ? JSON.parse(accStr) : [];

    const histStr = localStorage.getItem('syncify-history-with-time');
    const history = histStr ? JSON.parse(histStr) : [];
    const recentHistory = history.filter(h => h.action.includes('Đã đăng') || h.action.includes('Published')).slice(-3).reverse();
    
    const schedulesStr = localStorage.getItem('syncify-schedules'); // Giả sử lịch được lưu ở đây
    const schedules = schedulesStr ? JSON.parse(schedulesStr) : {};
    return { recentHistory, upcomingSchedules: schedules, accounts };
  }, [lastUpdated]); // Re-calculate when data is refreshed

  const loadStats = useCallback(() => {
    try {
      const accStr = localStorage.getItem('syncify-accounts');
      const accounts = accStr ? JSON.parse(accStr) : [];
      const totalAccounts = Array.isArray(accounts) ? accounts.length : 0;
      const totalPosts = Array.isArray(accounts)
        ? accounts.reduce((sum, a) => sum + (Number(a?.posts) || 0), 0)
        : 0;

      // Ước lượng lịch đã lên bằng lịch sử hành động
      const histStr = localStorage.getItem('syncify-history-with-time');
      const history = histStr ? JSON.parse(histStr) : [];
      const scheduledPosts = Array.isArray(history)
        ? history.filter(h => typeof h?.action === 'string' && (h.action.includes('Lịch') || h.action.includes('Schedule'))).length
        : 0;

      setStats(s => ({ ...s, totalAccounts, totalPosts, scheduledPosts }));
      setLastUpdated(new Date().toLocaleString('vi-VN'));
    } catch (e) {
      // Nếu có lỗi parse, giữ mặc định
      setLastUpdated(new Date().toLocaleString('vi-VN'));
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Tổng Quan</h1>
              <p className="text-gray-600 mt-1">Theo dõi hoạt động mạng xã hội của bạn</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                <p className="font-medium">{lastUpdated}</p>
              </div>
              <button onClick={loadStats} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Làm mới dữ liệu
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng tài khoản</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAccounts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bài đăng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã lên lịch</p>
                <p className="text-2xl font-bold text-gray-900">{stats.scheduledPosts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tương tác</p>
                <p className="text-2xl font-bold text-gray-900">{stats.engagementRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Bài đăng gần đây</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentHistory.length > 0 ? recentHistory.map((item, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{item.action.split(' ')[0]?.charAt(0) || 'S'}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.action}</p>
                        <p className="text-sm text-gray-600">Lúc: {new Date(item.timestamp).toLocaleString('vi-VN')}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Đã đăng
                        </span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-4">Chưa có hoạt động nào gần đây.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Schedule */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Thao tác nhanh</h2>
              </div>
              <div className="p-6 space-y-3">
                <Link to="/socials" className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg transition-colors">
                  Quản lý mạng xã hội
                </Link>
                <Link to="/socials" className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 px-4 rounded-lg transition-colors">
                  Tạo bài đăng mới
                </Link>
                <Link to="/analytics" className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-3 px-4 rounded-lg transition-colors">
                  Xem phân tích
                </Link>
              </div>
            </div>

            {/* Upcoming Schedule */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Lịch sắp tới</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {Object.keys(upcomingSchedules).length > 0 ? Object.entries(upcomingSchedules).slice(0, 3).map(([accIndex, dates]) => (
                    dates.map((date, i) => (
                      <div key={`${accIndex}-${i}`} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{accounts[accIndex]?.name || 'Tài khoản không xác định'}</p>
                          <p className="text-sm text-gray-600">{new Date(date).toLocaleString('vi-VN')}</p>
                        </div>
                      </div>
                    ))
                  )) : (
                    <p className="text-gray-500 text-center py-4">Không có lịch trình nào sắp tới.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
