import React, { useCallback, useEffect, useState } from 'react';
import { ImageOff, Pencil, Plus, Trash2 } from 'lucide-react';
import { Product, ProductInput } from '../types';
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '../services/api';
import { ErrorNotice } from '../components/ErrorNotice';
import { PageHeading } from '../components/PageHeading';
import { ProductFormModal } from '../components/products/ProductFormModal';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | 'new' | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      setProducts(await fetchProducts());
    } catch (err) {
      setLoadError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (input: ProductInput) => {
    if (editing && editing !== 'new') {
      const updated = await updateProduct(editing._id, input);
      setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    } else {
      const created = await createProduct(input);
      setProducts((prev) => [created, ...prev]);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete "${product.title}"? Past payments for it are kept.`)) return;
    setActionError(null);
    try {
      await deleteProduct(product._id);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
    } catch (err) {
      setActionError((err as Error).message);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeading
        hindi="उत्पाद"
        title="Products"
        action={
          <button type="button" onClick={() => setEditing('new')} className="btn-primary">
            <Plus className="h-4 w-4" />
            Add product
          </button>
        }
      />

      {loadError && <ErrorNotice message={loadError} onRetry={load} />}
      {actionError && <ErrorNotice message={actionError} />}

      {!loadError && (
        <div className="overflow-hidden rounded-2xl border border-brass-400/50 bg-white shadow-sm">
          <ul className="divide-y divide-ivory-200">
            {products.map((product) => {
              const image = product.featuredImage || product.images?.[0];
              return (
                <li key={product._id} className="flex items-center gap-4 px-4 py-3">
                  {image ? (
                    <img src={image} alt="" className="h-16 w-14 shrink-0 rounded-t-full border border-brass-500 object-cover" />
                  ) : (
                    <div className="flex h-16 w-14 shrink-0 items-center justify-center rounded-t-full border border-brass-500 bg-ivory-100 text-ink-muted">
                      <ImageOff className="h-5 w-5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-semibold text-ink">{product.title}</p>
                    <p className="text-ink-muted">
                      <span className="font-bold text-sindoor-600">₹{product.price.toLocaleString('en-IN')}</span>
                      {' · '}
                      {product.isActive ? 'On website' : 'Hidden'}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing(product)}
                      className="rounded-lg p-2 text-ink transition-colors hover:bg-ivory-100"
                      aria-label={`Edit ${product.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      className="rounded-lg p-2 text-sindoor-600 transition-colors hover:bg-sindoor-500/10"
                      aria-label={`Delete ${product.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {products.length === 0 && (
            <p className="px-4 py-12 text-center text-ink-muted">
              {isLoading ? 'Loading products...' : 'No products yet.'}
            </p>
          )}
        </div>
      )}

      {editing && (
        <ProductFormModal
          product={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ProductsPage;
