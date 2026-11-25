import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  QrCode,
  Menu as MenuIcon,
  X,
  Languages,
  Check,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';
import { useRestaurantStore } from '../../store/restaurantStore';
import { QrScannerModal } from '../../components/QrScannerModal';

const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'mr', label: 'मराठी (Marathi)' }
];

export const CustomerNavbar: React.FC = () => {
  const location = useLocation();
  const selectedLanguage = useRestaurantStore((state) => state.selectedLanguage);
  const setSelectedLanguage = useRestaurantStore((state) => state.setSelectedLanguage);

  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // When visiting a tableside menu directly, the DinerMenu component provides its own Top App Bar
  if (location.pathname.startsWith('/r/') || location.pathname.startsWith('/menu')) {
    return null;
  }

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-black/5 transition-all text-[#141414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center space-x-2.5 group focus:outline-none"
            aria-label="Menuz Home"
          >
            <div className="w-8 h-8 rounded-full bg-[#F4511E] flex items-center justify-center text-white shadow-md shadow-[#F4511E]/20">
              <span className="font-serif font-bold text-sm tracking-tight">M</span>
            </div>
            <span className="font-serif font-black tracking-tight text-[#141414] text-xl sm:text-2xl">
              menuz
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-[#141414]/80">
            <Link
              to="/menu"
              className="hover:text-[#2D4A3E] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#2D4A3E]" />
              <span>Showroom Menu</span>
            </Link>
            <button
              type="button"
              onClick={() => scrollToSection('restaurants')}
              className="hover:text-[#141414] transition-colors cursor-pointer"
            >
              Restaurants
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="w-10 h-10 rounded-full bg-[#F5F1E8] hover:bg-[#EFE9DD] border border-black/10 text-[#141414] flex items-center justify-center transition-all cursor-pointer shadow-sm"
                title="Change Language"
                aria-label="Change Language"
              >
                <Languages className="w-4 h-4 text-[#141414]" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#F5F1E8] border border-black/10 shadow-2xl p-1.5 z-50 text-[#141414]">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setSelectedLanguage(lang.code as any);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                        selectedLanguage === lang.code
                          ? 'bg-[#F4511E]/20 text-[#F4511E] font-bold'
                          : 'text-[#141414]/80 hover:bg-[#EFE9DD]'
                      }`}
                    >
                      <span>{lang.label}</span>
                      {selectedLanguage === lang.code && <Check className="w-3.5 h-3.5 text-[#F4511E]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chef AI Button */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-assistant'))}
              className="h-10 px-3 sm:px-4 rounded-full bg-[#F5F1E8] hover:bg-[#EFE9DD] text-[#141414] border border-[#F4511E] font-semibold text-xs sm:text-sm flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
              title="Ask Chef AI Dining Concierge"
              aria-label="Ask Chef AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F4511E]" />
              <span>Chef AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#88d982] animate-pulse hidden sm:inline" />
            </button>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => setIsQrScannerOpen(true)}
              className="h-10 px-3.5 sm:px-5 rounded-full bg-[#F4511E] hover:bg-[#F4511E] active:scale-[0.98] text-white font-medium text-xs sm:text-sm flex items-center space-x-1.5 sm:space-x-2 transition-all shadow-md shadow-[#F4511E]/25 cursor-pointer"
              aria-label="Scan Table QR Code"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">Scan Table</span>
              <span className="sm:hidden">Scan</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-[#F5F1E8] hover:bg-[#EFE9DD] border border-black/10 text-[#141414] flex items-center justify-center transition-all cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 border-t border-black/5 bg-[#FFFFFF]/95 backdrop-blur-md flex flex-col space-y-1 text-sm font-medium text-[#141414]">
            <Link
              to="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 text-left rounded-xl hover:bg-[#F5F1E8] transition-colors flex items-center justify-between text-[#2D4A3E] font-semibold"
            >
              <span className="flex items-center space-x-2">
                <UtensilsCrossed className="w-4 h-4 text-[#2D4A3E]" />
                <span>Showroom Menu</span>
              </span>
              <span className="text-[10px] bg-[#F4511E]/20 text-[#2D4A3E] px-2 py-0.5 rounded-full font-mono">Live</span>
            </Link>
            <button
              type="button"
              onClick={() => scrollToSection('restaurants')}
              className="py-2.5 px-3 text-left rounded-xl hover:bg-[#F5F1E8] transition-colors"
            >
              Featured Restaurants
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent('open-ai-assistant'));
              }}
              className="py-2.5 px-3 text-left rounded-xl bg-[#F4511E]/15 hover:bg-[#F4511E]/25 transition-colors flex items-center justify-between font-bold text-[#141414]"
            >
              <span className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#F4511E]" />
                <span>Ask Chef AI Assistant</span>
              </span>
            </button>
          </div>
        )}
      </header>

      {/* QR Scanner Modal */}
      {isQrScannerOpen && (
        <QrScannerModal
          isOpen={isQrScannerOpen}
          onClose={() => setIsQrScannerOpen(false)}
        />
      )}
    </>
  );
};
