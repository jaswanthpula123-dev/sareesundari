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
  Check
} from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { productAPI, categoryAPI } from '../services/api';

const categoriesList = [
  'All',
  'Ghee Sweets',
  'Dry Fruit Sweets',
  'Bengali Sweets',
  'Traditional Laddus',
  'Milk Sweets',
  'Festive Hampers'
];

const priceRanges = [
  { label: 'All Prices', min: '', max: '' },
  { label: 'Under ₹200', min: '0', max: '200' },
  { label: '₹200 - ₹300', min: '200', max: '300' },
  { label: '₹300 - ₹500', min: '300', max: '500' },
  { label: '₹500 & Above', min: '500', max: '5000' }
];

const sortOptions = [
  { value: 'newest', label: 'Newest Arrivals' },
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
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStockOnly') === 'true');
  const [pureGheeOnly, setPureGheeOnly] = useState(searchParams.get('pureGhee') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    const kw = searchParams.get('keyword') || '';
    const cat = searchParams.get('category') || 'All';
    const minP = searchParams.get('minPrice') || '';
    const maxP = searchParams.get('maxPrice') || '';
    const stock = searchParams.get('inStockOnly') === 'true';
    const s = searchParams.get('sort') || 'newest';

    setKeyword(kw);
    setCategory(cat);
    setMinPrice(minP);
    setMaxPrice(maxP);
    setInStockOnly(stock);
    setSort(s);

    fetchProducts({ keyword: kw, category: cat, minPrice: minP, maxPrice: maxP, inStockOnly: stock, sort: s });
  }, [searchParams]);

  const fetchProducts = async (paramsObj) => {
    try {
      setLoading(true);
      const queryParams = {
        keyword: paramsObj.keyword || undefined,
        category: paramsObj.category !== 'All' ? paramsObj.category : undefined,
        minPrice: paramsObj.minPrice || undefined,
        maxPrice: paramsObj.maxPrice || undefined,
        inStockOnly: paramsObj.inStockOnly || undefined,
        pureGhee: paramsObj.pureGhee || undefined,
        sort: paramsObj.sort || undefined
      };

      const res = await productAPI.getAll(queryParams);
      if (res.success) {
        setProducts(res.products || []);
        setTotalCount(res.total || res.count || 0);
      }
    } catch (err) {
      console.error('Failed to fetch sweets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = (updates = {}) => {
    const nextParams = new URLSearchParams(searchParams);

    const merged = {
      keyword,
      category,
      minPrice,
      maxPrice,
      inStockOnly,
      pureGhee: pureGheeOnly,
      sort,
      ...updates
    };

    if (merged.keyword) nextParams.set('keyword', merged.keyword);
    else nextParams.delete('keyword');

    if (merged.category && merged.category !== 'All') nextParams.set('category', merged.category);
    else nextParams.delete('category');

    if (merged.minPrice) nextParams.set('minPrice', merged.minPrice);
    else nextParams.delete('minPrice');

    if (merged.maxPrice) nextParams.set('maxPrice', merged.maxPrice);
    else nextParams.delete('maxPrice');

    if (merged.inStockOnly) nextParams.set('inStockOnly', 'true');
    else nextParams.delete('inStockOnly');

    if (merged.pureGhee) nextParams.set('pureGhee', 'true');
    else nextParams.delete('pureGhee');

    if (merged.sort && merged.sort !== 'newest') nextParams.set('sort', merged.sort);
    else nextParams.delete('sort');

    setSearchParams(nextParams);
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setPureGheeOnly(false);
    setSort('newest');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    keyword || (category && category !== 'All') || minPrice || maxPrice || inStockOnly || pureGheeOnly
  );

  return (
    <div className="bg-[#fdfbf7] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-8 border-b border-[#d4af37]/25 pb-6">
          <div className="text-xs text-gray-500 mb-1">
            <span>Home</span> <span className="mx-1">/</span> <span className="text-[#6b0f1a] font-semibold">Shop Sweets</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#4d0a13]">
                Traditional Indian Sweets
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Showing {products.length} of {totalCount} authentic handcrafted delicacies
              </p>
            </div>

            {/* Sort & Mobile Filter Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#d4af37]/40 text-xs font-bold text-[#6b0f1a]"
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
                  className="bg-white border border-[#d4af37]/40 rounded-xl px-3 py-2 text-xs font-semibold text-[#2b1f1d] focus:outline-none focus:border-[#6b0f1a]"
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

        {/* Main Grid: Sidebar + Sweets Catalog */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-[#d4af37]/30 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="font-serif text-base font-bold text-[#4d0a13] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#d4af37]" />
                  Filters
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
                  Search Sweets
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
                    placeholder="Search name, e.g. Kaju..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-xs font-bold text-[#2b1f1d] block mb-2">
                  Category
                </label>
                <div className="space-y-1.5">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(cat);
                        handleFilterApply({ category: cat });
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-between ${
                        category === cat
                          ? 'bg-[#6b0f1a] text-white font-bold'
                          : 'text-[#2b1f1d] hover:bg-[#f7f1e5]'
                      }`}
                    >
                      <span>{cat}</span>
                      {category === cat && <Check className="w-3.5 h-3.5 text-[#d4af37]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Ranges */}
              <div>
                <label className="text-xs font-bold text-[#2b1f1d] block mb-2">
                  Price Range
                </label>
                <div className="space-y-1.5">
                  {priceRanges.map((r, i) => {
                    const isSelected = minPrice === r.min && maxPrice === r.max;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setMinPrice(r.min);
                          setMaxPrice(r.max);
                          handleFilterApply({ minPrice: r.min, maxPrice: r.max });
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#6b0f1a] text-white font-bold'
                            : 'text-[#2b1f1d] hover:bg-[#f7f1e5]'
                        }`}
                      >
                        <span>{r.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#d4af37]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* In-Stock & Pure Ghee Toggles */}
              <div className="pt-2 border-t border-gray-100 space-y-3">
                <label className="flex items-center gap-2.5 text-xs font-medium text-[#2b1f1d] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      handleFilterApply({ inStockOnly: e.target.checked });
                    }}
                    className="w-4 h-4 rounded text-[#6b0f1a] focus:ring-[#6b0f1a]"
                  />
                  <span>Show Available Products Only</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-[#2b1f1d] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pureGheeOnly}
                    onChange={(e) => {
                      setPureGheeOnly(e.target.checked);
                      handleFilterApply({ pureGhee: e.target.checked });
                    }}
                    className="w-4 h-4 rounded text-[#6b0f1a] focus:ring-[#6b0f1a]"
                  />
                  <span>100% Pure Desi Ghee Only</span>
                </label>
              </div>

              <button
                type="button"
                onClick={() => handleFilterApply()}
                className="w-full py-2.5 bg-[#6b0f1a] hover:bg-[#4d0a13] text-white text-xs font-bold rounded-xl shadow transition-colors"
              >
                Apply Filters
              </button>

            </div>
          </div>

          {/* Sweets Grid View */}
          <div className="lg:col-span-3">
            
            {/* Active Filter Badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-4 bg-[#fcedd8]/50 p-2.5 rounded-xl border border-[#d4af37]/30">
                <span className="text-xs font-bold text-[#4d0a13]">Active:</span>
                {keyword && (
                  <span className="bg-white px-2 py-0.5 rounded-md text-xs text-[#6b0f1a] border border-[#d4af37]/30 flex items-center gap-1">
                    "{keyword}"
                    <button onClick={() => { setKeyword(''); handleFilterApply({ keyword: '' }); }}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {category !== 'All' && (
                  <span className="bg-white px-2 py-0.5 rounded-md text-xs text-[#6b0f1a] border border-[#d4af37]/30 flex items-center gap-1">
                    {category}
                    <button onClick={() => { setCategory('All'); handleFilterApply({ category: 'All' }); }}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className="bg-white px-2 py-0.5 rounded-md text-xs text-[#6b0f1a] border border-[#d4af37]/30 flex items-center gap-1">
                    ₹{minPrice || 0} - ₹{maxPrice || '∞'}
                    <button onClick={() => { setMinPrice(''); setMaxPrice(''); handleFilterApply({ minPrice: '', maxPrice: '' }); }}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="bg-white px-2 py-0.5 rounded-md text-xs text-[#6b0f1a] border border-[#d4af37]/30 flex items-center gap-1">
                    In Stock Only
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
                <span className="text-5xl block mb-3">🍬</span>
                <h3 className="font-serif text-xl font-bold text-[#4d0a13] mb-1">
                  No Sweets Match Your Filter
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Try adjusting your search terms, changing the category, or clearing filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#6b0f1a] text-white text-xs font-bold rounded-full shadow"
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
              <span className="font-serif text-lg font-bold text-[#4d0a13]">Filter Sweets</span>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold block mb-2">Category</label>
              <div className="space-y-1">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-lg ${
                      category === cat ? 'bg-[#6b0f1a] text-white font-bold' : 'hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-200">
              <label className="flex items-center gap-2 text-xs font-medium">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#6b0f1a]"
                />
                <span>Available Sweets Only</span>
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 border border-gray-300 text-xs font-bold rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => handleFilterApply()}
                className="flex-1 py-2.5 bg-[#6b0f1a] text-white text-xs font-bold rounded-xl shadow"
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
