import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  QrCode,
  Search,
  Sparkles,
  UtensilsCrossed,
  MapPin,
  Star,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Gamepad2,
  Dice5,
  Trophy
} from 'lucide-react';
import { useRestaurantStore, isDishNameAsRestaurant } from '../store/restaurantStore';
import { isWorkingWithMenuz } from '../types';
import { QrScannerModal } from '../components/QrScannerModal';
import { TableArcadeModal } from '../components/TableArcadeModal';
import { SpinWheelModal } from '../components/SpinWheelModal';
import { getOwnerSiteUrl, getHqSiteUrl } from '../config/siteMode';

export const CustomerHomePage: React.FC = () => {
  const navigate = useNavigate();
  const rawRestaurants = useRestaurantStore((state) => state.restaurants);
  const tables = useRestaurantStore((state) => state.tables);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCuisineFilter, setActiveCuisineFilter] = useState<string>('all');
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [selectedScannerSlug, setSelectedScannerSlug] = useState<string | undefined>(undefined);
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    const handleArcade = () => setIsArcadeOpen(true);
    const handleReview = () => setIsReviewOpen(true);
    window.addEventListener('open-table-arcade', handleArcade);
    window.addEventListener('open-google-review', handleReview);
    return () => {
      window.removeEventListener('open-table-arcade', handleArcade);
      window.removeEventListener('open-google-review', handleReview);
    };
  }, []);

  // Strictly ONLY restaurants affiliated with Menuz (verified partners)
  const affiliatedVenues = useMemo(() => {
    const valid = rawRestaurants.filter(
      (r) => r && r.id && !isDishNameAsRestaurant(r) && isWorkingWithMenuz(r)
    );

    return valid.map((r) => {
      const restTables = tables.filter((t) => t.restaurant_id === r.id);
      const firstTable = restTables[0];
      const token = firstTable?.public_token || `table-token-01-${r.slug}`;
      const tableNumber = firstTable?.label?.replace(/[^0-9]/g, '') || '1';

      return {
        id: r.id,
        name: r.name,
        slug: r.slug,
        cuisine: r.cuisine || 'Fine Dining & Specialty Cuisine',
        location: r.location || 'Pune, India',
        rating: 4.8,
        costForTwo: r.slug === 'casa-bella' ? '₹1,400 for two' : '₹1,500 for two',
        imageUrl:
          r.logo_url ||
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop',
        specialty:
          r.slug === 'casa-bella'
            ? 'Artisanal 72-Hour Fermented Wood-Fired Neapolitan Pizza & Handmade Tagliatelle'
            : r.slug === 'saffron-house'
            ? 'Awadhi Dum Pukht Slow-Cooked Biryanis & Kashmiri Copper Deg Curries'
            : `${r.name} Authentic Signature Recipes & Curated Dine-In Dining`,
        token,
        tableNumber,
        category: r.cuisine?.toLowerCase().includes('italian')
          ? 'italian'
          : r.cuisine?.toLowerCase().includes('indian') || r.cuisine?.toLowerCase().includes('mughlai')
          ? 'indian'
          : 'specialty'
      };
    });
  }, [rawRestaurants, tables]);

  // Cuisine filter chips based only on affiliated venues
  const cuisineFilters = useMemo(() => {
    const list = [{ id: 'all', label: 'All Partners' }];
    const hasIndian = affiliatedVenues.some((v) => v.category === 'indian');
    const hasItalian = affiliatedVenues.some((v) => v.category === 'italian');
    if (hasIndian) list.push({ id: 'indian', label: 'Dum Pukht & Indian' });
    if (hasItalian) list.push({ id: 'italian', label: 'Artisanal Italian' });
    return list;
  }, [affiliatedVenues]);

  // Filtered affiliated venues
  const filteredVenues = useMemo(() => {
    return affiliatedVenues.filter((v) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.cuisine.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q);

      const matchesFilter =
        activeCuisineFilter === 'all' || v.category === activeCuisineFilter;

      return matchesSearch && matchesFilter;
    });
  }, [affiliatedVenues, searchQuery, activeCuisineFilter]);

  const handleLaunchTable = (venue: typeof affiliatedVenues[0]) => {
    navigate(`/r/${venue.slug}/menu?t=${venue.token}`);
  };

  const handleOpenScanner = (slug?: string) => {
    setSelectedScannerSlug(slug);
    setIsQrScannerOpen(true);
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#090D16] text-slate-100 font-sans selection:bg-amber-500/20 selection:text-amber-200">
      
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 1. HERO SECTION                                             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative pt-10 pb-12 sm:pt-16 sm:pb-20 overflow-hidden border-b border-white/[0.06]">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-amber-500/10 via-amber-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5 relative z-10">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Autonomous Table Dining &amp; Digital Menus</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Scan. Order with Friends. Relish Fine Dining.
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Zero apps required. Scan your table QR code to browse authentic verified menus, add dishes together in a multiplayer cart, and order straight to the kitchen.
          </p>

          {/* Primary Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleOpenScanner()}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm shadow-lg flex items-center space-x-2 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-slate-950" />
              <span>Scan Table QR Code</span>
            </button>

            {/* Google Review Generator Action */}
            <button
              type="button"
              onClick={() => navigate('/review')}
              className="py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-400/20 hover:from-amber-500/30 hover:to-amber-400/30 text-amber-200 font-bold text-xs sm:text-sm border border-amber-500/40 hover:border-amber-400 flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-amber-950/40"
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span>⭐ Google Review Generator (Win Treats)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsArcadeOpen(true)}
              className="py-3 px-5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-200 font-bold text-xs sm:text-sm border border-purple-500/30 hover:border-purple-400/60 flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-purple-950/40"
            >
              <Gamepad2 className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>Play Table Games (Arcade)</span>
            </button>

            {affiliatedVenues[0] && (
              <button
                type="button"
                onClick={() => handleLaunchTable(affiliatedVenues[0])}
                className="py-3 px-5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-semibold text-xs sm:text-sm border border-white/[0.12] hover:border-amber-400/40 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                <span>Browse {affiliatedVenues[0].name} Menu</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 2. TABLE ARCADE & WAITING GAMES (CUSTOMER ONLY)              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#12132a] via-[#0d1326] to-[#171630] border border-purple-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Exclusively for Table Diners</span>
              </div>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-white">
                Play Games While Waiting For Your Food
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                App-free dining games designed for your table. Play classic Klondike Solitaire, solve culinary crosswords, battle companions in multiplayer trivia, or spin the roulette wheel to decide who pays the check.
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

          {/* 4 Interactive Game Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            {/* Game 1: Solitaire */}
            <div
              onClick={() => setIsArcadeOpen(true)}
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-amber-400/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl">
                    🃏
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Kids → Adults
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                  Klondike Solitaire
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Classic patience cards. Easy (Draw 1 for kids), Medium (Draw 3), and Hard (3-pass limit challenge for adults).
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-amber-400 font-semibold">
                <span>Play Solitaire</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Game 2: Crossword */}
            <div
              onClick={() => setIsArcadeOpen(true)}
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-emerald-400/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xl">
                    ✏️
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Kids → Adults
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                  Classic Crossword
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Everyday words &amp; trivia. 5x5 junior grid for kids, 7x7 family puzzle, and 8x8 mastermind grid for adults.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
                <span>Solve Clues</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Game 3: Table Trivia */}
            <div
              onClick={() => setIsArcadeOpen(true)}
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-purple-400/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xl">
                    ⚡
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Kids → Adults
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                  Table Trivia Battle
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Multiplayer buzzer quiz. Easy cartoon &amp; animal trivia for kids, pop culture for teens, and high-IQ trivia for adults.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-purple-400 font-semibold">
                <span>Multiplayer</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Game 4: Who Pays The Bill */}
            <div
              onClick={() => setIsArcadeOpen(true)}
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-rose-400/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center text-xl">
                    🎲
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Kids → Adults
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-rose-300 transition-colors">
                  Who Pays The Bill?
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Interactive spinning wheel. Silly dares &amp; treats for kids, friendly social forfeits for teens, or real dining check for adults.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-rose-400 font-semibold">
                <span>Spin Roulette</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 2.5. GOOGLE REVIEW GENERATOR & REWARD WHEEL SHOWCASE        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-6 sm:py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1c1810] via-[#121321] to-[#1a1226] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Google 5-Star Review Generator System</span>
              </div>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-white tracking-tight">
                Turn Every Meal Into 5-Star Reviews &amp; Table Treats
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Diners generate authentic, SEO-optimized Google review drafts tailored to their favorite dishes in seconds. Copy, post on Google Maps, and unlock the lucky reward wheel for instant table treats!
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-300">
                <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1-Tap AI Drafts &amp; Tone Switcher</span>
                </span>
                <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Private Feedback Shield (&lt;4 Stars)</span>
                </span>
                <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lucky Spin Wheel Table Treats</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/review')}
                className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Star className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>Open Review Generator ↗</span>
              </button>
              <button
                type="button"
                onClick={() => setIsReviewOpen(true)}
                className="py-3 px-5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white border border-white/[0.12] font-semibold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <span>Preview Lucky Spin Modal</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 3. AFFILIATED RESTAURANTS ONLY DIRECTORY                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header with Search & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Verified Menuz Partners
              </span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
              Restaurants Affiliated with Menuz
            </h2>
            <p className="text-xs text-slate-400">
              Only authentic venues equipped with Menuz live QR table ordering and digital kitchens.
            </p>
          </div>

          {/* Search Bar + Filter Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Menuz partner restaurants..."
                className="w-full py-2 pl-9 pr-8 text-xs bg-white/[0.04] text-white placeholder:text-slate-500 rounded-lg border border-white/[0.1] focus:outline-none focus:border-amber-400/60 transition-colors"
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
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                {cuisineFilters.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveCuisineFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVenues.map((venue) => (
            <div
              key={venue.slug}
              className="bg-[#0D1424] border border-white/[0.08] hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group"
            >
              {/* Photo Banner */}
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                <img
                  src={venue.imageUrl}
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1424] via-transparent to-black/40" />

                {/* Badges on Top */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{venue.rating}</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Menuz Verified Partner</span>
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-slate-300 text-[10px] font-mono">
                    Table {venue.tableNumber}
                  </span>
                </div>

                {/* Venue Details on Image */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-serif font-bold text-xl text-white group-hover:text-amber-400 transition-colors">
                    {venue.name}
                  </h3>
                  <p className="text-xs text-slate-300 flex items-center space-x-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{venue.location}</span>
                    <span className="text-slate-500">•</span>
                    <span>{venue.costForTwo}</span>
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs text-amber-400 font-semibold">
                    {venue.cuisine}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {venue.specialty}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleLaunchTable(venue)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5 text-slate-950" />
                    <span>View Scanned Menu</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
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
              </div>
            </div>
          ))}
        </div>

        {filteredVenues.length === 0 && (
          <div className="text-center py-12 bg-white/[0.02] border border-white/[0.06] rounded-2xl space-y-3">
            <UtensilsCrossed className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Matching Affiliated Restaurants</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No Menuz partner matches your search query. Try searching for "Saffron House" or "Casa Bella".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCuisineFilter('all');
              }}
              className="text-xs text-amber-400 font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 3. SIMPLE FOOTER & PORTAL LINKS                             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <footer className="mt-16 py-10 border-t border-white/[0.06] text-center text-xs text-slate-500 space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center font-black text-slate-950 text-xs">
            M
          </div>
          <span className="font-serif font-black text-sm text-slate-300">menuz</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Autonomous Dining &amp; Multiplayer QR Ordering • Only Menuz Partner Venues
        </p>

        {/* Clear Cross-Portal Direct Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[11px]">
          <span className="text-amber-400 font-bold">🍽️ Customer Dining</span>
          <span className="text-slate-700">•</span>
          <a
            href={getOwnerSiteUrl('')}
            className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1"
          >
            <span>🏢 Restaurant Partner Hub</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
          <span className="text-slate-700">•</span>
          <a
            href={getHqSiteUrl('')}
            className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1"
          >
            <span>🛡️ Master Admin HQ</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </footer>

      {/* Floating Table Arcade Launcher (Exclusively Customer Page) */}
      <button
        type="button"
        onClick={() => setIsArcadeOpen(true)}
        className="fixed bottom-6 right-6 z-40 py-2.5 px-4 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-bold text-xs shadow-2xl flex items-center space-x-2 border border-white/20 transition-all cursor-pointer"
        title="Open Table Arcade Games"
      >
        <Gamepad2 className="w-4 h-4 text-white" />
        <span>Play Games</span>
      </button>

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        defaultRestaurantSlug={selectedScannerSlug}
      />

      {/* Table Arcade Modal (Exclusive to Customer Site) */}
      <TableArcadeModal
        isOpen={isArcadeOpen}
        onClose={() => setIsArcadeOpen(false)}
        tableLabel="Diner Table"
        restaurantName="Menuz Dining Experience"
      />

      {/* Google Review & Spin Wheel Modal */}
      {isReviewOpen && (
        <SpinWheelModal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          activeTable={
            tables[0] || {
              id: 'preview-table',
              restaurant_id: affiliatedVenues[0]?.id || 'casa-bella',
              label: 'Table 1',
              public_token: affiliatedVenues[0]?.token || 'table-preview',
              is_active: true
            } as any
          }
        />
      )}
    </div>
  );
};

export default CustomerHomePage;
