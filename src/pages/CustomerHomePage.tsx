import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  QrCode,
  Search,
  Sparkles,
  UtensilsCrossed,
  MapPin,
  Star,
  ArrowRight,
  Gift,
  Flame,
  Award,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Coffee,
  Pizza,
  Wine,
  Camera,
  HeartHandshake,
  TrendingUp,
  LayoutDashboard,
  SlidersHorizontal,
  ExternalLink,
  Plus,
  Printer,
  Wifi,
  Zap
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { isWorkingWithMenuz } from '../types';
import { PUNE_RESTAURANT_DIRECTORY, PuneRestaurantEntry, matchesPuneQuery } from '../data/puneRestaurantDirectory';
import { QrScannerModal } from '../components/QrScannerModal';

export const CustomerHomePage: React.FC = () => {
  const navigate = useNavigate();
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const addRestaurant = useRestaurantStore((state) => state.addRestaurant);
  const tables = useRestaurantStore((state) => state.tables);

  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const customerSearchRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [selectedScannerSlug, setSelectedScannerSlug] = useState<string | undefined>(undefined);

  // Click outside to close customer suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (customerSearchRef.current && !customerSearchRef.current.contains(e.target as Node)) {
        setShowCustomerSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Combine store restaurants with the full Pune directory (strictly Menuz partners)
  const directoryList = useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      slug: string;
      cuisine: string;
      location: string;
      rating: number;
      avgCostForTwo: string;
      imageUrl: string;
      isStoreActive: boolean;
      rewardHighlight: string;
      tags: string[];
    }>();

    const buildTags = (cuisine: string, location: string) => {
      const lowerCuisine = (cuisine || '').toLowerCase();
      const lowerLoc = (location || '').toLowerCase();
      const tags: string[] = ['rewards'];

      if (lowerLoc.includes('pcmc') || lowerLoc.includes('pimpri') || lowerLoc.includes('chinchwad') || lowerLoc.includes('bhosari') || lowerLoc.includes('akurdi') || lowerLoc.includes('nigdi')) tags.push('pcmc');
      if (lowerLoc.includes('koregaon')) tags.push('koregaon park');
      if (lowerLoc.includes('baner') || lowerLoc.includes('balewadi') || lowerLoc.includes('aundh')) tags.push('baner');
      if (lowerLoc.includes('hinjewadi') || lowerLoc.includes('wakad') || lowerLoc.includes('tathawade')) tags.push('hinjewadi');
      if (lowerLoc.includes('kothrud') || lowerLoc.includes('karve')) tags.push('kothrud');
      if (lowerLoc.includes('viman') || lowerLoc.includes('kharadi') || lowerLoc.includes('kalyani')) tags.push('viman nagar');
      if (lowerLoc.includes('camp')) tags.push('camp');
      if (lowerLoc.includes('hadapsar') || lowerLoc.includes('magarpatta')) tags.push('hadapsar');

      if (lowerCuisine.includes('indian') || lowerCuisine.includes('mughlai') || lowerCuisine.includes('thali') || lowerCuisine.includes('biryani') || lowerCuisine.includes('punjabi') || lowerCuisine.includes('maharashtrian')) tags.push('indian');
      if (lowerCuisine.includes('italian') || lowerCuisine.includes('pizza') || lowerCuisine.includes('pasta')) tags.push('italian');
      if (lowerCuisine.includes('asian') || lowerCuisine.includes('thai') || lowerCuisine.includes('vietnamese') || lowerCuisine.includes('momo') || lowerCuisine.includes('japanese') || lowerCuisine.includes('chinese')) tags.push('asian');
      if (lowerCuisine.includes('veg') || lowerCuisine.includes('vegetarian')) tags.push('veg');

      return tags;
    };

    // Only show restaurants working with Menuz on the customer site (the 2 demos)
    const workingRestaurants = restaurants.filter((r) => isWorkingWithMenuz(r));
    const activeWorking = workingRestaurants.length > 0 ? workingRestaurants : restaurants.slice(0, 2);

    activeWorking.forEach((r) => {
      const isItalian = r.slug === 'casa-bella';
      map.set(r.slug, {
        id: r.id,
        name: r.name,
        slug: r.slug,
        cuisine: r.cuisine,
        location: r.location || 'Koregaon Park, Pune',
        rating: 4.8,
        avgCostForTwo: isItalian ? '₹1,400' : '₹1,500',
        imageUrl: r.logo_url,
        isStoreActive: true,
        rewardHighlight: isItalian ? 'Free Tiramisu or 15% Off' : 'Free Potli Samosa, Kokum Cooler or 20% Off',
        tags: buildTags(r.cuisine, r.location || '')
      });
    });

    return Array.from(map.values());
  }, [restaurants]);

  const customerSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return directoryList
      .filter((r) => {
        return (
          (r.name || '').toLowerCase().includes(q) ||
          (r.cuisine || '').toLowerCase().includes(q) ||
          (r.location || '').toLowerCase().includes(q) ||
          (r.tags || []).some((t) => (t || '').toLowerCase().includes(q))
        );
      })
      .slice(0, 8);
  }, [directoryList, searchQuery]);

  // Filter chips options for active Menuz demo dining
  const filterOptions = [
    { id: 'all', label: 'All Demos' },
    { id: 'rewards', label: '🎁 Table Rewards' },
    { id: 'koregaon park', label: 'Koregaon Park' },
    { id: 'indian', label: 'Indian (Saffron House)' },
    { id: 'italian', label: 'Italian (Casa Bella)' },
  ];

  // Filtered restaurants
  const filteredList = useMemo(() => {
    return directoryList.filter((item) => {
      const matchesSearch = matchesPuneQuery(item, searchQuery);
      const matchesFilter =
        activeFilter === 'all' || (item.tags || []).includes(activeFilter.toLowerCase());

      return matchesSearch && matchesFilter;
    });
  }, [directoryList, searchQuery, activeFilter]);

  // Open digital menu for restaurant
  const handleOpenRestaurantMenu = (item: typeof directoryList[0]) => {
    const existing = restaurants.find((r) => r.slug === item.slug);
    const restTables = tables.filter((t) => t.restaurant_id === existing?.id || t.id.includes(item.slug));
    const token = restTables[0]?.public_token || `token-${item.slug}-01`;
    navigate(`/r/${item.slug}/menu?t=${token}`);
  };

  const handleOpenScannerForRestaurant = (slug?: string) => {
    setSelectedScannerSlug(slug);
    setIsQrScannerOpen(true);
  };

  return (
    <div className="min-h-screen bg-ivory-50 text-charcoal-900 flex flex-col font-sans">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 1. CUSTOMER TOP NAVIGATION BAR                             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-charcoal-900/95 backdrop-blur-md border-b border-charcoal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">
          {/* Logo & City Selector */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-saffron-600 to-amber-400 flex items-center justify-center font-bold text-white shadow-md text-base">
                M
              </span>
              <div className="flex flex-col">
                <span className="font-serif font-black text-lg tracking-wide text-white group-hover:text-saffron-400 transition-colors">
                  menuz
                </span>
                <span className="text-[9px] uppercase tracking-widest text-saffron-400 font-bold -mt-1">
                  Table Dining Network
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-1 bg-charcoal-800 border border-charcoal-700 rounded-full px-2.5 py-1 text-xs text-charcoal-300">
              <MapPin className="w-3 h-3 text-saffron-400" />
              <span className="font-semibold text-white">Pune</span>
              <span className="text-[10px] text-charcoal-400">• Live Demos</span>
            </div>

            {/* Quick Demo Restaurant Selector (Strictly restaurants working with Menuz) */}
            <div className="flex items-center space-x-1.5 bg-charcoal-800 border border-charcoal-700 hover:border-saffron-500/50 rounded-xl px-2.5 py-1 transition-colors">
              <UtensilsCrossed className="w-3.5 h-3.5 text-saffron-400 flex-shrink-0" />
              <select
                onChange={(e) => {
                  const targetSlug = e.target.value;
                  if (!targetSlug) return;
                  const item = directoryList.find((d) => d.slug === targetSlug);
                  if (item) handleOpenRestaurantMenu(item);
                }}
                defaultValue=""
                className="bg-transparent text-saffron-300 hover:text-white text-xs font-semibold focus:outline-none cursor-pointer max-w-[150px] sm:max-w-[210px] truncate"
                title="Select Demo Restaurant"
              >
                <option value="" disabled className="bg-charcoal-900 text-charcoal-400">
                  Select Demo Restaurant...
                </option>
                {directoryList.map((item) => (
                  <option key={item.slug} value={item.slug} className="bg-charcoal-900 text-white">
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center space-x-2.5">
            {/* Scan Table QR Button */}
            <button
              type="button"
              onClick={() => handleOpenScannerForRestaurant()}
              className="py-2 px-3.5 sm:px-4 rounded-xl bg-gradient-to-r from-saffron-600 via-amber-500 to-saffron-700 hover:brightness-110 active:scale-95 text-white font-serif text-xs font-bold shadow-float flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-amber-200" />
              <span>Scan Table QR</span>
            </button>

            {/* Active Venue Hub */}
            <Link
              to={`/manage/${restaurant?.slug || 'saffron-house'}`}
              className="hidden sm:flex items-center space-x-1.5 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-white text-xs font-bold border border-amber-500/40 transition-all active:scale-95 shadow-xs"
              title={`Open Active Venue Hub for ${restaurant?.name || 'Saffron House'}`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
              <span>Active Venue Hub</span>
            </Link>

            {/* Pitch Deck */}
            <Link
              to="/pitch"
              className="flex items-center space-x-1.5 py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-white text-xs font-bold border border-cyan-500/40 transition-all active:scale-95 shadow-xs"
            >
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Pitch Deck</span>
            </Link>

            {/* Restaurant Admin / Staff portal link */}
            <Link
              to="/admin"
              className="hidden md:flex items-center space-x-1.5 py-2 px-3 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-200 hover:text-white text-xs font-bold border border-charcoal-700 transition-all active:scale-95 shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-saffron-400" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 2. LIVE DINING REWARDS TICKER                              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-amber-500 via-saffron-600 to-amber-600 text-white text-[11px] sm:text-xs py-2 px-4 font-semibold shadow-sm overflow-hidden flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
            <span className="bg-charcoal-900/30 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
              <Flame className="w-3 h-3 text-amber-200" />
              <span>Live At Tables</span>
            </span>
            <span>Table 1 @ Saffron House won 15% Off Total Bill!</span>
            <span className="opacity-50">•</span>
            <span>Table 3 @ Casa Bella unlocked Complimentary Tiramisu!</span>
            <span className="opacity-50">•</span>
            <span>Table 2 @ Saffron House rated 5★ on Google Maps!</span>
          </div>

          <button
            onClick={() => handleOpenScannerForRestaurant('saffron-house')}
            className="hidden lg:flex items-center space-x-1 text-white hover:underline text-[11px] ml-4 flex-shrink-0 cursor-pointer"
          >
            <span>Test a Table Now</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 3. HERO SECTION WITH DIRECT SCAN & SEARCH                  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-ivory-100 via-ivory-50 to-ivory-50 border-b border-ivory-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-saffron-100/80 border border-saffron-300 text-saffron-800 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
            <span>Interactive Table Menus &amp; Instant Google Review Rewards</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-charcoal-900 tracking-tight leading-tight max-w-3xl mx-auto">
            Scan Your Table QR or Explore Live Menuz Demos
          </h1>

          <p className="text-sm sm:text-base text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
            Seated at a restaurant? Scan the QR sticker on your table to browse chef menus, order food, and post a quick Google review to spin the <strong>Lucky Dining Wheel</strong> for guaranteed free treats and discounts!
          </p>

          {/* ── Prominent Executive Pitch Deck Action Bar ── */}
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-charcoal-900 via-charcoal-800 to-charcoal-900 text-white rounded-2xl p-4 sm:p-5 border border-charcoal-700 shadow-float flex flex-col md:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-saffron-500/20 border border-saffron-500/40 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-saffron-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-serif font-bold text-sm sm:text-base text-white">Menuz Executive Pitch Deck</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-saffron-500 text-slate-950">19 Slides</span>
                </div>
                <p className="text-xs text-charcoal-300 mt-0.5">
                  The Complete Dine-In Operating System &amp; Growth Engine (15-Restaurant Boardroom Approved)
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
              <Link
                to="/pitch"
                className="px-3.5 py-2 bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center space-x-1.5 active:scale-95"
              >
                <span>Interactive Deck</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href="./menuz_executive_pitch_deck.pptx"
                download="Menuz_Executive_Pitch_Deck.pptx"
                className="px-3 py-2 bg-charcoal-800 hover:bg-charcoal-700 text-amber-300 hover:text-white font-semibold text-xs rounded-xl border border-charcoal-600 transition-colors flex items-center space-x-1.5"
                title="Download 16:9 PowerPoint Presentation"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>PPTX</span>
              </a>

              <a
                href="./menuz_executive_pitch_deck.pdf"
                download="Menuz_Executive_Pitch_Deck.pdf"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-200 hover:text-white font-semibold text-xs rounded-xl border border-charcoal-600 transition-colors flex items-center space-x-1.5"
                title="Download Executive Pitch Deck PDF"
              >
                <span>PDF</span>
              </a>
            </div>
          </div>

          {/* Dual Action: Search Bar & Scan Button */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="bg-white p-2 rounded-2xl sm:rounded-3xl shadow-float border border-charcoal-200/80 flex flex-col sm:flex-row items-center gap-2">
              {/* Search input with live autocomplete suggestions */}
              <div className="relative flex-1 w-full" ref={customerSearchRef}>
                <Search className="w-5 h-5 text-charcoal-400 absolute left-3.5 top-3.5 z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setShowCustomerSuggestions(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowCustomerSuggestions(true);
                  }}
                  placeholder="Search demo restaurants (Saffron House, Casa Bella Trattoria)..."
                  className="w-full py-3 pl-11 pr-10 text-xs sm:text-sm text-charcoal-900 placeholder:text-charcoal-400 bg-transparent focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowCustomerSuggestions(false);
                    }}
                    className="absolute right-3 top-3 text-xs text-charcoal-400 hover:text-charcoal-600 font-bold z-10 cursor-pointer"
                  >
                    Clear
                  </button>
                )}

                {/* Autocomplete Suggestions Popup */}
                {showCustomerSuggestions && searchQuery.trim().length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-float border border-charcoal-200 overflow-hidden z-50 text-left animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="p-2.5 bg-ivory-100/80 border-b border-ivory-200 flex items-center justify-between text-[11px] text-charcoal-500 font-bold">
                      <span className="flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-saffron-600 inline" />
                        <span>SUGGESTIONS ({customerSuggestions.length} found)</span>
                      </span>
                      <span className="text-[10px] text-charcoal-400 font-normal">Click to launch menu</span>
                    </div>

                    {customerSuggestions.length > 0 ? (
                      <div className="max-h-72 overflow-y-auto divide-y divide-ivory-100">
                        {customerSuggestions.map((item) => {
                          const rTables = tables.filter((t) => t.restaurant_id === item.id);
                          const rToken = rTables[0]?.public_token || 'table-token-01';
                          return (
                            <div
                              key={`cust-sugg-${item.id}`}
                              onClick={() => {
                                setSearchQuery(item.name);
                                setShowCustomerSuggestions(false);
                                navigate(`/r/${item.slug}/menu?t=${rToken}`);
                              }}
                              className="p-3 hover:bg-saffron-50/70 cursor-pointer flex items-center justify-between gap-3 transition-colors group"
                            >
                              <div className="flex items-center space-x-3 min-w-0">
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-xl object-cover border border-ivory-300 flex-shrink-0 group-hover:scale-105 transition-transform"
                                />
                                <div className="truncate">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="text-xs font-bold text-charcoal-900 group-hover:text-saffron-700 transition-colors truncate">
                                      {item.name}
                                    </h4>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                                      Interactive Demo
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-charcoal-500 truncate mt-0.5">
                                    {item.cuisine} • <span className="text-charcoal-700">{item.location}</span>
                                  </p>
                                </div>
                              </div>

                              <Link
                                to={`/r/${item.slug}/menu?t=${rToken}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowCustomerSuggestions(false);
                                }}
                                className="px-3 py-1.5 bg-gradient-to-r from-saffron-600 to-amber-500 hover:from-saffron-700 hover:to-amber-600 text-white text-[10px] font-bold rounded-xl transition-all flex items-center space-x-1 flex-shrink-0 shadow-xs"
                              >
                                <span>Menu</span>
                                <ChevronRight className="w-3 h-3" />
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-xs text-charcoal-600">
                          No demo restaurant matches <strong>"{searchQuery}"</strong>.
                        </p>
                        <p className="text-[11px] text-charcoal-400 mt-1">
                          Try searching for Saffron House or Casa Bella Trattoria.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Direct Scan QR Button */}
              <button
                type="button"
                onClick={() => handleOpenScannerForRestaurant()}
                className="w-full sm:w-auto py-3 px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-saffron-600 via-amber-500 to-saffron-700 hover:brightness-105 active:scale-95 text-white font-serif text-xs sm:text-sm font-bold shadow-float flex items-center justify-center space-x-2 transition-all flex-shrink-0 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-amber-200" />
                <span>Scan Table QR</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`py-1.5 px-3.5 rounded-full text-xs font-semibold transition-all ${
                  activeFilter === filter.id
                    ? 'bg-charcoal-900 text-white shadow-sm'
                    : 'bg-white hover:bg-ivory-100 text-charcoal-700 border border-ivory-300'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 4. HOW MENUZ WORKS: 3-STEP INTERACTIVE GUIDE               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-10 bg-white border-b border-ivory-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-saffron-700 font-bold">
              Effortless Dining Experience
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-charcoal-900 mt-1">
              How Menuz Elevates Your Table Experience
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="bg-ivory-50/70 border border-ivory-200 rounded-3xl p-5 sm:p-6 text-left relative overflow-hidden group hover:border-saffron-400 transition-all hover:shadow-subtle">
              <div className="w-12 h-12 rounded-2xl bg-saffron-100 text-saffron-700 flex items-center justify-center text-xl font-serif font-black mb-4">
                1
              </div>
              <h3 className="font-serif font-bold text-base text-charcoal-900 mb-1.5">
                Scan Your Table QR
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                No apps or downloads required. Point your phone camera at the QR code on your table to instantly load the digital menu for your exact table.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-ivory-50/70 border border-ivory-200 rounded-3xl p-5 sm:p-6 text-left relative overflow-hidden group hover:border-amber-400 transition-all hover:shadow-subtle">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-serif font-black mb-4">
                2
              </div>
              <div className="flex items-center space-x-1.5 mb-1.5">
                <h3 className="font-serif font-bold text-base text-charcoal-900">
                  Chef &amp; Owner Trained AI Assistant
                </h3>
              </div>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Trained directly by the Head Chef on secret recipes, true spice meters (1-5), and allergens — and by the Owner on signature beverage and bread pairings.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-ivory-50/70 border border-ivory-200 rounded-3xl p-5 sm:p-6 text-left relative overflow-hidden group hover:border-emerald-400 transition-all hover:shadow-subtle">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-serif font-black mb-4">
                3
              </div>
              <h3 className="font-serif font-bold text-base text-charcoal-900 mb-1.5">
                Post Review &amp; Spin the Wheel
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Share your meal rating on Google Reviews with 1 tap. Unlock the <strong>Lucky Dining Wheel</strong> to win free desserts, drinks, or up to 20% off your bill!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 4.5 CHEF & OWNER TRAINED AI CONCIERGE                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-gradient-to-b from-charcoal-950 via-[#0d121c] to-charcoal-950 text-white border-b border-charcoal-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-7/12 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full text-amber-300 text-xs font-bold tracking-wide">
                <span>🧑‍🍳 IN-TABLE AI DINING CONCIERGE</span>
                <span>•</span>
                <span>CHEF &amp; OWNER TRAINED</span>
              </div>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                Not Generic AI. Trained by the <span className="text-amber-400">Head Chef &amp; Owner</span>.
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-300 leading-relaxed">
                Most digital menus are static PDFs. Menuz equips every table with a personalized dining concierge trained on secret kitchen recipes, real-time calibrated spice levels (1-5), allergen safety, and the owner's signature beverage pairings. Zero hallucinations, 100% kitchen-accurate.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-charcoal-900/80 border border-charcoal-800 p-3.5 rounded-2xl flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-sm">
                    🧑‍🍳
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Chef Sanjeev's Knowledge</h4>
                    <p className="text-[11px] text-charcoal-400 mt-0.5">True spice heat, 18-hr slow cook methods, and exact cross-contamination protocols.</p>
                  </div>
                </div>

                <div className="bg-charcoal-900/80 border border-charcoal-800 p-3.5 rounded-2xl flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 text-sm">
                    🍷
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Owner Rohit's Pairings</h4>
                    <p className="text-[11px] text-charcoal-400 mt-0.5">Handpicked wines, kokum coolers, garlic tandoor breads, and feast portions for groups.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/r/saffron-house/menu?t=table-token-01-saffron"
                  className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-saffron-600 hover:brightness-110 text-charcoal-950 font-bold text-xs shadow-float transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Try Chef's AI Assistant at Table 1</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Visual Chat Preview Card */}
            <div className="lg:w-5/12 w-full">
              <div className="bg-[#121824] border border-amber-500/30 rounded-3xl p-5 shadow-2xl space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-saffron-600 flex items-center justify-center text-white text-xs">
                      🧑‍🍳
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Ask Chef's AI Concierge</h4>
                      <span className="text-[10px] text-amber-400 font-mono">0% Hallucinations • Table 1</span>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                    Live At Table
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-amber-500/20 border border-amber-500/30 p-2.5 rounded-2xl rounded-tr-sm text-amber-200 text-[11px] ml-auto max-w-[85%]">
                    "Is the Butter Chicken spicy? We have kids with us."
                  </div>
                  <div className="bg-charcoal-900 border border-charcoal-800 p-2.5 rounded-2xl rounded-tl-sm text-charcoal-200 text-[11px] space-y-1.5 max-w-[90%]">
                    <p>
                      <strong>Chef Sanjeev:</strong> "Old Delhi Butter Chicken is calibrated at Spice 1/5 (very mild). Made with cashew cream &amp; sun-dried fenugreek with zero raw green chilies. 100% kid-friendly!"
                    </p>
                    <div className="bg-charcoal-950 p-2 rounded-xl flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white">Old Delhi Butter Chicken (₹480)</span>
                      <span className="text-[9px] bg-amber-500 text-charcoal-950 px-2 py-0.5 rounded font-bold">+ Add</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 5. RESTAURANTS DIRECTORY & INTERACTIVE CARDS               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 gap-3 border-b border-ivory-200 mb-8">
          <div>
            <h2 className="font-serif font-bold text-2xl text-charcoal-900">
              Interactive Demo Restaurants
            </h2>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Experience live digital table menus, ordering, and instant Google Review rewards with our two flagship demo venues.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleOpenScannerForRestaurant()}
              className="py-2 px-3.5 rounded-xl bg-ivory-100 hover:bg-saffron-50 border border-ivory-300 text-charcoal-800 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-saffron-600" />
              <span>Scan Table QR</span>
            </button>
          </div>
        </div>

        {/* Restaurants Grid */}
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-ivory-200 p-8 sm:p-12 text-center text-charcoal-400 max-w-lg mx-auto my-8 shadow-subtle">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-lg text-charcoal-900">
              No demo matches "{searchQuery}"
            </h3>
            <p className="text-xs text-charcoal-600 mt-2 mb-6 leading-relaxed">
              Menuz is currently showcasing our two live demo experiences (Saffron House &amp; Casa Bella Trattoria). Point your camera at your table's QR code or choose a demo below.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="w-full sm:w-auto py-2.5 px-5 rounded-2xl bg-charcoal-900 text-white text-xs font-semibold hover:bg-charcoal-800 transition-colors cursor-pointer"
              >
                View All Demos
              </button>
              <button
                type="button"
                onClick={() => handleOpenScannerForRestaurant()}
                className="w-full sm:w-auto py-2.5 px-5 rounded-2xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan Table QR</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((item) => (
              <div
                key={item.slug}
                className="bg-white rounded-3xl border border-ivory-200/90 overflow-hidden shadow-subtle hover:shadow-float transition-all hover:-translate-y-1 flex flex-col group"
              >
                {/* Image Cover */}
                <div className="relative aspect-[16/10] overflow-hidden bg-charcoal-900">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Rating Badge */}
                  <div className="absolute top-3 left-3 bg-charcoal-950/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 border border-white/20">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.rating}</span>
                  </div>

                  {/* Guaranteed Table Reward Pill */}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-saffron-600 text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center space-x-1 shadow-md">
                    <Sparkles className="w-3 h-3 text-amber-200" />
                    <span>Interactive Demo</span>
                  </div>

                  {/* Bottom Image Overlay with Location */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/70 to-transparent p-3 pt-6 text-white flex items-center justify-between text-xs">
                    <span className="flex items-center text-charcoal-200 font-medium">
                      <MapPin className="w-3 h-3 text-saffron-400 mr-1" />
                      {item.location.split(',')[0]}
                    </span>
                    <span className="text-amber-200 font-bold">{item.avgCostForTwo} for two</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-charcoal-900 group-hover:text-saffron-700 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-charcoal-500 mt-1 line-clamp-1">{item.cuisine}</p>

                    {/* Table Reward Highlight Banner */}
                    <div className="mt-3 bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 flex items-center space-x-2 text-[11px] text-amber-900">
                      <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span className="font-medium line-clamp-1">
                        <strong>Reward:</strong> {item.rewardHighlight}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-ivory-200 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenRestaurantMenu(item)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-charcoal-900 hover:bg-black active:scale-95 text-white font-serif text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <span>Explore Menu &amp; Rewards</span>
                      <ArrowRight className="w-3.5 h-3.5 text-saffron-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenScannerForRestaurant(item.slug)}
                      title={`Scan Table QR for ${item.name}`}
                      className="p-2.5 rounded-xl border border-saffron-300 hover:border-saffron-400 bg-saffron-50 hover:bg-saffron-100 text-saffron-800 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-xs"
                    >
                      <QrCode className="w-4 h-4 text-saffron-700" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 5.5 UNIVERSAL POS & KOT INTEGRATION ECOSYSTEM               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="bg-charcoal-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-t border-charcoal-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block">
              Universal Restaurant POS &amp; KOT Ecosystem
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
              Take All 3 Connections Available: Setup Can Be Done Any How
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-300 leading-relaxed">
              Don't choose just one channel — <strong>take all 3 connections simultaneously</strong> for zero-downtime triple redundancy! Cloud POS API (Petpooja, Recaho, RanceLab) + Local Wi-Fi Tablet (RoyalPOS / Android / Windows) + Direct Hardware ESC/POS Printer (Port 9100). Setup can be done any how in under 2 minutes without developer help.
            </p>
          </div>

          {/* 5 Supported POS Adapters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-charcoal-900 border border-charcoal-800 p-4 rounded-2xl space-y-2 hover:border-orange-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Petpooja</span>
                <span className="text-[8px] uppercase font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300">50k+ Outlets</span>
              </div>
              <p className="text-[11px] text-charcoal-400">National &amp; Pune #1. Two-way REST API order push &amp; 86 item inventory sync.</p>
              <div className="text-[9px] font-mono text-orange-400/80">⚡ Cloud REST API</div>
            </div>

            <div className="bg-charcoal-900 border border-charcoal-800 p-4 rounded-2xl space-y-2 hover:border-purple-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">RoyalPOS</span>
                <span className="text-[8px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">Pune Local</span>
              </div>
              <p className="text-[11px] text-charcoal-400">FC Road, Hinjewadi &amp; QSR favorite. High-speed local LAN Wi-Fi KOT bridge.</p>
              <div className="text-[9px] font-mono text-purple-400/80">📶 LAN HTTP Bridge</div>
            </div>

            <div className="bg-charcoal-900 border border-charcoal-800 p-4 rounded-2xl space-y-2 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Recaho</span>
                <span className="text-[8px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">PCMC Hub</span>
              </div>
              <p className="text-[11px] text-charcoal-400">Budget, family dining &amp; highway eateries across PCMC, Chakan &amp; Hadapsar.</p>
              <div className="text-[9px] font-mono text-blue-400/80">☁️ Cloud GST API</div>
            </div>

            <div className="bg-charcoal-900 border border-charcoal-800 p-4 rounded-2xl space-y-2 hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">RanceLab</span>
                <span className="text-[8px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">FusionResto</span>
              </div>
              <p className="text-[11px] text-charcoal-400">Enterprise multi-outlet chains, bakeries &amp; fine dining format KOT management.</p>
              <div className="text-[9px] font-mono text-emerald-400/80">🏢 Enterprise ERP</div>
            </div>

            <div className="bg-charcoal-900 border border-charcoal-800 p-4 rounded-2xl space-y-2 hover:border-amber-500/50 transition-colors col-span-2 md:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Direct ESC/POS</span>
                <span className="text-[8px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Universal</span>
              </div>
              <p className="text-[11px] text-charcoal-400">Direct Wi-Fi / LAN thermal printing (Epson, TVS, Rugtek) — zero POS API needed.</p>
              <div className="text-[9px] font-mono text-amber-400/80">🖨️ TCP Port 9100</div>
            </div>
          </div>

          {/* 3-Step Flow Diagram */}
          <div className="bg-charcoal-900/60 border border-charcoal-800/80 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Printer className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">How The KOT Printing Pipeline Works</h4>
                <p className="text-[11px] text-charcoal-400">Diner submits order on phone → Menuz formats ESC/POS ticket in &lt;100ms → Kitchen printer beeps &amp; prints.</p>
              </div>
            </div>

            <Link
              to="/pitch"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold text-xs rounded-xl transition-all shrink-0 flex items-center gap-1.5"
            >
              <span>See Thermal Simulator In Pitch Deck</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 6. ADMIN JUMP BANNER                                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="bg-charcoal-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-charcoal-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-saffron-400 font-bold">
            Hospitality &amp; Restaurant System
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            Transform Your Dining Room into a 5-Star Review Machine
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-300 max-w-xl mx-auto leading-relaxed">
            Menuz replaces clunky paper menus with interactive ordering, instant floor alerts for unhappy diners, and review-gated rewards that multiply positive Google reviews automatically.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/pitch"
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-saffron-600 to-amber-700 hover:brightness-110 text-white font-serif text-xs font-bold shadow-float flex items-center space-x-2 transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-amber-200" />
              <span>Restaurant Pitch & ROI Calculator ↗</span>
            </Link>

            <Link
              to="/admin"
              className="py-3 px-6 rounded-2xl bg-charcoal-800 hover:bg-charcoal-700 text-white font-serif text-xs font-bold border border-charcoal-700 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-saffron-400" />
              <span>Launch Master Admin ↗</span>
            </Link>

            <button
              type="button"
              onClick={() => handleOpenScannerForRestaurant()}
              className="py-3 px-5 rounded-2xl bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-200 border border-charcoal-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-saffron-400" />
              <span>Try QR Table Experience</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 7. FOOTER                                                  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <footer className="bg-charcoal-950 text-charcoal-400 text-xs py-6 px-4 border-t border-charcoal-800/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-black text-white text-sm">menuz</span>
            <span>• Pune Table Dining &amp; Review Network (Demo)</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <Link to="/" className="hover:text-white transition-colors">
              Demos
            </Link>
            <Link to="/pitch" className="text-amber-400 font-bold hover:underline">
              Owner Pitch &amp; ROI
            </Link>
            <button
              onClick={() => handleOpenScannerForRestaurant()}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Table Scanner
            </button>
            <Link to="/admin" className="text-saffron-400 hover:underline">
              Admin Hub
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
