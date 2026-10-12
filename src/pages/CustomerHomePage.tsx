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
  Trophy,
  Gift,
  LayoutDashboard
} from 'lucide-react';
import { useRestaurantStore, isDishNameAsRestaurant } from '../store/restaurantStore';
import { isWorkingWithMenuz, Restaurant } from '../types';
import { QrScannerModal } from '../components/QrScannerModal';
import { TableArcadeModal } from '../components/TableArcadeModal';
import { WinChallengeModal } from '../components/WinChallengeModal';
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
            ? 'Wood-fired sourdough Neapolitan pizza, hand-made pasta & artisanal tiramisu'
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
    <div className="min-h-screen bg-[#080C15] text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 1. HERO SECTION & VALUE PROPOSITION                         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative pt-10 sm:pt-16 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/[0.08] blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Live Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Autonomous Dine-In &amp; QR Table Experience</span>
          <span className="text-slate-500">•</span>
          <span className="text-[11px] text-slate-400">Zero App Download</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-3">
          <h1 className="font-serif font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.15]">
            Dine In. Scan Your Table. <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
              Order In Seconds.
            </span>
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Zero apps required. Scan your table QR code to browse authentic verified menus, add dishes together in a multiplayer cart, and order straight to the kitchen.
          </p>

          {/* Primary Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => handleOpenScanner()}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center space-x-2 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-slate-950" />
              <span>Scan Table QR Code</span>
            </button>

            {/* WIN CHALLENGE Primary Button */}
            <button
              type="button"
              onClick={() => handleOpenWinChallenge()}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-400/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 font-black text-xs sm:text-sm border-2 border-amber-500/50 hover:border-amber-400 flex items-center space-x-2 transition-all cursor-pointer shadow-xl shadow-amber-950/40 animate-pulse"
            >
              <span className="text-base">🎁</span>
              <span>Win Treats &amp; Discounts</span>
              <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-mono font-bold">WIN</span>
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
      {/* 2. WIN CHALLENGE SHOWCASE BANNER                            */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-4 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-r from-amber-950/40 via-[#131929] to-purple-950/40 border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30">
              <span>🎁 Dine-In Win Challenge</span>
            </div>
            <h3 className="font-serif font-black text-xl sm:text-2xl text-white">
              Review &amp; Unlock Instant Food Treats &amp; Discounts
            </h3>
            <p className="text-xs text-slate-300">
              Leave a quick 5-star Google review for your dining experience to play the reward challenge: Spin the Lucky Wheel, Scratch &amp; Win, or Mystery Box treats!
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleOpenWinChallenge()}
            className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
          >
            <span>Play Win Challenge Now</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 3. AFFILIATED RESTAURANTS ONLY DIRECTORY                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 w-full flex-1">
        
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
              Only authentic dining venues equipped with Menuz live QR table ordering and digital kitchens.
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
                      <span>Menuz Partner</span>
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

                {/* Multi-Action Control Buttons */}
                <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {/* 1. View Scanned Menu */}
                    <button
                      type="button"
                      onClick={() => handleLaunchTable(venue)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5 text-slate-950" />
                      <span>View Scanned Menu</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                    </button>

                    {/* 2. Win Challenge Action */}
                    <button
                      type="button"
                      onClick={() => handleOpenWinChallenge(venue)}
                      title="Play Win Challenge for this restaurant"
                      className="py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <span>🎁 Win</span>
                    </button>

                    {/* QR Scan icon */}
                    <button
                      type="button"
                      onClick={() => handleOpenScanner(venue.slug)}
                      title={`Scan Table QR for ${venue.name}`}
                      className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <QrCode className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>

                  {/* 3. Direct Link to Restaurant Operations Dashboard (Phone & Desktop) */}
                  <button
                    type="button"
                    onClick={() => navigate(`/r/${venue.slug}`)}
                    className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-[11px] font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Restaurant Partner Dashboard ({venue.name}) ↗</span>
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
      {/* 4. TABLE ARCADE & WAITING GAMES (MOVED TO BOTTOM LAST)       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6">
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
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-purple-400/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xl">
                    ✏️
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
                    Food Quiz
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                  Mini Crossword
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Quick 5x5 culinary word puzzles. Simple clues for children, gourmet ingredients for culinary masters.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-purple-400 font-semibold">
                <span>Solve Puzzle</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Game 3: Table Trivia */}
            <div
              onClick={() => setIsArcadeOpen(true)}
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-indigo-400/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xl">
                    🧠
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                    Multiplayer
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                  Table Battle Trivia
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Fast-paced buzzer trivia. Food origins, Bollywood cuisine, and spicy culinary history.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-indigo-400 font-semibold">
                <span>Start Trivia</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Game 4: Bill Roulette */}
            <div
              onClick={() => setIsArcadeOpen(true)}
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-rose-400/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center text-xl">
                    🎲
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                    Who Pays?
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-rose-300 transition-colors">
                  Bill Roulette
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
      {/* 5. SIMPLE FOOTER & PORTAL LINKS                             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <footer className="mt-12 py-10 border-t border-white/[0.06] text-center text-xs text-slate-500 space-y-4">
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

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* FLOATING ACTION BADGES                                       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      
      {/* Floating 1: Dedicated WIN Challenge Button (Right) */}
      <button
        type="button"
        onClick={() => handleOpenWinChallenge()}
        className="fixed bottom-6 right-6 z-40 py-3 px-5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs shadow-2xl flex items-center space-x-2 border-2 border-white/30 transition-all cursor-pointer animate-pulse"
        title="Open Win Challenge (Review & Win Treats)"
      >
        <span className="text-base">🎁</span>
        <span>Win Treats</span>
      </button>

      {/* Floating 2: Table Arcade Games (Left) */}
      <button
        type="button"
        onClick={() => setIsArcadeOpen(true)}
        className="fixed bottom-6 left-6 z-40 py-2.5 px-4 rounded-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:brightness-110 active:scale-95 text-white font-bold text-xs shadow-2xl flex items-center space-x-2 border border-white/20 transition-all cursor-pointer"
        title="Open Table Arcade Games"
      >
        <Gamepad2 className="w-4 h-4 text-purple-200" />
        <span className="hidden sm:inline">Play Games</span>
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

      {/* Win Challenge Modal (Google Reviews + Games) */}
      <WinChallengeModal
        isOpen={isWinChallengeOpen}
        onClose={() => setIsWinChallengeOpen(false)}
        targetRestaurant={winChallengeVenue || affiliatedVenues[0]?.rawRest}
      />
    </div>
  );
};

export default CustomerHomePage;
