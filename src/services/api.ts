import {
  AdminUser,
  Product,
  Banner,
  Order,
  TransactionReceipt,
  AdminStats,
  OrderStatus,
} from '../types';
import { getAuthHeader, adminLogout } from './auth';

export * from './auth';

const API_BASE =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api';

// Handle 401 Unauthorized globally
function handleAuthStatus(res: Response): void {
  if (res.status === 401) {
    adminLogout();
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/';
    }
  }
}

// Resilient initial/fallback dataset
export const FALLBACK_PRODUCTS: Product[] = [
  {
    _id: 'prod_admin_1',
    title: 'Shivling Sthapana & Rudrabhishek Offering',
    slug: 'shivling-sthapana',
    category: 'Offering',
    subtitle: 'Sacred Narmadeshwar Shivling Consecration with Vedic Pran Pratishtha & Bilva Abhishek',
    price: 5100,
    originalPrice: 7100,
    shortDescription: 'Consecrate your sacred home temple with an authentic Narmadeshwar Shivling installed with Vedic rituals.',
    description: 'The sacred Shivling Sthapana is performed according to Shiva Agamas. Includes consecrated Narmadeshwar Shivling from the Narmada riverbed, solid brass Yoni Peeth, and full Sankalp Puja.',
    images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?q=80&w=800&auto=format&fit=crop'],
    featuredImage: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?q=80&w=800&auto=format&fit=crop',
    inStock: true,
    stockQuantity: 108,
    isActive: true,
    isFeatured: true,
    displayOrder: 1,
    prasadIncludes: [
      'Consecrated Narmadeshwar Shivling (3 inches)',
      'Handcrafted Brass Yoni Peeth & Jaladhari',
      'Sanctum Mahakal Bhasma & holy Gangajal',
      'Rudraksha Mala (108 beads) blessed in sanctum',
      'Laminated Bhojpatra Mahamrityunjaya Yantra'
    ],
    ritualsIncluded: [
      'Ganpati & Kalash Sthapana',
      'Vedic Pran Pratishtha Vidhi',
      '11 Rudra Panchamrit Abhishek',
      '108 Bilva Patra Archana with Yajman Gotra Sankalp',
      'Maha Mangal Aarti & Pushpanjali'
    ],
    createdAt: '2026-10-25T08:00:00Z',
    updatedAt: '2026-10-29T10:00:00Z'
  },
  {
    _id: 'prod_admin_2',
    title: 'Maha Rudrabhishek & 108 Bilva Archana',
    slug: 'rudrabhishek-puja',
    category: 'Puja',
    subtitle: 'Elaborate Rudra Chanting for Family Health and Peace',
    price: 2100,
    originalPrice: 3100,
    shortDescription: 'Dedicated Rudrabhishek Seva performed by two Vedic scholars chanting Sri Rudram and Chamakam.',
    description: 'Detailed Vedic ceremony to invoke Lord Shiva’s grace, absolving doshas and bringing prosperity.',
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop'],
    featuredImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
    inStock: true,
    stockQuantity: 500,
    isActive: true,
    isFeatured: true,
    displayOrder: 2,
    prasadIncludes: ['Panchamrit Prasad', 'Blessed Bhasma', 'Raksha Sutra'],
    ritualsIncluded: ['Sri Rudram recitation', 'Bilva Archana', 'Aarti'],
    createdAt: '2026-10-26T08:00:00Z',
    updatedAt: '2026-10-29T10:00:00Z'
  },
  {
    _id: 'prod_admin_3',
    title: 'Mahaprasad Sanctum Bhog Seva',
    slug: 'mahaprasad-bhog-seva',
    category: 'Prasad',
    subtitle: 'Sacred Laddu and Panchmeva consecrated during Sandhya Aarti',
    price: 1100,
    originalPrice: 1500,
    shortDescription: 'Pure desi ghee Prasad box delivered directly to devotee doorstep after temple consecration.',
    description: 'Prepared in the temple trust sanctum kitchen with pure cow ghee and Vedic cleanliness.',
    images: ['https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=800&auto=format&fit=crop'],
    featuredImage: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=800&auto=format&fit=crop',
    inStock: true,
    stockQuantity: 250,
    isActive: true,
    isFeatured: false,
    displayOrder: 3,
    prasadIncludes: ['500g Desi Ghee Besan Laddu', 'Panchmeva packet', 'Temple Ittar'],
    ritualsIncluded: ['Sandhya Bhog offering', 'Prasad consecration'],
    createdAt: '2026-10-27T08:00:00Z',
    updatedAt: '2026-10-29T10:00:00Z'
  },
  {
    _id: 'prod_admin_4',
    title: 'Vedic Navgrah Shanti Havan Ritual',
    slug: 'navgrah-shanti-havan',
    category: 'Ritual',
    subtitle: 'Planetary peace and obstacle removal Vedic Yajna',
    price: 7500,
    originalPrice: 9500,
    shortDescription: 'Elaborate 9-planet fire oblation performed at sanctum yajnashala.',
    description: 'Conducted with authentic Samidha, Navgrah wood, and sacred Ghee for planetary alignment.',
    images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?q=80&w=800&auto=format&fit=crop'],
    featuredImage: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?q=80&w=800&auto=format&fit=crop',
    inStock: true,
    stockQuantity: 50,
    isActive: true,
    isFeatured: true,
    displayOrder: 4,
    prasadIncludes: ['Yajna Bhasma', 'Navgrah Raksha Yantra'],
    ritualsIncluded: ['Navgrah Ahuti', 'Purnahuti', 'Kashi Brahmin Dakshina'],
    createdAt: '2026-10-28T08:00:00Z',
    updatedAt: '2026-10-29T10:00:00Z'
  }
];

