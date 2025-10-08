import React, { useState } from 'react';
import { register } from '../utils/auth';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name || !email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    try {
      await register({ name, email, password });
      setSuccess('Đăng ký thành công! Hãy đăng nhập.');
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow w-96" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Đăng ký</h2>
        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
        {success && <div className="text-green-600 mb-2 text-sm">{success}</div>}
        <input type="text" placeholder="Tên" className="border p-2 w-full mb-2" value={name} onChange={e => setName(e.target.value)} />
        <input type="email" placeholder="Email" className="border p-2 w-full mb-2" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Mật khẩu" className="border p-2 w-full mb-4" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full" type="submit">Tạo tài khoản</button>
        <div className="text-sm text-center mt-3">
          Đã có tài khoản? <Link to="/" className="text-blue-600">Đăng nhập</Link>
        </div>
      </form>
    </div>
  );
}
