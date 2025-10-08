
import React, { useState, useEffect } from 'react';

const defaultLang = 'vi';
const translations = {
  vi: {
    title: 'Quản lý Mạng Xã Hội',
    subtitle: 'Kết nối và quản lý tất cả tài khoản mạng xã hội của bạn',
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
    connected: 'Đã kết nối',
    disconnected: 'Chưa kết nối',
    totalAccounts: 'Tổng số tài khoản',
    activeSchedules: 'Lịch đang hoạt động',
    noAccounts: 'Chưa có tài khoản nào',
    addFirst: 'Thêm tài khoản đầu tiên',
  },
  en: {
    title: 'Social Account Manager',
    subtitle: 'Connect and manage all your social media accounts',
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
    connected: 'Connected',
    disconnected: 'Disconnected',
    totalAccounts: 'Total Accounts',
    activeSchedules: 'Active Schedules',
    noAccounts: 'No accounts yet',
    addFirst: 'Add your first account',
  }
};

// Popular providers preset (icon + homepage for quick fill)
const providerIcons = {
  Facebook: {
    icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg',
    url: 'https://www.facebook.com/'
  },
  Instagram: {
    icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg',
    url: 'https://www.instagram.com/'
  },
  X: {
    icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg',
    url: 'https://x.com/'
  },
  TikTok: {
    icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg',
    url: 'https://www.tiktok.com/'
  },
  YouTube: {
    icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg',
    url: 'https://www.youtube.com/'
  },
  LinkedIn: {
    icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg',
    url: 'https://www.linkedin.com/'
  }
};

function getLang() {
  return localStorage.getItem('syncify-lang') || defaultLang;
}

