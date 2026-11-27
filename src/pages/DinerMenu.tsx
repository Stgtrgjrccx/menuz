import { Logo } from '../components/Logo';
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
  Users,
  ShieldCheck,
  Maximize2,
  SlidersHorizontal,
  BookOpen,
  Wine,
  Layers,
  LayoutGrid,
  List,
  Info,
  Home,
  QrCode,
  ArrowLeft,
  Gamepad2
} from 'lucide-react';
import { useRestaurantStore, isDishNameAsRestaurant } from '../store/restaurantStore';
import { MenuItem, ReviewChallenge, Restaurant } from '../types';
import { SEED_RESTAURANTS } from '../data/seedData';
import { motion } from 'framer-motion';
import { DishDetailModal } from '../components/DishDetailModal';
import { SpatialDishShowroomModal } from '../components/SpatialDishShowroomModal';
import { DishCardImageGallery } from '../components/DishCardImageGallery';
import { ImageLightboxModal } from '../components/ImageLightboxModal';
import { getDishGalleryImages } from '../utils/dishPhotoUtils';
import { CartDrawer } from '../components/CartDrawer';
import { AiAssistantDrawer } from '../components/AiAssistantDrawer';
import { OrderTrackerModal } from '../components/OrderTrackerModal';
import { SpinWheelModal } from '../components/SpinWheelModal';
import { LanguageSelector } from '../components/LanguageSelector';
import { QrScannerModal } from '../components/QrScannerModal';
import { MenuFilterModal, MenuFilterState, DietaryOption, SpiceOption } from '../components/MenuFilterModal';
import { TableArcadeModal } from '../components/TableArcadeModal';
import { IS_HQ_SITE } from '../config/siteMode';
import { TRANSLATIONS, translateCategory, getTranslatedDish, translateDishName } from '../utils/i18n';
import { PUNE_RESTAURANT_DIRECTORY } from '../data/puneRestaurantDirectory';
import { generateCuisineMenu } from '../data/cuisineMenuGenerator';
import { findAuthenticPuneMenu } from '../data/authenticPuneMenus';


