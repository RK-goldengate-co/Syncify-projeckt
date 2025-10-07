import React, { useState } from 'react';

export default function SocialManager() {
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState('');

  const addAccount = () => {
    if (newAccount.trim()) {
      setAccounts([...accounts, newAccount.trim()]);
      setNewAccount('');
    }
  };

  const removeAccount = (idx) => {
    setAccounts(accounts.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý Mạng Xã Hội</h1>
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 mr-2"
          placeholder="Thêm mạng xã hội (VD: Facebook, Instagram...)"
          value={newAccount}
          onChange={e => setNewAccount(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addAccount}>Thêm</button>
      </div>
      <ul>
        {accounts.map((acc, idx) => (
          <li key={idx} className="flex items-center mb-2">
            <span className="flex-1">{acc}</span>
            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => removeAccount(idx)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
