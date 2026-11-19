import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, Zap, Check, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductQuickViewModal = ({ product, onClose }) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const isFavorited = isInWishlist(product._id);
  const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discountPercent = product.discountPercentage || 
    (product.discountPrice > 0 ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0);

  const images = product.images?.length > 0 ? product.images : [
    '/sarees/kanjivaram-1.jpg'
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#D4AF37]/40 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Media */}
          <div className="p-6 bg-[#F8F3EA] flex flex-col justify-between">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden relative shadow-md bg-white">
              <img
                src={images[selectedImage] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-top"
              />
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-[#5B0E2D] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-[#5B0E2D] scale-105' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A27B1E]">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-600 text-xs font-semibold">
                  <Star className="w-4 h-4 fill-current text-[#D4AF37]" />
                  <span>{product.rating || 4.8}</span>
                  <span className="text-gray-400">({product.numReviews || 12} reviews)</span>
                </div>
              </div>

              <h2 className="font-serif text-2xl font-bold text-[#2D2A26] mb-2 leading-tight">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-extrabold text-[#5B0E2D]">
                  ₹{activePrice.toLocaleString('en-IN')}
                </span>
                {discountPercent > 0 && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded">
                  Inclusive of all taxes
                </span>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                {product.description}
              </p>

              <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#D4AF37]/30 text-xs space-y-1 mb-5">
                <div><strong className="text-gray-700">Fabric:</strong> {product.fabric}</div>
                <div><strong className="text-gray-700">Work:</strong> {product.work || 'Pure Zari'}</div>
                <div><strong className="text-gray-700">Blouse:</strong> {product.blousePiece || 'Included (0.8m)'}</div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm font-bold hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    className="px-3 py-1 text-sm font-bold hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  {product.stock > 0 ? `${product.stock} units in loom` : 'Sold out'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="py-3 px-4 rounded-xl border-2 border-[#5B0E2D] text-[#5B0E2D] hover:bg-[#5B0E2D] hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#A27B1E] via-[#D4AF37] to-[#A27B1E] text-[#2B0411] font-bold text-xs flex items-center justify-center gap-2 transition-all hover:brightness-110 shadow-md"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* WhatsApp Quick Inquire */}
              <a
                href={`https://wa.me/919346638123?text=${encodeURIComponent(`Namaste! I would like to ask about the "${product.name}" (Price: ₹${activePrice.toLocaleString('en-IN')}) from Saree Sundarii.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366] text-[#075E54] hover:text-white border border-[#25D366]/40 font-bold text-[11px] flex items-center justify-center gap-2 transition-all"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.155.571 4.184 1.572 5.945l-1.668 6.096 6.275-1.646c1.704.93 3.655 1.458 5.727 1.458 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>Ask Stylist on WhatsApp</span>
              </a>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => toggleWishlist(product)}
                  className="text-xs text-gray-600 hover:text-[#5B0E2D] flex items-center gap-1.5 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#D43F6C] text-[#D43F6C]' : ''}`} />
                  <span>{isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>

                <Link
                  to={`/products/${product.slug || product._id}`}
                  onClick={onClose}
                  className="text-xs font-semibold text-[#5B0E2D] hover:underline flex items-center gap-1"
                >
                  <span>Full Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickViewModal;
