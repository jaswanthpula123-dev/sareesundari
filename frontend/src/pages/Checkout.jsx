import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Banknote,
  Smartphone,
  CreditCard,
  Building2,
  Package
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const FALLBACK_SWEET_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f7f1e5'/%3E%3Ctext x='50' y='60' font-size='40' text-anchor='middle'%3E%F0%9F%8D%AC%3C/text%3E%3C/svg%3E";

const Checkout = () => {
  const { items, subtotal, tax, shipping, discountAmount, total, coupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Shipping details state
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    mobile: user?.phone || '',
    email: user?.email || '',
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || 'Telangana',
    pincode: user?.addresses?.[0]?.pincode || '',
    deliveryNote: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash'); // Default Cash as requested
  const [placingOrder, setPlacingOrder] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      addToast('Your sweet cart is empty!', 'error');
      navigate('/shop');
      return;
    }

    if (!formData.fullName || !formData.mobile || !formData.street || !formData.city || !formData.pincode) {
      addToast('Please fill in all delivery details', 'error');
      return;
    }

    try {
      setPlacingOrder(true);

      const orderPayload = {
        orderItems: items.map(item => ({
          product: item.productId || item._id,
          name: item.name,
          image: item.image || FALLBACK_SWEET_IMAGE,
          weight: item.weight || '500g',
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: formData.fullName,
          mobile: formData.mobile,
          email: formData.email || 'customer@sweetmagic.com',
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        paymentMethod: paymentMethod,
        couponApplied: coupon?.code || '',
        discountAmount: discountAmount || 0
      };

      const res = await orderAPI.createOrder(orderPayload);

      if (res.success && res.order) {
        await clearCart();
        addToast('Order placed successfully! Fresh sweets are being prepared 🍬');
        navigate(`/order-success/${res.order._id || res.order.orderNumber}`, {
          state: { order: res.order }
        });
      }
    } catch (err) {
      console.error('Order creation error:', err);
      addToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <span className="text-5xl block mb-4">🍬</span>
        <h2 className="font-serif text-2xl font-bold text-[#4d0a13] mb-2">Cart is Empty</h2>
        <p className="text-sm text-gray-600 mb-6">Add your favorite sweets to proceed with checkout.</p>
        <Link to="/shop" className="px-6 py-2.5 bg-[#6b0f1a] text-white text-xs font-bold rounded-full shadow">
          Explore Sweets Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfbf7] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="pb-6 mb-8 border-b border-[#d4af37]/25">
          <h1 className="font-serif text-3xl font-extrabold text-[#4d0a13]">
            Checkout & Delivery
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Provide your address to receive fresh, pure desi ghee sweets at your doorstep.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 8 Cols: Delivery Form & Payment Selection */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 1: Customer & Delivery Details */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-sm space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-[#6b0f1a] text-white font-bold flex items-center justify-center text-xs shadow">
                    1
                  </div>
                  <h2 className="font-serif text-lg font-bold text-[#4d0a13]">
                    Delivery Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Aarav Sharma"
                      required
                      className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="e.g. 9876543210"
                      required
                      className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. aarav@example.com"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Complete Street Address (Flat / House No., Landmark) *
                  </label>
                  <textarea
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="e.g. Flat 302, Palm Meadows, Main Road, Near Ganesha Temple"
                    required
                    className="w-full px-3.5 py-2 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Hyderabad / Bengaluru"
                      required
                      className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g. Telangana / Karnataka"
                      required
                      className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="e.g. 500034"
                      required
                      className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Options */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-[#6b0f1a] text-white font-bold flex items-center justify-center text-xs shadow">
                    2
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#4d0a13]">
                      Payment Method
                    </h2>
                    <p className="text-xs text-gray-500">Choose your preferred payment option</p>
                  </div>
                </div>

                <div className="space-y-3">
                  
                  {/* Cash / Cash on Delivery Option (Default & Requested) */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'Cash' || paymentMethod === 'COD'
                        ? 'border-[#6b0f1a] bg-[#fffaf3] shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash"
                      checked={paymentMethod === 'Cash' || paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('Cash')}
                      className="mt-1 text-[#6b0f1a] focus:ring-[#6b0f1a]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#4d0a13] flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-emerald-600" />
                          Cash / Cash on Delivery (COD)
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Pay in cash at your doorstep when your fresh sweet box is handed to you. Zero advance risk.
                      </p>
                    </div>
                  </label>

                  {/* UPI / QR Code Option */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-[#6b0f1a] bg-[#fffaf3] shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="mt-1 text-[#6b0f1a] focus:ring-[#6b0f1a]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#4d0a13] flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-[#d4af37]" />
                          UPI / Google Pay / PhonePe / Paytm
                        </span>
                        <span className="text-[10px] font-medium text-gray-500">
                          Instant
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Scan QR code or pay via your preferred UPI app upon checkout.
                      </p>
                    </div>
                  </label>

                  {/* Credit / Debit Card Option */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'Card'
                        ? 'border-[#6b0f1a] bg-[#fffaf3] shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Card"
                      checked={paymentMethod === 'Card'}
                      onChange={() => setPaymentMethod('Card')}
                      className="mt-1 text-[#6b0f1a] focus:ring-[#6b0f1a]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#4d0a13] flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#9a6f14]" />
                          Credit / Debit Card (Visa, MasterCard, RuPay)
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Fast and encrypted payment processing.
                      </p>
                    </div>
                  </label>

                </div>
              </div>

            </div>

            {/* Right 5 Cols: Order Summary & Place Order CTA */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-[#d4af37]/30 shadow-lg space-y-5 sticky top-28">
                
                <h3 className="font-serif text-lg font-bold text-[#4d0a13] pb-3 border-b border-gray-100 flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#d4af37]" />
                  Order Summary ({items.length} items)
                </h3>

                {/* Items preview list */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <div className="w-12 h-12 rounded-lg bg-[#fcedd8] overflow-hidden shrink-0 border border-gray-100">
                        <img
                          src={item.image || FALLBACK_SWEET_IMAGE}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#4d0a13] truncate">{item.name}</div>
                        <div className="text-gray-500 text-[11px]">
                          {item.weight || '500g'} × {item.quantity} box{item.quantity > 1 ? 'es' : ''}
                        </div>
                      </div>
                      <div className="font-black text-[#6b0f1a]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing totals */}
                <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-4">
                  <div className="flex justify-between">
                    <span>Items Subtotal:</span>
                    <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST (5% Indian Mithai):</span>
                    <span className="font-semibold text-gray-900">₹{tax.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Delivery Charges:</span>
                    {shipping === 0 ? (
                      <span className="font-bold text-emerald-600 uppercase text-[11px]">FREE</span>
                    ) : (
                      <span className="font-semibold text-gray-900">₹{shipping}</span>
                    )}
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Coupon Discount:</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline text-lg font-black text-[#4d0a13]">
                    <span>Total Amount:</span>
                    <span className="text-2xl text-[#6b0f1a]">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={placingOrder}
                  className="w-full py-4 bg-[#6b0f1a] hover:bg-[#4d0a13] text-white font-bold text-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group"
                >
                  <Lock className="w-4 h-4 text-[#d4af37]" />
                  <span>{placingOrder ? 'Confirming Sweet Order...' : `Place Order (₹${total.toLocaleString('en-IN')})`}</span>
                </button>

                <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Satisfaction Guarantee | Fresh Batch Shipped Daily</span>
                </div>

              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};

export default Checkout;
