import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  LogOut,
  Package,
  Layers,
  PhoneCall,
  Crown,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { categoriesWithSubcategories } from '../../data/categoriesData';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeCategoryDropdown, setActiveCategoryDropdown] = useState(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState(null);
  const [activeMobileCategoryBar, setActiveMobileCategoryBar] = useState(null);

  const navRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount, total } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
        setActiveCategoryDropdown(null);
        setActiveMobileCategoryBar(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveCategoryDropdown(null);
    setActiveMobileCategoryBar(null);
    setUserDropdownOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleCategoryMouseEnter = (catId) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveCategoryDropdown(catId);
  };

  const handleCategoryMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveCategoryDropdown(null);
    }, 200);
  };

  const toggleMobileCategory = (catId) => {
    setMobileExpandedCat(mobileExpandedCat === catId ? null : catId);
  };

  return (
    <header ref={navRef} className="sticky top-0 z-40 w-full bg-[#fdfbf7]/95 backdrop-blur-md border-b border-[#d4af37]/25 transition-all duration-300">
      
      {/* 1. Top Royal Announcement Bar with Infinite Continuous Scrolling */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#24030F] via-[#5B0E2D] to-[#24030F] text-[#fcedd8] text-xs py-2 border-b border-[#d4af37]/35 shadow-inner">
        <div className="animate-marquee flex items-center whitespace-nowrap will-change-transform">
          {/* Track 1 */}
          <div className="flex items-center gap-8 px-6 shrink-0">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse shrink-0" />
              <span className="font-semibold tracking-wide">Silk Mark Certified Pure Handloom Heirlooms</span>
            </span>
            <span className="text-[#d4af37]">✦</span>
            <span className="flex items-center gap-2">
              <span>🚚 Free Insured Pan-India Delivery on ₹1,999+</span>
            </span>
            <span className="text-[#d4af37]">✦</span>
            <span className="flex items-center gap-1.5">
              <span>Festive Heritage Edit: Use code</span>
              <span className="bg-[#d4af37] text-[#38050c] px-2 py-0.5 rounded font-black tracking-wider text-[11px] shadow-sm">SUNDARI20</span>
              <span className="text-[#fcedd8]/90">for Flat 20% Off</span>
            </span>
            <span className="text-[#d4af37]">✦</span>
            <a href="https://wa.me/919346638123?text=Namaste!%20I%20would%20like%20styling%20advice%20for%20Saree%20Sundarii%20handlooms." target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#d4af37] transition-colors">
              <PhoneCall className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>WhatsApp Video Draping Concierge: <strong>+91 93466 38123</strong></span>
            </a>
            <span className="text-[#d4af37]">✦</span>
            <span className="flex items-center gap-2">
              <span>👑 100% Tested Pure 24K Gold & Silver Zari</span>
            </span>
            <span className="text-[#d4af37]">✦</span>
            <span className="flex items-center gap-2">
              <span>🏛️ Direct from Master Weavers of Kanchipuram & Varanasi</span>
            </span>
          </div>

          {/* Track 2 (Exact Duplicate for Seamless Infinite Scrolling) */}
          <div className="flex items-center gap-8 px-6 shrink-0" aria-hidden="true">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse shrink-0" />
              <span className="font-semibold tracking-wide">Silk Mark Certified Pure Handloom Heirlooms</span>
            </span>
            <span className="text-[#d4af37]">✦</span>
            <span className="flex items-center gap-2">
              <span>🚚 Free Insured Pan-India Delivery on ₹1,999+</span>
            </span>
            <span className="text-[#d4af37]">✦</span>
            <span className="flex items-center gap-1.5">
              <span>Festive Heritage Edit: Use code</span>
              <span className="bg-[#d4af37] text-[#38050c] px-2 py-0.5 rounded font-black tracking-wider text-[11px] shadow-sm">SUNDARI20</span>
              <span className="text-[#fcedd8]/90">for Flat 20% Off</span>
            </span>
            <span className="text-[#d4af37]">✦</span>
            <a href="https://wa.me/919346638123?text=Namaste!%20I%20would%20like%20styling%20advice%20for%20Saree%20Sundarii%20handlooms." target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#d4af37] transition-colors">
              <PhoneCall className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>WhatsApp Video Draping Concierge: <strong>+91 93466 38123</strong></span>
            </a>
            <span className="text-[#d4af37]">✦</span>
            <span className="flex items-center gap-2">
              <span>👑 100% Tested Pure 24K Gold & Silver Zari</span>
            </span>
            <span className="text-[#d4af37]">✦</span>
            <span className="flex items-center gap-2">
              <span>🏛️ Direct from Master Weavers of Kanchipuram & Varanasi</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Brand & Utilities Bar */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#5B0E2D] to-[#24030F] border-2 border-[#d4af37] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <Crown className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-[#5B0E2D] group-hover:text-[#24030F] transition-colors leading-none">
                Saree <span className="gold-gradient-text">Sundarii</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#9a6f14] font-semibold mt-1">
                Royal Indian Handloom Silks
              </span>
            </div>
          </Link>

          {/* Quick Header Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#2b1f1d]">
            <Link
              to="/"
              className={`hover:text-[#5B0E2D] transition-colors ${location.pathname === '/' ? 'text-[#5B0E2D] font-bold border-b-2 border-[#5B0E2D] pb-0.5' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`hover:text-[#5B0E2D] transition-colors ${location.pathname === '/shop' ? 'text-[#5B0E2D] font-bold border-b-2 border-[#5B0E2D] pb-0.5' : ''}`}
            >
              Shop All
            </Link>
            <Link
              to="/categories"
              className={`hover:text-[#5B0E2D] transition-colors ${location.pathname === '/categories' ? 'text-[#5B0E2D] font-bold border-b-2 border-[#5B0E2D] pb-0.5' : ''}`}
            >
              All Categories
            </Link>
            <Link
              to="/about"
              className={`hover:text-[#5B0E2D] transition-colors ${location.pathname === '/about' ? 'text-[#5B0E2D] font-bold border-b-2 border-[#5B0E2D] pb-0.5' : ''}`}
            >
              Our Heritage
            </Link>
            <Link
              to="/contact"
              className={`hover:text-[#5B0E2D] transition-colors ${location.pathname === '/contact' ? 'text-[#5B0E2D] font-bold border-b-2 border-[#5B0E2D] pb-0.5' : ''}`}
            >
              Contact
            </Link>
          </div>

          {/* Right Action Icons: Search, Wishlist, Cart, Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Trigger Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#2b1f1d] hover:text-[#5B0E2D] transition-colors rounded-full hover:bg-[#f7f1e5]"
              title="Search Sarees"
              aria-label="Search Sarees"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative p-2 text-[#2b1f1d] hover:text-[#5B0E2D] transition-colors rounded-full hover:bg-[#f7f1e5]"
              title="My Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#5B0E2D] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f7f1e5] border border-[#d4af37]/40 text-[#5B0E2D] hover:border-[#5B0E2D] transition-all shadow-sm group"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#5B0E2D] group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#d4af37] text-[#38050c] text-[10px] font-extrabold rounded-full flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-[#5B0E2D]">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </Link>

            {/* User Account / Profile */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full border border-[#d4af37]/40 hover:border-[#5B0E2D] bg-[#fffaf3] transition-colors"
                    aria-label="User Account"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#5B0E2D] text-white flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#fffaf3] border border-[#d4af37]/30 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-[#d4af37]/20">
                        <div className="text-xs text-gray-500">Signed in as</div>
                        <div className="text-sm font-bold text-[#5B0E2D] truncate">{user.name}</div>
                        <div className="text-xs text-gray-500 truncate">{user.email}</div>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#5B0E2D] font-semibold hover:bg-[#f7f1e5] transition-colors"
                        >
                          <Crown className="w-4 h-4 text-[#d4af37]" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#2b1f1d] hover:bg-[#f7f1e5] transition-colors"
                      >
                        <User className="w-4 h-4 text-[#9a6f14]" />
                        My Profile & Orders
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors border-t border-[#d4af37]/20 mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-bold text-[#5B0E2D] px-3 py-1.5 rounded-full hover:bg-[#f7f1e5] transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-xs font-bold text-white bg-[#5B0E2D] hover:bg-[#38050c] px-3.5 py-1.5 rounded-full shadow transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#2b1f1d] hover:text-[#5B0E2D] transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Dedicated Categories Navigation Bar (Desktop) */}
      {/* "remove that all and add only categories in that caategories show all the sub categories" */}
      {/* "give one by one in small gap between every catagorie" */}
      <div className="hidden lg:block border-t border-[#d4af37]/20 bg-[#fbf8f2]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between gap-1 py-1">
            {categoriesWithSubcategories.map((cat) => {
              const isOpen = activeCategoryDropdown === cat.id;
              return (
                <div
                  key={cat.id}
                  className="relative group"
                  onMouseEnter={() => handleCategoryMouseEnter(cat.id)}
                  onMouseLeave={handleCategoryMouseLeave}
                >
                  <button
                    onClick={() => setActiveCategoryDropdown(isOpen ? null : cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold tracking-wide rounded-lg transition-all duration-200 ${
                      isOpen
                        ? 'bg-[#f7f1e5] text-[#5B0E2D] shadow-sm'
                        : 'text-[#2b1f1d] hover:text-[#5B0E2D] hover:bg-[#f7f1e5]/60'
                    }`}
                  >
                    <span>{cat.shortName}</span>
                    {isOpen ? (
                      <ChevronUp className="w-3.5 h-3.5 text-[#d4af37]" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-[#d4af37]/70 group-hover:text-[#d4af37]" />
                    )}
                  </button>

                  {/* Mega Dropdown for Subcategories */}
                  {isOpen && (
                    <div
                      className="absolute top-full left-0 mt-1 w-88 bg-white border border-[#d4af37]/35 rounded-2xl shadow-2xl p-5 z-50 animate-fadeIn"
                      onMouseEnter={() => handleCategoryMouseEnter(cat.id)}
                      onMouseLeave={handleCategoryMouseLeave}
                    >
                      {/* Category Header Card */}
                      <div className="flex items-center gap-3.5 pb-3.5 border-b border-[#d4af37]/20">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-14 h-14 rounded-xl object-cover border border-[#d4af37]/30 shadow-sm shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#d4af37]/20 text-[#5B0E2D] px-2 py-0.5 rounded-full">
                              {cat.badge}
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium">
                              {cat.count}
                            </span>
                          </div>
                          <h4 className="font-serif text-sm font-bold text-[#5B0E2D] mt-0.5">
                            {cat.name}
                          </h4>
                        </div>
                      </div>

                      {/* Subcategories List */}
                      <div className="pt-3 space-y-1">
                        <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-2">
                          All Subcategories
                        </div>
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            onClick={() => setActiveCategoryDropdown(null)}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#2b1f1d] hover:text-[#5B0E2D] hover:bg-[#f7f1e5] transition-colors group/item"
                          >
                            <span>{sub.name}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#d4af37] opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all" />
                          </Link>
                        ))}
                      </div>

                      {/* View All In Category Footer */}
                      <div className="pt-3 mt-3 border-t border-[#d4af37]/20">
                        <Link
                          to={cat.route}
                          onClick={() => setActiveCategoryDropdown(null)}
                          className="flex items-center justify-between text-xs font-bold text-[#5B0E2D] hover:text-[#24030F] px-2 py-1 rounded hover:bg-[#f7f1e5] transition-colors"
                        >
                          <span>Explore Full {cat.shortName} Vault</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 3.1 Dedicated Categories Navigation Bar (Mobile View - Always Visible at Top) */}
      {/* "the above all categories in web site but that under sarees collection is not in mobile" */}
      <div className="lg:hidden border-t border-[#d4af37]/25 bg-[#fbf8f2]/95 backdrop-blur-md shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto px-3 py-2 scrollbar-none">
          {categoriesWithSubcategories.map((cat) => {
            const isSelected = activeMobileCategoryBar === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveMobileCategoryBar(isSelected ? null : cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-[#5B0E2D] text-white border-[#5B0E2D] shadow-sm'
                    : 'bg-white text-[#2b1f1d] border-[#d4af37]/35 hover:border-[#5B0E2D]'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.shortName}
                  className="w-4 h-4 rounded-full object-cover border border-[#d4af37]/60 shrink-0"
                />
                <span>{cat.shortName}</span>
                {isSelected ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#d4af37]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Category Dropdown / Subcategories & Sarees Collection Drawer */}
        {activeMobileCategoryBar && (() => {
          const selectedCat = categoriesWithSubcategories.find(c => c.id === activeMobileCategoryBar);
          if (!selectedCat) return null;
          return (
            <div className="bg-white border-t border-[#d4af37]/25 p-4 space-y-3 animate-fadeIn shadow-xl">
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCat.image}
                    alt={selectedCat.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#d4af37]/30 shadow-xs shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-[#d4af37]/20 text-[#5B0E2D] px-2 py-0.5 rounded-full">
                        {selectedCat.badge}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {selectedCat.count}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#5B0E2D] mt-0.5">
                      {selectedCat.name}
                    </h4>
                  </div>
                </div>
                <button
                  onClick={() => setActiveMobileCategoryBar(null)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="Close category details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Subcategories list */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a6f14] block mb-2">
                  All Subcategories & Weaves:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCat.subcategories.map((sub) => (
                    <Link
                      key={sub.name}
                      to={sub.path}
                      onClick={() => setActiveMobileCategoryBar(null)}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#fbf8f2] border border-[#d4af37]/25 text-[#2b1f1d] hover:bg-[#5B0E2D] hover:text-white transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Direct View Saree Collection Button */}
              <Link
                to={selectedCat.route}
                onClick={() => setActiveMobileCategoryBar(null)}
                className="w-full py-2.5 rounded-xl bg-[#5B0E2D] hover:bg-[#38050c] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Explore Full {selectedCat.shortName} Sarees Collection</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
              </Link>
            </div>
          );
        })()}
      </div>

      {/* 4. Expandable Search Bar */}
      {searchOpen && (
        <div className="border-t border-[#d4af37]/20 bg-[#fffaf3] py-3 px-4 shadow-md animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search authentic sarees (e.g. Kanjivaram, Banarasi, Paithani, Mysore, Pure Zari)..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-[#d4af37]/40 rounded-full text-sm focus:outline-none focus:border-[#5B0E2D] shadow-inner"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-[#5B0E2D] hover:bg-[#24030F] text-white text-xs font-bold rounded-full transition-colors shadow"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2 text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* 5. Mobile Navigation Drawer (100% Mobile Responsive without overflow) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fffaf3] border-b border-[#d4af37]/30 px-4 sm:px-6 py-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto animate-fadeIn">
          
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sarees..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#d4af37]/30 rounded-xl text-xs focus:outline-none focus:border-[#5B0E2D]"
            />
          </form>

          {/* Quick Primary Links */}
          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#5B0E2D]">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-white border border-[#d4af37]/25 text-center hover:bg-[#f7f1e5]"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-[#5B0E2D] text-white text-center shadow"
            >
              Shop All Sarees
            </Link>
          </div>

          {/* Mobile Accordion for ALL Categories & Subcategories */}
          <div className="pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#9a6f14] mb-2 px-1">
              Curated Collections & Subcategories
            </div>

            <div className="space-y-1.5">
              {categoriesWithSubcategories.map((cat) => {
                const isExpanded = mobileExpandedCat === cat.id;
                return (
                  <div
                    key={cat.id}
                    className="border border-[#d4af37]/25 rounded-xl overflow-hidden bg-white shadow-xs"
                  >
                    <button
                      onClick={() => toggleMobileCategory(cat.id)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-[#f7f1e5]/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-8 h-8 rounded-lg object-cover border border-[#d4af37]/20 shrink-0"
                        />
                        <div>
                          <span className="font-serif font-bold text-xs text-[#5B0E2D] block">
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {cat.subcategories.length} Subcategories • {cat.count}
                          </span>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#d4af37]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    {/* Expandable Subcategories */}
                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 border-t border-[#d4af37]/15 bg-[#fbf8f2]/60 space-y-1">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-between p-2 rounded-lg text-xs text-gray-700 hover:text-[#5B0E2D] hover:bg-white transition-colors"
                          >
                            <span>{sub.name}</span>
                            <ArrowRight className="w-3 h-3 text-[#d4af37]" />
                          </Link>
                        ))}
                        <Link
                          to={cat.route}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-center text-xs font-bold text-[#5B0E2D] bg-[#f7f1e5] py-2 rounded-lg mt-2"
                        >
                          View All {cat.shortName} Sarees →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Concierge & Support Helper */}
          <div className="pt-3 border-t border-[#d4af37]/20 flex items-center justify-between px-1">
            <a
              href="https://wa.me/919346638123?text=Namaste!%20I%20would%20like%20styling%20advice%20for%20Saree%20Sundarii%20handlooms."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-[#25D366]"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp Stylist</span>
            </a>
            <Link
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-[#5B0E2D]"
            >
              All Categories Index →
            </Link>
          </div>

          {/* User Auth Buttons in Mobile */}
          <div className="pt-2 border-t border-[#d4af37]/20 flex flex-col gap-2">
            {!isAuthenticated ? (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl border border-[#5B0E2D] text-[#5B0E2D] font-bold text-xs"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl bg-[#5B0E2D] text-white font-bold text-xs shadow"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 bg-[#f7f1e5] rounded-xl text-xs font-bold text-[#5B0E2D]"
                >
                  My Profile & Orders
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-red-600 text-xs font-semibold hover:bg-red-50 rounded-xl"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
