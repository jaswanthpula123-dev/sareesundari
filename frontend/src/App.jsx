import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Context Providers
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';

// Scroll to top on route change or category vault query change helper
const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
};

// Main App Layout Wrapper
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden bg-[#fdfbf7] text-[#2b1f1d] relative">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton />}
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Router>
              <ScrollToTop />
              <AppLayout>
                <Routes>
                  {/* Public Storefront Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/products/:slugOrId" element={<ProductDetail />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success/:id" element={<OrderSuccess />} />
                  <Route path="/orders/:id" element={<OrderDetails />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* Admin Portal Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="products/new" element={<AdminProductForm />} />
                    <Route path="products/edit/:id" element={<AdminProductForm />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="customers" element={<AdminCustomers />} />
                  </Route>

                  {/* 404 Fallback to Home */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </AppLayout>
            </Router>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
