import axios from 'axios';
import {
  allSareesCatalog,
  allCategoriesCatalog,
  filterCatalogSarees,
  getCatalogSareeByIdOrSlug
} from '../data/sareesCatalog';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 3500
});

// Auto attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sundari_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for clear errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  toggleWishlist: (productId) => api.post('/auth/wishlist/toggle', { productId })
};

const shouldTryHttp = Boolean(import.meta.env.VITE_API_URL || import.meta.env.DEV);

// Saree Product APIs with Resilient Handloom Catalog Fallback
export const productAPI = {
  getAll: async (params = {}) => {
    if (shouldTryHttp) {
      try {
        const res = await api.get('/products', { params });
        if (res && res.success && Array.isArray(res.products) && res.products.length > 0) {
          return res;
        }
      } catch (err) {
        // Fallback to client catalog
      }
    }
    return filterCatalogSarees(params);
  },

  getByIdOrSlug: async (idOrSlug) => {
    if (shouldTryHttp) {
      try {
        const res = await api.get(`/products/${idOrSlug}`);
        if (res && (res.product || res.success)) {
          return res;
        }
      } catch (err) {
        // Fallback to client catalog
      }
    }
    const found = getCatalogSareeByIdOrSlug(idOrSlug);
    if (found) {
      return { success: true, product: found };
    }
    return { success: false, message: 'Saree not found in royal vault' };
  },

  getFeatured: async () => {
    if (shouldTryHttp) {
      try {
        const res = await api.get('/products/filter/featured');
        if (res && res.products && res.products.length > 0) return res;
      } catch (e) {}
    }
    return filterCatalogSarees({ isFeatured: true, limit: 8 });
  },

  getBestSellers: async () => {
    if (shouldTryHttp) {
      try {
        const res = await api.get('/products/filter/bestsellers');
        if (res && res.products && res.products.length > 0) return res;
      } catch (e) {}
    }
    return filterCatalogSarees({ isBestSeller: true, limit: 8 });
  },

  getFestivalSpecials: async () => {
    if (shouldTryHttp) {
      try {
        const res = await api.get('/products/filter/festivalspecial');
        if (res && res.products && res.products.length > 0) return res;
      } catch (e) {}
    }
    return filterCatalogSarees({ isFestivalSpecial: true, limit: 8 });
  },

  getNewArrivals: async () => {
    if (shouldTryHttp) {
      try {
        const res = await api.get('/products/filter/new-arrivals');
        if (res && res.products && res.products.length > 0) return res;
      } catch (e) {}
    }
    return filterCatalogSarees({ sort: 'newest', limit: 8 });
  },

  getRelated: async (id) => {
    try {
      const res = await api.get(`/products/${id}/related`);
      if (res && res.products && res.products.length > 0) return res;
    } catch (e) {}
    const p = getCatalogSareeByIdOrSlug(id);
    const related = allSareesCatalog
      .filter(item => item._id !== id && (!p || item.category === p.category))
      .slice(0, 4);
    return { success: true, products: related.length > 0 ? related : allSareesCatalog.slice(0, 4) };
  },

  getReviews: async (id) => {
    try {
      return await api.get(`/products/${id}/reviews`);
    } catch (e) {
      return { success: true, reviews: [] };
    }
  },

  addReview: (id, reviewData) => api.post(`/products/${id}/reviews`, reviewData)
};

// Category APIs with Resilient Fallback
export const categoryAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/categories');
      if (res && res.categories && res.categories.length > 0) return res;
    } catch (e) {}
    return { success: true, count: allCategoriesCatalog.length, categories: allCategoriesCatalog };
  },
  getBySlug: async (slug) => {
    try {
      const res = await api.get(`/categories/${slug}`);
      if (res && res.category) return res;
    } catch (e) {}
    const cat = allCategoriesCatalog.find(c => c.slug === slug || c.name.toLowerCase() === String(slug).toLowerCase());
    return { success: true, category: cat || allCategoriesCatalog[0] };
  }
};

// Cart APIs with Weight support
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity = 1, weight = '500g') => api.post('/cart', { productId, quantity, weight }),
  updateQuantity: (productId, quantity, weight, currentWeight) => api.put(`/cart/${productId}`, { quantity, weight, currentWeight }),
  removeItem: (productId, weight) => api.delete(`/cart/${productId}`, { params: { weight } }),
  clearCart: () => api.delete('/cart')
};

// Order APIs
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/myorders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  payOrder: (id, paymentResult) => api.put(`/orders/${id}/pay`, { paymentResult })
};

// Admin APIs
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getProducts: () => api.get('/admin/products'),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  updateStock: (id, stock) => api.put(`/admin/products/${id}/stock`, { stock }),
  restockProduct: (id, amount = 25) => api.put(`/admin/products/${id}/stock`, { amount }),
  getOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, statusData) => api.put(`/admin/orders/${id}/status`, statusData),
  getCustomers: () => api.get('/admin/customers'),
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export default api;
