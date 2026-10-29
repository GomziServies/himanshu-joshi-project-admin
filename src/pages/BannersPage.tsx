import React, { useState, useEffect } from 'react';
import { Banner } from '../types';
import { fetchAdminBanners, createAdminBanner, updateAdminBanner, toggleAdminBanner, deleteAdminBanner } from '../services/api';
import { BannerFormModal } from '../components/banners/BannerFormModal';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Image as ImageIcon } from 'lucide-react';

export interface BannersPageProps {
  onOpenCreate?: boolean;
}

export const BannersPage: React.FC<BannersPageProps> = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminBanners();
      setBanners(data);
    } catch (err) {
      console.error('Failed to load admin banners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleCreate = () => {
    setSelectedBanner(null);
    setIsModalOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsModalOpen(true);
  };

  const handleToggle = async (id: string) => {
    // Instant Optimistic Toggle
    setBanners((prev) =>
      prev.map((b) => (b._id === id ? { ...b, isActive: !b.isActive } : b))
    );
    try {
      await toggleAdminBanner(id);
    } catch (err) {
      console.error('Failed to toggle banner status, reverting:', err);
      loadBanners();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this promotional banner from the website?')) {
      return;
    }
    try {
      await deleteAdminBanner(id);
      setBanners((prev) => prev.filter((b) => b._id !== id));
    } catch (err: unknown) {
      const errObj = err as Error;
      alert(errObj.message || 'Failed to delete banner');
    }
  };

  const handleSave = async (data: Partial<Banner>) => {
    if (selectedBanner) {
      const updated = await updateAdminBanner(selectedBanner._id, data);
      setBanners((prev) => prev.map((b) => (b._id === selectedBanner._id ? updated : b)));
    } else {
      const created = await createAdminBanner(data);
      setBanners((prev) => [created, ...prev]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#5C3A21]">
            Website Promotional Banners
          </h2>
          <p className="text-xs text-[#8B5A2B] mt-0.5">
            Configure dynamic homepage hero carousels, CTA links, and seasonal festival notices
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="px-4 py-2.5 rounded-lg bg-[#5C3A21] hover:bg-[#4A2E1A] text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#C59B27]" />
          <span>Create New Banner</span>
        </button>
      </div>

      {/* Banners Grid & Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div
            key={banner._id}
            className="bg-white rounded-xl border border-[#E8DFD8] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            {/* Banner Preview */}
            <div className="relative aspect-[16/8] bg-[#5C3A21] overflow-hidden">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

              {/* Badge & Order */}
              <div className="absolute top-3 left-3 flex gap-2">
                {banner.badgeText && (
                  <span className="px-2.5 py-0.5 rounded bg-[#5C3A21]/90 text-white font-serif text-[10px] uppercase font-bold border border-[#C59B27]/40">
                    {banner.badgeText}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                  Order: #{banner.displayOrder || 1}
                </span>
              </div>

              {/* Instant Status Switch */}
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => handleToggle(banner._id)}
                  aria-label={`Toggle active status for ${banner.title}`}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all ${
                    banner.isActive
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                  title="Click to toggle display on homepage"
                >
                  {banner.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  <span>{banner.isActive ? 'Active' : 'Hidden'}</span>
                </button>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h4 className="font-serif font-bold text-sm leading-tight drop-shadow">{banner.title}</h4>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-4 space-y-3 text-xs text-[#2D1E12]">
              {banner.subtitle && (
                <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                  {banner.subtitle}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[#E8DFD8]/60 text-[11px]">
                <span className="text-[#8B5A2B]">
                  CTA: <strong className="text-[#5C3A21]">{banner.ctaText || 'None'}</strong> →{' '}
                  <code className="text-[#8B5A2B]">{banner.ctaLink || '/'}</code>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="p-1.5 rounded bg-[#FDFBF7] hover:bg-[#F5EFEB] text-[#5C3A21] border border-[#E8DFD8]"
                    title="Edit Banner"
                    aria-label={`Edit ${banner.title}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                    title="Delete Banner"
                    aria-label={`Delete ${banner.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-[#E8DFD8] text-[#8B5A2B] space-y-2">
          <ImageIcon className="w-8 h-8 mx-auto text-[#8B5A2B]" />
          <p className="font-serif text-sm">
            {loading ? 'Loading promotional banners...' : 'No promotional banners configured yet.'}
          </p>
        </div>
      )}

      {/* Banner Create / Edit Modal */}
      <BannerFormModal
        banner={selectedBanner}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default BannersPage;