export const FALLBACK_BANNERS: Banner[] = [
  {
    _id: 'banner_admin_1',
    title: 'Maha Shivling Sthapana & Vedic Abhishek',
    subtitle: 'Invite Divine Auspiciousness with consecrated Narmadeshwar Shivling and home Pran Pratishtha',
    imageUrl: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?q=80&w=1200&auto=format&fit=crop',
    ctaText: 'Book Shivling Seva',
    ctaLink: '#offerings-catalog',
    badgeText: 'Sacred Consecration Offering',
    displayOrder: 1,
    isActive: true,
    createdAt: '2026-10-25T08:00:00Z'
  },
  {
    _id: 'banner_admin_2',
    title: 'Shravan Somwar Special Rudrabhishek',
    subtitle: 'Perform laghu-rudra archana in your family Gotra at Dashashwamedh Sanctum',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop',
    ctaText: 'Explore Offerings',
    ctaLink: '#offerings-catalog',
    badgeText: 'Auspicious Month Seva',
    displayOrder: 2,
    isActive: true,
    createdAt: '2026-10-26T08:00:00Z'
  },
  {
    _id: 'banner_admin_3',
    title: 'Vedic Sanctum Renovation & Nandi Dhwaj Seva',
    subtitle: 'Participate in sacred temple restoration and receive perpetual Gotra prayer blessings',
    imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=1200&auto=format&fit=crop',
    ctaText: 'Contribute Seva',
    ctaLink: '#trust-donations',
    badgeText: 'Trust Renovation Seva',
    displayOrder: 3,
    isActive: false,
    createdAt: '2026-10-27T08:00:00Z'
  }
];

