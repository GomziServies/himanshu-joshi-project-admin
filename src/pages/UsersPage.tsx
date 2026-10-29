import React, { useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { fetchAdminUsers, updateAdminUserStatus } from '../services/api';
import { Search, Shield, User as UserIcon, IndianRupee, ShoppingBag } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const data = await fetchAdminUsers();
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleToggleStatus = async (user: AdminUser) => {
    if (user.role === 'admin') {
      alert('Primary administrator account status cannot be modified.');
      return;
    }
    const nextStatus = user.status === 'suspended' ? 'active' : 'suspended';
    try {
      const updated = await updateAdminUserStatus(user.id, nextStatus);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    } catch (err) {
      console.error('Failed to update devotee status:', err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search))
  );

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div>
        <h2 className="font-serif text-xl font-bold text-[#5C3A21]">
          Devotee & Administrative Accounts Directory
        </h2>
        <p className="text-xs text-[#8B5A2B] mt-0.5">
          View registered devotees, temple trust administrators, lifetime contributions, and account status
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8DFD8] shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-[#8B5A2B]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by devotee name, email, or phone number..."
          className="w-full text-xs text-[#2D1E12] focus:outline-none placeholder:text-[#7A6658]"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-[#E8DFD8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FDFBF7] text-[#5C3A21] font-semibold border-b border-[#E8DFD8]">
              <tr>
                <th className="p-3.5">Account Devotee</th>
                <th className="p-3.5">Email Address</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Phone Number</th>
                <th className="p-3.5">Orders Placed</th>
                <th className="p-3.5">Total Dakshina (₹)</th>
                <th className="p-3.5">Registered Date</th>
                <th className="p-3.5 text-right">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD8]/60 text-[#2D1E12]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#FDFBF7] transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FDFBF7] text-[#5C3A21] flex items-center justify-center font-bold text-xs border border-[#E8DFD8]">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-[#5C3A21]">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-gray-700">{u.email}</td>
                  <td className="p-3.5">
                    {u.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#5C3A21] text-white">
                        <Shield className="w-3 h-3 text-[#C59B27]" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FDFBF7] text-[#8B5A2B] border border-[#E8DFD8]">
                        <UserIcon className="w-3 h-3" />
                        Devotee
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-gray-600">{u.phone || '—'}</td>
                  <td className="p-3.5 font-medium">
                    <span className="inline-flex items-center gap-1 text-[#5C3A21]">
                      <ShoppingBag className="w-3 h-3 text-[#8B5A2B]" />
                      {u.ordersCount ?? 0}
                    </span>
                  </td>
                  <td className="p-3.5 font-serif font-bold text-[#5C3A21]">
                    <span className="inline-flex items-center">
                      ₹{(u.totalSpent ?? 0).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="p-3.5 text-gray-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '2026-10-29'}
                  </td>
                  <td className="p-3.5 text-right">
                    {u.role === 'admin' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        Active (Protected)
                      </span>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(u)}
                        title="Click to toggle status"
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                          u.status === 'suspended'
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                      >
                        {u.status === 'suspended' ? 'Suspended' : 'Active'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-[#8B5A2B] space-y-2">
            <p className="font-serif text-xs">
              {loading ? 'Loading devotee accounts...' : 'No devotee accounts found matching search.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