export const DinerMenu: React.FC = () => {
  const { restaurantSlug: rawSlug, tableId } = useParams<{ restaurantSlug?: string; tableId?: string }>();
  const [searchParams] = useSearchParams();
  const showHub = searchParams.get('view') === 'hub';
  // Default to Saffron House so diner menu dishes appear directly on /menu
  const restaurantSlug = rawSlug || (showHub ? undefined : 'saffron-house');
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
  const updateCartQuantity = useRestaurantStore((state) => state.updateCartQuantity);
  const removeCartItem = useRestaurantStore((state) => state.removeCartItem);
  const callWaiter = useRestaurantStore((state) => state.callWaiter);
  const completeChallenge = useRestaurantStore((state) => state.completeChallenge);
  const selectedLanguage = useRestaurantStore((state) => state.selectedLanguage);
  const setSelectedLanguage = useRestaurantStore((state) => state.setSelectedLanguage);
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  // Immediate language reset: English is strictly the default language across Menuz and resets on mount and unmount (leaving the page)
  useEffect(() => {
    setSelectedLanguage('en');
    return () => {
      setSelectedLanguage('en');
    };
  }, [setSelectedLanguage]);

  // Diner Menu Hub State (for generic /menu route)
  const [hubSearchQuery, setHubSearchQuery] = useState('');
  const [hubCategory, setHubCategory] = useState('all');
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

  // Synchronously resolve target restaurant from route slug or active store restaurant.
  // Reports `matched` so an unknown slug can render "not found" instead of silently
  // serving a different restaurant's menu and prices.
  const resolvedTarget = useMemo((): { r: Restaurant; matched: boolean } => {
    if (restaurantSlug) {
      // 1. Direct match in store restaurants by slug or id
      const direct = restaurants.find(
        (r) =>
          r.slug === restaurantSlug ||
          r.id === restaurantSlug ||
          r.id === `rest-${restaurantSlug}` ||
          r.id === `rest-${restaurantSlug}-01` ||
          r.id.toLowerCase().includes(restaurantSlug.toLowerCase())
      );
      if (direct) return { r: direct, matched: true };

      // 2. Pune directory fallback
      const cleanSlug = restaurantSlug.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      const dir = PUNE_RESTAURANT_DIRECTORY.find((p) => {
        const pSlug = p.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        return pSlug === cleanSlug || pSlug.includes(cleanSlug) || cleanSlug.includes(pSlug);
      });
      if (dir) {
        return { matched: true, r: {
          id: `rest-${cleanSlug}`,
          slug: cleanSlug,
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
          google_place_url: `https://search.google.com/local/writereview?placeid=${cleanSlug}`
        } as Restaurant };
      }
    }
    return { r: restaurant || restaurants[0], matched: !restaurantSlug };
  }, [restaurantSlug, restaurants, restaurant]);

  const targetRestaurant = resolvedTarget.r;
  // Only trust a "no match" verdict once the store has actually loaded restaurants,
  // otherwise the first paint would flash a not-found screen.
  const slugNotFound =
    !!restaurantSlug && !resolvedTarget.matched && restaurants.length > 0;

  // Sync route targetRestaurant with active restaurant in store
  useEffect(() => {
    if (targetRestaurant && targetRestaurant.id !== restaurant.id) {
      const match = restaurants.find((r) => r.id === targetRestaurant.id || r.slug === targetRestaurant.slug);
      if (match) {
        setCurrentRestaurant(match.id);
      } else {
        addRestaurant(targetRestaurant);
        setCurrentRestaurant(targetRestaurant.id);
      }
    }
  }, [targetRestaurant, restaurant.id, restaurants, setCurrentRestaurant, addRestaurant]);

  // Scoped dishes, categories, and tables for this restaurant
  const currentRestMenuItems = useMemo(() => {
    let rawList: MenuItem[] = [];
    // 1. Check if this is an authentic Pune landmark with a scanned real-world menu blueprint
    const blueprint = findAuthenticPuneMenu(targetRestaurant.name, targetRestaurant.slug);
    if (blueprint) {
      rawList = generateCuisineMenu(
        targetRestaurant.id,
        targetRestaurant.slug || 'menu',
        targetRestaurant.cuisine,
        targetRestaurant.name
      ).dishes;
    } else {
      // 2. Check if custom user-added items exist for this exact restaurant
      const list = menuItems.filter((m) => m.restaurant_id === targetRestaurant.id);
      if (list.length > 0) {
        rawList = list;
      } else {
        // 3. Fallback to cuisine-specific generator
        rawList = generateCuisineMenu(
          targetRestaurant.id,
          targetRestaurant.slug || 'menu',
          targetRestaurant.cuisine,
          targetRestaurant.name
        ).dishes;
      }
    }

    // Guarantee every single dish has multiple images for viewing
    return rawList.map((dish) => {
      const photos = getDishGalleryImages(dish);
      const gallery = (Array.isArray(dish.gallery_images) && dish.gallery_images.length >= 3)
        ? dish.gallery_images
        : photos;

      return {
        ...dish,
        gallery_images: gallery
      };
    });
  }, [menuItems, targetRestaurant]);

  const currentRestCategories = useMemo(() => {
    // 1. Check if an authentic scanned blueprint exists
    const blueprint = findAuthenticPuneMenu(targetRestaurant.name, targetRestaurant.slug);
    if (blueprint) {
      return generateCuisineMenu(
        targetRestaurant.id,
        targetRestaurant.slug || 'menu',
        targetRestaurant.cuisine,
        targetRestaurant.name
      ).categories;
    }

    // 2. Check if custom categories exist for this exact restaurant
    const list = categories.filter((c) => c.restaurant_id === targetRestaurant.id);
    if (list.length > 0) return list;

    // 3. Fallback to cuisine-specific generator
    return generateCuisineMenu(
      targetRestaurant.id,
      targetRestaurant.slug || 'menu',
      targetRestaurant.cuisine,
      targetRestaurant.name
    ).categories;
  }, [categories, targetRestaurant]);

  const restaurantChallenges = useMemo(() => {
    const list = challenges.filter(
      (c) =>
        (c.restaurant_id === targetRestaurant.id || (targetRestaurant.slug && c.restaurant_id.includes(targetRestaurant.slug))) &&
        c.is_active
    );
    return list.length > 0 ? list : challenges.filter((c) => c.is_active);
  }, [challenges, targetRestaurant]);

  const restaurantReviews = useMemo(() => {
    const list = reviews.filter(
      (r) => r.restaurant_id === targetRestaurant.id || (targetRestaurant.slug && r.restaurant_id.includes(targetRestaurant.slug))
    );
    return list.length > 0 ? list : reviews;
  }, [reviews, targetRestaurant]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [menuViewMode, setMenuViewMode] = useState<'showroom' | 'classic'>('showroom');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<MenuFilterState>({
    dietary: 'all',
    spice: 'all',
    sort: 'default',
    highlight: 'all'
  });
  const [expandedStories, setExpandedStories] = useState<Record<string, boolean>>({});

  const [activeDish, setActiveDish] = useState<MenuItem | null>(null);
  const [spatialDish, setSpatialDish] = useState<MenuItem | null>(null);
  const [lightboxDish, setLightboxDish] = useState<MenuItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [aiFocusDish, setAiFocusDish] = useState<MenuItem | null>(null);
  const [aiInitialQuery, setAiInitialQuery] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [waiterToast, setWaiterToast] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const toggleFavorite = (dishId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(dishId)) next.delete(dishId);
      else next.add(dishId);
      return next;
    });
  };

  const toggleStoryExpand = (dishId: string) => {
    setExpandedStories((prev) => ({ ...prev, [dishId]: !prev[dishId] }));
  };

  const handleUpdateQuantity = (dishId: string, newQty: number) => {
    if (newQty <= 0) {
      removeCartItem(dishId);
    } else {
      updateCartQuantity(dishId, newQty);
    }
  };

  const handleOpenAi = (dish: MenuItem | null = null, query: string | null = null) => {
    setAiFocusDish(dish);
    setAiInitialQuery(query);
    setIsAiOpen(true);
  };

  // Challenge & Wheel modal state
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [isTableArcadeOpen, setIsTableArcadeOpen] = useState(false);
  const [challengeModalMode, setChallengeModalMode] = useState<'review' | 'wheel'>('review');
  const [selectedChallenge, setSelectedChallenge] = useState<ReviewChallenge | null>(null);

  // Reward teaser banner dismiss state
  const [rewardBannerDismissed, setRewardBannerDismissed] = useState(false);
  const [tableSyncAlert, setTableSyncAlert] = useState<string | null>(null);
  const [activeTableGuests, setActiveTableGuests] = useState<number>(2);
  const [forceHappyHourDemo, setForceHappyHourDemo] = useState<boolean>(true);

  // Smart Happy Hour & Dynamic Pricing Active Status
  const isHappyHourActive = useMemo(() => {
    if (forceHappyHourDemo) return true;
    const hh = targetRestaurant.happy_hour_config;
    if (!hh || !hh.enabled) return false;
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();
    const [sH, sM] = (hh.start_time || '16:00').split(':').map(Number);
    const [eH, eM] = (hh.end_time || '19:30').split(':').map(Number);
    return currentMin >= (sH * 60 + sM) && currentMin <= (eH * 60 + eM);
  }, [targetRestaurant.happy_hour_config, forceHappyHourDemo]);

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
    const restTables = tables.filter(
      (t) =>
        t.restaurant_id === targetRestaurant.id ||
        (targetRestaurant.slug && t.restaurant_id.toLowerCase().includes(targetRestaurant.slug.toLowerCase()))
    );
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
        restaurant_id: targetRestaurant?.id || 'rest-saffron-house-01',
        label: 'Table 1',
        public_token: `table-token-01-${targetRestaurant?.slug || 'saffron'}`,
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
  }, [tableToken, tables, setActiveTable, targetRestaurant, activeTable?.id, activeTable?.restaurant_id]);

  // Reset selected category, search query, and active dish whenever the venue or route slug changes
  useEffect(() => {
    setSelectedCategory('all');
    setSearchQuery('');
    setActiveDish(null);
  }, [restaurantSlug, targetRestaurant.id]);

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

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.dietary !== 'all') count++;
    if (filters.spice !== 'all') count++;
    if (filters.sort !== 'default') count++;
    if (filters.highlight !== 'all') count++;
    return count;
  }, [filters]);

  const filteredDishes = useMemo(() => {
    let list = currentRestMenuItems.filter((dish) => {
      if (!dish) return false;

      // Category filter
      const matchesCat = selectedCategory === 'all' || dish.category_id === selectedCategory;
      if (!matchesCat) return false;

      // Keyword search (Check both original English and localized translated text)
      const q = searchQuery.toLowerCase().trim();
      const tDish = getTranslatedDish(dish, selectedLanguage);
      const ingredients = Array.isArray(dish.ingredients) ? dish.ingredients : [];
      const dishName = dish.name || '';
      const tDishName = tDish.name || '';
      const dishDesc = dish.short_description || dish.full_description || '';
      const tDishDesc = tDish.short_description || tDish.full_description || '';
      const matchesSearch =
        !q ||
        dishName.toLowerCase().includes(q) ||
        tDishName.toLowerCase().includes(q) ||
        dishDesc.toLowerCase().includes(q) ||
        tDishDesc.toLowerCase().includes(q) ||
        ingredients.some((ing) => (ing || '').toLowerCase().includes(q));
      if (!matchesSearch) return false;

      // ── Dietary & Allergen Preferences (#12) ──
      const flags = Array.isArray(dish.dietary_flags) ? dish.dietary_flags.map((f) => String(f).toLowerCase().replace(/[-_ ]/g, '')) : [];
      const allergens = Array.isArray(dish.allergens) ? dish.allergens.map((a) => String(a).toLowerCase()) : [];
      const isVeg =
        (flags.some((f) => f.includes('veg') || f.includes('vegetarian') || f.includes('vegan') || f.includes('jain'))) &&
        !flags.some((f) => f.includes('nonveg'));

      if (filters.dietary === 'veg' && !isVeg) return false;
      if (filters.dietary === 'non_veg' && isVeg) return false;
      if (filters.dietary === 'jain' && !flags.some((f) => f.includes('jain'))) return false;
      if (filters.dietary === 'vegan' && !flags.some((f) => f.includes('vegan'))) return false;
      if (filters.dietary === 'gluten_free' && (allergens.includes('gluten') || allergens.includes('wheat'))) return false;
      if (filters.dietary === 'halal' && !flags.some((f) => f.includes('halal'))) return false;
      if (filters.dietary === 'nut_free' && (allergens.includes('nuts') || allergens.includes('peanut') || allergens.includes('peanuts') || allergens.includes('tree nuts'))) return false;
      if (filters.dietary === 'dairy_free' && (allergens.includes('dairy') || allergens.includes('milk') || allergens.includes('cheese') || allergens.includes('paneer') || allergens.includes('butter') || allergens.includes('ghee'))) return false;
      if (filters.dietary === 'keto' && !flags.some((f) => f.includes('keto') || f.includes('lowcarb'))) return false;

      // ── Spice Heat Filter (Low to High Options) ──
      const spice = Number(dish.spice_level) || 0;
      if (filters.spice === 'mild' && spice > 1) return false;
      if (filters.spice === 'medium' && (spice < 2 || spice > 3)) return false;
      if (filters.spice === 'hot' && spice !== 4) return false;
      if (filters.spice === 'fiery' && spice < 5) return false;

      // ── Culinary Highlights ──
      if (filters.highlight === 'chef_pick' && !dish.is_chef_recommended && !dish.is_signature) return false;
      if (filters.highlight === 'bestseller' && !dish.is_bestseller) return false;
      if (filters.highlight === 'has_pairing' && !dish.pairing_drink_name) return false;
      if (filters.highlight === 'has_story' && !dish.chef_story && !dish.owner_pitch) return false;

      return true;
    });

    // ── Sorting (Price Low-to-High / High-to-Low, Spice Low-to-High / High-to-Low) ──
    if (filters.sort === 'price_asc') {
      list = [...list].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (filters.sort === 'price_desc') {
      list = [...list].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (filters.sort === 'spice_asc') {
      list = [...list].sort((a, b) => (Number(a.spice_level) || 0) - (Number(b.spice_level) || 0));
    } else if (filters.sort === 'spice_desc') {
      list = [...list].sort((a, b) => (Number(b.spice_level) || 0) - (Number(a.spice_level) || 0));
    }

    return list;
  }, [currentRestMenuItems, selectedCategory, searchQuery, filters]);

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
      <div className="min-h-screen bg-[#FFFFFF] text-[#141414] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#F5F1E8] rounded-3xl p-6 shadow-2xl text-center border border-red-500/30 text-[#141414]">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="font-serif text-xl font-bold text-[#141414] mb-2">QR Code Issue</h2>
          <p className="text-[#6E6E6E] text-sm mb-4 leading-relaxed">{errorMsg}</p>
          <Link
            to={IS_HQ_SITE ? "/customer" : "/"}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#F4511E] hover:bg-[#E24A19] text-white text-xs font-bold transition-all shadow-lg"
          >
            <Home className="w-4 h-4 text-[#141414]" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  // Filtered restaurants for Diner Hub (/menu)
  const filteredHubRestaurants = useMemo(() => {
    const map = new Map<string, Restaurant>();
    for (const r of restaurants) {
      if (
        r &&
        r.id &&
        r.name &&
        !isDishNameAsRestaurant(r) &&
        (SEED_RESTAURANTS.some((s) => s.id === r.id || s.slug === r.slug) || (r.location && r.cuisine))
      ) {
        map.set(r.slug || r.id, r);
      }
    }
    const all = Array.from(map.values());
    const q = hubSearchQuery.toLowerCase().trim();
    return all.filter((r) => {
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.cuisine?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q);

      const matchCategory =
        hubCategory === 'all' ||
        (r.cuisine && r.cuisine.toLowerCase().includes(hubCategory.toLowerCase())) ||
        (r.location && r.location.toLowerCase().includes(hubCategory.toLowerCase()));

      return matchSearch && matchCategory;
    });
  }, [restaurants, hubSearchQuery, hubCategory]);

  // An unrecognised slug must never fall through to another restaurant's menu:
  // a diner scanning a stale QR would be shown the wrong dishes and the wrong prices.
  if (slugNotFound) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FFFFFF] text-[#141414] font-sans px-6 text-center">
        <div className="mb-5"><Logo variant="tagline" tone="green" height={64} /></div>
        <h1 className="font-serif text-2xl font-bold mb-2">Menu not found</h1>
        <p className="text-sm text-[#6E6E6E] max-w-xs mb-6">
          We couldn&apos;t find a restaurant for this code. The QR may be out of date —
          please ask your server for the current one.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-full bg-[#F4511E] text-white text-sm font-bold"
        >
          Browse restaurants
        </Link>
      </div>
    );
  }

  if (!restaurantSlug) {
    return (
      <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#FFFFFF] text-[#141414] font-sans pb-24">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-black/10 px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F4511E] flex items-center justify-center font-black text-white text-base shadow-xs">
              M
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-serif font-black text-lg tracking-tight text-[#141414]">
                  menuz
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F4511E]/15 text-[#2D4A3E] border border-[#F4511E]/30 font-bold">
                  DINER HUB
                </span>
              </div>
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsQrScannerOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#F4511E] hover:bg-[#F4511E] active:scale-95 text-black text-xs font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer transition-all"
            >
              <QrCode className="w-3.5 h-3.5 text-black" />
              <span>Scan Table QR</span>
            </button>
            <LanguageSelector />
          </div>
        </header>

        {/* Hero section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#F4511E]/15 text-[#2D4A3E] border border-[#F4511E]/30">
              Pune Food &amp; Dining Ecosystem
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#141414] tracking-tight">
              Pune Digital Table Menus
            </h1>
            <p className="text-sm text-[#6E6E6E] leading-relaxed">
              Scan your table standee QR to join a live multiplayer session, or choose any of Pune's iconic dining landmarks to explore authentic digital menus with instant dietary filters.
            </p>
          </div>

          {/* Table Scan Card */}
          <div className="max-w-2xl mx-auto bg-[#F5F1E8] border border-black/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#2D4A3E]">
                <QrCode className="w-4 h-4" />
                <span>Seated at a Table Right Now?</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#141414]">Join Your Table's Multiplayer Cart</h3>
              <p className="text-xs text-[#6E6E6E] max-w-md">
                Point your phone camera at the Menuz table standee to immediately order dishes, call the waiter, and split the bill.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsQrScannerOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-[#F4511E] hover:bg-[#E24A19] active:scale-95 text-white font-bold text-sm shadow-md flex items-center space-x-2 shrink-0 cursor-pointer transition-all"
            >
              <QrCode className="w-5 h-5 text-[#141414]" />
              <span>Launch Camera Scanner</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative max-w-xl mx-auto">
              <Search className="w-5 h-5 text-[#6E6E6E] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={hubSearchQuery}
                onChange={(e) => setHubSearchQuery(e.target.value)}
                placeholder="Search restaurant or dishes (e.g. Vaishali, Goodluck, Dosa, Strudel)..."
                className="w-full bg-[#F5F1E8] border border-black/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-[#141414] placeholder-[#6E6E6E] focus:outline-none focus:border-[#F4511E] shadow-inner"
              />
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['all', 'FC Road', 'Koregaon Park', 'Camp', 'Pure Veg', 'South Indian', 'Irani Cafe', 'Bakery', 'Continental'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setHubCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    hubCategory === cat
                      ? 'bg-[#F4511E] text-black font-bold shadow-xs'
                      : 'bg-[#F5F1E8] hover:bg-black/[0.06] text-[#6E6E6E] border border-black/10'
                  }`}
                >
                  {cat === 'all' ? 'All Pune Landmarks' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Menus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHubRestaurants.map((r) => (
              <div
                key={r.id}
                className="bg-[#F5F1E8] border border-black/10 hover:border-[#F4511E]/40 rounded-2xl overflow-hidden shadow-xl transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-[#F5F1E8]">
                    <img
                      src={r.logo_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop'}
                      alt={r.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#FFC46B] border border-[#F4511E]/30 shadow-xs">
                      {r.location || 'Pune, India'}
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h3 className="font-serif text-lg font-bold text-[#141414] group-hover:text-[#2D4A3E] transition-colors">
                      {r.name}
                    </h3>
                    <p className="text-xs text-[#6E6E6E] line-clamp-1">{r.cuisine}</p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <Link
                    to={`/r/${r.slug}/menu`}
                    className="w-full py-2.5 rounded-xl bg-[#F4511E]/15 hover:bg-[#F4511E] text-[#2D4A3E] hover:text-black border border-[#F4511E]/30 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Live Menu &amp; Order</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <QrScannerModal
          isOpen={isQrScannerOpen}
          onClose={() => setIsQrScannerOpen(false)}
        />
      </div>
    );
  }

  return (
    <div ref={mainRef} className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#FFFFFF] text-[#141414] pb-36 font-sans selection:bg-[#F4511E]/30 selection:text-[#141414]">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* LIVE TOAST: WAITER CALLED NOTIFICATION                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {waiterCalled && (
        <div className="fixed top-4 left-4 right-4 max-w-sm mx-auto z-50 bg-[#F5F1E8] text-[#141414] p-3.5 rounded-2xl border border-emerald-500/50 shadow-2xl flex items-center space-x-3 animate-slideDown">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0 text-white shadow-md">
            <Bell className="w-4 h-4 text-[#141414] animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-xs text-[#141414]">Waiter Alert Transmitted!</p>
            <p className="text-[10px] text-[#6E6E6E]">
              Staff has been notified for {activeTable?.label || 'your table'}. A server is on their way.
            </p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 0. STITCH TOP APP BAR (HEADER)                              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-4 py-3 bg-[#FFFFFF]/90 backdrop-blur-md shadow-sm border-b border-black/5">
        <Link to="/" title="Return to Pune Dining Discovery Home" className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F5F1E8] group-hover:bg-[#F4511E] flex items-center justify-center text-[#F4511E] group-hover:text-white border border-black/5 group-hover:border-[#F4511E] flex-shrink-0 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-base sm:text-lg">arrow_back</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-[#141414] group-hover:text-[#2D4A3E] tracking-tight transition-colors">
                {targetRestaurant.name || 'Saffron House'}
              </h1>
              <span className="text-[11px] text-[#6E6E6E] font-medium hidden xs:inline">
                · {targetRestaurant.location || 'Koregaon Park'}
              </span>
            </div>
            <p className="text-[11px] text-[#2D4A3E] flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#88d982] inline-block animate-pulse"></span>
              {activeTable ? activeTable.label : 'Table 04'} · {activeTable?.capacity || 2} Guests
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search dishes"
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isSearchExpanded || searchQuery
                ? 'bg-[#F4511E] text-white'
                : 'bg-[#F5F1E8] text-[#6E6E6E] hover:text-[#141414] hover:bg-[#EFE9DD]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">search</span>
          </button>
          <button
            type="button"
            aria-label="Filter dishes"
            onClick={() => setIsFilterModalOpen(true)}
            className="w-9 h-9 rounded-full bg-[#F5F1E8] flex items-center justify-center text-[#6E6E6E] hover:text-[#141414] hover:bg-[#EFE9DD] transition-colors relative cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">tune</span>
            {activeFiltersCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F4511E]"></span>
            )}
          </button>
          <button
            type="button"
            aria-label="Call Service"
            onClick={handleCallWaiter}
            disabled={waiterCalled}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              waiterCalled
                ? 'bg-emerald-600 text-white'
                : 'bg-[#F5F1E8] text-[#6E6E6E] hover:text-[#141414] hover:bg-[#EFE9DD]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">room_service</span>
          </button>
        </div>
      </header>

      {/* Expandable Search Input Drawer */}
      {isSearchExpanded && (
        <div className="fixed top-[57px] left-0 right-0 z-30 bg-[#F5F1E8]/95 backdrop-blur-md px-4 py-2 border-b border-black/5 animate-slideDown shadow-lg">
          <div className="max-w-xl mx-auto relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[#6E6E6E] text-lg">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search curries, biryanis, kebabs, breads..."
              className="w-full bg-[#F5F1E8] text-[#141414] pl-10 pr-10 py-2 rounded-full text-xs placeholder-[#6E6E6E]/70 border border-black/10 focus:outline-none focus:border-[#F4511E]"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[#6E6E6E] hover:text-[#141414]"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT CONTAINER                                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <main className="pt-16 max-w-xl mx-auto px-4 md:px-0">
        {/* Sticky Category Pill Rail */}
        <section className="sticky top-[57px] z-20 bg-[#FFFFFF]/95 backdrop-blur-md py-2.5 -mx-4 px-4 overflow-x-auto no-scrollbar border-b border-black/5 flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#141414] text-white font-bold shadow-sm'
                : 'bg-[#F5F1E8] text-[#6E6E6E] hover:text-[#141414] border border-black/5'
            }`}
          >
            All Dishes
          </button>
          {currentRestCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#141414] text-white font-bold shadow-sm'
                  : 'bg-[#F5F1E8] text-[#6E6E6E] hover:text-[#141414] border border-black/5'
              }`}
            >
              {translateCategory(cat.name, selectedLanguage)}
            </button>
          ))}
        </section>

        {/* Active Filter Chips Bar */}
        {(activeFiltersCount > 0 || searchQuery) && (
          <div className="mt-3 flex items-center flex-wrap gap-1.5 text-xs">
            <span className="text-[#6E6E6E] text-[11px]">Filtered:</span>
            {searchQuery && (
              <span className="px-2 py-0.5 rounded-full bg-[#F5F1E8] border border-black/10 text-[#141414] flex items-center gap-1">
                "{searchQuery}"
                <button type="button" onClick={() => setSearchQuery('')} className="hover:text-[#C23A1C]">×</button>
              </span>
            )}
            {filters.dietary !== 'all' && (
              <span className="px-2 py-0.5 rounded-full bg-[#F4511E]/15 border border-[#F4511E]/30 text-[#F4511E] flex items-center gap-1 capitalize">
                {filters.dietary.replace('_', ' ')}
                <button type="button" onClick={() => setFilters((prev) => ({ ...prev, dietary: 'all' }))}>×</button>
              </span>
            )}
            {filters.spice !== 'all' && (
              <span className="px-2 py-0.5 rounded-full bg-[#F4511E]/15 border border-[#F4511E]/30 text-[#2D4A3E] flex items-center gap-1 capitalize">
                {filters.spice} spice
                <button type="button" onClick={() => setFilters((prev) => ({ ...prev, spice: 'all' }))}>×</button>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilters({ dietary: 'all', spice: 'all', sort: 'default', highlight: 'all' });
              }}
              className="text-[11px] text-[#F4511E] hover:underline ml-1 cursor-pointer"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Surprise Table Treat / Spin Wheel Banner */}
        {selectedChallenge && !rewardBannerDismissed && (
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-[#F5F1E8] via-[#EFE9DD] to-[#F5F1E8] border border-[#F4511E]/30 shadow-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F4511E]/15 flex items-center justify-center text-[#2D4A3E] flex-shrink-0">
                <Gift className="w-5 h-5 text-[#2D4A3E] animate-bounce" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#141414]">Surprise Table Treat Available!</p>
                <p className="text-[11px] text-[#6E6E6E]">Spin the wheel to unlock complimentary desserts or dishes.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleOpenChallenge(undefined, 'wheel')}
              className="px-3 py-1.5 rounded-full bg-[#F4511E] hover:bg-[#E24A19] text-white text-xs font-bold shadow-md shadow-[#F4511E]/20 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
            >
              Spin Now
            </button>
          </div>
        )}

        {/* Section Header & View Mode Switcher */}
        <div className="mt-6 mb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F4511E] animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#2D4A3E] font-semibold">
                {selectedCategory === 'all'
                  ? 'FULL COLLECTION // SERIES 01'
                  : `${categories.find((c) => c.id === selectedCategory)?.name?.toUpperCase() || 'COLLECTION'} // SERIES 01`}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#141414] tracking-tight mt-0.5">
              {menuViewMode === 'showroom' ? 'Culinary Showroom Wall' : 'Menu Selection'}
            </h2>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-[#F5F1E8] border border-black/10 rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => setMenuViewMode('showroom')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                menuViewMode === 'showroom'
                  ? 'bg-[#141414] text-white font-bold shadow-md'
                  : 'text-[#6E6E6E] hover:text-[#141414]'
              }`}
              title="Showroom Wall Mode (Squares)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Showroom Wall</span>
            </button>
            <button
              type="button"
              onClick={() => setMenuViewMode('classic')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                menuViewMode === 'classic'
                  ? 'bg-[#141414] text-white font-bold shadow-md'
                  : 'text-[#6E6E6E] hover:text-[#141414]'
              }`}
              title="Classic Card List"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>

        {filteredDishes.length === 0 ? (
          <div className="text-center py-16 bg-[#F5F1E8] rounded-2xl border border-black/5 p-6">
            <span className="material-symbols-outlined text-4xl text-[#6E6E6E] mb-2">restaurant</span>
            <h3 className="text-sm font-bold text-[#141414]">No dishes match your selection</h3>
            <p className="text-xs text-[#6E6E6E] mt-1">Try adjusting your dietary or search filters</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setFilters({ dietary: 'all', spice: 'all', sort: 'default', highlight: 'all' });
              }}
              className="mt-4 px-4 py-1.5 rounded-full bg-[#F4511E] text-white text-xs font-semibold cursor-pointer"
            >
              View Full Menu
            </button>
          </div>
        ) : menuViewMode === 'showroom' ? (
          /* ── SHOWROOM WALL: SQUARES NEXT TO EACH OTHER (LAST DEPT. STYLE) ── */
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {filteredDishes.map((dish, index) => {
              const isFav = favorites.has(dish.id);
              const tDish = getTranslatedDish(dish, selectedLanguage);
              const flags = Array.isArray(dish.dietary_flags)
                ? dish.dietary_flags.map((f) => String(f).toLowerCase().replace(/[-_ ]/g, ''))
                : [];
              const isVeg =
                flags.some(
                  (f) =>
                    f.includes('veg') ||
                    f.includes('vegetarian') ||
                    f.includes('vegan') ||
                    f.includes('jain')
                ) && !flags.some((f) => f.includes('nonveg'));
              const catName = categories.find((c) => c.id === dish.category_id)?.name;
              const cartItem = cart.find((ci) => ci.menu_item_id === dish.id);

              return (
                <div
                  key={dish.id}
                  onClick={() => setSpatialDish(dish)}
                  className="group relative flex flex-col cursor-pointer"
                >
                  {/* Square Image Box with Multi-Photo Gallery Toggle */}
                  <DishCardImageGallery
                    dish={dish}
                    aspectRatioClass="aspect-square"
                    isVeg={isVeg}
                    isFav={isFav}
                    onToggleFavorite={toggleFavorite}
                    cartQuantity={cartItem?.quantity || 0}
                    onOpenModal={() => setSpatialDish(dish)}
                    dishNameDisplay={tDish.name || dish.name}
                  />

                  {/* Edge-lit Illuminated Glass Shelf Line (LAST DEPT. signature plinth) */}
                  <div className="w-full mt-2 sm:mt-3 flex flex-col items-center">
                    <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#F4511E]/60 group-hover:via-[#F4511E] to-transparent transition-all duration-300 shadow-[0_0_12px_rgba(255,185,85,0.45)] group-hover:shadow-[0_0_24px_rgba(255,185,85,0.9)]" />
                    <div className="w-[88%] h-1 bg-gradient-to-b from-[#F4511E]/15 to-transparent rounded-b" />
                  </div>

                  {/* Dish Name & Details Written Directly Below (Full Name, Completely Readable) */}
                  <div className="mt-2 sm:mt-3 px-0.5 sm:px-1 flex flex-col gap-1 sm:gap-1.5">
                    {/* Top sub-row: Serial Index + Price */}
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                      <span className="uppercase text-[#6E6E6E] tracking-wider text-[9px] sm:text-[10px] truncate max-w-[65%]">
                        {String(index + 1).padStart(2, '0')} // {catName || 'STUDIO'}
                      </span>
                      <span className="font-mono font-bold text-xs sm:text-sm text-[#2D4A3E]">
                        ₹{dish.price}
                      </span>
                    </div>

                    {/* Full Dish Name: completely readable, wraps naturally, clean font sizing */}
                    <h3 className="text-xs sm:text-base font-bold font-serif text-[#141414] group-hover:text-[#2D4A3E] transition-colors leading-snug tracking-tight">
                      {tDish.name || dish.name}
                    </h3>

                    {/* Bottom Metadata: Spice heat scale & serving size */}
                    <div className="flex items-center flex-wrap gap-1 sm:gap-2 text-[9px] sm:text-[11px] text-[#6E6E6E] font-mono mt-0.5">
                      {dish.spice_level > 0 && (
                        <span className="flex items-center text-[#F4511E]">
                          <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline mr-0.5" />
                          <span>Heat {dish.spice_level}/5</span>
                        </span>
                      )}
                      {dish.serving_size && (
                        <>
                          <span className="text-[#141414]/20">•</span>
                          <span>Serves {dish.serving_size}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── CLASSIC CARD LIST MODE ── */
          <div className="mt-4 space-y-5">
            {filteredDishes.map((dish) => {
              const itemQuantity = cart.find((ci) => ci.menu_item_id === dish.id)?.quantity || 0;
              const isFav = favorites.has(dish.id);
              const tDish = getTranslatedDish(dish, selectedLanguage);
              const flags = Array.isArray(dish.dietary_flags) ? dish.dietary_flags.map((f) => String(f).toLowerCase().replace(/[-_ ]/g, '')) : [];
              const isVeg = (flags.some((f) => f.includes('veg') || f.includes('vegetarian') || f.includes('vegan') || f.includes('jain'))) && !flags.some((f) => f.includes('nonveg'));

              return (
                <article
                  key={dish.id}
                  className="bg-[#F5F1E8] rounded-2xl overflow-hidden border border-black/5 shadow-xl transition-all duration-300 hover:border-black/10"
                >
                  {/* Dish Image (4:3 aspect ratio) with Multi-Photo Gallery Toggle */}
                  <DishCardImageGallery
                    dish={dish}
                    aspectRatioClass="aspect-[4/3]"
                    isVeg={isVeg}
                    isFav={isFav}
                    onToggleFavorite={toggleFavorite}
                    cartQuantity={itemQuantity}
                    onOpenModal={() => setSpatialDish(dish)}
                    dishNameDisplay={tDish.name || dish.name}
                  />

                  {/* Dish Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h2
                          onClick={() => setSpatialDish(dish)}
                          className="text-base font-bold text-[#141414] tracking-tight hover:text-[#F4511E] cursor-pointer transition-colors"
                        >
                          {tDish.name || dish.name}
                        </h2>
                        <p className="text-xs text-[#6E6E6E] line-clamp-2 mt-1 leading-relaxed">
                          {tDish.short_description || dish.short_description || dish.full_description}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-base font-bold text-[#2D4A3E]">
                          ₹{dish.price}
                        </span>
                      </div>
                    </div>

                    {/* Meta Chips */}
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-[#6E6E6E] flex-wrap">
                      {dish.serving_size && (
                        <span className="flex items-center gap-1 bg-[#F5F1E8] px-2 py-0.5 rounded-full border border-black/5">
                          <span className="material-symbols-outlined text-[13px] text-[#2D4A3E]">scale</span>
                          Serves {dish.serving_size}
                        </span>
                      )}
                      {dish.spice_level > 0 && (
                        <span className="flex items-center gap-1 bg-[#F5F1E8] px-2 py-0.5 rounded-full border border-black/5 capitalize">
                          <span className="material-symbols-outlined text-[13px] text-[#F4511E]">local_fire_department</span>
                          {dish.spice_level === 1 ? 'Mild' : dish.spice_level === 2 ? 'Medium' : 'Hot'}
                        </span>
                      )}
                      {dish.pairing_drink_name && (
                        <span className="flex items-center gap-1 bg-[#F5F1E8] px-2 py-0.5 rounded-full border border-black/5">
                          <span className="material-symbols-outlined text-[13px] text-[#2D4A3E]">wine_bar</span>
                          Pairs with {dish.pairing_drink_name}
                        </span>
                      )}
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSpatialDish(dish)}
                        className="text-xs text-[#6E6E6E] hover:text-[#141414] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">info</span>
                        <span>Sourcing & Nutrition</span>
                      </button>

                      {/* Cart Stepper or Add Button */}
                      {itemQuantity > 0 ? (
                        <div className="flex items-center bg-[#F5F1E8] rounded-full p-0.5 border border-black/10">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(dish.id, itemQuantity - 1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/[0.06] text-[#141414] active:scale-95 transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#141414]">
                            {itemQuantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(dish.id, itemQuantity + 1)}
                            className="w-7 h-7 rounded-full bg-[#F4511E] text-white flex items-center justify-center active:scale-95 transition-all shadow-sm cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            addItemToCart({
                              menu_item_id: dish.id,
                              name: dish.name,
                              price: dish.price,
                              quantity: 1,
                              image_url: dish.image_url,
                              selected_options: []
                            });
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-[#F4511E] hover:bg-[#E24A19] text-white text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all shadow-md shadow-[#F4511E]/20 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">add</span>
                          <span>Add to Order</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Captain / Chef AI Recommendations Card */}
        <div className="my-6 p-4 rounded-2xl bg-[#F5F1E8] border border-black/5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EFE9DD] flex items-center justify-center text-[#2D4A3E] flex-shrink-0">
              <span className="material-symbols-outlined text-base">restaurant_menu</span>
            </div>
            <div>
              <p className="text-xs text-[#141414] font-semibold">Need Culinary Recommendations?</p>
              <p className="text-[11px] text-[#6E6E6E]">Our captain or Chef AI can tailor spice levels and pairing courses.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsAiOpen(true)}
              className="px-3 py-1.5 rounded-full bg-[#EFE9DD] hover:bg-[#EFE9DD] text-[#141414] text-xs border border-black/10 active:scale-95 transition-transform flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-[#2D4A3E]">sparkles</span>
              <span>Chef AI</span>
            </button>
            <button
              type="button"
              onClick={handleCallWaiter}
              disabled={waiterCalled}
              className="px-3 py-1.5 rounded-full bg-[#F4511E] hover:bg-[#E24A19] text-white text-xs font-semibold active:scale-95 transition-transform cursor-pointer"
            >
              {waiterCalled ? 'Alerted' : 'Call Captain'}
            </button>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Contextual Order Tray */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-16 left-0 right-0 z-40 px-4 pointer-events-none max-w-xl mx-auto">
          <div className="pointer-events-auto bg-[#EFE9DD]/95 backdrop-blur-xl border border-black/10 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F4511E]/15 flex items-center justify-center text-[#F4511E]">
                <span className="material-symbols-outlined text-lg">receipt_long</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-[#141414] font-semibold">
                    {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} in table order
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#ab8980]"></span>
                  <span className="text-xs text-[#2D4A3E] font-bold">
                    ₹{cartSubtotal.toFixed(0)}
                  </span>
                </div>
                <p className="text-[11px] text-[#6E6E6E]">Ready to transmit to kitchen</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 rounded-full bg-[#F4511E] hover:bg-[#E24A19] text-white text-xs font-semibold shadow-md shadow-[#F4511E]/25 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <span>Review & Send</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 sm:px-4 py-2 bg-[#F5F1E8]/95 backdrop-blur-lg shadow-2xl border-t border-black/5">
        <Link
          to="/"
          className="flex flex-col items-center justify-center text-[#6E6E6E] hover:text-[#F4511E] px-2.5 sm:px-4 py-1 transition-colors duration-200 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg sm:text-xl">home</span>
          <span className="text-[10px] sm:text-[11px] mt-0.5 font-medium">Home</span>
        </Link>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center text-[#F4511E] px-2.5 sm:px-4 py-1 transition-colors duration-200 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg sm:text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            menu_book
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold mt-0.5">Menu</span>
        </button>
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center text-[#6E6E6E] hover:text-[#141414] px-4 py-1 transition-colors duration-200 active:scale-95 relative cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">receipt_long</span>
          <span className="text-[11px] mt-0.5">Table Order</span>
          {totalCartCount > 0 && (
            <span className="absolute top-0 right-3 w-4 h-4 rounded-full bg-[#F4511E] text-white text-[9px] font-bold flex items-center justify-center">
              {totalCartCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={handleCallWaiter}
          disabled={waiterCalled}
          className="flex flex-col items-center justify-center text-[#6E6E6E] hover:text-[#141414] px-4 py-1 transition-colors duration-200 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">room_service</span>
          <span className="text-[11px] mt-0.5">{waiterCalled ? 'Alerted' : 'Concierge'}</span>
        </button>
        <button
          type="button"
          onClick={() => setIsTableArcadeOpen(true)}
          className="flex flex-col items-center justify-center text-[#6E6E6E] hover:text-[#141414] px-4 py-1 transition-colors duration-200 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">sports_esports</span>
          <span className="text-[11px] mt-0.5">Arcade</span>
        </button>
      </nav>

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

      {/* Table Arcade Modal (Solitaire, Crossword, Table Trivia & Who Pays The Bill) */}
      <TableArcadeModal
        isOpen={isTableArcadeOpen}
        onClose={() => setIsTableArcadeOpen(false)}
        tableLabel={activeTable?.label || 'Table 1'}
        restaurantName={targetRestaurant.name || 'Menuz Diner'}
      />

      {/* Spatial Dish Showroom Stage (LAST DEPT. Zoom Animation) */}
      {spatialDish && (
        <SpatialDishShowroomModal
          dish={spatialDish}
          onClose={() => setSpatialDish(null)}
          onAskAi={(dish) => {
            setSpatialDish(null);
            setAiFocusDish(dish);
            setIsAiOpen(true);
          }}
          onOpenCart={() => setIsCartOpen(true)}
          categoryName={categories.find((c) => c.id === spatialDish?.category_id)?.name}
          tableLabel={activeTable?.label}
        />
      )}

      {/* Dish Detail Modal (Standard Quick Drawer) */}
      {activeDish && (
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
      )}

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

      {/* Multi-Dimensional Dietary, Allergen & Spice Filter Modal (#12) */}
      <MenuFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        totalFilteredCount={filteredDishes.length}
      />

      {/* Fullscreen HD Image Lightbox & Zoom Viewer */}
      <ImageLightboxModal
        isOpen={!!lightboxDish}
        dish={lightboxDish}
        initialImageIndex={lightboxIndex}
        onClose={() => setLightboxDish(null)}
        onOpenCart={() => setIsCartOpen(true)}
      />
    </div>
  );
};
