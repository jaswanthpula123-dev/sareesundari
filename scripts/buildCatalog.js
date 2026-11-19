const fs = require('fs');
const path = require('path');
const { productsData, categoriesData } = require('../backend/seed/seedData');

// Add deterministic _id to each product
const enrichedProducts = productsData.map((p, idx) => ({
  _id: 'saree_' + (idx + 1).toString().padStart(3, '0'),
  ...p,
  discountPercentage: p.discountPrice && p.discountPrice < p.price 
    ? Math.round(((p.price - p.discountPrice) / p.price) * 100) 
    : 0,
  finalPrice: p.discountPrice > 0 ? p.discountPrice : p.price,
  createdAt: new Date('2026-01-01T00:00:00Z').toISOString()
}));

const helperCode = `
/**
 * Canonical category normalizer to prevent casing, spacing, and short-name mismatches.
 * Maps 'Banarasi', 'banarasi', 'Banarasi Sarees', 'Kanjivaram', 'Silk', etc. to standard category names.
 */
export const canonicalCategory = (raw) => {
  if (!raw) return 'All';
  const clean = String(raw).trim().toLowerCase().replace(/\\+/g, ' ').replace(/-/g, ' ');
  if (!clean || clean === 'all') return 'All';
  if (clean.includes('kanjivaram') || clean.includes('kanchi') || clean.includes('pattu')) return 'Kanjivaram Sarees';
  if (clean.includes('banarasi') || clean.includes('varanasi') || clean.includes('katan') || clean.includes('kadwa')) return 'Banarasi Sarees';
  if (clean.includes('cotton') || clean.includes('kota') || clean.includes('jamdani') || clean.includes('tant')) return 'Cotton Sarees';
  if (clean.includes('wedding') || clean.includes('bridal') || clean.includes('muhurtham') || clean.includes('trousseau')) return 'Wedding Sarees';
  if (clean.includes('party') || clean.includes('cocktail') || clean.includes('pre draped') || clean.includes('shimmer')) return 'Party Wear Sarees';
  if (clean.includes('designer') || clean.includes('bandhani') || clean.includes('gharchola')) return 'Designer Sarees';
  if (clean.includes('georgette') || clean.includes('chiffon') || clean.includes('chikankari')) return 'Georgette & Chiffon';
  if (clean.includes('silk') || clean.includes('paithani') || clean.includes('mysore') || clean.includes('baluchari') || clean.includes('sambalpuri') || clean.includes('tussar')) return 'Silk Sarees';
  return raw;
};

/**
 * Client-side robust filter engine for all 34 sarees
 */
export const filterCatalogSarees = (params = {}) => {
  let list = [...allSareesCatalog];

  // 1. Category filter with canonical normalization
  if (params.category && params.category !== 'All') {
    const targetCat = canonicalCategory(params.category).toLowerCase();
    list = list.filter(p => {
      const pCat = p.category?.toLowerCase() || '';
      return pCat === targetCat || 
             pCat.includes(targetCat.replace(' sarees', '')) || 
             targetCat.includes(pCat.replace(' sarees', ''));
    });
  }

  // 2. SubCollection search / filter with token matching and graceful fallback
  if (params.subCollection && String(params.subCollection).trim()) {
    const rawSub = String(params.subCollection).trim().toLowerCase().replace(/\\+/g, ' ').replace(/-/g, ' ');
    const tokens = rawSub.split(/\\s+/).filter(w => w.length > 2 && w !== 'and' && w !== 'sarees');
    const subFiltered = list.filter(p => {
      const pText = [p.name, p.description, p.category, p.ingredients, p.slug].filter(Boolean).join(' ').toLowerCase();
      return pText.includes(rawSub) || tokens.some(t => pText.includes(t));
    });
    // If specific subcollection matches found, use them; otherwise keep category list so users never see 0 products
    if (subFiltered.length > 0) {
      list = subFiltered;
    }
  }

  // 3. Keyword search (name, description, category, ingredients, slug)
  if (params.keyword && String(params.keyword).trim()) {
    const kw = String(params.keyword).trim().toLowerCase();
    list = list.filter(p =>
      p.name?.toLowerCase().includes(kw) ||
      p.description?.toLowerCase().includes(kw) ||
      p.category?.toLowerCase().includes(kw) ||
      p.ingredients?.toLowerCase().includes(kw) ||
      p.slug?.toLowerCase().includes(kw)
    );
  }

  // 4. In Stock only
  if (params.inStock === true || params.inStock === 'true' || params.inStockOnly === true || params.inStockOnly === 'true') {
    list = list.filter(p => p.stock > 0 && p.availability !== 'Out of Stock');
  }

  // 5. Silk Mark only
  if (params.silkMark === true || params.silkMark === 'true' || params.silkMarkOnly === true || params.silkMarkOnly === 'true' || params.pureGhee === true) {
    list = list.filter(p => p.pureGhee || (p.ingredients && p.ingredients.toLowerCase().includes('silk mark')));
  }

  // 6. Featured / Best Seller / Festival Special
  if (params.isFeatured === true || params.isFeatured === 'true') {
    list = list.filter(p => p.isFeatured);
  }
  if (params.isBestSeller === true || params.isBestSeller === 'true') {
    list = list.filter(p => p.isBestSeller);
  }
  if (params.isFestivalSpecial === true || params.isFestivalSpecial === 'true') {
    list = list.filter(p => p.isFestivalSpecial);
  }

  // 7. Price range
  if (params.minPrice) {
    const min = Number(params.minPrice);
    if (!isNaN(min)) {
      list = list.filter(p => {
        const pr = p.discountPrice > 0 ? p.discountPrice : p.price;
        return pr >= min;
      });
    }
  }
  if (params.maxPrice) {
    const max = Number(params.maxPrice);
    if (!isNaN(max)) {
      list = list.filter(p => {
        const pr = p.discountPrice > 0 ? p.discountPrice : p.price;
        return pr <= max;
      });
    }
  }

  // 8. Sorting
  if (params.sort === 'price-asc') {
    list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (params.sort === 'price-desc') {
    list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (params.sort === 'rating') {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (params.sort === 'popular') {
    list.sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));
  } else {
    // Default newest
    list.sort((a, b) => (b._id || '').localeCompare(a._id || ''));
  }

  // 9. Limit
  if (params.limit && !isNaN(Number(params.limit))) {
    list = list.slice(0, Number(params.limit));
  }

  return {
    success: true,
    count: list.length,
    totalCount: list.length,
    total: list.length,
    products: list
  };
};

/**
 * Find single saree by _id or slug
 */
export const getCatalogSareeByIdOrSlug = (idOrSlug) => {
  if (!idOrSlug) return null;
  const target = String(idOrSlug).toLowerCase().trim();
  return allSareesCatalog.find(p => 
    p._id === idOrSlug ||
    p.slug?.toLowerCase() === target ||
    p._id?.toLowerCase() === target
  ) || null;
};
`;

const content = '// Auto-generated client-side authentic saree catalog & filter engine\n' +
  'export const allSareesCatalog = ' + JSON.stringify(enrichedProducts, null, 2) + ';\n\n' +
  'export const allCategoriesCatalog = ' + JSON.stringify(categoriesData.map((c, idx) => ({
    _id: 'cat_' + (idx + 1).toString().padStart(3, '0'),
    ...c
  })), null, 2) + ';\n' + helperCode;

const outPath = path.join(__dirname, '../frontend/src/data/sareesCatalog.js');
fs.writeFileSync(outPath, content, 'utf8');
console.log('Successfully written', outPath, 'with', enrichedProducts.length, 'products');
