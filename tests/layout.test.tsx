import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminLayout } from '../src/components/layout/AdminLayout';
import { AuthProvider } from '../src/context/AuthContext';

function renderLayout(onTabChange = vi.fn()) {
  render(
    <AuthProvider>
      <AdminLayout currentTab="payments" onTabChange={onTabChange}>
        <p>Page content</p>
      </AdminLayout>
    </AuthProvider>
  );
  return onTabChange;
}

describe('Admin sidebar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('lists the sections and marks the current one', () => {
    renderLayout();

    expect(screen.getByRole('button', { name: 'Payments' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Products' })).not.toHaveAttribute('aria-current');
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('links to the website in a new tab', () => {
    renderLayout();

    const link = screen.getByRole('link', { name: 'View website' });
    expect(link).toHaveAttribute('href', 'http://localhost:5173');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('opens from the phone menu button and closes after choosing a section', () => {
    const onTabChange = renderLayout();
    const aside = document.querySelector('aside')!;
    const openButton = screen.getByRole('button', { name: 'Open menu' });

    expect(aside.className).toContain('-translate-x-full');
    fireEvent.click(openButton);
    expect(aside.className).toContain('translate-x-0');
    expect(aside.className).not.toContain('-translate-x-full');

    fireEvent.click(screen.getByRole('button', { name: 'Products' }));
    expect(onTabChange).toHaveBeenCalledWith('products');
    expect(aside.className).toContain('-translate-x-full');
  });

  it('closes the phone menu with Escape and the close button', () => {
    renderLayout();
    const aside = document.querySelector('aside')!;

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(aside.className).toContain('-translate-x-full');

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(aside.className).toContain('-translate-x-full');
  });
});
