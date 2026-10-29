import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  QrCode,
  Menu as MenuIcon,
  X,
  Languages,
  Check
} from 'lucide-react';
import { useRestaurantStore } from '../../store/restaurantStore';
import { QrScannerModal } from '../../components/QrScannerModal';

const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'mr', label: 'मराठी (Marathi)' }
];

export const CustomerNavbar: React.FC = () => {
  const selectedLanguage = useRestaurantStore((state) => state.selectedLanguage);
  const setSelectedLanguage = useRestaurantStore((state) => state.setSelectedLanguage);

  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FFF7E6]/85 backdrop-blur-md border-b border-[#924E00]/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center space-x-2.5 group focus:outline-none"
            aria-label="Menuz Home"
          >
            <div className="w-8 h-8 rounded-full bg-[#F9A620] flex items-center justify-center text-white shadow-xs">
              <span className="font-serif font-bold text-sm tracking-tight">M</span>
            </div>
            <span className="font-serif font-black tracking-tight text-[#924E00] text-xl sm:text-2xl">
              menuz
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#924E00]/80">
            <button
              type="button"
              onClick={() => scrollToSection('discover')}
              className="hover:text-[#924E00] transition-colors cursor-pointer"
            >
              Discover
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('restaurants')}
              className="hover:text-[#924E00] transition-colors cursor-pointer"
            >
              Restaurants
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('experiences')}
              className="hover:text-[#924E00] transition-colors cursor-pointer"
            >
              Experiences
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="hover:text-[#924E00] transition-colors cursor-pointer"
            >
              About
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-[#924E00]/15 text-[#924E00] flex items-center justify-center transition-all cursor-pointer shadow-xs"
                title="Change Language"
                aria-label="Change Language"
              >
                <Languages className="w-4 h-4 text-[#924E00]" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white border border-[#924E00]/15 shadow-lg p-1.5 z-50">
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
                          ? 'bg-[#F9A620]/15 text-[#924E00] font-bold'
                          : 'text-[#924E00]/80 hover:bg-[#FFF7E6]'
                      }`}
                    >
                      <span>{lang.label}</span>
                      {selectedLanguage === lang.code && <Check className="w-3.5 h-3.5 text-[#F9A620]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => setIsQrScannerOpen(true)}
              className="h-10 px-4 sm:px-5 rounded-full bg-[#F9A620] hover:bg-[#e89512] active:scale-[0.98] text-white font-medium text-xs sm:text-sm flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
              aria-label="Scan Table QR Code"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan Table</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-[#924E00]/15 text-[#924E00] flex items-center justify-center transition-all cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 border-t border-[#924E00]/10 bg-[#FFF7E6]/95 backdrop-blur-md flex flex-col space-y-1 text-sm font-medium text-[#924E00]">
            <button
              type="button"
              onClick={() => scrollToSection('discover')}
              className="py-2.5 px-3 text-left rounded-xl hover:bg-white/60 transition-colors"
            >
              Discover
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('restaurants')}
              className="py-2.5 px-3 text-left rounded-xl hover:bg-white/60 transition-colors"
            >
              Restaurants
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('experiences')}
              className="py-2.5 px-3 text-left rounded-xl hover:bg-white/60 transition-colors"
            >
              Experiences
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="py-2.5 px-3 text-left rounded-xl hover:bg-white/60 transition-colors"
            >
              About
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

export default CustomerNavbar;
