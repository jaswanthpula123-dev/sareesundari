import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Award,
  Check,
  Crown
} from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { productAPI } from '../services/api';
import {
  allSareesCatalog,
  canonicalCategory,
  filterCatalogSarees
} from '../data/sareesCatalog';

const categoriesList = [
  'All',
  'Kanjivaram Sarees',
  'Banarasi Sarees',
  'Silk Sarees',
  'Cotton Sarees',
  'Wedding Sarees',
  'Party Wear Sarees',
  'Designer Sarees',
  'Georgette & Chiffon'
];

const priceRanges = [
  { label: 'All Prices', min: '', max: '' },
  { label: 'Under ₹15,000', min: '0', max: '15000' },
  { label: '₹15,000 - ₹25,000', min: '15000', max: '25000' },
  { label: '₹25,000 - ₹35,000', min: '25000', max: '35000' },
  { label: '₹35,000 & Above', min: '35000', max: '100000' }
];

const sortOptions = [
  { value: 'newest', label: 'Newest Heirlooms' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' }
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL search params with safe normalization
  const urlCategory = useMemo(() => {
    const raw = searchParams.get('category');
    return raw ? canonicalCategory(raw) : 'All';
  }, [searchParams]);

  const urlSubCollection = searchParams.get('subCollection') || '';
  const urlKeyword = searchParams.get('keyword') || '';
  const urlMinPrice = searchParams.get('minPrice') || '';
  const urlMaxPrice = searchParams.get('maxPrice') || '';
  const urlSort = searchParams.get('sort') || 'newest';

  // State
  const [keyword, setKeyword] = useState(urlKeyword);
  const [category, setCategory] = useState(urlCategory);
  const [subCollection, setSubCollection] = useState(urlSubCollection);
  const [minPrice, setMinPrice] = useState(urlMinPrice);
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [silkMarkOnly, setSilkMarkOnly] = useState(false);
  const [sort, setSort] = useState(urlSort);

  // Initial filtered state based on URL parameters to prevent any blank/flicker state
  const initialData = useMemo(() => {
    return filterCatalogSarees({
      category: urlCategory,
      subCollection: urlSubCollection,
      keyword: urlKeyword,
      minPrice: urlMinPrice,
      maxPrice: urlMaxPrice,
      sort: urlSort
    });
  }, [urlCategory, urlSubCollection, urlKeyword, urlMinPrice, urlMaxPrice, urlSort]);

  // UI State
  const [products, setProducts] = useState(initialData.products);
  const [totalCount, setTotalCount] = useState(initialData.totalCount);
  const [loading, setLoading] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Synchronize state when URL search params change
  useEffect(() => {
    setCategory(urlCategory);
    setSubCollection(urlSubCollection);
    setKeyword(urlKeyword);
    setMinPrice(urlMinPrice);
    setMaxPrice(urlMaxPrice);
    setSort(urlSort);
    const fresh = filterCatalogSarees({
      category: urlCategory,
      subCollection: urlSubCollection,
      keyword: urlKeyword,
      minPrice: urlMinPrice,
      maxPrice: urlMaxPrice,
      sort: urlSort
    });
    setProducts(fresh.products);
    setTotalCount(fresh.totalCount);
  }, [urlCategory, urlSubCollection, urlKeyword, urlMinPrice, urlMaxPrice, urlSort]);

  // Dynamic count calculator for category pills
  const getCategoryCount = useCallback((catName) => {
    if (catName === 'All') return allSareesCatalog.length;
    const target = canonicalCategory(catName).toLowerCase();
    return allSareesCatalog.filter(p => {
      const pCat = p.category?.toLowerCase() || '';
      return pCat === target || 
             pCat.includes(target.replace(' sarees', '')) || 
             target.includes(pCat.replace(' sarees', ''));
    }).length;
  }, []);

  // Fetch or filter products
  const executeFilter = useCallback(async (overrides = {}) => {
    try {
      setLoading(true);

      const activeCat = overrides.category !== undefined ? overrides.category : category;
      const activeSub = overrides.subCollection !== undefined ? overrides.subCollection : subCollection;
      const activeKw = overrides.keyword !== undefined ? overrides.keyword : keyword;
      const activeMin = overrides.minPrice !== undefined ? overrides.minPrice : minPrice;
      const activeMax = overrides.maxPrice !== undefined ? overrides.maxPrice : maxPrice;
      const activeInStock = overrides.inStockOnly !== undefined ? overrides.inStockOnly : inStockOnly;
      const activeSilkMark = overrides.silkMarkOnly !== undefined ? overrides.silkMarkOnly : silkMarkOnly;
      const activeSort = overrides.sort !== undefined ? overrides.sort : sort;

      const params = {};
      if (activeKw && activeKw.trim()) params.keyword = activeKw.trim();
      if (activeSub && activeSub.trim()) params.subCollection = activeSub.trim();
      if (activeCat && activeCat !== 'All') params.category = activeCat;
      if (activeMin) params.minPrice = activeMin;
      if (activeMax) params.maxPrice = activeMax;
      if (activeInStock) params.inStock = true;
      if (activeSilkMark) {
        params.silkMark = true;
        params.pureGhee = true;
      }
      if (activeSort) params.sort = activeSort;

      // Try API with automatic fallback to full local catalog
      const res = await productAPI.getAll(params);

      if (res && res.products && Array.isArray(res.products)) {
        setProducts(res.products);
        setTotalCount(res.totalCount || res.count || res.products.length);
      } else {
        const localRes = filterCatalogSarees(params);
        setProducts(localRes.products);
        setTotalCount(localRes.totalCount);
      }
    } catch (err) {
      console.error('Failed to fetch sarees, applying client catalog fallback:', err);
      const localRes = filterCatalogSarees({
        category: overrides.category !== undefined ? overrides.category : category,
        subCollection: overrides.subCollection !== undefined ? overrides.subCollection : subCollection,
        keyword: overrides.keyword !== undefined ? overrides.keyword : keyword,
        minPrice: overrides.minPrice !== undefined ? overrides.minPrice : minPrice,
        maxPrice: overrides.maxPrice !== undefined ? overrides.maxPrice : maxPrice,
        inStockOnly: overrides.inStockOnly !== undefined ? overrides.inStockOnly : inStockOnly,
        silkMarkOnly: overrides.silkMarkOnly !== undefined ? overrides.silkMarkOnly : silkMarkOnly,
        sort: overrides.sort !== undefined ? overrides.sort : sort
      });
      setProducts(localRes.products);
      setTotalCount(localRes.totalCount);
    } finally {
      setLoading(false);
    }
  }, [category, subCollection, keyword, minPrice, maxPrice, inStockOnly, silkMarkOnly, sort]);

  // Main filter effect
  useEffect(() => {
    executeFilter();
  }, [category, subCollection, keyword, minPrice, maxPrice, inStockOnly, silkMarkOnly, sort]);

  // Apply filters and update URL
  const handleFilterApply = (newValues = {}) => {
    const updated = {
      keyword,
      category,
      subCollection,
      minPrice,
      maxPrice,
      sort,
      inStockOnly,
      silkMarkOnly,
      ...newValues
    };

    const nextParams = new URLSearchParams();
    if (updated.keyword) nextParams.set('keyword', updated.keyword);
    if (updated.category && updated.category !== 'All') nextParams.set('category', updated.category);
    if (updated.subCollection) nextParams.set('subCollection', updated.subCollection);
    if (updated.minPrice) nextParams.set('minPrice', updated.minPrice);
    if (updated.maxPrice) nextParams.set('maxPrice', updated.maxPrice);
    if (updated.sort) nextParams.set('sort', updated.sort);

    setSearchParams(nextParams);
    executeFilter(updated);
    setMobileFilterOpen(false);
  };

  // Reset all filters to show full catalog
  const handleResetFilters = () => {
    setKeyword('');
    setCategory('All');
    setSubCollection('');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSilkMarkOnly(false);
    setSort('newest');
    setSearchParams(new URLSearchParams());
    executeFilter({
      keyword: '',
      category: 'All',
      subCollection: '',
      minPrice: '',
      maxPrice: '',
      inStockOnly: false,
      silkMarkOnly: false,
      sort: 'newest'
    });
    setMobileFilterOpen(false);
  };

  // Helper to test if category matches
  const isCategorySelected = (catName) => {
    if (catName === 'All') return category === 'All';
    return canonicalCategory(category) === canonicalCategory(catName);
  };

  const hasActiveFilters = Boolean(
    keyword || (category && category !== 'All') || subCollection || minPrice || maxPrice || inStockOnly || silkMarkOnly
  );

  return (
    <div className="bg-[#fdfbf7] min-h-screen py-6 sm:py-8 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-6 sm:mb-8 border-b border-[#d4af37]/25 pb-5 sm:pb-6">
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <span>Home</span> <span className="text-[#d4af37]">/</span> <span className="text-[#5B0E2D] font-semibold">Shop All Sarees</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#5B0E2D]">
                Royal Handloom Saree Vault
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
                Showing {products.length} of {totalCount} authentic handcrafted sarees
              </p>
            </div>

            {/* Sort & Mobile Filter Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#d4af37]/40 text-xs font-bold text-[#5B0E2D] shadow-xs active:bg-[#f7f1e5] cursor-pointer"
                aria-label="Open filter options"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#d4af37]" />
                <span>Filters {hasActiveFilters && '●'}</span>
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs text-gray-500 hidden sm:inline">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    handleFilterApply({ sort: e.target.value });
                  }}
                  className="bg-white border border-[#d4af37]/40 rounded-xl px-2.5 sm:px-3 py-2 text-xs font-semibold text-[#2b1f1d] focus:outline-none focus:border-[#5B0E2D] cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Category Pills Bar (Fast Tap & Filter) */}
        {/* Allows instant one-tap filtering between Kanjivaram, Banarasi, Silk, Cotton, etc. */}
        <div className="lg:hidden mb-5 -mx-4 px-4 overflow-x-auto scrollbar-none flex items-center gap-2 py-1">
          {categoriesList.map((cat) => {
            const isCatActive = isCategorySelected(cat);
            const count = getCategoryCount(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  const targetCat = cat === 'All' ? 'All' : canonicalCategory(cat);
                  setCategory(targetCat);
                  setSubCollection('');
                  handleFilterApply({ category: targetCat, subCollection: '' });
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isCatActive
                    ? 'bg-[#5B0E2D] text-white border-[#5B0E2D] shadow-sm'
                    : 'bg-white text-[#2b1f1d] border-[#d4af37]/35 hover:border-[#5B0E2D] hover:bg-[#fbf8f2]'
                }`}
              >
                <span>{cat === 'All' ? 'All Sarees' : cat.replace(' Sarees', '')}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isCatActive ? 'bg-white/20 text-[#d4af37]' : 'bg-[#f7f1e5] text-[#5B0E2D]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Grid: Sidebar + Sarees Catalog */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-[#d4af37]/30 shadow-sm space-y-6 sticky top-24">
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="font-serif text-base font-bold text-[#5B0E2D] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#d4af37]" />
                  Filter Sarees
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Search By Name */}
              <div>
                <label className="text-xs font-bold text-[#2b1f1d] block mb-2">
                  Search Sarees
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleFilterApply({ keyword: e.target.value });
                    }}
                    placeholder="Search weave, e.g. Banarasi, Zari..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#5B0E2D]"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-xs font-bold text-[#2b1f1d] block mb-2">
                  Weave Category
                </label>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1 scrollbar-none">
                  {categoriesList.map((cat) => {
                    const isSelected = isCategorySelected(cat);
                    const count = getCategoryCount(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          const targetCat = cat === 'All' ? 'All' : canonicalCategory(cat);
                          setCategory(targetCat);
                          setSubCollection('');
                          handleFilterApply({ category: targetCat, subCollection: '' });
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#5B0E2D] text-white font-bold'
                            : 'text-gray-700 hover:bg-[#f7f1e5]'
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            isSelected ? 'bg-white/20 text-[#d4af37]' : 'bg-[#f7f1e5] text-gray-600'
                          }`}>
                            {count}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#d4af37]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="text-xs font-bold text-[#2b1f1d] block mb-2">
                  Price Range
                </label>
                <div className="space-y-1">
                  {priceRanges.map((range) => {
                    const isSelected = minPrice === range.min && maxPrice === range.max;
                    return (
                      <button
                        key={range.label}
                        type="button"
                        onClick={() => {
                          setMinPrice(range.min);
                          setMaxPrice(range.max);
                          handleFilterApply({ minPrice: range.min, maxPrice: range.max });
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#5B0E2D] text-white font-bold'
                            : 'text-gray-700 hover:bg-[#f7f1e5]'
                        }`}
                      >
                        <span>{range.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#d4af37]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quality & Silk Mark Toggles */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      handleFilterApply({ inStockOnly: e.target.checked });
                    }}
                    className="rounded text-[#5B0E2D] focus:ring-[#5B0E2D]"
                  />
                  <span>Ready Drapes Only</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={silkMarkOnly}
                    onChange={(e) => {
                      setSilkMarkOnly(e.target.checked);
                      handleFilterApply({ silkMarkOnly: e.target.checked });
                    }}
                    className="rounded text-[#5B0E2D] focus:ring-[#5B0E2D]"
                  />
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#9a6f14]" />
                    Silk Mark Certified Only
                  </span>
                </label>
              </div>

              {/* Apply / Reset Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleFilterApply()}
                  className="flex-1 py-2.5 bg-[#5B0E2D] hover:bg-[#38050c] text-white text-xs font-bold rounded-xl shadow transition-colors cursor-pointer"
                >
                  Apply Filters
                </button>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="py-2.5 px-3 border border-gray-200 text-xs font-semibold rounded-xl hover:bg-gray-50 text-gray-600 cursor-pointer"
                    title="Clear All"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Sarees Grid View */}
          <div className="lg:col-span-3">
            
            {/* Active Filter Badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-4 bg-[#fcedd8]/50 p-2.5 sm:p-3 rounded-2xl border border-[#d4af37]/30">
                <span className="text-xs font-bold text-[#5B0E2D] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  Active Filters:
                </span>
                
                {keyword && (
                  <span className="bg-white px-2.5 py-1 rounded-lg text-xs text-[#5B0E2D] border border-[#d4af37]/30 flex items-center gap-1.5 shadow-xs">
                    <span>"{keyword}"</span>
                    <button 
                      onClick={() => { setKeyword(''); handleFilterApply({ keyword: '' }); }}
                      className="text-gray-400 hover:text-red-600 cursor-pointer"
                      aria-label="Remove keyword filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {category !== 'All' && (
                  <span className="bg-white px-2.5 py-1 rounded-lg text-xs font-semibold text-[#5B0E2D] border border-[#d4af37]/30 flex items-center gap-1.5 shadow-xs">
                    <span>{category}</span>
                    <button 
                      onClick={() => { setCategory('All'); handleFilterApply({ category: 'All' }); }}
                      className="text-gray-400 hover:text-red-600 cursor-pointer"
                      aria-label="Remove category filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {subCollection && (
                  <span className="bg-white px-2.5 py-1 rounded-lg text-xs font-semibold text-[#5B0E2D] border border-[#d4af37]/30 flex items-center gap-1.5 shadow-xs">
                    <span>Weave: {subCollection}</span>
                    <button 
                      onClick={() => { setSubCollection(''); handleFilterApply({ subCollection: '' }); }}
                      className="text-gray-400 hover:text-red-600 cursor-pointer"
                      aria-label="Remove subcollection filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {(minPrice || maxPrice) && (
                  <span className="bg-white px-2.5 py-1 rounded-lg text-xs text-[#5B0E2D] border border-[#d4af37]/30 flex items-center gap-1.5 shadow-xs">
                    <span>₹{minPrice || 0} - ₹{maxPrice || '∞'}</span>
                    <button 
                      onClick={() => { setMinPrice(''); setMaxPrice(''); handleFilterApply({ minPrice: '', maxPrice: '' }); }}
                      className="text-gray-400 hover:text-red-600 cursor-pointer"
                      aria-label="Remove price filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {inStockOnly && (
                  <span className="bg-white px-2.5 py-1 rounded-lg text-xs text-[#5B0E2D] border border-[#d4af37]/30 flex items-center gap-1.5 shadow-xs">
                    <span>Ready Drapes Only</span>
                    <button 
                      onClick={() => { setInStockOnly(false); handleFilterApply({ inStockOnly: false }); }}
                      className="text-gray-400 hover:text-red-600 cursor-pointer"
                      aria-label="Remove in-stock filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {silkMarkOnly && (
                  <span className="bg-white px-2.5 py-1 rounded-lg text-xs text-[#5B0E2D] border border-[#d4af37]/30 flex items-center gap-1.5 shadow-xs">
                    <span>Silk Mark Certified Only</span>
                    <button 
                      onClick={() => { setSilkMarkOnly(false); handleFilterApply({ silkMarkOnly: false }); }}
                      className="text-gray-400 hover:text-red-600 cursor-pointer"
                      aria-label="Remove silk mark filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  onClick={handleResetFilters}
                  className="text-xs text-red-600 font-bold ml-auto hover:underline cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              </div>
            )}

            {/* Products Loading State or Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-2xl h-96 animate-pulse border border-gray-100 p-4">
                    <div className="bg-gray-200 aspect-[4/3] rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-full mt-auto"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-[#d4af37]/30 shadow-sm max-w-lg mx-auto my-8">
                <Crown className="w-14 h-14 text-[#5B0E2D] mx-auto mb-3" />
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#5B0E2D] mb-1.5">
                  No Sarees Match Your Filter
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
                  We couldn't find matching sarees with the current filters. Clear filters to explore all 34 authentic handcrafted heirlooms.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#5B0E2D] text-white text-xs font-bold rounded-full shadow hover:bg-[#38050c] transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters & View All 34 Sarees</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-xs bg-white h-full p-5 overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="font-serif text-base font-bold text-[#5B0E2D] flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-[#d4af37]" />
                Filter Saree Vault
              </span>
              <button 
                onClick={() => setMobileFilterOpen(false)} 
                className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 cursor-pointer"
                aria-label="Close filters drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Weave Category in Mobile Drawer */}
            <div>
              <label className="text-xs font-bold block mb-2 text-[#2b1f1d]">Weave Category</label>
              <div className="space-y-1">
                {categoriesList.map((cat) => {
                  const isSelected = isCategorySelected(cat);
                  const count = getCategoryCount(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        const targetCat = cat === 'All' ? 'All' : canonicalCategory(cat);
                        setCategory(targetCat);
                        setSubCollection('');
                        handleFilterApply({ category: targetCat, subCollection: '' });
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#5B0E2D] text-white font-bold'
                          : 'text-gray-700 hover:bg-[#f7f1e5]'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-[#d4af37]' : 'bg-[#f7f1e5] text-gray-600'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range in Mobile Drawer */}
            <div>
              <label className="text-xs font-bold block mb-2 text-[#2b1f1d]">Price Range</label>
              <div className="space-y-1">
                {priceRanges.map((range) => {
                  const isSelected = minPrice === range.min && maxPrice === range.max;
                  return (
                    <button
                      key={range.label}
                      type="button"
                      onClick={() => {
                        setMinPrice(range.min);
                        setMaxPrice(range.max);
                        handleFilterApply({ minPrice: range.min, maxPrice: range.max });
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#5B0E2D] text-white font-bold'
                          : 'text-gray-700 hover:bg-[#f7f1e5]'
                      }`}
                    >
                      <span>{range.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#d4af37]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2.5 pt-3 border-t border-gray-100 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    handleFilterApply({ inStockOnly: e.target.checked });
                  }}
                  className="rounded text-[#5B0E2D] focus:ring-[#5B0E2D]"
                />
                <span>Ready Drapes Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={silkMarkOnly}
                  onChange={(e) => {
                    setSilkMarkOnly(e.target.checked);
                    handleFilterApply({ silkMarkOnly: e.target.checked });
                  }}
                  className="rounded text-[#5B0E2D] focus:ring-[#5B0E2D]"
                />
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#9a6f14]" />
                  Silk Mark Certified Only
                </span>
              </label>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-2.5 border border-gray-300 text-xs font-bold rounded-xl text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => handleFilterApply()}
                className="flex-1 py-2.5 bg-[#5B0E2D] text-white text-xs font-bold rounded-xl shadow hover:bg-[#38050c] cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
