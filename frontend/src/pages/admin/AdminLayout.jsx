import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Layers,
  ShoppingBag,
  Package,
  Users,
  PlusCircle,
  ArrowLeft,
  ShieldAlert,
  LogOut,
  Crown,
  ChefHat
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
        <h1 className="text-2xl font-bold font-serif text-[#4d0a13]">
          Saree Sundarii Admin Portal
        </h1>
        <p className="text-sm text-gray-500">
          This portal is reserved for Saree Sundarii boutique managers and inventory administrators.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link
            to="/login"
            className="px-5 py-2.5 bg-[#6b0f1a] text-white rounded-xl text-xs font-bold shadow"
          >
            Sign in as Admin
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold"
          >
            Store Homepage
          </Link>
        </div>
      </div>
    );
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#f7f1e5]/40 flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-[#4d0a13] text-[#fcedd8] border-b border-[#d4af37]/30 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#6b0f1a] border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
              <Crown className="w-4 h-4" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-white">
              Saree <span className="gold-gradient-text">Sundarii</span>
            </span>
            <span className="text-[10px] bg-[#d4af37] text-[#4d0a13] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
              Boutique Admin Hub
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#fcedd8]/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer View</span>
          </Link>

          <div className="h-5 w-px bg-white/20 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#d4af37] text-[#4d0a13] font-bold text-xs flex items-center justify-center">
              A
            </div>
            <span className="text-xs font-bold text-white hidden md:inline">
              Saree Sundarii Admin
            </span>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="text-xs text-red-300 hover:text-white transition-colors p-1"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Admin Subnav */}
      <div className="bg-white border-b border-[#d4af37]/20 px-6 py-2.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto">
          <nav className="flex items-center gap-2 sm:gap-4 text-xs font-bold">
            <Link
              to="/admin"
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                isActive('/admin')
                  ? 'bg-[#6b0f1a] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#6b0f1a] hover:bg-[#f7f1e5]'
              }`}
            >
              Dashboard Overview
            </Link>

            <Link
              to="/admin/products"
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                isActive('/admin/products')
                  ? 'bg-[#6b0f1a] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#6b0f1a] hover:bg-[#f7f1e5]'
              }`}
            >
              Manage Sarees Catalog
            </Link>

            <Link
              to="/admin/orders"
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                isActive('/admin/orders')
                  ? 'bg-[#6b0f1a] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#6b0f1a] hover:bg-[#f7f1e5]'
              }`}
            >
              Manage Saree Orders
            </Link>

            <Link
              to="/admin/customers"
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                isActive('/admin/customers')
                  ? 'bg-[#6b0f1a] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#6b0f1a] hover:bg-[#f7f1e5]'
              }`}
            >
              Customer Database
            </Link>
          </nav>

          <Link
            to="/admin/products/new"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#e5a93c] text-[#4d0a13] font-extrabold text-xs shadow transition-all whitespace-nowrap ml-4"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add New Saree</span>
          </Link>
        </div>
      </div>

      {/* Main Admin Outlet Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
