import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { generateCuisineMenu } from '../data/cuisineMenuGenerator';

import {
  DollarSign,
  ShoppingBag,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Bell,
  X,
  ShieldCheck,
  Upload,
  Building2,
  Search,
  Star,
  Printer,
  Share2,
  UtensilsCrossed,
  ExternalLink,
  ArrowLeft,
  ChefHat,
  ChevronRight,
  Sliders,
  Zap,
  Gift,
  LayoutGrid,
  Radio,
  ArrowUpRight,
  Edit3,
  Check,
  Layers,
  TrendingUp,
  Receipt,
  CircleDollarSign,
  Plus,
  Trash2
} from 'lucide-react';
import { useRestaurantStore, isDishNameAsRestaurant } from '../store/restaurantStore';
import { SEED_RESTAURANTS } from '../data/seedData';
import { PetpoojaConfig, RoyalPosConfig, RecahoConfig, RancelabConfig, MenuItem, Restaurant } from '../types';
import { PetpoojaIntegrationPanel } from '../components/PetpoojaIntegrationPanel';
import { RoyalPosIntegrationPanel } from '../components/RoyalPosIntegrationPanel';
import { RecahoIntegrationPanel } from '../components/RecahoIntegrationPanel';
import { RancelabIntegrationPanel } from '../components/RancelabIntegrationPanel';
import { TableManagementModal } from '../components/TableManagementModal';
import { AiAssistantDrawer } from '../components/AiAssistantDrawer';
import { ChefOwnerQuestionnaireModal } from '../components/ChefOwnerQuestionnaireModal';
import { RestaurantLaunchKitModal } from '../components/RestaurantLaunchKitModal';
import { SmartOperationsSettingsModal } from '../components/SmartOperationsSettingsModal';
import { DishMultiImageManagerModal } from '../components/DishMultiImageManagerModal';
import { RestaurantPhotoManagerModal } from '../components/RestaurantPhotoManagerModal';
import { Interactive3dFloorPlan } from '../components/Interactive3dFloorPlan';
import { run100PhotoBenchmark, processBatchImagesParallel, BatchProcessingStats } from '../services/turboImagePipeline';
import { printDirectWebUsb } from '../services/webUsbPrinterService';
import { Order } from '../types';

