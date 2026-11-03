export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  price: number;
  description: string;
  shortDescription?: string;
  images: string[];
  featuredImage?: string;
  isActive: boolean;
  prasadIncludes?: string[];
}

export type ProductInput = Pick<
  Product,
  'title' | 'price' | 'description' | 'shortDescription' | 'images' | 'featuredImage' | 'isActive' | 'prasadIncludes'
>;

export type OrderStatus = 'CREATED' | 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export interface OrderItem {
  productTitle: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  isTest?: boolean;
  razorpayPaymentId?: string | null;
  razorpayOrderId?: string | null;
  receiptId?: { receiptNumber: string } | null;
  createdAt: string;
}

export interface OrderPage {
  orders: Order[];
  total: number;
  totalPages: number;
}

export interface AdminStats {
  totalRevenue: number;
  paidOrdersCount: number;
  testRevenue: number;
  testPaidCount: number;
}
