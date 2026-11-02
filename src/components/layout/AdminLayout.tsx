import React, { useEffect, useState } from 'react';
import { ExternalLink, IndianRupee, LogOut, Menu, Package, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TempleSkyline, Toran } from './Ornaments';

export type AdminTab = 'payments' | 'products';

const TABS: Array<{ id: AdminTab; label: string; hindi: string; icon: typeof Package }> = [
  { id: 'payments', label: 'Payments', hindi: 'भुगतान', icon: IndianRupee },
  { id: 'products', label: 'Products', hindi: 'उत्पाद', icon: Package },
];

const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || 'http://localhost:5173';

export interface AdminLayoutProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  children: React.ReactNode;
}

const Brand: React.FC = () => (
  <div className="flex min-w-0 items-center gap-3">
    <img src="/punya-passport-logo.jpg" alt="" className="h-11 w-11 shrink-0 rounded-full border border-brass-500 object-cover" />
    <div className="min-w-0 leading-tight">
      <p lang="hi" className="font-deva text-lg leading-snug text-brass-300">सलाहकारेश्वर महादेव</p>
      <p className="text-xs uppercase tracking-[0.2em] text-ivory-200/70">Admin</p>
    </div>
  </div>
);

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentTab, onTabChange, children }) => {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-ivory-50 lg:pl-64">
      {/* Phone top bar */}
      <header className="jaali sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-brass-500/30 bg-sanctum px-4 lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="rounded-lg p-2 text-brass-300 transition-colors hover:bg-white/10"
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-sanctum/60 lg:hidden" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}

      {/* Sidebar: always visible from lg up, a slide-in menu below that */}
      <aside
        className={`jaali fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sanctum text-ivory-100 transition-transform duration-200 lg:visible lg:translate-x-0 ${
          menuOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-brass-500/25 px-4 py-5">
          <Brand />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg p-1.5 text-ivory-200 transition-colors hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-5" aria-label="Sections">
          {TABS.map(({ id, label, hindi, icon: Icon }) => {
            const isActive = currentTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onTabChange(id);
                  setMenuOpen(false);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-lg border-l-[3px] px-3 py-2.5 text-left transition-colors ${
                  isActive
                    ? 'border-marigold-500 bg-brass-500/15 text-brass-200'
                    : 'border-transparent text-ivory-100/80 hover:bg-white/5 hover:text-ivory-50'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="text-lg font-medium leading-tight">{label}</span>
                <span lang="hi" aria-hidden="true" className="ml-auto font-deva text-sm text-ivory-200/60">{hindi}</span>
              </button>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-brass-500/25 px-3 py-3">
          <a
            href={WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-ivory-100/80 transition-colors hover:bg-white/5 hover:text-ivory-50"
          >
            <ExternalLink className="h-4 w-4" />
            View website
          </a>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-ivory-100/80 transition-colors hover:bg-white/5 hover:text-ivory-50"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>

        <TempleSkyline className="h-24 shrink-0" fill="#43271A" />
      </aside>

      <Toran scale={0.6} />
      <main className="mx-auto max-w-5xl px-4 pb-10 pt-3 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
