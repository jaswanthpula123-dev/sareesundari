import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  CheckCircle2,
  X
} from 'lucide-react';
import { useCart, calculateWeightPrice } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const FALLBACK_SWEET_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f7f1e5'/%3E%3Ctext x='50' y='60' font-size='40' text-anchor='middle'%3E%F0%9F%8D%AC%3C/text%3E%3C/svg%3E";

const Cart = () => {
  const {
    items,
    cartCount,
    subtotal,
    tax,
    shipping,
    discountAmount,
    total,
    coupon,
    updateQuantity,
    updateWeight,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    applyCoupon(couponCode);
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#fdfbf7] min-h-[75vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-[#d4af37]/30 shadow-xl space-y-5">
          <div className="w-20 h-20 rounded-full bg-[#fcedd8] border border-[#d4af37]/40 flex items-center justify-center mx-auto shadow-inner">
            <span className="text-4xl">🍬</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#4d0a13]">
            Your Sweet Box is Empty
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            You haven't added any sweets yet! Explore our fresh desi ghee treats, festive laddus, and cashew delicacies.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#6b0f1a] hover:bg-[#4d0a13] text-white font-bold text-sm rounded-full shadow-lg transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Sweets Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfbf7] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title & Clear Cart Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#d4af37]/25">
          <div>
            <h1 className="font-serif text-3xl font-extrabold text-[#4d0a13]">
              Shopping Cart
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              You have {cartCount} box{cartCount > 1 ? 'es' : ''} of handcrafted sweets in your box
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Empty Cart</span>
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-white rounded-2xl p-4 border border-[#d4af37]/30 shadow-xs mb-8">
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-[#4d0a13] flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#d4af37]" />
              {subtotal >= 499 ? (
                <span className="text-emerald-700">🎉 Congratulations! You have unlocked FREE Express Delivery!</span>
              ) : (
                <span>Add ₹{(499 - subtotal).toLocaleString('en-IN')} more to unlock FREE Express Delivery!</span>
              )}
            </span>
            <span className="text-[#6b0f1a]">₹499 Goal</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#d4af37] to-[#6b0f1a] h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (subtotal / 499) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Grid Layout: Cart Items List + Order Cost Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              const itemTotal = item.price * item.quantity;
              const prodId = item.productId || item._id;

              return (
                <div
                  key={`${prodId}_${item.weight}`}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-[#d4af37]/25 shadow-xs hover:border-[#d4af37] transition-all flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
                >
                  {/* Sweet Thumbnail */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#fcedd8] shrink-0 border border-gray-100">
                    <img
                      src={item.image || FALLBACK_SWEET_IMAGE}
                      alt={item.name}
                      onError={(e) => { e.target.src = FALLBACK_SWEET_IMAGE; }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details & Weight Selector */}
                  <div className="flex-1 min-w-0 text-center sm:text-left space-y-1.5 w-full">
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/products/${item.slug || prodId}`}
                        className="font-serif text-base font-bold text-[#4d0a13] hover:text-[#6b0f1a] transition-colors truncate block max-w-xs"
                      >
                        {item.name}
                      </Link>

                      <button
                        onClick={() => removeFromCart(prodId, item.weight)}
                        className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                        title="Remove sweet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-gray-500">
                      Category: <span className="font-medium text-gray-700">{item.category || 'Traditional Mithai'}</span>
                    </div>

                    {/* Weight Selection directly in Cart */}
                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                      <span className="text-xs font-semibold text-gray-600">Weight:</span>
                      {['250g', '500g', '1kg'].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => updateWeight(prodId, item.weight, w)}
                          className={`text-xs px-2.5 py-0.5 rounded-md border font-semibold transition-all ${
                            item.weight === w
                              ? 'bg-[#6b0f1a] text-white border-[#6b0f1a]'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#d4af37]'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>

                    {/* Unit Price & Subtotal */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <span>Price:</span>
                        <strong className="text-[#6b0f1a]">₹{item.price.toLocaleString('en-IN')}</strong>
                        <span className="text-[10px]">/ box</span>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                        <button
                          onClick={() => updateQuantity(prodId, item.quantity - 1, item.weight)}
                          className="p-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-[#4d0a13]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(prodId, item.quantity + 1, item.weight)}
                          className="p-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-sm font-black text-[#6b0f1a]">
                        ₹{itemTotal.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}

            <div className="pt-4 flex justify-between items-center text-xs text-[#6b0f1a]">
              <Link to="/shop" className="font-bold hover:underline flex items-center gap-1">
                ← Continue Shopping for More Sweets
              </Link>
            </div>
          </div>

          {/* Right Column: Order Cost Breakdown Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#d4af37]/30 shadow-lg space-y-5">
              <h2 className="font-serif text-lg font-bold text-[#4d0a13] pb-3 border-b border-gray-100">
                Order Summary
              </h2>

              {/* Coupon Code Section */}
              <div>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon (e.g. SWEET10)"
                      className="w-full pl-9 pr-3 py-2 text-xs uppercase border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#6b0f1a] hover:bg-[#4d0a13] text-white text-xs font-bold rounded-xl shadow transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {coupon && (
                  <div className="mt-2.5 p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                    <span className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {coupon.code} applied (-{coupon.percentage}%)
                    </span>
                    <button onClick={removeCoupon} className="text-gray-400 hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2.5 text-xs text-gray-600 border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST (5% Indian Mithai):</span>
                  <span className="font-semibold text-gray-900">₹{tax.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Delivery Charges:</span>
                  {shipping === 0 ? (
                    <span className="font-bold text-emerald-600 uppercase tracking-wider text-[11px]">
                      FREE
                    </span>
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

                <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline text-base font-extrabold text-[#4d0a13]">
                  <span>Total Amount:</span>
                  <span className="text-2xl text-[#6b0f1a]">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-[#6b0f1a] hover:bg-[#4d0a13] text-white font-bold text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#d4af37]" />
              </button>

              <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cash on Delivery & Secure Express Checkout</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;
