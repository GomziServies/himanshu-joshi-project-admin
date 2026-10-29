export interface AdminUser {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'admin' | 'devotee' | 'customer';
  phone?: string;
  createdAt?: string;
  isActive?: boolean;
  status?: 'active' | 'suspended';
  ordersCount?: number;
  totalSpent?: number;
}

export type ProductCategory = 'Offering' | 'Puja' | 'Prasad' | 'Seva' | 'Ritual' | string;

export interface Product {
  _id: string;
  title: string;
  slug: string;
  category: ProductCategory;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  shortDescription?: string;
  description: string;
  images: string[];
  featuredImage?: string;
  inStock: boolean;
  stockQuantity?: number;
  isActive: boolean;
  isFeatured?: boolean;
  displayOrder?: number;
  prasadIncludes?: string[];
  ritualsIncluded?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  badgeText?: string;
  displayOrder?: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  product: Product | string;
  title?: string;
  price: number;
  quantity: number;
  image?: string;
  sankalpDevoteeName?: string;
  gotra?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'ritual_scheduled'
  | 'completed'
  | 'cancelled'
  | 'created'
  | 'paid'
  | 'failed';

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    userId?: string;
    name: string;
    email: string;
    phone: string;
    sankalpName: string;
    gotra: string;
    nakshatra?: string;
    ceremonyDate?: string;
    prayerIntention?: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  items: OrderItem[];
  subtotal?: number;
  tax?: number;
  totalAmount: number;
  currency?: string;
  status: OrderStatus;
  orderStatus?: OrderStatus;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  signatureVerified?: boolean;
  receiptNumber?: string;
  receiptId?: string;
  receiptDispatched?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface TransactionReceipt {
  _id: string;
  receiptNumber: string;
  order: string | Order;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  sankalpName: string;
  gotra: string;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  razorpayPaymentId: string;
  razorpayOrderId?: string;
  isImmutable: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  activeProducts: number;
  activeBanners: number;
  totalUsers: number;
}
