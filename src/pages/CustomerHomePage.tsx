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
  ShieldCheck,
  Check,
  Copy,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  LayoutDashboard,
  ExternalLink,
  Printer,
  Wifi,
  Zap,
  Users,
  Award,
  Terminal,
  Clock,
  RotateCw,
  Plus,
  Minus
} from 'lucide-react';
import { useRestaurantStore, isDishNameAsRestaurant } from '../store/restaurantStore';
import { isWorkingWithMenuz } from '../types';
import { PUNE_RESTAURANT_DIRECTORY, PuneRestaurantEntry, matchesPuneQuery } from '../data/puneRestaurantDirectory';
import { QrScannerModal } from '../components/QrScannerModal';

export const CustomerHomePage: React.FC = () => {
  const navigate = useNavigate();
  const rawRestaurants = useRestaurantStore((state) => state.restaurants);
  const restaurants = useMemo(
    () => rawRestaurants.filter((r) => !isDishNameAsRestaurant(r)),
    [rawRestaurants]
  );
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const tables = useRestaurantStore((state) => state.tables);

  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const customerSearchRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [selectedScannerSlug, setSelectedScannerSlug] = useState<string | undefined>(undefined);
  const [copiedCli, setCopiedCli] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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

      if (lowerLoc.includes('pcmc') || lowerLoc.includes('pimpri') || lowerLoc.includes('chinchwad')) tags.push('pcmc');
      if (lowerLoc.includes('koregaon')) tags.push('koregaon park');
      if (lowerLoc.includes('baner') || lowerLoc.includes('balewadi') || lowerLoc.includes('aundh')) tags.push('baner');
      if (lowerLoc.includes('hinjewadi') || lowerLoc.includes('wakad')) tags.push('hinjewadi');
      if (lowerLoc.includes('kothrud')) tags.push('kothrud');
      if (lowerLoc.includes('viman') || lowerLoc.includes('kharadi') || lowerLoc.includes('kalyani')) tags.push('viman nagar');

      if (lowerCuisine.includes('indian') || lowerCuisine.includes('mughlai') || lowerCuisine.includes('thali') || lowerCuisine.includes('biryani')) tags.push('indian');
      if (lowerCuisine.includes('italian') || lowerCuisine.includes('pizza') || lowerCuisine.includes('pasta')) tags.push('italian');
      if (lowerCuisine.includes('asian') || lowerCuisine.includes('thai') || lowerCuisine.includes('japanese') || lowerCuisine.includes('chinese')) tags.push('asian');
      if (lowerCuisine.includes('veg') || lowerCuisine.includes('vegetarian')) tags.push('veg');

      return tags;
    };

    // Only show active demo restaurants working with Menuz on the customer site
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
        rewardHighlight: isItalian ? 'Free Tiramisu or 15% Off' : 'Free Potli Samosa or 20% Off',
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
    { id: 'all', label: 'All Live Venues' },
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

  const handleCopyCli = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 3000);
  };

  // FAQ Items following ClickHouse 2-column accordion pattern
  const faqs = [
    {
      q: 'Do diners or staff need to download an application?',
      a: 'Zero downloads required. Diners simply point their default phone camera at the QR code on the table. The web menu, multiplayer cart sync, and direct kitchen KOT ordering load instantly in the mobile browser in under 400 milliseconds.'
    },
    {
      q: 'How does the hardware-free thermal KOT printing bridge work?',
      a: 'When an order is confirmed at the table, Menuz serializes the receipt payload in ESC/POS byte format and routes it directly to your kitchen thermal printer (Epson, TVS, Rugtek, etc.) via local TCP Port 9100 or your POS cloud webhook (Petpooja, Posist, RoyalPOS) in <1 second.'
    },
    {
      q: 'How does the Google 5-Star Review Shield prevent negative ratings?',
      a: 'After dining, guests are prompted for private floor feedback. If a guest rates 4 or 5 stars, they are seamlessly guided to post directly on Google Maps to spin the reward wheel. If they rate 1–3 stars, a discreet notification instantly fires to the floor manager dashboard so the issue can be resolved before the guest leaves.'
    },
    {
      q: 'What is the pricing model? Is there any food commission?',
      a: 'Menuz charges 0% food commission forever. You keep 100% of your diner sales. Subscription is a transparent, predictable flat rate: ₹5,000/month for single outlet or ₹10,000/month for multi-outlet groups with complete POS and thermal printer redundancy.'
    }
  ];

  const currentRestTables = tables.filter((t) => t.restaurant_id === restaurant?.id);
  const defaultToken = currentRestTables[0]?.public_token || tables[0]?.public_token || 'table-token-01-saffron';
  const defaultDinerUrl = `/r/${restaurant?.slug || 'saffron-house'}/menu?t=${defaultToken}`;

  return (
    <div className="min-h-screen bg-[#151515] text-[#e5e7eb] font-sans flex flex-col antialiased selection:bg-[#FFA000] selection:text-[#151515]">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 1. TOP TERMINAL STATUS BAR & GLOBAL CLICKHOUSE NAV          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 bg-[#151515]/95 backdrop-blur-md border-b border-[#3a3a3a] h-16 px-4 sm:px-8">
        <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between gap-4">
          {/* Logo with lone phosphor cursor */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center group cursor-pointer">
              <span className="font-sans font-black text-xl tracking-tight text-white group-hover:text-[#FFA000] transition-colors">
                menuz
              </span>
              <span className="inline-block w-2 h-4.5 bg-[#FFA000] ml-1.5 animate-cursor-blink" />
            </Link>

            {/* Terminal status pill */}
            <div className="hidden lg:flex items-center space-x-2 bg-[#1f1f1c] border border-[#3a3a3a] rounded-full px-3 py-1 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#FFA000] animate-pulse" />
              <span className="text-[#a0a0a0] font-mono text-[11px]">PUNE // 268+ VENUES ENGINE LIVE</span>
            </div>
          </div>

          {/* Center Navigation Links (Smoke #a0a0a0) */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-[#a0a0a0]">
            <a href="#features" className="hover:text-white transition-colors">Architecture</a>
            <a href="#kot-bridge" className="hover:text-white transition-colors">KOT Bridge</a>
            <a href="#demos" className="hover:text-white transition-colors">Live Demos</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <Link to="/pitch" className="text-[#dfdfdf] hover:text-[#FFA000] transition-colors flex items-center space-x-1">
              <span>Deck</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#FFA000]" />
            </Link>
          </div>

          {/* Right Action Stack: Ghost + Primary Lime/Saffron CTA */}
          <div className="flex items-center space-x-3">
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold text-[#e5e7eb] hover:text-white bg-[#1f1f1c] hover:bg-[#282828] border border-[#3a3a3a] px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFA000]" />
              <span>Master Admin</span>
            </Link>

            <button
              type="button"
              onClick={() => handleOpenRestaurantMenu(directoryList[0] || { slug: 'saffron-house' } as any)}
              className="bg-[#FFA000] hover:bg-[#FFB020] text-[#151515] font-semibold text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg shadow-phosphor-cta transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer font-sans"
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 2. HERO SECTION (Massive 96px display on Void Black)        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <header className="relative w-full pt-16 pb-20 sm:pt-24 sm:pb-32 px-4 sm:px-8 border-b border-[#3a3a3a] bg-[#151515]">
        <div className="max-w-[1200px] mx-auto text-center space-y-8">
          {/* Eyebrow Label: 12px Inter weight 600, 0.1em tracking, Electric Saffron */}
          <div className="inline-flex items-center space-x-2 text-[12px] font-semibold tracking-[0.1em] text-[#FFA000] uppercase font-mono">
            <span>● USE CASES</span>
            <span className="text-[#3a3a3a]">//</span>
            <span>AUTONOMOUS RESTAURANT OPERATING SYSTEM</span>
          </div>

          {/* Massive Display Headline: 72px / 96px Inter weight 900 */}
          <h1 className="text-4xl sm:text-7xl lg:text-[88px] font-black tracking-tight leading-[1.05] sm:leading-[1.0] text-white max-w-5xl mx-auto">
            The Real-Time Engine for Modern Dining.
          </h1>

          {/* Subtext: 18px in Bone (#dfdfdf) with Inline Highlight Box */}
          <p className="text-base sm:text-lg text-[#dfdfdf] max-w-3xl mx-auto leading-relaxed font-normal">
            Zero app downloads. Instant ESC/POS kitchen thermal printing in &lt;1s. Multiplayer table bills with 0% lifetime commission. Connect your restaurant to{' '}
            <span className="inline-block bg-[#FFA000] text-[#151515] px-2 py-0.5 rounded-[4px] font-bold mx-1">
              Menuz in seconds.
            </span>
          </p>

          {/* Two-Button Stack (Primary Saffron + Ghost Button with 12px gap) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={defaultDinerUrl}
              className="w-full sm:w-auto bg-[#FFA000] hover:bg-[#FFB020] text-[#151515] font-semibold text-base px-6 py-3 rounded-lg shadow-phosphor-cta transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer font-sans"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#151515]" />
              <span>Launch Live Table Demo</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <button
              type="button"
              onClick={() => handleOpenScannerForRestaurant()}
              className="w-full sm:w-auto bg-transparent hover:bg-[#282828] text-[#e5e7eb] font-semibold text-base px-6 py-3 rounded-lg border border-[#3a3a3a] hover:border-[#414141] transition-all flex items-center justify-center space-x-2 cursor-pointer font-sans"
            >
              <QrCode className="w-4 h-4 text-[#FFA000]" />
              <span>Scan Any Table QR</span>
            </button>
          </div>

          {/* Announcement Banner (Carbon #1f1f1c background, 1px Iron border, 8px radius) */}
          <div className="max-w-2xl mx-auto bg-[#1f1f1c] border border-[#3a3a3a] rounded-lg p-3 sm:px-4 flex items-center justify-between text-left text-xs gap-3">
            <div className="flex items-center space-x-3 min-w-0">
              <span className="px-2 py-0.5 rounded-[4px] bg-[#4d3300] text-[#FFA000] font-mono font-bold text-[10px] tracking-wider uppercase border border-[#FFA000]/40 flex-shrink-0">
                v2.4 Live
              </span>
              <span className="text-[#dfdfdf] truncate">
                Direct ESC/POS thermal printing active on Android, Windows &amp; Mac hardware without driver setup.
              </span>
            </div>
            <Link to="/pitch" className="text-[#FFA000] hover:underline whitespace-nowrap font-medium flex-shrink-0">
              Details →
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 3. TRUST LOGO STRIP (Monochrome Paper #e5e7eb on Void Black)*/}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-10 border-b border-[#3a3a3a] bg-[#151515]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 space-y-4">
          <p className="text-[12px] font-semibold tracking-[0.1em] text-[#a0a0a0] uppercase font-mono text-center sm:text-left">
            MENUZ IS TRUSTED BY TOP RESTAURANTS &amp; CAFES IN PUNE
          </p>

          <div className="flex flex-wrap items-center justify-between gap-6 text-[#bcbcbb] text-sm font-semibold tracking-wider opacity-85">
            <span className="hover:text-white transition-colors">SAFFRON HOUSE</span>
            <span className="text-[#3a3a3a] hidden md:inline">/</span>
            <span className="hover:text-white transition-colors">CASA BELLA TRATTORIA</span>
            <span className="text-[#3a3a3a] hidden md:inline">/</span>
            <span className="hover:text-white transition-colors">MALAKA SPICE</span>
            <span className="text-[#3a3a3a] hidden md:inline">/</span>
            <span className="hover:text-white transition-colors">PAASHA JW</span>
            <span className="text-[#3a3a3a] hidden md:inline">/</span>
            <span className="hover:text-white transition-colors">EFFINGUT BREWERY</span>
            <span className="text-[#3a3a3a] hidden md:inline">/</span>
            <span className="hover:text-white transition-colors">SHIZUSAN</span>
            <span className="text-[#3a3a3a] hidden md:inline">/</span>
            <span className="hover:text-white transition-colors">TERTTULIA</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 4. TERMINAL CODE BLOCK (Universal Kitchen KOT Bridge)      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section id="kot-bridge" className="py-20 border-b border-[#3a3a3a] bg-[#151515]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[12px] font-semibold tracking-[0.1em] text-[#FFA000] uppercase font-mono">
                DEVELOPER &amp; HARDWARE BRIDGE
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Zero-Config KOT Dispatch Pipeline
              </h2>
            </div>
            <p className="text-xs text-[#a0a0a0] max-w-md">
              Send guest orders directly to kitchen ESC/POS thermal printers via local Wi-Fi or POS cloud API without writing integration code.
            </p>
          </div>

          {/* Terminal Code Block (Carbon #1f1f1c, 8px radius, Inconsolata font) */}
          <div className="bg-[#1f1f1c] border border-[#3a3a3a] rounded-lg p-5 sm:p-6 font-mono text-sm shadow-card-inset relative space-y-3">
            <div className="flex items-center justify-between border-b border-[#282828] pb-3 text-xs text-[#a0a0a0]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
                <span className="ml-2 text-[#bcbcbb]">bash — menuz-printer-daemon</span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCli('curl -s https://menuz.link/connect | bash -s -- --venue=saffron-house --pos=petpooja')}
                className="flex items-center space-x-1.5 text-xs text-[#a0a0a0] hover:text-[#FFA000] transition-colors cursor-pointer"
                title="Copy command"
              >
                {copiedCli ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">Copied to clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Command</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-1.5 pt-1 text-xs sm:text-sm overflow-x-auto">
              <div className="flex items-center space-x-2">
                <span className="text-[#FFA000] font-bold select-none">$</span>
                <span className="text-[#e5e7eb]">
                  curl -s https://menuz.link/connect | bash -s -- --venue=saffron-house --pos=petpooja --port=9100
                </span>
              </div>
              <p className="text-[#a0a0a0] text-xs pt-1">
                [2026-10-01 05:30:12] Detected USB/LAN ESC/POS thermal printer (80mm width) at 192.168.1.140:9100
              </p>
              <p className="text-[#FFA000] text-xs">
                ✔ Universal Kitchen KOT Bridge connected. Latency: 42ms. Direct thermal ticket firing active.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 5. FEATURE CARDS (4-Column Grid, Carbon #1f1f1c Surfaces)    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section id="features" className="py-20 border-b border-[#3a3a3a] bg-[#151515]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 space-y-10">
          <div>
            <span className="text-[12px] font-semibold tracking-[0.1em] text-[#FFA000] uppercase font-mono">
              SYSTEM CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1">
              Engineered for Speed, Reliability &amp; Revenue
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Feature 1 */}
            <div className="bg-[#1f1f1c] border border-[#3a3a3a] rounded-lg p-6 sm:p-7 shadow-card-inset flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-lg border border-[#3a3a3a] bg-[#282828] flex items-center justify-center text-[#FFA000]">
                  <Users className="w-7 h-7 stroke-[2]" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Multiplayer Cart Sync
                </h3>
                <p className="text-sm text-[#dfdfdf] leading-relaxed">
                  Every guest at the dining table joins the shared order queue in real time. Items appear simultaneously with zero app download or login.
                </p>
              </div>
              <Link to={defaultDinerUrl} className="text-sm font-medium text-[#FFA000] hover:underline flex items-center space-x-1">
                <span>Explore cart</span>
                <span>→</span>
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#1f1f1c] border border-[#3a3a3a] rounded-lg p-6 sm:p-7 shadow-card-inset flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-lg border border-[#3a3a3a] bg-[#282828] flex items-center justify-center text-[#FFA000]">
                  <Printer className="w-7 h-7 stroke-[2]" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Hardware-Free KOT Bridge
                </h3>
                <p className="text-sm text-[#dfdfdf] leading-relaxed">
                  Direct sub-second routing to kitchen ESC/POS thermal printers &amp; POS adapters (Petpooja, RoyalPOS, Recaho) with triple-channel backup.
                </p>
              </div>
              <a href="#kot-bridge" className="text-sm font-medium text-[#FFA000] hover:underline flex items-center space-x-1">
                <span>Explore bridge</span>
                <span>→</span>
              </a>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#1f1f1c] border border-[#3a3a3a] rounded-lg p-6 sm:p-7 shadow-card-inset flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-lg border border-[#3a3a3a] bg-[#282828] flex items-center justify-center text-[#FFA000]">
                  <ShieldCheck className="w-7 h-7 stroke-[2]" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Google Review Shield
                </h3>
                <p className="text-sm text-[#dfdfdf] leading-relaxed">
                  Protects reputation by handling unhappy diners internally on the floor while converting delighted guests into verified 5-star Google Maps reviews.
                </p>
              </div>
              <Link to="/pitch" className="text-sm font-medium text-[#FFA000] hover:underline flex items-center space-x-1">
                <span>Explore shield</span>
                <span>→</span>
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#1f1f1c] border border-[#3a3a3a] rounded-lg p-6 sm:p-7 shadow-card-inset flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-lg border border-[#3a3a3a] bg-[#282828] flex items-center justify-center text-[#FFA000]">
                  <Zap className="w-7 h-7 stroke-[2]" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  0% Food Commission
                </h3>
                <p className="text-sm text-[#dfdfdf] leading-relaxed">
                  Keep 100% of your food &amp; beverage sales. Replaces predatory 30% aggregator delivery tax with a transparent flat ₹5,000 monthly utility.
                </p>
              </div>
              <Link to="/pitch" className="text-sm font-medium text-[#FFA000] hover:underline flex items-center space-x-1">
                <span>Explore ROI</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 6. INTERACTIVE PUNE VENUE EXPLORER (ClickHouse Carbon Cards)*/}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section id="demos" className="py-20 border-b border-[#3a3a3a] bg-[#151515]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <span className="text-[12px] font-semibold tracking-[0.1em] text-[#FFA000] uppercase font-mono">
                LIVE DEMO OUTLETS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Experience Interactive Menus &amp; Table QRs
              </h2>
            </div>

            {/* Search Input on Carbon (#1f1f1c) */}
            <div className="w-full md:w-80 relative" ref={customerSearchRef}>
              <Search className="w-4 h-4 text-[#a0a0a0] absolute left-3 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowCustomerSuggestions(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowCustomerSuggestions(true);
                }}
                placeholder="Search venue or cuisine..."
                className="w-full bg-[#1f1f1c] border border-[#3a3a3a] focus:border-[#FFA000] rounded-lg py-2.5 pl-9 pr-3 text-xs text-white placeholder-[#a0a0a0] outline-none transition-colors"
              />

              {/* Suggestions Popup */}
              {showCustomerSuggestions && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-[#1f1f1c] rounded-lg border border-[#3a3a3a] overflow-hidden z-50 shadow-2xl divide-y divide-[#282828]">
                  {customerSuggestions.map((item) => (
                    <div
                      key={`sugg-${item.slug}`}
                      onClick={() => {
                        setSearchQuery(item.name);
                        setShowCustomerSuggestions(false);
                        handleOpenRestaurantMenu(item);
                      }}
                      className="p-3 hover:bg-[#282828] cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-[10px] text-[#a0a0a0]">{item.cuisine} • {item.location}</div>
                      </div>
                      <span className="text-[#FFA000] font-mono text-[11px]">Launch →</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filter Chips (Pill 9999px & Tag 4px styles) */}
          <div className="flex items-center flex-wrap gap-2">
            {filterOptions.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`text-xs px-3.5 py-1.5 rounded-full transition-colors font-medium cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-[#FFA000] text-[#151515] font-semibold'
                    : 'bg-[#1f1f1c] hover:bg-[#282828] text-[#e5e7eb] border border-[#3a3a3a]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* 2 Flagship Demo Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredList.map((item) => (
              <div
                key={item.slug}
                className="bg-[#1f1f1c] border border-[#3a3a3a] rounded-lg overflow-hidden flex flex-col justify-between shadow-card-inset hover:border-[#414141] transition-colors"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute top-3 left-3 bg-[#151515]/90 border border-[#3a3a3a] px-2.5 py-1 rounded text-xs font-mono font-bold text-white flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 fill-[#FFA000] text-[#FFA000]" />
                    <span>{item.rating}</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-[#161200] border border-[#4d3300] text-[#FFA000] px-2.5 py-1 rounded text-[11px] font-mono font-semibold">
                    Live At Table 1
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{item.name}</h3>
                      <p className="text-xs text-[#a0a0a0] mt-0.5">{item.cuisine} • {item.location}</p>
                    </div>
                    <span className="text-xs font-mono text-[#FFA000] font-semibold">{item.avgCostForTwo} for two</span>
                  </div>

                  <div className="bg-[#151515] border border-[#282828] p-3 rounded text-xs text-[#dfdfdf] flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#FFA000] flex-shrink-0" />
                    <span><strong>Reward:</strong> {item.rewardHighlight}</span>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-[#282828]">
                    <button
                      type="button"
                      onClick={() => handleOpenRestaurantMenu(item)}
                      className="flex-1 bg-[#FFA000] hover:bg-[#FFB020] text-[#151515] font-semibold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer font-sans"
                    >
                      <span>Launch Table 1 Menu</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenScannerForRestaurant(item.slug)}
                      className="px-3 py-2.5 bg-[#282828] hover:bg-[#343434] text-[#e5e7eb] rounded-lg border border-[#3a3a3a] text-xs transition-colors flex items-center justify-center cursor-pointer"
                      title="Scan QR Code"
                    >
                      <QrCode className="w-4 h-4 text-[#FFA000]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 7. FAQ ACCORDION SECTION (ClickHouse 2-Column Split)        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-20 border-b border-[#3a3a3a] bg-[#151515]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Heading + Intro */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[12px] font-semibold tracking-[0.1em] text-[#FFA000] uppercase font-mono">
                DOCUMENTATION &amp; ANSWERS
              </span>
              <h2 className="text-3xl font-bold text-white leading-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-[#a0a0a0] leading-relaxed">
                Everything you need to know about the Menuz autonomous restaurant operating system, hardware requirements, and deployment timeline.
              </p>
              <div className="pt-2">
                <Link
                  to="/pitch"
                  className="inline-flex items-center space-x-1.5 text-xs text-[#FFA000] hover:underline font-mono"
                >
                  <span>Explore full 19-slide product deck</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Accordion List (Transparent, 1px Iron hairline borders) */}
            <div className="lg:col-span-8 divide-y divide-[#3a3a3a]">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={faq.q} className="py-5">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left flex items-center justify-between text-base font-medium text-[#e5e7eb] hover:text-white transition-colors cursor-pointer group"
                    >
                      <span className="pr-4">{faq.q}</span>
                      <span className="w-6 h-6 rounded-full border border-[#3a3a3a] flex items-center justify-center flex-shrink-0 text-[#a0a0a0] group-hover:border-[#FFA000] group-hover:text-[#FFA000] transition-colors">
                        {isOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="mt-3 pr-8 text-sm text-[#a0a0a0] leading-relaxed animate-in fade-in duration-200">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 8. FINAL CTA / INSTALL SECTION (ClickHouse Centered Box)    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section id="install" className="py-24 bg-[#151515]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="bg-[#1f1f1c] border border-[#3a3a3a] rounded-lg p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-6 shadow-card-inset">
            <span className="text-[12px] font-semibold tracking-[0.1em] text-[#FFA000] uppercase font-mono">
              INSTANT RESTAURANT ONBOARDING
            </span>

            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Deploy{' '}
              <span className="bg-[#FFA000] text-[#151515] px-2.5 py-0.5 rounded-[4px] font-black inline-block">
                Menuz
              </span>{' '}
              in seconds.
            </h2>

            <p className="text-sm sm:text-base text-[#dfdfdf] max-w-xl mx-auto leading-relaxed">
              Join the fastest growing autonomous dining network. Plug into your existing kitchen printer or run 100% digital on any tablet.
            </p>

            {/* Terminal Command Strip */}
            <div className="bg-[#151515] border border-[#3a3a3a] rounded-lg p-3.5 max-w-lg mx-auto flex items-center justify-between text-xs font-mono text-left">
              <span className="text-[#a0a0a0] truncate">
                <span className="text-[#FFA000] font-bold mr-2">$</span>
                npx menuz-connect --venue=saffron-house
              </span>
              <button
                type="button"
                onClick={() => handleCopyCli('npx menuz-connect --venue=saffron-house')}
                className="text-[#FFA000] hover:underline ml-3 flex-shrink-0 cursor-pointer font-sans text-xs font-semibold"
              >
                {copiedCli ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to={defaultDinerUrl}
                className="w-full sm:w-auto bg-[#FFA000] hover:bg-[#FFB020] text-[#151515] font-semibold text-sm px-6 py-3 rounded-lg shadow-phosphor-cta transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer font-sans"
              >
                <span>Launch Table 1 Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/pitch"
                className="w-full sm:w-auto bg-transparent hover:bg-[#282828] text-[#e5e7eb] font-semibold text-sm px-6 py-3 rounded-lg border border-[#3a3a3a] transition-all flex items-center justify-center space-x-2 cursor-pointer font-sans"
              >
                <TrendingUp className="w-4 h-4 text-[#FFA000]" />
                <span>Executive Pitch Deck</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 9. MINIMAL TECHNICAL FOOTER                                 */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <footer className="py-8 border-t border-[#3a3a3a] bg-[#151515] text-[#a0a0a0] text-xs">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-white">MENUZ</span>
            <span className="text-[#3a3a3a]">/</span>
            <span>AUTONOMOUS RESTAURANT OPERATING SYSTEM</span>
          </div>

          <div className="flex items-center space-x-6 text-[11px] font-mono">
            <span className="text-[#FFA000]">● ALL SYSTEMS OPERATIONAL</span>
            <Link to="/admin" className="hover:text-white transition-colors">Admin HQ</Link>
            <Link to="/pitch" className="hover:text-white transition-colors">Pitch Deck</Link>
            <Link to="/kitchen" className="hover:text-white transition-colors">Kitchen KDS</Link>
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
