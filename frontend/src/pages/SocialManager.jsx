
import React, { useState, useEffect } from 'react';

const defaultLang = 'vi';
const translations = {
  vi: {
    title: 'Quản lý Mạng Xã Hội',
    add: 'Thêm',
    edit: 'Sửa',
    save: 'Lưu',
    cancel: 'Hủy',
    delete: 'Xóa',
    export: 'Xuất JSON',
    import: 'Nhập JSON',
    schedule: 'Lịch đăng bài',
    stats: 'Thống kê',
    logout: 'Đăng xuất',
    placeholder: 'Thêm mạng xã hội (VD: Facebook, Instagram...)',
    posts: 'Bài đăng',
    history: 'Lịch sử thao tác',
    chooseFile: 'Chọn file JSON',
    lang: 'Ngôn ngữ',
  },
  en: {
    title: 'Social Account Manager',
    add: 'Add',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    export: 'Export JSON',
    import: 'Import JSON',
    schedule: 'Schedule',
    stats: 'Stats',
    logout: 'Logout',
    placeholder: 'Add social account (e.g. Facebook, Instagram...)',
    posts: 'Posts',
    history: 'Action History',
    chooseFile: 'Choose JSON file',
    lang: 'Language',
  }
};

function getLang() {
  return localStorage.getItem('syncify-lang') || defaultLang;
}

export default function SocialManager() {
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState('');
  const [editIdx, setEditIdx] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [lang, setLang] = useState(getLang());
  const [history, setHistory] = useState([]);

  // Scheduling demo
  const [schedules, setSchedules] = useState({}); // { idx: ["2025-10-08 10:00"] }

  useEffect(() => {
    const saved = localStorage.getItem('syncify-accounts');
    if (saved) setAccounts(JSON.parse(saved));
    const hist = localStorage.getItem('syncify-history');
    if (hist) setHistory(JSON.parse(hist));
    setLang(getLang());
  }, []);

  useEffect(() => {
    localStorage.setItem('syncify-accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('syncify-history', JSON.stringify(history));
  }, [history]);

  const t = translations[lang];

  const addAccount = () => {
    if (newAccount.trim()) {
      setAccounts([...accounts, { name: newAccount.trim(), posts: 0 }]);
      setHistory([...history, `${t.add}: ${newAccount.trim()}`]);
      setNewAccount('');
    }
  };

  const removeAccount = (idx) => {
    setHistory([...history, `${t.delete}: ${accounts[idx].name}`]);
    setAccounts(accounts.filter((_, i) => i !== idx));
    const newSchedules = { ...schedules };
    delete newSchedules[idx];
    setSchedules(newSchedules);
  };

  const startEdit = (idx) => {
    setEditIdx(idx);
    setEditValue(accounts[idx].name);
  };

  const saveEdit = (idx) => {
    const updated = [...accounts];
    updated[idx].name = editValue;
    setAccounts(updated);
    setHistory([...history, `${t.edit}: ${editValue}`]);
    setEditIdx(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditIdx(null);
    setEditValue('');
  };

  // Export JSON
  const exportJSON = () => {
    const data = JSON.stringify(accounts, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'social_accounts.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const arr = JSON.parse(ev.target.result);
        if (Array.isArray(arr)) {
          setAccounts(arr);
          setHistory([...history, `${t.import}`]);
        }
      } catch {}
    };
    reader.readAsText(file);
  };

  // Scheduling
  const addSchedule = (idx, date) => {
    setSchedules({ ...schedules, [idx]: [...(schedules[idx] || []), date] });
    setHistory([...history, `${t.schedule}: ${accounts[idx].name} - ${date}`]);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('syncify-auth');
    window.location.reload();
  };

  // Language switch
  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem('syncify-lang', l);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <div className="flex gap-2">
          <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={exportJSON}>{t.export}</button>
          <label className="bg-yellow-500 text-white px-3 py-1 rounded cursor-pointer">
            {t.import}
            <input type="file" accept="application/json" style={{ display: 'none' }} onChange={importJSON} />
          </label>
          <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={logout}>{t.logout}</button>
          <select value={lang} onChange={e => switchLang(e.target.value)} className="ml-2 border rounded px-2 py-1">
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          className="border p-2 flex-1"
          placeholder={t.placeholder}
          value={newAccount}
          onChange={e => setNewAccount(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addAccount}>{t.add}</button>
      </div>
      <ul>
        {accounts.map((acc, idx) => (
          <li key={idx} className="flex flex-col md:flex-row items-center mb-2 bg-white rounded shadow p-2">
            <div className="flex-1 flex items-center">
              {editIdx === idx ? (
                <>
                  <input className="border p-1 mr-2" value={editValue} onChange={e => setEditValue(e.target.value)} />
                  <button className="bg-green-500 text-white px-2 py-1 rounded mr-1" onClick={() => saveEdit(idx)}>{t.save}</button>
                  <button className="bg-gray-400 text-white px-2 py-1 rounded" onClick={cancelEdit}>{t.cancel}</button>
                </>
              ) : (
                <>
                  <span className="font-semibold mr-2">{acc.name}</span>
                  <span className="text-xs text-gray-500 mr-2">{t.posts}: {acc.posts || 0}</span>
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-1" onClick={() => startEdit(idx)}>{t.edit}</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => removeAccount(idx)}>{t.delete}</button>
                </>
              )}
            </div>
            <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0">
              <input type="datetime-local" className="border p-1" onChange={e => addSchedule(idx, e.target.value)} />
              <span className="text-xs text-gray-500">{t.schedule}: {schedules[idx]?.join(', ')}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <h2 className="font-bold mb-2">{t.stats}</h2>
        <div className="mb-2">{t.posts}: {accounts.reduce((sum, acc) => sum + (acc.posts || 0), 0)}</div>
        <div>{t.history}:</div>
        <ul className="list-disc ml-6">
          {history.slice(-10).reverse().map((h, i) => (
            <li key={i} className="text-xs text-gray-600">{h}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
