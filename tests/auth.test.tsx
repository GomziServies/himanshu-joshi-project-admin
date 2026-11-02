import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App';
import { TOKEN_KEY, USER_KEY } from '../src/services/auth';
import { mockApi } from './helpers';

function submitLogin(email: string, password: string) {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
  fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
}

const emptyAdminData = {
  'GET /admin/orders': () => ({ body: { success: true, data: [], pagination: { total: 0, totalPages: 1 } } }),
  'GET /admin/stats': () => ({ body: { success: true, data: { totalRevenue: 0, paidOrdersCount: 0, testPaidCount: 0 } } }),
  'GET /admin/products': () => ({ body: { success: true, data: [] } }),
};

describe('Admin login', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('starts empty and never shows credentials', () => {
    render(<App />);

    expect(screen.getByLabelText('Email')).toHaveValue('');
    expect(screen.getByLabelText('Password')).toHaveValue('');
    expect(document.body.textContent).not.toMatch(/Admin@Temple|admin@temple\.org/);
  });

  it('logs in with a server token and opens Payments', async () => {
    mockApi({
      'POST /auth/admin-login': () => ({
        body: { success: true, token: 'real.jwt.token', user: { id: '1', name: 'Admin', email: 'a@b.c', role: 'admin' } },
      }),
      ...emptyAdminData,
    });
    render(<App />);

    submitLogin('a@b.c', 'correct-password');

    expect(await screen.findByRole('heading', { name: 'Payments' })).toBeInTheDocument();
    expect(localStorage.getItem(TOKEN_KEY)).toBe('real.jwt.token');
  });

  it('shows the server message for a wrong password', async () => {
    mockApi({
      'POST /auth/admin-login': () => ({ status: 401, body: { success: false, message: 'Invalid administrative credentials.' } }),
    });
    render(<App />);

    submitLogin('a@b.c', 'wrong');

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid administrative credentials.');
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it.each(['Admin@Temple108!', 'Admin@Temple2026'])(
    'does not let the old hardcoded password %s in when the server is down',
    async (oldPassword) => {
      globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch')) as unknown as typeof fetch;
      render(<App />);

      submitLogin('admin@temple.org', oldPassword);

      expect(await screen.findByRole('alert')).toHaveTextContent(/Cannot reach the server/);
      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
      expect(screen.queryByRole('heading', { name: 'Payments' })).not.toBeInTheDocument();
    }
  );

  it('moves between Payments and Products, and logs out', async () => {
    localStorage.setItem(TOKEN_KEY, 'stored.jwt.token');
    localStorage.setItem(USER_KEY, JSON.stringify({ id: '1', name: 'Admin', email: 'a@b.c', role: 'admin' }));
    mockApi(emptyAdminData);
    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Payments' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Products' }));
    expect(await screen.findByRole('heading', { name: 'Products' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Log out' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument());
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });
});