export default function SocialManager() {
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({ url: '', name: '', icon: '', tag: '' });
  const [editIdx, setEditIdx] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [lang, setLang] = useState(getLang());
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [provider, setProvider] = useState('');
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [connectedFilter, setConnectedFilter] = useState('');
  const [sortKey, setSortKey] = useState('createdAt'); // name | createdAt | posts
  const [sortDir, setSortDir] = useState('desc'); // asc | desc

  // Scheduling demo
  const [schedules, setSchedules] = useState({}); // { idx: ["2025-10-08 10:00"] }

  // History with timestamps
  const [historyWithTime, setHistoryWithTime] = useState([]);

  // Current user role
  let currentUser = null;
  try { currentUser = JSON.parse(localStorage.getItem('syncify-current-user') || 'null'); } catch {}
  const role = currentUser?.role || 'user';
  useEffect(() => {
    const saved = localStorage.getItem('syncify-accounts');
    if (saved) setAccounts(JSON.parse(saved));
    const hist = localStorage.getItem('syncify-history');
    if (hist) setHistory(JSON.parse(hist));
    const histWithTime = localStorage.getItem('syncify-history-with-time');
    if (histWithTime) setHistoryWithTime(JSON.parse(histWithTime));
    setLang(getLang());
  }, []);

  useEffect(() => {
    localStorage.setItem('syncify-accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('syncify-history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('syncify-history-with-time', JSON.stringify(historyWithTime));
  }, [historyWithTime]);

  const t = translations[lang];

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US');
  };

  const addAccount = () => {
    setError('');
    const { url, name, icon, tag } = newAccount;
    if (!name?.trim()) { setError('Vui lòng nhập tên ứng dụng'); return; }
    if (url && !isValidUrl(url)) { setError('URL không hợp lệ (cần bắt đầu bằng http/https)'); return; }
    if (tag && tag.length > 20) { setError('Tag tối đa 20 ký tự'); return; }
    // Duplicate checks
    const nameExists = accounts.some(a => a.name.trim().toLowerCase() === name.trim().toLowerCase());
    if (nameExists) { setError('Tên ứng dụng đã tồn tại'); return; }
    if (url) {
      const urlExists = accounts.some(a => (a.url || '').toLowerCase() === url.trim().toLowerCase());
      if (urlExists) { setError('URL đã tồn tại'); return; }
    }
    const platform = url ? (new URL(url).hostname.split('.').slice(-2, -1)[0] || 'Social') : 'Social';
    const item = {
      name: name.trim(),
      url: url?.trim() || '',
      icon: icon?.trim() || '',
      tag: tag?.trim() || '',
      platform,
      posts: 0,
      connected: true,
      createdAt: new Date().toISOString(),
    };
    setAccounts([...accounts, item]);
    setHistory([...history, `${t.add}: ${item.name}`]);
    setHistoryWithTime([...historyWithTime, { action: `${t.add}: ${item.name}`, timestamp: new Date().toISOString() }]);
    setNewAccount({ url: '', name: '', icon: '', tag: '' });
    setProvider('');
  };

  function isValidUrl(str) {
    try {
      const u = new URL(str);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch { return false; }
  }
  const removeAccount = (idx) => {
    setHistory([...history, `${t.delete}: ${accounts[idx].name}`]);
    setHistoryWithTime([...historyWithTime, { action: `${t.delete}: ${accounts[idx].name}`, timestamp: new Date().toISOString() }]);
    setAccounts(accounts.filter((_, i) => i !== idx));
    // Remap schedules to keep indices in sync after deletion
    const remapped = {};
    Object.keys(schedules).forEach((k) => {
      const i = Number(k);
      if (i < idx) remapped[i] = schedules[i];
      else if (i > idx) remapped[i - 1] = schedules[i];
    });
    setSchedules(remapped);
  };

  const startEdit = (idx) => {
    setEditIdx(idx);
    setEditValue(accounts[idx].name);
    setError('');
  };

  const saveEdit = (idx) => {
    const newName = (editValue || '').trim();
    if (!newName) { setError('Tên không được để trống'); return; }
    const dup = accounts.some((a, i) => i !== idx && (a.name || '').toLowerCase() === newName.toLowerCase());
    if (dup) { setError('Tên ứng dụng đã tồn tại'); return; }
    const updated = [...accounts];
    updated[idx].name = newName;
    setAccounts(updated);
    setHistory([...history, `${t.edit}: ${newName}`]);
    setHistoryWithTime([...historyWithTime, { action: `${t.edit}: ${newName}`, timestamp: new Date().toISOString() }]);
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
          const normalized = arr.map((item) => {
            const name = (item?.name || '').toString();
            const url = (item?.url || '').toString();
            const icon = (item?.icon || '').toString();
            const tag = (item?.tag || '').toString();
            const createdAt = item?.createdAt || new Date().toISOString();
            const platform = item?.platform || (url ? (() => {
              try { return (new URL(url).hostname.split('.').slice(-2, -1)[0]) || 'Social'; } catch { return 'Social'; }
            })() : 'Social');
            const posts = Number.isFinite(Number(item?.posts)) ? Number(item.posts) : 0;
            const connected = typeof item?.connected === 'boolean' ? item.connected : true;
            return { name, url, icon, tag, createdAt, platform, posts, connected };
          });
          setAccounts(normalized);
          setHistory([...history, `${t.import}`]);
          setHistoryWithTime([...historyWithTime, { action: `${t.import}`, timestamp: new Date().toISOString() }]);
        }
      } catch {}
    };
    reader.readAsText(file);
  };

  // Scheduling
  const addSchedule = (idx, date) => {
    if (!date) return;
    const existing = schedules[idx] || [];
    if (existing.includes(date)) return; // tránh trùng
    setSchedules({ ...schedules, [idx]: [...existing, date] });
    setHistory([...history, `${t.schedule}: ${accounts[idx].name} - ${date}`]);
    setHistoryWithTime([...historyWithTime, { action: `${t.schedule}: ${accounts[idx].name} - ${date}`, timestamp: new Date().toISOString() }]);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-600 mt-1">{t.subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={lang} 
                onChange={e => switchLang(e.target.value)} 
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="vi">🇻🇳 Tiếng Việt</option>
                <option value="en">🇺🇸 English</option>
              </select>
              <input
                type="text"
                placeholder="Tìm theo tên/URL..."
                className="hidden md:block border border-gray-300 rounded-lg px-3 py-2 text-sm w-64"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <input
                type="text"
                placeholder="Lọc theo tag..."
                className="hidden md:block border border-gray-300 rounded-lg px-3 py-2 text-sm w-40"
                value={filterTag}
                onChange={e => setFilterTag(e.target.value)}
              />
              <select
                value={platformFilter}
                onChange={e => setPlatformFilter(e.target.value)}
                className="hidden md:block border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Tất cả nền tảng</option>
                {Array.from(new Set(accounts.map(a => a.platform).filter(Boolean))).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <select
                value={provider}
                onChange={e => {
                  setProvider(e.target.value);
                  if (e.target.value) {
                    const providerData = providerIcons[e.target.value];
                    setNewAccount({
                      ...newAccount,
                      name: e.target.value,
                      url: providerData?.url || '',
                      icon: providerData?.icon || ''
                    });
                  }
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Chọn nền tảng</option>
                {Object.keys(providerIcons).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <select
                value={connectedFilter}
                onChange={e => setConnectedFilter(e.target.value)}
                className="hidden md:block border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="connected">Đã kết nối</option>
                <option value="disconnected">Chưa kết nối</option>
              </select>
              <button 
                onClick={exportJSON}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {t.export}
              </button>
              {role === 'admin' && (
                <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                  {t.import}
                  <input type="file" accept="application/json" className="hidden" onChange={importJSON} />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t.totalAccounts}</p>
                <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
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
                <p className="text-sm font-medium text-gray-600">{t.posts}</p>
                <p className="text-2xl font-bold text-gray-900">{accounts.reduce((sum, acc) => sum + (acc.posts || 0), 0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t.activeSchedules}</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(schedules).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Account */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="url"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="URL (https://...)"
              value={newAccount.url}
              onChange={e => setNewAccount({ ...newAccount, url: e.target.value })}
            />
            <input
              type="text"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tên ứng dụng"
              value={newAccount.name}
              onChange={e => setNewAccount({ ...newAccount, name: e.target.value })}
            />
            <input
              type="url"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Icon URL (tùy chọn)"
              value={newAccount.icon}
              onChange={e => setNewAccount({ ...newAccount, icon: e.target.value })}
            />
            <input
              type="text"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tag (ví dụ: Marketing)"
              value={newAccount.tag}
              onChange={e => setNewAccount({ ...newAccount, tag: e.target.value })}
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm mb-3">{error}</div>
          )}
          <div className="flex justify-end">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              onClick={addAccount}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t.add}
            </button>
          </div>
        </div>

        {/* Accounts List */}
        {accounts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noAccounts}</h3>
            <p className="text-gray-600 mb-4">{t.addFirst}</p>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              onClick={() => document.querySelector('input[type="text"]').focus()}
            >
              {t.add}
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {(accounts
              .filter(acc => {
                const s = search.toLowerCase();
                const okSearch = !s || 
                  (acc.name && acc.name.toLowerCase().includes(s)) || 
                  (acc.url && acc.url.toLowerCase().includes(s));
                const okTag = !filterTag || 
                  (acc.tag && acc.tag.toLowerCase().includes(filterTag.toLowerCase()));
                const okPlatform = !platformFilter || 
                  (acc.platform && acc.platform.toLowerCase() === platformFilter.toLowerCase());
                const okConnected = !connectedFilter || 
                  (connectedFilter === 'connected' ? acc.connected : !acc.connected);
                return okSearch && okTag && okPlatform && okConnected;
              })
              .sort((a,b) => {
                const dir = sortDir === 'asc' ? 1 : -1;
                if (sortKey === 'name') {
                  if (!a.name && !b.name) return 0;
                  if (!a.name) return -1 * dir;
                  if (!b.name) return 1 * dir;
                  return a.name.localeCompare(b.name) * dir;
                }
                if (sortKey === 'posts') {
                  const postsA = a.posts || 0;
                  const postsB = b.posts || 0;
                  return (postsA - postsB) * dir;
                }
                // createdAt default
                const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
                const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
                return (dateA - dateB) * dir;
              })
            ).map((acc, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    {acc.icon ? (
                      <img src={acc.icon} alt={acc.name} className="w-12 h-12 rounded-lg object-cover border" />
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">{acc.platform?.charAt(0) || 'S'}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      {editIdx === idx ? (
                        <div className="flex gap-2">
                          <input 
                            className="flex-1 border border-gray-300 rounded px-3 py-2" 
                            value={editValue} 
                            onChange={e => setEditValue(e.target.value)} 
                          />
                          <button 
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                            onClick={() => saveEdit(idx)}
                          >
                            {t.save}
                          </button>
                          <button 
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                            onClick={cancelEdit}
                          >
                            {t.cancel}
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg font-semibold text-gray-900">{acc.name}{acc.tag && (
                              <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 align-middle">{acc.tag}</span>
                            )}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${acc.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {acc.connected ? t.connected : t.disconnected}
                            </span>
                            <span className="text-sm text-gray-600">{acc.platform || 'Facebook'}</span>
                            <span className="text-sm text-gray-600">{t.posts}: {acc.posts || 0}</span>
                            {acc.url && (
                              <a href={acc.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline truncate max-w-[240px]">{acc.url}</a>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {editIdx !== idx && (
                    <div className="flex items-center gap-2">
                      <button 
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
                        onClick={() => startEdit(idx)}
                      >
                        {t.edit}
                      </button>
                      <button 
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        onClick={() => removeAccount(idx)}
                      >
                        {t.delete}
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Schedule Section */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <input 
                      type="datetime-local" 
                      className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onChange={e => addSchedule(idx, e.target.value)} 
                    />
                    <div className="text-sm text-gray-600">
                      {t.schedule}: {schedules[idx]?.length > 0 ? 
                        schedules[idx].map((date, i) => (
                          <span key={i} className="inline-block mr-2">{formatDate(date)}</span>
                        )) : 
                        'Chưa có lịch'
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* History Section */}
        {historyWithTime.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.history}</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {historyWithTime.slice(-10).reverse().map((h, i) => (
                <div key={i} className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">{h.action}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {formatDate(h.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
