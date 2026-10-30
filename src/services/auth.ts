import { AdminUser } from '../types';

const API_BASE =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api';

export const TOKEN_KEY = 'mandir_admin_token';
export const USER_KEY = 'mandir_admin_user';

export function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AdminUser | null {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getStoredToken();
}

export async function adminLogin(
  email: string,
  password: string
): Promise<{ token: string; user: AdminUser }> {
  try {
    const res = await fetch(`${API_BASE}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return { token: data.token, user: data.user };
      }
    }
  } catch (err) {
    console.warn('Backend login endpoint unavailable, checking demo credentials fallback', err);
  }

  // Demo fallback credentials specified in prompt and project specs:
  // admin@temple.org / Admin@Temple108! (and Admin@Temple2026)
  if (
    email.toLowerCase() === 'admin@temple.org' &&
    (password === 'Admin@Temple108!' || password === 'Admin@Temple2026')
  ) {
    const demoToken = 'temple_admin_jwt_' + Date.now();
    const demoUser: AdminUser = {
      id: 'usr_admin_1',
      name: 'Sanctum Administrator',
      email: 'admin@temple.org',
      role: 'admin',
      phone: '+91 98256 00778',
      status: 'active',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(TOKEN_KEY, demoToken);
    localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
    return { token: demoToken, user: demoUser };
  }

  throw new Error('Invalid administrator email or password');
}

export function adminLogout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
