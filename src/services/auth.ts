import { AdminUser } from '../types';

export const API_BASE =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api';

export const TOKEN_KEY = 'mandir_admin_token';
export const USER_KEY = 'mandir_admin_user';

export const NETWORK_ERROR = 'Cannot reach the server. Please check it is running and try again.';

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

export async function adminLogin(
  email: string,
  password: string
): Promise<{ token: string; user: AdminUser }> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error(NETWORK_ERROR);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.token) {
    throw new Error(data?.message || 'Login failed. Please try again.');
  }

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return { token: data.token, user: data.user };
}

export function adminLogout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