export const FALLBACK_USERS: AdminUser[] = [
  {
    id: 'usr_admin_1',
    name: 'Sanctum Administrator',
    email: 'admin@temple.org',
    role: 'admin',
    phone: '+91 98765 43210',
    createdAt: '2026-10-01T08:00:00Z',
    status: 'active',
    isActive: true,
    ordersCount: 0,
    totalSpent: 0
  },
  {
    id: 'usr_devotee_1',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@example.com',
    role: 'devotee',
    phone: '+91 91234 56789',
    createdAt: '2026-10-15T08:00:00Z',
    status: 'active',
    isActive: true,
    ordersCount: 3,
    totalSpent: 12300
  },
  {
    id: 'usr_devotee_2',
    name: 'Sunita Mehra',
    email: 'sunita.mehra@example.com',
    role: 'devotee',
    phone: '+91 98111 22334',
    createdAt: '2026-10-20T08:00:00Z',
    status: 'active',
    isActive: true,
    ordersCount: 1,
    totalSpent: 5100
  },
  {
    id: 'usr_devotee_3',
    name: 'Anand Mishra',
    email: 'anand.mishra@example.com',
    role: 'devotee',
    phone: '+91 99887 76655',
    createdAt: '2026-10-24T08:00:00Z',
    status: 'active',
    isActive: true,
    ordersCount: 2,
    totalSpent: 7200
  }
];

export const FALLBACK_ORDERS: Order[] = [
  {
    _id: 'ord_demo_1',
    orderNumber: 'ORD-20261029-7892',
    customer: {
      userId: 'usr_devotee_1',
      name: 'Rajesh Sharma',
      email: 'rajesh.sharma@example.com',
      phone: '+91 98765 43210',
      sankalpName: 'Rajesh Sharma & Family',
      gotra: 'Kashyapa',
      nakshatra: 'Rohini',
      ceremonyDate: '2026-11-04',
      prayerIntention: 'Family Health and Prosperity',
      address: {
        street: '104 Shankara Enclave, Sigra',
        city: 'Varanasi',
        state: 'Uttar Pradesh',
        postalCode: '221002',
        country: 'India'
      }
    },
    items: [
      {
        product: FALLBACK_PRODUCTS[0],
        title: 'Shivling Sthapana & Rudrabhishek Offering',
        price: 5100,
        quantity: 1,
        sankalpDevoteeName: 'Rajesh Sharma',
        gotra: 'Kashyapa'
      }
    ],
    totalAmount: 5100,
    status: 'paid',
    orderStatus: 'confirmed',
    paymentStatus: 'paid',
    razorpayOrderId: 'order_RZP2026102901',
    razorpayPaymentId: 'pay_RZP9876543210',
    razorpaySignature: 'a7b3c9d2e1f4088923412abcdef1234567890abcdef1234567890abcdef1234',
    signatureVerified: true,
    receiptNumber: 'RCPT-20261029-7892',
    receiptDispatched: true,
    createdAt: '2026-10-29T08:15:00Z'
  },
  {
    _id: 'ord_demo_2',
    orderNumber: 'ORD-20261028-3419',
    customer: {
      userId: 'usr_devotee_2',
      name: 'Sunita Mehra',
      email: 'sunita.mehra@example.com',
      phone: '+91 98111 22334',
      sankalpName: 'Sunita & Vikram Mehra',
      gotra: 'Vashishta',
      nakshatra: 'Pushya',
      ceremonyDate: '2026-11-02',
      prayerIntention: 'Children Education & Peace',
      address: {
        street: 'Flat 402, Ganga Heights',
        city: 'Prayagraj',
        state: 'Uttar Pradesh',
        postalCode: '211001',
        country: 'India'
      }
    },
    items: [
      {
        product: FALLBACK_PRODUCTS[1],
        title: 'Maha Rudrabhishek & 108 Bilva Archana',
        price: 2100,
        quantity: 1,
        sankalpDevoteeName: 'Sunita Mehra',
        gotra: 'Vashishta'
      }
    ],
    totalAmount: 2100,
    status: 'confirmed',
    orderStatus: 'confirmed',
    paymentStatus: 'paid',
    razorpayOrderId: 'order_RZP2026102802',
    razorpayPaymentId: 'pay_RZP8877665544',
    razorpaySignature: 'f9e8d7c6b5a41234567890abcdef1234567890abcdef1234567890abcdef1234',
    signatureVerified: true,
    receiptNumber: 'RCPT-20261028-3419',
    receiptDispatched: true,
    createdAt: '2026-10-28T14:30:00Z'
  },
  {
    _id: 'ord_demo_3',
    orderNumber: 'ORD-20261027-1102',
    customer: {
      userId: 'usr_devotee_3',
      name: 'Anand Mishra',
      email: 'anand.mishra@example.com',
      phone: '+91 99887 76655',
      sankalpName: 'Anand Mishra & Family',
      gotra: 'Bharadwaja',
      address: {
        street: '12 Temple View Lane',
        city: 'Haridwar',
        state: 'Uttarakhand',
        postalCode: '249401',
        country: 'India'
      }
    },
    items: [
      {
        product: FALLBACK_PRODUCTS[2],
        title: 'Mahaprasad Sanctum Bhog Seva',
        price: 1100,
        quantity: 2
      }
    ],
    totalAmount: 2200,
    status: 'ritual_scheduled',
    orderStatus: 'ritual_scheduled',
    paymentStatus: 'paid',
    razorpayOrderId: 'order_RZP2026102703',
    razorpayPaymentId: 'pay_RZP7766554433',
    signatureVerified: true,
    receiptNumber: 'RCPT-20261027-1102',
    receiptDispatched: true,
    createdAt: '2026-10-27T11:00:00Z'
  }
];

