import React from 'react';
import { OrderStatus } from '../../types';

const NOT_PAID = 'bg-ivory-200 text-ink';
const STOPPED = 'bg-sindoor-500/10 text-sindoor-600';

const STATUS: Record<OrderStatus, { label: string; className: string }> = {
  PAID: { label: 'Paid', className: 'bg-leaf-100 text-leaf-700' },
  CREATED: { label: 'Not paid', className: NOT_PAID },
  PENDING: { label: 'Not paid', className: NOT_PAID },
  FAILED: { label: 'Failed', className: STOPPED },
  CANCELLED: { label: 'Cancelled', className: STOPPED },
  REFUNDED: { label: 'Refunded', className: NOT_PAID },
};

export const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const { label, className } = STATUS[status] ?? STATUS.CREATED;
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm font-semibold ${className}`}>
      {label}
    </span>
  );
};

export const TestBadge: React.FC = () => (
  <span className="inline-block rounded-full border border-dashed border-brass-600 px-2 py-0.5 text-sm font-medium text-brass-700">
    Test
  </span>
);

export default StatusBadge;
