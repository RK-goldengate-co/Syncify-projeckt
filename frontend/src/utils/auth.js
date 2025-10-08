// Simple localStorage-based auth utilities for demo purposes only

export async function hash(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  const hashArray = Array.from(new Uint8Array(buf));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('syncify-users') || '[]');
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem('syncify-users', JSON.stringify(users));
}

export async function seedAdmin() {
  const users = getUsers();
  const exists = users.some(u => u.email === 'admin@syncify.dev');
  if (!exists) {
    const passwordHash = await hash('Admin@123');
    users.push({
      email: 'admin@syncify.dev',
      name: 'Administrator',
      role: 'admin',
      passwordHash,
      createdAt: new Date().toISOString(),
    });
    saveUsers(users);
  }
}

export async function register({ name, email, password }) {
  const users = getUsers();
  if (users.some(u => u.email === email)) {
    throw new Error('Email đã tồn tại');
  }
  const passwordHash = await hash(password);
  const user = { name, email, role: 'user', passwordHash, createdAt: new Date().toISOString() };
  users.push(user);
  saveUsers(users);
  return user;
}

export async function login({ email, password }) {
  const users = getUsers();
  const u = users.find(x => x.email === email);
  if (!u) throw new Error('Sai email hoặc mật khẩu');
  const h = await hash(password);
  if (h !== u.passwordHash) throw new Error('Sai email hoặc mật khẩu');
  // persist auth session
  localStorage.setItem('syncify-auth', 'true');
  localStorage.setItem('syncify-current-user', JSON.stringify({ email: u.email, name: u.name, role: u.role }));
  return { email: u.email, name: u.name, role: u.role };
}

export function logout() {
  localStorage.removeItem('syncify-auth');
  localStorage.removeItem('syncify-current-user');
}
