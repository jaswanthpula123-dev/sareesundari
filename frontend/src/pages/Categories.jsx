import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI } from '../services/api';
import { Sparkles, ArrowRight, Crown } from 'lucide-react';
import { categoriesWithSubcategories } from '../data/categoriesData';

const Categories = () => {
  const [categories, setCategories] = useState(categoriesWithSubcategories);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    categoryAPI.getAll()
      .then(res => {
        if (res.success && res.categories && res.categories.length > 0) {
          // Merge API count/data with static subcategories
          const merged = categoriesWithSubcategories.map(cat => {
            const match = res.categories.find(c => c.name.toLowerCase() === cat.name.toLowerCase());
            return {
              ...cat,
              count: match?.itemCount ? `${match.itemCount} Sarees` : cat.count,
              image: cat.image || match?.image
            };
          });
          setCategories(merged);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-[#fdfbf7] min-h-screen py-10 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#fcedd8] text-[#5B0E2D] text-xs font-bold">
            <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Royal Indian Handloom Collections</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#5B0E2D]">
            Curated Saree Vaults
          </h1>
          <p className="text-sm text-gray-600 max-w-lg mx-auto">
            Explore authentic handwoven sarees categorized by regional heritage weaves, sacred silks, and bridal traditions.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id || cat.slug}
              className="group bg-white rounded-3xl overflow-hidden border border-[#d4af37]/30 hover:border-[#5B0E2D] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#fcedd8]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#d4af37] text-[#24030F] px-2 py-0.5 rounded-full w-max mb-1">
                    {cat.badge}
                  </span>
                  <span className="text-white font-serif text-2xl font-bold tracking-wide">
                    {cat.name}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  {cat.description}
                </p>

                {/* Subcategories list */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a6f14] block">
                    All Subcategories:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.subcategories?.map(sub => (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#fbf8f2] border border-[#d4af37]/20 text-gray-700 hover:text-[#5B0E2D] hover:border-[#5B0E2D] transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-[#5B0E2D] pt-3 border-t border-gray-100">
                  <span>{cat.count}</span>
                  <Link
                    to={cat.route}
                    className="flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Categories;
