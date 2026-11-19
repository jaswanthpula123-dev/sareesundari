import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  Award,
  Mail,
  Phone,
  MapPin,
  Clock,
  Heart,
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { addToast } = useToast();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      addToast('Thank you for subscribing! Use coupon "SWEET10" for 10% off your next sweet box 🎉');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#4d0a13] text-[#fcedd8] border-t-2 border-[#d4af37]/40 relative overflow-hidden">
      {/* Decorative Golden Accent Stripe */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>

      {/* Trust & Purity Hallmark Value Bar */}
      <div className="border-b border-[#d4af37]/20 bg-[#38050c]/70 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          
          <div className="flex items-center gap-3.5 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">100% Pure Desi Ghee</h4>
              <p className="text-xs text-[#fcedd8]/70">Traditional Cow Ghee & Bilona</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Made Fresh Daily</h4>
              <p className="text-xs text-[#fcedd8]/70">Zero Artificial Preservatives</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Express Delivery</h4>
              <p className="text-xs text-[#fcedd8]/70">Free Shipping on orders ₹499+</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Hygienic Packaging</h4>
              <p className="text-xs text-[#fcedd8]/70">Sealed airtight gift boxes</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Story Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6b0f1a] border-2 border-[#d4af37] flex items-center justify-center shadow-md">
                <span className="text-xl">🍬</span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Sweet <span className="gold-gradient-text">Magic</span>
              </span>
            </Link>
            
            <p className="text-sm text-[#fcedd8]/80 leading-relaxed max-w-sm">
              Sweet Magic has been handcrafted with love since 1985. We honor centuries-old Indian confectionery traditions, preparing fresh mithai with farm-pure cow ghee, organic cane sugar, and top-grade dry fruits.
            </p>

            <div className="pt-2 text-xs text-[#d4af37] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>FSSAI Certified Food Quality Standards</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 tracking-wide border-b border-[#d4af37]/20 pb-2">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#fcedd8]/80">
              <li>
                <Link to="/" className="hover:text-[#d4af37] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#d4af37] transition-colors">All Sweets Catalog</Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-[#d4af37] transition-colors">Categories</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#d4af37] transition-colors">Our Heritage</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#d4af37] transition-colors">Contact & Bulk Orders</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-[#d4af37] transition-colors">Saved Favorites</Link>
              </li>
            </ul>
          </div>

          {/* Sweet Delicacies Column */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 tracking-wide border-b border-[#d4af37]/20 pb-2">
              Popular Sweets
            </h4>
            <ul className="space-y-2.5 text-sm text-[#fcedd8]/80">
              <li>
                <Link to="/shop?category=Dry+Fruit+Sweets" className="hover:text-[#d4af37] transition-colors">Kaju Katli</Link>
              </li>
              <li>
                <Link to="/shop?category=Bengali+Sweets" className="hover:text-[#d4af37] transition-colors">Gulab Jamun & Rasmalai</Link>
              </li>
              <li>
                <Link to="/shop?category=Traditional+Laddus" className="hover:text-[#d4af37] transition-colors">Motichoor & Boondi Laddu</Link>
              </li>
              <li>
                <Link to="/shop?category=Ghee+Sweets" className="hover:text-[#d4af37] transition-colors">Mysore Pak & Badusha</Link>
              </li>
              <li>
                <Link to="/shop?category=Milk+Sweets" className="hover:text-[#d4af37] transition-colors">Mathura Peda & Milk Cake</Link>
              </li>
              <li>
                <Link to="/shop?category=Festive+Hampers" className="hover:text-[#d4af37] transition-colors">Diwali Gift Hampers</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours Column */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 tracking-wide border-b border-[#d4af37]/20 pb-2">
              Store & Support
            </h4>
            <div className="space-y-3 text-sm text-[#fcedd8]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4af37] mt-1 shrink-0" />
                <span className="text-xs">Road No. 10, Banjara Hills, Hyderabad, Telangana 500034</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span className="text-xs">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span className="text-xs">support@sweetmagic.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span className="text-xs">Mon - Sun: 8:00 AM - 10:30 PM</span>
              </div>
            </div>

            {/* Newsletter input */}
            <div className="mt-5">
              <span className="text-xs font-semibold text-white block mb-1.5">
                Get Festive Sweet Offers
              </span>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-1.5">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email..."
                  required
                  className="bg-black/30 border border-[#d4af37]/30 text-white text-xs px-3 py-1.5 rounded focus:outline-none focus:border-[#d4af37] flex-1"
                />
                <button
                  type="submit"
                  className="bg-[#d4af37] hover:bg-[#e5a93c] text-[#4d0a13] font-bold text-xs px-3 py-1.5 rounded transition-colors"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright & Payment bar */}
      <div className="border-t border-[#d4af37]/20 bg-[#38050c] py-4 px-4 text-xs text-[#fcedd8]/60 text-center flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
        <p>© {new Date().getFullYear()} Sweet Magic Online Sweets Shop. All rights reserved.</p>
        <div className="flex items-center gap-3 mt-2 sm:mt-0 font-medium text-[#fcedd8]/80">
          <span>Payment Methods:</span>
          <span className="bg-[#4d0a13] border border-[#d4af37]/30 px-2 py-0.5 rounded text-[10px]">Cash on Delivery</span>
          <span className="bg-[#4d0a13] border border-[#d4af37]/30 px-2 py-0.5 rounded text-[10px]">UPI / QR</span>
          <span className="bg-[#4d0a13] border border-[#d4af37]/30 px-2 py-0.5 rounded text-[10px]">Cards</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
