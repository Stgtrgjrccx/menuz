import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  QrCode,
  Search,
  Sparkles,
  UtensilsCrossed,
  MapPin,
  Star,
  ArrowRight,
  TrendingUp,
  LayoutDashboard,
  ChefHat,
  ShieldCheck,
  Printer,
  Flame,
  CheckCircle2,
  Users,
  MessageSquareHeart,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useRestaurantStore, isDishNameAsRestaurant } from '../store/restaurantStore';
import { isWorkingWithMenuz } from '../types';
import { QrScannerModal } from '../components/QrScannerModal';

export const CustomerHomePage: React.FC = () => {
  const navigate = useNavigate();
  const rawRestaurants = useRestaurantStore((state) => state.restaurants);
  const tables = useRestaurantStore((state) => state.tables);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [selectedScannerSlug, setSelectedScannerSlug] = useState<string | undefined>(undefined);

  // Active working demo venues
  const venues = useMemo(() => {
    const valid = rawRestaurants.filter((r) => !isDishNameAsRestaurant(r) && isWorkingWithMenuz(r));
    const list = valid.length > 0 ? valid : rawRestaurants.slice(0, 2);

    return list.map((r) => {
      const isItalian = r.slug === 'casa-bella';
      const restTables = tables.filter((t) => t.restaurant_id === r.id);
      const token = restTables[0]?.public_token || (isItalian ? 'table-token-03-casa-bella' : 'table-token-01-saffron');
      const tableNumber = isItalian ? '3' : '1';

      return {
        id: r.id,
        name: r.name,
        slug: r.slug,
        cuisine: r.cuisine,
        location: r.location || 'Koregaon Park, Pune',
        rating: 4.8,
        costForTwo: isItalian ? '₹1,400 for two' : '₹1,500 for two',
        imageUrl: r.logo_url,
        reward: isItalian ? 'Free Tiramisu or 15% Off' : 'Free Potli Samosa, Kokum Cooler or 20% Off',
        specialty: isItalian ? 'Wood-Fired Neapolitan Pizza & Chianti Pairings' : 'Dum Pukht Slow-Cooked Biryanis & Copper Deg Recipes',
        aiChef: isItalian ? 'Chef Marco & Sommelier AI' : 'Head Chef Sanjeev AI Concierge',
        token,
        tableNumber,
        category: isItalian ? 'italian' : 'mughlai'
      };
    });
  }, [rawRestaurants, tables]);

  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All Demos' },
    { id: 'mughlai', label: 'Dum Pukht Indian' },
    { id: 'italian', label: 'Wood-Fired Italian' },
    { id: 'rewards', label: '🎁 Table Rewards' },
  ];

  // Filtered venues
  const filteredVenues = useMemo(() => {
    return venues.filter((v) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.cuisine.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q);

      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'rewards' && Boolean(v.reward)) ||
        v.category === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [venues, searchQuery, activeFilter]);

  const handleLaunchTable = (venue: typeof venues[0]) => {
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
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden border-b border-white/[0.06]">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-amber-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#090D16]/[0.04] border border-white/[0.1] text-amber-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Autonomous Dine-In Operating System</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Interactive Table Menus &amp; Automated Google 5-Star Reviews
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Zero app downloads. Synchronized multiplayer table carts, instant kitchen thermal KOT printing, and a review engine that multiplies Google 5-star ratings with guaranteed table rewards.
          </p>

          {/* Primary Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => handleOpenScanner()}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-slate-950" />
              <span>Scan Table QR</span>
            </button>

            <Link
              to="/r/saffron-house/menu?t=table-token-01-saffron"
              className="py-3 px-5 rounded-xl bg-[#090D16]/[0.06] hover:bg-white/[0.1] text-white font-semibold text-xs sm:text-sm border border-white/[0.12] hover:border-amber-400/40 flex items-center space-x-2 transition-all"
            >
              <UtensilsCrossed className="w-4 h-4 text-amber-400" />
              <span>Launch Table 1 (Saffron House)</span>
            </Link>
          </div>

          {/* Clean Live Ticker */}
          <div className="pt-6 max-w-3xl mx-auto">
            <div className="py-2 px-4 rounded-xl bg-[#090D16]/[0.03] border border-white/[0.06] text-xs text-slate-400 flex items-center justify-center space-x-3 overflow-x-auto whitespace-nowrap scrollbar-none">
              <span className="flex items-center space-x-1.5 text-amber-400 font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>Live At Tables:</span>
              </span>
              <span>Table 1 @ Saffron House unlocked 15% Off Total Bill</span>
              <span className="text-slate-600">•</span>
              <span>Table 3 @ Casa Bella won Complimentary Tiramisu</span>
              <span className="text-slate-600">•</span>
              <span>Table 2 rated 5★ on Google Maps</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 2. DEMO VENUES SHOWCASE (Immediate 1-Click Access)          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Search & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 pb-6 border-b border-white/[0.08]">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Interactive Table Demos
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
              Experience Menuz From the Guest's Phone
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Click any demo restaurant below to open its real-time table dining experience.
            </p>
          </div>

          {/* Search Bar + Filter Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Pune restaurants by name, area, or cuisine..."
                className="w-full py-2 pl-9 pr-8 text-xs bg-[#090D16]/[0.04] text-white placeholder:text-slate-500 rounded-lg border border-white/[0.1] focus:outline-none focus:border-amber-400/60 transition-colors"
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
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              {filterOptions.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeFilter === f.id
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredVenues.map((venue) => (
            <div
              key={venue.slug}
              className="bg-[#0E1424] border border-white/[0.08] hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group"
            >
              {/* Photo Banner */}
              <div className="relative aspect-[16/8] overflow-hidden bg-slate-900">
                <img
                  src={venue.imageUrl}
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1424] via-transparent to-black/40" />

                {/* Badges on Top */}
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{venue.rating}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                    Table {venue.tableNumber} Active
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-bold">
                    Interactive Demo
                  </span>
                </div>

                {/* Venue Details on Image */}
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
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
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {venue.specialty}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#090D16]/[0.03] border border-white/[0.06] flex items-center space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-slate-300 truncate">{venue.aiChef}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center space-x-2">
                      <span className="text-xs">🎁</span>
                      <span className="text-amber-300 font-semibold truncate">{venue.reward}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleLaunchTable(venue)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <span>Enter Table {venue.tableNumber} Menu</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenScanner(venue.slug)}
                    title={`Scan Table QR for ${venue.name}`}
                    className="p-2.5 rounded-xl bg-[#090D16]/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-amber-400" />
                  </button>

                  <Link
                    to={`/manage/${venue.slug}`}
                    title="View venue manager operations hub"
                    className="py-2.5 px-3 rounded-xl bg-[#090D16]/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1 transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden sm:inline">Hub</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 3. UNIVERSAL ACCESS HUBS (All Portals in 1 Clean Grid)      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-[#0B0F1A] border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Complete System Access
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
              Every Perspective of the Restaurant OS
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Menuz connects diners, kitchen staff, floor managers, and restaurant owners in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Diner Table Experience */}
            <div className="bg-[#0F1626] border border-white/[0.08] hover:border-amber-400/40 p-5 rounded-2xl flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-white">1. Diner Table Menu</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Zero app downloads. Diners scan the table QR sticker to browse, order, and split dishes in real-time.
                  </p>
                </div>
              </div>
              <Link
                to="/r/saffron-house/menu?t=table-token-01-saffron"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 group"
              >
                <span>Launch Table 1</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* 2. Kitchen Display System (KDS) */}
            <div className="bg-[#0F1626] border border-white/[0.08] hover:border-purple-400/40 p-5 rounded-2xl flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-white">2. Kitchen KDS</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Hardware-free digital kitchen ticket board with course pacing and direct 1-second thermal KOT printing.
                  </p>
                </div>
              </div>
              <Link
                to="/kitchen"
                className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center space-x-1 group"
              >
                <span>Open Kitchen Board</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* 3. Venue Floor Hub */}
            <div className="bg-[#0F1626] border border-white/[0.08] hover:border-emerald-400/40 p-5 rounded-2xl flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-white">3. Manager Floor Hub</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Active table sessions, live bill totals, waiter call buzzers, and private floor grievance resolution shields.
                  </p>
                </div>
              </div>
              <Link
                to="/manage/saffron-house"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 group"
              >
                <span>Open Floor Hub</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* 4. Headquarters Control */}
            <div className="bg-[#0F1626] border border-white/[0.08] hover:border-cyan-400/40 p-5 rounded-2xl flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-white">4. Master Headquarters HQ</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Centralized management across all 15 Pune restaurants, kitchen POS adapters, and catalog sync.
                  </p>
                </div>
              </div>
              <Link
                to="/admin"
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 group"
              >
                <span>Access Admin HQ</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 4. CORE ARCHITECTURE BENTO GRID                             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Engineered For High-Volume Dining
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-white">
            Why Leading Restaurateurs Switch to Menuz
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Eliminate clunky third-party apps and food commissions while building an unstoppable Google Maps review flywheel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Bento 1: Multiplayer Table Sync */}
          <div className="bg-[#0C1220] border border-white/[0.08] p-6 sm:p-8 rounded-3xl space-y-4 hover:border-white/[0.15] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-white">
                Multiplayer Real-Time Table Sync
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                When friends sit together, each guest scans the table QR on their own phone. As one person adds garlic naan and another adds butter chicken, everyone’s cart updates in real time with 0 app installs or logins.
              </p>
            </div>
            <div className="pt-2 flex items-center space-x-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center space-x-1 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero App Downloads</span>
              </span>
              <span className="flex items-center space-x-1 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Sub-50ms Supabase Sync</span>
              </span>
            </div>
          </div>

          {/* Bento 2: Chef & Owner Trained AI Concierge */}
          <div className="bg-[#0C1220] border border-white/[0.08] p-6 sm:p-8 rounded-3xl space-y-4 hover:border-white/[0.15] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-white">
                Head Chef &amp; Owner Trained AI Concierge
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Not a generic chatbot. Trained directly by Head Chef Sanjeev on secret spices, exact allergen safety, and calibrated heat levels (1-5) — and by the owner on beverage pairings. 0% hallucinations, 100% kitchen-accurate.
              </p>
            </div>
            <div className="pt-2 flex items-center space-x-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center space-x-1 text-purple-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero Hallucinations</span>
              </span>
              <span className="flex items-center space-x-1 text-purple-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Trained on Real Recipes</span>
              </span>
            </div>
          </div>

          {/* Bento 3: Decoupled Google Review Funnel */}
          <div className="bg-[#0C1220] border border-white/[0.08] p-6 sm:p-8 rounded-3xl space-y-4 hover:border-white/[0.15] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <MessageSquareHeart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-white">
                1-Click Google Reviews &amp; Lucky Reward Wheel
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Happy diners post genuine 5-star Google Maps reviews with 1 tap, automatically unlocking the animated Lucky Dining Wheel for guaranteed table treats. Unhappy diners trigger instant private alerts to the manager’s phone to resolve issues before they leave.
              </p>
            </div>
            <div className="pt-2 flex items-center space-x-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center space-x-1 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Google Maps Compliant</span>
              </span>
              <span className="flex items-center space-x-1 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Instant Floor Grievance Alert</span>
              </span>
            </div>
          </div>

          {/* Bento 4: Triple Redundant POS & Thermal KOT */}
          <div className="bg-[#0C1220] border border-white/[0.08] p-6 sm:p-8 rounded-3xl space-y-4 hover:border-white/[0.15] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-white">
                Triple-Redundant POS &amp; Thermal KOT Printing
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Never lose an order. Menuz routes tickets simultaneously to leading Indian POS systems (Petpooja, RoyalPOS, Recaho, RanceLab), local Wi-Fi tablets, and direct hardware ESC/POS thermal printers over port 9100.
              </p>
            </div>
            <div className="pt-2 flex items-center space-x-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center space-x-1 text-cyan-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Petpooja &amp; RoyalPOS</span>
              </span>
              <span className="flex items-center space-x-1 text-cyan-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Sub-100ms ESC/POS KOT</span>
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 5. CLEAN BOTTOM CTA BANNER                                  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#0B0F1A] border-t border-white/[0.08] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Transparent Pricing • Zero Commission
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-white">
            Ready to Upgrade Your Dining Room?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Menuz replaces costly paper menus with interactive digital dining, instant KOT printing, and automated reputation growth for ₹5,000 / month flat.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/admin"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>Open Master Admin HQ</span>
            </Link>

            <button
              type="button"
              onClick={() => handleOpenScanner()}
              className="py-3 px-5 rounded-xl bg-[#090D16]/[0.06] hover:bg-white/[0.1] text-white font-semibold text-xs border border-white/[0.1] transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Test Table QR Scan</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 6. CLEAN FOOTER                                             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <footer className="py-8 px-4 sm:px-6 border-t border-white/[0.06] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-white text-sm">menuz</span>
            <span>• Autonomous Dine-In Operating System</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-slate-300 transition-colors">
              Explore
            </Link>
            <Link to="/r/saffron-house/menu?t=table-token-01-saffron" className="hover:text-slate-300 transition-colors">
              Table 1 Menu
            </Link>
            <Link to="/kitchen" className="hover:text-slate-300 transition-colors">
              Kitchen KDS
            </Link>
            <Link to="/admin" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
              Admin HQ
            </Link>
          </div>
        </div>
      </footer>

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        defaultRestaurantSlug={selectedScannerSlug}
      />
    </div>
  );
};

export default CustomerHomePage;
