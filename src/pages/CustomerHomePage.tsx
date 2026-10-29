import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode,
  Search,
  UtensilsCrossed,
  MapPin,
  Star,
  ArrowRight,
  Heart,
  Share2,
  Sparkles,
  Compass,
  Wine,
  Coffee,
  GlassWater,
  Pizza,
  Cake,
  Sunset,
  Check,
  Gift,
  Gamepad2,
  Bot,
  MessageSquare
} from 'lucide-react';
import { useRestaurantStore, isDishNameAsRestaurant } from '../store/restaurantStore';
import { isWorkingWithMenuz, Restaurant } from '../types';
import { QrScannerModal } from '../components/QrScannerModal';
import { TableArcadeModal } from '../components/TableArcadeModal';
import { WinChallengeModal } from '../components/WinChallengeModal';
import { AiAssistantDrawer } from '../components/AiAssistantDrawer';

/* ─────────────────────────────────────────────────────────────────────────────
 * SHELVED SECTION: CURATED COLLECTIONS
 * Note: Per product requirements, Curated Collections is shelved for initial launch.
 * REMINDER: Re-enable and un-shelf this section after onboarding the first 10 customers!
 * ───────────────────────────────────────────────────────────────────────────── */
export const SHELVED_CURATED_COLLECTIONS = [
  {
    id: 'date-night',
    title: 'Date-Night Sanctuary',
    subtitle: 'Candlelit courtyards, intimate bistros & acoustic evenings',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80',
    placesCount: 14,
    tag: 'Romantic'
  },
  {
    id: 'rooftops',
    title: 'Golden-Hour Rooftops',
    subtitle: 'Panoramic sunset skylines, botanical spritzes & twilight breezes',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&auto=format&fit=crop&q=80',
    placesCount: 19,
    tag: 'Sunset Views'
  },
  {
    id: 'hidden-gems',
    title: "Pune's Heritage Gems",
    subtitle: 'Century-old Irani cafes, tucked-away verandahs & secret recipes',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80',
    placesCount: 11,
    tag: 'Heritage'
  },
  {
    id: 'aesthetic-cafes',
    title: 'Sunlit Artisan Cafés',
    subtitle: 'Pour-overs, slow fermented sourdough & tranquil reading nooks',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80',
    placesCount: 22,
    tag: 'Café Culture'
  },
  {
    id: 'group-dining',
    title: 'Feasts & Sharing Tables',
    subtitle: 'Wood-fired sourdough platters, celebratory biryanis & live grills',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80',
    placesCount: 16,
    tag: 'Celebration'
  },
  {
    id: 'trending',
    title: 'Trending This Weekend',
    subtitle: 'The city’s most bookmarked dishes and seasonal tasting menus',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1000&auto=format&fit=crop&q=80',
    placesCount: 8,
    tag: 'Buzzing'
  }
];

// Curated Dining Categories
const DINING_CATEGORIES = [
  { id: 'all', label: 'All', icon: Compass },
  { id: 'fine-dining', label: 'Fine Dining', icon: Wine },
  { id: 'cafes', label: 'Cafés', icon: Coffee },
  { id: 'bars', label: 'Bars & Lounges', icon: GlassWater },
  { id: 'quick-bites', label: 'Gourmet Bites', icon: Pizza },
  { id: 'desserts', label: 'Desserts & Bakes', icon: Cake },
  { id: 'rooftop', label: 'Rooftops', icon: Sunset }
];

