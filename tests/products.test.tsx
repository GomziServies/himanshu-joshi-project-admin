import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { ProductsPage } from '../src/pages/ProductsPage';
import { callsTo, mockApi } from './helpers';

const SHIVLING = {
  _id: 'product_1',
  title: 'Salahkareshwar Mahadev Shivling',
  slug: 'salahkareshwar-shivling',
  price: 501,
  description: 'A Shivling blessed at the temple.',
  images: ['/salahkareshwar-shivling.jpg'],
  featuredImage: '/salahkareshwar-shivling.jpg',
  isActive: true,
  prasadIncludes: ['Sankalp in your name'],
};

function fillNewProduct() {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Small Shivling' } });
  fireEvent.change(screen.getByLabelText('Price (₹)'), { target: { value: '251' } });
  fireEvent.change(screen.getByLabelText('Description'), { target: { value: '  A small Shivling.  ' } });
}

describe('Products page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('lists products from the API', async () => {
    mockApi({ 'GET /admin/products': () => ({ body: { success: true, data: [SHIVLING] } }) });
    render(<ProductsPage />);

    expect(await screen.findByText(SHIVLING.title)).toBeInTheDocument();
    expect(screen.getByText('₹501')).toBeInTheDocument();
    expect(screen.getByText(/On website/)).toBeInTheDocument();
  });

  it('shows an error and no invented products when the API is down', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch')) as unknown as typeof fetch;
    render(<ProductsPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/Cannot reach the server/);
    expect(screen.queryByText(/Shivling/)).not.toBeInTheDocument();
  });

  it('adds a product and sends it to the server', async () => {
    const fetchMock = mockApi({
      'GET /admin/products': () => ({ body: { success: true, data: [SHIVLING] } }),
      'POST /admin/products': (init) => ({
        status: 201,
        body: { success: true, data: { ...JSON.parse(String(init?.body)), _id: 'product_2', slug: 'small-shivling' } },
      }),
    });
    render(<ProductsPage />);
    await screen.findByText(SHIVLING.title);

    fireEvent.click(screen.getByRole('button', { name: 'Add product' }));
    fillNewProduct();
    fireEvent.change(screen.getByLabelText(/What's included/), { target: { value: 'One Shivling\n\n Receipt ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save product' }));

    expect(await screen.findByText('Small Shivling')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const sent = JSON.parse(String(callsTo(fetchMock, 'POST', '/admin/products')[0][1]?.body));
    expect(sent).toMatchObject({
      title: 'Small Shivling',
      price: 251,
      description: 'A small Shivling.',
      prasadIncludes: ['One Shivling', 'Receipt'],
      isActive: true,
    });
  });

  it('keeps the form open with the server message when saving fails', async () => {
    mockApi({
      'GET /admin/products': () => ({ body: { success: true, data: [] } }),
      'POST /admin/products': () => ({ status: 400, body: { success: false, message: 'Validation failure: bad data' } }),
    });
    render(<ProductsPage />);
    await screen.findByText('No products yet.');

    fireEvent.click(screen.getByRole('button', { name: 'Add product' }));
    fillNewProduct();
    fireEvent.click(screen.getByRole('button', { name: 'Save product' }));

    const dialog = screen.getByRole('dialog');
    expect(await within(dialog).findByRole('alert')).toHaveTextContent('Validation failure: bad data');
    expect(screen.queryByText('Small Shivling')).not.toBeInTheDocument();
    expect(screen.getByText('No products yet.')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Save product' })).toBeEnabled();
  });

  it('rejects a price below ₹1 without calling the server', async () => {
    const fetchMock = mockApi({ 'GET /admin/products': () => ({ body: { success: true, data: [] } }) });
    render(<ProductsPage />);
    await screen.findByText('No products yet.');

    fireEvent.click(screen.getByRole('button', { name: 'Add product' }));
    fillNewProduct();
    fireEvent.change(screen.getByLabelText('Price (₹)'), { target: { value: '0' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Save product' }).closest('form')!);

    expect(await screen.findByRole('alert')).toHaveTextContent('at least ₹1');
    expect(callsTo(fetchMock, 'POST', '/admin/products')).toHaveLength(0);
  });

  it('edits a product, including hiding it from the website', async () => {
    const fetchMock = mockApi({
      'GET /admin/products': () => ({ body: { success: true, data: [SHIVLING] } }),
      'PUT /admin/products/product_1': (init) => ({
        body: { success: true, data: { ...SHIVLING, ...JSON.parse(String(init?.body)) } },
      }),
    });
    render(<ProductsPage />);

    fireEvent.click(await screen.findByRole('button', { name: `Edit ${SHIVLING.title}` }));
    expect(screen.getByLabelText('Price (₹)')).toHaveValue(501);
    fireEvent.change(screen.getByLabelText('Price (₹)'), { target: { value: '701' } });
    fireEvent.click(screen.getByLabelText('Show on website'));
    fireEvent.click(screen.getByRole('button', { name: 'Save product' }));

    expect(await screen.findByText('₹701')).toBeInTheDocument();
    expect(screen.getByText(/Hidden/)).toBeInTheDocument();
    const sent = JSON.parse(String(callsTo(fetchMock, 'PUT', 'product_1')[0][1]?.body));
    expect(sent).toMatchObject({ price: 701, isActive: false });
  });

  it('deletes only after confirmation', async () => {
    const fetchMock = mockApi({
      'GET /admin/products': () => ({ body: { success: true, data: [SHIVLING] } }),
      'DELETE /admin/products/product_1': () => ({ body: { success: true } }),
    });
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<ProductsPage />);

    const deleteBtn = await screen.findByRole('button', { name: `Delete ${SHIVLING.title}` });
    fireEvent.click(deleteBtn);
    expect(callsTo(fetchMock, 'DELETE', 'product_1')).toHaveLength(0);
    expect(screen.getByText(SHIVLING.title)).toBeInTheDocument();

    confirmSpy.mockReturnValue(true);
    fireEvent.click(deleteBtn);
    await waitFor(() => expect(screen.queryByText(SHIVLING.title)).not.toBeInTheDocument());
    expect(callsTo(fetchMock, 'DELETE', 'product_1')).toHaveLength(1);
  });

  it('keeps the product and shows the error when delete fails', async () => {
    mockApi({
      'GET /admin/products': () => ({ body: { success: true, data: [SHIVLING] } }),
      'DELETE /admin/products/product_1': () => ({ status: 500, body: { success: false, message: 'Delete failed' } }),
    });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<ProductsPage />);

    fireEvent.click(await screen.findByRole('button', { name: `Delete ${SHIVLING.title}` }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Delete failed');
    expect(screen.getByText(SHIVLING.title)).toBeInTheDocument();
  });
});
