import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BannersPage } from '../src/pages/BannersPage';

describe('Promotional Banner Management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders promotional banners with title and images', async () => {
    render(<BannersPage />);

    expect(screen.getByText('Website Promotional Banners')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/Maha Shivling Sthapana & Vedic Abhishek/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Shravan Somwar Special Rudrabhishek/i)
      ).toBeInTheDocument();
    });
  });

  it('optimistically toggles banner active/hidden state on button click', async () => {
    render(<BannersPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/Maha Shivling Sthapana & Vedic Abhishek/i)
      ).toBeInTheDocument();
    });

    // Find the toggle button for the first banner
    const toggleButtons = screen.getAllByRole('button', { name: /Toggle active status/i });
    expect(toggleButtons.length).toBeGreaterThan(0);

    const firstToggle = toggleButtons[0];
    expect(firstToggle).toHaveTextContent(/Active/i);

    // Click toggle
    fireEvent.click(firstToggle);

    await waitFor(() => {
      expect(firstToggle).toHaveTextContent(/Hidden/i);
    });

    // Click toggle again
    fireEvent.click(firstToggle);

    await waitFor(() => {
      expect(firstToggle).toHaveTextContent(/Active/i);
    });
  });

  it('opens create banner modal and adds new promotional banner', async () => {
    render(<BannersPage />);

    const createBtn = screen.getByRole('button', { name: /Create New Banner/i });
    fireEvent.click(createBtn);

    expect(screen.getByText('Create Website Hero Banner')).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/Banner Title \*/i);
    fireEvent.change(titleInput, { target: { value: 'Mahashivratri Deepotsav 2026' } });

    const saveBtn = screen.getByRole('button', { name: /Save Banner/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText('Mahashivratri Deepotsav 2026')).toBeInTheDocument();
    });
  });
});
