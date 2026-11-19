import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Zap, Award, Check, Crown } from 'lucide-react';
import { useCart, calculateWeightPrice } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const FALLBACK_SAREE_IMAGE = "/sarees/kanjivaram-1.jpg";

const ProductCard = ({ product, onQuickView }) => {
  const [selectedWeight, setSelectedWeight] = useState(
    product?.weightOptions?.[0] || 'Standard (6.3m with Blouse)'
  );
  const [imgSrc, setImgSrc] = useState(
    product?.images?.[0] || FALLBACK_SAREE_IMAGE
  );

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  if (!product) return null;

  const isFavorited = isInWishlist(product._id);
  const basePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const currentPrice = calculateWeightPrice(basePrice, selectedWeight);
  const currentOriginalPrice = calculateWeightPrice(product.price, selectedWeight);
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0 || product.availability === 'Out of Stock';
  const isFewLeft = product.stock > 0 && product.stock <= 3;

  const handleWeightClick = (e, weight) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedWeight(weight);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1, selectedWeight);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1, selectedWeight);
    navigate('/checkout');
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-[#d4af37]/25 hover:border-[#5B0E2D] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Image & Badges */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#fbf6ec]">
        <Link to={`/products/${product.slug || product._id}`} className="block w-full h-full">
          <img
            src={imgSrc}
            alt={product.name}
            onError={() => setImgSrc(FALLBACK_SAREE_IMAGE)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Top Badges (Discount, Silk Mark, Bestseller) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-[#5B0E2D] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow tracking-wide">
              {discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#d4af37] text-[#24030F] text-[10px] font-extrabold px-2 py-0.5 rounded shadow flex items-center gap-1">
              <Crown className="w-3 h-3" /> Heirloom
            </span>
          )}
          {product.isFestivalSpecial && (
            <span className="bg-amber-800 text-amber-100 text-[9px] font-semibold px-1.5 py-0.5 rounded shadow">
              Bridal Special
            </span>
          )}
        </div>

        {/* Pure Silk Mark & Wishlist Button */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <div
            title="Silk Mark Certified Pure Natural Silk"
            className="w-6 h-6 bg-white/95 backdrop-blur-xs rounded-full border border-[#d4af37] flex items-center justify-center shadow"
          >
            <Award className="w-3.5 h-3.5 text-[#9a6f14]" />
          </div>

          <button
            onClick={handleWishlistClick}
            aria-label="Save to Wishlist"
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-400 hover:text-red-600 shadow transition-all hover:scale-110"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorited ? 'fill-red-600 text-red-600' : 'stroke-current'
              }`}
            />
          </button>
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="bg-red-800 text-white font-bold text-xs px-3 py-1.5 rounded-md uppercase tracking-wider shadow">
              Reserved / Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#9a6f14] font-semibold uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.9}</span>
              <span className="text-gray-400 text-[10px] font-normal">
                ({product.numReviews || 85})
              </span>
            </div>
          </div>

          {/* Saree Name */}
          <Link
            to={`/products/${product.slug || product._id}`}
            className="block font-serif text-base font-bold text-[#2b1f1d] hover:text-[#5B0E2D] transition-colors line-clamp-1 mb-1"
          >
            {product.name}
          </Link>

          {/* Brief Description */}
          <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>

          {/* Saree Length & Blouse Selection */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
              <span>Drape / Blouse Piece:</span>
              <span className="font-semibold text-[#5B0E2D] truncate max-w-[140px]">{selectedWeight}</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {(product.weightOptions || ['Standard (6.3m with Blouse)']).slice(0, 2).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={(e) => handleWeightClick(e, w)}
                  className={`py-1 px-2 text-[10px] font-semibold rounded-lg border text-left truncate transition-all ${
                    selectedWeight === w
                      ? 'bg-[#5B0E2D] text-white border-[#5B0E2D] shadow-xs'
                      : 'bg-[#fdfbf7] text-[#2b1f1d] border-gray-200 hover:border-[#d4af37]'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Stock / Authenticity Indicator */}
          <div className="mb-2 text-[11px] flex items-center justify-between">
            {isOutOfStock ? (
              <span className="text-red-600 font-semibold">Reserved on Loom</span>
            ) : isFewLeft ? (
              <span className="text-amber-700 font-semibold flex items-center gap-1 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping"></span>
                Only {product.stock} pieces handwoven!
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                Pure Handloom Ready
              </span>
            )}
            
            <span className="text-[10px] text-[#5B0E2D] font-bold bg-[#fcedd8] px-1.5 py-0.5 rounded">
              Silk Mark Certified
            </span>
          </div>
        </div>

        {/* Pricing & CTA Buttons */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-[#5B0E2D]">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ₹{currentOriginalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-[10px] text-gray-500 font-normal">
              incl. GST
            </span>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#f7f1e5] hover:bg-[#5B0E2D] text-[#5B0E2D] hover:text-white border border-[#d4af37]/40 shadow-xs'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#5B0E2D] hover:bg-[#38050c] text-white shadow hover:shadow-md'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Buy Drape</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
