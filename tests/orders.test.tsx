import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OrdersPage } from '../src/pages/OrdersPage';

describe('Orders & Payment Receipts Management', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders orders ledger with order numbers, devotee Yajman, Gotra, and Razorpay signature audit', async () => {
    render(<OrdersPage />);

    expect(
      screen.getByText('Devotee Orders & Consecrated Receipts Ledger')
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('ORD-20261029-7892')).toBeInTheDocument();
      expect(screen.getByText(/Rajesh Sharma & Family/i)).toBeInTheDocument();
      expect(screen.getByText(/Gotra: Kashyapa/i)).toBeInTheDocument();
      expect(screen.getByText('pay_RZP9876543210')).toBeInTheDocument();
      expect(screen.getAllByText(/HMAC-SHA256 Verified/i).length).toBeGreaterThan(0);
    });
  });

  it('filters orders by status lifecycle', async () => {
    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText('ORD-20261029-7892')).toBeInTheDocument();
    });

    // Click 'Confirmed' filter button
    const confirmedFilter = screen.getByRole('button', { name: 'Confirmed' });
    fireEvent.click(confirmedFilter);

    await waitFor(() => {
      expect(screen.getByText('ORD-20261028-3419')).toBeInTheDocument();
    });

    // Reset to 'All Orders'
    const allFilter = screen.getByRole('button', { name: 'All Orders' });
    fireEvent.click(allFilter);

    await waitFor(() => {
      expect(screen.getByText('ORD-20261029-7892')).toBeInTheDocument();
      expect(screen.getByText('ORD-20261028-3419')).toBeInTheDocument();
    });
  });

  it('opens printable consecrated receipt modal with official temple trust layout', async () => {
    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText('ORD-20261029-7892')).toBeInTheDocument();
    });

    const inspectButtons = screen.getAllByRole('button', { name: /Inspect Receipt/i });
    fireEvent.click(inspectButtons[0]);

    // Check modal contents
    await waitFor(() => {
      expect(screen.getByText('Shree Somnath Sanctum Trust')).toBeInTheDocument();
      expect(
        screen.getByText(/Dashashwamedh Ghat Road, Varanasi, Uttar Pradesh 221001/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Official Consecration Dakshina Receipt/i)).toBeInTheDocument();
      expect(screen.getByText('RCPT-20261029-7892')).toBeInTheDocument();
      expect(screen.getByText('Cryptographically Signed & Sealed in Mongoose Ledger')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Print Official Receipt/i })).toBeInTheDocument();
    });
  });

  it('triggers window.print when Print Official Receipt is clicked', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText('ORD-20261029-7892')).toBeInTheDocument();
    });

    const inspectButtons = screen.getAllByRole('button', { name: /Inspect Receipt/i });
    fireEvent.click(inspectButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Print Official Receipt/i })).toBeInTheDocument();
    });

    const printBtn = screen.getByRole('button', { name: /Print Official Receipt/i });
    fireEvent.click(printBtn);

    expect(printSpy).toHaveBeenCalled();
  });
});
