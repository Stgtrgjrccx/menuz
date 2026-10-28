import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode,
  Search,
  UtensilsCrossed,
  MapPin,
  Star,
  ArrowRight,
  CheckCircle2,
  Gamepad2,
  Sparkles,
  Flame,
  Clock,
  Compass,
  Cpu,
  Shield,
  Layers,
  LayoutDashboard
} from 'lucide-react';
import { Phone, Turntable, Basket } from '@lucasmarkes/hairline/react';
import { useRestaurantStore, isDishNameAsRestaurant } from '../store/restaurantStore';
import { isWorkingWithMenuz, Restaurant } from '../types';
import { QrScannerModal } from '../components/QrScannerModal';
import { TableArcadeModal } from '../components/TableArcadeModal';
import { WinChallengeModal } from '../components/WinChallengeModal';

export const CustomerHomePage: React.FC = () => {
  const navigate = useNavigate();
  const rawRestaurants = useRestaurantStore((state) => state.restaurants);
  const tables = useRestaurantStore((state) => state.tables);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCuisineFilter, setActiveCuisineFilter] = useState<string>('all');
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [selectedScannerSlug, setSelectedScannerSlug] = useState<string | undefined>(undefined);
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [isWinChallengeOpen, setIsWinChallengeOpen] = useState(false);
  const [winChallengeVenue, setWinChallengeVenue] = useState<Restaurant | null>(null);

  useEffect(() => {
    const handleArcade = () => setIsArcadeOpen(true);
    const handleWin = () => setIsWinChallengeOpen(true);
    window.addEventListener('open-table-arcade', handleArcade);
    window.addEventListener('open-google-review', handleWin);
    window.addEventListener('open-win-challenge', handleWin);
    return () => {
      window.removeEventListener('open-table-arcade', handleArcade);
      window.removeEventListener('open-google-review', handleWin);
      window.removeEventListener('open-win-challenge', handleWin);
    };
  }, []);

  // Strictly ONLY restaurants affiliated with Menuz (verified partners)
  const affiliatedVenues = useMemo(() => {
    return rawRestaurants
      .filter((r) => r && r.id && !isDishNameAsRestaurant(r) && isWorkingWithMenuz(r))
      .map((r) => {
        const restTables = tables.filter((t) => t.restaurant_id === r.id);
        const firstTable = restTables[0] || { label: 'Table 1', public_token: `table-token-01-${r.slug}` };
        return {
          id: r.id,
          name: r.name,
          slug: r.slug,
          cuisine: r.cuisine,
          location: r.location || 'Pune, India',
          rating: 4.9,
          reviewsCount: 142,
          costForTwo: r.cuisine.includes('Italian') ? '₹1,400 for two' : '₹1,200 for two',
          specialty: r.cuisine.includes('Italian')
            ? 'Wood-fired sourdough Neapolitan pizza, handmade pasta & artisanal tiramisu'
            : 'Dum Pukht slow-cooked Awadhi curries & royal tandoori heritage kebabs',
          imageUrl: r.cover_image_url || r.logo_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop',
          token: firstTable.public_token,
          tableNumber: firstTable.label,
          rawRest: r
        };
      });
  }, [rawRestaurants, tables]);

  // Cuisine category filters
  const cuisineFilters = useMemo(() => {
    const cuisines = Array.from(new Set(affiliatedVenues.map((v) => v.cuisine)));
    return [
      { id: 'all', label: 'All Partners' },
      ...cuisines.map((c) => ({ id: c, label: c }))
    ];
  }, [affiliatedVenues]);

  // Filtered restaurants based on query & category
  const filteredVenues = useMemo(() => {
    return affiliatedVenues.filter((v) => {
      const matchesSearch =
        searchQuery === '' ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCuisine =
        activeCuisineFilter === 'all' || v.cuisine === activeCuisineFilter;

      return matchesSearch && matchesCuisine;
    });
  }, [affiliatedVenues, searchQuery, activeCuisineFilter]);

  const handleOpenScanner = (slug?: string) => {
    setSelectedScannerSlug(slug);
    setIsQrScannerOpen(true);
  };

  const handleLaunchTable = (venue: typeof affiliatedVenues[0]) => {
    navigate(`/r/${venue.slug}/menu?t=${venue.token}`);
  };

  const handleOpenWinChallenge = (venue?: typeof affiliatedVenues[0]) => {
    if (venue?.rawRest) {
      setWinChallengeVenue(venue.rawRest);
    } else if (affiliatedVenues[0]?.rawRest) {
      setWinChallengeVenue(affiliatedVenues[0].rawRest);
    }
    setIsWinChallengeOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080C15] text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200 antialiased">
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* TELEMETRY STATUS BAR (High-Tech Spatial Line)                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="w-full border-b border-white/[0.06] bg-[#060911] text-[11px] font-mono py-1.5 px-4 sm:px-8 text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>MENUZ CUSTOMER OS v2.4</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">/</span>
            <span className="text-slate-400 hidden sm:inline">PUNE ECOSYSTEM</span>
            <span className="text-slate-600 hidden sm:inline">/</span>
            <span className="text-amber-400/90 font-medium hidden md:inline">ZERO-APP QR PROTOCOL</span>
          </div>
          <div className="flex items-center space-x-4 text-[10px] text-slate-500">
            <span>NETWORK: ONLINE</span>
            <span>ENCRYPTION: ACTIVE</span>
            <span className="text-amber-400/80 font-semibold hidden sm:inline">0% DINER COMMISSION</span>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION: SPATIAL HARDWARE & EXPLODED PHONE            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[320px] bg-amber-500/[0.05] blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Spatial Typography & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Architectural Chip */}
            <div className="inline-flex items-center space-x-2.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono tracking-tight">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">Dine-In Architecture</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-sans">Tableside Multiplayer</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
                Dine In. Scan. <br />
                <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                  Feast In Seconds.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Zero app downloads required. Point your native phone camera at any table QR code to explore interactive menus, order together in a synchronized multiplayer cart, and transmit tickets straight to the kitchen thermal printer.
              </p>
            </div>

            {/* Primary Action Suite */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleOpenScanner()}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center space-x-2.5 transition-all cursor-pointer group"
              >
                <QrCode className="w-4 h-4 text-slate-950 group-hover:rotate-6 transition-transform" />
                <span>Scan Table QR Code</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenWinChallenge()}
                className="py-3 px-5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/30 hover:border-amber-400/60 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Tableside Reward Roulette</span>
                <span className="text-[10px] font-mono bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300 font-bold border border-amber-500/30">WIN</span>
              </button>

              {affiliatedVenues[0] && (
                <button
                  type="button"
                  onClick={() => handleLaunchTable(affiliatedVenues[0])}
                  className="py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 font-semibold text-xs sm:text-sm border border-white/[0.08] hover:border-white/[0.18] flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                  <span>Explore Flagship Menu</span>
                </button>
              )}
            </div>

            {/* 3 Technical Guarantees (1px Line Grid) */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.06] text-left">
              <div className="space-y-1">
                <div className="text-[11px] font-mono font-bold text-amber-400 flex items-center space-x-1">
                  <span>[01]</span>
                  <span>ZERO APPS</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">Native camera QR optical scan</p>
              </div>
              <div className="space-y-1 border-l border-white/[0.06] pl-3">
                <div className="text-[11px] font-mono font-bold text-amber-400 flex items-center space-x-1">
                  <span>[02]</span>
                  <span>MULTIPLAYER</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">Synced table cart collaboration</p>
              </div>
              <div className="space-y-1 border-l border-white/[0.06] pl-3">
                <div className="text-[11px] font-mono font-bold text-amber-400 flex items-center space-x-1">
                  <span>[03]</span>
                  <span>DIRECT KOT</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">Instant ESC/POS thermal printing</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Isometric Exploded Phone */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-md relative bg-[#090D17] border border-white/[0.08] hover:border-amber-500/30 rounded-3xl p-5 shadow-2xl transition-all group overflow-hidden">
              {/* Corner Architectural Crop Marks */}
              <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-500/40" />
              <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-500/40" />
              <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-500/40" />
              <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-500/40" />

              {/* Title & Live Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs font-mono">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="font-bold text-white">FIG. 01</span>
                  <span>/ SPATIAL SCANNER</span>
                </span>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  PHYSICS: ACTIVE
                </span>
              </div>

              {/* The Hairline Phone Figure */}
              <div className="w-full py-4 flex items-center justify-center">
                <Phone
                  intensity={0.7}
                  theme="dark"
                  label="Interactive exploded phone showing zero-app ordering technology"
                  className="w-full max-w-[280px] sm:max-w-[320px] mx-auto filter drop-shadow-[0_10px_25px_rgba(245,158,11,0.15)]"
                />
              </div>

              {/* Caption & Exploded Layer Legend */}
              <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Hover cursor to expand 4-layer hardware stack</span>
                <span className="text-amber-400 font-bold">4 LAYERS</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. REWARD ROULETTE BENTO: INTERACTIVE TURNTABLE               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#0A0E18] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Subtle Ambient Background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />

          {/* Left: Challenge Pitch */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
              <span>🎁 TABLE REWARD PROTOCOL</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-normal">Flick to Spin</span>
            </div>

            <h2 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
              The Tableside Reward Roulette
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Post an authentic 5-star Google review for your dining experience to unlock the physical reward plinth. Flick the 3D turntable with your finger or cursor to spin and settle on your secret tableside treat.
            </p>

            {/* 4 Quarter Rewards Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 font-mono text-[11px]">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                <div className="text-amber-400 font-bold">[01] DESSERT</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Complimentary</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                <div className="text-amber-400 font-bold">[02] MOCKTAIL</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Signature Drink</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                <div className="text-amber-400 font-bold">[03] APPETIZER</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Chef's Treat</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                <div className="text-amber-400 font-bold">[04] 20% OFF</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Table Discount</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleOpenWinChallenge()}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center space-x-2 transition-all cursor-pointer"
              >
                <span>Launch Tableside Turntable</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>

          {/* Right: Live Interactive Turntable Plinth */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm bg-[#070A12] border border-white/[0.08] rounded-2xl p-4 text-center space-y-2">
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span>ROULETTE PLINTH: 4 QUARTERS</span>
                <span className="text-amber-400 font-semibold">SWEEP TO FLICK</span>
              </div>
              <div className="w-full py-2">
                <Turntable
                  intensity={0.8}
                  theme="dark"
                  label="Interactive tableside reward turntable roulette"
                  className="w-full max-w-[260px] mx-auto filter drop-shadow-[0_8px_20px_rgba(245,158,11,0.2)]"
                />
              </div>
              <p className="text-[10px] font-mono text-slate-400 pt-1 border-t border-white/[0.06]">
                Flick with cursor to spin • Settles on closest quarter turn
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. MODULAR BENTO DIRECTORY: PUNE PARTNERS                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 w-full flex-1">
        
        {/* Section Header with Search & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                VERIFIED PARTNER REGISTRY
              </span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white">
              Pune Restaurants Powered by Menuz
            </h2>
            <p className="text-xs text-slate-400">
              Only authentic venues equipped with Menuz live QR table ordering and digital kitchens.
            </p>
          </div>

          {/* Search Bar + Filter Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search venue, cuisine, locality..."
                className="w-full py-2 pl-9 pr-8 text-xs bg-white/[0.04] text-white placeholder:text-slate-500 rounded-xl border border-white/[0.1] focus:outline-none focus:border-amber-400/60 transition-colors font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Pills */}
            {cuisineFilters.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {cuisineFilters.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveCuisineFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer font-mono ${
                      activeCuisineFilter === f.id
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bento Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVenues.map((venue) => (
            <div
              key={venue.slug}
              className="bg-[#090D17] border border-white/[0.08] hover:border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col group relative"
            >
              {/* Corner Architectural Brackets */}
              <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-amber-500/30 z-10" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-amber-500/30 z-10" />

              {/* Photo Banner with High-Contrast Vignette */}
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                <img
                  src={venue.imageUrl}
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090D17] via-transparent to-black/50" />

                {/* Top Telemetry Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white text-xs font-bold flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{venue.rating}</span>
                      <span className="text-[10px] text-slate-400">({venue.reviewsCount})</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>VERIFIED PARTNER</span>
                    </span>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-amber-400 text-[10px] font-mono font-bold">
                    TABLE [{venue.tableNumber}]
                  </span>
                </div>

                {/* Bottom Details on Image */}
                <div className="absolute bottom-3 left-4 right-4 z-10">
                  <h3 className="font-serif font-black text-2xl text-white group-hover:text-amber-400 transition-colors">
                    {venue.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-300 mt-1">
                    <span className="flex items-center space-x-1 text-slate-300">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{venue.location}</span>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="font-mono text-amber-300 text-[11px]">{venue.costForTwo}</span>
                  </div>
                </div>
              </div>

              {/* Bento Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold uppercase tracking-wider">{venue.cuisine}</span>
                    <span className="text-[10px] text-slate-500">KOT AUTOMATION</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {venue.specialty}
                  </p>
                </div>

                {/* Action Row */}
                <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleLaunchTable(venue)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5 text-slate-950" />
                      <span>View Scanned Menu</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenWinChallenge(venue)}
                      title="Play Tableside Reward Challenge"
                      className="py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <span>🎁 Roulette</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenScanner(venue.slug)}
                      title={`Scan Table QR for ${venue.name}`}
                      className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <QrCode className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/r/${venue.slug}`)}
                    className="w-full py-1.5 px-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] text-slate-400 hover:text-slate-200 text-[10px] font-mono flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <LayoutDashboard className="w-3 h-3 text-indigo-400" />
                    <span>Restaurant Partner Floor Operations ({venue.name}) ↗</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVenues.length === 0 && (
          <div className="text-center py-12 bg-white/[0.02] border border-white/[0.06] rounded-2xl space-y-3 font-mono">
            <UtensilsCrossed className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">NO MATCHING VERIFIED PARTNERS</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
              No Menuz partner matches your search query. Try searching for "Saffron House" or "Casa Bella".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCuisineFilter('all');
              }}
              className="text-xs text-amber-400 font-bold hover:underline cursor-pointer"
            >
              [RESET FILTERS]
            </button>
          </div>
        )}
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. TABLE ARCADE & WAITING GAMES (CLEAN 1PX BENTO)             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
        <div className="bg-[#090D17] border border-purple-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
                <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                <span>TABLE ENTERTAINMENT SUITE</span>
              </div>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-white">
                Play Games While Waiting For Your Food
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                App-free games for your table: Klondike Solitaire, culinary crosswords, multiplayer trivia, and Bill Roulette to decide who pays the check.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsArcadeOpen(true)}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
            >
              <Gamepad2 className="w-4 h-4 text-white" />
              <span>Launch Table Arcade</span>
            </button>
          </div>

          {/* 4 Bento Game Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            <div
              onClick={() => setIsArcadeOpen(true)}
              className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] hover:border-amber-400/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🃏</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    KIDS → ADULTS
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                  Klondike Solitaire
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Classic patience cards. Easy (Draw 1), Medium (Draw 3), and Hard (3-pass limit challenge).
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-amber-400 font-semibold font-mono">
                <span>PLAY SOLITAIRE</span>
                <span>→</span>
              </div>
            </div>

            <div
              onClick={() => setIsArcadeOpen(true)}
              className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] hover:border-purple-400/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">✏️</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
                    FOOD QUIZ
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                  Mini Crossword
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Quick 5x5 culinary word puzzles. Clues for children, gourmet ingredients for masters.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-purple-400 font-semibold font-mono">
                <span>SOLVE PUZZLE</span>
                <span>→</span>
              </div>
            </div>

            <div
              onClick={() => setIsArcadeOpen(true)}
              className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] hover:border-indigo-400/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🧠</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                    MULTIPLAYER
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                  Table Battle Trivia
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Fast-paced buzzer trivia. Food origins, Bollywood cuisine, and spicy culinary history.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-indigo-400 font-semibold font-mono">
                <span>START TRIVIA</span>
                <span>→</span>
              </div>
            </div>

            <div
              onClick={() => setIsArcadeOpen(true)}
              className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] hover:border-rose-400/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🎲</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                    WHO PAYS?
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-rose-300 transition-colors">
                  Bill Roulette
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Interactive spinning wheel. Friendly dares, fun forfeits, or the real dining bill check.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-rose-400 font-semibold font-mono">
                <span>SPIN ROULETTE</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. MINIMALIST FOOTER                                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <footer className="mt-12 py-10 border-t border-white/[0.06] text-center text-xs text-slate-500 space-y-3 font-mono">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center font-black text-slate-950 text-xs">
            M
          </div>
          <span className="font-serif font-black text-sm text-slate-300">MENUZ CUSTOMER OS</span>
        </div>
        <p className="text-[11px] text-slate-400 font-sans">
          Autonomous Digital Dining &amp; Multiplayer QR Table Ordering • Verified Pune Venues Only
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[10px] text-slate-500">
          <span>[CAMERA QR SCAN]</span>
          <span>•</span>
          <span>[THERMAL KOT PRINTING]</span>
          <span>•</span>
          <span>[GOOGLE 5-STAR REPUTATION SHIELD]</span>
        </div>
      </footer>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FLOATING ACTION PILLS (Clean, Tidy, Minimal)                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-2.5">
        <button
          type="button"
          onClick={() => setIsArcadeOpen(true)}
          className="py-2.5 px-4 rounded-full bg-[#0E1528] hover:bg-[#151D36] active:scale-95 text-purple-300 font-mono text-xs shadow-2xl flex items-center space-x-2 border border-purple-500/30 transition-all cursor-pointer backdrop-blur-md"
        >
          <Gamepad2 className="w-4 h-4 text-purple-400" />
          <span className="hidden sm:inline">Table Arcade</span>
        </button>

        <button
          type="button"
          onClick={() => handleOpenWinChallenge()}
          className="py-2.5 px-5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs shadow-2xl flex items-center space-x-2 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Reward Roulette</span>
        </button>
      </div>

      {/* MODALS */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        defaultRestaurantSlug={selectedScannerSlug}
      />

      <TableArcadeModal
        isOpen={isArcadeOpen}
        onClose={() => setIsArcadeOpen(false)}
        tableLabel="Diner Table"
        restaurantName="Menuz Dining Experience"
      />

      <WinChallengeModal
        isOpen={isWinChallengeOpen}
        onClose={() => setIsWinChallengeOpen(false)}
        targetRestaurant={winChallengeVenue || affiliatedVenues[0]?.rawRest}
      />
    </div>
  );
};

export default CustomerHomePage;
