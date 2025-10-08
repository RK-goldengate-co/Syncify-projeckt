import React, { useMemo } from 'react';
import { getUsers } from '../utils/auth';

export default function Admin() {
  const users = useMemo(() => getUsers(), []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Bảng điều khiển Quản trị</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600">Tổng số người dùng</p>
          <p className="text-3xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600">Số admin</p>
          <p className="text-3xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600">Số user thường</p>
          <p className="text-3xl font-bold">{users.filter(u => u.role !== 'admin').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Người dùng</h2>
          <p className="text-sm text-gray-500">Dữ liệu demo lưu cục bộ (localStorage)</p>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Tên</th>
                <th className="py-2 pr-4">Vai trò</th>
                <th className="py-2 pr-4">Tạo lúc</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4">{u.name}</td>
                  <td className="py-2 pr-4"><span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs">{u.role}</span></td>
                  <td className="py-2 pr-4">{new Date(u.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
