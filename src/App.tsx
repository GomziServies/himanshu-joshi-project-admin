import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminLayout, AdminTab } from './components/layout/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { ProductsPage } from './pages/ProductsPage';

const AdminAppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('payments');

  if (isLoading) return null;
  if (!isAuthenticated) return <LoginPage />;

  return (
    <AdminLayout currentTab={currentTab} onTabChange={setCurrentTab}>
      {currentTab === 'payments' ? <PaymentsPage /> : <ProductsPage />}
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