export const FALLBACK_RECEIPTS: TransactionReceipt[] = [
  {
    _id: 'rcpt_demo_1',
    receiptNumber: 'RCPT-20261029-7892',
    order: 'ord_demo_1',
    orderNumber: 'ORD-20261029-7892',
    customerName: 'Rajesh Sharma',
    customerEmail: 'rajesh.sharma@example.com',
    customerPhone: '+91 98765 43210',
    sankalpName: 'Rajesh Sharma & Family',
    gotra: 'Kashyapa',
    items: [
      {
        title: 'Shivling Sthapana & Rudrabhishek Offering',
        quantity: 1,
        price: 5100
      }
    ],
    totalAmount: 5100,
    razorpayPaymentId: 'pay_RZP9876543210',
    razorpayOrderId: 'order_RZP2026102901',
    isImmutable: true,
    createdAt: '2026-10-29T08:15:00Z'
  },
  {
    _id: 'rcpt_demo_2',
    receiptNumber: 'RCPT-20261028-3419',
    order: 'ord_demo_2',
    orderNumber: 'ORD-20261028-3419',
    customerName: 'Sunita Mehra',
    customerEmail: 'sunita.mehra@example.com',
    customerPhone: '+91 98111 22334',
    sankalpName: 'Sunita & Vikram Mehra',
    gotra: 'Vashishta',
    items: [
      {
        title: 'Maha Rudrabhishek & 108 Bilva Archana',
        quantity: 1,
        price: 2100
      }
    ],
    totalAmount: 2100,
    razorpayPaymentId: 'pay_RZP8877665544',
    razorpayOrderId: 'order_RZP2026102802',
    isImmutable: true,
    createdAt: '2026-10-28T14:30:00Z'
  }
];

// Stats
export async function fetchAdminStats(): Promise<AdminStats> {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { ...getAuthHeader() }
    });
    handleAuthStatus(res);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('Backend stats endpoint unavailable, computing local fallback', err);
  }

  const revenue = FALLBACK_ORDERS.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  return {
    totalRevenue: revenue,
    totalOrders: FALLBACK_ORDERS.length,
    activeProducts: FALLBACK_PRODUCTS.filter((p) => p.isActive).length,
    activeBanners: FALLBACK_BANNERS.filter((b) => b.isActive).length,
    totalUsers: FALLBACK_USERS.length
  };
}

// Products
export async function fetchAdminProducts(category?: string, search?: string): Promise<Product[]> {
  try {
    let url = `${API_BASE}/admin/products`;
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, {
      headers: { ...getAuthHeader() }
    });
    handleAuthStatus(res);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('Backend products endpoint unavailable, using fallback', err);
  }

  let result = [...FALLBACK_PRODUCTS];
  if (category && category !== 'all') {
    result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }
  return result;
}

