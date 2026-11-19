import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const SareeCare = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#A27B1E] font-serif">
          Preservation & Elegance
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#5B0E2D]">
          The Saree Draping & Care Guide
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
          Pure mulberry silk, Banarasi gold brocades, and Kanjivaram zari weaves are heirlooms meant to be cherished across generations. Follow our master weavers' sacred guidelines to preserve their luster and strength.
        </p>
      </div>

      {/* 4 Pillars of Silk Saree Care */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#5B0E2D]/10 text-[#5B0E2D] flex items-center justify-center font-bold text-sm">
            01
          </div>
          <h3 className="font-serif font-bold text-base text-gray-900">Wrap in Muslin Cloth</h3>
          <p className="text-xs text-gray-600 leading-relaxed font-light">
            Never store pure silk in plastic covers—plastic traps humidity and degrades zari. Always wrap your sarees in pure unbleached cotton or muslin fabric.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#5B0E2D]/10 text-[#5B0E2D] flex items-center justify-center font-bold text-sm">
            02
          </div>
          <h3 className="font-serif font-bold text-base text-gray-900">Periodic Refolding</h3>
          <p className="text-xs text-gray-600 leading-relaxed font-light">
            Take your silk sarees out of the wardrobe once every 3 to 4 months. Air them in shade for 20 minutes and change the fold lines to prevent crease tears.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#5B0E2D]/10 text-[#5B0E2D] flex items-center justify-center font-bold text-sm">
            03
          </div>
          <h3 className="font-serif font-bold text-base text-gray-900">Specialist Dry Clean Only</h3>
          <p className="text-xs text-gray-600 leading-relaxed font-light">
            Never machine wash or soak heavy Banarasi or Kanjivaram sarees in detergents. Always entrust them to reputed dry cleaners specializing in heritage silk.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#5B0E2D]/10 text-[#5B0E2D] flex items-center justify-center font-bold text-sm">
            04
          </div>
          <h3 className="font-serif font-bold text-base text-gray-900">Iron on Reverse Low Heat</h3>
          <p className="text-xs text-gray-600 leading-relaxed font-light">
            Never place a hot iron directly onto gold zari threads. Turn the saree to its reverse side, place a thin cotton cloth on top, and iron with medium heat.
          </p>
        </div>

      </div>

      {/* Draping Styles Guide */}
      <div className="bg-[#F8F3EA] rounded-3xl p-8 sm:p-12 border border-[#D4AF37]/30 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A27B1E] font-serif">
            Iconic Indian Drapes
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#5B0E2D]">
            Classic Saree Draping Traditions
          </h2>
          <p className="text-xs text-gray-600">
            Learn the graceful steps behind the most iconic silhouettes of Indian royal courts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-3">
            <h4 className="font-serif font-bold text-base text-[#5B0E2D]">The Classic Nivi Drape</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Originated from the royal courts of Andhra Pradesh and formalized in modern India. Pleats are tucked at the navel with the pallu gracefully draped over the left shoulder.
            </p>
            <span className="text-[10px] text-gray-400 font-semibold block">Best for: Kanjivaram, Chanderi, Georgette</span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-3">
            <h4 className="font-serif font-bold text-base text-[#5B0E2D]">The Royal Bengali Drape</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Featuring broad front pleats and a pallu wrapped under the right arm and tossed over the right shoulder with an ornamental bunch of keys.
            </p>
            <span className="text-[10px] text-gray-400 font-semibold block">Best for: Banarasi Katan, Jamdani, Mulmul</span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-3">
            <h4 className="font-serif font-bold text-base text-[#5B0E2D]">The Seedha Pallu (Gujarati)</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              The pallu is brought from the back over the right shoulder to fan out across the chest, creating an expansive canvas that showcases intricate pallu zari work.
            </p>
            <span className="text-[10px] text-gray-400 font-semibold block">Best for: Wedding Brocades, Gota Patti</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#5B0E2D] text-white rounded-full font-bold text-xs shadow-lg hover:bg-[#7A133A] transition-colors"
        >
          <span>Explore Saree Treasury</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};

export default SareeCare;
