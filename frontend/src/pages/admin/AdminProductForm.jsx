import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Sparkles,
  ShoppingBag,
  Award,
  Image as ImageIcon
} from 'lucide-react';
import { adminAPI, productAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const categoriesList = [
  'Kanjivaram Sarees',
  'Banarasi Sarees',
  'Silk Sarees',
  'Cotton Sarees',
  'Wedding Sarees',
  'Party Wear Sarees',
  'Designer Sarees',
  'Georgette & Chiffon'
];

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Kanjivaram Sarees',
    description: '',
    price: '',
    discountPrice: '',
    stock: 25,
    weightOptions: ['Standard Drape (6.3m)', 'With Unstitched Blouse', 'Custom Stitched Blouse'],
    images: ['/sarees/kanjivaram-1.jpg'],
    ingredients: '100% Pure Mulberry Silk, Tested 24K Gold & Silver Zari',
    shelfLife: 'Dry Clean Only. Wrapped in mulmul cotton cloth.',
    isVeg: true,
    pureGhee: true,
    isFeatured: false,
    isBestSeller: false,
    isFestivalSpecial: false
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      productAPI.getByIdOrSlug(id)
        .then((res) => {
          if (res.success && res.product) {
            setFormData({
              name: res.product.name || '',
              category: res.product.category || 'Kanjivaram Sarees',
              description: res.product.description || '',
              price: res.product.price || '',
              discountPrice: res.product.discountPrice || '',
              stock: res.product.stock || 25,
              weightOptions: res.product.weightOptions || ['Standard Drape (6.3m)', 'With Unstitched Blouse', 'Custom Stitched Blouse'],
              images: res.product.images || [],
              ingredients: res.product.ingredients || '',
              shelfLife: res.product.shelfLife || 'Dry Clean Only',
              isVeg: res.product.isVeg !== false,
              pureGhee: res.product.pureGhee !== false,
              isFeatured: Boolean(res.product.isFeatured),
              isBestSeller: Boolean(res.product.isBestSeller),
              isFestivalSpecial: Boolean(res.product.isFestivalSpecial)
            });
            setImageUrlInput(res.product.images?.[0] || '');
          }
        })
        .catch((err) => {
          console.error(err);
          addToast('Could not load saree for editing', 'error');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category || !formData.description) {
      addToast('Please fill in all mandatory fields', 'error');
      return;
    }

    try {
      setLoading(true);

      const finalImages = imageUrlInput.trim()
        ? [imageUrlInput.trim()]
        : formData.images.length > 0 ? formData.images : [
          '/sarees/kanjivaram-1.jpg'
        ];

      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: Number(formData.discountPrice) || 0,
        stock: Number(formData.stock) || 0,
        images: finalImages
      };

      if (isEdit) {
        const res = await adminAPI.updateProduct(id, payload);
        if (res.success) {
          addToast(`Updated saree "${formData.name}" successfully! ✨`);
          navigate('/admin/products');
        }
      } else {
        const res = await adminAPI.createProduct(payload);
        if (res.success) {
          addToast(`Added new saree "${formData.name}" to catalog! ✨`);
          navigate('/admin/products');
        }
      }
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to save saree drape', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/20">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-[#6b0f1a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-extrabold text-[#4d0a13]">
              {isEdit ? 'Edit Saree Details' : 'Add New Saree to Catalog'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Enter drape weave details, pricing, fabric composition, and stock quantity.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-md space-y-6">
        
        {/* Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Saree Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Royal Maroon Kanjivaram Bridal Silk Saree"
              required
              className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Weave Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">
            Royal Drape Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe the silk weave, zari motif, pallu pattern, and heritage..."
            required
            className="w-full px-3.5 py-2 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
          ></textarea>
        </div>

        {/* Pricing & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Base Price (in ₹) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 18500"
              required
              min={1}
              className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Discounted Price (₹)
            </label>
            <input
              type="number"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
              placeholder="e.g. 15999 (optional)"
              min={0}
              className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Inventory Stock (Pieces / Drapes) *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="e.g. 25"
              required
              min={0}
              className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
            />
          </div>
        </div>

        {/* Fabric & Care */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Fabric & Zari Composition
            </label>
            <input
              type="text"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="e.g. Pure Mulberry Silk, Tested 24K Gold Zari"
              className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Care & Maintenance
            </label>
            <input
              type="text"
              name="shelfLife"
              value={formData.shelfLife}
              onChange={handleChange}
              placeholder="e.g. Dry Clean Only. Mulmul wrap preservation"
              className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
            />
          </div>
        </div>

        {/* Image URL Input */}
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">
            Product Image URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="flex-1 px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
            />
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            Paste a high-res image link of the saree.
          </span>
        </div>

        {/* Toggles: Silk Mark, 24K Zari, Featured, Bestseller, Festive */}
        <div className="pt-2 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-800 cursor-pointer">
            <input
              type="checkbox"
              name="pureGhee"
              checked={formData.pureGhee}
              onChange={handleChange}
              className="w-4 h-4 rounded text-[#6b0f1a]"
            />
            <span>Silk Mark Certified</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-gray-800 cursor-pointer">
            <input
              type="checkbox"
              name="isVeg"
              checked={formData.isVeg}
              onChange={handleChange}
              className="w-4 h-4 rounded text-[#6b0f1a]"
            />
            <span>Tested 24K Gold Zari</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-gray-800 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 rounded text-[#6b0f1a]"
            />
            <span>Featured on Homepage</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-gray-800 cursor-pointer">
            <input
              type="checkbox"
              name="isBestSeller"
              checked={formData.isBestSeller}
              onChange={handleChange}
              className="w-4 h-4 rounded text-[#6b0f1a]"
            />
            <span>Bestseller Saree</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-gray-800 cursor-pointer">
            <input
              type="checkbox"
              name="isFestivalSpecial"
              checked={formData.isFestivalSpecial}
              onChange={handleChange}
              className="w-4 h-4 rounded text-[#6b0f1a]"
            />
            <span>Bridal & Festive Special</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-6 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-[#6b0f1a] hover:bg-[#4d0a13] text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#d4af37]" />
            <span>{loading ? 'Saving Saree...' : (isEdit ? 'Save Changes' : 'Publish Saree')}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default AdminProductForm;
