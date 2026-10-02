import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Sparkles,
  Flame,
  AlertCircle,
  Bell,
  ChevronDown,
  Star,
  ArrowUp,
  Award,
  CheckCircle2,
  Gift,
  X,
  Copy,
  Check,
  ArrowLeftRight,
  Instagram,
  Users,
  ShieldCheck
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { MenuItem, ReviewChallenge } from '../types';
import { DishDetailModal } from '../components/DishDetailModal';
import { CartDrawer } from '../components/CartDrawer';
import { AiAssistantDrawer } from '../components/AiAssistantDrawer';
import { OrderTrackerModal } from '../components/OrderTrackerModal';
import { SpinWheelModal } from '../components/SpinWheelModal';
import { SwitchRestaurantModal } from '../components/SwitchRestaurantModal';
import { InstagramStoryModal } from '../components/InstagramStoryModal';
import { LanguageSelector } from '../components/LanguageSelector';
import { TRANSLATIONS, getCategoryTitle } from '../utils/i18n';
import { PUNE_RESTAURANT_DIRECTORY } from '../data/puneRestaurantDirectory';
import { generateCuisineMenu } from '../data/cuisineMenuGenerator';


export const DinerMenu: React.FC = () => {
  const { restaurantSlug, tableId } = useParams<{ restaurantSlug: string; tableId?: string }>();
  const [searchParams] = useSearchParams();
  const tableToken = searchParams.get('t') || tableId || '';

  const restaurants = useRestaurantStore((state) => state.restaurants);
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const setCurrentRestaurant = useRestaurantStore((state) => state.setCurrentRestaurant);
  const addRestaurant = useRestaurantStore((state) => state.addRestaurant);
  const tables = useRestaurantStore((state) => state.tables);
  const categories = useRestaurantStore((state) => state.categories);
  const menuItems = useRestaurantStore((state) => state.menuItems);
  const cart = useRestaurantStore((state) => state.cart);
  const challenges = useRestaurantStore((state) => state.challenges);
  const reviews = useRestaurantStore((state) => state.reviews);
  const activeTable = useRestaurantStore((state) => state.activeTable);
  const setActiveTable = useRestaurantStore((state) => state.setActiveTable);
  const activeOrderId = useRestaurantStore((state) => state.activeOrderId);
  const setActiveOrderId = useRestaurantStore((state) => state.setActiveOrderId);
  const addItemToCart = useRestaurantStore((state) => state.addItemToCart);
  const callWaiter = useRestaurantStore((state) => state.callWaiter);
  const completeChallenge = useRestaurantStore((state) => state.completeChallenge);
  const selectedLanguage = useRestaurantStore((state) => state.selectedLanguage);
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);

  // Sync route restaurantSlug with active restaurant in store (auto-creating if from Pune directory)
  useEffect(() => {
    if (restaurantSlug) {
      const match = restaurants.find((r) => r.slug === restaurantSlug);
      if (match) {
        if (match.id !== restaurant.id) {
          setCurrentRestaurant(match.id);
        }
      } else {
        const dir = PUNE_RESTAURANT_DIRECTORY.find(
          (p) => p.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') === restaurantSlug
        );
        if (dir) {
          addRestaurant({
            id: `rest-${restaurantSlug}`,
            slug: restaurantSlug,
            name: dir.name,
            cuisine: dir.cuisine,
            location: dir.location,
            logo_url: dir.imageUrl,
            brand_colors: {
              primary: '#E85D04',
              background: '#FDFBF7',
              text: '#1C1917',
              accent: '#C84B00'
            },
            currency: 'INR',
            tax_rate_percent: 5.0,
            google_place_url: `https://search.google.com/local/writereview?placeid=${restaurantSlug}`
          });
        }
      }
    }
  }, [restaurantSlug, restaurants, restaurant.id, setCurrentRestaurant, addRestaurant]);

  // Scoped dishes, categories, and tables for this restaurant
  const currentRestMenuItems = useMemo(() => {
    const list = menuItems.filter((m) => m.restaurant_id === restaurant.id);
    if (list.length > 0) return list;
    return generateCuisineMenu(
      restaurant.id,
      restaurant.slug || 'menu',
      restaurant.cuisine,
      restaurant.name
    ).dishes;
  }, [menuItems, restaurant.id, restaurant.slug, restaurant.cuisine, restaurant.name]);

  const currentRestCategories = useMemo(() => {
    const list = categories.filter((c) => c.restaurant_id === restaurant.id);
    if (list.length > 0) return list;
    return generateCuisineMenu(
      restaurant.id,
      restaurant.slug || 'menu',
      restaurant.cuisine,
      restaurant.name
    ).categories;
  }, [categories, restaurant.id, restaurant.slug, restaurant.cuisine, restaurant.name]);

  const restaurantChallenges = useMemo(() => {
    const list = challenges.filter((c) => c.restaurant_id === restaurant.id && c.is_active);
    return list.length > 0 ? list : challenges.filter((c) => c.is_active);
  }, [challenges, restaurant.id]);

  const restaurantReviews = useMemo(() => {
    const list = reviews.filter((r) => r.restaurant_id === restaurant.id);
    return list.length > 0 ? list : reviews;
  }, [reviews, restaurant.id]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDish, setActiveDish] = useState<MenuItem | null>(null);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [aiFocusDish, setAiFocusDish] = useState<MenuItem | null>(null);
  const [aiInitialQuery, setAiInitialQuery] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [waiterToast, setWaiterToast] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleOpenAi = (dish: MenuItem | null = null, query: string | null = null) => {
    setAiFocusDish(dish);
    setAiInitialQuery(query);
    setIsAiOpen(true);
  };

  // Challenge & Wheel modal state
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [challengeModalMode, setChallengeModalMode] = useState<'review' | 'wheel'>('review');
  const [selectedChallenge, setSelectedChallenge] = useState<ReviewChallenge | null>(null);

  // Reward teaser banner dismiss state
  const [rewardBannerDismissed, setRewardBannerDismissed] = useState(false);

  // Instagram Story Foodie Card state
  const [isInstagramStoryOpen, setIsInstagramStoryOpen] = useState(false);
  const [tableSyncAlert, setTableSyncAlert] = useState<string | null>(null);
  const [activeTableGuests, setActiveTableGuests] = useState<number>(2);
  const [forceHappyHourDemo, setForceHappyHourDemo] = useState<boolean>(true);

  // Smart Happy Hour & Dynamic Pricing Active Status
  const isHappyHourActive = useMemo(() => {
    if (forceHappyHourDemo) return true;
    const hh = restaurant.happy_hour_config;
    if (!hh || !hh.enabled) return false;
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();
    const [sH, sM] = (hh.start_time || '16:00').split(':').map(Number);
    const [eH, eM] = (hh.end_time || '19:30').split(':').map(Number);
    return currentMin >= (sH * 60 + sM) && currentMin <= (eH * 60 + eM);
  }, [restaurant.happy_hour_config, forceHappyHourDemo]);

  // Real-time Table Cart Multiplayer Broadcast Listener
  useEffect(() => {
    if (!activeTable?.public_token || typeof BroadcastChannel === 'undefined') return;
    const channelName = `menuz_table_sync_${activeTable.public_token}`;
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(channelName);
      channel.onmessage = (event) => {
        if (event.data?.type === 'SYNC_CART_ACTION') {
          setTableSyncAlert(event.data.message || 'Companion diner updated the shared table tray');
          setTimeout(() => setTableSyncAlert(null), 4000);
        }
      };
    } catch (e) {}

    return () => {
      try {
        channel?.close();
      } catch (e) {}
    };
  }, [activeTable?.public_token]);

  // Scrollytelling section refs
  const heroRef = useRef<HTMLDivElement>(null);
  const menuSectionRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // Table Token Verification
  useEffect(() => {
    const restTables = tables.filter((t) => t.restaurant_id === restaurant.id);
    const cleanToken = tableToken.toLowerCase().trim();
    const matchedTable =
      (cleanToken
        ? restTables.find(
            (t) =>
              (t.public_token === tableToken ||
                t.id.toLowerCase() === cleanToken ||
                t.label.toLowerCase() === cleanToken ||
                t.label.toLowerCase() === `table ${cleanToken}` ||
                t.label.toLowerCase() === `table ${cleanToken.replace(/[^0-9]/g, '')}`) &&
              t.is_active
          ) ||
          tables.find(
            (t) =>
              (t.public_token === tableToken ||
                t.id.toLowerCase() === cleanToken ||
                t.label.toLowerCase() === cleanToken ||
                t.label.toLowerCase() === `table ${cleanToken}` ||
                t.label.toLowerCase() === `table ${cleanToken.replace(/[^0-9]/g, '')}`) &&
              t.is_active
          )
        : null) ||
      restTables[0] ||
      tables[0] || {
        id: 'tbl-01',
        restaurant_id: restaurant?.id || 'rest-saffron-house-01',
        label: 'Table 1',
        public_token: 'table-token-01-saffron',
        is_active: true
      };

    if (!activeTable || activeTable.id !== matchedTable.id || activeTable.restaurant_id !== matchedTable.restaurant_id) {
      setActiveTable(matchedTable);
    }
    setErrorMsg(null);

    // Ensure session ID safely
    try {
      if (typeof window !== 'undefined' && 'sessionStorage' in window && window.sessionStorage) {
        if (!window.sessionStorage.getItem('menuz_session_id')) {
          const uid =
            typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
              ? crypto.randomUUID()
              : Date.now().toString(36) + Math.random().toString(36).slice(2);
          window.sessionStorage.setItem('menuz_session_id', 'sess_' + uid);
        }
      }
    } catch (e) {}
  }, [tableToken, tables, setActiveTable, restaurant.id, activeTable?.id, activeTable?.restaurant_id]);

  // Reset selected category, search query, and active dish whenever the venue or route slug changes
  useEffect(() => {
    setSelectedCategory('all');
    setSearchQuery('');
    setActiveDish(null);
  }, [restaurantSlug, restaurant.id]);

  // Track scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const opts = Array.isArray(item.selected_options) ? item.selected_options : [];
      const optsSum = opts.reduce((s, o) => s + (Number(o?.price_modifier) || 0), 0);
      const itemPrice = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
      return sum + (itemPrice + optsSum) * (item.quantity || 1);
    }, 0);
  }, [cart]);

  const filteredDishes = useMemo(() => {
    return currentRestMenuItems.filter((dish) => {
      if (!dish) return false;
      const matchesCat = selectedCategory === 'all' || dish.category_id === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const ingredients = Array.isArray(dish.ingredients) ? dish.ingredients : [];
      const dishName = dish.name || '';
      const dishDesc = dish.short_description || dish.full_description || '';
      const matchesSearch =
        !q ||
        dishName.toLowerCase().includes(q) ||
        dishDesc.toLowerCase().includes(q) ||
        ingredients.some((ing) => (ing || '').toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [currentRestMenuItems, selectedCategory, searchQuery]);

  // Group dishes by category for scrollytelling sections with defensive fallback
  const dishesByCategory = useMemo(() => {
    if (selectedCategory !== 'all') {
      const foundCat = currentRestCategories.find((c) => c && c.id === selectedCategory);
      if (foundCat) {
        return [{ category: foundCat, items: filteredDishes }];
      }
    }
    return currentRestCategories
      .filter((cat) => cat && filteredDishes.some((d) => d && d.category_id === cat.id))
      .map((cat) => ({
        category: cat,
        items: filteredDishes.filter((d) => d && d.category_id === cat.id)
      }));
  }, [currentRestCategories, filteredDishes, selectedCategory]);

  const handleCallWaiter = () => {
    const restId = restaurant?.id || 'rest-saffron-house-01';
    const tblId = activeTable?.id || 'tbl-01';
    const tblLabel = activeTable?.label || 'Table 1';
    callWaiter(restId, tblId, tblLabel);
    setWaiterCalled(true);
    setWaiterToast(`🛎️ Waiter alerted for ${tblLabel}! A team member is heading to your table.`);
    setTimeout(() => {
      setWaiterCalled(false);
      setWaiterToast(null);
    }, 4500);
  };

  const handleOpenChallenge = (chal?: ReviewChallenge, mode: 'review' | 'wheel' = 'review') => {
    if (chal) {
      setSelectedChallenge(chal);
    } else if (restaurantChallenges.length > 0) {
      setSelectedChallenge(restaurantChallenges[0]);
    } else if (challenges.length > 0) {
      setSelectedChallenge(challenges[0]);
    }
    setChallengeModalMode(mode);
    setIsChallengeModalOpen(true);
  };

  const scrollToMenu = () => {
    menuSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#090D16] text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0D1322] rounded-3xl p-6 shadow-2xl text-center border border-red-500/30">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="font-serif text-xl font-bold text-white mb-2">QR Code Issue</h2>
          <p className="text-slate-300 text-sm mb-4 leading-relaxed">{errorMsg}</p>
          <Link
            to="/admin"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Go to Admin HQ</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={mainRef} className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#090D16] text-slate-100 pb-28">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* LIVE TOAST: WAITER CALLED NOTIFICATION                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {waiterCalled && (
        <div className="fixed top-4 left-4 right-4 max-w-sm mx-auto z-50 bg-[#0D1322] text-white p-3.5 rounded-2xl  border border-amber-500/50 flex items-center space-x-3 animate-slideDown">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0 text-slate-950">
            <Bell className="w-4 h-4 text-slate-950 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-serif font-bold text-xs text-white">Waiter Alert Sent!</p>
            <p className="text-[10px] text-slate-400">
              Staff has been notified for {activeTable?.label || 'your table'}. A server is on their way.
            </p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 0. STREAMLINED DINER TOP BAR (MOBILE-FIRST)                 */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-30 bg-[#0A0E17]/95 backdrop-blur-md text-white border-b border-white/[0.08] px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between shadow-sm">
        {/* Link back to Menuz Home */}
        <Link
          to="/"
          className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors group flex-shrink-0"
          title="Back to Menuz Home"
        >
          <span className="w-5 h-5 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center font-bold text-[10px] text-slate-950 shadow-sm">
            M
          </span>
          <span className="font-serif font-black text-white group-hover:text-amber-400 transition-colors text-sm sm:text-base">
            menuz
          </span>
          <span className="text-[10px] text-slate-500 hidden md:inline">• Home</span>
        </Link>

        {/* Language selector & Switch Restaurant & Admin */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Always-visible Admin Page Top Button (Mandatory Top Pin) */}
          <Link
            to="/admin"
            className="py-1 px-2 sm:px-2.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-[10px] sm:text-[11px] font-bold flex items-center space-x-1 sm:space-x-1.5 transition-all shadow-sm active:scale-95 flex-shrink-0"
            title="Open Master Admin Control Hub"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline sm:inline">Admin HQ</span>
            <span className="xs:hidden sm:hidden">Admin</span>
          </Link>

          <LanguageSelector />

          <button
            type="button"
            onClick={() => setIsSwitchModalOpen(true)}
            className="py-1 px-2 sm:px-3 rounded-full bg-[#090D16]/[0.05] hover:bg-white/[0.1] text-amber-400 hover:text-amber-300 border border-amber-500/30 text-[10px] sm:text-[11px] font-bold flex items-center space-x-1 sm:space-x-1.5 transition-all shadow-sm active:scale-95 cursor-pointer flex-shrink-0"
            title="Switch Restaurant or Scan a New Table QR Code"
          >
            <ArrowLeftRight className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Switch Restaurant</span>
            <span className="sm:hidden">Switch</span>
          </button>

          {cart.length > 0 && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 rounded-lg text-slate-300 hover:text-white bg-[#090D16]/[0.06] border border-white/[0.08] transition-colors flex-shrink-0"
              title="Open Table Cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* LIVE TABLE SYNC TOAST                                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {tableSyncAlert && (
        <div className="fixed top-14 left-4 right-4 max-w-sm mx-auto z-40 bg-emerald-950/90 text-white p-3 rounded-2xl  border border-emerald-500/40 flex items-center space-x-2.5 animate-slideDown">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-serif font-bold text-xs text-white leading-tight">Live Table Sync</p>
            <p className="text-[10px] text-emerald-300 truncate">{tableSyncAlert}</p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SMART HAPPY HOUR ACTIVE BANNER                             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isHappyHourActive && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white px-4 py-2 flex items-center justify-between text-xs font-bold shadow-md">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#090D16] animate-ping" />
            <span className="tracking-wide">
              {restaurant.happy_hour_config?.banner_label || '⚡ Twilight Happy Hour: 20% Off All Beverages & Chef Starters!'}
            </span>
          </div>
          <button
            onClick={() => setForceHappyHourDemo(!forceHappyHourDemo)}
            className="text-[10px] underline opacity-90 hover:opacity-100 cursor-pointer ml-2"
          >
            {forceHappyHourDemo ? 'Hide Demo' : 'Preview Live'}
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SCROLLYTELLING HERO SECTION (MOBILE-OPTIMIZED)             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[36vh] sm:min-h-[48vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden pt-6 pb-8 sm:pt-8 sm:pb-12"
        style={{
          background: `linear-gradient(180deg, rgba(13,19,34,0.98) 0%, #090D16 100%)`
        }}
      >
        <div
          className="absolute top-6 right-6 w-36 h-36 sm:w-48 sm:h-48 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ backgroundColor: restaurant?.brand_colors?.primary || '#E85D04' }}
        />
        <div
          className="absolute bottom-6 left-6 w-32 h-32 sm:w-40 sm:h-40 rounded-full opacity-15 blur-2xl pointer-events-none"
          style={{ backgroundColor: restaurant?.brand_colors?.primary || '#E85D04' }}
        />

        <div className="relative z-10 max-w-lg mx-auto space-y-2.5 sm:space-y-3.5">
          {/* Restaurant badge with multiplayer session indicator */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] tracking-widest uppercase font-bold border bg-[#090D16]/[0.05] backdrop-blur-sm shadow-sm text-amber-300 border-amber-500/30">
              {activeTable?.label ? `${t.table} ${activeTable.label}` : `${t.table} 1`} • {restaurant?.cuisine || 'Contemporary Dining'}
            </span>
            <span className="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold border bg-emerald-950/70 text-emerald-300 border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Multiplayer Sync ({activeTableGuests} Guests)</span>
            </span>
          </div>

          {/* Restaurant name */}
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
            {restaurant?.name || 'Saffron House'}
          </h1>

          <p className="text-[11px] sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto line-clamp-2 sm:line-clamp-none">
            {restaurant?.authentic_photography_statement ||
              'Explore our carefully curated menu, crafted with passion and authentic Indian spices.'}
          </p>

          {/* Clean Quick Action Buttons */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 pt-1 sm:pt-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
            <button
              onClick={() => handleOpenChallenge()}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-slate-950 text-[11px] sm:text-xs font-bold rounded-full shadow-lg transition-all flex items-center space-x-1 sm:space-x-1.5 animate-pulse cursor-pointer flex-shrink-0"
            >
              <span className="text-xs sm:text-sm">🎁</span>
              <span>Win Reward</span>
            </button>

            <button
              onClick={() => {
                setAiFocusDish(null);
                setIsAiOpen(true);
              }}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#0D1322] hover:bg-[#151D33] text-white text-[11px] sm:text-xs font-bold rounded-full shadow-lg transition-all flex items-center space-x-1 sm:space-x-1.5 border border-white/[0.1] hover:border-amber-500/40 group cursor-pointer flex-shrink-0"
            >
              <span className="text-xs sm:text-sm">🧑‍🍳</span>
              <span>{t.aiSommelier}</span>
              <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider px-1 sm:px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Trained
              </span>
            </button>

            <button
              onClick={() => setIsInstagramStoryOpen(true)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 hover:opacity-95 text-white text-[11px] sm:text-xs font-bold rounded-full shadow-lg transition-all flex items-center space-x-1 sm:space-x-1.5 cursor-pointer flex-shrink-0"
            >
              <Instagram className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span>{t.instagramStory}</span>
              <span className="text-[8px] sm:text-[9px] bg-[#090D16]/20 px-1 sm:px-1.5 py-0.2 rounded-full">Perk</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SLEEK SURPRISE TABLE REWARD TEASER CARD                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {!rewardBannerDismissed && (
        <div className="max-w-xl mx-auto px-3 sm:px-4 -mt-2 sm:-mt-3 relative z-20">
          <div
            className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-0.5 rounded-2xl shadow-lg"
          >
            <div className="bg-[#0D1322]/95 backdrop-blur-md px-3 sm:px-4 py-2.5 sm:py-3 rounded-[14px] flex items-center justify-between space-x-2.5 sm:space-x-3 text-white border border-white/[0.08]">
              <div
                onClick={() => handleOpenChallenge()}
                className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 cursor-pointer flex-1"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-base sm:text-lg flex-shrink-0 shadow-sm animate-bounce text-slate-950">
                  🎁
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-amber-400">
                      {activeTable?.label || 'Table 1'} Surprise Treat
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[8px] sm:text-[9px] font-bold bg-green-500/20 text-green-300">
                      Guaranteed Win
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-xs sm:text-base text-white truncate">
                    Win Today's Surprise Table Reward!
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-300 truncate">
                    Complimentary chef treats, drinks, or up to 20% off
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenChallenge()}
                  className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs flex items-center space-x-1 shadow-sm transition-all"
                >
                  <span>Win</span>
                  <span>→</span>
                </button>
                <button
                  type="button"
                  title="Maybe later"
                  onClick={() => setRewardBannerDismissed(true)}
                  className="p-1 sm:p-1.5 rounded-full bg-[#090D16]/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.12] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* FLOATING REWARD BUBBLE — shows when banner is dismissed    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {rewardBannerDismissed && !isChallengeModalOpen && (
        <button
          type="button"
          onClick={() => {
            setRewardBannerDismissed(false);
            handleOpenChallenge();
          }}
          title="Claim your table reward"
          className="fixed right-3 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center  text-2xl animate-bounce border-2 border-amber-300/60">
            🎁
          </div>
          <span className="text-[9px] font-bold text-amber-300 bg-[#0D1322] border border-amber-400/40 px-1.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
            Your Reward
          </span>
        </button>
      )}


      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 🧑‍🍳 CHEF & OWNER AI DINING CONCIERGE (MOBILE-OPTIMIZED)     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-xl mx-auto px-3 sm:px-4 mt-2 sm:mt-3 mb-1">
        <div className="bg-gradient-to-br from-[#121824] via-[#0d121c] to-[#121824] text-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-amber-500/30 relative overflow-hidden shadow-lg">
          {/* Subtle gold glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between gap-2.5 sm:gap-3 mb-2 sm:mb-2.5">
            <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-xl sm:text-2xl shadow-md border-2 border-amber-300/40">
                  🧑‍🍳
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-500 border-2 border-[#121824] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#090D16] animate-pulse" />
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-serif font-bold text-xs sm:text-base text-white truncate">
                    Ask Chef's AI Concierge
                  </h3>
                  <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 flex-shrink-0">
                    Chef Trained
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                  Secret kitchen recipes, custom pairings &amp; spice check
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenAi(null, null)}
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg flex items-center space-x-1 flex-shrink-0 cursor-pointer"
            >
              <span>Chat</span>
              <span>→</span>
            </button>
          </div>

          {/* Quick interactive prompt pills */}
          <div className="space-y-1 pt-1.5 border-t border-slate-800/80">
            <div className="text-[9px] sm:text-[10px] text-amber-400/90 font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400 inline" />
              <span>Ask the Kitchen:</span>
            </div>
            <div className="flex space-x-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              {[
                { label: "🧑‍🍳 Chef's Special Tonight", query: "What does the Chef recommend for first-time diners tonight?" },
                { label: "🔥 Check 1–5 Spice Heat", query: "How spicy are the curries? Are they suitable for kids?" },
                { label: "🍷 Drink & Bread Pairing", query: "What drink or bread does the owner recommend pairing with curries?" },
                { label: "🌾 Nut-free & Gluten-free", query: "Which dishes are safely prepared gluten-free and nut-free?" },
                { label: "👨‍👩‍👧‍👦 Table of 4 Feast", query: "Can you recommend a balanced feast for a family table of 4?" }
              ].map((pill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOpenAi(null, pill.query)}
                  className="whitespace-nowrap px-2.5 py-1 bg-slate-900/90 hover:bg-slate-800 text-amber-200 hover:text-white border border-amber-500/20 hover:border-amber-400/50 text-[10px] sm:text-[11px] rounded-full transition-all flex-shrink-0 cursor-pointer font-medium active:scale-95"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* STICKY SEARCH & CATEGORY BAR (MOBILE-OPTIMIZED)             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div ref={menuSectionRef} className="sticky top-[45px] sm:top-[51px] z-20 bg-[#090D16]/95 backdrop-blur-md pt-2.5 pb-2 border-b border-white/[0.07] shadow-sm">
        <div className="max-w-xl mx-auto px-3 sm:px-4 space-y-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder || "Search dish, starters, drinks..."}
              className="w-full pl-8.5 pr-4 py-2 bg-[#0D1322] rounded-xl text-xs border border-white/[0.08] focus:outline-none focus:border-amber-500/60 placeholder-slate-500 text-slate-100 shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex space-x-1.5 sm:space-x-2 overflow-x-auto pb-0.5 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`whitespace-nowrap px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-[#0D1322] text-slate-300 border border-white/[0.08] hover:border-amber-500/40 hover:text-amber-300'
              }`}
            >
              {t.filterAll}
            </button>
            {currentRestCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-[#0D1322] text-slate-300 border border-white/[0.08] hover:border-amber-500/40 hover:text-amber-300'
                }`}
              >
                {getCategoryTitle(cat.name, selectedLanguage)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SCROLLYTELLING MENU SECTIONS — One per category            */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <main className="max-w-xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6 space-y-6 sm:space-y-8 pb-32">
        {filteredDishes.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-[#0D1322] rounded-3xl p-6 border border-white/[0.08] shadow-lg">
            <p className="font-serif font-bold text-slate-100 text-base">No dishes found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search keywords or filter category.</p>
          </div>
        ) : (
          dishesByCategory.map(({ category, items }) => {
            if (!category || !category.id) return null;
            return (
              <section key={category.id} className="space-y-3 sm:space-y-4">
                {/* Category Header */}
                <div className="relative py-2 sm:py-3">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-white/[0.08]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#090D16] px-3.5 sm:px-4 py-0.5 sm:py-1 rounded-full border border-white/[0.08] shadow-sm">
                      <h3 className="font-serif text-xs sm:text-sm font-bold text-amber-300 tracking-wide">
                        {getCategoryTitle(category.name || 'Menu Selection', selectedLanguage)}
                      </h3>
                    </span>
                  </div>
                </div>

                {/* Dish Cards */}
                <div className="space-y-2.5 sm:space-y-3">
                  {(items || []).filter(Boolean).map((dish) => {
                    const flags = Array.isArray(dish.dietary_flags) ? dish.dietary_flags : [];
                    const isVeg = flags.some((f) => {
                      const lf = String(f).toLowerCase();
                      return lf === 'veg' || lf === 'vegetarian' || lf === 'vegan' || lf === 'jain';
                    });

                    return (
                      <div
                        key={dish.id}
                        onClick={() => setActiveDish(dish)}
                        className={`bg-[#0D1322] rounded-2xl p-3 sm:p-3.5 border border-white/[0.08] flex items-start space-x-3 cursor-pointer transition-all hover:border-amber-500/40 active:scale-[0.99] ${
                          !dish.is_available ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex-shrink-0 bg-[#090D16] overflow-hidden relative">
                          <img src={dish.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400'} alt={dish.name || 'Dish'} className="w-full h-full object-cover" />
                          {!dish.is_available && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-1 text-center">
                              <span className="text-[8px] sm:text-[9px] uppercase font-bold text-white tracking-widest px-1.5 py-0.5 rounded bg-red-600/90">
                                Sold Out
                              </span>
                            </div>
                          )}
                          {dish.is_bestseller && (
                            <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-amber-500 rounded text-[8px] font-bold text-slate-950 flex items-center space-x-0.5 shadow-sm">
                              <Star className="w-2.5 h-2.5 fill-slate-950" />
                              <span>Best</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1.5 mb-0.5 sm:mb-1">
                            <span
                              className={`w-3 h-3 rounded-xs border flex items-center justify-center ${
                                isVeg ? 'border-emerald-500' : 'border-red-500'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            </span>
                            {(dish.spice_level || 0) > 0 && (
                              <div className="flex items-center text-amber-400 pl-1 border-l border-white/[0.08]">
                                <Flame className="w-3 h-3 fill-amber-400" />
                                <span className="text-[10px] font-bold ml-0.5">{dish.spice_level}</span>
                              </div>
                            )}
                            {dish.is_chef_recommended && (
                              <span className="text-[8px] sm:text-[9px] font-bold text-cyan-300 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/30">
                                Chef's Pick
                              </span>
                            )}
                          </div>

                          <h3 className="font-serif font-bold text-xs sm:text-sm text-slate-100 leading-tight truncate">
                            {dish.name}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                            {dish.short_description || dish.full_description || ''}
                          </p>

                          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/[0.06]">
                            <span className="font-bold text-xs sm:text-sm text-amber-400">
                              ₹{typeof dish.price === 'number' ? dish.price.toFixed(2) : (Number(dish.price) || 0).toFixed(2)}
                            </span>

                            <div className="flex items-center space-x-1.5 sm:space-x-2">
                              {/* Ask Chef quick button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenAi(dish, `Tell me about ${dish.name} — chef's secret notes, spice level, and pairing.`);
                                }}
                                className="px-2 sm:px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1 text-[10px] sm:text-[11px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                                title={`Ask Chef about ${dish.name}`}
                              >
                                <span className="text-xs">🧑‍🍳</span>
                                <span className="hidden xs:inline">Ask Chef</span>
                              </button>

                              {dish.is_available ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDish(dish);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-[11px] sm:text-xs transition-all shadow-sm"
                                >
                                  + Add
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-500 font-semibold">Sold Out</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </main>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* UNIFIED ERGONOMIC MOBILE BOTTOM DOCK (ZERO SCREEN OVERLAP)  */}
      {/* ═══════════════════════════════════════════════════════════ */}

      {/* Floating Waiter Alert Toast */}
      {waiterToast && (
        <div className="fixed top-14 left-4 right-4 max-w-md mx-auto z-50 animate-bounce">
          <div className="bg-[#090D16] text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/[0.08] flex items-center space-x-3 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping flex-shrink-0" />
            <span className="flex-1">{waiterToast}</span>
            <button onClick={() => setWaiterToast(null)} className="text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Back to Top Quick Trigger */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 left-3 sm:left-4 z-30 p-2.5 rounded-full bg-[#0D1322]/90 backdrop-blur-md text-slate-300 border border-white/[0.08] hover:border-amber-500/40 hover:text-amber-300 transition-all shadow-lg active:scale-95"
          title="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* DOCK VARIANT 1: Active Cart Bar when items are selected */}
      {totalCartCount > 0 ? (
        <div className="fixed bottom-3 left-3 right-3 max-w-xl mx-auto z-40">
          <div className="bg-[#0A0E17]/95 backdrop-blur-xl p-1.5 rounded-2xl border border-amber-500/40 shadow-2xl flex items-center gap-2">
            {/* Quick Chef AI Mini Button */}
            <button
              type="button"
              onClick={() => handleOpenAi(null)}
              className="p-2.5 rounded-xl bg-[#121824] hover:bg-[#1a2233] text-amber-300 border border-amber-500/30 flex-shrink-0 active:scale-95 transition-all"
              title="Ask Chef's AI"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
            </button>

            {/* Quick Waiter Mini Button */}
            <button
              type="button"
              onClick={handleCallWaiter}
              disabled={waiterCalled}
              className={`p-2.5 rounded-xl border flex-shrink-0 active:scale-95 transition-all ${
                waiterCalled
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-[#121824] text-slate-300 border-white/[0.08] hover:text-white'
              }`}
              title="Call Waiter"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Main Cart CTA Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex-1 bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-slate-950 font-bold py-2.5 px-3.5 rounded-xl flex items-center justify-between shadow-lg transition-all"
            >
              <div className="flex items-center space-x-2">
                <span className="bg-slate-950 text-amber-400 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalCartCount}
                </span>
                <span className="text-xs sm:text-sm font-serif font-bold">View Order</span>
              </div>
              <div className="flex items-center space-x-1 text-xs font-bold font-sans">
                <span>₹{cartSubtotal.toFixed(2)}</span>
                <span>→</span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        /* DOCK VARIANT 2: Sleek Floating Action Dock when cart is empty */
        <div className="fixed bottom-3 right-3 sm:right-6 z-40 flex items-center gap-1.5 sm:gap-2">
          {/* Win Reward Quick Pill */}
          <button
            type="button"
            onClick={() => handleOpenChallenge()}
            className="p-2 sm:p-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-xl border border-amber-300/40 active:scale-95 transition-all flex items-center space-x-1"
            title="Win Today's Surprise Reward"
          >
            <span className="text-base sm:text-lg">🎁</span>
            <span className="text-[11px] font-bold pr-1 hidden xs:inline">Win Perk</span>
          </button>

          {/* Call Waiter Quick Pill */}
          <button
            type="button"
            onClick={handleCallWaiter}
            disabled={waiterCalled}
            className={`p-2.5 rounded-full shadow-xl border active:scale-95 transition-all flex items-center space-x-1 ${
              waiterCalled
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-[#0D1322]/95 backdrop-blur-md text-slate-300 border-white/[0.1] hover:border-amber-500/40 hover:text-amber-300'
            }`}
            title="Call Waiter to Table"
          >
            <Bell className={`w-4 h-4 ${waiterCalled ? 'animate-bounce text-white' : 'text-amber-400'}`} />
            {waiterCalled && <span className="text-[10px] font-bold pr-1 text-white">Alert Sent</span>}
          </button>

          {/* Ask Chef's AI Live Concierge Floating Pill */}
          <button
            type="button"
            onClick={() => handleOpenAi(null)}
            className="group flex items-center space-x-2 bg-gradient-to-r from-[#090D16]/95 via-[#0D1322]/95 to-amber-950/95 backdrop-blur-md text-white pl-2.5 sm:pl-3 pr-3 sm:pr-3.5 py-2 rounded-full shadow-2xl border border-amber-500/40 hover:border-amber-400 active:scale-95 transition-all cursor-pointer"
          >
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-sm text-xs">
                ✨
              </div>
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="text-left">
              <span className="text-xs font-bold font-serif tracking-tight text-amber-200">Ask Chef</span>
            </div>
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* INTERACTIVE SPIN THE WHEEL REWARD GAME                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <SpinWheelModal
        isOpen={isChallengeModalOpen}
        onClose={() => setIsChallengeModalOpen(false)}
        activeTable={activeTable}
        challenge={selectedChallenge}
        initialMode={challengeModalMode}
      />

      {/* Dish Detail Modal */}
      <DishDetailModal
        dish={activeDish}
        onClose={() => setActiveDish(null)}
        onAskAi={(dish) => {
          setActiveDish(null);
          setAiFocusDish(dish);
          setIsAiOpen(true);
        }}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* AI Assistant Drawer */}
      <AiAssistantDrawer
        isOpen={isAiOpen}
        onClose={() => {
          setIsAiOpen(false);
          setAiInitialQuery(null);
        }}
        focusDish={aiFocusDish}
        initialQuery={aiInitialQuery}
        onConfirmAdd={(dish) => {
          addItemToCart({
            menu_item_id: dish.id,
            name: dish.name,
            price: dish.price,
            quantity: 1,
            image_url: dish.image_url,
            selected_options: []
          });
          setIsCartOpen(true);
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        tableLabel={activeTable?.label || 'Table 1'}
      />

      {/* Order Status Modal */}
      {activeOrderId && (
        <OrderTrackerModal
          orderId={activeOrderId}
          onClose={() => setActiveOrderId(null)}
        />
      )}

      {/* Switch Restaurant or Scan QR Modal */}
      <SwitchRestaurantModal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
        currentSlug={restaurant?.slug || restaurantSlug || 'saffron-house'}
      />

      {/* Foodie Instagram Story Generator Modal */}
      <InstagramStoryModal
        isOpen={isInstagramStoryOpen}
        onClose={() => setIsInstagramStoryOpen(false)}
        restaurant={restaurant}
        items={cart.length > 0 ? cart : currentRestMenuItems.slice(0, 3)}
        tableLabel={activeTable?.label || 'Table 1'}
      />
    </div>
  );
};
