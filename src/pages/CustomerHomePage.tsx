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
  Clock,
  CheckCircle2,
  Bookmark,
  Check,
  ChevronRight,
  Users,
  Flame,
  Award,
  Layers
} from 'lucide-react';
import { useRestaurantStore, isDishNameAsRestaurant } from '../store/restaurantStore';
import { isWorkingWithMenuz, Restaurant } from '../types';
import { QrScannerModal } from '../components/QrScannerModal';
import { TableArcadeModal } from '../components/TableArcadeModal';
import { WinChallengeModal } from '../components/WinChallengeModal';

// Curated Golden Hour Collections
const CURATED_COLLECTIONS = [
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
  { id: 'all', label: 'All Curations', icon: Compass, count: '30+' },
  { id: 'fine-dining', label: 'Fine Dining', icon: Wine, count: '12 Spots' },
  { id: 'cafes', label: 'Artisan Cafés', icon: Coffee, count: '18 Spots' },
  { id: 'bars', label: 'Bars & Lounges', icon: GlassWater, count: '14 Spots' },
  { id: 'quick-bites', label: 'Gourmet Bites', icon: Pizza, count: '20 Spots' },
  { id: 'desserts', label: 'Desserts & Bakes', icon: Cake, count: '9 Spots' },
  { id: 'rooftop', label: 'Rooftops & Views', icon: Sunset, count: '15 Spots' }
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
  const [shareToastOpen, setShareToastOpen] = useState(false);

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
        title: 'Menuz — Golden Hour Dining Curations',
        text: 'Explore the best restaurants, rooftops, and cafés in Pune on Menuz.',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareToastOpen(true);
      setTimeout(() => setShareToastOpen(false), 2500);
    }
  };

  // Strictly ONLY restaurants affiliated with Menuz
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
          reviewsCount: 148,
          costForTwo: r.cuisine.includes('Italian') ? '₹1,400 for two' : '₹1,200 for two',
          specialty: r.cuisine.includes('Italian')
            ? 'Wood-fired sourdough Neapolitan crusts, hand-rolled pasta & silky tiramisu'
            : 'Dum Pukht slow-cooked Awadhi curries & heritage royal tandoori skewers',
          imageUrl: customImage,
          token: firstTable.public_token,
          tableNumber: firstTable.label,
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
    <div className="min-h-screen bg-[#FFF7E6] text-[#924E00] flex flex-col font-sans selection:bg-[#F9A620]/30 selection:text-[#924E00] relative">
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* AMBIENT GOLDEN-HOUR ORBS (Pure Light Canvas Radiance)         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#F9A620]/15 via-[#FFAE33]/10 to-transparent blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-[#FFAE33]/12 via-[#F9A620]/8 to-transparent blur-[160px]" />
        <div className="absolute bottom-10 left-1/4 w-[700px] h-[400px] rounded-full bg-gradient-to-tr from-[#FFD188]/15 via-[#F9A620]/10 to-transparent blur-[180px]" />
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION: GOLDEN-HOUR IMMERSION                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="discover" className="relative pt-8 sm:pt-16 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Editorial Manifesto & Call to Dine */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Luminous Glass Pill Badge */}
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-white/70 border border-white/80 shadow-[0_4px_20px_rgba(146,78,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-xl text-xs font-semibold text-[#924E00]">
              <span className="w-2 h-2 rounded-full bg-[#F9A620] animate-pulse" />
              <span className="tracking-tight uppercase font-bold text-[11px] text-[#924E00]">
                Golden-Hour Dining
              </span>
              <span className="text-[#924E00]/30">•</span>
              <span className="text-[#924E00]/80">Curated Pune Outlets</span>
            </div>

            {/* Editorial Headline */}
            <div className="space-y-4">
              <h1 className="font-serif font-bold text-4xl sm:text-6xl lg:text-[68px] text-[#924E00] tracking-tight leading-[1.08]">
                Dining That Stays <br className="hidden sm:inline" />
                With You Long After <br className="hidden sm:inline" />
                <span className="italic font-normal text-[#F9A620]">
                  The Sun Sets.
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-[#924E00]/80 max-w-xl leading-relaxed font-sans font-normal">
                Discover sun-drenched rooftops, artisanal sourdough bakeries, and heritage kitchens. Scan any table QR with your camera to browse authentic menus, order together, and unlock tableside culinary perks.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => scrollToSection('featured-restaurants')}
                className="py-3.5 px-7 rounded-2xl bg-gradient-to-r from-[#F9A620] to-[#FFAE33] hover:brightness-105 active:scale-95 text-[#FFF7E6] font-bold text-sm sm:text-base shadow-[0_8px_25px_rgba(249,166,32,0.35)] flex items-center space-x-2.5 transition-all cursor-pointer"
              >
                <span>Explore Restaurants</span>
                <ArrowRight className="w-4 h-4 text-[#FFF7E6]" />
              </button>

              <button
                type="button"
                onClick={() => handleOpenScanner()}
                className="py-3.5 px-6 rounded-2xl bg-white/70 hover:bg-white/95 border border-white/80 shadow-[0_6px_20px_rgba(146,78,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-xl text-[#924E00] font-bold text-sm sm:text-base flex items-center space-x-2 transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-[#F9A620]" />
                <span>Scan Table QR</span>
              </button>
            </div>

            {/* Quick Editorial Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#924E00]/10 max-w-lg">
              <div>
                <div className="font-serif font-black text-2xl text-[#924E00]">129+</div>
                <div className="text-xs text-[#924E00]/70 font-medium">Verified Kitchens</div>
              </div>
              <div className="border-l border-[#924E00]/10 pl-4">
                <div className="font-serif font-black text-2xl text-[#924E00]">0%</div>
                <div className="text-xs text-[#924E00]/70 font-medium">Food Commission</div>
              </div>
              <div className="border-l border-[#924E00]/10 pl-4">
                <div className="font-serif font-black text-2xl text-[#924E00]">Instant</div>
                <div className="text-xs text-[#924E00]/70 font-medium">Table Ordering</div>
              </div>
            </div>

          </div>

          {/* Right: Immersive Food Photography with Floating Glassmorphic Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Rounded Image Canvas with Golden Glow */}
              <div className="relative rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(146,78,0,0.15)] border-4 border-white aspect-[4/5] bg-white">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=85"
                  alt="Golden hour dining table in Pune"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#924E00]/40 via-transparent to-transparent" />
                
                {/* Photo Tag */}
                <div className="absolute bottom-5 left-5 right-5 text-[#FFF7E6]">
                  <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/20">
                    Artisanal Plating
                  </span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl mt-2 leading-tight">
                    Casa Bella &amp; Saffron House
                  </h3>
                  <p className="text-xs text-white/90">Kalyani Nagar &amp; Koregaon Park</p>
                </div>
              </div>

              {/* Floating Glassmorphism Badge 1 (Top Left) */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/80 backdrop-blur-2xl border border-white/90 p-3.5 rounded-2xl shadow-[0_12px_36px_rgba(146,78,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.95)] flex items-center space-x-3 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F9A620] to-[#FFAE33] flex items-center justify-center text-white shadow-md">
                  <Star className="w-5 h-5 fill-white text-white" />
                </div>
                <div>
                  <div className="font-serif font-bold text-sm text-[#924E00]">4.9 Star Verified</div>
                  <div className="text-[11px] text-[#924E00]/70">1,400+ Pune Diner Reviews</div>
                </div>
              </div>

              {/* Floating Glassmorphism Badge 2 (Bottom Right) */}
              <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white/80 backdrop-blur-2xl border border-white/90 p-4 rounded-2xl shadow-[0_12px_36px_rgba(146,78,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.95)] max-w-[210px] space-y-1 animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="flex items-center space-x-1.5 text-[#F9A620]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Multiplayer Cart</span>
                </div>
                <div className="text-xs font-semibold text-[#924E00]">
                  Order Together from Your Phone
                </div>
                <div className="text-[10px] text-[#924E00]/65">Direct Kitchen KOT Printing</div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. DINING CATEGORIES: CURATED SECTORS                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="categories" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F9A620]">
              Explore by Craving
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#924E00]">
              Dining Categories
            </h2>
            <p className="text-sm text-[#924E00]/75 max-w-lg">
              From sun-soaked bakery terraces to intimate candlelit speakeasies, navigate Pune’s culinary map.
            </p>
          </div>

          <div className="text-xs font-semibold text-[#924E00]/80">
            Tap to filter restaurants below
          </div>
        </div>

        {/* Luminous Glass Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          {DINING_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  scrollToSection('featured-restaurants');
                }}
                className={`p-4 rounded-2xl flex flex-col items-center justify-between text-center transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-b from-[#F9A620] to-[#FFAE33] text-[#FFF7E6] shadow-[0_10px_25px_rgba(249,166,32,0.35)] scale-105'
                    : 'bg-white/60 hover:bg-white/90 border border-white/80 shadow-[0_4px_16px_rgba(146,78,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-xl text-[#924E00] hover:-translate-y-1'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#FFF7E6] text-[#F9A620]'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-serif font-bold text-xs sm:text-sm">{cat.label}</div>
                <div className={`text-[10px] mt-1 ${isActive ? 'text-white/80 font-medium' : 'text-[#924E00]/60'}`}>
                  {cat.count}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. CURATED COLLECTIONS: EDITORIAL STORIES                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F9A620]">
              Handcrafted Guides
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#924E00]">
              Curated Collections
            </h2>
            <p className="text-sm text-[#924E00]/75 max-w-lg">
              Themed editions curated by local food writers, chefs, and golden-hour wanderers.
            </p>
          </div>

          <button
            type="button"
            onClick={handleShareCollection}
            className="py-2.5 px-4 rounded-xl bg-white/70 hover:bg-white/95 border border-white/80 shadow-[0_4px_16px_rgba(146,78,0,0.04)] backdrop-blur-xl text-xs font-semibold text-[#924E00] flex items-center space-x-2 transition-all cursor-pointer self-start md:self-auto"
          >
            <Share2 className="w-3.5 h-3.5 text-[#F9A620]" />
            <span>Share Collections</span>
          </button>
        </div>

        {/* 6 Editorial Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CURATED_COLLECTIONS.map((col) => (
            <div
              key={col.id}
              onClick={() => scrollToSection('featured-restaurants')}
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-white/60 border border-white/80 shadow-[0_12px_36px_rgba(146,78,0,0.08)] cursor-pointer transition-all duration-500 hover:-translate-y-1.5"
            >
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#924E00]/85 via-[#924E00]/30 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-white/85 backdrop-blur-md text-[11px] font-bold text-[#924E00] shadow-sm">
                  {col.tag}
                </span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 text-[#FFF7E6] space-y-1">
                <div className="text-[11px] font-semibold text-[#FFD188]">
                  {col.placesCount} Handpicked Outlets
                </div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-white group-hover:text-[#FFD188] transition-colors leading-tight">
                  {col.title}
                </h3>
                <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                  {col.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. FEATURED RESTAURANTS: LARGE PHOTOGRAPHY & DIRECT SELECTION */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="featured-restaurants" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Section Header with Search Bar */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/80 p-6 sm:p-8 rounded-[32px] shadow-[0_16px_50px_rgba(146,78,0,0.06)] space-y-6 mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F9A620]">
                Verified Partner Catalog
              </span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#924E00]">
                Featured Pune Restaurants
              </h2>
              <p className="text-sm text-[#924E00]/75">
                Every venue is equipped with Menuz live tableside QR ordering and digital kitchens.
              </p>
            </div>

            {/* Instant Search Bar */}
            <div className="relative min-w-[280px] sm:min-w-[340px]">
              <Search className="w-4 h-4 text-[#924E00]/50 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by restaurant name, cuisine, locality..."
                className="w-full py-3 pl-10 pr-9 text-xs sm:text-sm bg-[#FFF7E6]/70 text-[#924E00] placeholder:text-[#924E00]/50 rounded-2xl border border-[#924E00]/15 focus:outline-none focus:border-[#F9A620] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-xs text-[#924E00]/60 hover:text-[#924E00]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Active Category Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pt-2">
            <span className="text-xs font-bold text-[#924E00]/60 shrink-0">Filter:</span>
            {DINING_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#F9A620] text-[#FFF7E6] shadow-sm'
                    : 'bg-white/50 text-[#924E00]/80 hover:bg-white border border-[#924E00]/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant Cards Grid (Glassmorphism & Large Imagery) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredVenues.map((venue) => {
            const isFavorite = savedFavorites.includes(venue.slug);
            return (
              <div
                key={venue.slug}
                className="bg-white/70 backdrop-blur-xl border border-white/80 hover:border-[#F9A620]/40 rounded-[32px] overflow-hidden shadow-[0_12px_40px_rgba(146,78,0,0.06)] hover:shadow-[0_20px_50px_rgba(249,166,32,0.14)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col group"
              >
                {/* Photo Banner */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#FFF7E6]">
                  <img
                    src={venue.imageUrl}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top Left Badges */}
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-[#924E00] flex items-center space-x-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-[#F9A620] text-[#F9A620]" />
                      <span>{venue.rating}</span>
                      <span className="text-[10px] text-[#924E00]/60">({venue.reviewsCount})</span>
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#FFF7E6]/90 backdrop-blur-md border border-[#F9A620]/30 text-[#924E00] text-[11px] font-bold shadow-sm">
                      Menuz Partner
                    </span>
                  </div>

                  {/* Top Right: Favorite Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(venue.slug);
                    }}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center shadow-md text-[#924E00] hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#F9A620] text-[#F9A620]' : 'text-[#924E00]'}`} />
                  </button>

                  {/* Bottom Details on Image */}
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <h3 className="font-serif font-bold text-2xl text-white group-hover:text-[#FFD188] transition-colors">
                      {venue.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-white/90 mt-1">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-[#F9A620]" />
                        <span>{venue.location}</span>
                      </span>
                      <span>•</span>
                      <span>{venue.costForTwo}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body & Ordering Controls */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#F9A620]">
                      {venue.cuisine}
                    </div>
                    <p className="text-xs sm:text-sm text-[#924E00]/80 leading-relaxed font-sans">
                      {venue.specialty}
                    </p>
                  </div>

                  {/* Action Row */}
                  <div className="pt-4 border-t border-[#924E00]/10 flex flex-wrap items-center gap-2.5">
                    
                    {/* Primary Button: View Scanned Menu */}
                    <button
                      type="button"
                      onClick={() => handleLaunchTable(venue)}
                      className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#F9A620] to-[#FFAE33] hover:brightness-105 active:scale-95 text-[#FFF7E6] font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-[0_4px_16px_rgba(249,166,32,0.3)] transition-all cursor-pointer"
                    >
                      <UtensilsCrossed className="w-4 h-4 text-[#FFF7E6]" />
                      <span>View Menu &amp; Order</span>
                      <ArrowRight className="w-4 h-4 text-[#FFF7E6]" />
                    </button>

                    {/* Review Roulette perk button */}
                    <button
                      type="button"
                      onClick={() => handleOpenWinChallenge(venue)}
                      className="py-3 px-4 rounded-2xl bg-white/80 hover:bg-white border border-[#924E00]/15 text-[#924E00] font-bold text-xs sm:text-sm flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                      title="Unlock Tableside Treats"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F9A620]" />
                      <span>Perks</span>
                    </button>

                    {/* Scan QR */}
                    <button
                      type="button"
                      onClick={() => handleOpenScanner(venue.slug)}
                      className="p-3 rounded-2xl bg-white/80 hover:bg-white border border-[#924E00]/15 text-[#924E00] shadow-sm transition-all cursor-pointer"
                      title={`Scan Table QR for ${venue.name}`}
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
          <div className="text-center py-16 bg-white/60 backdrop-blur-xl border border-white/80 rounded-[32px] space-y-3">
            <UtensilsCrossed className="w-10 h-10 text-[#924E00]/40 mx-auto" />
            <h3 className="font-serif font-bold text-xl text-[#924E00]">No Matching Restaurants</h3>
            <p className="text-xs sm:text-sm text-[#924E00]/70 max-w-sm mx-auto">
              No verified restaurant matches your search criteria. Try searching for "Saffron House", "Italian", or "Koregaon Park".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="text-xs font-bold text-[#F9A620] hover:underline cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. SIGNATURE EXPERIENCES: VISUAL STORIES                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="experiences" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F9A620]">
            The Art of Hospitality
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-5xl text-[#924E00]">
            Signature Experiences
          </h2>
          <p className="text-sm sm:text-base text-[#924E00]/75">
            Every memorable meal is more than food—it’s the lighting, the craft, the table conversations, and the warmth of the evening.
          </p>
        </div>

        {/* 3 Story Cards with Glassmorphism Overlay */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Story 1 */}
          <div className="bg-white/70 backdrop-blur-2xl border border-white/80 p-6 sm:p-8 rounded-[32px] shadow-[0_12px_40px_rgba(146,78,0,0.06)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F9A620]/15 flex items-center justify-center text-[#924E00]">
                <Flame className="w-6 h-6 text-[#F9A620]" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#924E00]">
                The Chef's Tasting Table
              </h3>
              <p className="text-sm text-[#924E00]/80 leading-relaxed font-sans">
                Experience slow-cooked Dum Pukht pots sealed with wheat dough, simmering for 12 hours with Lucknow saffron and Kashmir cardamom.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-[#FFF7E6]">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80"
                alt="Chef tasting table"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Story 2 */}
          <div className="bg-white/70 backdrop-blur-2xl border border-white/80 p-6 sm:p-8 rounded-[32px] shadow-[0_12px_40px_rgba(146,78,0,0.06)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F9A620]/15 flex items-center justify-center text-[#924E00]">
                <Sunset className="w-6 h-6 text-[#F9A620]" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#924E00]">
                Sunset Sourdough &amp; Spritzes
              </h3>
              <p className="text-sm text-[#924E00]/80 leading-relaxed font-sans">
                Hand-stretched Neapolitan crusts baked at 450°C in oak wood-fired ovens, paired with blood orange spritzes as dusk settles over the city.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-[#FFF7E6]">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80"
                alt="Neapolitan pizza and spritz"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Story 3 */}
          <div className="bg-white/70 backdrop-blur-2xl border border-white/80 p-6 sm:p-8 rounded-[32px] shadow-[0_12px_40px_rgba(146,78,0,0.06)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F9A620]/15 flex items-center justify-center text-[#924E00]">
                <Users className="w-6 h-6 text-[#F9A620]" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#924E00]">
                Multiplayer Tableside Dining
              </h3>
              <p className="text-sm text-[#924E00]/80 leading-relaxed font-sans">
                No passing one paper menu around. Every guest scans with their own phone, building a synchronized table cart that fires tickets straight to the kitchen.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-[#FFF7E6]">
              <img
                src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=700&auto=format&fit=crop&q=80"
                alt="Friends dining together"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. SOCIAL DISCOVERY: FAVOURITES & PLAN WITH FRIENDS           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="social-discovery" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-r from-white/90 via-[#FFF7E6]/95 to-white/90 border border-white/95 rounded-[36px] p-8 sm:p-12 shadow-[0_16px_50px_rgba(146,78,0,0.08)] backdrop-blur-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F9A620]/15 text-[#924E00] text-xs font-bold border border-[#F9A620]/30">
              <Heart className="w-3.5 h-3.5 fill-[#F9A620] text-[#F9A620]" />
              <span>Social-First Dining</span>
            </div>

            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#924E00]">
              Save Favourites. Plan Meals with Friends.
            </h2>

            <p className="text-sm sm:text-base text-[#924E00]/80 leading-relaxed">
              Create your personal hit-list of Pune restaurants. Share your curated collection link with dining companions, or tap to play the tableside reward challenge for instant discounts.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleShareCollection}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#F9A620] to-[#FFAE33] hover:brightness-105 active:scale-95 text-[#FFF7E6] font-bold text-sm shadow-[0_6px_20px_rgba(249,166,32,0.3)] flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#FFF7E6]" />
                <span>Share Collection with Friends</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenWinChallenge()}
                className="py-3 px-6 rounded-2xl bg-white/80 hover:bg-white border border-[#924E00]/20 text-[#924E00] font-bold text-sm shadow-sm flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#F9A620]" />
                <span>Review &amp; Unlock Treats</span>
              </button>
            </div>
          </div>

          {/* Right: Saved Favorites Glass Box */}
          <div className="lg:col-span-5 bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_8px_30px_rgba(146,78,0,0.06)] space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#924E00]/10 text-xs font-bold text-[#924E00]">
              <span>YOUR SAVED LIST ({savedFavorites.length})</span>
              <span className="text-[#F9A620]">Live Sync</span>
            </div>

            <div className="space-y-2">
              {affiliatedVenues.slice(0, 3).map((v) => {
                const isFav = savedFavorites.includes(v.slug);
                return (
                  <div
                    key={v.slug}
                    onClick={() => handleLaunchTable(v)}
                    className="p-3 rounded-2xl bg-[#FFF7E6]/70 hover:bg-[#FFF7E6] border border-[#924E00]/10 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img src={v.imageUrl} alt={v.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="font-serif font-bold text-sm text-[#924E00] truncate">{v.name}</div>
                        <div className="text-[11px] text-[#924E00]/70 truncate">{v.location}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(v.slug);
                      }}
                      className="p-2 text-[#F9A620]"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-[#F9A620]' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 7. ABOUT MENUZ: QUALITY & TRANSPARENCY                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="about" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 p-8 sm:p-12 rounded-[36px] shadow-[0_12px_40px_rgba(146,78,0,0.05)] text-center space-y-4 max-w-4xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F9A620] to-[#FFAE33] flex items-center justify-center text-white font-serif font-bold text-2xl mx-auto shadow-md">
            M
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#924E00]">
            The Menuz Hospitality Philosophy
          </h2>
          <p className="text-sm sm:text-base text-[#924E00]/80 leading-relaxed font-sans max-w-2xl mx-auto">
            Menuz empowers restaurants to stay independent with zero percent commission on dining food sales, instant direct thermal kitchen printing, and app-free table QR experiences.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-[#924E00]/70">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#F9A620]" />
              <span>0% Food Commission</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#F9A620]" />
              <span>100% Direct Diner Ownership</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#F9A620]" />
              <span>Verified Pune Landmark Partners</span>
            </span>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 8. EDITORIAL FOOTER                                           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <footer className="mt-12 py-12 border-t border-[#924E00]/10 bg-white/40 backdrop-blur-md text-center text-xs text-[#924E00]/70 space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#F9A620] to-[#FFAE33] flex items-center justify-center font-serif font-black text-[#FFF7E6] text-xs shadow-xs">
            M
          </div>
          <span className="font-serif font-black text-base text-[#924E00]">menuz</span>
        </div>
        
        <p className="text-xs text-[#924E00]/80">
          Golden-Hour Dining &amp; Tableside Restaurant Discovery • Pune, Maharashtra
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-[11px] text-[#924E00]/60">
          <button onClick={() => scrollToSection('discover')} className="hover:text-[#924E00] cursor-pointer">Discover</button>
          <span>•</span>
          <button onClick={() => scrollToSection('categories')} className="hover:text-[#924E00] cursor-pointer">Categories</button>
          <span>•</span>
          <button onClick={() => scrollToSection('featured-restaurants')} className="hover:text-[#924E00] cursor-pointer">Restaurants</button>
          <span>•</span>
          <button onClick={() => scrollToSection('experiences')} className="hover:text-[#924E00] cursor-pointer">Experiences</button>
          <span>•</span>
          <button onClick={() => scrollToSection('about')} className="hover:text-[#924E00] cursor-pointer">About</button>
        </div>

        <div className="text-[10px] text-[#924E00]/45 pt-2">
          © {new Date().getFullYear()} Menuz Technologies. All rights reserved.
        </div>
      </footer>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FLOATING GLASS ACTION BAR (Mobile & Desktop)                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-3">
        {/* Quick Scan QR Floating Button */}
        <button
          type="button"
          onClick={() => handleOpenScanner()}
          className="py-3 px-5 rounded-full bg-gradient-to-r from-[#F9A620] to-[#FFAE33] hover:brightness-105 active:scale-95 text-[#FFF7E6] font-bold text-xs sm:text-sm shadow-[0_8px_25px_rgba(249,166,32,0.4)] flex items-center space-x-2 transition-all cursor-pointer"
        >
          <QrCode className="w-4 h-4 text-[#FFF7E6]" />
          <span>Scan Table</span>
        </button>
      </div>

      {/* Share Toast */}
      {shareToastOpen && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#924E00] text-[#FFF7E6] px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in zoom-in-95 duration-150">
          <Check className="w-4 h-4 text-[#F9A620]" />
          <span>Curated dining link copied to clipboard!</span>
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
    </div>
  );
};

export default CustomerHomePage;
