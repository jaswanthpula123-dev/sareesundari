import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Crown,
  Award,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Filter,
  CheckCircle2,
  MessageCircle,
  RotateCcw,
  Star,
  Layers,
  Palette,
  Truck,
  Heart
} from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import ProductQuickViewModal from '../components/product/ProductQuickViewModal';

// Banarasi Weaving Sub-Collections
const banarasiSubCollections = [
  {
    id: 'All',
    name: 'All Banarasi Weaves',
    count: '12 Sarees',
    icon: '👑',
    desc: 'The complete museum-grade Varanasi collection.'
  },
  {
    id: 'Kadwa Weaves',
    name: 'Kadwa Weaves',
    count: '3 Sarees',
    icon: '🪡',
    desc: 'Individually hand-engraved motifs with zero floating threads on the reverse side.'
  },
  {
    id: 'Jangla Jaals',
    name: 'Jangla Jaals',
    count: '3 Sarees',
    icon: '🌿',
    desc: 'All-over dense floral creepers woven in sona-rupa zari across the body.'
  },
  {
    id: 'Tanchoi Silk',
    name: 'Tanchoi Silk',
    count: '2 Sarees',
    icon: '✨',
    desc: 'Satin Jamawar technique without zari floats; whisper-soft and feather-smooth.'
  },
  {
    id: 'Shikargah Legends',
    name: 'Shikargah Legends',
    count: '1 Saree',
    icon: '🐅',
    desc: 'Historic Mughal court scenes depicting royal wildlife and forest banquets.'
  },
  {
    id: 'Tissue & Organza',
    name: 'Tissue & Organza',
    count: '3 Sarees',
    icon: '🌸',
    desc: 'Full metallic gold tissue radiance and sheer gossamer kora organza drapes.'
  }
];

// Weaving Pillars of Banaras
const weavingPillars = [
  {
    title: 'Kadwa Pit Loom Mastery',
    badge: 'Zero Reverse Floats',
    desc: 'Unlike commercial machine weaves, Kadwa entails master weavers manually interlocking each motif separately using spools called tillis. No loose threads touch the skin.',
    image: '/sarees/banarasi-1.jpg'
  },
  {
    title: 'Sona-Rupa Real Zari',
    badge: 'Electrum Precious Metals',
    desc: 'Authentic Banarasi brocades intertwine silver and gold metallic wires (Ganga-Jamuna zari) to create depth and shimmering celestial warmth that never tarnishes with age.',
    image: '/sarees/banarasi-2.jpg'
  },
  {
    title: 'Pure Twisted Katan Silk',
    badge: '100% Silk Mark Certified',
    desc: 'High-twist pure mulberry silk filaments woven together to give the fabric its unmistakable regal crispness, glorious fall, and generation-spanning longevity.',
    image: '/sarees/banarasi-3.jpg'
  }
];

