import React, { useState, useEffect } from 'react';
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
import { productAPI, categoryAPI } from '../services/api';

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

  // Search & Filter state
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [silkMarkOnly, setSilkMarkOnly] = useState(false);
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  // UI State
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchFilteredProducts();
  }, [category, minPrice, maxPrice, inStockOnly, silkMarkOnly, sort]);

  const fetchFilteredProducts = async () => {
    try {
      setLoading(true);

      const params = {};
      if (keyword.trim()) params.keyword = keyword.trim();
      if (category && category !== 'All') params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (inStockOnly) params.inStock = true;
      if (silkMarkOnly) {
        params.silkMark = true;
        params.pureGhee = true; // backward compatibility
      }
      if (sort) params.sort = sort;

      const res = await productAPI.getAll(params);

      if (res.success && res.products) {
        setProducts(res.products);
        setTotalCount(res.totalCount || res.count || res.products.length);
      }
    } catch (err) {
      console.error('Failed to fetch sarees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = (newValues = {}) => {
    const updated = {
      keyword,
      category,
      minPrice,
      maxPrice,
      sort,
      ...newValues
    };

    const nextParams = new URLSearchParams();
    if (updated.keyword) nextParams.set('keyword', updated.keyword);
    if (updated.category && updated.category !== 'All') nextParams.set('category', updated.category);
    if (updated.minPrice) nextParams.set('minPrice', updated.minPrice);
    if (updated.maxPrice) nextParams.set('maxPrice', updated.maxPrice);
    if (updated.sort) nextParams.set('sort', updated.sort);

    setSearchParams(nextParams);
    fetchFilteredProducts();
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSilkMarkOnly(false);
    setSort('newest');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    keyword || (category && category !== 'All') || minPrice || maxPrice || inStockOnly || silkMarkOnly
  );

  return (
    <div className="bg-[#fdfbf7] min-h-screen py-8 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-8 border-b border-[#d4af37]/25 pb-6">
          <div className="text-xs text-gray-500 mb-1">
            <span>Home</span> <span className="mx-1">/</span> <span className="text-[#5B0E2D] font-semibold">Shop All Sarees</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#5B0E2D]">
                Royal Handloom Saree Vault
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Showing {products.length} of {totalCount} authentic handcrafted sarees
              </p>
            </div>

            {/* Sort & Mobile Filter Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#d4af37]/40 text-xs font-bold text-[#5B0E2D]"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters {hasActiveFilters && '●'}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 hidden sm:inline">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    handleFilterApply({ sort: e.target.value });
                  }}
                  className="bg-white border border-[#d4af37]/40 rounded-xl px-3 py-2 text-xs font-semibold text-[#2b1f1d] focus:outline-none focus:border-[#5B0E2D]"
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

        {/* Main Grid: Sidebar + Sarees Catalog */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-[#d4af37]/30 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="font-serif text-base font-bold text-[#5B0E2D] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#d4af37]" />
                  Filter Sarees
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
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
                      if (e.key === 'Enter') handleFilterApply();
                    }}
                    placeholder="Search weave, e.g. Kanjivaram..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#5B0E2D]"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-xs font-bold text-[#2b1f1d] block mb-2">
                  Weave Category
                </label>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(cat);
                        handleFilterApply({ category: cat });
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        category === cat
                          ? 'bg-[#5B0E2D] text-white font-bold'
                          : 'text-gray-700 hover:bg-[#f7f1e5]'
                      }`}
                    >
                      <span>{cat}</span>
                      {category === cat && <Check className="w-3.5 h-3.5 text-[#d4af37]" />}
                    </button>
                  ))}
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
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
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
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-[#5B0E2D] focus:ring-[#5B0E2D]"
                  />
                  <span>Ready Drapes Only</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={silkMarkOnly}
                    onChange={(e) => setSilkMarkOnly(e.target.checked)}
                    className="rounded text-[#5B0E2D] focus:ring-[#5B0E2D]"
                  />
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#9a6f14]" />
                    Silk Mark Certified Only
                  </span>
                </label>
              </div>

              {/* Apply Button */}
              <button
                type="button"
                onClick={() => handleFilterApply()}
                className="w-full py-2.5 bg-[#5B0E2D] hover:bg-[#38050c] text-white text-xs font-bold rounded-xl shadow transition-colors cursor-pointer"
              >
                Apply Filters
              </button>

            </div>
          </div>

          {/* Sarees Grid View */}
          <div className="lg:col-span-3">
            
            {/* Active Filter Badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-4 bg-[#fcedd8]/50 p-2.5 rounded-xl border border-[#d4af37]/30">
                <span className="text-xs font-bold text-[#5B0E2D]">Active:</span>
                {keyword && (
                  <span className="bg-white px-2 py-0.5 rounded-md text-xs text-[#5B0E2D] border border-[#d4af37]/30 flex items-center gap-1">
                    "{keyword}"
                    <button onClick={() => { setKeyword(''); handleFilterApply({ keyword: '' }); }}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {category !== 'All' && (
                  <span className="bg-white px-2 py-0.5 rounded-md text-xs text-[#5B0E2D] border border-[#d4af37]/30 flex items-center gap-1">
                    {category}
                    <button onClick={() => { setCategory('All'); handleFilterApply({ category: 'All' }); }}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className="bg-white px-2 py-0.5 rounded-md text-xs text-[#5B0E2D] border border-[#d4af37]/30 flex items-center gap-1">
                    ₹{minPrice || 0} - ₹{maxPrice || '∞'}
                    <button onClick={() => { setMinPrice(''); setMaxPrice(''); handleFilterApply({ minPrice: '', maxPrice: '' }); }}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="bg-white px-2 py-0.5 rounded-md text-xs text-[#5B0E2D] border border-[#d4af37]/30 flex items-center gap-1">
                    Ready Drapes Only
                    <button onClick={() => { setInStockOnly(false); handleFilterApply({ inStockOnly: false }); }}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-red-600 font-bold ml-auto hover:underline"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Products Loading State or Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="bg-white rounded-2xl p-12 text-center border border-[#d4af37]/30 shadow-sm max-w-lg mx-auto my-12">
                <Crown className="w-14 h-14 text-[#5B0E2D] mx-auto mb-3" />
                <h3 className="font-serif text-xl font-bold text-[#5B0E2D] mb-1">
                  No Sarees Match Your Filter
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Try adjusting your search terms, selecting another weave category, or clearing filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#5B0E2D] text-white text-xs font-bold rounded-full shadow hover:bg-[#38050c] transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="font-serif text-lg font-bold text-[#5B0E2D]">Filter Sarees</span>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold block mb-2">Weave Category</label>
              <div className="space-y-1">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-lg ${
                      category === cat ? 'bg-[#5B0E2D] text-white font-bold' : 'hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-2">Price Range</label>
              <div className="space-y-1">
                {priceRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      setMinPrice(range.min);
                      setMaxPrice(range.max);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-lg ${
                      minPrice === range.min && maxPrice === range.max
                        ? 'bg-[#5B0E2D] text-white font-bold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 border border-gray-300 text-xs font-bold rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => handleFilterApply()}
                className="flex-1 py-2.5 bg-[#5B0E2D] text-white text-xs font-bold rounded-xl shadow"
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
