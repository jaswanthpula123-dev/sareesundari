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
  CheckCircle2,
  Crown
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { addToast } = useToast();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      addToast('Thank you for subscribing to Saree Sundarii! Use coupon "SUNDARI20" for 20% off your heirloom saree ✨');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#24030F] text-[#fcedd8] border-t-2 border-[#d4af37]/40 relative overflow-hidden">
      {/* Decorative Golden Accent Stripe */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>

      {/* Trust & Authenticity Hallmark Value Bar */}
      <div className="border-b border-[#d4af37]/20 bg-[#1A020B]/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          
          <div className="flex items-center gap-3.5 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/35 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">100% Pure Silk Mark</h4>
              <p className="text-xs text-[#fcedd8]/70">Government Certified Silk</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/35 flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Tested 24K Gold Zari</h4>
              <p className="text-xs text-[#fcedd8]/70">Pure Silver & Gold Brocades</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/35 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Complimentary Shipping</h4>
              <p className="text-xs text-[#fcedd8]/70">Pan-India on orders ₹1,999+</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/35 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Direct From Handlooms</h4>
              <p className="text-xs text-[#fcedd8]/70">Fair Trade Master Weavers</p>
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
              <div className="w-10 h-10 rounded-full bg-[#5B0E2D] border-2 border-[#d4af37] flex items-center justify-center shadow-md">
                <Crown className="w-5 h-5 text-[#d4af37]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Saree <span className="gold-gradient-text">Sundarii</span>
              </span>
            </Link>
            
            <p className="text-sm text-[#fcedd8]/80 leading-relaxed max-w-sm">
              Saree Sundarii is dedicated to the timeless magnificence of authentic Indian handlooms. Handcrafted with generational devotion by master weavers using pure mulberry silk, sacred Korvai borders, and pure tested 24K gold and silver zari.
            </p>

            <div className="pt-2 text-xs text-[#d4af37] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>Silk Mark Organization of India Certified</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 tracking-wide border-b border-[#d4af37]/20 pb-2">
              Explore Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-[#fcedd8]/80">
              <li>
                <Link to="/" className="hover:text-[#d4af37] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#d4af37] transition-colors">All Sarees Catalog</Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-[#d4af37] transition-colors">Curated Categories</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#d4af37] transition-colors">Our Weaving Heritage</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#d4af37] transition-colors">Styling Concierge & Contact</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-[#d4af37] transition-colors">Saved Heirloom Favorites</Link>
              </li>
            </ul>
          </div>

          {/* Handloom Vaults Column */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 tracking-wide border-b border-[#d4af37]/20 pb-2">
              Handloom Vaults
            </h4>
            <ul className="space-y-2.5 text-sm text-[#fcedd8]/80">
              <li>
                <Link to="/shop?category=Kanjivaram+Sarees" className="hover:text-[#d4af37] transition-colors">Kanjivaram Silk Sarees</Link>
              </li>
              <li>
                <Link to="/shop?category=Banarasi+Sarees" className="hover:text-[#d4af37] transition-colors">Banarasi Brocade Sarees</Link>
              </li>
              <li>
                <Link to="/shop?category=Silk+Sarees" className="hover:text-[#d4af37] transition-colors">Yeola Paithani & Mysore Silks</Link>
              </li>
              <li>
                <Link to="/shop?category=Cotton+Sarees" className="hover:text-[#d4af37] transition-colors">Handloom Kota Doria & Jamdani</Link>
              </li>
              <li>
                <Link to="/shop?category=Wedding+Sarees" className="hover:text-[#d4af37] transition-colors">Bridal Muhurtham Sarees</Link>
              </li>
              <li>
                <Link to="/shop?category=Party+Wear+Sarees" className="hover:text-[#d4af37] transition-colors">Cocktail & Designer Drapes</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours Column */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 tracking-wide border-b border-[#d4af37]/20 pb-2">
              Boutique & Concierge
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
                <span className="text-xs">concierge@sareesundarii.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span className="text-xs">Mon - Sun: 10:00 AM - 9:00 PM</span>
              </div>
            </div>

            {/* Newsletter input */}
            <div className="mt-5">
              <span className="text-xs font-semibold text-white block mb-1.5">
                Join Saree Sundarii Heritage Club
              </span>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-1.5">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email for 20% off..."
                  required
                  className="bg-black/30 border border-[#d4af37]/30 text-white text-xs px-3 py-1.5 rounded focus:outline-none focus:border-[#d4af37] flex-1"
                />
                <button
                  type="submit"
                  className="bg-[#d4af37] hover:bg-[#e5a93c] text-[#24030F] font-bold text-xs px-3 py-1.5 rounded transition-colors"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright & Payment bar */}
      <div className="border-t border-[#d4af37]/20 bg-[#1A020B] py-4 px-4 text-xs text-[#fcedd8]/60 text-center flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
        <p>© {new Date().getFullYear()} Saree Sundarii Royal Handlooms. All rights reserved.</p>
        <div className="flex items-center gap-3 mt-2 sm:mt-0 font-medium text-[#fcedd8]/80">
          <span>Payment Methods:</span>
          <span className="bg-[#5B0E2D] border border-[#d4af37]/30 px-2 py-0.5 rounded text-[10px]">Insured COD</span>
          <span className="bg-[#5B0E2D] border border-[#d4af37]/30 px-2 py-0.5 rounded text-[10px]">UPI / QR</span>
          <span className="bg-[#5B0E2D] border border-[#d4af37]/30 px-2 py-0.5 rounded text-[10px]">Net Banking</span>
          <span className="bg-[#5B0E2D] border border-[#d4af37]/30 px-2 py-0.5 rounded text-[10px]">Cards</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
