import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Gift,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Corporate & Festive Bulk Order',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('Your inquiry has been received! Our Saree Concierge will contact you within 2 hours ✨');
    setFormData({
      name: '',
      email: '',
      phone: '',
      inquiryType: 'Bridal Trousseau & Wedding Orders',
      message: ''
    });
  };

  return (
    <div className="bg-[#fdfbf7] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#9a6f14] uppercase tracking-wider">
            We’d Love to Hear From You
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#5B0E2D]">
            Contact Saree Sundarii
          </h1>
          <p className="text-sm text-gray-600">
            For personal styling consultations, bespoke bridal trousseau curation, or video draping concierge.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Store Info Cards (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Flagship Store Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#d4af37]/30 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#4d0a13] flex items-center gap-2 pb-2 border-b border-gray-100">
                <Building2 className="w-5 h-5 text-[#d4af37]" />
                Hyderabad Flagship Boutique
              </h3>
              
              <div className="space-y-3 text-xs text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#6b0f1a] mt-0.5 shrink-0" />
                  <span>Plot 42, Road No. 10, Banjara Hills, Hyderabad, Telangana 500034</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#6b0f1a] shrink-0" />
                  <span className="font-bold">+91 98765 43210 / +91 98765 00001</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#6b0f1a] shrink-0" />
                  <span>concierge@sareesundarii.com / bridal@sareesundarii.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#6b0f1a] shrink-0" />
                  <span>Monday - Sunday: 8:00 AM - 10:30 PM (All 365 Days)</span>
                </div>
              </div>
            </div>

            {/* Delhi NCR Experience Store Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#d4af37]/30 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#4d0a13] flex items-center gap-2 pb-2 border-b border-gray-100">
                <Building2 className="w-5 h-5 text-[#d4af37]" />
                New Delhi NCR Store
              </h3>
              
              <div className="space-y-3 text-xs text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#6b0f1a] mt-0.5 shrink-0" />
                  <span>Block M, Outer Circle, Connaught Place, New Delhi 110001</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#6b0f1a] shrink-0" />
                  <span>+91 91234 56789</span>
                </div>
              </div>
            </div>

            {/* Corporate & Wedding Gifting Box */}
            <div className="bg-[#fffaf3] rounded-3xl p-6 border border-[#d4af37]/50 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#6b0f1a] text-[#d4af37] flex items-center justify-center shrink-0 shadow">
                <Gift className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-[#4d0a13] text-sm">Wedding & Corporate Gifting</h4>
                <p className="text-gray-600 mt-0.5">
                  Custom gold-embossed packaging with company branding and personalized greeting cards.
                </p>
              </div>
            </div>

          </div>

          {/* Interactive Contact Form (Right 7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-[#d4af37]/30 shadow-lg">
            
            <h2 className="font-serif text-xl font-bold text-[#4d0a13] mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#d4af37]" />
              Send Us an Inquiry
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Fill out the details below and our team will get in touch promptly.
            </p>

            {submitted && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! Your message has been sent successfully. We will call you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Priya Sharma"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. priya@example.com"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Inquiry Purpose</label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
                >
                  <option value="Bridal Trousseau & Wedding Orders">Bridal Trousseau & Wedding Bulk Orders</option>
                  <option value="Custom Handloom Weaving & Blouse Styling">Custom Handloom Weaving & Blouse Styling</option>
                  <option value="Online Order Inquiry / Tracking">Online Order Inquiry / Tracking</option>
                  <option value="Boutique & Retail Inquiries">Boutique & Retail Inquiries</option>
                  <option value="General Feedback">General Feedback & Suggestions</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Your Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Please mention your required drapes, event date, weave preferences, or delivery city..."
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-[#fdfbf7] border border-gray-200 rounded-xl focus:outline-none focus:border-[#6b0f1a]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#6b0f1a] hover:bg-[#4d0a13] text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-[#d4af37]" />
                <span>Submit Inquiry</span>
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
