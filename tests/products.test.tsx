import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductsPage } from '../src/pages/ProductsPage';

describe('Product Management (Temple Offerings & Shivling Sthapana)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders products directory with Shivling Sthapana offering details', async () => {
    render(<ProductsPage />);

    expect(screen.getByText('Temple Offerings & Products Directory')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/Shivling Sthapana & Rudrabhishek Offering/i)
      ).toBeInTheDocument();
      expect(screen.getByText('₹5,100')).toBeInTheDocument();
    });
  });

  it('filters offerings by category tabs and displays empty state when category has no products', async () => {
    render(<ProductsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Shivling Sthapana & Rudrabhishek Offering/i)).toBeInTheDocument();
    });

    // Click on 'Puja' category button (which currently has 0 products before admin adds one)
    const pujaBtn = screen.getByRole('button', { name: 'Puja' });
    fireEvent.click(pujaBtn);

    await waitFor(() => {
      expect(screen.getByText(/No temple offerings found matching your criteria/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/Shivling Sthapana & Rudrabhishek Offering/i)
      ).not.toBeInTheDocument();
    });

    // Reset to 'All Offerings'
    const allBtn = screen.getByRole('button', { name: 'All Offerings' });
    fireEvent.click(allBtn);

    await waitFor(() => {
      expect(screen.getByText(/Shivling Sthapana & Rudrabhishek Offering/i)).toBeInTheDocument();
    });
  });

  it('opens create modal with form fields and creates new offering', async () => {
    render(<ProductsPage />);

    const addBtn = screen.getByRole('button', { name: /Add New Temple Offering/i });
    fireEvent.click(addBtn);

    expect(screen.getByText('Add New Temple Offering / Seva')).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/Offering Title \*/i);
    fireEvent.change(titleInput, { target: { value: 'Kashi Special Ganga Aarti Seva' } });

    const priceInput = screen.getByLabelText(/Dakshina Price \(₹\) \*/i);
    fireEvent.change(priceInput, { target: { value: '3100' } });

    const saveBtn = screen.getByRole('button', { name: /Save Offering/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText('Kashi Special Ganga Aarti Seva')).toBeInTheDocument();
      expect(screen.getByText('₹3,100')).toBeInTheDocument();
    });
  });
});
