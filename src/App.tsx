import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminLayout } from './components/layout/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { BannersPage } from './pages/BannersPage';
import { OrdersPage } from './pages/OrdersPage';
import { UsersPage } from './pages/UsersPage';
import { ProductFormModal } from './components/products/ProductFormModal';
import { BannerFormModal } from './components/banners/BannerFormModal';
import { createAdminProduct, createAdminBanner } from './services/api';
import { Product, Banner } from './types';

const AdminAppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Quick modals from Dashboard
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#5C3A21] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md mx-auto animate-pulse">
            ॐ
          </div>
          <p className="text-xs text-[#8B5A2B] font-serif uppercase tracking-widest">
            Initializing Sanctum Admin Console...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleSaveProduct = async (data: Partial<Product>) => {
    await createAdminProduct(data);
    setIsProductModalOpen(false);
    setCurrentTab('products');
  };

  const handleSaveBanner = async (data: Partial<Banner>) => {
    await createAdminBanner(data);
    setIsBannerModalOpen(false);
    setCurrentTab('banners');
  };

  return (
    <AdminLayout currentTab={currentTab} onTabChange={setCurrentTab}>
      {currentTab === 'dashboard' && (
        <DashboardPage
          onNavigate={setCurrentTab}
          onOpenProductModal={() => setIsProductModalOpen(true)}
          onOpenBannerModal={() => setIsBannerModalOpen(true)}
        />
      )}
      {currentTab === 'products' && <ProductsPage />}
      {currentTab === 'banners' && <BannersPage />}
      {currentTab === 'orders' && <OrdersPage />}
      {currentTab === 'users' && <UsersPage />}

      {/* Global Quick Action Modals */}
      <ProductFormModal
        product={null}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
      />

      <BannerFormModal
        banner={null}
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
        onSave={handleSaveBanner}
      />
    </AdminLayout>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AdminAppContent />
    </AuthProvider>
  );
};

export default App;
