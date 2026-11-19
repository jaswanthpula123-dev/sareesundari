import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, ShieldCheck, Crown, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res?.success) {
      navigate(from, { replace: true });
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    login(demoEmail, demoPassword).then((res) => {
      if (res?.success) {
        if (demoEmail.includes('admin')) {
          navigate('/admin');
        } else {
          navigate(from, { replace: true });
        }
      }
    });
  };

  return (
    <div className="bg-[#fdfbf7] min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#d4af37]/35 shadow-xl space-y-6">
        
        {/* Brand Motif Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#5B0E2D] text-white flex items-center justify-center mx-auto shadow-md border-2 border-[#d4af37]">
            <span className="text-2xl">👑</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#5B0E2D]">
            Welcome Back to <span className="gold-gradient-text">Saree Sundarii</span>
          </h1>
          <p className="text-xs text-gray-500">
            Sign in to track orders, manage favorites, and checkout faster
          </p>
        </div>

        {/* Demo One-Click Login Badges */}
        <div className="bg-[#fffaf3] p-4 rounded-2xl border border-[#d4af37]/30 space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a6f14] block text-center">
            ⚡ Instant 1-Click Demo Login
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer@sareesundarii.com', 'customer123')}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-[#f7f1e5] border border-[#d4af37]/40 text-xs font-bold text-[#6b0f1a] flex items-center justify-center gap-1.5 shadow-2xs transition-all"
            >
              <User className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Customer Demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@sareesundarii.com', 'admin123')}
              className="py-2 px-2.5 rounded-xl bg-[#6b0f1a] hover:bg-[#4d0a13] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all"
            >
              <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Standard Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-gray-700">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#6b0f1a] hover:bg-[#4d0a13] text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4 text-[#d4af37]" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Switch to Register */}
        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="font-bold text-[#6b0f1a] hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
