import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Sparkles, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      addToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);
    const res = await register(name, email, password, phone);
    setLoading(false);
    if (res?.success) {
      navigate('/');
    }
  };

  return (
    <div className="bg-[#fdfbf7] min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#d4af37]/35 shadow-xl space-y-6">
        
        {/* Motif Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#6b0f1a] text-white flex items-center justify-center mx-auto shadow-md border-2 border-[#d4af37]">
            <span className="text-2xl">👑</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#5B0E2D]">
            Join <span className="gold-gradient-text">Saree Sundarii</span>
          </h1>
          <p className="text-xs text-gray-500">
            Create an account to explore royal handloom drapes and enjoy exclusive member privileges
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                required
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@example.com"
                required
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9346638123"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Password (min. 6 characters) *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#6b0f1a] hover:bg-[#4d0a13] text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-[#d4af37]" />
            <span>{loading ? 'Creating Account...' : 'Create Saree Sundarii Account'}</span>
          </button>
        </form>

        {/* Switch to Login */}
        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>Already registered with us? </span>
          <Link to="/login" className="font-bold text-[#6b0f1a] hover:underline">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
