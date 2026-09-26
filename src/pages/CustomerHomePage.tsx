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
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { PUNE_RESTAURANT_DIRECTORY, PuneRestaurantEntry } from '../data/puneRestaurantDirectory';
import { QrScannerModal } from '../components/QrScannerModal';

export const CustomerHomePage: React.FC = () => {
  const navigate = useNavigate();
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const addRestaurant = useRestaurantStore((state) => state.addRestaurant);
  const tables = useRestaurantStore((state) => state.tables);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [selectedScannerSlug, setSelectedScannerSlug] = useState<string | undefined>(undefined);

  // Combine store restaurants with the full Pune directory
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

    // 1. Existing registered restaurants
    restaurants.forEach((r) => {
      const isItalian = r.slug === 'casa-bella';
      map.set(r.slug, {
        id: r.id,
        name: r.name,
        slug: r.slug,
        cuisine: r.cuisine,
        location: r.location || (isItalian ? 'Koregaon Park, Pune' : 'Koregaon Park, Pune'),
        rating: 4.8,
        avgCostForTwo: isItalian ? '₹1,400' : '₹1,500',
        imageUrl: r.logo_url,
        isStoreActive: true,
        rewardHighlight: isItalian ? 'Free Tiramisu or 15% Off' : 'Free Potli Samosa, Kokum Cooler or 20% Off',
        tags: isItalian
          ? ['rewards', 'koregaon park', 'italian', 'pizza', 'pasta']
          : ['rewards', 'koregaon park', 'indian', 'curries', 'tandoori']
      });
    });

    // 2. Curated Pune directory entries
    PUNE_RESTAURANT_DIRECTORY.forEach((p) => {
      const slug = p.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      if (!map.has(slug)) {
        const lowerCuisine = p.cuisine.toLowerCase();
        const lowerLoc = p.location.toLowerCase();
        const tags: string[] = ['rewards'];

        if (lowerLoc.includes('koregaon')) tags.push('koregaon park');
        if (lowerLoc.includes('baner')) tags.push('baner');
        if (lowerLoc.includes('shivaji') || lowerLoc.includes('sb road')) tags.push('shivajinagar');
        if (lowerLoc.includes('kalyani')) tags.push('kalyani nagar');

        if (lowerCuisine.includes('indian') || lowerCuisine.includes('mughlai') || lowerCuisine.includes('thali')) tags.push('indian');
        if (lowerCuisine.includes('italian') || lowerCuisine.includes('pizza') || lowerCuisine.includes('pasta')) tags.push('italian');
        if (lowerCuisine.includes('asian') || lowerCuisine.includes('thai') || lowerCuisine.includes('vietnamese') || lowerCuisine.includes('momo')) tags.push('asian');
        if (lowerCuisine.includes('veg')) tags.push('veg');

        map.set(slug, {
          id: `rest-${slug}`,
          name: p.name,
          slug: slug,
          cuisine: p.cuisine,
          location: p.location,
          rating: p.rating,
          avgCostForTwo: p.avgCostForTwo,
          imageUrl: p.imageUrl,
          isStoreActive: false,
          rewardHighlight: 'Guaranteed Chef Treat & Wheel Spin',
          tags
        });
      }
    });

    return Array.from(map.values());
  }, [restaurants]);

  // Filter chips options
  const filterOptions = [
    { id: 'all', label: 'All Restaurants (50+)' },
    { id: 'rewards', label: '🎁 Guaranteed Table Rewards' },
    { id: 'koregaon park', label: 'Koregaon Park' },
    { id: 'baner', label: 'Baner & Aundh' },
    { id: 'indian', label: 'Contemporary Indian' },
    { id: 'italian', label: 'Italian & Woodfired' },
    { id: 'asian', label: 'Pan-Asian & Thai' },
    { id: 'veg', label: 'Pure Veg Special' },
  ];

  // Filtered restaurants
  const filteredList = useMemo(() => {
    return directoryList.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        activeFilter === 'all' || item.tags.includes(activeFilter.toLowerCase());

      return matchesSearch && matchesFilter;
    });
  }, [directoryList, searchQuery, activeFilter]);

  // Open digital menu for restaurant
  const handleOpenRestaurantMenu = (item: typeof directoryList[0]) => {
    // If not in store, add it
    const existing = restaurants.find((r) => r.slug === item.slug);
    if (!existing) {
      addRestaurant({
        id: `rest-${item.slug}`,
        slug: item.slug,
        name: item.name,
        cuisine: item.cuisine,
        location: item.location,
        logo_url: item.imageUrl,
        brand_colors: {
          primary: '#E85D04',
          background: '#FDFBF7',
          text: '#1C1917',
          accent: '#C84B00'
        },
        currency: 'INR',
        tax_rate_percent: 5.0,
        google_place_url: `https://search.google.com/local/writereview?placeid=${item.slug}`
      });
    }

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

            <div className="hidden sm:flex items-center space-x-1 bg-charcoal-800 border border-charcoal-700 rounded-full px-2.5 py-1 text-xs text-charcoal-300">
              <MapPin className="w-3 h-3 text-saffron-400" />
              <span className="font-semibold text-white">Pune</span>
              <span className="text-[10px] text-charcoal-400">• 50+ Tables Live</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center space-x-2.5">
            {/* Scan Table QR Button */}
            <button
              type="button"
              onClick={() => handleOpenScannerForRestaurant()}
              className="py-2 px-3.5 sm:px-4 rounded-xl bg-gradient-to-r from-saffron-600 via-amber-500 to-saffron-700 hover:brightness-110 active:scale-95 text-white font-serif text-xs font-bold shadow-float flex items-center space-x-1.5 transition-all"
            >
              <QrCode className="w-4 h-4 text-amber-200" />
              <span>Scan Table QR</span>
            </button>

            {/* Restaurant Partner / Staff portal link */}
            <Link
              to="/admin"
              className="hidden md:flex items-center space-x-1.5 py-2 px-3 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 hover:text-white text-xs font-semibold border border-charcoal-700 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-saffron-400" />
              <span>Partner Portal</span>
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
            <span>Table 4 @ Malaka Spice rated 5★ on Google Maps!</span>
          </div>

          <button
            onClick={() => handleOpenScannerForRestaurant('saffron-house')}
            className="hidden lg:flex items-center space-x-1 text-white hover:underline text-[11px] ml-4 flex-shrink-0"
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
            Scan Your Table QR or Discover Pune’s Finest Dining
          </h1>

          <p className="text-sm sm:text-base text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
            Seated at a restaurant? Scan the QR sticker on your table to browse chef menus, order food, and post a quick Google review to spin the <strong>Lucky Dining Wheel</strong> for guaranteed free treats and discounts!
          </p>

          {/* Dual Action: Search Bar & Scan Button */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="bg-white p-2 rounded-2xl sm:rounded-3xl shadow-float border border-charcoal-200/80 flex flex-col sm:flex-row items-center gap-2">
              {/* Search input */}
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 text-charcoal-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restaurants (e.g. Saffron House, Casa Bella, Malaka Spice)..."
                  className="w-full py-3 pl-11 pr-4 text-xs sm:text-sm text-charcoal-900 placeholder:text-charcoal-400 bg-transparent focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-xs text-charcoal-400 hover:text-charcoal-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Direct Scan QR Button */}
              <button
                type="button"
                onClick={() => handleOpenScannerForRestaurant()}
                className="w-full sm:w-auto py-3 px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-saffron-600 via-amber-500 to-saffron-700 hover:brightness-105 active:scale-95 text-white font-serif text-xs sm:text-sm font-bold shadow-float flex items-center justify-center space-x-2 transition-all flex-shrink-0"
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
              <h3 className="font-serif font-bold text-base text-charcoal-900 mb-1.5">
                Browse &amp; Order Seamlessly
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Enjoy authentic high-res food photos, dietary labels, chef highlights, and an AI dining concierge to help you choose the best pairing.
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
      {/* 5. RESTAURANTS DIRECTORY & INTERACTIVE CARDS               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 gap-3 border-b border-ivory-200 mb-8">
          <div>
            <h2 className="font-serif font-bold text-2xl text-charcoal-900">
              Pune Restaurant Directory
            </h2>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Showing {filteredList.length} dining destinations with live Menuz table systems
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleOpenScannerForRestaurant()}
              className="py-2 px-3.5 rounded-xl bg-ivory-100 hover:bg-saffron-50 border border-ivory-300 text-charcoal-800 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-saffron-600" />
              <span>Scan QR Code</span>
            </button>
          </div>
        </div>

        {/* Restaurants Grid */}
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-ivory-200 p-12 text-center text-charcoal-400 max-w-md mx-auto my-8">
            <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 text-charcoal-300" />
            <h3 className="font-serif font-bold text-base text-charcoal-800">No restaurants match your search</h3>
            <p className="text-xs text-charcoal-500 mt-1 mb-4">
              Try searching for "Saffron", "Italian", "Baner", or select "All Restaurants".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="py-2 px-4 rounded-xl bg-charcoal-900 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
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
                    <Gift className="w-3 h-3 text-amber-200" />
                    <span>Table Reward Active</span>
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
                      className="flex-1 py-2.5 px-3 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-serif text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <span>Explore Menu &amp; Rewards</span>
                      <ArrowRight className="w-3.5 h-3.5 text-saffron-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenScannerForRestaurant(item.slug)}
                      title={`Scan Table QR for ${item.name}`}
                      className="p-2.5 rounded-xl border border-ivory-300 hover:border-saffron-400 hover:bg-saffron-50 text-charcoal-700 hover:text-saffron-700 transition-colors flex items-center justify-center"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 6. PARTNER WITH MENUZ BANNER                               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="bg-charcoal-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-charcoal-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-saffron-400 font-bold">
            For Restaurateurs &amp; Hospitality Owners
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            Transform Your Dining Room into a 5-Star Review Machine
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-300 max-w-xl mx-auto leading-relaxed">
            Menuz replaces clunky paper menus with interactive ordering, instant floor alerts for unhappy diners, and review-gated rewards that multiply positive Google reviews automatically.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/admin"
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-saffron-600 to-amber-500 hover:brightness-110 text-white font-serif text-xs font-bold shadow-float flex items-center space-x-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Launch Restaurant Master Admin ↗</span>
            </Link>

            <button
              type="button"
              onClick={() => handleOpenScannerForRestaurant()}
              className="py-3 px-5 rounded-2xl bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-200 border border-charcoal-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
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
            <span>• Pune Table Dining &amp; Review Network</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <Link to="/" className="hover:text-white transition-colors">
              Directory
            </Link>
            <button
              onClick={() => handleOpenScannerForRestaurant()}
              className="hover:text-white transition-colors"
            >
              Table Scanner
            </button>
            <Link to="/admin" className="text-saffron-400 hover:underline">
              Partner Hub
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
