import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  QrCode,
  UtensilsCrossed,
  Sparkles,
  Compass,
  Menu,
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
  const location = useLocation();
  const selectedLanguage = useRestaurantStore((state) => state.selectedLanguage);
  const setSelectedLanguage = useRestaurantStore((state) => state.setSelectedLanguage);
  const activeTable = useRestaurantStore((state) => state.activeTable);
  const restaurant = useRestaurantStore((state) => state.restaurant);

  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // If on a dedicated diner table menu view, keep navbar minimal
  const isDinerView = location.pathname.includes('/menu');

  return (
    <>
      <nav className="sticky top-0 z-40 bg-[#090D16]/95 backdrop-blur-md border-b border-white/[0.08] px-3 sm:px-6 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Customer Brand Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2.5 group focus:outline-none"
            title="Menuz Pune Dining Guide"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 p-0.5 shadow-md shadow-amber-500/20 group-hover:shadow-amber-500/30 transition-all flex items-center justify-center">
              <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
                <span className="font-serif font-black text-transparent bg-clip-text bg-gradient-to-tr from-amber-400 to-amber-200 text-lg">
                  M
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black tracking-tight text-white text-base">MENUZ</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Dine-In
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Digital Menus &amp; QR Ordering • Pune
              </p>
            </div>
          </Link>

          {/* Center / Right: Dining Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Active Table indicator if customer scanned a QR */}
            {activeTable && (
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{restaurant?.name || 'Restaurant'}: {activeTable.label}</span>
              </div>
            )}

            {/* Scan Table QR Button */}
            <button
              type="button"
              onClick={() => setIsQrScannerOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan Table QR</span>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Select Language"
              >
                <Languages className="w-4 h-4" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#0D1322] border border-white/[0.1] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
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
                          ? 'bg-amber-500/15 text-amber-300 font-semibold'
                          : 'text-slate-300 hover:bg-white/[0.04]'
                      }`}
                    >
                      <span>{lang.label}</span>
                      {selectedLanguage === lang.code && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Explore Link */}
            <Link
              to="/"
              className="sm:hidden p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-slate-300"
              title="Explore Pune Restaurants"
            >
              <Compass className="w-4 h-4" />
            </Link>
          </div>
        </div>
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
