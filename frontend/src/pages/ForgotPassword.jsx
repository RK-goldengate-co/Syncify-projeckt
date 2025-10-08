import React, { useState } from 'react';
import { getUsers, hash, saveUsers } from '../utils/auth';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPass, setNewPass] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');
    if (!email || !newPass) { setErr('Nhập email và mật khẩu mới'); return; }
    const users = getUsers();
    const idx = users.findIndex(u => u.email === email);
    if (idx === -1) { setErr('Email không tồn tại'); return; }
    users[idx].passwordHash = await hash(newPass);
    saveUsers(users);
    setMsg('Đổi mật khẩu thành công! Hãy đăng nhập.');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow w-96" onSubmit={handleReset}>
        <h2 className="text-xl font-bold mb-4">Quên mật khẩu (giả lập)</h2>
        {err && <div className="text-red-500 mb-2 text-sm">{err}</div>}
        {msg && <div className="text-green-600 mb-2 text-sm">{msg}</div>}
        <input type="email" placeholder="Email đã đăng ký" className="border p-2 w-full mb-2" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Mật khẩu mới" className="border p-2 w-full mb-4" value={newPass} onChange={e => setNewPass(e.target.value)} />
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded w-full" type="submit">Đặt lại mật khẩu</button>
        <div className="text-sm text-center mt-3">
          <Link to="/" className="text-blue-600">Quay lại đăng nhập</Link>
        </div>
      </form>
    </div>
  );
}
