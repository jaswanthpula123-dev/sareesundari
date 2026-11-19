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
  'Ghee Sweets',
  'Dry Fruit Sweets',
  'Bengali Sweets',
  'Traditional Laddus',
  'Milk Sweets',
  'Festive Hampers'
];

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Dry Fruit Sweets',
    description: '',
    price: '',
    discountPrice: '',
    stock: 30,
    weightOptions: ['250g', '500g', '1kg'],
    images: ['https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80'],
    ingredients: 'Pure Cow Desi Ghee, Organic Sugar, Nuts, Saffron',
    shelfLife: '15 Days at room temperature',
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
              category: res.product.category || 'Dry Fruit Sweets',
              description: res.product.description || '',
              price: res.product.price || '',
              discountPrice: res.product.discountPrice || '',
              stock: res.product.stock || 25,
              weightOptions: res.product.weightOptions || ['250g', '500g', '1kg'],
              images: res.product.images || [],
              ingredients: res.product.ingredients || '',
              shelfLife: res.product.shelfLife || '15 Days',
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
          addToast('Could not load sweet for editing', 'error');
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
          'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
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
          addToast(`Updated sweet "${formData.name}" successfully! ✨`);
          navigate('/admin/products');
        }
      } else {
        const res = await adminAPI.createProduct(payload);
        if (res.success) {
          addToast(`Added new sweet "${formData.name}" to catalog! 🍬`);
          navigate('/admin/products');
        }
      }
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to save sweet product', 'error');
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
              {isEdit ? 'Edit Sweet Delicacy' : 'Add New Sweet to Catalog'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Enter recipe details, pricing per weight, ingredients, and stock quantity.
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
              Sweet Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Kaju Katli / Mysore Pak"
              required
              className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Sweet Category *
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
            Mouth-Watering Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe the texture, cow ghee aroma, flavor profile, and heritage..."
            required
            className="w-full px-3.5 py-2 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
          ></textarea>
        </div>

        {/* Pricing & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Base Price (250g in ₹) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 280"
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
              placeholder="e.g. 250 (optional)"
              min={0}
              className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Inventory Stock (Boxes) *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="e.g. 35"
              required
              min={0}
              className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
            />
          </div>
        </div>

        {/* Ingredients & Shelf Life */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Key Ingredients
            </label>
            <input
              type="text"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="e.g. Goan Cashews (Kaju), Cow Desi Ghee, Sugar"
              className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Shelf Life Duration
            </label>
            <input
              type="text"
              name="shelfLife"
              value={formData.shelfLife}
              onChange={handleChange}
              placeholder="e.g. 20 Days at room temperature"
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
            Paste a high-res image link of the sweet.
          </span>
        </div>

        {/* Toggles: Pure Ghee, 100% Veg, Featured, Bestseller, Festive */}
        <div className="pt-2 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-800 cursor-pointer">
            <input
              type="checkbox"
              name="pureGhee"
              checked={formData.pureGhee}
              onChange={handleChange}
              className="w-4 h-4 rounded text-[#6b0f1a]"
            />
            <span>100% Pure Desi Ghee</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-gray-800 cursor-pointer">
            <input
              type="checkbox"
              name="isVeg"
              checked={formData.isVeg}
              onChange={handleChange}
              className="w-4 h-4 rounded text-[#6b0f1a]"
            />
            <span>100% Vegetarian</span>
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
            <span>Bestseller Sweet</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-gray-800 cursor-pointer">
            <input
              type="checkbox"
              name="isFestivalSpecial"
              checked={formData.isFestivalSpecial}
              onChange={handleChange}
              className="w-4 h-4 rounded text-[#6b0f1a]"
            />
            <span>Festival Special Delicacy</span>
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
            <span>{loading ? 'Saving Sweet...' : (isEdit ? 'Save Changes' : 'Publish Sweet')}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default AdminProductForm;
