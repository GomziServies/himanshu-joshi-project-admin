import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Bell, Shield } from 'lucide-react';

export interface TopbarProps {
  currentTab: string;
}

export const Topbar: React.FC<TopbarProps> = ({ currentTab }) => {
  const { user, logout } = useAuth();

  const tabLabels: Record<string, string> = {
    dashboard: 'Dashboard Overview & Metrics',
    products: 'Temple Offerings & Products Management',
    banners: 'Website Promotional Banners',
    orders: 'Orders & Consecrated Receipts Ledger',
    users: 'Devotee & Administrative Accounts',
  };

  return (
    <header className="h-16 bg-white border-b border-[#E8DFD8] px-6 flex items-center justify-between shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h1 className="text-base sm:text-lg font-serif font-bold text-[#5C3A21]">
          {tabLabels[currentTab] || 'Temple Administration'}
        </h1>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FDFBF7] text-[#8B5A2B] text-xs font-medium border border-[#E8DFD8]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          Live Sync Active
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Icon */}
        <button
          className="p-2 rounded-lg text-[#7A6658] hover:bg-[#FDFBF7] hover:text-[#5C3A21] transition-colors relative"
          title="System Notifications"
          aria-label="System Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C59B27]"></span>
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E8DFD8]">
          <div className="w-8 h-8 rounded-full bg-[#5C3A21] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden md:block text-left text-xs">
            <p className="font-semibold text-[#5C3A21] leading-tight">{user?.name || 'Administrator'}</p>
            <p className="text-[#8B5A2B] text-[10px] flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-[#C59B27]" />
              Sanctum Head Admin
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#8B5A2B] hover:text-white hover:bg-[#5C3A21] border border-[#E8DFD8] hover:border-[#5C3A21] transition-all"
          title="Sign out of Admin Console"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
