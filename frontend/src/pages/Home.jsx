import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Star,
  Award,
  Truck,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Gift,
  Clock,
  Heart,
  ChevronRight,
  Crown,
  Eye,
  MessageCircle,
  PhoneCall
} from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { productAPI, categoryAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { categoriesWithSubcategories } from '../data/categoriesData';
import { allSareesCatalog } from '../data/sareesCatalog';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState(() =>
    allSareesCatalog.filter(p => p.isFeatured).slice(0, 8)
  );
  const [bestSellers, setBestSellers] = useState(() =>
    allSareesCatalog.filter(p => p.isBestSeller).slice(0, 4)
  );
  const [bridalSpecials, setBridalSpecials] = useState(() =>
    allSareesCatalog.filter(p => p.category?.toLowerCase().includes('wedding') || p.isFestivalSpecial).slice(0, 4)
  );
  const [kanjivaramSarees, setKanjivaramSarees] = useState(() =>
    allSareesCatalog.filter(p => p.category?.toLowerCase().includes('kanjivaram')).slice(0, 4)
  );
  const [banarasiSarees, setBanarasiSarees] = useState(() =>
    allSareesCatalog.filter(p => p.category?.toLowerCase().includes('banarasi')).slice(0, 4)
  );
  const [allProducts, setAllProducts] = useState(allSareesCatalog);
  const [activeCategoryTab, setActiveCategoryTab] = useState('All');
  const [categories, setCategories] = useState(categoriesWithSubcategories);
  const [selectedPlatterIndex, setSelectedPlatterIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { addToast } = useToast();

  const heroSarees = [
    {
      name: 'Sovereign Crimson Temple Korvai Kanjivaram',
      subtitle: 'Heavy 3-ply mulberry pattu silk with sacred Korvai pit-loom borders & pure 24K gold zari',
      price: 24999,
      originalPrice: 28500,
      image: '/sarees/kanjivaram-1.jpg',
      badge: 'Royal Pattu',
      badgeText: 'Silk Mark Certified',
      route: '/shop?category=Kanjivaram+Sarees'
    },
    {
      name: 'Heritage Banarasi Katan Silk Gold Brocade',
      subtitle: 'Handwoven in Varanasi using pure silver & 24K gold zari kadwa brocade technique',
      price: 26500,
      originalPrice: 29999,
      image: '/sarees/banarasi-1.jpg',
      badge: 'Varanasi Vault',
      badgeText: 'Kadwa Handloom',
      route: '/shop?category=Banarasi+Sarees'
    },
    {
      name: 'Royal Emerald Green Bridal Muhurtham Pattu',
      subtitle: 'Auspicious bridal green adorned with majestic peacock and chakra zari motifs across 14-inch pallu',
      price: 28800,
      originalPrice: 32000,
      image: '/sarees/kanjivaram-2.jpg',
      badge: 'Bridal Grandeur',
      badgeText: '24K Gold Zari',
      route: '/shop?category=Kanjivaram+Sarees'
    },
    {
      name: 'Yeola Paithani Pure Silk Peacock Asawali',
      subtitle: 'Hand-interlocked tapestry weave featuring iconic kaleidoscope peacock pallu in pure gold zari',
      price: 22500,
      originalPrice: 25999,
      image: '/sarees/silk-paithani-1.jpg',
      badge: 'Maharashtra Heritage',
      badgeText: 'Pure Silk Mark',
      route: '/shop?category=Silk+Sarees'
    },
    {
      name: 'Handwoven Kadwa Floral Jaal Banarasi Silk',
      subtitle: 'Exquisite multi-colored resham minakari and shimmering zari jaal woven over 90 days',
      price: 24500,
      originalPrice: 27900,
      image: '/sarees/banarasi-2.jpg',
      badge: 'Kadwa Brocade',
      badgeText: 'Varanasi Mastercraft',
      route: '/shop?category=Banarasi+Sarees'
    },
    {
      name: 'Celestial Gold & Silver Tissue Brocade Saree',
      subtitle: 'Dazzling molten metallic tissue drape with intricate floral vine border and tissue blouse',
      price: 31000,
      originalPrice: 35000,
      image: '/sarees/kanjivaram-3.jpg',
      badge: 'Tissue Heirloom',
      badgeText: '24K Tissue Weave',
      route: '/shop?category=Kanjivaram+Sarees'
    },
    {
      name: 'Royal Mysore Crepe Silk Pure Gold Zari',
      subtitle: 'Feather-light pure Mysore mulberry crepe silk with certified gold lace border',
      price: 18500,
      originalPrice: 21000,
      image: '/sarees/silk-mysore-1.jpg',
      badge: 'Palace Classic',
      badgeText: 'KSIC Certified Silk',
      route: '/shop?category=Silk+Sarees'
    },
    {
      name: 'Historic Bridal Scarlet Red Banarasi Shikargah',
      subtitle: 'Regal hunting motifs handwoven with sacred antique gold zari for royal wedding trousseaus',
      price: 34500,
      originalPrice: 38900,
      image: '/sarees/wedding-bridal-1.jpg',
      badge: 'Bridal Heirloom',
      badgeText: 'Shikargah Vault',
      route: '/shop?category=Wedding+Sarees'
    }
  ];

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [featRes, bestRes, bridalRes, catRes, allRes] = await Promise.all([
          productAPI.getFeatured().catch(() => ({ products: [] })),
          productAPI.getBestSellers().catch(() => ({ products: [] })),
          productAPI.getAll({ category: 'Wedding Sarees' }).catch(() => ({ products: [] })),
          categoryAPI.getAll().catch(() => ({ categories: [] })),
          productAPI.getAll({ limit: 50 }).catch(() => ({ products: [] }))
        ]);

        if (featRes.products && featRes.products.length > 0) {
          setFeaturedProducts(featRes.products.slice(0, 8));
        }
        if (bestRes.products && bestRes.products.length > 0) {
          setBestSellers(bestRes.products.slice(0, 4));
        }
        if (bridalRes.products && bridalRes.products.length > 0) {
          setBridalSpecials(bridalRes.products.slice(0, 4));
        }
        if (allRes.products && allRes.products.length > 0) {
          setAllProducts(allRes.products);
          setKanjivaramSarees(allRes.products.filter(p => p.category?.toLowerCase().includes('kanjivaram')).slice(0, 4));
          setBanarasiSarees(allRes.products.filter(p => p.category?.toLowerCase().includes('banarasi')).slice(0, 4));
        }
        if (catRes.categories && catRes.categories.length > 0) {
          setCategories(catRes.categories);
        }
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      addToast('Welcome to Saree Sundarii Heritage Club! Use coupon SUNDARI20 for 20% off your first heirloom ✨');
      setNewsletterEmail('');
    }
  };

  const testimonials = [
    {
      name: 'Aishwarya Ramanathan',
      location: 'Chennai',
      comment: 'The Sovereign Crimson Kanjivaram was the centerpiece of my wedding muhurtham! The Korvai pit-loom border and pure gold zari weight felt truly royal. Certified Silk Mark tag gave me complete peace of mind.',
      saree: 'Sovereign Crimson Temple Korvai Kanjivaram',
      rating: 5
    },
    {
      name: 'Radhika Jhunjhunwala',
      location: 'Varanasi & Mumbai',
      comment: 'As someone who collects antique textiles, this Kadwa Jaal Banarasi silk drape is breathtaking. Pure silver zari dipping, zero loose threads at the back, and rich regal fall. Exceeded all expectations!',
      saree: 'Heritage Banarasi Katan Silk Gold Brocade',
      rating: 5
    },
    {
      name: 'Meenakshi Sundaram',
      location: 'Bengaluru',
      comment: 'Ordered the Yeola Paithani for our temple ceremony. The peacock pallu kaleidoscopic weave is a masterwork. Video styling via WhatsApp concierge helped me choose the exact shade.',
      saree: 'Yeola Paithani Pure Silk Peacock Asawali',
      rating: 5
    }
  ];

  return (
    <div className="bg-[#fdfbf7] min-h-screen w-full overflow-x-hidden">
      
      {/* 1. Hero Showcase Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f7f1e5] via-[#fbf8f2] to-[#fdfbf7] border-b border-[#d4af37]/25 py-8 md:py-16">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#5B0E2D]/5 blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Hero Pitch */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B0E2D]/10 border border-[#5B0E2D]/20 text-[#5B0E2D] text-xs font-bold tracking-wider uppercase">
                <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>100% Pure Silk Mark Certified Handlooms</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#5B0E2D] leading-[1.15]">
                Timeless Splendor of <br />
                <span className="gold-gradient-text">Royal Indian Sarees</span>
              </h1>

              <p className="text-sm sm:text-base text-[#2b1f1d]/85 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Immerse yourself in centuries of handloom artistry. Handcrafted on traditional pit looms with pure mulberry silk, sacred Korvai borders, and authentic tested 24K gold zari.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#5B0E2D] hover:bg-[#38050c] text-white font-bold text-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                  <span>Explore Royal Vault</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/categories"
                  className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-[#f7f1e5] text-[#5B0E2D] border border-[#d4af37] font-bold text-sm rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>Curated Collections</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-[#d4af37]/20 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#fcedd8] flex items-center justify-center text-[#5B0E2D] shrink-0">
                    <Award className="w-4 h-4 text-[#9a6f14]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#5B0E2D]">Silk Mark Tag</div>
                    <div className="text-[10px] text-gray-500">100% Pure Silk</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#fcedd8] flex items-center justify-center text-[#5B0E2D] shrink-0">
                    <Crown className="w-4 h-4 text-[#9a6f14]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#5B0E2D]">24K Gold Zari</div>
                    <div className="text-[10px] text-gray-500">Tested Tested Silver</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#fcedd8] flex items-center justify-center text-[#5B0E2D] shrink-0">
                    <Truck className="w-4 h-4 text-[#9a6f14]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#5B0E2D]">Free Shipping</div>
                    <div className="text-[10px] text-gray-500">Pan-India on ₹1,999+</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#fcedd8] flex items-center justify-center text-[#5B0E2D] shrink-0">
                    <ShieldCheck className="w-4 h-4 text-[#9a6f14]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#5B0E2D]">Heirloom Quality</div>
                    <div className="text-[10px] text-gray-500">Lifetime Guarantee</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Saree Showcase Card */}
                <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-2xl border-2 border-[#d4af37]/40 relative overflow-hidden group">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#f7f1e5] relative">
                    <img
                      src={heroSarees[selectedPlatterIndex].image}
                      alt={heroSarees[selectedPlatterIndex].name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                    />
                    
                    {/* Floating Badge */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#5B0E2D] text-white px-3 py-1.5 sm:py-2 rounded-2xl shadow-xl flex items-center gap-2 border border-[#d4af37]">
                      <Crown className="w-4 h-4 text-[#d4af37]" />
                      <div>
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#d4af37]">
                          {heroSarees[selectedPlatterIndex].badge}
                        </div>
                        <div className="text-xs font-bold">
                          {heroSarees[selectedPlatterIndex].badgeText}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Switcher Thumbnails */}
                  <div className="flex items-center gap-2 pt-3 pb-2 overflow-x-auto no-scrollbar">
                    {heroSarees.map((item, idx) => (
                      <button
                        key={item.name}
                        onClick={() => setSelectedPlatterIndex(idx)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          selectedPlatterIndex === idx
                            ? 'bg-[#5B0E2D] text-[#fcedd8] border border-[#d4af37] shadow-sm'
                            : 'bg-[#f7f1e5] text-[#5B0E2D] hover:bg-[#ebdcc3]'
                        }`}
                      >
                        <img src={item.image} alt="" className="w-5 h-5 rounded-full object-cover border border-[#d4af37]/50" />
                        <span className="text-[11px] whitespace-nowrap">{item.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>

                  {/* Saree Details */}
                  <div className="pt-2 px-1 flex items-center justify-between border-t border-gray-100 mt-1">
                    <div className="pr-2">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#5B0E2D] line-clamp-1">
                        {heroSarees[selectedPlatterIndex].name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {heroSarees[selectedPlatterIndex].subtitle}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-gray-400 line-through block">
                        ₹{heroSarees[selectedPlatterIndex].originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-lg sm:text-xl font-black text-[#5B0E2D]">
                        ₹{heroSarees[selectedPlatterIndex].price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Rating Pill */}
                <div className="mt-3 sm:mt-0 sm:absolute sm:-bottom-5 sm:-left-5 bg-[#fffaf3] border border-[#d4af37]/50 rounded-2xl p-3 shadow-xl flex items-center gap-3">
                  <div className="flex -space-x-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-[#5B0E2D] block">4.96 / 5 Heritage Rating</span>
                    <span className="text-[10px] text-gray-500">Over 12,000+ Draped Connoisseurs</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CURATED SAREE CATEGORIES WITH ALL SUB CATEGORIES */}
      {/* Matches user's screenshot Image 1: "Curated Saree Categories" */}
      {/* "remove that all and add only categories in that caategories show all the sub categories" */}
      {/* "give one by one in small gap between every catagorie" */}
      {/* "add all orginal sarees images" */}
      <section className="py-14 sm:py-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9a6f14] font-serif">
            ROYAL WEAVES & SILHOUETTES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#5B0E2D]">
            Curated Saree Categories
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            From regal Banarasi zari kadhwas to breezy handloom cottons, discover the drape that speaks to your spirit.
          </p>
        </div>

        {/* Categories Grid - 100% Original Saree Images & All Subcategories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categoriesWithSubcategories.map((cat) => (
            <div
              key={cat.id}
              className="group bg-white rounded-3xl overflow-hidden border border-[#d4af37]/30 hover:border-[#5B0E2D] shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Category Image with Authentic Saree & Badge */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#f7f1e5]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#d4af37] text-[#24030F] px-2.5 py-0.5 rounded-full shadow">
                      {cat.badge}
                    </span>
                    <span className="text-[11px] text-[#fcedd8] font-semibold">
                      {cat.count}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-200 line-clamp-2 mt-1 opacity-90 font-light">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Subcategories Section Inside Category Card */}
              {/* "ADD ALL SUB CATEGORIES IS CATAGORIES SECTION" */}
              <div className="p-5 flex-1 flex flex-col justify-between bg-white space-y-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#9a6f14] mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#d4af37]" />
                    <span>Included Subcategories:</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#fbf8f2] border border-[#d4af37]/25 text-gray-700 hover:text-[#5B0E2D] hover:bg-[#f7f1e5] hover:border-[#5B0E2D] transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Explore Button */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    to={cat.route}
                    className="w-full py-2 px-4 rounded-xl bg-[#f7f1e5] hover:bg-[#5B0E2D] text-[#5B0E2D] hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 group/btn"
                  >
                    <span>Enter {cat.shortName} Vault</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Masterpiece Sarees Section with Interactive Category Switcher */}
      {/* "the above all categories in web site but that under sarees collection is not in mobile" */}
      <section className="py-14 bg-gradient-to-b from-[#fffaf3] to-[#fdfbf7] border-y border-[#d4af37]/25">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-[#9a6f14] uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#d4af37]" />
                <span>Handloom Masterpieces</span>
              </span>
              <h2 className="font-serif text-3xl font-extrabold text-[#5B0E2D] mt-1">
                Featured Heirloom Sarees Collection
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Select any weave category below to explore its handcrafted pure silk & cotton drapes.
              </p>
            </div>
            <Link
              to={activeCategoryTab === 'All' ? '/shop' : `/shop?category=${encodeURIComponent(activeCategoryTab)}`}
              className="text-xs font-bold text-[#5B0E2D] hover:text-[#38050c] flex items-center gap-1 bg-[#f7f1e5] px-4 py-2 rounded-full border border-[#d4af37]/40 shadow-xs group"
            >
              <span>Explore Full {activeCategoryTab === 'All' ? 'Catalog (34 Sarees)' : activeCategoryTab}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Interactive Category Tabs (Mobile Touch-Scrollable + Desktop) */}
          <div className="mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-none flex items-center gap-2 pb-2">
            {[
              { label: 'All Curated', value: 'All' },
              { label: 'Kanjivaram', value: 'Kanjivaram Sarees' },
              { label: 'Banarasi', value: 'Banarasi Sarees' },
              { label: 'Silk Sarees', value: 'Silk Sarees' },
              { label: 'Cotton Weaves', value: 'Cotton Sarees' },
              { label: 'Wedding Bridal', value: 'Wedding Sarees' },
              { label: 'Party Wear', value: 'Party Wear Sarees' },
              { label: 'Designer', value: 'Designer Sarees' },
              { label: 'Georgette & Chiffon', value: 'Georgette & Chiffon' }
            ].map((tab) => {
              const isTabActive = activeCategoryTab === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveCategoryTab(tab.value)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 flex items-center gap-1.5 ${
                    isTabActive
                      ? 'bg-[#5B0E2D] text-white border-[#5B0E2D] shadow-md scale-102'
                      : 'bg-white text-[#2b1f1d] border-[#d4af37]/35 hover:border-[#5B0E2D] hover:bg-[#fbf8f2]'
                  }`}
                >
                  {isTabActive && <Sparkles className="w-3 h-3 text-[#d4af37]" />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sarees Grid - Responsive 1-col on mobile, 2-col on tablet, 4-col on laptop */}
          {(() => {
            const displayedSarees = activeCategoryTab === 'All'
              ? (featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 8))
              : allProducts.filter(p => {
                  const catTarget = activeCategoryTab.toLowerCase().replace(' sarees', '');
                  return p.category?.toLowerCase().includes(catTarget);
                }).slice(0, 8);

            if (displayedSarees.length === 0) {
              return (
                <div className="py-16 text-center text-xs text-gray-500 bg-white rounded-2xl border border-dashed border-[#d4af37]/40">
                  No sarees found in this category currently.
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedSarees.map((product) => (
                  <ProductCard key={product._id || product.slug} product={product} />
                ))}
              </div>
            );
          })()}

          {/* Bottom Explore Link */}
          <div className="mt-8 text-center">
            <Link
              to={activeCategoryTab === 'All' ? '/shop' : `/shop?category=${encodeURIComponent(activeCategoryTab)}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5B0E2D] hover:bg-[#24030F] text-white font-bold text-xs shadow-md transition-all group"
            >
              <span>View All Handpicked {activeCategoryTab === 'All' ? 'Sarees' : activeCategoryTab} in Vault</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#d4af37] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. Sacred Korvai & Kadwa Weaving Heritage Banner */}
      <section className="py-16 bg-[#24030F] text-[#fcedd8] relative overflow-hidden border-b border-[#d4af37]/40">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#d4af37]/5 blur-3xl pointer-events-none"></div>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] bg-[#5B0E2D] px-3 py-1 rounded-full border border-[#d4af37]/40">
                Loom to Heirloom Story
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Crafted on Sacred Pit-Looms by 5th Generation Master Weavers
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Every Saree Sundarii creation is born through months of patient rhythm on wooden handlooms. From the interlocked temple Korvai borders of Kanchipuram to the intricate kadwa brocades of Varanasi, our sarees carry the soul of India's living heritage.
              </p>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#d4af37]/20 text-center">
                <div>
                  <div className="font-serif text-2xl font-black text-[#d4af37]">3-Ply</div>
                  <div className="text-[11px] text-gray-300">Pure Mulberry Silk</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-black text-[#d4af37]">24K</div>
                  <div className="text-[11px] text-gray-300">Tested Gold Dipped Zari</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-black text-[#d4af37]">100%</div>
                  <div className="text-[11px] text-gray-300">Silk Mark Certified</div>
                </div>
              </div>

              <div className="pt-2 flex justify-center lg:justify-start">
                <a
                  href="https://wa.me/919346638123?text=Namaste!%20I%20would%20love%20to%20know%20more%20about%20your%20handloom%20master%20weavers."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-bold text-xs shadow-lg hover:bg-[#20ba5a] transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Connect with Weaving Concierge</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <img
                src="/sarees/kanjivaram-1.jpg"
                alt="Kanjivaram Weave"
                className="w-full aspect-[3/4] object-cover rounded-2xl border border-[#d4af37]/40 shadow-xl"
              />
              <img
                src="/sarees/banarasi-1.jpg"
                alt="Banarasi Weave"
                className="w-full aspect-[3/4] object-cover rounded-2xl border border-[#d4af37]/40 shadow-xl mt-6"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 5. Auspicious Bride & Connoisseur Reviews */}
      <section className="py-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#9a6f14] uppercase tracking-wider">
            Voices of Grace
          </span>
          <h2 className="font-serif text-3xl font-extrabold text-[#5B0E2D] mt-1">
            Cherished by Brides & Connoisseurs
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Real stories of celebratory moments adorned in Saree Sundarii handlooms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#d4af37]/30 shadow-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-gray-100">
                <div className="font-serif font-bold text-sm text-[#5B0E2D]">{t.name}</div>
                <div className="text-[11px] text-gray-500">{t.location}</div>
                <div className="text-[10px] font-semibold text-[#9a6f14] mt-1">Draped: {t.saree}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. VIP Heritage Club Newsletter */}
      <section className="py-14 bg-gradient-to-r from-[#fbf8f2] via-[#f7f1e5] to-[#fbf8f2] border-t border-[#d4af37]/30 text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="w-12 h-12 rounded-full bg-[#5B0E2D] text-white flex items-center justify-center mx-auto mb-4 border border-[#d4af37] shadow-md">
            <Crown className="w-6 h-6 text-[#d4af37]" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#5B0E2D]">
            Join the Saree Sundarii Heritage Guild
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 mb-6">
            Receive private invitations to new loom unveils, auspicious festive discounts, and complimentary styling sessions with code <strong className="text-[#5B0E2D]">SUNDARI20</strong>.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="flex-1 px-4 py-3 rounded-full border border-[#d4af37]/50 bg-white text-xs focus:outline-none focus:border-[#5B0E2D] shadow-inner"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-[#5B0E2D] hover:bg-[#38050c] text-white font-bold text-xs shadow-md transition-all whitespace-nowrap"
            >
              Claim 20% Off
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default Home;
