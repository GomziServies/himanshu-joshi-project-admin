import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';

describe('Admin Management Dashboard (himanshu-joshi-project-admin)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders login screen when not authenticated', () => {
    render(<App />);
    expect(screen.getByText(/Sign In to Sanctum Portal/i)).toBeInTheDocument();
    expect(screen.getByText(/Brown & White Executive Management Suite/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/admin@temple.org/i)).toBeInTheDocument();
  });

  it('successfully logs in with admin credentials and shows dashboard metrics', async () => {
    render(<App />);
    const submitBtn = screen.getByRole('button', { name: /Sign In as Administrator/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Shree Temple Trust Administration/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Revenue \(Dakshina\)/i)).toBeInTheDocument();
    });
  });

  it('navigates to products management tab and displays offerings', async () => {
    render(<App />);
    const submitBtn = screen.getByRole('button', { name: /Sign In as Administrator/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Shree Temple Trust Administration/i)).toBeInTheDocument();
    });

    const productsTab = screen.getByRole('button', { name: /Products & Sevas/i });
    fireEvent.click(productsTab);

    await waitFor(() => {
      expect(screen.getByText(/Temple Offerings & Products Directory/i)).toBeInTheDocument();
      expect(screen.getByText(/Add New Temple Offering/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Shivling Sthapana/i).length).toBeGreaterThan(0);
    });
  });

  it('navigates to banners tab and displays website banners', async () => {
    render(<App />);
    const submitBtn = screen.getByRole('button', { name: /Sign In as Administrator/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Shree Temple Trust Administration/i)).toBeInTheDocument();
    });

    const bannersTab = screen.getByRole('button', { name: /Website Banners/i });
    fireEvent.click(bannersTab);

    await waitFor(() => {
      const bannerHeadings = screen.getAllByText(/Website Promotional Banners/i);
      expect(bannerHeadings.length).toBeGreaterThan(0);
      expect(screen.getByText(/Create New Banner/i)).toBeInTheDocument();
    });
  });

  it('navigates to orders tab and allows inspecting consecrated receipts', async () => {
    render(<App />);
    const submitBtn = screen.getByRole('button', { name: /Sign In as Administrator/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Shree Temple Trust Administration/i)).toBeInTheDocument();
    });

    const ordersTab = screen.getByRole('button', { name: /Orders & Receipts/i });
    fireEvent.click(ordersTab);

    await waitFor(() => {
      expect(screen.getByText(/Devotee Orders & Consecrated Receipts Ledger/i)).toBeInTheDocument();
      const inspectButtons = screen.getAllByRole('button', { name: /Inspect Receipt/i });
      expect(inspectButtons.length).toBeGreaterThan(0);
    });

    const inspectBtn = screen.getAllByRole('button', { name: /Inspect Receipt/i })[0];
    fireEvent.click(inspectBtn);

    await waitFor(() => {
      expect(screen.getByText(/Consecrated Temple Receipt Inspector/i)).toBeInTheDocument();
      expect(screen.getByText(/Official Consecration Dakshina Receipt/i)).toBeInTheDocument();
    });
  });
});
