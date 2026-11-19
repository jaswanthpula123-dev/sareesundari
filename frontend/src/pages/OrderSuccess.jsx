import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Clock,
  Printer,
  ShoppingBag,
  Sparkles,
  MapPin,
  Banknote
} from 'lucide-react';
import { orderAPI } from '../services/api';

const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (!order && id) {
      orderAPI.getOrderById(id)
        .then(res => {
          if (res.success && res.order) {
            setOrder(res.order);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#6b0f1a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-gray-500">Retrieving your saree order receipt...</p>
      </div>
    );
  }

  const orderNum = order?.orderNumber || id || 'SS-ORDER';

  return (
    <div className="bg-[#fdfbf7] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Celebration Header Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#d4af37]/40 shadow-xl text-center space-y-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500/40 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcedd8] text-[#6b0f1a] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Order Confirmed & Received</span>
          </div>

          <h1 className="font-serif text-3xl font-extrabold text-[#5B0E2D]">
            Thank You for Choosing Saree Sundarii!
          </h1>

          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Your pure Silk Mark certified handloom saree is being carefully inspected, packed in heritage unbleached muslin, and prepared for insured transit.
          </p>

          <div className="p-4 rounded-2xl bg-[#fffaf3] border border-[#d4af37]/30 max-w-sm mx-auto flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Order Tracking ID</span>
              <span className="font-mono text-sm font-extrabold text-[#6b0f1a]">{orderNum}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Payment Method</span>
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                {order?.paymentMethod || 'Cash on Delivery'}
              </span>
            </div>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-md space-y-6 mb-8">
            <h2 className="font-serif text-lg font-bold text-[#4d0a13] pb-3 border-b border-gray-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#d4af37]" />
              Order Summary & Items Breakdown
            </h2>

            {/* Items */}
            <div className="divide-y divide-gray-100">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-50 border" />
                    )}
                    <div>
                      <div className="font-bold text-gray-900">{item.name}</div>
                      <div className="text-gray-500 text-[11px]">
                        Weight: <strong className="text-[#6b0f1a]">{item.weight || '500g'}</strong> • Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-black text-[#6b0f1a] text-sm">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="pt-4 border-t border-gray-100 text-xs">
                <span className="font-bold text-gray-700 block mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                  Delivery Destination:
                </span>
                <p className="text-gray-600 leading-relaxed bg-[#fdfbf7] p-3 rounded-xl border border-gray-100">
                  <strong>{order.shippingAddress.fullName}</strong> ({order.shippingAddress.mobile})<br />
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
              </div>
            )}

            {/* Total */}
            <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
              <span className="text-sm font-bold text-gray-700">Final Order Total:</span>
              <span className="text-2xl font-black text-[#6b0f1a]">
                ₹{order.totalPrice?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/shop"
            className="px-8 py-3.5 bg-[#6b0f1a] hover:bg-[#4d0a13] text-white font-bold text-xs rounded-full shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>

          <Link
            to="/profile"
            className="px-8 py-3.5 bg-white border border-[#d4af37] text-[#6b0f1a] hover:bg-[#f7f1e5] font-bold text-xs rounded-full shadow transition-all flex items-center justify-center gap-2"
          >
            <span>View Order History</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;
