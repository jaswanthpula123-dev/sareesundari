import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Banknote,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboardStats()
      .then((res) => {
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      })
      .catch((err) => console.error('Dashboard stats error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#6b0f1a] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-semibold text-gray-500">Loading shop analytics & inventory metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d4af37]/20">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#4d0a13]">
            Saree Sundarii Boutique Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time handloom sales, bespoke bridal orders, artisan inventory stock, and customer insights.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="self-start sm:self-auto px-4 py-2 bg-[#6b0f1a] hover:bg-[#4d0a13] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2"
        >
          <span>+ Add New Saree</span>
        </Link>
      </div>

      {/* 4 Primary Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Sales */}
        <div className="bg-white rounded-2xl p-5 border border-[#d4af37]/30 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Sales</span>
            <span className="text-2xl font-black text-[#4d0a13]">
              ₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-5 border border-[#d4af37]/30 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Orders</span>
            <span className="text-2xl font-black text-[#4d0a13]">
              {stats?.totalOrders || 0}
            </span>
          </div>
        </div>

        {/* Total Sarees in Catalog */}
        <div className="bg-white rounded-2xl p-5 border border-[#d4af37]/30 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#fcedd8] text-[#6b0f1a] flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Sarees in Catalog</span>
            <span className="text-2xl font-black text-[#4d0a13]">
              {stats?.totalProducts || 0}
            </span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-2xl p-5 border border-[#d4af37]/30 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Customers</span>
            <span className="text-2xl font-black text-[#4d0a13]">
              {stats?.totalCustomers || 0}
            </span>
          </div>
        </div>

      </div>

      {/* Low Stock Warning Callout if any */}
      {(stats?.lowStockCount > 0 || stats?.outOfStockCount > 0) && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <div className="text-xs text-amber-900">
              <strong className="font-bold">Inventory Notice: </strong>
              <span>
                {stats.outOfStockCount > 0 ? `${stats.outOfStockCount} sarees are currently OUT OF STOCK. ` : ''}
                {stats.lowStockCount > 0 ? `${stats.lowStockCount} sarees have fewer than 10 pieces left.` : ''}
              </span>
            </div>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-3 py-1.5 rounded-lg transition-colors shrink-0 ml-4"
          >
            Restock Inventory →
          </Link>
        </div>
      )}

      {/* Grid: Recent Orders + Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#d4af37]/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="font-serif text-lg font-bold text-[#4d0a13] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#d4af37]" />
              Recent Customer Orders
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-[#6b0f1a] hover:underline"
            >
              View All Orders →
            </Link>
          </div>

          {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">No orders placed yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5">Order ID</th>
                    <th className="py-2.5">Customer</th>
                    <th className="py-2.5">Items</th>
                    <th className="py-2.5">Total</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentOrders.map((order) => {
                    const statusClass = 
                      order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-800' :
                      order.orderStatus === 'Preparing' ? 'bg-amber-50 text-amber-800' :
                      order.orderStatus === 'Placed' ? 'bg-blue-50 text-blue-800' :
                      'bg-gray-100 text-gray-700';

                    return (
                      <tr key={order._id} className="hover:bg-[#fdfbf7]">
                        <td className="py-3 font-mono font-bold text-[#4d0a13]">
                          {order.orderNumber}
                        </td>
                        <td className="py-3 font-semibold text-gray-800">
                          {order.shippingAddress?.fullName || order.user?.name || 'Customer'}
                        </td>
                        <td className="py-3 text-gray-500">
                          {order.orderItems?.length || 1} saree{(order.orderItems?.length || 1) > 1 ? 's' : ''}
                        </td>
                        <td className="py-3 font-extrabold text-[#6b0f1a]">
                          ₹{order.totalPrice?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusClass}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Category Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#d4af37]/30 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#4d0a13] pb-3 border-b border-gray-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#d4af37]" />
            Catalog Categories
          </h2>

          <div className="space-y-3">
            {stats?.categoryBreakdown?.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#fdfbf7] border border-gray-100">
                <span className="font-semibold text-gray-700">{cat.category}</span>
                <span className="bg-[#6b0f1a] text-white px-2 py-0.5 rounded-full font-bold text-[10px]">
                  {cat.count} sarees
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Link
              to="/admin/products"
              className="w-full py-2 bg-[#f7f1e5] hover:bg-[#6b0f1a] hover:text-white text-[#6b0f1a] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Manage All Sarees</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
