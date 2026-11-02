import { AdminStats, OrderPage, Product, ProductInput } from '../types';
import { API_BASE, NETWORK_ERROR, adminLogout, getAuthHeader } from './auth';

export * from './auth';

// Every call either returns real server data or throws, so a failure can never look like a success.
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...getAuthHeader(), ...options.headers },
    });
  } catch {
    throw new Error(NETWORK_ERROR);
  }

  const body = await res.json().catch(() => null);

  if (res.status === 401) {
    adminLogout();
    window.location.assign('/');
    throw new Error('Your session has expired. Please log in again.');
  }
  if (!res.ok || !body?.success) {
    throw new Error(body?.message || `Request failed (${res.status}).`);
  }
  return body as T;
}

// Payments
export interface OrderQuery {
  status?: string;
  search?: string;
  page?: number;
}

export async function fetchOrders({ status, search, page = 1 }: OrderQuery): Promise<OrderPage> {
  const params = new URLSearchParams({ page: String(page), limit: '20' });
  if (status) params.set('status', status);
  if (search) params.set('search', search);

  const body = await request<{
    data: OrderPage['orders'];
    pagination: { total: number; totalPages: number };
  }>(`/admin/orders?${params.toString()}`);

  return {
    orders: body.data,
    total: body.pagination.total,
    totalPages: body.pagination.totalPages,
  };
}

export async function fetchStats(): Promise<AdminStats> {
  const body = await request<{ data: Partial<AdminStats> }>('/admin/stats');
  // A missing figure (e.g. an older API still running) must not take the whole page down
  return {
    totalRevenue: body.data.totalRevenue ?? 0,
    paidOrdersCount: body.data.paidOrdersCount ?? 0,
    testRevenue: body.data.testRevenue ?? 0,
    testPaidCount: body.data.testPaidCount ?? 0,
  };
}

// Products
export async function fetchProducts(): Promise<Product[]> {
  const body = await request<{ data: Product[] }>('/admin/products?limit=100');
  return body.data;
}

export async function createProduct(product: ProductInput): Promise<Product> {
  const body = await request<{ data: Product }>('/admin/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
  return body.data;
}

export async function updateProduct(id: string, product: Partial<ProductInput>): Promise<Product> {
  const body = await request<{ data: Product }>(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });
  return body.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await request(`/admin/products/${id}`, { method: 'DELETE' });
}
