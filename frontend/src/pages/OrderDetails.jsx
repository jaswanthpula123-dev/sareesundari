import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  AlertCircle,
  Printer,
  Banknote
} from 'lucide-react';
import { orderAPI } from '../services/api';

const statusSteps = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getOrderById(id)
      .then((res) => {
        if (res.success && res.order) setOrder(res.order);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#6b0f1a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Retrieving saree order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold font-serif text-[#4d0a13]">Order Not Found</h2>
        <p className="text-sm text-gray-500">Could not locate order #{id}.</p>
        <Link to="/profile" className="inline-block px-6 py-2.5 bg-[#6b0f1a] text-white rounded-xl text-xs font-bold shadow">
          View All My Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 bg-[#fdfbf7] min-h-screen">
      
      {/* Back link & Title */}
      <div className="flex items-center justify-between">
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b0f1a] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile & Orders</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-1.5 border border-gray-300 rounded-xl text-xs font-semibold hover:bg-gray-50 flex items-center gap-1.5 bg-white shadow-2xs"
        >
          <Printer className="w-3.5 h-3.5 text-gray-600" />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* Order Status & Tracking Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-md space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold">Order Tracking</span>
            <h1 className="font-mono text-xl sm:text-2xl font-bold text-[#4d0a13]">{order.orderNumber}</h1>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 uppercase font-semibold">Placed On</span>
            <p className="text-xs font-bold text-gray-700">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Visual Progress Steps */}
        <div className="py-4">
          <div className="relative flex items-center justify-between max-w-xl mx-auto">
            {/* Horizontal Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-[#6b0f1a] -translate-y-1/2 z-0 transition-all duration-500"
              style={{
                width: `${Math.max(0, (currentStepIndex / (statusSteps.length - 1)) * 100)}%`
              }}
            />

            {statusSteps.map((step, idx) => {
              const isPassed = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isPassed
                        ? 'bg-[#6b0f1a] text-white shadow-md'
                        : 'bg-white text-gray-400 border-2 border-gray-200'
                    } ${isCurrent ? 'ring-4 ring-[#d4af37]/40 scale-110' : ''}`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-2 ${
                      isPassed ? 'text-[#6b0f1a]' : 'text-gray-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs border-t border-gray-100 pt-6">
          <div>
            <h3 className="font-serif font-bold text-sm text-[#4d0a13] mb-2">Delivery Recipient</h3>
            <p className="font-bold text-gray-800 text-sm">{order.shippingAddress?.fullName}</p>
            <p className="text-gray-600 mt-1">
              {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </p>
            <p className="text-gray-600 mt-1">Mobile: {order.shippingAddress?.mobile}</p>
          </div>

          <div>
            <h3 className="font-serif font-bold text-sm text-[#4d0a13] mb-2">Payment Details</h3>
            <p className="text-gray-600">Method: <strong className="text-gray-800">{order.paymentMethod}</strong></p>
            <p className="text-gray-600 mt-1">
              Status: <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{order.isPaid ? 'Payment Confirmed' : 'Payment on Delivery'}</span>
            </p>
            <p className="text-gray-600 mt-1 font-bold text-base text-[#6b0f1a]">
              Total Paid: ₹{order.totalPrice?.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="font-serif font-bold text-sm text-[#5B0E2D] mb-3">Handcrafted Sarees in this Order</h3>
          <div className="space-y-3">
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#fdfbf7] rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-lg border border-gray-300" />
                  <div>
                    <p className="font-bold text-xs text-gray-800">{item.name}</p>
                    <p className="text-[10px] text-gray-500">Weight: {item.weight || '500g'} • Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-black text-xs text-[#6b0f1a]">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default OrderDetails;
