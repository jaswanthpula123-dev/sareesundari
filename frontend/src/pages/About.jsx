import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Award,
  ShieldCheck,
  Flame,
  Truck,
  Heart,
  Crown,
  Users,
  CheckCircle2
} from 'lucide-react';

const About = () => {
  return (
    <div className="bg-[#fdfbf7] min-h-screen py-12 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#fcedd8] text-[#5B0E2D] text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Preserving Indian Weaving Heritage</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-[#5B0E2D] leading-tight">
            The Legacy of <span className="gold-gradient-text">Saree Sundarii</span>
          </h1>

          <p className="text-base text-gray-700 leading-relaxed">
            Reviving the sacred artistry of India's finest handloom clusters. Woven with pure 3-ply mulberry silk, certified Silk Mark tags, and tested 24K gold zari directly from fifth-generation weaver families.
          </p>
        </div>

        {/* Story Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-5 text-sm text-gray-700 leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#5B0E2D]">
              Honoring India's Master Weavers
            </h2>
            <p>
              Saree Sundarii was founded to honor the sacred rhythms of the pit loom. While modern power looms and cheap synthetic polyester imitations entered the market, we made an unbreakable covenant with authenticity: only pure natural silks, real tested gold and silver zari, and authentic handloom weaves.
            </p>
            <p>
              From the Korvai spires of Kanchipuram to the Kadwa jaals of Varanasi, every drape in our vault takes between 30 to 120 days of devotion to weave. When you wear Saree Sundarii, you wear living history, family blessing, and eternal Indian grace.
            </p>
            <div className="p-4 rounded-2xl bg-[#fffaf3] border-l-4 border-[#5B0E2D] italic text-xs text-[#5B0E2D]">
              "A handloom saree is not merely six yards of silk; it is the heartbeat of our civilization, passed from mothers to daughters across centuries."
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#d4af37]/40 bg-[#fcedd8]">
              <img
                src="/sarees/kanjivaram-1.jpg"
                alt="Saree Sundarii Handloom Weaving"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[#5B0E2D] text-white p-5 rounded-2xl shadow-xl hidden sm:block border border-[#d4af37]">
              <div className="font-serif text-3xl font-extrabold text-[#d4af37]">100%</div>
              <div className="text-xs font-semibold">Pure Silk Mark Certified</div>
            </div>
          </div>

        </div>

        {/* Four Pillars of Saree Sundarii */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#d4af37]/30 shadow-md">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#9a6f14] uppercase tracking-wider">Our Uncompromising Standards</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#5B0E2D] mt-1">Pillars of Handloom Authenticity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-[#fdfbf7] border border-[#d4af37]/20 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#fcedd8] flex items-center justify-center text-[#5B0E2D] mx-auto">
                <Award className="w-6 h-6 text-[#9a6f14]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#5B0E2D]">100% Silk Mark Tag</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Every saree comes with an official Silk Mark Organization of India tag guaranteeing pure natural silk.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fdfbf7] border border-[#d4af37]/20 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#fcedd8] flex items-center justify-center text-[#5B0E2D] mx-auto">
                <Crown className="w-6 h-6 text-[#9a6f14]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#5B0E2D]">Tested 24K Gold Zari</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Pure silver thread electroplated in 24K gold. Zero tarnish, enduring luster that stays vibrant for generations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fdfbf7] border border-[#d4af37]/20 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#fcedd8] flex items-center justify-center text-[#5B0E2D] mx-auto">
                <ShieldCheck className="w-6 h-6 text-[#9a6f14]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#5B0E2D]">Direct From Loom</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Direct partnership with master weaver clusters in Kanchipuram, Varanasi, Paithan, and Sambalpur with fair compensation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fdfbf7] border border-[#d4af37]/20 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#fcedd8] flex items-center justify-center text-[#5B0E2D] mx-auto">
                <Truck className="w-6 h-6 text-[#9a6f14]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#5B0E2D]">Insured Delivery</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tamper-proof heritage packaging and fully insured courier delivery to your doorstep across India and worldwide.
              </p>
            </div>

          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-6">
          <Link
            to="/shop"
            className="px-8 py-3.5 bg-[#5B0E2D] hover:bg-[#38050c] text-white font-bold text-xs rounded-full shadow-lg transition-all inline-block"
          >
            Explore the Handloom Vault
          </Link>
        </div>

      </div>
    </div>
  );
};

export default About;
