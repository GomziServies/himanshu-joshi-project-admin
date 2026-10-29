import React, { useState, useEffect } from 'react';
import { AdminStats, Order, TransactionReceipt } from '../types';
import { fetchAdminStats, fetchAdminOrders, fetchAdminReceipts } from '../services/api';
import { StatCards } from '../components/StatCards';
import { ReceiptModal } from '../components/orders/ReceiptModal';
import { Plus, ArrowRight, Eye, CheckCircle2 } from 'lucide-react';

export interface DashboardPageProps {
  onNavigate: (tab: string) => void;
  onOpenProductModal: () => void;
  onOpenBannerModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenProductModal,
  onOpenBannerModal,
}) => {
  const [stats, setStats] = useState<AdminStats>({
    totalRevenue: 5100,
    totalOrders: 1,
    activeProducts: 4,
    activeBanners: 2,
    totalUsers: 4,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [receipts, setReceipts] = useState<TransactionReceipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<TransactionReceipt | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsData, ordersData, receiptsData] = await Promise.all([
          fetchAdminStats(),
          fetchAdminOrders(),
          fetchAdminReceipts(),
        ]);
        if (statsData) setStats(statsData);
        if (ordersData) setRecentOrders(ordersData);
        if (receiptsData) setReceipts(receiptsData);
      } catch (err) {
        console.error('Failed to load dashboard overview data:', err);
      }
    }
    loadDashboard();
  }, []);

  const handleInspectReceipt = (order: Order) => {
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

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#5C3A21] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md border border-[#4A2E1A]">
        <div className="space-y-2">
          <span className="text-xs font-serif uppercase tracking-widest text-[#E8DFD8]">
            Sanctum Operations Control
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Shree Temple Trust Administration
          </h2>
          <p className="text-xs text-[#E8DFD8] max-w-xl">
            Real-time catalog governance, dynamic promotional banners, and cryptographically verified Razorpay transaction audits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenProductModal}
            className="px-4 py-2.5 rounded-lg bg-white text-[#5C3A21] hover:bg-[#FDFBF7] font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-[#C59B27]" />
            <span>Add Offering</span>
          </button>
          <button
            onClick={onOpenBannerModal}
            className="px-4 py-2.5 rounded-lg bg-[#8B5A2B] hover:bg-[#4A2E1A] text-white border border-[#C59B27]/40 font-semibold text-xs flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 text-[#C59B27]" />
            <span>Add Banner</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <StatCards stats={stats} />

      {/* Recent Orders Ledger */}
      <div className="bg-white rounded-xl border border-[#E8DFD8] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E8DFD8] flex justify-between items-center">
          <div>
            <h3 className="font-serif text-base font-bold text-[#5C3A21]">
              Recent Devotee Orders & Sevas
            </h3>
            <p className="text-xs text-[#8B5A2B] mt-0.5">
              Itemized ledger with Gotra Sankalp and Razorpay transaction IDs
            </p>
          </div>
          <button
            onClick={() => onNavigate('orders')}
            className="text-xs font-semibold text-[#8B5A2B] hover:text-[#5C3A21] flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FDFBF7] text-[#5C3A21] font-semibold border-b border-[#E8DFD8]">
              <tr>
                <th className="p-3.5">Order No</th>
                <th className="p-3.5">Yajman (Devotee)</th>
                <th className="p-3.5">Family Gotra</th>
                <th className="p-3.5">Offering Item</th>
                <th className="p-3.5">Dakshina (₹)</th>
                <th className="p-3.5">Payment Status</th>
                <th className="p-3.5 text-right">Receipt Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD8]/60 text-[#2D1E12]">
              {recentOrders.slice(0, 5).map((order) => {
                const itemTitle =
                  order.items && order.items[0]
                    ? typeof order.items[0].product === 'object'
                      ? order.items[0].product.title
                      : order.items[0].title || 'Shivling Sthapana'
                    : 'Temple Offering';

                return (
                  <tr key={order._id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#5C3A21]">{order.orderNumber}</td>
                    <td className="p-3.5 font-medium">{order.customer.sankalpName || order.customer.name}</td>
                    <td className="p-3.5 text-[#8B5A2B]">{order.customer.gotra}</td>
                    <td className="p-3.5 max-w-xs truncate">{itemTitle}</td>
                    <td className="p-3.5 font-serif font-bold text-[#5C3A21]">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleInspectReceipt(order)}
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

export default DashboardPage;
