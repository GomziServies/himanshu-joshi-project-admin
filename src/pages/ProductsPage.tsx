import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '../types';
import { fetchAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct } from '../services/api';
import { ProductFormModal } from '../components/products/ProductFormModal';
import { Plus, Edit2, Trash2, Search, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export interface ProductsPageProps {
  onOpenCreate?: boolean;
}

export const ProductsPage: React.FC<ProductsPageProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Offerings' },
    { id: 'Offering', label: 'Offering (Sthapana)' },
    { id: 'Puja', label: 'Puja' },
    { id: 'Prasad', label: 'Prasad' },
    { id: 'Seva', label: 'Seva' },
    { id: 'Ritual', label: 'Ritual' },
  ];

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (prod: Product) => {
    setSelectedProduct(prod);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this offering from the temple catalog?')) {
      return;
    }
    try {
      await deleteAdminProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err: unknown) {
      const errObj = err as Error;
      alert(errObj.message || 'Failed to delete product');
    }
  };

  const handleSave = async (data: Partial<Product>) => {
    if (selectedProduct) {
      const updated = await updateAdminProduct(selectedProduct._id, data);
      setProducts((prev) => prev.map((p) => (p._id === selectedProduct._id ? updated : p)));
    } else {
      const created = await createAdminProduct(data);
      setProducts((prev) => [created, ...prev]);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#5C3A21]">
            Temple Offerings & Products Directory
          </h2>
          <p className="text-xs text-[#8B5A2B] mt-0.5">
            Manage Shivling Sthapana offerings, rituals, Dakshina pricing, and stock
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="px-4 py-2.5 rounded-lg bg-[#5C3A21] hover:bg-[#4A2E1A] text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#C59B27]" />
          <span>Add New Temple Offering</span>
        </button>
      </div>

      {/* Filter and Category Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8DFD8] shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-[#8B5A2B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter offerings by title, rituals, or description..."
            className="w-full text-xs text-[#2D1E12] focus:outline-none placeholder:text-[#7A6658]"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#E8DFD8]/60">
          <span className="text-[11px] font-semibold text-[#8B5A2B] uppercase mr-2">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#5C3A21] text-white shadow-sm'
                  : 'bg-[#FDFBF7] text-[#8B5A2B] hover:bg-[#F5EFEB] border border-[#E8DFD8]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table in Brown and White Theme */}
      <div className="bg-white rounded-xl border border-[#E8DFD8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FDFBF7] text-[#5C3A21] font-semibold border-b border-[#E8DFD8]">
              <tr>
                <th className="p-3.5">Offering Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Dakshina (₹)</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Store Status</th>
                <th className="p-3.5">Featured</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD8]/60 text-[#2D1E12]">
              {filteredProducts.map((prod) => (
                <tr key={prod._id} className="hover:bg-[#FDFBF7] transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          prod.featuredImage ||
                          (prod.images && prod.images[0]) ||
                          'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?q=80&w=100&auto=format&fit=crop'
                        }
                        alt={prod.title}
                        className="w-10 h-10 rounded-lg object-cover border border-[#E8DFD8] flex-shrink-0"
                      />
                      <div>
                        <span className="font-semibold text-[#5C3A21] block">{prod.title}</span>
                        <span className="text-[10px] text-[#8B5A2B] font-mono">slug: {prod.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FDFBF7] text-[#8B5A2B] font-medium text-[11px] border border-[#E8DFD8]">
                      {prod.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-serif font-bold text-[#5C3A21]">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 font-medium">{prod.stockQuantity ?? 108}</td>
                  <td className="p-3.5">
                    {prod.isActive !== false ? (
                      <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-500 font-semibold text-[11px]">
                        <XCircle className="w-3.5 h-3.5" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {prod.isFeatured ? (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
                        Featured
                      </span>
                    ) : (
                      <span className="text-gray-400 text-[11px]">—</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(prod)}
                      className="p-1.5 rounded bg-[#FDFBF7] hover:bg-[#F5EFEB] text-[#5C3A21] border border-[#E8DFD8] transition-colors"
                      title="Edit Offering"
                      aria-label={`Edit ${prod.title}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id)}
                      className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
                      title="Delete Offering"
                      aria-label={`Delete ${prod.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-[#8B5A2B] space-y-2">
            <Sparkles className="w-6 h-6 mx-auto text-[#C59B27]" />
            <p className="font-serif text-xs">
              {loading ? 'Loading offerings...' : 'No temple offerings found matching your criteria.'}
            </p>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <ProductFormModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProductsPage;
