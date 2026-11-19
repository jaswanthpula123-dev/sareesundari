import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  Package,
  Award
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getProducts();
      if (res.success && res.products) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error(err);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the sweet catalog?`)) {
      return;
    }

    try {
      const res = await adminAPI.deleteProduct(id);
      if (res.success) {
        addToast(`Removed "${name}" from store.`);
        setProducts(products.filter(p => p._id !== id));
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleRestock = async (id, name) => {
    try {
      const res = await adminAPI.restockProduct(id, 25);
      if (res.success) {
        addToast(`Added +25 boxes to "${name}" inventory.`);
        setProducts(products.map(p => p._id === id ? { ...p, stock: p.stock + 25, availability: 'In Stock' } : p));
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d4af37]/20">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#4d0a13]">
            Sweets Catalog & Inventory
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your sweet varieties, weights, pricing, and active stock levels.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="px-5 py-2.5 bg-[#6b0f1a] hover:bg-[#4d0a13] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#d4af37]" />
          <span>Add New Sweet</span>
        </Link>
      </div>

      {/* Search & Stats Filter */}
      <div className="bg-white rounded-2xl p-4 border border-[#d4af37]/30 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sweet by name or category..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
          />
        </div>

        <div className="text-xs text-gray-500 font-semibold">
          Showing {filteredProducts.length} of {products.length} sweets
        </div>
      </div>

      {/* Sweets Table */}
      <div className="bg-white rounded-3xl border border-[#d4af37]/30 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-400">Loading sweets catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400">No sweets found matching your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fdfbf7] border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Sweet</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Base Price (250g)</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((sweet) => {
                  const isOut = sweet.stock <= 0;
                  const isLow = sweet.stock > 0 && sweet.stock <= 10;

                  return (
                    <tr key={sweet._id} className="hover:bg-[#fdfbf7] transition-colors">
                      {/* Sweet Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={sweet.images?.[0] || 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=200&q=80'}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-gray-900 text-sm">{sweet.name}</div>
                            <div className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                              {sweet.pureGhee && <span className="text-[#9a6f14] font-semibold">Pure Ghee</span>}
                              {sweet.isBestSeller && <span className="text-amber-600 font-semibold">• Bestseller</span>}
                              {sweet.isFestivalSpecial && <span className="text-[#6b0f1a] font-semibold">• Festive Special</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 font-semibold text-gray-700">
                        {sweet.category}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-[#6b0f1a]">
                        ₹{sweet.discountPrice || sweet.price}
                        {sweet.discountPrice > 0 && (
                          <span className="text-[10px] text-gray-400 line-through ml-1.5">
                            ₹{sweet.price}
                          </span>
                        )}
                      </td>

                      {/* Stock Level */}
                      <td className="py-3 px-4">
                        <span className={`font-bold ${isOut ? 'text-red-600' : isLow ? 'text-amber-700' : 'text-gray-900'}`}>
                          {sweet.stock} boxes
                        </span>
                      </td>

                      {/* Availability status badge */}
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isOut ? 'bg-red-50 text-red-700' : isLow ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'
                        }`}>
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRestock(sweet._id, sweet.name)}
                            title="Restock +25 boxes"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors text-[11px] font-bold flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>+25</span>
                          </button>

                          <Link
                            to={`/admin/products/edit/${sweet._id}`}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                            title="Edit Sweet"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDelete(sweet._id, sweet.name)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Delete Sweet"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminProducts;
