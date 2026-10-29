import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  children,
}) => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      {/* Sidebar Navigation */}
      <Sidebar currentTab={currentTab} onTabChange={onTabChange} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar currentTab={currentTab} />
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
