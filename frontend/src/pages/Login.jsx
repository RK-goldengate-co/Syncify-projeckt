import React, { useState } from 'react';
import { login } from '../utils/auth';
import { Link } from 'react-router-dom';

export default function Login({ onLogin = () => {} }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu');
      return;
    }
    try {
      setLoading(true);
      await login({ email, password });
      onLogin();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow w-96" onSubmit={handleLogin}>
        <h2 className="text-xl font-bold mb-2">Đăng nhập</h2>
        <p className="text-xs text-gray-500 mb-4">Admin mặc định: admin@syncify.dev / Admin@123</p>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input type="email" placeholder="Email" className="border p-2 w-full mb-2" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Mật khẩu" className="border p-2 w-full mb-4" value={password} onChange={e => setPassword(e.target.value)} />
        <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        <div className="text-sm text-right mt-2">
          <Link to="/forgot" className="text-indigo-600">Quên mật khẩu?</Link>
        </div>
        <div className="text-sm text-center mt-3">
          Chưa có tài khoản? <Link to="/register" className="text-blue-600">Đăng ký</Link>
        </div>
      </form>
    </div>
  );
}
