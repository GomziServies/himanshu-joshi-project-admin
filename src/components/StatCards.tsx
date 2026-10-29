import React from 'react';
import { AdminStats } from '../types';
import { IndianRupee, ShoppingBag, Image, Users, TrendingUp } from 'lucide-react';

export interface StatCardsProps {
  stats: AdminStats;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Revenue (Dakshina)',
      value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`,
      sub: 'Verified Razorpay settlements',
      icon: IndianRupee,
      trend: '+100% this month',
    },
    {
      title: 'Total Consecrated Orders',
      value: stats.totalOrders || 0,
      sub: 'Sankalp seva bookings',
      icon: ShoppingBag,
      trend: 'Active pipeline',
    },
    {
      title: 'Active Temple Offerings',
      value: stats.activeProducts || 0,
      sub: 'Including Shivling Sthapana',
      icon: ShoppingBag,
      trend: 'In catalog',
    },
    {
      title: 'Active Website Banners',
      value: stats.activeBanners || 0,
      sub: 'Dynamic homepage rotation',
      icon: Image,
      trend: 'Live on storefront',
    },
    {
      title: 'Registered Devotees',
      value: stats.totalUsers || 0,
      sub: 'Devotees & Administrators',
      icon: Users,
      trend: 'Verified accounts',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl border border-[#E8DFD8] p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium text-[#8B5A2B] uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="text-xl font-bold font-serif text-[#5C3A21] mt-2">
                  {card.value}
                </h3>
                <p className="text-[11px] text-[#7A6658] mt-1">{card.sub}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#E8DFD8] flex items-center justify-center text-[#5C3A21]">
                <Icon className="w-5 h-5 text-[#8B5A2B]" />
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#E8DFD8]/60 flex items-center gap-1.5 text-[11px] text-[#8B5A2B]">
              <TrendingUp className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>{card.trend}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;