const Banarasi = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    setLoading(true);
    productAPI.getAll({ category: 'Banarasi Sarees', limit: 50 })
      .then((res) => {
        if (res.success) {
          setProducts(res.products || []);
        }
      })
      .catch((err) => console.error('Error fetching Banarasi products:', err))
      .finally(() => setLoading(false));
  }, []);

  // Filter products by subCollection and color
  const filteredProducts = products.filter((p) => {
    const matchesTab = selectedTab === 'All' || (p.subCollection && p.subCollection.toLowerCase().includes(selectedTab.toLowerCase()));
    const matchesColor = selectedColor === 'All' || (p.color && p.color.toLowerCase().includes(selectedColor.toLowerCase()));
    return matchesTab && matchesColor;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;
    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  // Unique colors in Banarasi collection
  const availableColors = ['All', 'Crimson', 'Emerald', 'Peacock Blue', 'Gold', 'Maroon', 'Black', 'Rani Pink', 'Haldi Yellow', 'Lilac'];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      
      {/* 1. Regal Banarasi Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#24030F] via-[#380718] to-[#150109] text-[#FDFBF7] py-12 sm:py-16 lg:py-20 border-b-2 border-[#D4AF37]/40">
        
        {/* Ornamental Ambient Glow */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#5B0E2D]/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-left z-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/60 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest text-[#F6E7B9] uppercase backdrop-blur-md">
                  <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>The Varanasi Imperial Vault • 12 Masterpieces</span>
                </span>
                <span className="text-xs text-[#EDE5D8]/80 hidden sm:inline">
                  • 100% Silk Mark Certified
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif text-[#FDFBF7] tracking-tight leading-[1.12]">
                Timeless Banarasi Silk & Zari Weaves
              </h1>

              <p className="text-base sm:text-lg font-serif italic text-[#D4AF37]">
                Intricate Sona-Rupa Brocades from the Sacred Ghats of Kashi
              </p>

              <p className="text-xs sm:text-sm text-[#EDE5D8]/90 leading-relaxed font-light max-w-2xl">
                Dating back to the Vedic era and enriched by Mughal royal patrons, authentic Banarasi sarees are hand-woven on ancestral pit looms. Featuring individually hand-engraved Kadwa booti work, dense floral Jangla jaals, and whisper-soft Tanchoi silks, each drape requires up to 60 days of devotional craftsmanship.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#collection-grid"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#A27B1E] via-[#D4AF37] to-[#A27B1E] text-[#2B0411] font-bold text-xs sm:text-sm tracking-wide shadow-xl hover:brightness-110 transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Explore All 12 Banarasi Sarees</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="https://wa.me/919346638123?text=Namaste!%20I%20would%20like%20to%20inquire%20about%20your%20authentic%20Banarasi%20Silk%20Saree%20collection%20(Kadwa,%20Jangla,%20Shikargah)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-bold shadow-lg transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Banarasi Video Concierge</span>
                </a>
              </div>

              {/* Hallmarks Badges */}
              <div className="pt-4 border-t border-[#D4AF37]/25 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-[#EDE5D8]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Pure Katan Silk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Kadwa Pit Loom Weave</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Sona-Rupa Real Zari</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Silk Mark Guarantee</span>
                </div>
              </div>

            </div>

            {/* Right Photo Frame */}
            <div className="lg:col-span-5 flex justify-center z-10">
              <div className="relative w-full max-w-[380px] lg:max-w-[420px]">
                
                {/* Glow border */}
                <div className="absolute -inset-2 bg-gradient-to-r from-[#D4AF37]/40 to-[#5B0E2D]/60 rounded-[32px] blur-md opacity-80"></div>

                <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden border-2 border-[#D4AF37]/70 shadow-2xl bg-[#1A020B]">
                  <img
                    src="/sarees/banarasi-4.jpg"
                    alt="Heritage Peacock Blue Banarasi Jangla Silk Saree"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none"></div>

                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-[#24030F]/90 border border-[#D4AF37]/70 text-[#F6E7B9] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-lg">
                      Heritage Kadwa Weave
                    </span>
                  </div>

                  <div className="absolute bottom-4 inset-x-4 z-20 p-3.5 bg-black/60 backdrop-blur-md rounded-2xl border border-white/20 text-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                        Pit Loom Heirloom
                      </span>
                      <span className="text-[10px] text-gray-300">
                        Varanasi Origin
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-serif font-bold text-[#FDFBF7] truncate">
                      Heritage Peacock Blue Banarasi Jangla Silk Saree
                    </p>
                    <p className="text-[11px] text-[#F6E7B9] font-medium">
                      ₹22,499 <span className="line-through text-gray-400 text-[10px]">₹28,999</span>
                    </p>
                  </div>
                </div>

                {/* Floating pill */}
                <div className="absolute -bottom-3 -left-3 sm:-left-5 bg-[#5B0E2D] border-2 border-[#D4AF37] px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2.5 text-white z-30">
                  <span className="text-base">🥻</span>
                  <div className="text-left">
                    <span className="text-[9px] uppercase font-bold text-[#D4AF37] block leading-none">Generational Loom</span>
                    <span className="text-xs font-semibold">4th Gen Master Artisans</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Three Pillars of Authentic Banarasi Weaving */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A27B1E] font-serif">
            Artisan Anatomy
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#5B0E2D]">
            The Hallmarks of Authentic Banarasi Craft
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            How to recognize authentic handloom Banarasi silk sarees crafted by Varanasi master weavers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {weavingPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl overflow-hidden border border-[#D4AF37]/35 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-black">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="bg-[#D4AF37] text-[#2B0411] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {pillar.badge}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#5B0E2D] group-hover:text-[#7A133A] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-light mt-1.5">
                    {pillar.desc}
                  </p>
                </div>
                <div className="pt-2 flex items-center text-xs font-bold text-[#A27B1E] gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>100% Tested Authentic</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Sub-Collections Interactive Filter Tabs */}
      <section id="collection-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#D4AF37]/30">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#A27B1E] mb-1 font-serif">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Curated Handloom Gallery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#5B0E2D]">
              Banarasi Saree Catalog ({products.length} Sarees)
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Select any sub-collection tab to view specialized handloom classifications.
            </p>
          </div>

          {/* Sort & Color Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Color Select */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-gray-500 font-medium">Color:</span>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="bg-white border border-[#D4AF37]/50 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#2D2A26] outline-none cursor-pointer focus:border-[#5B0E2D]"
              >
                {availableColors.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'All Colors' : c}</option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-gray-500 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#D4AF37]/50 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#2D2A26] outline-none cursor-pointer focus:border-[#5B0E2D]"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>

            {(selectedTab !== 'All' || selectedColor !== 'All') && (
              <button
                onClick={() => {
                  setSelectedTab('All');
                  setSelectedColor('All');
                }}
                className="text-xs text-[#5B0E2D] font-semibold hover:underline flex items-center gap-1 pl-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Collection Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {banarasiSubCollections.map((tab) => {
            const isActive = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#5B0E2D] to-[#7A133A] text-white shadow-lg scale-105 border border-[#D4AF37]'
                    : 'bg-white text-gray-700 hover:bg-[#F8F3EA] border border-gray-200'
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span className="font-bold">{tab.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-[#D4AF37] text-[#2B0411] font-bold' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Description Banner */}
        {selectedTab !== 'All' && (
          <div className="bg-[#F8F3EA] border border-[#D4AF37]/40 rounded-2xl p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 text-[#5B0E2D]">
              <span className="text-lg">
                {banarasiSubCollections.find((t) => t.id === selectedTab)?.icon}
              </span>
              <div>
                <strong className="block font-serif text-sm">
                  {banarasiSubCollections.find((t) => t.id === selectedTab)?.name}
                </strong>
                <span className="text-gray-600 font-light">
                  {banarasiSubCollections.find((t) => t.id === selectedTab)?.desc}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#A27B1E] uppercase">
              Showing {sortedProducts.length} Sarees
            </span>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-gray-200" />
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
            <p className="text-base text-gray-600">No Banarasi sarees match the selected filter combination.</p>
            <button
              onClick={() => { setSelectedTab('All'); setSelectedColor('All'); }}
              className="px-5 py-2 bg-[#5B0E2D] text-white text-xs font-bold rounded-xl hover:bg-[#7A133A]"
            >
              Reset Filters
            </button>
          </div>
        )}

      </section>

      {/* 4. Luxury Banarasi Bridal Concierge Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#380718] via-[#5B0E2D] to-[#24030F] text-[#FDFBF7] p-8 sm:p-10 lg:p-12 border-2 border-[#D4AF37]/50 shadow-2xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="bg-[#D4AF37] text-[#2B0411] text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow tracking-wider">
              Bespoke Banarasi Bridal Service
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif leading-tight">
              Looking for a Custom Bridal Banarasi or Family Ensemble?
            </h2>
            <p className="text-xs sm:text-sm text-[#EDE5D8]/90 font-light leading-relaxed">
              Schedule an exclusive one-on-one video appointment with our Master Loom Stylist directly from Varanasi. View pallus in high definition, explore custom color-dyes, and order matched blouse tailoring.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://wa.me/919346638123?text=Namaste!%20I%20would%20like%20to%20book%20a%20personal%20Banarasi%20Bridal%20Consultation%20with%20your%20Master%20Weaver%20Stylist."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Book Video Draping on WhatsApp</span>
              </a>
              <Link
                to="/contact"
                className="px-5 py-3 border border-[#D4AF37]/60 text-[#F6E7B9] hover:bg-white/10 font-bold text-xs sm:text-sm rounded-xl transition-all"
              >
                Inquire via Email
              </Link>
            </div>
          </div>

          {/* Decorative Corner Motif */}
          <div className="absolute right-6 -bottom-10 opacity-15 text-9xl font-serif text-[#D4AF37] select-none pointer-events-none">
            👑
          </div>
        </div>
      </section>

      {/* 5. Banarasi Saree Care & Heirloom Preservation Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#D4AF37]/35 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#A27B1E] font-serif block">
                Preserving Your Heirloom
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#5B0E2D]">
                How to Care for Pure Banarasi Silk Sarees
              </h3>
            </div>
            <Link
              to="/saree-care"
              className="text-xs font-bold text-[#5B0E2D] hover:underline flex items-center gap-1"
            >
              <span>Full Saree Care Guide</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#D4AF37]/20 space-y-1.5">
              <span className="text-lg">🌿</span>
              <h4 className="font-bold font-serif text-[#5B0E2D]">Muslin Wrapping</h4>
              <p className="text-gray-600 font-light leading-relaxed">
                Always store your pure katan silk saree wrapped in unbleached pure cotton or muslin to allow natural fibers to breathe.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#D4AF37]/20 space-y-1.5">
              <span className="text-lg">🪵</span>
              <h4 className="font-bold font-serif text-[#5B0E2D]">Roll on Rods</h4>
              <p className="text-gray-600 font-light leading-relaxed">
                For heavy gold zari Kadwa sarees, roll them onto wooden cylinders or refold every 4 months along different crease lines.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#D4AF37]/20 space-y-1.5">
              <span className="text-lg">🧼</span>
              <h4 className="font-bold font-serif text-[#5B0E2D]">Specialist Dry Clean</h4>
              <p className="text-gray-600 font-light leading-relaxed">
                Never hand wash or machine wash real zari brocades. Always trust experienced heritage silk dry cleaning services.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#D4AF37]/20 space-y-1.5">
              <span className="text-lg">🚫</span>
              <h4 className="font-bold font-serif text-[#5B0E2D]">Perfume Precaution</h4>
              <p className="text-gray-600 font-light leading-relaxed">
                Never spray perfumes, deodorants, or water sprays directly onto real gold and silver zari brocades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

    </div>
  );
};

export default Banarasi;
