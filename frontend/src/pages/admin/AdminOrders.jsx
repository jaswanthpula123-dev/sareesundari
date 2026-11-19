import React, { useState, useEffect } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Filter,
  Eye,
  X,
  MapPin,
  Banknote
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const statusList = ['All', 'Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { addToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getOrders({
        status: statusFilter !== 'All' ? statusFilter : undefined
      });
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error(err);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await adminAPI.updateOrderStatus(orderId, {
        status: newStatus,
        note: `Status updated to ${newStatus} by Sweet Magic store owner.`
      });

      if (res.success) {
        addToast(`Order updated to "${newStatus}"!`);
        setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
        }
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d4af37]/20">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#4d0a13]">
            Customer Sweet Orders
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Track kitchen preparation, delivery dispatches, and doorstep cash payments.
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {statusList.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === st
                ? 'bg-[#6b0f1a] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#d4af37]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#d4af37]/30 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-400">Loading sweet orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400">No orders found for status: {statusFilter}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fdfbf7] border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Sweets Ordered</th>
                  <th className="py-3 px-4">Total & Payment</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  return (
                    <tr key={order._id} className="hover:bg-[#fdfbf7] transition-colors">
                      
                      {/* Order Number & Date */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-[#4d0a13] block">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">
                          {order.shippingAddress?.fullName || order.user?.name || 'Customer'}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {order.shippingAddress?.mobile || order.user?.phone || 'No phone'}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {order.shippingAddress?.city}, {order.shippingAddress?.state}
                        </div>
                      </td>

                      {/* Sweets items */}
                      <td className="py-3 px-4">
                        <div className="space-y-1 max-w-xs">
                          {order.orderItems?.map((it, idx) => (
                            <div key={idx} className="text-[11px] text-gray-700 truncate">
                              <strong>{it.name}</strong> ({it.weight || '500g'}) × {it.quantity}
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total & Payment */}
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-[#6b0f1a] text-sm">
                          ₹{order.totalPrice?.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <Banknote className="w-3 h-3" />
                          {order.paymentMethod || 'Cash'}
                        </div>
                      </td>

                      {/* Status Dropdown Controller */}
                      <td className="py-3 px-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="bg-[#fdfbf7] border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#6b0f1a]"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Preparing">Preparing in Kitchen</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* View Details modal button */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg bg-[#f7f1e5] hover:bg-[#6b0f1a] hover:text-white text-[#6b0f1a] transition-colors"
                          title="View Full Order"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#d4af37]/40 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#4d0a13]">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <span className="text-[10px] text-gray-400">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address */}
            <div className="bg-[#fdfbf7] p-4 rounded-2xl border border-gray-200 text-xs space-y-1.5">
              <span className="font-bold text-[#4d0a13] block text-sm">Delivery Address</span>
              <p className="text-gray-700 leading-relaxed">
                <strong>{selectedOrder.shippingAddress?.fullName}</strong> ({selectedOrder.shippingAddress?.mobile})<br />
                {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}<br />
                Email: {selectedOrder.shippingAddress?.email || selectedOrder.user?.email}
              </p>
            </div>

            {/* Items list */}
            <div className="space-y-2">
              <span className="font-bold text-xs text-gray-700 block">Sweets in this Box:</span>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl p-3 bg-white">
                {selectedOrder.orderItems?.map((it, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-gray-800">{it.name}</div>
                      <div className="text-[10px] text-gray-500">Weight: {it.weight || '500g'} × {it.quantity}</div>
                    </div>
                    <div className="font-black text-[#6b0f1a]">
                      ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800">Total Invoice Amount:</span>
              <span className="text-xl font-black text-[#6b0f1a]">
                ₹{selectedOrder.totalPrice?.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-[#6b0f1a] text-white text-xs font-bold rounded-xl shadow"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrders;
