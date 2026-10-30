import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { X, Save, Sparkles } from 'lucide-react';

export interface ProductFormModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    slug: '',
    category: 'Offering',
    subtitle: '',
    price: 5100,
    originalPrice: 7100,
    shortDescription: '',
    description: '',
    featuredImage: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?q=80&w=800&auto=format&fit=crop'],
    inStock: true,
    stockQuantity: 108,
    isActive: true,
    isFeatured: true,
    prasadIncludes: ['Consecrated Narmadeshwar Shivling with Brass Yoni Peeth', 'Sanctum Bhasma & Holy Gangajal'],
    ritualsIncluded: ['Ganpati & Kalash Sthapana', 'Vedic Pran Pratishtha', 'Panchamrit Rudrabhishek'],
  });

  const [ritualsText, setRitualsText] = useState('');
  const [prasadText, setPrasadText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
      setRitualsText((product.ritualsIncluded || []).join('\n'));
      setPrasadText((product.prasadIncludes || []).join('\n'));
    } else {
      const initial = {
        title: '',
        slug: '',
        category: 'Offering',
        subtitle: '',
        price: 5100,
        originalPrice: 7100,
        shortDescription: '',
        description: '',
        featuredImage: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?q=80&w=800&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?q=80&w=800&auto=format&fit=crop'],
        inStock: true,
        stockQuantity: 108,
        isActive: true,
        isFeatured: false,
        prasadIncludes: ['Consecrated Narmadeshwar Shivling with Brass Yoni Peeth', 'Sanctum Bhasma & Holy Gangajal'],
        ritualsIncluded: ['Ganpati & Kalash Sthapana', 'Vedic Pran Pratishtha', 'Panchamrit Rudrabhishek'],
      };
      setFormData(initial);
      setRitualsText(initial.ritualsIncluded.join('\n'));
      setPrasadText(initial.prasadIncludes.join('\n'));
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === 'title' && !product
          ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
          : {}),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: Partial<Product> = {
        ...formData,
        ritualsIncluded: ritualsText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        prasadIncludes: prasadText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      console.error('Failed to save product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border-2 border-[#E8DFD8] shadow-2xl overflow-hidden my-8">
        {/* Header in Brown */}
        <div className="bg-[#5C3A21] p-6 text-white flex justify-between items-center border-b border-[#4A2E1A]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C59B27]" />
            <h3 className="font-serif text-lg font-bold text-white">
              {product ? 'Edit Temple Offering' : 'Add New Temple Offering / Seva'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full text-[#E8DFD8] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-[#2D1E12]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block font-medium text-[#5C3A21] mb-1">Offering Title *</label>
              <input
                id="title"
                type="text"
                name="title"
                required
                value={formData.title || ''}
                onChange={handleChange}
                placeholder="e.g., Shivling Sthapana & Rudrabhishek Offering"
                className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none text-sm"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block font-medium text-[#5C3A21] mb-1">URL Slug *</label>
              <input
                id="slug"
                type="text"
                name="slug"
                required
                value={formData.slug || ''}
                onChange={handleChange}
                placeholder="e.g., shivling-sthapana"
                className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="category" className="block font-medium text-[#5C3A21] mb-1">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category || 'Offering'}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none"
              >
                <option value="Offering">Offering (Sthapana)</option>
                <option value="Puja">Puja</option>
                <option value="Ritual">Ritual (Vedic Yajna)</option>
                <option value="Prasad">Prasad</option>
                <option value="Seva">Seva</option>
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block font-medium text-[#5C3A21] mb-1">Dakshina Price (₹) *</label>
              <input
                id="price"
                type="number"
                name="price"
                required
                min={0}
                value={formData.price !== undefined ? formData.price : 0}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none font-semibold text-[#5C3A21]"
              />
            </div>

            <div>
              <label htmlFor="originalPrice" className="block font-medium text-[#5C3A21] mb-1">Original Price (₹)</label>
              <input
                id="originalPrice"
                type="number"
                name="originalPrice"
                min={0}
                value={formData.originalPrice || 0}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="subtitle" className="block font-medium text-[#5C3A21] mb-1">Subtitle / Auspicious Tagline</label>
              <input
                id="subtitle"
                type="text"
                name="subtitle"
                value={formData.subtitle || ''}
                onChange={handleChange}
                placeholder="Sacred Narmadeshwar Shivling Consecration with Vedic Pran Pratishtha"
                className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="featuredImage" className="block font-medium text-[#5C3A21] mb-1">Featured Image URL</label>
              <input
                id="featuredImage"
                type="url"
                name="featuredImage"
                value={formData.featuredImage || ''}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="block font-medium text-[#5C3A21] mb-1">Detailed Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Detailed description of the Vedic vidhi, samagri, and spiritual significance..."
                className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="ritualsIncluded" className="block font-medium text-[#5C3A21] mb-1">
                Rituals Included (1 per line)
              </label>
              <textarea
                id="ritualsIncluded"
                rows={3}
                value={ritualsText}
                onChange={(e) => setRitualsText(e.target.value)}
                placeholder="Ganpati & Kalash Sthapana&#10;Vedic Pran Pratishtha Vidhi"
                className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none text-[11px]"
              />
            </div>

            <div>
              <label htmlFor="prasadIncludes" className="block font-medium text-[#5C3A21] mb-1">
                Prasad Inclusions (1 per line)
              </label>
              <textarea
                id="prasadIncludes"
                rows={3}
                value={prasadText}
                onChange={(e) => setPrasadText(e.target.value)}
                placeholder="Narmadeshwar Shivling with Brass Yoni Peeth&#10;Sanctum Bhasma & holy Gangajal"
                className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none text-[11px]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:col-span-2 py-2 border-t border-[#E8DFD8]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive || false}
                  onChange={handleChange}
                  className="rounded text-[#5C3A21] focus:ring-[#5C3A21] h-4 w-4"
                />
                <span className="font-semibold text-[#5C3A21]">Active in Store</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured || false}
                  onChange={handleChange}
                  className="rounded text-[#5C3A21] focus:ring-[#5C3A21] h-4 w-4"
                />
                <span className="font-semibold text-[#5C3A21]">Featured Offering</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock !== false}
                  onChange={handleChange}
                  className="rounded text-[#5C3A21] focus:ring-[#5C3A21] h-4 w-4"
                />
                <span className="font-semibold text-[#5C3A21]">In Stock</span>
              </label>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#E8DFD8] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#E8DFD8] text-[#8B5A2B] hover:bg-[#FDFBF7] font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-[#5C3A21] hover:bg-[#4A2E1A] text-white font-semibold flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Offering'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
