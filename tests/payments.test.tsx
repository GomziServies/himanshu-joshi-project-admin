import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { PaymentsPage } from '../src/pages/PaymentsPage';
import { lastUrlTo, mockApi } from './helpers';

const PAID_ORDER = {
  _id: 'order_1',
  orderNumber: 'ORD-20261030-ABC123',
  customer: {
    name: 'Amit Sharma',
    email: 'amit@example.com',
    phone: '9876543210',
  },
  items: [{ productTitle: 'Salahkareshwar Mahadev Shivling', quantity: 1, unitPrice: 501, subtotal: 501 }],
  totalAmount: 501,
  status: 'PAID',
  razorpayPaymentId: 'pay_real_123',
  receiptId: { receiptNumber: 'RCPT-20261030-ABC123' },
  createdAt: '2026-10-30T08:15:00Z',
};

const STATS = { totalRevenue: 1503, paidOrdersCount: 3, testPaidCount: 0 };

function orderPage(orders: object[], totalPages = 1) {
  return { success: true, data: orders, pagination: { total: orders.length, totalPages } };
}

function mockOrders(orders: object[], stats: object = STATS, totalPages = 1) {
  return mockApi({
    'GET /admin/orders': () => ({ body: orderPage(orders, totalPages) }),
    'GET /admin/stats': () => ({ body: { success: true, data: stats } }),
  });
}

describe('Payments page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('shows real payments from the API with the totals', async () => {
    mockOrders([PAID_ORDER]);
    render(<PaymentsPage />);

    expect(await screen.findByText('Amit Sharma')).toBeInTheDocument();
    expect(screen.getByText('Salahkareshwar Mahadev Shivling')).toBeInTheDocument();
    expect(screen.getByText('₹501')).toBeInTheDocument();
    expect(screen.getByTestId('total-collected')).toHaveTextContent('₹1,503');
    expect(screen.getByTestId('paid-count')).toHaveTextContent('3');
  });

  it('shows an error and no invented payments when the API is down', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch')) as unknown as typeof fetch;
    render(<PaymentsPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/Cannot reach the server/);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByTestId('total-collected')).toHaveTextContent('—');
  });

  it('recovers when Try again is clicked', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch')) as unknown as typeof fetch;
    render(<PaymentsPage />);
    await screen.findByRole('alert');

    mockOrders([PAID_ORDER]);
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByText('Amit Sharma')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('loads paid payments first and sends the right status for each filter', async () => {
    const fetchMock = mockOrders([PAID_ORDER]);
    render(<PaymentsPage />);
    await screen.findByText('Amit Sharma');

    const lastOrderUrl = () => lastUrlTo(fetchMock, '/admin/orders');
    expect(lastOrderUrl()).toContain('status=PAID');

    fireEvent.click(screen.getByRole('button', { name: 'Not paid' }));
    await waitFor(() => expect(lastOrderUrl()).toContain('status=CREATED%2CPENDING%2CFAILED%2CCANCELLED'));

    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    await waitFor(() => expect(lastOrderUrl()).not.toContain('status='));
  });

  it('searches on the server', async () => {
    const fetchMock = mockOrders([PAID_ORDER]);
    render(<PaymentsPage />);
    await screen.findByText('Amit Sharma');

    fireEvent.change(screen.getByLabelText('Search payments'), { target: { value: 'amit' } });

    await waitFor(() => {
      expect(lastUrlTo(fetchMock, '/admin/orders')).toContain('search=amit');
    });
  });

  it('shows the test amount, clearly labelled, while there are only test payments', async () => {
    mockOrders([{ ...PAID_ORDER, isTest: true }], { totalRevenue: 0, paidOrdersCount: 0, testRevenue: 5502, testPaidCount: 2 });
    render(<PaymentsPage />);

    expect(await screen.findByTestId('test-note')).toHaveTextContent('no real money has been received');
    expect(screen.getByTestId('total-collected')).toHaveTextContent('₹5,502');
    expect(screen.getByTestId('paid-count')).toHaveTextContent('2');
    // Both cards and the table row carry a Test label
    expect(screen.getAllByText('Test')).toHaveLength(3);
  });

  it('counts only real money once real payments exist, and lists test money separately', async () => {
    mockOrders([PAID_ORDER], { totalRevenue: 1002, paidOrdersCount: 2, testRevenue: 5502, testPaidCount: 2 });
    render(<PaymentsPage />);

    expect(await screen.findByTestId('test-note')).toHaveTextContent('Not counted above: ₹5,502 from 2 test payments');
    expect(screen.getByTestId('total-collected')).toHaveTextContent('₹1,002');
    expect(screen.getByTestId('paid-count')).toHaveTextContent('2');
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
  });

  it('does not crash when the API leaves out a figure', async () => {
    mockOrders([{ ...PAID_ORDER, isTest: true }], { totalRevenue: 0, paidOrdersCount: 0, testPaidCount: 2 });
    render(<PaymentsPage />);

    expect(await screen.findByText('Amit Sharma')).toBeInTheDocument();
    expect(screen.getByTestId('total-collected')).toHaveTextContent('₹0');
    expect(screen.getByTestId('paid-count')).toHaveTextContent('2');
  });

  it('shows ₹0 and no test note when nothing has been paid', async () => {
    mockOrders([], { totalRevenue: 0, paidOrdersCount: 0, testRevenue: 0, testPaidCount: 0 });
    render(<PaymentsPage />);

    expect(await screen.findByText('No payments found.')).toBeInTheDocument();
    expect(screen.getByTestId('total-collected')).toHaveTextContent('₹0');
    expect(screen.queryByTestId('test-note')).not.toBeInTheDocument();
  });

  it('opens full details for a payment', async () => {
    mockOrders([PAID_ORDER]);
    render(<PaymentsPage />);

    fireEvent.click(await screen.findByRole('button', { name: 'Amit Sharma' }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('amit@example.com')).toBeInTheDocument();
    expect(within(dialog).getByText('pay_real_123')).toBeInTheDocument();
    expect(within(dialog).getByText('RCPT-20261030-ABC123')).toBeInTheDocument();
  });

  it('moves between pages', async () => {
    const fetchMock = mockOrders([PAID_ORDER], STATS, 2);
    render(<PaymentsPage />);
    await screen.findByText('Page 1 of 2');

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));

    await waitFor(() => {
      expect(lastUrlTo(fetchMock, '/admin/orders')).toContain('page=2');
    });
  });
});
