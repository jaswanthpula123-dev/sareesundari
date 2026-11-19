import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, ShoppingBag, Banknote, Calendar } from 'lucide-react';
import { adminAPI } from '../../services/api';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getCustomers()
      .then((res) => {
        if (res.success && res.customers) {
          setCustomers(res.customers);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-[#d4af37]/20">
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#4d0a13]">
          Registered Customers
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          View customer contacts, order histories, and total spending.
        </p>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-[#d4af37]/30 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-400">Loading customers database...</div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400">No registered customers yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fdfbf7] border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Default City</th>
                  <th className="py-3 px-4">Orders Placed</th>
                  <th className="py-3 px-4">Total Spent</th>
                  <th className="py-3 px-4">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-[#fdfbf7] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#fcedd8] text-[#6b0f1a] font-bold flex items-center justify-center text-xs">
                          {c.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-900">{c.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600">
                      <div>{c.email}</div>
                      <div className="text-[10px] text-gray-400">{c.phone || 'No mobile listed'}</div>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600">
                      {c.addresses?.[0]?.city ? `${c.addresses[0].city}, ${c.addresses[0].state}` : 'Not provided'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="bg-[#f7f1e5] text-[#6b0f1a] font-bold px-2 py-0.5 rounded-full text-[11px]">
                        {c.ordersCount || 0} orders
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-black text-[#6b0f1a]">
                      ₹{(c.totalSpent || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-gray-400 text-[11px]">
                      {new Date(c.createdAt || Date.now()).toLocaleDateString('en-IN', {
                        month: 'short', year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminCustomers;
