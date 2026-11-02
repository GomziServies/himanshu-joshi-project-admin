import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { AdminStats, Order } from '../types';
import { fetchOrders, fetchStats } from '../services/api';
import { ErrorNotice } from '../components/ErrorNotice';
import { PageHeading } from '../components/PageHeading';
import { Diya } from '../components/layout/Ornaments';
import { PaymentDetailModal } from '../components/payments/PaymentDetailModal';
import { StatusBadge, TestBadge } from '../components/payments/StatusBadge';

const FILTERS = [
  { id: 'paid', label: 'Paid', status: 'PAID' },
  { id: 'unpaid', label: 'Not paid', status: 'CREATED,PENDING,FAILED,CANCELLED' },
  { id: 'all', label: 'All', status: '' },
];

const SEARCH_DEBOUNCE_MS = 300;

export const PaymentsPage: React.FC = () => {
  const [filterId, setFilterId] = useState('paid');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);

  const latestRequest = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++latestRequest.current;
    setIsLoading(true);
    setError(null);
    try {
      const status = FILTERS.find((f) => f.id === filterId)?.status;
      const [orderPage, nextStats] = await Promise.all([
        fetchOrders({ status, search, page }),
        fetchStats(),
      ]);
      if (requestId !== latestRequest.current) return; // a newer filter or search has taken over
      setOrders(orderPage.orders);
      setTotalPages(orderPage.totalPages);
      setStats(nextStats);
    } catch (err) {
      if (requestId !== latestRequest.current) return;
      setOrders([]);
      setError((err as Error).message);
    } finally {
      if (requestId === latestRequest.current) setIsLoading(false);
    }
  }, [filterId, search, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const closeDetail = useCallback(() => setSelected(null), []);

  // Before any real payment, show the test amounts (labelled) rather than a confusing ₹0.
  // Once real money arrives the totals count only that, so test money can never inflate them.
  const showingTestTotals = stats !== null && stats.paidOrdersCount === 0 && stats.testPaidCount > 0;
  const collected = stats ? (showingTestTotals ? stats.testRevenue : stats.totalRevenue) : null;
  const paidCount = stats ? (showingTestTotals ? stats.testPaidCount : stats.paidOrdersCount) : null;

  return (
    <div className="space-y-5">
      <PageHeading hindi="भुगतान" title="Payments" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="jaali relative overflow-hidden rounded-2xl bg-sanctum p-5 shadow-sm">
          <p className="flex items-center gap-2 text-ivory-200/80">
            Total collected
            {showingTestTotals && (
              <span className="rounded-full border border-dashed border-brass-400 px-2 text-sm font-medium text-brass-300">Test</span>
            )}
          </p>
          <p className="brass-text mt-1 pb-1 text-4xl font-bold leading-tight" data-testid="total-collected">
            {collected !== null ? `₹${collected.toLocaleString('en-IN')}` : '—'}
          </p>
          <Diya className="absolute bottom-2 right-3 h-16 w-16" />
        </div>
        <div className="rounded-2xl border border-brass-400/50 bg-white p-5 shadow-sm">
          <p className="flex items-center gap-2 text-ink-muted">
            Paid payments
            {showingTestTotals && <TestBadge />}
          </p>
          <p className="mt-1 text-4xl font-bold leading-tight text-ink" data-testid="paid-count">
            {paidCount !== null ? paidCount.toLocaleString('en-IN') : '—'}
          </p>
        </div>
      </div>
      {showingTestTotals && (
        <p className="text-ink-muted" data-testid="test-note">
          These are test payments, so no real money has been received yet.
        </p>
      )}
      {stats && !showingTestTotals && stats.testPaidCount > 0 && (
        <p className="text-ink-muted" data-testid="test-note">
          Not counted above: ₹{stats.testRevenue.toLocaleString('en-IN')} from {stats.testPaidCount} test {stats.testPaidCount === 1 ? 'payment' : 'payments'}.
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex self-start rounded-full border border-brass-400/50 bg-white p-1" role="group" aria-label="Filter payments">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              aria-pressed={filterId === filter.id}
              onClick={() => {
                setFilterId(filter.id);
                setPage(1);
              }}
              className={`rounded-full px-4 py-1 font-medium transition-colors ${
                filterId === filter.id ? 'bg-sanctum text-brass-300' : 'text-ink hover:bg-ivory-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-96">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-muted" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name, mobile, email, payment ID"
            aria-label="Search payments"
            className="input pl-9"
          />
        </div>
      </div>

      {error && <ErrorNotice message={error} onRetry={load} />}

      {!error && (
        <div className="overflow-hidden rounded-2xl border border-brass-400/50 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-ivory-100 text-ink">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Name</th>
                <th scope="col" className="hidden px-4 py-3 font-semibold lg:table-cell">Product</th>
                <th scope="col" className="hidden px-4 py-3 font-semibold md:table-cell">Date</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Amount</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {orders.map((order) => (
                <tr key={order._id} className="transition-colors hover:bg-ivory-50">
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setSelected(order)} className="text-left font-semibold text-ink underline decoration-brass-500/60 underline-offset-2 hover:decoration-marigold-500">
                      {order.customer.name}
                    </button>
                    <p className="text-sm text-ink-muted">{order.customer.phone}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-ink lg:table-cell">
                    {order.items[0]?.productTitle}
                    {order.items.length > 1 && ` +${order.items.length - 1}`}
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-ink-muted md:table-cell">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-sindoor-600">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={order.status} />
                      {order.isTest && <TestBadge />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <p className="px-4 py-12 text-center text-ink-muted">
              {isLoading ? 'Loading payments...' : 'No payments found.'}
            </p>
          )}
        </div>
      )}

      {!error && totalPages > 1 && (
        <div className="flex items-center justify-end gap-3 text-ink">
          <button type="button" className="btn-secondary !px-2.5" disabled={page <= 1 || isLoading} onClick={() => setPage(page - 1)} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span>Page {page} of {totalPages}</span>
          <button type="button" className="btn-secondary !px-2.5" disabled={page >= totalPages || isLoading} onClick={() => setPage(page + 1)} aria-label="Next page">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {selected && <PaymentDetailModal order={selected} onClose={closeDetail} />}
    </div>
  );
};

export default PaymentsPage;
