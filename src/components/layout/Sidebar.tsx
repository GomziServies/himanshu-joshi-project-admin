import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Image as ImageIcon,
  Receipt,
  Users,
  ExternalLink,
} from 'lucide-react';

export interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Sevas', icon: ShoppingBag },
    { id: 'banners', label: 'Website Banners', icon: ImageIcon },
    { id: 'orders', label: 'Orders & Receipts', icon: Receipt },
    { id: 'users', label: 'User Directory', icon: Users },
  ];

  return (
    <aside className="w-64 bg-[#5C3A21] text-white flex flex-col justify-between shadow-xl flex-shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#4A2E1A] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-[#5C3A21] flex items-center justify-center font-serif text-xl font-bold shadow-md">
            ॐ
          </div>
          <div>
            <h2 className="font-serif text-sm font-bold tracking-wider uppercase text-white">
              Temple Admin
            </h2>
            <p className="text-[10px] text-[#E8DFD8] tracking-widest uppercase">
              Management Portal
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5" aria-label="Main Navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-white text-[#5C3A21] shadow-md font-bold'
                    : 'text-[#E8DFD8] hover:bg-[#4A2E1A] hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#5C3A21]' : 'text-[#C59B27]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 m-4 rounded-xl bg-[#4A2E1A] border border-[#8B5A2B]/40 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-[#E8DFD8]">
          <span className="font-medium">Customer Website</span>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline flex items-center gap-1 font-semibold"
          >
            Open <ExternalLink className="w-3 h-3 text-[#C59B27]" />
          </a>
        </div>
        <p className="text-[10px] text-[#E8DFD8]/80 leading-relaxed">
          Theme: Executive Brown & White • Sanctum Production Suite
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
