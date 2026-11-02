import React, { useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { Product, ProductInput } from '../../types';
import { imageFileToDataUrl } from '../../services/image';
import { ErrorNotice } from '../ErrorNotice';
import { ModalShell } from '../ModalShell';

export interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: ProductInput) => Promise<void>;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onClose, onSave }) => {
  const [title, setTitle] = useState(product?.title ?? '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [included, setIncluded] = useState((product?.prasadIncludes ?? []).join('\n'));
  const [image, setImage] = useState(product?.featuredImage || product?.images?.[0] || '');
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setError(null);
      setImage(await imageFileToDataUrl(file));
    } catch {
      setError('This image could not be read. Please try a JPG or PNG photo.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(price);
    if (!Number.isFinite(amount) || amount < 1) {
      setError('Price must be at least ₹1.');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const cleanDescription = description.trim();
      await onSave({
        title: title.trim(),
        price: amount,
        description: cleanDescription,
        shortDescription: cleanDescription.slice(0, 300),
        featuredImage: image,
        images: image ? [image] : [],
        prasadIncludes: included.split('\n').map((line) => line.trim()).filter(Boolean),
        isActive,
      });
      onClose();
    } catch (err) {
      setError((err as Error).message);
      setIsSaving(false);
    }
  };

  return (
    <ModalShell title={product ? 'Edit product' : 'Add product'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
        <div>
          <span className="label">Photo</span>
          <div className="flex items-center gap-4">
            {image ? (
              <img src={image} alt="Product preview" className="h-28 w-24 rounded-t-full border border-brass-500 object-cover" />
            ) : (
              <div className="flex h-28 w-24 items-center justify-center rounded-t-full border border-dashed border-brass-500 bg-ivory-100 text-ink-muted">
                <ImagePlus className="h-7 w-7" />
              </div>
            )}
            <div className="flex flex-col items-start gap-2">
              <label className="btn-secondary relative cursor-pointer focus-within:ring-2 focus-within:ring-marigold-500">
                {image ? 'Change photo' : 'Upload photo'}
                <input type="file" accept="image/*" onChange={handleImage} className="sr-only" aria-label="Upload photo" />
              </label>
              {image && (
                <button type="button" onClick={() => setImage('')} className="inline-flex items-center gap-1 font-medium text-sindoor-600 hover:text-sindoor-700">
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="product-title" className="label">Name</label>
          <input id="product-title" type="text" required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
        </div>

        <div>
          <label htmlFor="product-price" className="label">Price (₹)</label>
          <input id="product-price" type="number" required min={1} step={1} inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="input sm:w-40" />
        </div>

        <div>
          <label htmlFor="product-description" className="label">Description</label>
          <textarea id="product-description" required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="input" />
        </div>

        <div>
          <label htmlFor="product-included" className="label">
            What's included <span className="font-normal text-ink-muted">(optional, one per line)</span>
          </label>
          <textarea id="product-included" rows={3} value={included} onChange={(e) => setIncluded(e.target.value)} className="input" />
        </div>

        <label className="flex cursor-pointer items-center gap-2 font-medium text-ink">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 accent-marigold-600" />
          Show on website
        </label>

        {error && <ErrorNotice message={error} />}

        <div className="flex justify-end gap-3 border-t border-ivory-200 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={isSaving} className="btn-primary">
            {isSaving ? 'Saving...' : 'Save product'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default ProductFormModal;
