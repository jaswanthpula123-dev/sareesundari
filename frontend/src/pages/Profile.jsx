import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  ChevronRight,
  LogOut,
  ShoppingBag,
  Truck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    orderAPI.getMyOrders()
      .then(res => {
        if (res.success && res.orders) {
          setOrders(res.orders);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingOrders(false));
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <div className="bg-[#fdfbf7] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#6b0f1a] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md border-2 border-[#d4af37]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-extrabold text-[#4d0a13]">{user.name}</h1>
                <span className="text-[10px] font-bold text-[#6b0f1a] bg-[#fcedd8] px-2 py-0.5 rounded-full uppercase">
                  {user.role === 'admin' ? 'Shop Admin' : 'Valued Patron'}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-4">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#d4af37]" /> {user.email}</span>
                {user.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#d4af37]" /> {user.phone}</span>}
              </div>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="px-5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Order History Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#5B0E2D] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#d4af37]" />
                Your Saree Orders
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Track transit status and review your previous royal handloom purchases
              </p>
            </div>
            <Link
              to="/shop"
              className="text-xs font-bold text-[#5B0E2D] hover:underline"
            >
              Order More Sarees →
            </Link>
          </div>

          {loadingOrders ? (
            <div className="py-12 text-center text-xs text-gray-400">Loading your order history...</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <span className="text-4xl block">📦</span>
              <p className="text-xs text-gray-500">You haven't placed any orders yet.</p>
              <Link
                to="/shop"
                className="inline-block px-6 py-2 bg-[#5B0E2D] text-white text-xs font-bold rounded-full shadow hover:bg-[#38050c] transition-all"
              >
                Browse Saree Vault
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusColor = 
                  order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                  order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-800 border-red-200' :
                  'bg-amber-50 text-amber-800 border-amber-200';

                return (
                  <div
                    key={order._id}
                    className="p-5 rounded-2xl border border-gray-200 hover:border-[#d4af37] bg-[#fdfbf7] transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 text-xs">
                      <div>
                        <span className="font-mono font-bold text-[#4d0a13] text-sm block">
                          Order #{order.orderNumber}
                        </span>
                        <span className="text-gray-400 text-[11px]">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                          {order.orderStatus}
                        </span>
                        <span className="font-extrabold text-sm text-[#6b0f1a]">
                          ₹{order.totalPrice?.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Order items row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      {order.orderItems?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 bg-white p-2 rounded-xl border border-gray-100">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-gray-50 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-gray-800 truncate">{item.name}</div>
                            <div className="text-[10px] text-gray-500">
                              {item.weight || '500g'} × {item.quantity} box{item.quantity > 1 ? 'es' : ''}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order tracking timeline progress */}
                    <div className="pt-2 text-[11px] text-gray-500 flex items-center justify-between">
                      <span>Payment: <strong>{order.paymentMethod}</strong> ({order.isPaid ? 'Paid' : 'Pay on Delivery'})</span>
                      <Link
                        to={`/order-success/${order._id || order.orderNumber}`}
                        state={{ order }}
                        className="text-[#6b0f1a] font-bold hover:underline flex items-center gap-1"
                      >
                        View Receipt & Timeline <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
