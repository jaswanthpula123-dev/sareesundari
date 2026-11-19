import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product, 1, '500g');
    removeFromWishlist(product._id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#fcedd8] text-[#6b0f1a] flex items-center justify-center mx-auto text-3xl">
          <Heart className="w-10 h-10 fill-current" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-serif text-[#4d0a13]">
            Your Sweet Wishlist is Empty
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Save the handcrafted delicacies and festive mithai boxes you love to order anytime.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#6b0f1a] hover:bg-[#4d0a13] text-white font-bold text-xs rounded-full shadow-lg transition-all"
        >
          <span>Explore Fresh Sweets</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/30">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#4d0a13]">
            Favorites & Wishlist
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {wishlist.length} traditional sweets saved in your personal box
          </p>
        </div>
        <Link
          to="/shop"
          className="text-xs font-semibold text-[#6b0f1a] hover:underline flex items-center gap-1"
        >
          <span>Continue Exploring</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => {
          const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
          return (
            <div
              key={product._id}
              className="bg-white rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-sm flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-[#fcedd8] overflow-hidden">
                <img
                  src={product.images?.[0] || '/sarees/kanjivaram-1.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-gray-600 hover:text-red-600 rounded-full shadow transition-colors"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a6f14]">
                    {product.category}
                  </span>
                  <Link
                    to={`/products/${product.slug || product._id}`}
                    className="font-serif font-bold text-sm text-gray-900 hover:text-[#6b0f1a] block line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <span className="text-base font-bold text-[#6b0f1a] block mt-1">
                    ₹{activePrice?.toLocaleString('en-IN')} <span className="text-[10px] text-gray-400 font-normal">/ 500g</span>
                  </span>
                </div>

                <button
                  onClick={() => handleMoveToCart(product)}
                  className="w-full py-2.5 bg-[#6b0f1a] text-white rounded-xl text-xs font-bold hover:bg-[#4d0a13] transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Wishlist;