export async function createAdminProduct(product: Partial<Product>): Promise<Product> {
  try {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(product)
    });
    handleAuthStatus(res);
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.warn('Backend create product endpoint unavailable, saving locally', err);
  }

  const newProd: Product = {
    _id: 'prod_' + Date.now(),
    title: product.title || 'Untitled Offering',
    slug: product.slug || 'offering-' + Date.now(),
    category: product.category || 'Offering',
    subtitle: product.subtitle || '',
    price: product.price || 0,
    originalPrice: product.originalPrice,
    shortDescription: product.shortDescription || '',
    description: product.description || '',
    images: product.images && product.images.length ? product.images : [product.featuredImage || ''],
    featuredImage: product.featuredImage || (product.images ? product.images[0] : ''),
    inStock: product.inStock !== false,
    stockQuantity: product.stockQuantity ?? 100,
    isActive: product.isActive !== false,
    isFeatured: !!product.isFeatured,
    displayOrder: product.displayOrder || 1,
    prasadIncludes: product.prasadIncludes || [],
    ritualsIncluded: product.ritualsIncluded || [],
    createdAt: new Date().toISOString()
  };
  FALLBACK_PRODUCTS.unshift(newProd);
  return newProd;
}

export async function updateAdminProduct(id: string, product: Partial<Product>): Promise<Product> {
  try {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(product)
    });
    handleAuthStatus(res);
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.warn('Backend update product endpoint unavailable, updating locally', err);
  }

  const idx = FALLBACK_PRODUCTS.findIndex((p) => p._id === id);
  if (idx !== -1) {
    FALLBACK_PRODUCTS[idx] = { ...FALLBACK_PRODUCTS[idx], ...product, updatedAt: new Date().toISOString() };
    return FALLBACK_PRODUCTS[idx];
  }
  return { ...product, _id: id } as Product;
}

export async function deleteAdminProduct(id: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    handleAuthStatus(res);
    if (res.ok) return;
  } catch (err) {
    console.warn('Backend delete product endpoint unavailable, deleting locally', err);
  }

  const idx = FALLBACK_PRODUCTS.findIndex((p) => p._id === id);
  if (idx !== -1) {
    FALLBACK_PRODUCTS.splice(idx, 1);
  }
}

// Banners
export async function fetchAdminBanners(): Promise<Banner[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/banners`, {
      headers: { ...getAuthHeader() }
    });
    handleAuthStatus(res);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('Backend banners endpoint unavailable, using fallback', err);
  }
  return [...FALLBACK_BANNERS];
}

export async function createAdminBanner(banner: Partial<Banner>): Promise<Banner> {
  try {
    const res = await fetch(`${API_BASE}/admin/banners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(banner)
    });
    handleAuthStatus(res);
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.warn('Backend create banner endpoint unavailable, creating locally', err);
  }

  const newBanner: Banner = {
    _id: 'banner_' + Date.now(),
    title: banner.title || 'Promotional Banner',
    subtitle: banner.subtitle || '',
    imageUrl: banner.imageUrl || 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?q=80&w=1200&auto=format&fit=crop',
    ctaText: banner.ctaText || 'Learn More',
    ctaLink: banner.ctaLink || '#',
    badgeText: banner.badgeText || '',
    displayOrder: banner.displayOrder || 1,
    isActive: banner.isActive !== false,
    createdAt: new Date().toISOString()
  };
  FALLBACK_BANNERS.unshift(newBanner);
  return newBanner;
}

