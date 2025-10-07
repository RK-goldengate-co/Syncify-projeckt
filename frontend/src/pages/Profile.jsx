import React, { useState } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState({ name: '', email: '', bio: '' });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Thông tin cá nhân</h1>
      <form className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">Tên</label>
          <input name="name" value={profile.name} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input name="email" value={profile.email} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div>
          <label className="block mb-1">Giới thiệu</label>
          <textarea name="bio" value={profile.bio} onChange={handleChange} className="border p-2 w-full" />
        </div>
      </form>
    </div>
  );
}
