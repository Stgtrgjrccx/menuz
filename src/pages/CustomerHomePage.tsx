import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode,
  Search,
  UtensilsCrossed,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Clock,
  Compass
} from 'lucide-react';
import { useRestaurantStore, isDishNameAsRestaurant } from '../store/restaurantStore';
import { isWorkingWithMenuz } from '../types';
import { QrScannerModal } from '../components/QrScannerModal';
import { AiAssistantDrawer } from '../components/AiAssistantDrawer';

export const CustomerHomePage: React.FC = () => {
  const navigate = useNavigate();
  const rawRestaurants = useRestaurantStore((state) => state.restaurants);
  const tables = useRestaurantStore((state) => state.tables);

  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Listen for global custom events to open camera scanner or AI concierge
  useEffect(() => {
    const handleScanner = () => setIsQrScannerOpen(true);
    const handleAi = (e?: Event) => {
      const customEvt = e as CustomEvent<{ query?: string }>;
      if (customEvt?.detail?.query) {
        setAiInitialQuery(customEvt.detail.query);
      }
      setIsAiOpen(true);
    };
    window.addEventListener('open-qr-scanner', handleScanner);
    window.addEventListener('open-ai-assistant', handleAi);
    return () => {
      window.removeEventListener('open-qr-scanner', handleScanner);
      window.removeEventListener('open-ai-assistant', handleAi);
    };
  }, []);

  // Verified partner restaurants affiliated with Menuz
  const affiliatedVenues = useMemo(() => {
    return rawRestaurants
      .filter((r) => r && r.id && !isDishNameAsRestaurant(r) && isWorkingWithMenuz(r))
      .map((r) => {
        const restTables = tables.filter((t) => t.restaurant_id === r.id);
        const firstTable = restTables[0] || { label: 'Table 1', public_token: `table-token-01-${r.slug}` };

        let customImage = r.cover_image_url || r.logo_url;
        if (!customImage || customImage.includes('unsplash.com/photo-1517248135467')) {
          if (r.cuisine.toLowerCase().includes('italian') || r.name.toLowerCase().includes('casa')) {
            customImage = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80';
          } else if (r.cuisine.toLowerCase().includes('bakery') || r.name.toLowerCase().includes('bakery')) {
            customImage = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&auto=format&fit=crop&q=80';
          } else if (r.cuisine.toLowerCase().includes('bistro') || r.name.toLowerCase().includes('plaisir')) {
            customImage = 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=900&auto=format&fit=crop&q=80';
          } else {
            customImage = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&auto=format&fit=crop&q=80';
          }
        }

        return {
          id: r.id,
          name: r.name,
          slug: r.slug,
          cuisine: r.cuisine,
          location: r.location || 'Pune, India',
          specialty: r.cuisine.includes('Italian')
            ? 'Wood-fired sourdough Neapolitan crusts & hand-rolled pasta'
            : r.cuisine.includes('Bakery')
            ? 'European sourdough breads, artisan pastries & cold brews'
            : r.cuisine.includes('Bistro')
            ? 'French café classics, savoury crêpes & delicate macarons'
            : 'Dum Pukht slow-cooked Awadhi curries & heritage royal biryani',
          imageUrl: customImage,
          token: firstTable.public_token
        };
      });
  }, [rawRestaurants, tables]);

  // Filtered venues list
  const filteredVenues = useMemo(() => {
    return affiliatedVenues.filter((v) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.cuisine.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q);

      const matchesFilter =
        selectedFilter === 'all' ||
        (selectedFilter === 'mughlai' && (v.cuisine.includes('Mughlai') || v.cuisine.includes('Awadhi'))) ||
        (selectedFilter === 'italian' && (v.cuisine.includes('Italian') || v.cuisine.includes('Pizza'))) ||
        (selectedFilter === 'bakery' && (v.cuisine.includes('Bakery') || v.cuisine.includes('Coffee'))) ||
        (selectedFilter === 'continental' && (v.cuisine.includes('Continental') || v.cuisine.includes('Bistro')));

      return matchesSearch && matchesFilter;
    });
  }, [affiliatedVenues, searchQuery, selectedFilter]);

  return (
    <div className="min-h-screen bg-[#0d0c0e] text-[#e5e1e4] flex flex-col font-sans selection:bg-[#ff5722]/30 selection:text-white">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION: ULTRA-MINIMALIST & INSTANTLY CLEAR           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center flex flex-col items-center">
        {/* Monolithic Category Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18171a] border border-white/10 text-xs font-mono text-[#ffb955] mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff5722] animate-pulse" />
          <span className="tracking-widest uppercase font-semibold">Autonomous Tableside Dining</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif font-bold text-4xl sm:text-6xl lg:text-7xl text-[#f5f1ea] tracking-tight leading-[1.08] max-w-4xl">
          Instant dining, <br className="hidden sm:inline" />
          <span className="italic font-normal text-[#ffb955]">straight from your table.</span>
        </h1>

        {/* Unambiguous Value Proposition */}
        <p className="mt-5 text-sm sm:text-base md:text-lg text-[#ab8980] max-w-2xl leading-relaxed">
          Scan the QR code at your dining table to explore high-definition plating photography, order dishes together in real time, and split the bill. No app download required.
        </p>

        {/* Primary High-Contrast Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          {/* Action 1: Scan Table QR */}
          <button
            type="button"
            onClick={() => setIsQrScannerOpen(true)}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#ff5722] hover:bg-[#ff6f3d] active:scale-98 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-[#ff5722]/20 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-white" />
            <span>Scan Table QR</span>
          </button>

          {/* Action 2: Open Showroom Menu */}
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#18171a] hover:bg-[#201f21] border border-white/10 hover:border-[#ffb955]/50 active:scale-98 text-[#f5f1ea] hover:text-[#ffb955] font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <UtensilsCrossed className="w-4 h-4 text-[#ffb955]" />
            <span>Browse Showroom Menu</span>
            <ArrowRight className="w-4 h-4 text-[#ab8980]" />
          </button>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. THREE-STEP FLOW: HOW MENUZ WORKS IN 10 SECONDS            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Step 1 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#131215] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#ff5722] font-bold tracking-widest mb-3">
                <span>01 // SCAN</span>
                <QrCode className="w-4 h-4 text-[#ff5722]" />
              </div>
              <h2 className="text-base font-bold font-serif text-[#f5f1ea]">Scan Table Standee</h2>
              <p className="mt-1.5 text-xs text-[#ab8980] leading-relaxed">
                Point your phone camera at the QR code standee on your table. Instantly joins your table's session with zero app installations.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#131215] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#ffb955] font-bold tracking-widest mb-3">
                <span>02 // EXPLORE</span>
                <UtensilsCrossed className="w-4 h-4 text-[#ffb955]" />
              </div>
              <h2 className="text-base font-bold font-serif text-[#f5f1ea]">Order in Showroom Mode</h2>
              <p className="mt-1.5 text-xs text-[#ab8980] leading-relaxed">
                Browse square dishes on illuminated shelves, review chef ingredient sourcing, and sync cart additions with table companions in real time.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#131215] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 font-bold tracking-widest mb-3">
                <span>03 // DINE</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className="text-base font-bold font-serif text-[#f5f1ea]">Direct Kitchen Routing</h2>
              <p className="mt-1.5 text-xs text-[#ab8980] leading-relaxed">
                Orders fire directly to the kitchen's thermal KOT printer. Track fulfillment live, alert your waiter, and split the bill with 1 tap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. CURATED RESTAURANTS DIRECTORY (CLEAN & MINIMALIST)          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="restaurants" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full border-t border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#ffb955] font-semibold block mb-1">
              VERIFIED VENUES // PUNE, INDIA
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#f5f1ea] tracking-tight">
              Select a Restaurant
            </h2>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#ab8980] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or cuisine..."
              className="w-full bg-[#18171a] border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-[#e5e1e4] placeholder-[#ab8980] focus:outline-none focus:border-[#ffb955]"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar text-xs font-mono">
          {[
            { id: 'all', label: 'All Venues' },
            { id: 'mughlai', label: 'Awadhi & Mughlai' },
            { id: 'italian', label: 'Artisanal Pizza' },
            { id: 'continental', label: 'Bistro & Grills' },
            { id: 'bakery', label: 'European Bakery' }
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setSelectedFilter(pill.id)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === pill.id
                  ? 'bg-[#ffb955] text-black font-bold shadow-xs'
                  : 'bg-[#18171a] text-[#ab8980] hover:text-[#e5e1e4] border border-white/5'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Restaurant Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="bg-[#131215] border border-white/5 hover:border-[#ffb955]/40 rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col justify-between shadow-xl"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-44 w-full overflow-hidden bg-[#18171a]">
                  <img
                    src={venue.imageUrl}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Location Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-black/75 backdrop-blur-md text-[#ffb955] border border-[#ffb955]/30">
                    {venue.location}
                  </span>

                  {/* Live Status Pulse */}
                  <span className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-semibold bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Tableside Active</span>
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 space-y-1.5">
                  <h3 className="font-serif text-lg font-bold text-[#f5f1ea] group-hover:text-[#ffb955] transition-colors">
                    {venue.name}
                  </h3>
                  <p className="text-xs text-[#ab8980] line-clamp-1">{venue.cuisine}</p>
                  <p className="text-[11px] text-[#ab8980]/80 line-clamp-2 leading-relaxed pt-1">
                    {venue.specialty}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => navigate(`/r/${venue.slug}/menu?t=${venue.token}`)}
                  className="w-full py-2.5 rounded-xl bg-[#ffb955]/15 hover:bg-[#ffb955] text-[#ffb955] hover:text-black border border-[#ffb955]/30 hover:border-[#ffb955] text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                >
                  <span>Open Showroom Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. CHEF AI STRIP (CLEAN & SUBTLE)                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="p-5 sm:p-6 rounded-2xl bg-[#131215] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#ffb955]/15 border border-[#ffb955]/30 flex items-center justify-center text-[#ffb955] flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#ffb955]" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-serif text-[#f5f1ea]">Unsure what to order?</h2>
              <p className="text-xs text-[#ab8980] mt-0.5">
                Chef AI Concierge provides spice calibration, dietary checks, and wine pairings.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAiOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1b1b1d] hover:bg-white/10 border border-white/10 text-xs font-mono font-semibold text-[#f5f1ea] hover:text-[#ffb955] transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
          >
            <span>Consult Chef AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. MINIMALIST FOOTER                                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <footer className="mt-auto py-8 px-4 sm:px-6 lg:px-8 border-t border-white/5 text-center text-xs text-[#ab8980] font-mono">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-sm text-[#f5f1ea]">menuz</span>
            <span>—</span>
            <span>Autonomous Tableside Dining OS</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={() => navigate('/menu')}
              className="hover:text-[#ffb955] transition-colors cursor-pointer"
            >
              Showroom Menu
            </button>
            <button
              type="button"
              onClick={() => setIsQrScannerOpen(true)}
              className="hover:text-[#ffb955] transition-colors cursor-pointer"
            >
              Scan Table QR
            </button>
          </div>
        </div>
      </footer>

      {/* Camera QR Scanner Modal */}
      {isQrScannerOpen && (
        <QrScannerModal
          isOpen={isQrScannerOpen}
          onClose={() => setIsQrScannerOpen(false)}
        />
      )}

      {/* Chef AI Concierge Drawer */}
      <AiAssistantDrawer
        isOpen={isAiOpen}
        onClose={() => {
          setIsAiOpen(false);
          setAiInitialQuery(null);
        }}
        focusDish={null}
        onConfirmAdd={() => navigate('/menu')}
        initialQuery={aiInitialQuery}
      />
    </div>
  );
};
