import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { authAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Request Code, 2: Reset Password
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedCodeHint, setGeneratedCodeHint] = useState('');
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(email);
      if (res.success) {
        addToast(res.message);
        if (res.resetCode) setGeneratedCodeHint(res.resetCode);
        setStep(2);
      }
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.resetPassword({
        email,
        resetCode,
        newPassword
      });
      if (res.success) {
        addToast('Password reset successfully! You can now sign in.');
        navigate('/login');
      }
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-6">
      
      <div className="text-center space-y-2">
        <Link to="/" className="inline-block">
          <span className="text-3xl font-bold font-cinzel text-[#5B0E2D]">
            Saree Sundari
          </span>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#A27B1E] font-serif">
            Royal Indian Weaves
          </p>
        </Link>
        <h1 className="text-2xl font-bold font-serif text-gray-900 pt-2">
          {step === 1 ? 'Recover Password' : 'Enter Verification Code'}
        </h1>
        <p className="text-xs text-gray-500">
          {step === 1
            ? 'Enter your registered email address to receive a secure recovery code.'
            : 'Enter the 6-digit recovery code and choose a new password.'}
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-[#D4AF37]/40 shadow-xl space-y-5">
        {step === 1 ? (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Your Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. priyanka@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:border-[#5B0E2D] outline-none"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#5B0E2D] text-white font-bold text-sm rounded-xl shadow-lg hover:bg-[#7A133A] transition-colors flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Sending Code...' : 'Request Recovery Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {generatedCodeHint && (
              <div className="p-3 bg-[#FFEAF0] rounded-xl border border-[#D43F6C]/30 text-xs text-[#5B0E2D]">
                Demo Verification Code: <strong className="font-mono text-sm tracking-widest">{generatedCodeHint}</strong>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                6-Digit Recovery Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="e.g. 123456"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:border-[#5B0E2D] outline-none font-mono"
                />
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                New Password (Min 6 Characters)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new secure password"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:border-[#5B0E2D] outline-none"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#5B0E2D] text-white font-bold text-sm rounded-xl shadow-lg hover:bg-[#7A133A] transition-colors flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Updating Password...' : 'Reset Password & Sign In'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center pt-2 text-xs text-gray-500">
          Remember your password?{' '}
          <Link to="/login" className="font-bold text-[#5B0E2D] hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>

    </div>
  );
};

export default ForgotPassword;
