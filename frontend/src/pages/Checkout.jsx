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
  Package,
  Crown
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const FALLBACK_SAREE_IMAGE = "/sarees/kanjivaram-1.jpg";

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

  const [paymentMethod, setPaymentMethod] = useState('Cash'); // Cash on Delivery
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
      addToast('Your saree bag is empty!', 'error');
      navigate('/shop');
      return;
    }

    if (!formData.fullName || !formData.mobile || !formData.street || !formData.city || !formData.pincode) {
      addToast('Please fill in all shipping details', 'error');
      return;
    }

    try {
      setPlacingOrder(true);

      const orderPayload = {
        orderItems: items.map(item => ({
          product: item.productId || item._id,
          name: item.name,
          image: item.image || FALLBACK_SAREE_IMAGE,
          weight: item.weight || 'Standard (6.3m with Blouse)',
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: formData.fullName,
          mobile: formData.mobile,
          email: formData.email || 'concierge@sareesundarii.com',
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
        addToast('Auspicious order confirmed! Your heirloom saree is being packed in royal muslin ✨');
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
        <Crown className="w-16 h-16 text-[#5B0E2D] mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-[#5B0E2D] mb-2">Shopping Bag is Empty</h2>
        <p className="text-sm text-gray-600 mb-6">Explore our curated handloom collections to begin your heirloom drape order.</p>
        <Link to="/shop" className="px-6 py-2.5 bg-[#5B0E2D] text-white text-xs font-bold rounded-full shadow hover:bg-[#38050c] transition-all">
          Explore Saree Vault
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfbf7] min-h-screen py-8 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="pb-6 mb-8 border-b border-[#d4af37]/25">
          <h1 className="font-serif text-3xl font-extrabold text-[#5B0E2D]">
            Insured Checkout & Transit
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Provide your address to receive your certified Silk Mark handloom saree in tamper-proof heritage packaging.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 7 Cols: Delivery Form & Payment Selection */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 1: Customer & Delivery Details */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-sm space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-[#5B0E2D] text-white font-bold flex items-center justify-center text-xs shadow">
                    1
                  </div>
                  <h2 className="font-serif text-lg font-bold text-[#5B0E2D]">
                    Shipping & Delivery Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Radhika Sharma"
                      className="w-full px-4 py-2.5 bg-[#fdfbf7] border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#5B0E2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Mobile Number (for Courier & Tracking) *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      required
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="e.g. 9346638123"
                      className="w-full px-4 py-2.5 bg-[#fdfbf7] border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#5B0E2D]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Email Address (Order Invoice & Tracking)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@domain.com"
                      className="w-full px-4 py-2.5 bg-[#fdfbf7] border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#5B0E2D]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Street Address & Landmark *
                    </label>
                    <input
                      type="text"
                      name="street"
                      required
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="Flat/House No., Building, Landmark"
                      className="w-full px-4 py-2.5 bg-[#fdfbf7] border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#5B0E2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Hyderabad / Chennai / Mumbai"
                      className="w-full px-4 py-2.5 bg-[#fdfbf7] border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#5B0E2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g. Telangana"
                      className="w-full px-4 py-2.5 bg-[#fdfbf7] border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#5B0E2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="e.g. 500034"
                      className="w-full px-4 py-2.5 bg-[#fdfbf7] border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#5B0E2D]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-[#5B0E2D] text-white font-bold flex items-center justify-center text-xs shadow">
                    2
                  </div>
                  <h2 className="font-serif text-lg font-bold text-[#5B0E2D]">
                    Payment Mode
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* Cash on Delivery Option */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'Cash'
                        ? 'border-[#5B0E2D] bg-[#fffaf3] shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash"
                      checked={paymentMethod === 'Cash'}
                      onChange={() => setPaymentMethod('Cash')}
                      className="mt-1 text-[#5B0E2D] focus:ring-[#5B0E2D]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#5B0E2D] flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-[#d4af37]" />
                          Cash on Delivery (Pay upon arrival)
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Safe & Insured
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Inspect the tamper-proof sealed parcel at your doorstep and pay safely in cash or UPI.
                      </p>
                    </div>
                  </label>

                  {/* UPI Option */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-[#5B0E2D] bg-[#fffaf3] shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="mt-1 text-[#5B0E2D] focus:ring-[#5B0E2D]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#5B0E2D] flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-[#d4af37]" />
                          UPI (Google Pay / PhonePe / Paytm / BHIM)
                        </span>
                        <span className="text-[10px] font-medium text-gray-500">
                          Instant
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Scan QR code or pay via your preferred UPI app with zero transaction fee.
                      </p>
                    </div>
                  </label>

                  {/* Card Option */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'Card'
                        ? 'border-[#5B0E2D] bg-[#fffaf3] shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Card"
                      checked={paymentMethod === 'Card'}
                      onChange={() => setPaymentMethod('Card')}
                      className="mt-1 text-[#5B0E2D] focus:ring-[#5B0E2D]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#5B0E2D] flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#9a6f14]" />
                          Credit / Debit Card (Visa, MasterCard, RuPay, Amex)
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        256-bit bank-grade SSL encrypted gateway.
                      </p>
                    </div>
                  </label>

                </div>
              </div>

            </div>

            {/* Right 5 Cols: Order Summary & Place Order CTA */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-[#d4af37]/30 shadow-lg space-y-5 sticky top-28">
                
                <h3 className="font-serif text-lg font-bold text-[#5B0E2D] pb-3 border-b border-gray-100 flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#d4af37]" />
                  Order Summary ({items.length} drapes)
                </h3>

                {/* Items preview list */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <div className="w-12 h-12 rounded-lg bg-[#fcedd8] overflow-hidden shrink-0 border border-gray-100">
                        <img
                          src={item.image || FALLBACK_SAREE_IMAGE}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#5B0E2D] truncate">{item.name}</div>
                        <div className="text-gray-500 text-[11px]">
                          {item.weight || 'Standard (6.3m)'} × {item.quantity}
                        </div>
                      </div>
                      <div className="font-black text-[#5B0E2D]">
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
                    <span>GST (5% Handloom Silk):</span>
                    <span className="font-semibold text-gray-900">₹{tax.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Insured Shipping:</span>
                    {shipping === 0 ? (
                      <span className="font-bold text-emerald-600 uppercase text-[11px]">COMPLIMENTARY</span>
                    ) : (
                      <span className="font-semibold text-gray-900">₹{shipping}</span>
                    )}
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Festive Coupon Discount:</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline text-lg font-black text-[#5B0E2D]">
                    <span>Total Amount:</span>
                    <span className="text-2xl text-[#5B0E2D]">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={placingOrder}
                  className="w-full py-4 bg-[#5B0E2D] hover:bg-[#38050c] text-white font-bold text-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#d4af37]" />
                  <span>{placingOrder ? 'Confirming Heirloom Order...' : `Place Order (₹${total.toLocaleString('en-IN')})`}</span>
                </button>

                <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Silk Mark Authenticity Guaranteed | Direct From Loom</span>
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
