import React from 'react';
import { Order } from '../../types';
import { ModalShell } from '../ModalShell';
import { StatusBadge, TestBadge } from './StatusBadge';

export interface PaymentDetailModalProps {
  order: Order;
  onClose: () => void;
}

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 py-2">
    <dt className="text-ink-muted">{label}</dt>
    <dd className="break-words font-medium text-ink">{children}</dd>
  </div>
);

export const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({ order, onClose }) => {
  const { customer } = order;
  const address = [
    customer.address?.street,
    customer.address?.city,
    customer.address?.state,
    customer.address?.postalCode,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <ModalShell title="Payment details" onClose={onClose}>
      <dl className="divide-y divide-ivory-200 px-5 py-2">
        <Row label="Amount">
          <span className="text-xl font-bold text-sindoor-600">₹{order.totalAmount.toLocaleString('en-IN')}</span>
        </Row>
        <Row label="Status">
          <span className="flex items-center gap-2">
            <StatusBadge status={order.status} />
            {order.isTest && <TestBadge />}
          </span>
        </Row>
        <Row label="Date">{new Date(order.createdAt).toLocaleString('en-IN')}</Row>
        <Row label="Product">
          {order.items.map((item) => `${item.productTitle} × ${item.quantity}`).join(', ')}
        </Row>
        <Row label="Name">{customer.name}</Row>
        <Row label="Mobile">
          <a href={`tel:${customer.phone}`} className="underline decoration-brass-500 underline-offset-2">{customer.phone}</a>
        </Row>
        <Row label="Email">
          <a href={`mailto:${customer.email}`} className="underline decoration-brass-500 underline-offset-2">{customer.email}</a>
        </Row>
        {customer.gotra && <Row label="Gotra">{customer.gotra}</Row>}
        {address && <Row label="Address">{address}</Row>}
        <Row label="Order no.">{order.orderNumber}</Row>
        {order.receiptId?.receiptNumber && <Row label="Receipt no.">{order.receiptId.receiptNumber}</Row>}
        {order.razorpayPaymentId && <Row label="Payment ID">{order.razorpayPaymentId}</Row>}
      </dl>
    </ModalShell>
  );
};

export default PaymentDetailModal;
