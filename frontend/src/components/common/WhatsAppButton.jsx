import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, Crown, Video } from 'lucide-react';

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const conciergeNumber = '919346638123'; // Saree Sundarii flagship concierge (+91 93466 38123)

  const handleSendWhatsApp = (text) => {
    const message = text || customMessage || 'Namaste! I am browsing Saree Sundarii luxury handlooms and would love personal styling advice and video draping assistance.';
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${conciergeNumber}?text=${encoded}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setCustomMessage('');
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 font-sans flex flex-col items-end">
      
      {/* Expandable Chat Box Popup */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-32px)] sm:w-88 max-w-sm bg-white rounded-3xl shadow-2xl border-2 border-[#25D366]/40 overflow-hidden animate-fadeIn backdrop-blur-md origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-serif text-lg font-bold border border-white/30">
                  <Crown className="w-5 h-5 text-[#d4af37]" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Saree Sundarii Stylist Concierge</h4>
                <p className="text-[11px] text-green-100 flex items-center gap-1">
                  <span>Online</span> • <span>Instant replies</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-white/80 hover:text-white rounded-full transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#fdfbf7] space-y-3 text-xs">
            {/* Welcome Bubble */}
            <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs border border-gray-100 text-gray-800 space-y-1">
              <p className="font-medium text-[#5B0E2D]">
                🙏 <strong>Namaste!</strong> Welcome to Saree Sundarii.
              </p>
              <p className="text-gray-600 leading-relaxed font-light">
                How may our saree drape & bridal stylists assist your celebration today?
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#9a6f14]">Quick Concierge Requests:</p>
              
              <button
                onClick={() => handleSendWhatsApp('Namaste! I would like to schedule a live video call to inspect saree borders and drape flow.')}
                className="w-full text-left px-3 py-2 bg-white hover:bg-[#fcedd8] hover:text-[#5B0E2D] rounded-xl border border-gray-200 transition-colors text-[11px] font-medium flex items-center gap-2 cursor-pointer"
              >
                <Video className="w-3.5 h-3.5 text-[#5B0E2D] shrink-0" />
                <span>Book Live Video Draping</span>
              </button>

              <button
                onClick={() => handleSendWhatsApp('Namaste! I need bridal saree styling advice for upcoming wedding ceremonies.')}
                className="w-full text-left px-3 py-2 bg-white hover:bg-[#fcedd8] hover:text-[#5B0E2D] rounded-xl border border-gray-200 transition-colors text-[11px] font-medium flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <span>Bridal Muhurtham Consultation</span>
              </button>

              <button
                onClick={() => handleSendWhatsApp('Namaste! What is the delivery timeline to my pincode?')}
                className="w-full text-left px-3 py-2 bg-white hover:bg-[#fcedd8] hover:text-[#5B0E2D] rounded-xl border border-gray-200 transition-colors text-[11px] font-medium flex items-center gap-2 cursor-pointer"
              >
                <span>🚚 Check Delivery Timeline</span>
              </button>
            </div>

            {/* Custom Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendWhatsApp(customMessage);
              }}
              className="pt-2 flex gap-2"
            >
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 min-w-0 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs outline-none focus:border-[#25D366]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl shadow transition-colors shrink-0 cursor-pointer"
                title="Send via WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="px-4 py-2 bg-[#f7f1e5] border-t border-gray-100 text-[10px] text-gray-500 text-center">
            🔒 Opens official WhatsApp chat with Saree Sundarii Concierge
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 bg-[#25D366] hover:bg-[#20BA5C] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
      >
        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-200 border-2 border-[#25D366]"></span>
        </span>

        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.155.571 4.184 1.572 5.945l-1.668 6.096 6.275-1.646c1.704.93 3.655 1.458 5.727 1.458 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
        </svg>

        <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-lg border border-white/10 hidden sm:flex items-center gap-1.5">
          <span>WhatsApp Saree Concierge</span>
        </span>
      </button>

    </div>
  );
};

export default WhatsAppButton;