export async function updateAdminBanner(id: string, banner: Partial<Banner>): Promise<Banner> {
  try {
    const res = await fetch(`${API_BASE}/admin/banners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(banner)
    });
    handleAuthStatus(res);
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.warn('Backend update banner endpoint unavailable, updating locally', err);
  }

  const idx = FALLBACK_BANNERS.findIndex((b) => b._id === id);
  if (idx !== -1) {
    FALLBACK_BANNERS[idx] = { ...FALLBACK_BANNERS[idx], ...banner, updatedAt: new Date().toISOString() };
    return FALLBACK_BANNERS[idx];
  }
  return { ...banner, _id: id } as Banner;
}

export async function toggleAdminBanner(id: string): Promise<Banner> {
  try {
    const res = await fetch(`${API_BASE}/admin/banners/${id}/toggle`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() }
    });
    handleAuthStatus(res);
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.warn('Backend toggle banner endpoint unavailable, toggling locally', err);
  }

  const idx = FALLBACK_BANNERS.findIndex((b) => b._id === id);
  if (idx !== -1) {
    FALLBACK_BANNERS[idx].isActive = !FALLBACK_BANNERS[idx].isActive;
    return FALLBACK_BANNERS[idx];
  }
  throw new Error('Banner not found');
}

export async function deleteAdminBanner(id: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/admin/banners/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    handleAuthStatus(res);
    if (res.ok) return;
  } catch (err) {
    console.warn('Backend delete banner endpoint unavailable, deleting locally', err);
  }

  const idx = FALLBACK_BANNERS.findIndex((b) => b._id === id);
  if (idx !== -1) {
    FALLBACK_BANNERS.splice(idx, 1);
  }
}

// Orders & Receipts
export async function fetchAdminOrders(statusFilter?: string, search?: string): Promise<Order[]> {
  try {
    let url = `${API_BASE}/admin/orders`;
    const params = new URLSearchParams();
    if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
    if (search) params.append('search', search);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, {
      headers: { ...getAuthHeader() }
    });
    handleAuthStatus(res);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('Backend orders endpoint unavailable, using fallback', err);
  }

  let result = [...FALLBACK_ORDERS];
  if (statusFilter && statusFilter !== 'all') {
    result = result.filter(
      (o) => o.status === statusFilter || o.orderStatus === statusFilter
    );
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.sankalpName.toLowerCase().includes(q) ||
        o.customer.gotra.toLowerCase().includes(q) ||
        (o.razorpayPaymentId && o.razorpayPaymentId.toLowerCase().includes(q))
    );
  }
  return result;
}

export async function updateAdminOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  try {
    const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status })
    });
    handleAuthStatus(res);
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.warn('Backend update order status endpoint unavailable, updating locally', err);
  }

  const idx = FALLBACK_ORDERS.findIndex((o) => o._id === id);
  if (idx !== -1) {
    FALLBACK_ORDERS[idx].status = status;
    FALLBACK_ORDERS[idx].orderStatus = status;
    return FALLBACK_ORDERS[idx];
  }
  throw new Error('Order not found');
}

export async function fetchAdminReceipts(): Promise<TransactionReceipt[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/receipts`, {
      headers: { ...getAuthHeader() }
    });
    handleAuthStatus(res);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('Backend receipts endpoint unavailable, using fallback', err);
  }
  return [...FALLBACK_RECEIPTS];
}

export async function fetchAdminUsers(search?: string): Promise<AdminUser[]> {
  try {
    let url = `${API_BASE}/admin/users`;
    if (search) url += `?search=${encodeURIComponent(search)}`;
    const res = await fetch(url, {
      headers: { ...getAuthHeader() }
    });
    handleAuthStatus(res);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('Backend users endpoint unavailable, using fallback', err);
  }

  let result = [...FALLBACK_USERS];
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q))
    );
  }
  return result;
}

export async function updateAdminUserStatus(id: string, status: 'active' | 'suspended'): Promise<AdminUser> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status })
    });
    handleAuthStatus(res);
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.warn('Backend update user status endpoint unavailable, updating locally', err);
  }

  const idx = FALLBACK_USERS.findIndex((u) => u.id === id || u._id === id);
  if (idx !== -1) {
    FALLBACK_USERS[idx].status = status;
    FALLBACK_USERS[idx].isActive = status === 'active';
    return FALLBACK_USERS[idx];
  }
  throw new Error('User not found');
}