export const CustomerHomePage: React.FC = () => {
  const navigate = useNavigate();
  const rawRestaurants = useRestaurantStore((state) => state.restaurants);
  const tables = useRestaurantStore((state) => state.tables);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [savedFavorites, setSavedFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('menuz_saved_favorites');
      return stored ? JSON.parse(stored) : ['saffron-house', 'casa-bella'];
    } catch {
      return ['saffron-house', 'casa-bella'];
    }
  });

  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [selectedScannerSlug, setSelectedScannerSlug] = useState<string | undefined>(undefined);
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [isWinChallengeOpen, setIsWinChallengeOpen] = useState(false);
  const [winChallengeVenue, setWinChallengeVenue] = useState<Restaurant | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState<string | null>(null);
  const [conciergeSearch, setConciergeSearch] = useState('');
  const [shareToastOpen, setShareToastOpen] = useState(false);

  const handleOpenAi = (queryText?: string) => {
    if (queryText) {
      setAiInitialQuery(queryText);
    } else {
      setAiInitialQuery(null);
    }
    setIsAiOpen(true);
  };

  useEffect(() => {
    const handleArcade = () => setIsArcadeOpen(true);
    const handleWin = () => setIsWinChallengeOpen(true);
    const handleAi = (e?: Event) => {
      const customEvt = e as CustomEvent<{ query?: string }>;
      if (customEvt?.detail?.query) {
        setAiInitialQuery(customEvt.detail.query);
      }
      setIsAiOpen(true);
    };
    window.addEventListener('open-table-arcade', handleArcade);
    window.addEventListener('open-google-review', handleWin);
    window.addEventListener('open-win-challenge', handleWin);
    window.addEventListener('open-ai-assistant', handleAi);
    return () => {
      window.removeEventListener('open-table-arcade', handleArcade);
      window.removeEventListener('open-google-review', handleWin);
      window.removeEventListener('open-win-challenge', handleWin);
      window.removeEventListener('open-ai-assistant', handleAi);
    };
  }, []);

  const toggleFavorite = (slug: string) => {
    setSavedFavorites((prev) => {
      const updated = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem('menuz_saved_favorites', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleShareCollection = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Menuz — Golden Hour Dining in Pune',
        text: 'Explore handpicked restaurants, rooftops, and cafés in Pune with direct tableside ordering on Menuz.',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareToastOpen(true);
      setTimeout(() => setShareToastOpen(false), 2500);
    }
  };

  // Strictly ONLY verified restaurants affiliated with Menuz
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
          rating: 4.9,
          costForTwo: r.cuisine.includes('Italian') ? '₹1,400 for two' : '₹1,200 for two',
          specialty: r.cuisine.includes('Italian')
            ? 'Wood-fired sourdough Neapolitan crusts & hand-rolled pasta'
            : 'Dum Pukht slow-cooked Awadhi curries & heritage tandoori grills',
          imageUrl: customImage,
          token: firstTable.public_token,
          rawRest: r
        };
      });
  }, [rawRestaurants, tables]);

  // Filtered restaurants based on query & category
  const filteredVenues = useMemo(() => {
    return affiliatedVenues.filter((v) => {
      const matchesSearch =
        searchQuery === '' ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        activeCategory === 'all' ||
        (activeCategory === 'fine-dining' && (v.cuisine.includes('Mughlai') || v.cuisine.includes('Awadhi') || v.cuisine.includes('Continental'))) ||
        (activeCategory === 'cafes' && (v.cuisine.includes('Bakery') || v.cuisine.includes('European') || v.name.includes('Bakery'))) ||
        (activeCategory === 'bars' && (v.cuisine.includes('Continental') || v.cuisine.includes('Lounge') || v.name.includes('George'))) ||
        (activeCategory === 'quick-bites' && (v.cuisine.includes('Italian') || v.cuisine.includes('Pizza'))) ||
        (activeCategory === 'desserts' && (v.cuisine.includes('Bakery') || v.cuisine.includes('Bistro'))) ||
        (activeCategory === 'rooftop' && (v.location.includes('Koregaon') || v.location.includes('Kalyani')));

      return matchesSearch && matchesCat;
    });
  }, [affiliatedVenues, searchQuery, activeCategory]);

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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFF7E6] text-[#924E00] flex flex-col font-sans selection:bg-[#F9A620]/30 selection:text-[#924E00]">
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION: MINIMALIST EDITORIAL LUXURY                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="discover" className="pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left: Editorial Focus */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#924E00]/70 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F9A620]" />
              <span>Pune Dining Discovery</span>
            </div>

            <h1 className="font-serif font-bold text-4xl sm:text-6xl lg:text-[68px] text-[#924E00] tracking-tight leading-[1.08]">
              Golden-hour dining, <br />
              <span className="italic font-normal text-[#F9A620]">effortlessly discovered.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#924E00]/80 max-w-xl leading-relaxed">
              Explore handpicked restaurants in Pune. Scan any table QR with your camera to browse authentic menus, order together, and enjoy seamless tableside dining.
            </p>

            {/* Standardized Primary & Secondary Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => scrollToSection('restaurants')}
                className="h-12 px-7 rounded-full bg-[#F9A620] hover:bg-[#e89512] active:scale-[0.98] text-white font-medium text-sm sm:text-base flex items-center space-x-2.5 transition-all shadow-xs cursor-pointer"
              >
                <span>Explore Restaurants</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                type="button"
                onClick={() => setIsAiOpen(true)}
                className="h-12 px-6 rounded-full bg-white/95 hover:bg-white active:scale-[0.98] text-[#924E00] border-2 border-[#F9A620] font-medium text-sm sm:text-base flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
              >
                <span className="text-base">✨</span>
                <span>Ask Chef AI</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </button>

              <button
                type="button"
                onClick={() => handleOpenWinChallenge()}
                className="h-12 px-6 rounded-full bg-white/90 hover:bg-white active:scale-[0.98] text-[#924E00] border border-[#F9A620]/60 font-medium text-sm sm:text-base flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
              >
                <span className="text-base">🎁</span>
                <span>Win Treats &amp; Discounts</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenScanner()}
                className="h-12 px-6 rounded-full bg-white/80 hover:bg-white active:scale-[0.98] text-[#924E00] border border-[#924E00]/15 font-medium text-sm sm:text-base flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-[#F9A620]" />
                <span>Scan Table QR</span>
              </button>
            </div>
          </div>

          {/* Right: Pure, Unobstructed Food Photography */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-[0_16px_40px_rgba(146,78,0,0.08)] border border-[#924E00]/10 bg-white">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=85"
                alt="Golden hour dining table in Pune"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#924E00]/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[11px] font-medium tracking-wide uppercase opacity-80">
                  Featured Experience
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl mt-1">
                  Casa Bella &amp; Saffron House
                </h3>
                <p className="text-xs opacity-90">Kalyani Nagar &amp; Koregaon Park</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. DINING CATEGORIES: CLEAN PILL NAVIGATION                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-[#924E00]/10">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-2">
          {DINING_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  scrollToSection('restaurants');
                }}
                className={`h-10 px-4 rounded-full flex items-center space-x-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#F9A620] text-white shadow-xs'
                    : 'bg-white/80 hover:bg-white text-[#924E00]/80 border border-[#924E00]/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#F9A620]'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2.5 DINE-IN WIN CHALLENGE SHOWCASE BANNER                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-r from-white via-[#FFF7E6] to-white border border-[#F9A620]/35 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(249,166,32,0.08)] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F9A620]/15 text-[#924E00] text-xs font-bold border border-[#F9A620]/30">
              <Gift className="w-3.5 h-3.5 text-[#F9A620]" />
              <span>🎁 Dine-In Win Challenge</span>
            </div>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#924E00]">
              Review &amp; Unlock Instant Food Treats &amp; Discounts
            </h3>
            <p className="text-xs sm:text-sm text-[#924E00]/80 leading-relaxed font-sans">
              Leave a quick 5-star Google review for your dining experience to play the reward challenge: Spin the Lucky Wheel, Scratch &amp; Win, or open Mystery Box treats!
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleOpenWinChallenge()}
            className="h-12 px-7 rounded-full bg-[#F9A620] hover:bg-[#e89512] active:scale-[0.98] text-white font-medium text-xs sm:text-sm shadow-xs flex items-center justify-center space-x-2 shrink-0 transition-all cursor-pointer"
          >
            <span>Play Win Challenge</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2.7 CHEF AI DINING CONCIERGE: INTERACTIVE CHATBOT SECTION     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="concierge" className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-br from-white via-[#FFF7E6] to-[#FFF2D6]/60 border-2 border-[#F9A620]/40 rounded-3xl p-6 sm:p-10 shadow-[0_12px_40px_rgba(249,166,32,0.1)] relative overflow-hidden">
          {/* Subtle Golden Glow Accent */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#F9A620]/25 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left Column: Heading, Direct Ask Input, and Quick Chips */}
            <div className="max-w-2xl space-y-3.5">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#F9A620]/15 text-[#924E00] text-xs font-bold border border-[#F9A620]/30 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#F9A620] animate-pulse" />
                <span>Chef AI • 24/7 Dining Concierge</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping ml-1" />
              </div>

              <h3 className="font-serif font-black text-2xl sm:text-4xl text-[#924E00] tracking-tight leading-tight">
                Ask Chef AI Anything About Dining &amp; Dishes
              </h3>

              <p className="text-xs sm:text-sm text-[#924E00]/80 leading-relaxed font-sans">
                Trained directly on authentic kitchen recipes, exact spice calibrations (1–5), sommelier pairings, and allergen isolation across Pune's partner restaurants.
              </p>

              {/* Direct Ask Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (conciergeSearch.trim()) {
                    handleOpenAi(conciergeSearch.trim());
                    setConciergeSearch('');
                  } else {
                    handleOpenAi();
                  }
                }}
                className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl"
              >
                <div className="relative flex-1">
                  <Bot className="w-4 h-4 text-[#F9A620] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={conciergeSearch}
                    onChange={(e) => setConciergeSearch(e.target.value)}
                    placeholder="Ask Chef AI (e.g. 'Best Butter Chicken?', 'Romantic Rooftop', 'Vegan & Mild picks')..."
                    className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm bg-white text-[#924E00] placeholder:text-[#924E00]/45 rounded-full border border-[#924E00]/20 focus:outline-none focus:border-[#F9A620] shadow-inner transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="h-11 px-6 rounded-full bg-[#F9A620] hover:bg-[#e89512] active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Ask Chef AI</span>
                </button>
              </form>

              {/* Popular Fast-Access Prompt Pills */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-[#924E00]/60 block mb-1.5 uppercase tracking-wider">
                  Popular Concierge Inquiries:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "🍛 Best Butter Chicken in town?", query: "Which restaurant has the absolute best, most authentic Butter Chicken?" },
                    { label: "🍷 Romantic Rooftop & Cocktails", query: "Recommend a romantic rooftop dining experience with artisan cocktails" },
                    { label: "🛡️ 100% Jain & Vegan Safe", query: "Show 100% Jain and pure Vegan safe dining picks with isolated cookware" },
                    { label: "🌶️ Mild & Kid-Friendly Feasts", query: "What are your mildest, kid-friendly dishes for family dining?" },
                    { label: "🍕 Woodfired Truffle Pizzas", query: "Where can I get authentic woodfired sourdough pizzas and handmade pastas?" },
                    { label: "🍮 Chef's Signature Desserts", query: "What are the most famous signature desserts and sweet endings?" }
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => handleOpenAi(chip.query)}
                      className="px-3 py-1 rounded-full bg-white hover:bg-[#FFF2D6] active:scale-95 text-[#924E00] border border-[#924E00]/15 text-xs font-medium transition-all shadow-2xs cursor-pointer flex items-center space-x-1"
                    >
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Mini Feature Showcase Card */}
            <div className="w-full lg:w-80 bg-white/95 backdrop-blur-sm border border-[#924E00]/10 rounded-2xl p-5 shadow-xs flex flex-col space-y-3.5 shrink-0">
              <div className="flex items-center space-x-2.5 border-b border-[#924E00]/10 pb-3">
                <div className="w-9 h-9 rounded-full bg-[#F9A620]/20 flex items-center justify-center text-[#924E00] shrink-0">
                  <MessageSquare className="w-4 h-4 text-[#F9A620]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#924E00]">Live Chef Concierge</h4>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Always online for tables</span>
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-[#924E00]/80">
                <div className="flex items-start space-x-2">
                  <span className="text-base shrink-0">🧑‍🍳</span>
                  <div>
                    <strong className="text-[#924E00] font-semibold">Kitchen Secrets &amp; Lore:</strong> Dish backstory, ingredients &amp; cooking technique.
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-base shrink-0">🌶️</span>
                  <div>
                    <strong className="text-[#924E00] font-semibold">True Heat Calibration:</strong> 1 to 5 flame scale verified with head chefs.
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-base shrink-0">🍷</span>
                  <div>
                    <strong className="text-[#924E00] font-semibold">Curated Pairings:</strong> Sommelier-selected wines, artisan brews &amp; coolers.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenAi()}
                className="w-full py-2.5 rounded-xl bg-[#FFF7E6] hover:bg-[#FFF2D6] text-[#924E00] border border-[#F9A620]/30 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer mt-1"
              >
                <span>Launch Full Concierge Chat</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F9A620]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. FEATURED RESTAURANTS: CLEAN CATALOG & ACCESSIBLE ACTIONS   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="restaurants" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Section Header with Search */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#924E00]">
              Featured Restaurants
            </h2>
            <p className="text-sm text-[#924E00]/75 mt-1">
              Verified dining partners equipped with Menuz tableside ordering.
            </p>
          </div>

          {/* Minimal Search Bar */}
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <Search className="w-4 h-4 text-[#924E00]/50 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by restaurant or cuisine..."
              className="w-full h-11 pl-10 pr-9 text-xs sm:text-sm bg-white text-[#924E00] placeholder:text-[#924E00]/40 rounded-full border border-[#924E00]/15 focus:outline-none focus:border-[#F9A620] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-xs text-[#924E00]/60 hover:text-[#924E00]"
                aria-label="Clear search query"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Restaurant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredVenues.map((venue) => {
            const isFavorite = savedFavorites.includes(venue.slug);
            return (
              <div
                key={venue.slug}
                onClick={() => handleLaunchTable(venue)}
                className="bg-white/80 hover:bg-white rounded-3xl overflow-hidden border border-[#924E00]/10 hover:border-[#F9A620]/30 shadow-[0_8px_24px_rgba(146,78,0,0.04)] hover:shadow-[0_12px_32px_rgba(249,166,32,0.12)] transition-all cursor-pointer flex flex-col group"
              >
                {/* Photo */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#FFF7E6]">
                  <img
                    src={venue.imageUrl}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  
                  {/* Rating Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/95 text-xs font-semibold text-[#924E00] flex items-center space-x-1 shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-[#F9A620] text-[#F9A620]" />
                      <span>{venue.rating}</span>
                    </span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(venue.slug);
                    }}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#924E00] flex items-center justify-center transition-all shadow-xs"
                    aria-label={isFavorite ? `Remove ${venue.name} from favorites` : `Save ${venue.name} to favorites`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#F9A620] text-[#F9A620]' : 'text-[#924E00]'}`} />
                  </button>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-serif font-bold text-2xl group-hover:text-[#FFD188] transition-colors drop-shadow-sm">
                      {venue.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-white/90 mt-0.5">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-[#F9A620]" />
                        <span>{venue.location}</span>
                      </span>
                      <span>•</span>
                      <span>{venue.costForTwo}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body & Actions */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#F9A620]">
                      {venue.cuisine}
                    </span>
                    <p className="text-xs sm:text-sm text-[#924E00]/80 leading-relaxed font-sans">
                      {venue.specialty}
                    </p>
                  </div>

                  {/* Multi-Action Clean Row */}
                  <div className="pt-3 border-t border-[#924E00]/10 flex items-center justify-between gap-2.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLaunchTable(venue);
                      }}
                      className="flex-1 h-11 px-4 sm:px-5 rounded-full bg-[#F9A620] hover:bg-[#e89512] active:scale-[0.98] text-white font-medium text-xs sm:text-sm flex items-center justify-center space-x-1.5 sm:space-x-2 transition-all shadow-xs cursor-pointer"
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5 text-white" />
                      <span>View Menu</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenWinChallenge(venue);
                      }}
                      className="h-11 px-3.5 rounded-full bg-[#FFF2D6] hover:bg-white text-[#924E00] border border-[#F9A620]/40 font-medium text-xs flex items-center space-x-1 transition-all shadow-xs cursor-pointer shrink-0"
                      title={`Play Win Challenge for ${venue.name}`}
                      aria-label={`Play Win Challenge for ${venue.name}`}
                    >
                      <span>🎁</span>
                      <span className="hidden sm:inline">Win</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenScanner(venue.slug);
                      }}
                      className="w-11 h-11 rounded-full bg-white hover:bg-[#FFF7E6] border border-[#924E00]/15 text-[#924E00] flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0"
                      title="Scan Table QR"
                      aria-label={`Scan Table QR for ${venue.name}`}
                    >
                      <QrCode className="w-4 h-4 text-[#F9A620]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredVenues.length === 0 && (
          <div className="text-center py-16 bg-white/60 rounded-3xl border border-[#924E00]/10 space-y-3">
            <UtensilsCrossed className="w-10 h-10 text-[#924E00]/40 mx-auto" />
            <h3 className="font-serif font-bold text-xl text-[#924E00]">No Restaurants Found</h3>
            <p className="text-xs sm:text-sm text-[#924E00]/70 max-w-sm mx-auto">
              Try adjusting your search query or reset the category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="text-xs font-semibold text-[#F9A620] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. SIGNATURE EXPERIENCES: FOCUSED VISUAL STORIES              */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="experiences" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-[#924E00]/10">
        <div className="text-center space-y-2 max-w-xl mx-auto mb-12">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#924E00]">
            Signature Experiences
          </h2>
          <p className="text-sm text-[#924E00]/75">
            More than just dining—moments crafted to linger long after golden hour.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white/80 rounded-3xl overflow-hidden border border-[#924E00]/10 shadow-xs flex flex-col">
            <div className="aspect-[16/10] overflow-hidden bg-[#FFF7E6]">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80"
                alt="Chef's tasting counter"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 space-y-2 flex-1">
              <h3 className="font-serif font-bold text-xl text-[#924E00]">
                The Chef's Tasting Table
              </h3>
              <p className="text-xs sm:text-sm text-[#924E00]/75 leading-relaxed font-sans">
                Slow-simmered Dum Pukht pots sealed with dough, infused with saffron and Kashmiri cardamom.
              </p>
            </div>
          </div>

          <div className="bg-white/80 rounded-3xl overflow-hidden border border-[#924E00]/10 shadow-xs flex flex-col">
            <div className="aspect-[16/10] overflow-hidden bg-[#FFF7E6]">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80"
                alt="Sourdough pizza and spritzes"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 space-y-2 flex-1">
              <h3 className="font-serif font-bold text-xl text-[#924E00]">
                Sunset Sourdough &amp; Spritzes
              </h3>
              <p className="text-xs sm:text-sm text-[#924E00]/75 leading-relaxed font-sans">
                Hand-stretched Neapolitan crusts baked in oak wood-fired ovens, paired with citrus spritzes.
              </p>
            </div>
          </div>

          <div className="bg-white/80 rounded-3xl overflow-hidden border border-[#924E00]/10 shadow-xs flex flex-col">
            <div className="aspect-[16/10] overflow-hidden bg-[#FFF7E6]">
              <img
                src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=700&auto=format&fit=crop&q=80"
                alt="Friends dining together"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 space-y-2 flex-1">
              <h3 className="font-serif font-bold text-xl text-[#924E00]">
                Multiplayer Tableside Dining
              </h3>
              <p className="text-xs sm:text-sm text-[#924E00]/75 leading-relaxed font-sans">
                Every diner scans with their phone, building a synchronized table order straight to the kitchen.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. SOCIAL DISCOVERY: EFFORTLESS SHARING                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white/80 rounded-3xl border border-[#924E00]/10 p-8 sm:p-12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F9A620]">
              Social Discovery
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#924E00]">
              Save Favourites. Plan Meals Together.
            </h2>
            <p className="text-xs sm:text-sm text-[#924E00]/75 leading-relaxed">
              Build your personal dining list across Pune and share recommendations with dining companions.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={handleShareCollection}
              className="h-11 px-5 rounded-full bg-[#F9A620] hover:bg-[#e89512] active:scale-[0.98] text-white font-medium text-xs sm:text-sm flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-white" />
              <span>Share Menuz with Friends</span>
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5.5 TABLE ARCADE & WAITING GAMES (FOR TABLE DINERS)           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="arcade" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-[#924E00]/10">
        <div className="bg-white/80 rounded-3xl border border-[#924E00]/10 p-6 sm:p-10 shadow-[0_8px_30px_rgba(146,78,0,0.04)] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#924E00]/10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F9A620]/15 text-[#924E00] text-xs font-semibold">
                <Gamepad2 className="w-3.5 h-3.5 text-[#F9A620]" />
                <span>Exclusively for Table Diners</span>
              </div>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#924E00]">
                Play Games While Waiting For Your Food
              </h2>
              <p className="text-xs sm:text-sm text-[#924E00]/80 leading-relaxed font-sans">
                App-free dining games designed for your table. Play classic Klondike Solitaire, solve culinary crosswords, battle companions in multiplayer trivia, or spin the roulette wheel to decide who pays the check.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsArcadeOpen(true)}
              className="h-12 px-7 rounded-full bg-[#F9A620] hover:bg-[#e89512] active:scale-[0.98] text-white font-medium text-sm sm:text-base shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
            >
              <Gamepad2 className="w-4 h-4 text-white" />
              <span>Launch Table Arcade</span>
            </button>
          </div>

          {/* 4 Interactive Game Cards in 3-Color Brand System */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-8">
            {/* Game 1: Solitaire */}
            <div
              onClick={() => setIsArcadeOpen(true)}
              className="p-5 rounded-2xl bg-[#FFF7E6] hover:bg-white border border-[#924E00]/10 hover:border-[#F9A620]/40 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#F9A620]/20 text-xl flex items-center justify-center">
                    🃏
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-[#924E00] border border-[#924E00]/15">
                    Kids → Adults
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#924E00] group-hover:text-[#F9A620] transition-colors">
                  Klondike Solitaire
                </h3>
                <p className="text-xs text-[#924E00]/75 leading-relaxed font-sans">
                  Classic patience cards. Easy (Draw 1 for kids), Medium (Draw 3), and Hard (3-pass limit challenge for adults).
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#924E00]/10 flex items-center justify-between text-xs text-[#924E00] font-semibold">
                <span>Play Solitaire</span>
                <span className="text-[#F9A620] group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Game 2: Crossword */}
            <div
              onClick={() => setIsArcadeOpen(true)}
              className="p-5 rounded-2xl bg-[#FFF7E6] hover:bg-white border border-[#924E00]/10 hover:border-[#F9A620]/40 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#F9A620]/20 text-xl flex items-center justify-center">
                    ✏️
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-[#924E00] border border-[#924E00]/15">
                    Food Quiz
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#924E00] group-hover:text-[#F9A620] transition-colors">
                  Mini Crossword
                </h3>
                <p className="text-xs text-[#924E00]/75 leading-relaxed font-sans">
                  Quick 5x5 culinary word puzzles. Simple clues for children, gourmet ingredients for culinary masters.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#924E00]/10 flex items-center justify-between text-xs text-[#924E00] font-semibold">
                <span>Solve Puzzle</span>
                <span className="text-[#F9A620] group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Game 3: Table Battle Trivia */}
            <div
              onClick={() => setIsArcadeOpen(true)}
              className="p-5 rounded-2xl bg-[#FFF7E6] hover:bg-white border border-[#924E00]/10 hover:border-[#F9A620]/40 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#F9A620]/20 text-xl flex items-center justify-center">
                    🧠
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-[#924E00] border border-[#924E00]/15">
                    Multiplayer
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#924E00] group-hover:text-[#F9A620] transition-colors">
                  Table Battle Trivia
                </h3>
                <p className="text-xs text-[#924E00]/75 leading-relaxed font-sans">
                  Fast-paced buzzer trivia. Food origins, Bollywood cuisine, and spicy culinary history.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#924E00]/10 flex items-center justify-between text-xs text-[#924E00] font-semibold">
                <span>Start Trivia</span>
                <span className="text-[#F9A620] group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Game 4: Bill Roulette */}
            <div
              onClick={() => setIsArcadeOpen(true)}
              className="p-5 rounded-2xl bg-[#FFF7E6] hover:bg-white border border-[#924E00]/10 hover:border-[#F9A620]/40 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#F9A620]/20 text-xl flex items-center justify-center">
                    🎲
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-[#924E00] border border-[#924E00]/15">
                    Who Pays?
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#924E00] group-hover:text-[#F9A620] transition-colors">
                  Bill Roulette
                </h3>
                <p className="text-xs text-[#924E00]/75 leading-relaxed font-sans">
                  Interactive spinning wheel. Silly dares &amp; treats for kids, friendly social forfeits for teens, or real dining check for adults.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#924E00]/10 flex items-center justify-between text-xs text-[#924E00] font-semibold">
                <span>Spin Roulette</span>
                <span className="text-[#F9A620] group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. ABOUT: PHILOSOPHY & INDEPENDENT DINING                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="about" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-[#924E00]/10">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="w-10 h-10 rounded-full bg-[#F9A620] flex items-center justify-center text-white font-serif font-bold mx-auto shadow-xs">
            M
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#924E00]">
            The Menuz Hospitality Philosophy
          </h2>
          <p className="text-xs sm:text-sm text-[#924E00]/80 leading-relaxed font-sans">
            Menuz empowers restaurants to stay independent with zero percent commission on dining food sales, instant direct thermal kitchen printing, and app-free table QR experiences.
          </p>
          <div className="pt-2 text-xs font-semibold text-[#924E00]/70 flex items-center justify-center space-x-4">
            <span>0% Commission</span>
            <span>•</span>
            <span>Direct Ordering</span>
            <span>•</span>
            <span>Verified Partners</span>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 7. FOOTER                                                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <footer className="mt-auto py-8 border-t border-[#924E00]/10 bg-white/40 text-center text-xs text-[#924E00]/60 space-y-2">
        <div className="flex items-center justify-center space-x-6 text-[11px] text-[#924E00]/70">
          <button onClick={() => scrollToSection('discover')} className="hover:text-[#924E00] cursor-pointer">Discover</button>
          <span>•</span>
          <button onClick={() => scrollToSection('restaurants')} className="hover:text-[#924E00] cursor-pointer">Restaurants</button>
          <span>•</span>
          <button onClick={() => scrollToSection('experiences')} className="hover:text-[#924E00] cursor-pointer">Experiences</button>
          <span>•</span>
          <button onClick={() => scrollToSection('arcade')} className="hover:text-[#924E00] cursor-pointer">Arcade</button>
          <span>•</span>
          <button onClick={() => scrollToSection('about')} className="hover:text-[#924E00] cursor-pointer">About</button>
        </div>
        <p className="text-[10px]">
          © {new Date().getFullYear()} Menuz Technologies. Golden-Hour Dining in Pune.
        </p>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-4 sm:left-6 z-40">
        <button
          type="button"
          onClick={() => handleOpenAi()}
          className="h-12 px-4 sm:px-5 rounded-full bg-white hover:bg-[#FFF7E6] active:scale-[0.98] text-[#924E00] border-2 border-[#F9A620] font-bold text-xs sm:text-sm flex items-center space-x-2.5 shadow-[0_8px_25px_rgba(249,166,32,0.3)] transition-all cursor-pointer backdrop-blur-md ring-4 ring-[#F9A620]/15"
          aria-label="Ask AI Dining Concierge"
        >
          <span className="text-base">✨</span>
          <div className="flex flex-col text-left">
            <span className="flex items-center space-x-1.5 leading-tight">
              <span>Ask Chef AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </span>
            <span className="text-[10px] text-[#924E00]/65 font-normal hidden sm:inline">24/7 Table &amp; Menu Assistant</span>
          </div>
        </button>
      </div>

      <div className="fixed bottom-6 right-4 sm:right-6 z-40">
        <button
          type="button"
          onClick={() => handleOpenScanner()}
          className="h-12 px-4 sm:px-5 rounded-full bg-[#F9A620] hover:bg-[#e89512] active:scale-[0.98] text-white font-medium text-xs sm:text-sm flex items-center space-x-2 shadow-lg transition-all cursor-pointer"
          aria-label="Scan Table QR Code"
        >
          <QrCode className="w-4 h-4 text-white" />
          <span>Scan Table</span>
        </button>
      </div>

      {/* Share Toast */}
      {shareToastOpen && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#924E00] text-white px-4 py-2.5 rounded-full shadow-lg text-xs font-medium flex items-center space-x-2 animate-in fade-in duration-150">
          <Check className="w-3.5 h-3.5 text-[#F9A620]" />
          <span>Link copied to clipboard!</span>
        </div>
      )}

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        defaultRestaurantSlug={selectedScannerSlug}
      />

      {/* Table Arcade Modal */}
      <TableArcadeModal
        isOpen={isArcadeOpen}
        onClose={() => setIsArcadeOpen(false)}
        tableLabel="Diner Table"
        restaurantName="Menuz Dining Experience"
      />

      {/* Win Challenge Modal */}
      <WinChallengeModal
        isOpen={isWinChallengeOpen}
        onClose={() => setIsWinChallengeOpen(false)}
        targetRestaurant={winChallengeVenue || affiliatedVenues[0]?.rawRest}
      />

      {/* AI Dining Concierge Chatbot Drawer */}
      <AiAssistantDrawer
        isOpen={isAiOpen}
        onClose={() => {
          setIsAiOpen(false);
          setAiInitialQuery(null);
        }}
        initialQuery={aiInitialQuery}
        focusDish={null}
        onConfirmAdd={() => {
          if (affiliatedVenues[0]) {
            handleLaunchTable(affiliatedVenues[0]);
          }
        }}
      />
    </div>
  );
};

export default CustomerHomePage;
