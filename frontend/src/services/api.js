import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
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

// Saree Product APIs
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getByIdOrSlug: (idOrSlug) => api.get(`/products/${idOrSlug}`),
  getFeatured: () => api.get('/products/filter/featured'),
  getBestSellers: () => api.get('/products/filter/bestsellers'),
  getFestivalSpecials: () => api.get('/products/filter/festivalspecial'),
  getNewArrivals: () => api.get('/products/filter/new-arrivals'),
  getRelated: (id) => api.get(`/products/${id}/related`),
  getReviews: (id) => api.get(`/products/${id}/reviews`),
  addReview: (id, reviewData) => api.post(`/products/${id}/reviews`, reviewData)
};

// Category APIs
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`)
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
