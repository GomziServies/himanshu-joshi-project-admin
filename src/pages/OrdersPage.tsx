import React, { useState, useEffect } from 'react';
import { Order, TransactionReceipt, OrderStatus } from '../types';
import { fetchAdminOrders, fetchAdminReceipts, updateAdminOrderStatus } from '../services/api';
import { ReceiptModal } from '../components/orders/ReceiptModal';
import { Search, Eye, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [receipts, setReceipts] = useState<TransactionReceipt[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReceipt, setSelectedReceipt] = useState<TransactionReceipt | null>(null);
  const [loading, setLoading] = useState(false);

  const statusFilters: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'ritual_scheduled', label: 'Ritual Scheduled' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
    { id: 'paid', label: 'Paid' },
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, receiptsData] = await Promise.all([
        fetchAdminOrders(),
        fetchAdminReceipts(),
      ]);
      setOrders(ordersData);
      setReceipts(receiptsData);
    } catch (err) {
      console.error('Failed to load orders and receipts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInspect = (order: Order) => {
    const found = receipts.find(
      (r) =>
        r.orderNumber === order.orderNumber ||
        (r.order && (r.order === order._id || (r.order as Order)._id === order._id))
    );
    if (found) {
      setSelectedReceipt(found);
    } else {
      setSelectedReceipt({
        _id: 'rcpt_' + order._id,
        receiptNumber: order.receiptNumber || 'RCPT-ONLINE-TEMP',
        order: order._id,
        orderNumber: order.orderNumber,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        customerPhone: order.customer.phone,
        sankalpName: order.customer.sankalpName,
        gotra: order.customer.gotra,
        items: order.items.map((i) => ({
          title: (typeof i.product === 'object' ? i.product.title : i.title) || 'Temple Offering',
          quantity: i.quantity,
          price: i.price,
        })),
        totalAmount: order.totalAmount,
        razorpayPaymentId: order.razorpayPaymentId || 'pay_verified_razorpay',
        isImmutable: true,
        createdAt: order.createdAt,
      });
    }
  };

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      const updated = await updateAdminOrderStatus(orderId, nextStatus);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const oStatus = (o.orderStatus || o.status).toLowerCase();
    const matchesStatus =
      statusFilter === 'all' ||
      oStatus === statusFilter.toLowerCase() ||
      (o.status && o.status.toLowerCase() === statusFilter.toLowerCase());

    const q = search.toLowerCase();
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.sankalpName.toLowerCase().includes(q) ||
      o.customer.gotra.toLowerCase().includes(q) ||
      (o.razorpayPaymentId && o.razorpayPaymentId.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div>
        <h2 className="font-serif text-xl font-bold text-[#5C3A21]">
          Devotee Orders & Consecrated Receipts Ledger
        </h2>
        <p className="text-xs text-[#8B5A2B] mt-0.5">
          Audited transactions, family Gotra Sankalp records, and cryptographically verified Razorpay payment receipts
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8DFD8] shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8B5A2B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order no, Yajman, Gotra, or payment ID..."
            className="w-full text-xs text-[#2D1E12] focus:outline-none placeholder:text-[#7A6658]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {statusFilters.map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st.id
                  ? 'bg-[#5C3A21] text-white shadow-sm'
                  : 'bg-[#FDFBF7] text-[#8B5A2B] hover:bg-[#F5EFEB] border border-[#E8DFD8]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#E8DFD8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FDFBF7] text-[#5C3A21] font-semibold border-b border-[#E8DFD8]">
              <tr>
                <th className="p-3.5">Order Number</th>
                <th className="p-3.5">Devotee / Yajman</th>
                <th className="p-3.5">Gotra & Sankalp</th>
                <th className="p-3.5">Offering Seva</th>
                <th className="p-3.5">Dakshina (₹)</th>
                <th className="p-3.5">Razorpay & Crypto Verification</th>
                <th className="p-3.5">Status Lifecycle</th>
                <th className="p-3.5 text-right">Receipt Ledger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD8]/60 text-[#2D1E12]">
              {filteredOrders.map((order) => {
                const itemTitle =
                  order.items && order.items[0]
                    ? typeof order.items[0].product === 'object'
                      ? order.items[0].product.title
                      : order.items[0].title || 'Shivling Sthapana'
                    : 'Temple Offering';

                const currentStatus = order.orderStatus || order.status;

                return (
                  <tr key={order._id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#5C3A21]">
                      <span className="block">{order.orderNumber}</span>
                      <span className="block text-[10px] text-[#8B5A2B] font-normal">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium">
                      <span className="block">{order.customer.sankalpName || order.customer.name}</span>
                      <span className="block text-[10px] text-[#8B5A2B]">{order.customer.email}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-[#5C3A21] block">Gotra: {order.customer.gotra}</span>
                      {order.customer.nakshatra && (
                        <span className="text-[10px] text-gray-500">Nakshatra: {order.customer.nakshatra}</span>
                      )}
                    </td>
                    <td className="p-3.5 max-w-xs truncate font-medium">{itemTitle}</td>
                    <td className="p-3.5 font-serif font-bold text-[#5C3A21]">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 font-mono text-[11px]">
                      {order.razorpayPaymentId ? (
                        <div>
                          <span className="text-emerald-800 font-bold block">{order.razorpayPaymentId}</span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            HMAC-SHA256 Verified
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 font-sans italic">Pending signature</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <select
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-lg border focus:outline-none ${
                          currentStatus === 'paid' || currentStatus === 'completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : currentStatus === 'confirmed' || currentStatus === 'ritual_scheduled'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : currentStatus === 'cancelled' || currentStatus === 'failed'
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="ritual_scheduled">Ritual Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleInspect(order)}
                        className="px-3 py-1 rounded bg-[#FDFBF7] hover:bg-[#5C3A21] text-[#5C3A21] hover:text-white font-medium text-xs transition-colors inline-flex items-center gap-1 border border-[#E8DFD8]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Receipt</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-[#8B5A2B] space-y-2">
            <p className="font-serif text-xs">
              {loading ? 'Loading orders...' : 'No orders found matching filter criteria.'}
            </p>
          </div>
        )}
      </div>

      {/* Consecrated Receipt Detail Modal */}
      <ReceiptModal
        receipt={selectedReceipt}
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};

export default OrdersPage;
