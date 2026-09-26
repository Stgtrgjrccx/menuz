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
  QrCode,
  Home
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { MenuItem, ReviewChallenge } from '../types';
import { DishDetailModal } from '../components/DishDetailModal';
import { CartDrawer } from '../components/CartDrawer';
import { AiAssistantDrawer } from '../components/AiAssistantDrawer';
import { OrderTrackerModal } from '../components/OrderTrackerModal';
import { SpinWheelModal } from '../components/SpinWheelModal';
import { SwitchRestaurantModal } from '../components/SwitchRestaurantModal';
import { PUNE_RESTAURANT_DIRECTORY } from '../data/puneRestaurantDirectory';

export const DinerMenu: React.FC = () => {
  const { restaurantSlug } = useParams<{ restaurantSlug: string }>();
  const [searchParams] = useSearchParams();
  const tableToken = searchParams.get('t') || '';

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
    return list.length > 0 ? list : menuItems;
  }, [menuItems, restaurant.id]);

  const currentRestCategories = useMemo(() => {
    const list = categories.filter((c) => c.restaurant_id === restaurant.id);
    return list.length > 0 ? list : categories;
  }, [categories, restaurant.id]);

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
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [waiterToast, setWaiterToast] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Challenge & Wheel modal state
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [challengeModalMode, setChallengeModalMode] = useState<'review' | 'wheel'>('review');
  const [selectedChallenge, setSelectedChallenge] = useState<ReviewChallenge | null>(null);

  // Scrollytelling section refs
  const heroRef = useRef<HTMLDivElement>(null);
  const menuSectionRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // Table Token Verification
  useEffect(() => {
    const restTables = tables.filter((t) => t.restaurant_id === restaurant.id);
    const matchedTable =
      (tableToken ? (restTables.find((t) => t.public_token === tableToken && t.is_active) || tables.find((t) => t.public_token === tableToken && t.is_active)) : null) ||
      restTables[0] ||
      tables[0] || {
        id: 'tbl-01',
        restaurant_id: restaurant?.id || 'rest-saffron-house-01',
        label: 'Table 1',
        public_token: 'table-token-01-saffron',
        is_active: true
      };

    setActiveTable(matchedTable);
    setErrorMsg(null);

    // Ensure session ID
    if (!sessionStorage.getItem('menuz_session_id')) {
      sessionStorage.setItem('menuz_session_id', 'sess_' + crypto.randomUUID());
    }
  }, [tableToken, tables, setActiveTable, restaurant]);

  // Track scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredDishes = useMemo(() => {
    return currentRestMenuItems.filter((dish) => {
      const matchesCat = selectedCategory === 'all' || dish.category_id === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        dish.name.toLowerCase().includes(q) ||
        dish.short_description.toLowerCase().includes(q) ||
        dish.ingredients.some((ing) => ing.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [currentRestMenuItems, selectedCategory, searchQuery]);

  // Group dishes by category for scrollytelling sections
  const dishesByCategory = useMemo(() => {
    if (selectedCategory !== 'all') {
      return [{ category: currentRestCategories.find((c) => c.id === selectedCategory), items: filteredDishes }];
    }
    return currentRestCategories
      .filter((cat) => filteredDishes.some((d) => d.category_id === cat.id))
      .map((cat) => ({
        category: cat,
        items: filteredDishes.filter((d) => d.category_id === cat.id)
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
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-subtle text-center border border-red-100">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="font-serif text-xl font-bold text-charcoal-900 mb-2">QR Code Issue</h2>
          <p className="text-charcoal-800 text-sm mb-4 leading-relaxed">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mainRef} className="min-h-screen bg-ivory-50 pb-28">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* LIVE TOAST: WAITER CALLED NOTIFICATION                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {waiterCalled && (
        <div className="fixed top-4 left-4 right-4 max-w-sm mx-auto z-50 bg-charcoal-900 text-white p-3.5 rounded-2xl shadow-float border border-saffron-500/50 flex items-center space-x-3 animate-slideDown">
          <div className="w-8 h-8 rounded-xl bg-saffron-600 flex items-center justify-center flex-shrink-0">
            <Bell className="w-4 h-4 text-white animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-serif font-bold text-xs text-white">Waiter Alert Sent!</p>
            <p className="text-[10px] text-charcoal-300">
              Staff has been notified for {activeTable?.label || 'your table'}. A server is on their way.
            </p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 0. STREAMLINED DINER TOP BAR                                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-30 bg-charcoal-900/95 backdrop-blur-md text-white border-b border-charcoal-800 px-4 py-2.5 flex items-center justify-between shadow-sm">
        {/* Link back to Menuz Home */}
        <Link
          to="/"
          className="flex items-center space-x-1.5 text-xs text-charcoal-300 hover:text-white transition-colors group"
          title="Back to Menuz Home"
        >
          <span className="w-5 h-5 rounded-lg bg-gradient-to-tr from-saffron-600 to-amber-400 flex items-center justify-center font-bold text-[10px] text-white">
            M
          </span>
          <span className="font-serif font-black text-white group-hover:text-saffron-400 transition-colors">
            menuz
          </span>
          <span className="text-[10px] text-charcoal-400 hidden sm:inline">• Home</span>
        </Link>

        {/* Switch Restaurant / Scan QR interactive button */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsSwitchModalOpen(true)}
            className="py-1 px-3 rounded-full bg-charcoal-800 hover:bg-charcoal-700 text-saffron-400 hover:text-saffron-300 border border-saffron-500/40 text-[11px] font-bold flex items-center space-x-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Switch Restaurant or Scan a New Table QR Code"
          >
            <ArrowLeftRight className="w-3 h-3 text-saffron-400" />
            <span>Switch Restaurant / Scan QR</span>
          </button>

          {cart.length > 0 && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 rounded-lg text-charcoal-300 hover:text-white bg-charcoal-800 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="absolute -top-1 -right-1 bg-saffron-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SCROLLYTELLING HERO SECTION                                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[55vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-8 pb-12"
        style={{
          background: `linear-gradient(135deg, ${restaurant?.brand_colors?.primary || '#E85D04'}15 0%, #FDFBF7 50%, ${restaurant?.brand_colors?.primary || '#E85D04'}08 100%)`
        }}
      >
        <div
          className="absolute top-10 right-10 w-40 h-40 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ backgroundColor: restaurant?.brand_colors?.primary || '#E85D04' }}
        />
        <div
          className="absolute bottom-20 left-10 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none"
          style={{ backgroundColor: restaurant?.brand_colors?.primary || '#E85D04' }}
        />

        <div className="relative z-10 max-w-lg mx-auto space-y-3.5">
          {/* Restaurant badge */}
          <span className="inline-block px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-bold border bg-white/80 backdrop-blur-sm shadow-xs text-saffron-700 border-saffron-200">
            {activeTable?.label || 'Table 1'} • {restaurant?.cuisine || 'Contemporary Dining'}
          </span>

          {/* Restaurant name */}
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900 leading-tight tracking-tight">
            {restaurant?.name || 'Saffron House'}
          </h1>

          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed max-w-sm mx-auto">
            {restaurant?.authentic_photography_statement ||
              'Explore our carefully curated menu, crafted with passion and authentic Indian spices.'}
          </p>

          {/* Clean Quick Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleOpenChallenge()}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 via-saffron-600 to-amber-600 hover:brightness-105 active:scale-95 text-white text-xs font-bold rounded-full shadow-float transition-all flex items-center space-x-1.5 animate-pulse"
            >
              <span className="text-sm">🎁</span>
              <span>Win Surprise Reward</span>
            </button>

            <button
              onClick={() => {
                setAiFocusDish(null);
                setIsAiOpen(true);
              }}
              className="px-4 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-bold rounded-full shadow-subtle transition-all flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-saffron-400" />
              <span>Ask AI Concierge</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SLEEK SURPRISE TABLE REWARD TEASER CARD                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-xl mx-auto px-4 -mt-3 relative z-20">
        <div
          onClick={() => handleOpenChallenge()}
          className="w-full bg-gradient-to-r from-amber-500 via-saffron-600 to-amber-600 p-0.5 rounded-2xl shadow-float cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all group"
        >
          <div className="bg-charcoal-950/95 backdrop-blur-md px-4 py-3 rounded-[14px] flex items-center justify-between space-x-3 text-white">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-saffron-600 flex items-center justify-center text-lg flex-shrink-0 shadow-sm animate-bounce">
                🎁
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                    {activeTable?.label || 'Table 1'} Surprise Treat
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-green-500/20 text-green-300">
                    Guaranteed Win
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-white truncate">
                  Win Today's Surprise Table Reward!
                </h3>
                <p className="text-[11px] text-charcoal-300 truncate">
                  Complimentary chef treats, drinks, or up to 20% off your bill
                </p>
              </div>
            </div>

            <button
              type="button"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-saffron-500 hover:brightness-110 text-charcoal-950 font-bold text-xs flex items-center space-x-1 flex-shrink-0 shadow-sm transition-all"
            >
              <span>Win</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* STICKY SEARCH & CATEGORY BAR                                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div ref={menuSectionRef} className="sticky top-0 z-30 bg-ivory-50/95 backdrop-blur-md pt-4 pb-2 border-b border-ivory-200/60 shadow-xs">
        <div className="max-w-xl mx-auto px-4 space-y-2.5">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-charcoal-700/40 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, ingredients, dietary..."
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl text-xs border border-ivory-200 focus:outline-none focus:border-saffron-600 placeholder-charcoal-700/40 text-charcoal-900 shadow-xs"
            />
          </div>

          {/* Category Chips */}
          <div className="flex space-x-2 overflow-x-auto pb-0.5 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-charcoal-900 text-white shadow-xs'
                  : 'bg-white text-charcoal-800 border border-ivory-200 hover:bg-ivory-100'
              }`}
            >
              All
            </button>
            {currentRestCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-charcoal-900 text-white shadow-xs'
                    : 'bg-white text-charcoal-800 border border-ivory-200 hover:bg-ivory-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SCROLLYTELLING MENU SECTIONS — One per category            */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <main className="max-w-xl mx-auto px-4 mt-6 space-y-8 pb-6">
        {filteredDishes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl p-6 border border-ivory-200 shadow-subtle">
            <p className="font-serif font-bold text-charcoal-900 text-base">No dishes found</p>
            <p className="text-xs text-charcoal-700/60 mt-1">Try adjusting your search keywords or filter category.</p>
          </div>
        ) : (
          dishesByCategory.map(({ category, items }) => (
            <section key={category?.id || 'all'} className="space-y-4">
              {/* Category Header */}
              {category && (
                <div className="relative py-3">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-ivory-300" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-ivory-50 px-4 py-1 rounded-full border border-ivory-200 shadow-xs">
                      <h3 className="font-serif text-sm font-bold text-charcoal-900 tracking-wide">{category.name}</h3>
                    </span>
                  </div>
                </div>
              )}

              {/* Dish Cards */}
              <div className="space-y-3">
                {items.map((dish) => {
                  const isVeg =
                    dish.dietary_flags.includes('Vegetarian') ||
                    dish.dietary_flags.includes('Vegan') ||
                    dish.dietary_flags.includes('Jain');

                  return (
                    <div
                      key={dish.id}
                      onClick={() => setActiveDish(dish)}
                      className={`bg-white rounded-2xl p-3.5 shadow-subtle border border-ivory-200/90 flex items-start space-x-3 cursor-pointer transition-all hover:border-saffron-500/40 hover:shadow-md ${
                        !dish.is_available ? 'opacity-65 bg-gray-50/80' : ''
                      }`}
                    >
                      <div className="w-24 h-24 rounded-xl flex-shrink-0 bg-ivory-100 overflow-hidden relative shadow-inner">
                        <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
                        {!dish.is_available && (
                          <div className="absolute inset-0 bg-charcoal-900/70 flex items-center justify-center p-1 text-center">
                            <span className="text-[9px] uppercase font-bold text-white tracking-widest px-1.5 py-0.5 rounded bg-red-600/90">
                              Sold Out
                            </span>
                          </div>
                        )}
                        {dish.is_bestseller && (
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-amber-500 rounded text-[8px] font-bold text-white flex items-center space-x-0.5">
                            <Star className="w-2.5 h-2.5 fill-white" />
                            <span>Best</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span
                            className={`w-3 h-3 rounded-xs border flex items-center justify-center ${
                              isVeg ? 'border-green-600' : 'border-red-600'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                          </span>
                          {dish.spice_level > 0 && (
                            <div className="flex items-center text-saffron-600 pl-1 border-l border-ivory-200">
                              <Flame className="w-3 h-3 fill-saffron-600" />
                              <span className="text-[10px] font-bold ml-0.5">{dish.spice_level}</span>
                            </div>
                          )}
                          {dish.is_chef_recommended && (
                            <span className="text-[9px] font-bold text-saffron-700 bg-saffron-50 px-1.5 py-0.5 rounded border border-saffron-200">
                              Chef's Pick
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif font-bold text-sm text-charcoal-900 leading-tight truncate">
                          {dish.name}
                        </h3>
                        <p className="text-xs text-charcoal-700/70 line-clamp-2 mt-0.5 leading-snug">
                          {dish.short_description}
                        </p>

                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-ivory-100">
                          <span className="font-bold text-sm text-charcoal-900">
                            ₹{dish.price.toFixed(2)}
                          </span>

                          <div className="flex items-center space-x-2">
                            {/* Ask AI quick button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAiFocusDish(dish);
                                setIsAiOpen(true);
                              }}
                              className="px-2 py-1 rounded-lg bg-saffron-50 text-saffron-700 hover:bg-saffron-100 border border-saffron-200 flex items-center space-x-1 text-[11px] font-semibold transition-colors"
                              title={`Ask AI about ${dish.name}`}
                            >
                              <Sparkles className="w-3 h-3 text-saffron-600" />
                              <span>Ask AI</span>
                            </button>

                            {dish.is_available ? (
                              <span className="text-xs text-saffron-700 font-semibold hover:underline">
                                Customize +
                              </span>
                            ) : (
                              <span className="text-[11px] text-gray-400 font-medium">Sold Out</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </main>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* FLOATING CALL WAITER + CART BAR                            */}
      {/* ═══════════════════════════════════════════════════════════ */}

      {/* Floating Waiter Alert Toast */}
      {waiterToast && (
        <div className="fixed top-5 left-4 right-4 max-w-md mx-auto z-50 animate-bounce">
          <div className="bg-charcoal-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-charcoal-700 flex items-center space-x-3 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping flex-shrink-0" />
            <span className="flex-1">{waiterToast}</span>
            <button onClick={() => setWaiterToast(null)} className="text-charcoal-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Win Rewards Button */}
      <button
        onClick={() => handleOpenChallenge()}
        className="fixed bottom-36 right-4 z-40 p-3 rounded-full shadow-float bg-gradient-to-r from-amber-500 via-saffron-600 to-amber-600 text-white border-2 border-white hover:scale-105 active:scale-95 transition-all flex items-center space-x-1.5 group"
        title="Win Today's Surprise Reward"
      >
        <span className="text-xl group-hover:scale-125 transition-transform duration-300">🎁</span>
        <span className="text-xs font-bold pr-1 hidden sm:inline">Win Reward</span>
      </button>

      {/* Call Waiter FAB */}
      <button
        onClick={handleCallWaiter}
        disabled={waiterCalled}
        className={`fixed bottom-20 right-4 z-40 p-3 rounded-full shadow-float transition-all flex items-center space-x-1.5 ${
          waiterCalled
            ? 'bg-green-600 text-white'
            : 'bg-white text-charcoal-800 border border-ivory-300 hover:bg-ivory-100'
        }`}
        title={waiterCalled ? 'Waiter has been notified' : 'Call Waiter'}
      >
        <Bell className={`w-5 h-5 ${waiterCalled ? 'animate-bounce' : ''}`} />
        {waiterCalled && <span className="text-xs font-bold pr-1">Notified!</span>}
      </button>

      {/* Back to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 left-4 z-40 p-3 rounded-full shadow-float bg-white text-charcoal-700 border border-ivory-300 hover:bg-ivory-100 transition-all"
          title="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Floating Bottom Cart Bar */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-40">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-saffron-600 hover:bg-saffron-700 text-white font-bold py-3.5 px-5 rounded-2xl shadow-float flex items-center justify-between transition-all"
          >
            <div className="flex items-center space-x-2">
              <span className="bg-white text-saffron-700 text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                {totalCartCount}
              </span>
              <span className="text-sm font-serif">View Dining Tray</span>
            </div>
            <div className="flex items-center space-x-1 text-sm font-sans">
              <span>Pay at Table</span>
              <span>→</span>
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
        onClose={() => setIsAiOpen(false)}
        focusDish={aiFocusDish}
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
    </div>
  );
};
