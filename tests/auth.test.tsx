import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../src/context/AuthContext';
import { LoginPage } from '../src/pages/LoginPage';
import App from '../src/App';

describe('Admin Authentication Flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders login page with title and demo credentials badge', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    expect(screen.getByText('Sign In to Sanctum Portal')).toBeInTheDocument();
    expect(screen.getByLabelText(/Administrator Email/i)).toHaveValue('admin@temple.org');
    expect(screen.getByLabelText(/Master Password/i)).toHaveValue('Admin@Temple108!');
    expect(screen.getByRole('button', { name: /Sign In as Administrator/i })).toBeInTheDocument();
  });

  it('shows error message on invalid administrator credentials', async () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/Administrator Email/i);
    const passInput = screen.getByLabelText(/Master Password/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In as Administrator/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@temple.org' } });
    fireEvent.change(passInput, { target: { value: 'WrongPassword!' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Invalid administrator email or password/i);
    });
  });

  it('successfully logs in with valid demo credentials and transitions to protected console', async () => {
    render(<App />);

    // Initially at login page
    const submitBtn = screen.getByRole('button', { name: /Sign In as Administrator/i });
    fireEvent.click(submitBtn);

    // After login, protected layout and dashboard are rendered
    await waitFor(() => {
      expect(screen.getByText(/Shree Temple Trust Administration/i)).toBeInTheDocument();
      expect(screen.getByText(/Sanctum Operations Control/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    });
  });
});
