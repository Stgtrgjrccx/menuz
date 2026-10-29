import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  QrCode,
  Search,
  Sparkles,
  Compass,
  UtensilsCrossed,
  Menu as MenuIcon,
  X,
  Languages,
  Check,
  Bookmark,
  Share2,
  Smartphone
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
  const activeTable = useRestaurantStore((state) => state.activeTable);
  const restaurant = useRestaurantStore((state) => state.restaurant);

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
      {/* ───────────────────────────────────────────────────────────── */}
      {/* GOLDEN HOUR FROSTED GLASS NAVIGATION BAR                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#FFF7E6]/80 backdrop-blur-xl border-b border-[#924E00]/10 shadow-[0_4px_30px_rgba(146,78,0,0.04)] px-4 sm:px-8 py-3 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* 1. Left: Brand Emblem & Wordmark */}
          <Link
            to="/"
            className="flex items-center space-x-3 group focus:outline-none shrink-0"
            title="Menuz — Golden Hour Dining"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F9A620] via-[#FFAE33] to-[#FFD188] p-[1.5px] shadow-[0_6px_20px_rgba(249,166,32,0.25)] group-hover:shadow-[0_8px_25px_rgba(249,166,32,0.35)] transition-all">
              <div className="w-full h-full bg-[#FFF7E6] rounded-[14px] flex items-center justify-center">
                <span className="font-serif font-black text-[#924E00] text-xl tracking-tight">
                  M
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-black tracking-tight text-[#924E00] text-xl">
                  menuz
                </span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#F9A620]/15 text-[#924E00] border border-[#F9A620]/30 shadow-xs">
                  Golden Hour
                </span>
              </div>
              <p className="text-[10px] font-medium text-[#924E00]/65 hidden sm:block">
                Curated Dining &amp; Tableside Experiences
              </p>
            </div>
          </Link>

          {/* 2. Center: Editorial Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center space-x-7 font-sans font-medium text-sm text-[#924E00]/80">
            <button
              type="button"
              onClick={() => scrollToSection('discover')}
              className="hover:text-[#924E00] hover:font-semibold transition-colors cursor-pointer"
            >
              Discover
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('categories')}
              className="hover:text-[#924E00] hover:font-semibold transition-colors cursor-pointer"
            >
              Categories
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('featured-restaurants')}
              className="hover:text-[#924E00] hover:font-semibold transition-colors cursor-pointer"
            >
              Restaurants
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('experiences')}
              className="hover:text-[#924E00] hover:font-semibold transition-colors cursor-pointer"
            >
              Experiences
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('social-discovery')}
              className="hover:text-[#924E00] hover:font-semibold transition-colors cursor-pointer"
            >
              Social
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="hover:text-[#924E00] hover:font-semibold transition-colors cursor-pointer"
            >
              About
            </button>
          </div>

          {/* 3. Right: Search & Actions */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
            
            {/* Search Button (triggers scroll to search input) */}
            <button
              type="button"
              onClick={() => scrollToSection('featured-restaurants')}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/70 hover:bg-white/95 border border-[#924E00]/10 text-[#924E00] hover:text-[#924E00] text-xs font-medium flex items-center space-x-1.5 backdrop-blur-md shadow-[0_2px_10px_rgba(146,78,0,0.03)] transition-all cursor-pointer"
              title="Search restaurants & cuisines"
            >
              <Search className="w-4 h-4 text-[#924E00]" />
              <span className="hidden sm:inline">Search</span>
            </button>

            {/* Language Selector Glass Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="p-2 rounded-xl bg-white/70 hover:bg-white/95 border border-[#924E00]/10 text-[#924E00] backdrop-blur-md shadow-[0_2px_10px_rgba(146,78,0,0.03)] transition-all cursor-pointer"
                title="Choose Language"
              >
                <Languages className="w-4 h-4 text-[#924E00]" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#FFF7E6]/95 backdrop-blur-2xl border border-[#924E00]/15 shadow-[0_16px_40px_rgba(146,78,0,0.12)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
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
                          ? 'bg-[#F9A620]/20 text-[#924E00] font-bold'
                          : 'text-[#924E00]/80 hover:bg-white/60'
                      }`}
                    >
                      <span>{lang.label}</span>
                      {selectedLanguage === lang.code && <Check className="w-3.5 h-3.5 text-[#F9A620]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Scan Table QR / Get The App (Primary Button) */}
            <button
              type="button"
              onClick={() => setIsQrScannerOpen(true)}
              className="py-2 sm:py-2.5 px-3.5 sm:px-5 rounded-xl bg-gradient-to-r from-[#F9A620] to-[#FFAE33] hover:brightness-105 active:scale-95 text-[#FFF7E6] font-bold text-xs sm:text-sm shadow-[0_4px_16px_rgba(249,166,32,0.35)] flex items-center space-x-2 transition-all cursor-pointer shrink-0"
            >
              <QrCode className="w-4 h-4 text-[#FFF7E6]" />
              <span className="font-semibold">Scan Table QR</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/70 border border-[#924E00]/10 text-[#924E00] backdrop-blur-md cursor-pointer"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Glassmorphism */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-[#924E00]/10 flex flex-col space-y-2.5 font-sans font-medium text-sm text-[#924E00] animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              type="button"
              onClick={() => scrollToSection('discover')}
              className="px-3 py-2 text-left rounded-xl bg-white/40 hover:bg-white/80 transition-colors"
            >
              Discover
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('categories')}
              className="px-3 py-2 text-left rounded-xl bg-white/40 hover:bg-white/80 transition-colors"
            >
              Dining Categories
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('featured-restaurants')}
              className="px-3 py-2 text-left rounded-xl bg-white/40 hover:bg-white/80 transition-colors"
            >
              Featured Restaurants
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('experiences')}
              className="px-3 py-2 text-left rounded-xl bg-white/40 hover:bg-white/80 transition-colors"
            >
              Signature Experiences
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('social-discovery')}
              className="px-3 py-2 text-left rounded-xl bg-white/40 hover:bg-white/80 transition-colors"
            >
              Social Dining &amp; Favourites
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="px-3 py-2 text-left rounded-xl bg-white/40 hover:bg-white/80 transition-colors"
            >
              About Menuz
            </button>
          </div>
        )}
      </nav>

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
