import React, { useState, useEffect } from 'react';
import { Banner } from '../../types';
import { X, Save, Image as ImageIcon } from 'lucide-react';

export interface BannerFormModalProps {
  banner: Banner | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (bannerData: Partial<Banner>) => Promise<void>;
}

export const BannerFormModal: React.FC<BannerFormModalProps> = ({
  banner,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Banner>>({
    title: '',
    subtitle: '',
    imageUrl: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?q=80&w=1600&auto=format&fit=crop',
    ctaText: 'Book Seva Now',
    ctaLink: '#offerings-catalog',
    badgeText: 'Auspicious Mandir Seva',
    displayOrder: 1,
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (banner) {
      setFormData({ ...banner });
    } else {
      setFormData({
        title: '',
        subtitle: '',
        imageUrl: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?q=80&w=1600&auto=format&fit=crop',
        ctaText: 'Book Seva Now',
        ctaLink: '#offerings-catalog',
        badgeText: 'Auspicious Mandir Seva',
        displayOrder: 1,
        isActive: true,
      });
    }
  }, [banner, isOpen]);

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
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Failed to save banner:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl border-2 border-[#E8DFD8] shadow-2xl overflow-hidden my-8">
        {/* Header in Brown */}
        <div className="bg-[#5C3A21] p-6 text-white flex justify-between items-center border-b border-[#4A2E1A]">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#C59B27]" />
            <h3 className="font-serif text-lg font-bold text-white">
              {banner ? 'Edit Promotional Banner' : 'Create Website Hero Banner'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-[#2D1E12]">
          <div>
            <label htmlFor="banner-title" className="block font-medium text-[#5C3A21] mb-1">Banner Title *</label>
            <input
              id="banner-title"
              type="text"
              name="title"
              required
              value={formData.title || ''}
              onChange={handleChange}
              placeholder="e.g., Maha Shivling Sthapana & Vedic Abhishek"
              className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none text-sm"
            />
          </div>

          <div>
            <label htmlFor="banner-subtitle" className="block font-medium text-[#5C3A21] mb-1">Subtitle / Auspicious Blessing</label>
            <textarea
              id="banner-subtitle"
              name="subtitle"
              rows={2}
              value={formData.subtitle || ''}
              onChange={handleChange}
              placeholder="Invite Divine Auspiciousness, Peace & Prosperity into your home..."
              className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="banner-imageUrl" className="block font-medium text-[#5C3A21] mb-1">Image URL *</label>
            <input
              id="banner-imageUrl"
              type="url"
              name="imageUrl"
              required
              value={formData.imageUrl || ''}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="banner-ctaText" className="block font-medium text-[#5C3A21] mb-1">CTA Button Text</label>
              <input
                id="banner-ctaText"
                type="text"
                name="ctaText"
                value={formData.ctaText || ''}
                onChange={handleChange}
                placeholder="e.g., Book Seva Now"
                className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="banner-ctaLink" className="block font-medium text-[#5C3A21] mb-1">CTA Destination Link</label>
              <input
                id="banner-ctaLink"
                type="text"
                name="ctaLink"
                value={formData.ctaLink || ''}
                onChange={handleChange}
                placeholder="e.g., #offerings-catalog"
                className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="banner-badgeText" className="block font-medium text-[#5C3A21] mb-1">Badge Tag</label>
              <input
                id="banner-badgeText"
                type="text"
                name="badgeText"
                value={formData.badgeText || ''}
                onChange={handleChange}
                placeholder="e.g., Sacred Consecration Offering"
                className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="banner-displayOrder" className="block font-medium text-[#5C3A21] mb-1">Display Sort Order</label>
              <input
                id="banner-displayOrder"
                type="number"
                name="displayOrder"
                min={1}
                value={formData.displayOrder || 1}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-[#E8DFD8] focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#E8DFD8]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive || false}
                onChange={handleChange}
                className="rounded text-[#5C3A21] focus:ring-[#5C3A21] h-4 w-4"
              />
              <span className="font-semibold text-[#5C3A21]">Active (Display on Homepage)</span>
            </label>
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
              <span>{isSubmitting ? 'Saving...' : 'Save Banner'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerFormModal;
