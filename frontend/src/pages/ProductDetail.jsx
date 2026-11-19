import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Zap,
  Heart,
  Truck,
  ShieldCheck,
  Award,
  Clock,
  Flame,
  CheckCircle2,
  ChevronRight,
  Plus,
  Minus,
  MessageSquare,
  Crown
} from 'lucide-react';
import { productAPI } from '../services/api';
import { useCart, calculateWeightPrice } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/product/ProductCard';

const FALLBACK_SAREE_IMAGE = "/sarees/kanjivaram-1.jpg";

const ProductDetail = () => {
  const { slugOrId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // Saree selections
  const [selectedWeight, setSelectedWeight] = useState('Standard (6.3m with Blouse)');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productAPI.getByIdOrSlug(slugOrId);
        if (res.success && res.product) {
          setProduct(res.product);
          setReviews(res.reviews || []);
          setRelated(res.related || []);
          // set default weight
          if (res.product.weightOptions && res.product.weightOptions.length > 0) {
            setSelectedWeight(res.product.weightOptions[1] || res.product.weightOptions[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching saree details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slugOrId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-[#5B0E2D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-gray-500">Preparing handcrafted saree details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Crown className="w-12 h-12 text-[#5B0E2D] mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-[#5B0E2D] mb-2">Heirloom Saree Not Found</h2>
        <p className="text-sm text-gray-600 mb-6">This handloom drape might have been reserved or moved.</p>
        <Link to="/shop" className="px-6 py-2.5 bg-[#5B0E2D] text-white text-xs font-bold rounded-full shadow hover:bg-[#38050c] transition-all">
          Explore Saree Vault
        </Link>
      </div>
    );
  }

  const basePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const currentPrice = calculateWeightPrice(basePrice, selectedWeight);
  const originalPrice = calculateWeightPrice(product.price, selectedWeight);
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const isFavorited = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0 || product.availability === 'Out of Stock';

  const images = (product.images && product.images.length > 0) ? product.images : [FALLBACK_SAREE_IMAGE];

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedWeight);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedWeight);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please login to leave a review', 'error');
      navigate('/login');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await productAPI.addReview(product._id, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment
      });

      if (res.success) {
        addToast('Review submitted successfully! Thank you ✨');
        setReviews([res.review, ...reviews]);
        setReviewTitle('');
        setReviewComment('');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-[#fdfbf7] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#5B0E2D]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-[#5B0E2D]">Shop All Sarees</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#5B0E2D]">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#5B0E2D] font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-sm mb-12">
          
          {/* Left Gallery (Thumbnails + Main Image) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#fbf6ec] border border-[#d4af37]/20 shadow-inner">
              <img
                src={images[activeImageIndex] || FALLBACK_SAREE_IMAGE}
                alt={product.name}
                onError={(e) => { e.target.src = FALLBACK_SAREE_IMAGE; }}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Discount Tag */}
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-[#6b0f1a] text-white text-xs font-bold px-3 py-1 rounded-md shadow">
                  {discountPercent}% OFF
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                aria-label="Save to Wishlist"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-400 hover:text-red-600 shadow transition-all hover:scale-110"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-600 text-red-600' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? 'border-[#6b0f1a] scale-105 shadow' : 'border-gray-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Information */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              {/* Badges Bar */}
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold text-[#9a6f14] tracking-wider bg-[#fcedd8] px-2.5 py-1 rounded-md">
                  {product.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Silk Mark Certified
                </span>
                <span className="text-[11px] font-semibold text-[#6b0f1a] bg-[#fffaf3] border border-[#d4af37]/40 px-2 py-0.5 rounded-md">
                  Tested 24K Gold Zari
                </span>
              </div>

              {/* Product Title */}
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#4d0a13]">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="ml-1 text-sm">{product.rating || 4.9}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 font-medium">
                  {product.numReviews || reviews.length || 150} Verified Customer Reviews
                </span>
              </div>

              {/* Dynamic Price Display */}
              <div className="pt-2 pb-3 border-y border-gray-100 flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#6b0f1a]">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <span className="text-base text-gray-400 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  (Inclusive of all taxes for <strong className="text-[#6b0f1a]">{selectedWeight}</strong>)
                </span>
              </div>

              {/* Detailed Description */}
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.description}
              </p>

              {/* Weight Options Selector */}
              <div>
                <label className="text-xs font-bold text-[#2b1f1d] block mb-2">
                  Select Weight Box:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(product.weightOptions || ['250g', '500g', '1kg']).map((w) => {
                    const priceForW = calculateWeightPrice(basePrice, w);
                    return (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setSelectedWeight(w)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          selectedWeight === w
                            ? 'bg-[#6b0f1a] text-white border-[#6b0f1a] shadow-md'
                            : 'bg-[#fdfbf7] text-[#2b1f1d] border-gray-200 hover:border-[#d4af37]'
                        }`}
                      >
                        <div className="text-sm font-bold">{w}</div>
                        <div className={`text-xs mt-0.5 ${selectedWeight === w ? 'text-[#fcedd8]' : 'text-gray-500'}`}>
                          ₹{priceForW.toLocaleString('en-IN')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-[#2b1f1d]">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-[#4d0a13]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  Total: <strong className="text-[#6b0f1a]">₹{(currentPrice * quantity).toLocaleString('en-IN')}</strong>
                </div>
              </div>

            </div>

            {/* CTAs: Add to Cart and Buy Now */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`py-3.5 px-6 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#f7f1e5] hover:bg-[#6b0f1a] text-[#6b0f1a] hover:text-white border border-[#d4af37]/40 shadow-sm'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`py-3.5 px-6 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#6b0f1a] hover:bg-[#4d0a13] text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  <Zap className="w-4 h-4 text-[#d4af37]" />
                  <span>Buy Now (Cash / COD)</span>
                </button>
              </div>

              {/* Guarantees bar */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 pt-2">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#d4af37]" />
                  <span>Express Delivery (24-48 hrs)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#d4af37]" />
                  <span>Shelf Life: {product.shelfLife || '15 Days'}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Product Details & Craftsmanship Specs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-sm mb-12">
          <h2 className="font-serif text-xl font-bold text-[#4d0a13] mb-4">
            Fabric, Weave & Authenticity Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-[#fffaf3] border border-[#d4af37]/20">
              <span className="text-xs font-bold text-[#9a6f14] block mb-1">Weave & Purity</span>
              <p className="text-xs text-gray-700 leading-relaxed">
                {product.ingredients || '100% Pure Mulberry Silk handwoven by generational master weavers with authentic Silk Mark certification.'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#fffaf3] border border-[#d4af37]/20">
              <span className="text-xs font-bold text-[#9a6f14] block mb-1">Drape Care & Longevity</span>
              <p className="text-xs text-gray-700 leading-relaxed">
                {product.shelfLife || 'Dry Clean Only. Preserve wrapped in unbleached mulmul cotton cloth to keep the zari luster radiant for decades.'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#fffaf3] border border-[#d4af37]/20">
              <span className="text-xs font-bold text-[#9a6f14] block mb-1">Luxury Packaging</span>
              <p className="text-xs text-gray-700 leading-relaxed">
                Delivered in an archival Saree Sundarii luxury box with satin ribbon, protective muslin sleeve, and Silk Mark authentication tag.
              </p>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-sm mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#4d0a13]">
                Customer Reviews
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-700">
                  {product.rating || 4.9} out of 5 based on {reviews.length || product.numReviews} reviews
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {reviews.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  Be the first to review this royal handloom drape!
                </div>
              ) : (
                reviews.map((r, i) => (
                  <div key={r._id || i} className="p-4 rounded-2xl bg-[#fdfbf7] border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#4d0a13]">{r.userName || 'Happy Customer'}</span>
                        {r.verifiedPurchase && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-amber-500">
                        {[...Array(r.rating || 5)].map((_, idx) => (
                          <Star key={idx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    {r.title && <h4 className="text-xs font-bold text-gray-800">{r.title}</h4>}
                    <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>
                    <span className="text-[10px] text-gray-400 block">
                      {new Date(r.createdAt || Date.now()).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Leave a Review Form */}
            <div className="lg:col-span-5 bg-[#fffaf3] p-6 rounded-2xl border border-[#d4af37]/30">
              <h3 className="font-serif text-base font-bold text-[#5B0E2D] mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#d4af37]" />
                Share Your Experience / Review
              </h3>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Your Rating:</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReviewRating(s)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            s <= reviewRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#6b0f1a] ml-2">{reviewRating} Stars</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Review Title:</label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Magnificent zari work and regal drape!"
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Your Feedback:</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    placeholder="Tell us about the drape, silk texture, zari luster, and fitting..."
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-2.5 bg-[#6b0f1a] hover:bg-[#4d0a13] text-white text-xs font-bold rounded-xl shadow transition-colors"
                >
                  {submittingReview ? 'Submitting Review...' : 'Submit Review'}
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Related Sarees Section */}
        {related.length > 0 && (
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-[#5B0E2D] mb-6">
              Complementary Heirloom Drapes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;