export const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { restaurantSlug } = useParams<{ restaurantSlug?: string }>();
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const setCurrentRestaurant = useRestaurantStore((state) => state.setCurrentRestaurant);
  const deleteRestaurant = useRestaurantStore((state) => state.deleteRestaurant);
  const tables = useRestaurantStore((state) => state.tables);
  const menuItems = useRestaurantStore((state) => state.menuItems);
  const categories = useRestaurantStore((state) => state.categories);
  const orders = useRestaurantStore((state) => state.orders);
  const reviews = useRestaurantStore((state) => state.reviews);
  const notifications = useRestaurantStore((state) => state.notifications);
  const markNotificationRead = useRestaurantStore((state) => state.markNotificationRead);
  const resetToDefaults = useRestaurantStore((state) => state.resetToDefaults);
  const updateRestaurant = useRestaurantStore((state) => state.updateRestaurant);
  const updateMenuItem = useRestaurantStore((state) => state.updateMenuItem);
  const toggleItemAvailability = useRestaurantStore((state) => state.toggleItemAvailability);

  // ── Dedicated Popup Windows (Modals) ───────────────────────────
  const [isFloorModalOpen, setIsFloorModalOpen] = useState(false);
  const [isMenuPhotosModalOpen, setIsMenuPhotosModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isSmartHubModalOpen, setIsSmartHubModalOpen] = useState(false);
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Floor view mode (Floor Seating Grid vs POS Table Revenue)
  const [floorViewTab, setFloorViewTab] = useState<'grid' | 'revenue'>('grid');

  // Inline Table Add State & Refs
  const [isAddingCustomTable, setIsAddingCustomTable] = useState(false);
  const [newTableLabel, setNewTableLabel] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState(4);
  const [newTableSection, setNewTableSection] = useState('Indoor Main');
  const addTableFormRef = useRef<HTMLDivElement>(null);
  const addTableInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAddTable = () => {
    setIsAddingCustomTable(true);
    setTimeout(() => {
      addTableFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      addTableInputRef.current?.focus();
    }, 100);
  };

  // Inline Dish Editing State
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [editDishDraft, setEditDishDraft] = useState<{
    name: string;
    price: number | string;
    short_description: string;
  }>({ name: '', price: 0, short_description: '' });
  const [dishSaveSuccessId, setDishSaveSuccessId] = useState<string | null>(null);

  // Sub-modals
  const [isAiStudioOpen, setIsAiStudioOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isLaunchKitOpen, setIsLaunchKitOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isOffboardModalOpen, setIsOffboardModalOpen] = useState(false);
  const [photoStudioDish, setPhotoStudioDish] = useState<MenuItem | null>(null);
  const [isRestaurantPhotoModalOpen, setIsRestaurantPhotoModalOpen] = useState(false);
  const [photoStudioSearch, setPhotoStudioSearch] = useState('');
  const [smartSettingsTab, setSmartSettingsTab] = useState<'happy_hour' | 'pairings' | 'rewards' | null>(null);
  const [selectedPosTab, setSelectedPosTab] = useState<'petpooja' | 'royalpos' | 'recaho' | 'rancelab'>(
    (restaurant.pos_provider as any) || 'petpooja'
  );

  const [usbPrintLoading, setUsbPrintLoading] = useState(false);
  const [usbPrintStatus, setUsbPrintStatus] = useState<string | null>(null);

  // Restaurant Partner Hub State (for generic /manage route)
  const [partnerSearchQuery, setPartnerSearchQuery] = useState('');
  const [partnerAreaFilter, setPartnerAreaFilter] = useState('all');

  // Table store actions
  const addTable = useRestaurantStore((state) => state.addTable);
  const updateTable = useRestaurantStore((state) => state.updateTable);
  const deleteTable = useRestaurantStore((state) => state.deleteTable);

  const handleCreateCustomTable = () => {
    const label = newTableLabel.trim() || `Table ${activeTablesList.length + 1}`;
    const token = `table-token-${Date.now().toString().slice(-6)}-${restaurant.slug}`;
    addTable({
      id: `tbl-${Date.now()}`,
      restaurant_id: restaurant.id,
      label,
      section: newTableSection,
      capacity: newTableCapacity,
      public_token: token,
      is_active: true
    });
    setNewTableLabel('');
    setIsAddingCustomTable(false);
  };

  // Bulletproof background scroll lock when any popup / modal is open
  const isAnyModalOpen = Boolean(
    isFloorModalOpen ||
    isMenuPhotosModalOpen ||
    isReviewsModalOpen ||
    isSmartHubModalOpen ||
    isPosModalOpen ||
    isSettingsModalOpen ||
    isAiStudioOpen ||
    isAiDrawerOpen ||
    isLaunchKitOpen ||
    isTableModalOpen ||
    isOffboardModalOpen ||
    photoStudioDish ||
    isRestaurantPhotoModalOpen ||
    smartSettingsTab
  );

  useEffect(() => {
    if (isAnyModalOpen) {
      document.documentElement.classList.add('modal-locked');
      document.body.classList.add('modal-locked');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.classList.remove('modal-locked');
      document.body.classList.remove('modal-locked');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.classList.remove('modal-locked');
      document.body.classList.remove('modal-locked');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isAnyModalOpen]);



  const handleForceRefresh = () => {
    try {
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
    } catch (e) {}
    window.location.reload();
  };

  // Sync route slug to current active restaurant & protect against any dish items
  useEffect(() => {
    if (isDishNameAsRestaurant(restaurant)) {
      const valid = restaurants.find((r) => !isDishNameAsRestaurant(r)) || SEED_RESTAURANTS[0];
      setCurrentRestaurant(valid.id);
      if (restaurantSlug) {
        navigate(`/manage/${valid.slug}`);
      }
      return;
    }
    if (restaurantSlug) {
      const match = restaurants.find((r) => r.slug === restaurantSlug && !isDishNameAsRestaurant(r));
      if (match && match.id !== restaurant.id) {
        setCurrentRestaurant(match.id);
      }
    }
  }, [restaurantSlug, restaurants, restaurant, setCurrentRestaurant, navigate]);

  // Scoped entities for active restaurant
  const currentRestTables = tables.filter((t) => t.restaurant_id === restaurant.id);
  const activeTablesList = currentRestTables;

  const fallbackCuisineMenu = useMemo(() => {
    return generateCuisineMenu(
      restaurant.id,
      restaurant.slug || 'venue',
      restaurant.cuisine,
      restaurant.name
    );
  }, [restaurant.id, restaurant.slug, restaurant.cuisine, restaurant.name]);

  const currentRestMenuItems = menuItems.filter((m) => m.restaurant_id === restaurant.id);
  const activeMenuItemsList = currentRestMenuItems.length > 0 ? currentRestMenuItems : fallbackCuisineMenu.dishes;

  const currentRestOrders = orders.filter((o) => o.restaurant_id === restaurant.id);
  const activeOrdersList = currentRestOrders;

  const currentRestNotifications = notifications.filter((n) => !n.restaurant_id || n.restaurant_id === restaurant.id);
  const activeNotificationsList = currentRestNotifications;

  const handleTestUsbPrint = async () => {
    setUsbPrintLoading(true);
    setUsbPrintStatus(null);
    const sampleTestOrder: Order = {
      id: `ord-usb-${Date.now()}`,
      restaurant_id: restaurant.id,
      table_id: 'tbl-4',
      table_label: 'Table 4 (Patio)',
      anonymous_session_id: 'sess-usb-test',
      order_number: 'ORD-USB-101',
      total_amount: 880,
      subtotal_amount: 840,
      tax_amount: 40,
      status: 'received',
      source: 'menuz',
      currency: 'INR',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: activeMenuItemsList.slice(0, 2).map((item) => ({
        id: `it-${item.id}`,
        order_id: 'ord-usb',
        menu_item_id: item.id,
        item_name_snapshot: item.name,
        unit_price_snapshot: item.price,
        quantity: 1,
        selected_options_snapshot: [],
        line_total_amount: item.price
      }))
    };

    const res = await printDirectWebUsb(sampleTestOrder, restaurant, 'Complimentary Chef Dessert (Food Reward)');
    setUsbPrintLoading(false);
    setUsbPrintStatus(res.message);
    setTimeout(() => setUsbPrintStatus(null), 6000);
  };

  const totalVolume = activeOrdersList.reduce((sum, o) => sum + o.total_amount, 0);
  const totalOrdersCount = activeOrdersList.length;
  const unreadServiceAlerts = activeNotificationsList.filter(
    (n) =>
      (n.type === 'service_alert' ||
        (n.message &&
          (n.message.includes('URGENT') ||
            n.message.includes('below 4') ||
            n.message.includes('Service Concern')))) &&
      !n.read
  );

  // Smart Pairings active status
  const isPairingsActive = restaurant.smart_pairings_config?.enabled !== false;
  const pairingsBadgeText = restaurant.smart_pairings_config?.badge_text || "🧑‍🍳 Chef's Recommended Pairings";

  // List of all main operational modules (compact list without details)
  const MANAGEMENT_MODULES = [
    {
      id: 'floor',
      icon: '🪑',
      title: 'Floor Plan & Seating Layout Chart',
      badge: `${activeTablesList.length} Tables`,
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      action: () => setIsFloorModalOpen(true)
    },
    {
      id: 'menu_photos',
      icon: '📸',
      title: 'Restaurant Menu & Photo Studio',
      badge: `${activeMenuItemsList.length} Items`,
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      action: () => setIsMenuPhotosModalOpen(true)
    },
    {
      id: 'chef_owner_training_studio',
      icon: '🧑‍🍳',
      title: "Chef & Founder's Story Studio",
      badge: 'Tasting & Heritage',
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      action: () => navigate('/ai-studio')
    },
    {
      id: 'reviews',
      icon: '⭐',
      title: 'Google Reviews & Reputation Shield',
      badge: '4.9★ Shield',
      badgeColor: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
      action: () => setIsReviewsModalOpen(true)
    },
    {
      id: 'growth',
      icon: '⚡',
      title: 'Smart Growth Engine & Upsell Pairings',
      badge: isPairingsActive ? 'Pairings Active' : 'Configure',
      badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      action: () => setIsSmartHubModalOpen(true)
    },
    {
      id: 'pos',
      icon: '🖨️',
      title: 'POS & Thermal Hardware Bridge',
      badge: (restaurant.pos_provider || 'Petpooja').toUpperCase(),
      badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      action: () => setIsPosModalOpen(true)
    },
    {
      id: 'settings',
      icon: '⚙️',
      title: 'Venue Settings & Handover Hub',
      badge: 'Launch Kit',
      badgeColor: 'bg-slate-700/60 text-slate-300 border-slate-600/40',
      action: () => setIsSettingsModalOpen(true)
    }
  ];

  // Filtered partner restaurants for Partner Hub (/manage)
  const [isOutletSwitchModalOpen, setIsOutletSwitchModalOpen] = useState(false);

  // Filtered partner restaurants for outlet switching
  const partnerRestaurantsList = useMemo(() => {
    return restaurants.filter(
      (r) =>
        r &&
        r.id &&
        r.name &&
        !isDishNameAsRestaurant(r) &&
        (SEED_RESTAURANTS.some((s) => s.id === r.id || s.slug === r.slug) || (r.location && r.cuisine))
    );
  }, [restaurants]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#090D16] text-slate-100 p-3 sm:p-5 md:p-6 max-w-4xl mx-auto space-y-4 pb-20">
      {/* ── Compact Navigation Top Bar ────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsOutletSwitchModalOpen(true)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors bg-white/[0.06] hover:bg-white/[0.12] px-2.5 py-1.5 rounded-xl border border-white/[0.1] shadow-sm cursor-pointer"
            title="Switch or view all your partner restaurant outlets"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Switch Outlet</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>

          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Food Operations Hub</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleForceRefresh}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-white/[0.08] transition-colors cursor-pointer"
            title="Force refresh"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {/* Tenant-Isolated Venue Badge (No switching) */}
          <div className="flex items-center space-x-1.5 bg-[#0D1322] border border-white/[0.08] rounded-xl px-2.5 py-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-xs font-bold text-white max-w-[150px] sm:max-w-[200px] truncate">
              {restaurant.name}
            </span>
          </div>

          <Link
            to="/kitchen"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-200 hover:text-white transition-colors bg-[#090D16]/[0.04] hover:bg-white/[0.08] px-2.5 py-1.5 rounded-xl border border-white/[0.08] shadow-sm"
          >
            <ChefHat className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Kitchen</span>
          </Link>
        </div>
      </div>

      {/* USB Print Banner */}
      {usbPrintStatus && (
        <div className="bg-blue-950/40 border border-blue-500/40 text-blue-200 p-2.5 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span>{usbPrintStatus}</span>
          </div>
          <button onClick={() => setUsbPrintStatus(null)} className="text-blue-400 hover:text-blue-200 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Compact Venue Header & Quick Diner Link ───────────────── */}
      <header className="flex items-center justify-between gap-3 pt-1">
        <div>
          <span className="text-[10px] text-amber-400 font-mono uppercase font-bold tracking-wider">
            {restaurant.cuisine} • {restaurant.location || 'Pune'}
          </span>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
            {restaurant.name}
          </h1>
        </div>

        <Link
          to={`/r/${restaurant.slug}/menu?t=${activeTablesList[0]?.public_token || 'table-token-01-saffron'}`}
          className="flex items-center space-x-1.5 text-xs text-slate-950 bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 px-3 py-1.5 rounded-xl shadow font-bold transition-all flex-shrink-0"
        >
          <UtensilsCrossed className="w-3.5 h-3.5 text-slate-950" />
          <span>Launch Menu ({activeTablesList[0]?.label || 'Table 1'})</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </Link>
      </header>

      {/* ── Urgent Alerts (if any) ───────────────────────────────── */}
      {unreadServiceAlerts.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <h3 className="font-serif font-bold text-xs text-rose-200">
                🚨 Urgent Guest Assistance Required ({unreadServiceAlerts.length} Table{unreadServiceAlerts.length > 1 ? 's' : ''})
              </h3>
            </div>
            <button
              onClick={() => markNotificationRead(unreadServiceAlerts[0].id)}
              className="text-[10px] font-bold text-rose-300 underline cursor-pointer"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* ── Compact Key Stats Strip (Single Row) ─────────────────── */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#0D1322] px-3 py-2 rounded-xl border border-white/[0.08] flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="text-[9px] text-slate-400 font-medium block">Revenue</span>
            <span className="font-serif text-sm font-bold text-white truncate block">₹{totalVolume.toFixed(0)}</span>
          </div>
        </div>

        <div className="bg-[#0D1322] px-3 py-2 rounded-xl border border-white/[0.08] flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="text-[9px] text-slate-400 font-medium block">Orders</span>
            <span className="font-serif text-sm font-bold text-white truncate block">{totalOrdersCount} tickets</span>
          </div>
        </div>

        <div className="bg-[#0D1322] px-3 py-2 rounded-xl border border-white/[0.08] flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="text-[9px] text-slate-400 font-medium block">Floor</span>
            <span className="font-serif text-sm font-bold text-white truncate block">{activeTablesList.length} tables</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 📋 SLEEK VERTICAL HEADINGS LIST (SEE ALL OPTIONS AT ONCE)   */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="space-y-2 pt-1">
        {MANAGEMENT_MODULES.map((item, idx) => (
          <div
            key={item.id}
            onClick={item.action}
            className="w-full bg-[#0D1322] hover:bg-[#121A2E] border border-white/[0.08] hover:border-amber-500/40 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-md transition-all cursor-pointer group active:scale-[0.99]"
          >
            {/* Left: Number + Icon + Title */}
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-white/[0.04] group-hover:bg-amber-500/15 border border-white/[0.08] group-hover:border-amber-500/30 flex items-center justify-center text-base flex-shrink-0 transition-colors">
                <span>{item.icon}</span>
              </div>
              <div className="min-w-0">
                <h3 className="font-serif font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                  {idx + 1}. {item.title}
                </h3>
              </div>
            </div>

            {/* Right: Badge Pill + Clean Chevron */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                {item.badge}
              </span>
              <div className="w-6 h-6 rounded-lg bg-white/[0.03] group-hover:bg-amber-500/20 flex items-center justify-center text-slate-400 group-hover:text-amber-300 transition-colors">
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 🪑 POPUP WINDOW 1: FLOOR & TABLES                          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 🪑 POPUP WINDOW 1: FLOOR & TABLES                          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isFloorModalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl overflow-y-auto pt-[max(env(safe-area-inset-top,20px),24px)] pb-12 px-3 sm:px-6 flex justify-center items-start overscroll-contain"
        >
          <div className="bg-[#0D1322] rounded-3xl max-w-5xl w-full shadow-2xl p-4 sm:p-7 relative space-y-4 sm:space-y-5 border border-white/[0.12] text-white my-2 sm:my-6">
            {/* Clean, Non-Colliding Top Header */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/[0.08] gap-2">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setIsFloorModalOpen(false)}
                  className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 hover:text-white font-bold text-xs border border-white/[0.1] transition-all cursor-pointer flex-shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-lg sm:text-2xl">🪑</span>
                    <h3 className="font-serif font-bold text-base sm:text-xl text-white truncate">
                      Floor &amp; Live Tables Operations
                    </h3>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden xs:block sm:block">
                    Manage seating layout, add custom tables, launch diner menus &amp; POS sync
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFloorModalOpen(false)}
                className="p-1.5 sm:p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-slate-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Bar / View Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5">
              {/* View Switcher: Table Grid vs POS Revenue Breakdown */}
              <div className="p-0.5 rounded-xl bg-slate-900 border border-white/[0.1] flex items-center">
                <button
                  type="button"
                  onClick={() => setFloorViewTab('grid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    floorViewTab === 'grid'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Seating Layout ({activeTablesList.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFloorViewTab('revenue')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    floorViewTab === 'revenue'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>POS Revenue</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleOpenAddTable}
                  className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 text-xs font-bold rounded-xl shadow-sm cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Table</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsTableModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-white/[0.08] cursor-pointer"
                >
                  Batch Setup
                </button>
              </div>
            </div>

            {/* TAB 1: FLOOR GRID (FULLY EDITABLE) */}
            {floorViewTab === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {activeTablesList.map((table) => {
                  const tableOrders = activeOrdersList.filter((o) => o.table_id === table.id);
                  const tableTotal = tableOrders.reduce((sum, o) => sum + o.total_amount, 0);
                  const hasOpenOrders = tableOrders.length > 0;

                  return (
                    <div key={table.id} className="bg-slate-900/90 rounded-2xl p-4 border border-white/[0.08] hover:border-amber-500/30 transition-all space-y-3 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-white text-base">{table.label}</h4>
                          <span className="text-[10px] text-slate-400 font-mono block">Token: {table.public_token}</span>
                          <span className="text-[10px] text-slate-400 block pt-0.5">
                            {table.section || 'Indoor Main'} • <strong className="text-slate-200">{table.capacity || 4} Seats</strong>
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                          hasOpenOrders ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/15 text-emerald-300'
                        }`}>
                          {hasOpenOrders ? `₹${tableTotal} Open` : '🟢 Ready'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                        <Link
                          to={`/r/${restaurant.slug}/menu?t=${table.public_token}`}
                          className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white font-bold text-xs rounded-xl text-center flex items-center justify-center space-x-1 shadow-sm"
                        >
                          <UtensilsCrossed className="w-3.5 h-3.5" />
                          <span>Launch Menu</span>
                        </Link>

                        <button
                          type="button"
                          onClick={handleTestUsbPrint}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl border border-white/[0.08] cursor-pointer"
                          title="Print KOT"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete ${table.label}?`)) {
                              deleteTable(table.id);
                            }
                          }}
                          className="p-2 bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 rounded-xl border border-white/[0.08] transition-colors cursor-pointer"
                          title="Delete Table"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Dashed Add Table Card OR Direct In-Place Form */}
                {!isAddingCustomTable ? (
                  <div
                    onClick={handleOpenAddTable}
                    className="bg-slate-900/40 hover:bg-slate-900/80 rounded-2xl p-6 border-2 border-dashed border-white/[0.15] hover:border-amber-400/50 transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer text-slate-400 hover:text-amber-300 min-h-[140px]"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-xs font-bold font-mono">+ Add Custom Table</span>
                  </div>
                ) : (
                  <div
                    ref={addTableFormRef}
                    className="bg-slate-900 rounded-2xl p-4 sm:p-5 border-2 border-amber-500/50 space-y-3 shadow-xl sm:col-span-2 md:col-span-3 animate-in fade-in slide-in-from-bottom-2"
                  >
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                      <h4 className="font-bold text-xs text-amber-300 uppercase font-mono tracking-wider flex items-center space-x-1.5">
                        <Plus className="w-3.5 h-3.5 text-amber-400" />
                        <span>Add New Custom Dining Table</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsAddingCustomTable(false)}
                        className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 font-mono block mb-1">Table Label / Name</label>
                        <input
                          ref={addTableInputRef}
                          type="text"
                          placeholder={`Table ${activeTablesList.length + 1}`}
                          value={newTableLabel}
                          onChange={(e) => setNewTableLabel(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-white/[0.15] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-mono block mb-1">Seating Capacity (Guests)</label>
                        <input
                          type="number"
                          min={1}
                          max={24}
                          value={newTableCapacity}
                          onChange={(e) => setNewTableCapacity(Number(e.target.value) || 4)}
                          className="w-full px-3 py-2 bg-slate-950 border border-white/[0.15] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-mono block mb-1">Dining Section / Zone</label>
                        <input
                          type="text"
                          placeholder="e.g. Indoor Main, Patio, VIP"
                          value={newTableSection}
                          onChange={(e) => setNewTableSection(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-white/[0.15] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingCustomTable(false)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleCreateCustomTable}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer"
                      >
                        Save &amp; Add to Floor
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: POS TABLE REVENUE BREAKDOWN */}
            {floorViewTab === 'revenue' && (
              <div className="space-y-4">
                {/* POS Summary Strip */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0A101D] to-slate-900 border border-white/[0.1] grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Total Floor Volume</span>
                    <span className="text-lg font-extrabold text-amber-400 font-mono">₹{totalVolume.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">POS Orders</span>
                    <span className="text-lg font-extrabold text-white font-mono">{totalOrdersCount} Total</span>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Tables Active</span>
                    <span className="text-lg font-extrabold text-emerald-400 font-mono">
                      {activeTablesList.filter((t) => activeOrdersList.some((o) => o.table_id === t.id)).length} / {activeTablesList.length}
                    </span>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">POS Provider Sync</span>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold text-slate-200 uppercase font-mono">
                        {restaurant.pos_provider || 'Petpooja'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Per-Table Revenue Cards */}
                <div className="space-y-3">
                  {activeTablesList
                    .map((table) => {
                      const tableOrders = activeOrdersList.filter((o) => o.table_id === table.id);
                      const tableTotal = tableOrders.reduce((sum, o) => sum + o.total_amount, 0);
                      const totalItemsCount = tableOrders.reduce(
                        (sum, o) => sum + (o.items ? o.items.reduce((iSum, it) => iSum + it.quantity, 0) : 0),
                        0
                      );
                      return { table, tableOrders, tableTotal, totalItemsCount };
                    })
                    .sort((a, b) => b.tableTotal - a.tableTotal)
                    .map(({ table, tableOrders, tableTotal, totalItemsCount }) => {
                      const hasOpenOrders = tableOrders.length > 0;
                      return (
                        <div
                          key={table.id}
                          className="bg-slate-900/90 rounded-2xl p-4 border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          {/* Table details */}
                          <div className="space-y-1 min-w-[200px]">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-white text-base">{table.label}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase ${
                                hasOpenOrders
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-slate-800 text-slate-400'
                              }`}>
                                {hasOpenOrders ? `${tableOrders.length} Order(s)` : 'Vacant'}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                              <span>{table.section || 'Indoor Main'}</span>
                              <span>•</span>
                              <span className="font-mono text-slate-500">Token: {table.public_token}</span>
                            </div>
                          </div>

                          {/* Orders Summary / Items preview */}
                          <div className="flex-1 min-w-0 bg-black/30 rounded-xl p-2.5 border border-white/[0.04]">
                            {hasOpenOrders ? (
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-slate-400 font-medium">
                                    {totalItemsCount} dish items dispatched via POS
                                  </span>
                                  <span className="text-emerald-400 font-bold font-mono text-xs">
                                    ✓ POS Synced
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {tableOrders.flatMap((o) => o.items || []).slice(0, 4).map((it, iIdx) => (
                                    <span
                                      key={iIdx}
                                      className="px-2 py-0.5 bg-white/[0.06] rounded-md text-[10px] text-slate-300 font-medium"
                                    >
                                      {it.quantity}x {it.item_name_snapshot}
                                    </span>
                                  ))}
                                  {tableOrders.flatMap((o) => o.items || []).length > 4 && (
                                    <span className="px-2 py-0.5 bg-white/[0.06] rounded-md text-[10px] text-amber-400 font-bold">
                                      +{tableOrders.flatMap((o) => o.items || []).length - 4} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-500 italic">No live orders. Table is open for guests.</span>
                            )}
                          </div>

                          {/* Revenue amount & actions */}
                          <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0">
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 uppercase font-mono block">Table Volume</span>
                              <span className="text-base font-bold text-amber-400 font-mono">
                                ₹{tableTotal.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Link
                                to={`/r/${restaurant.slug}/menu?t=${table.public_token}`}
                                className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs rounded-xl text-center flex items-center space-x-1"
                              >
                                <UtensilsCrossed className="w-3.5 h-3.5" />
                                <span>Menu</span>
                              </Link>
                              <button
                                type="button"
                                onClick={handleTestUsbPrint}
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl border border-white/[0.08] cursor-pointer"
                                title="Print KOT"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 📸 POPUP WINDOW 2: RESTAURANT MENU & PHOTOS STUDIO          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isMenuPhotosModalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl overflow-y-auto pt-[max(env(safe-area-inset-top,20px),24px)] pb-12 px-3 sm:px-6 flex justify-center items-start overscroll-contain"
        >
          <div className="bg-[#0D1322] rounded-3xl max-w-5xl w-full shadow-2xl p-4 sm:p-7 relative space-y-4 sm:space-y-5 border border-white/[0.12] text-white my-2 sm:my-6">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/[0.08] gap-2">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setIsMenuPhotosModalOpen(false)}
                  className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 hover:text-white font-bold text-xs border border-white/[0.1] transition-all cursor-pointer flex-shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-lg sm:text-2xl">📸</span>
                    <h3 className="font-serif font-bold text-base sm:text-xl text-white truncate">
                      Menu &amp; Photo Studio
                    </h3>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden xs:block sm:block">
                    Inline dish editor, multi-photo gallery &amp; ambiance images
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsRestaurantPhotoModalOpen(true)}
                  className="px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-white/[0.08] flex items-center space-x-1 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden xs:inline sm:inline">Ambiance Photos</span>
                  <span className="xs:hidden sm:hidden">Ambiance</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsMenuPhotosModalOpen(false)}
                  className="p-1.5 sm:p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search Input - Cleanly styled for visible typing */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={photoStudioSearch}
                onChange={(e) => setPhotoStudioSearch(e.target.value)}
                placeholder="Search dishes to edit name, price, or photos..."
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-white/[0.15] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {activeMenuItemsList
                .filter((dish) => {
                  if (!photoStudioSearch.trim()) return true;
                  const q = photoStudioSearch.toLowerCase();
                  return dish.name.toLowerCase().includes(q) || dish.short_description?.toLowerCase().includes(q);
                })
                .map((dish) => {
                  const isEditingThisDish = editingDishId === dish.id;
                  const dishPhotos: string[] = [];
                  if (dish.gallery_images && dish.gallery_images.length > 0) {
                    dish.gallery_images.forEach((g) => {
                      if (g.src && !dishPhotos.includes(g.src)) dishPhotos.push(g.src);
                    });
                  } else if (dish.image_url) {
                    dishPhotos.push(dish.image_url);
                  }
                  if (dish.image_url && !dishPhotos.includes(dish.image_url)) {
                    dishPhotos.unshift(dish.image_url);
                  }

                  return (
                    <div key={dish.id} className="bg-slate-900/90 rounded-2xl border border-white/[0.08] overflow-hidden flex flex-col justify-between group relative">
                      {/* Photo preview */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                        <img
                          src={dish.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600'}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/80 text-amber-300 backdrop-blur-sm border border-amber-500/30">
                            {dishPhotos.length} Photos
                          </span>
                        </div>
                        {dishSaveSuccessId === dish.id && (
                          <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs flex items-center justify-center text-center p-2">
                            <span className="text-xs font-bold text-emerald-300 flex items-center space-x-1">
                              <Check className="w-4 h-4 text-emerald-400" />
                              <span>Live Menu Updated</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Content: Inline Form or View */}
                      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                        {isEditingThisDish ? (
                          <div className="space-y-2 bg-slate-950/80 p-2.5 rounded-xl border border-amber-500/40">
                            <div>
                              <label className="text-[10px] text-amber-300 font-bold uppercase font-mono block">Dish Name</label>
                              <input
                                type="text"
                                value={editDishDraft.name}
                                onChange={(e) => setEditDishDraft({ ...editDishDraft, name: e.target.value })}
                                className="w-full px-2 py-1 bg-slate-900 border border-white/[0.15] rounded-lg text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                                placeholder="Dish name"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] text-amber-300 font-bold uppercase font-mono block">Price (₹)</label>
                              <div className="flex items-center bg-slate-900 border border-white/[0.15] rounded-lg px-2 py-1">
                                <span className="text-xs text-slate-400 mr-1 font-mono">₹</span>
                                <input
                                  type="number"
                                  value={editDishDraft.price}
                                  onChange={(e) => setEditDishDraft({ ...editDishDraft, price: e.target.value })}
                                  className="w-full bg-transparent text-xs text-white font-bold font-mono focus:outline-none"
                                  placeholder="Price"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] text-amber-300 font-bold uppercase font-mono block">Description</label>
                              <textarea
                                rows={2}
                                value={editDishDraft.short_description}
                                onChange={(e) => setEditDishDraft({ ...editDishDraft, short_description: e.target.value })}
                                className="w-full px-2 py-1 bg-slate-900 border border-white/[0.15] rounded-lg text-[11px] text-white focus:outline-none focus:border-amber-400 resize-none"
                                placeholder="Short description..."
                              />
                            </div>

                            <div className="flex items-center space-x-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  if (!editDishDraft.name.trim()) return;
                                  updateMenuItem(dish.id, {
                                    name: editDishDraft.name.trim(),
                                    price: Number(editDishDraft.price) || 0,
                                    short_description: editDishDraft.short_description.trim()
                                  });
                                  setDishSaveSuccessId(dish.id);
                                  setTimeout(() => setDishSaveSuccessId(null), 2500);
                                  setEditingDishId(null);
                                }}
                                className="flex-1 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Save</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingDishId(null)}
                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div>
                              <div className="flex items-start justify-between gap-1">
                                <h4 className="font-bold text-xs text-white line-clamp-1">{dish.name}</h4>
                                <span className="text-xs font-bold text-amber-400 font-mono flex-shrink-0">₹{dish.price}</span>
                              </div>
                              {dish.short_description && (
                                <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                                  {dish.short_description}
                                </p>
                              )}
                            </div>

                            <div className="space-y-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingDishId(dish.id);
                                  setEditDishDraft({
                                    name: dish.name,
                                    price: dish.price,
                                    short_description: dish.short_description || ''
                                  });
                                }}
                                className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-white/[0.08] flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                                <span>Edit Name, Price &amp; Desc</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setPhotoStudioDish(dish)}
                                className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center space-x-1.5 cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload &amp; Manage Photos</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => toggleItemAvailability(dish.id)}
                                className={`w-full py-1 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                                  dish.is_available !== false
                                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                    : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                                }`}
                              >
                                {dish.is_available !== false ? '● In Stock' : '○ Sold Out'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ⭐ POPUP WINDOW 3: GOOGLE REVIEWS & SHIELD                  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isReviewsModalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl overflow-y-auto pt-[max(env(safe-area-inset-top,20px),24px)] pb-12 px-3 sm:px-6 flex justify-center items-start overscroll-contain"
        >
          <div className="bg-[#0D1322] rounded-3xl max-w-4xl w-full shadow-2xl p-4 sm:p-7 relative space-y-4 sm:space-y-5 border border-white/[0.12] text-white my-2 sm:my-6">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/[0.08] gap-2">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setIsReviewsModalOpen(false)}
                  className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 hover:text-white font-bold text-xs border border-white/[0.1] transition-all cursor-pointer flex-shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-lg sm:text-2xl">⭐</span>
                    <h3 className="font-serif font-bold text-base sm:text-xl text-white truncate">
                      Google Reviews &amp; Shield
                    </h3>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden xs:block sm:block">
                    Verified diner feedback &amp; floor grievance routing
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewsModalOpen(false)}
                className="p-1.5 sm:p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-slate-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {reviews.filter((r) => r.restaurant_id === restaurant.id).map((rev) => (
                <div key={rev.id} className="bg-slate-900/90 p-4 rounded-2xl border border-white/[0.08] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{rev.customer_name || 'Verified Diner'}</span>
                    <div className="flex items-center text-amber-400 text-xs">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">"{rev.review_text}"</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono">
                    <span>{new Date(rev.created_at).toLocaleDateString()}</span>
                    <span className="text-emerald-400">✓ Verified Dine-In</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ⚡ POPUP WINDOW 4: SMART GROWTH & UPSELL ENGINE             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isSmartHubModalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl overflow-y-auto pt-[max(env(safe-area-inset-top,20px),24px)] pb-12 px-3 sm:px-6 flex justify-center items-start overscroll-contain"
        >
          <div className="bg-[#0D1322] rounded-3xl max-w-4xl w-full shadow-2xl p-4 sm:p-7 relative space-y-4 sm:space-y-5 border border-white/[0.12] text-white my-2 sm:my-6">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/[0.08] gap-2">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setIsSmartHubModalOpen(false)}
                  className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 hover:text-white font-bold text-xs border border-white/[0.1] transition-all cursor-pointer flex-shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-lg sm:text-2xl">⚡</span>
                    <h3 className="font-serif font-bold text-base sm:text-xl text-white truncate">
                      Smart Growth Engine
                    </h3>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden xs:block sm:block">
                    AI chef pairings, happy hour schedules &amp; food reward incentives
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSmartHubModalOpen(false)}
                className="p-1.5 sm:p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-slate-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Smart Pairings */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>AI Chef's Cart Pairings</span>
                  </h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isPairingsActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isPairingsActive ? 'Active in Cart' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Header: <strong className="text-emerald-300">{pairingsBadgeText}</strong>. Automatically suggests matching drinks &amp; desserts.
                </p>
                <button
                  type="button"
                  onClick={() => setSmartSettingsTab('pairings')}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Configure Pairings
                </button>
              </div>

              {/* Happy Hour */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white flex items-center space-x-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Happy Hour &amp; Surge</span>
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300">
                    {restaurant.happy_hour_config?.enabled ? `${restaurant.happy_hour_config.discount_percent}% Off` : 'Configured'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Off-peak discounts ({restaurant.happy_hour_config?.start_time || '16:00'} - {restaurant.happy_hour_config?.end_time || '19:30'}) and optional surge markup.
                </p>
                <button
                  type="button"
                  onClick={() => setSmartSettingsTab('happy_hour')}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-white/[0.08] cursor-pointer"
                >
                  Edit Schedule
                </button>
              </div>

              {/* Rewards */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-white/[0.08] space-y-3 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white flex items-center space-x-1.5">
                    <Gift className="w-4 h-4 text-purple-400" />
                    <span>Spin Wheel &amp; Dining Food Rewards</span>
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                    High Margin Food Items
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Rewarding diners with artisan mocktails and chef desserts preserves 90%+ margins while driving 5-star Google review completions.
                </p>
                <button
                  type="button"
                  onClick={() => setSmartSettingsTab('rewards')}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-white/[0.08] cursor-pointer"
                >
                  Edit Rewards Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 🖨️ POPUP WINDOW 5: POS & HARDWARE INTEGRATION              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isPosModalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl overflow-y-auto pt-[max(env(safe-area-inset-top,20px),24px)] pb-12 px-3 sm:px-6 flex justify-center items-start overscroll-contain"
        >
          <div className="bg-[#0D1322] rounded-3xl max-w-4xl w-full shadow-2xl p-4 sm:p-7 relative space-y-4 sm:space-y-5 border border-white/[0.12] text-white my-2 sm:my-6">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/[0.08] gap-2">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setIsPosModalOpen(false)}
                  className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 hover:text-white font-bold text-xs border border-white/[0.1] transition-all cursor-pointer flex-shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-lg sm:text-2xl">🖨️</span>
                    <h3 className="font-serif font-bold text-base sm:text-xl text-white truncate">
                      Kitchen &amp; POS Sync
                    </h3>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden xs:block sm:block">
                    Switch POS adapters, configure credentials &amp; USB KOT printer
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPosModalOpen(false)}
                className="p-1.5 sm:p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-slate-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-400">Kitchen &amp; Billing Sync</span>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-white mt-0.5">Select POS System Adapter</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch adapters, configure connection credentials, and simulate live KOT dispatch.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
                {[
                  { id: 'petpooja', name: 'Petpooja', tag: '50k+', desc: 'REST API Bridge' },
                  { id: 'royalpos', name: 'RoyalPOS', tag: 'Pune Local', desc: 'LAN & Tablet' },
                  { id: 'recaho', name: 'Recaho', tag: 'PCMC', desc: 'Cloud GST' },
                  { id: 'rancelab', name: 'RanceLab', tag: 'Fusion', desc: 'Fine Dining' }
                ].map((prov) => (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => {
                      setSelectedPosTab(prov.id as any);
                      updateRestaurant(restaurant.id, { pos_provider: prov.id as any });
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPosTab === prov.id
                        ? 'bg-amber-500/15 border-amber-500/40 ring-1 ring-amber-400/40 text-amber-300'
                        : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-white">{prov.name}</span>
                      <span className="text-[8px] uppercase px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold font-mono">{prov.tag}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{prov.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Active POS Panel */}
            <div className="pt-2">
              {selectedPosTab === 'petpooja' && (
                <PetpoojaIntegrationPanel
                  restaurant={restaurant}
                  onUpdateConfig={(cfg: PetpoojaConfig) => updateRestaurant(restaurant.id, { petpooja_config: cfg, pos_provider: 'petpooja' })}
                />
              )}
              {selectedPosTab === 'royalpos' && (
                <RoyalPosIntegrationPanel
                  restaurant={restaurant}
                  onUpdateConfig={(cfg: RoyalPosConfig) => updateRestaurant(restaurant.id, { royalpos_config: cfg, pos_provider: 'royalpos' })}
                />
              )}
              {selectedPosTab === 'recaho' && (
                <RecahoIntegrationPanel
                  restaurant={restaurant}
                  onUpdateConfig={(cfg: RecahoConfig) => updateRestaurant(restaurant.id, { recaho_config: cfg, pos_provider: 'recaho' })}
                />
              )}
              {selectedPosTab === 'rancelab' && (
                <RancelabIntegrationPanel
                  restaurant={restaurant}
                  onUpdateConfig={(cfg: RancelabConfig) => updateRestaurant(restaurant.id, { rancelab_config: cfg, pos_provider: 'rancelab' })}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ⚙️ POPUP WINDOW 6: VENUE SETTINGS                          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isSettingsModalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl overflow-y-auto pt-[max(env(safe-area-inset-top,20px),24px)] pb-12 px-3 sm:px-6 flex justify-center items-start overscroll-contain"
        >
          <div className="bg-[#0D1322] rounded-3xl max-w-3xl w-full shadow-2xl p-4 sm:p-7 relative space-y-4 sm:space-y-5 border border-white/[0.12] text-white my-2 sm:my-6">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/[0.08] gap-2">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 hover:text-white font-bold text-xs border border-white/[0.1] transition-all cursor-pointer flex-shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-lg sm:text-2xl">⚙️</span>
                    <h3 className="font-serif font-bold text-base sm:text-xl text-white truncate">
                      Venue Settings
                    </h3>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden xs:block sm:block">
                    Launch kit, table layout &amp; venue offboarding
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-1.5 sm:p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-slate-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => setIsLaunchKitOpen(true)}
                className="p-4 rounded-2xl bg-slate-900 border border-white/[0.08] hover:border-amber-500/40 text-left transition-all space-y-2 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Share2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">📲 Guest Links &amp; Handover</h4>
                <p className="text-[11px] text-slate-400">WhatsApp handover &amp; direct diner URLs.</p>
              </button>

              <button
                type="button"
                onClick={() => setIsTableModalOpen(true)}
                className="p-4 rounded-2xl bg-slate-900 border border-white/[0.08] hover:border-emerald-500/40 text-left transition-all space-y-2 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">🪑 Floor Plan &amp; Tables</h4>
                <p className="text-[11px] text-slate-400">Edit table names, capacities &amp; tokens.</p>
              </button>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={resetToDefaults}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 border border-white/[0.08]"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Venue to Factory Defaults</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOffboardModalOpen(true)}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 hover:border-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <span>Offboard {restaurant.name}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sub-Modals ────────────────────────────────────────────── */}
      {isOffboardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0D1322] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/[0.1] text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white">
                Offboard {restaurant.name}?
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                This will offboard <strong>{restaurant.name}</strong> from your active operational venues hub.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setIsOffboardModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-white/[0.08] text-slate-300 hover:bg-white/[0.06] text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const idToOffboard = restaurant.id;
                  setIsOffboardModalOpen(false);
                  deleteRestaurant(idToOffboard);
                  const remaining = restaurants.filter((r) => r.id !== idToOffboard && !isDishNameAsRestaurant(r));
                  if (remaining.length > 0) {
                    setCurrentRestaurant(remaining[0].id);
                    navigate(`/manage/${remaining[0].slug}`);
                  } else {
                    navigate('/');
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer flex items-center space-x-1.5"
              >
                <span>Confirm Offboard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chef & Owner AI Intake Questionnaire Studio */}
      <ChefOwnerQuestionnaireModal
        restaurant={restaurant}
        isOpen={isAiStudioOpen}
        onClose={() => setIsAiStudioOpen(false)}
        onSavePersona={(persona) => {
          updateRestaurant(restaurant.id, { ai_persona: persona });
        }}
      />

      {/* AI Dining Assistant Simulation Drawer */}
      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        focusDish={null}
        onConfirmAdd={(_dish) => {
          setIsAiDrawerOpen(false);
        }}
      />

      {/* Instant Table QRs & Share Links Handover Modal */}
      <RestaurantLaunchKitModal
        restaurant={restaurant}
        isOpen={isLaunchKitOpen}
        onClose={() => setIsLaunchKitOpen(false)}
        onOpenTableManagement={() => setIsTableModalOpen(true)}
      />

      {/* Table & Floor Plan / Profile Customizer Modal */}
      <TableManagementModal
        restaurant={restaurant}
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />

      {/* Smart Operations & Growth Engine Settings Modal */}
      <SmartOperationsSettingsModal
        restaurant={restaurant}
        isOpen={!!smartSettingsTab}
        onClose={() => setSmartSettingsTab(null)}
        initialTab={smartSettingsTab || 'pairings'}
        onSave={(updates) => {
          updateRestaurant(restaurant.id, updates);
        }}
      />

      {/* Dish Multi-Image Manager & Direct Gallery Uploader Modal */}
      <DishMultiImageManagerModal
        isOpen={!!photoStudioDish}
        dish={photoStudioDish}
        onClose={() => setPhotoStudioDish(null)}
      />

      {/* Restaurant Venue Ambiance & Cover Photo Manager Modal */}
      <RestaurantPhotoManagerModal
        isOpen={isRestaurantPhotoModalOpen}
        restaurant={restaurant}
        onClose={() => setIsRestaurantPhotoModalOpen(false)}
      />

      {/* Partner Outlet Switcher Modal */}
      {isOutletSwitchModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#0D1424] border border-white/[0.12] rounded-3xl max-w-xl w-full p-5 sm:p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center space-x-2.5">
                <Building2 className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Your Partner Outlets</h3>
                  <p className="text-xs text-slate-400">Select an outlet to switch active floor operations</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOutletSwitchModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.08] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {partnerRestaurantsList.map((r) => {
                const isCurrent = r.id === restaurant.id;
                const rTables = tables.filter((t) => t.restaurant_id === r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setCurrentRestaurant(r.id);
                      setIsOutletSwitchModalOpen(false);
                      navigate(`/manage/${r.slug}`);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                        : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.2]'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                        <img
                          src={r.logo_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200'}
                          alt={r.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                            {r.name}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate">{r.cuisine} • {r.location || 'Pune'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {rTables.length} tables
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
              <Link
                to="/ai-studio"
                onClick={() => setIsOutletSwitchModalOpen(false)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Onboard New Restaurant Outlet</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsOutletSwitchModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
