import React from 'react';

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Tổng Quan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded shadow p-4">Tổng số mạng xã hội đã kết nối</div>
        <div className="bg-white rounded shadow p-4">Tổng số bài đăng</div>
        <div className="bg-white rounded shadow p-4">Phân tích tương tác</div>
        <div className="bg-white rounded shadow p-4">Lịch đăng bài</div>
      </div>
    </div>
  );
}
