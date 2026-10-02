import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { generateCuisineMenu } from '../data/cuisineMenuGenerator';

import {
  DollarSign,
  ShoppingBag,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Bell,
  Award,
  X,
  Flame,
  AlertCircle,
  Check,
  UtensilsCrossed,
  ExternalLink,
  ArrowLeft,
  ChefHat,
  Printer,
  Share2,
  Globe,
  Sliders,
  Settings,
  UserMinus,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  Layers,
  Building2,
  Camera,
  FolderOpen,
  Search,
  Plus,
  Star,
  MessageSquare,
  QrCode,
  MapPin,
  TrendingUp,
  Clock,
  Smartphone,
  Eye,
  CheckCheck,
  ChevronRight,
  Maximize2,
  Zap,
  Gift
} from 'lucide-react';
import { useRestaurantStore, isDishNameAsRestaurant } from '../store/restaurantStore';
import { SEED_RESTAURANTS } from '../data/seedData';
import { PetpoojaConfig, RoyalPosConfig, RecahoConfig, RancelabConfig, MenuItem } from '../types';
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
  const challenges = useRestaurantStore((state) => state.challenges);
  const notifications = useRestaurantStore((state) => state.notifications);
  const markNotificationRead = useRestaurantStore((state) => state.markNotificationRead);
  const resetToDefaults = useRestaurantStore((state) => state.resetToDefaults);
  const updateRestaurant = useRestaurantStore((state) => state.updateRestaurant);
  const toggleItemAvailability = useRestaurantStore((state) => state.toggleItemAvailability);

  // ── Dedicated Popup Windows (Modals) ───────────────────────────
  const [isFloorModalOpen, setIsFloorModalOpen] = useState(false);
  const [isMenuPhotosModalOpen, setIsMenuPhotosModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isSmartHubModalOpen, setIsSmartHubModalOpen] = useState(false);
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

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

  // Hash router sync
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('photo') || hash.includes('menu')) {
        setIsMenuPhotosModalOpen(true);
      } else if (hash.includes('review')) {
        setIsReviewsModalOpen(true);
      } else if (hash.includes('pos') || hash.includes('kot')) {
        setIsPosModalOpen(true);
      } else if (hash.includes('smart') || hash.includes('growth') || hash.includes('pair')) {
        setIsSmartHubModalOpen(true);
      } else if (hash.includes('setting') || hash.includes('floor')) {
        setIsFloorModalOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

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
      navigate(`/manage/${valid.slug}`);
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

  const currentRestCategories = categories.filter((c) => c.restaurant_id === restaurant.id);
  const activeCategoriesList = currentRestCategories.length > 0 ? currentRestCategories : fallbackCuisineMenu.categories;

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
  const unreadWaiterCalls = activeNotificationsList.filter((n) => n.type === 'waiter_call' && !n.read);

  // Smart Pairings active status
  const isPairingsActive = restaurant.smart_pairings_config?.enabled !== false;
  const pairingsBadgeText = restaurant.smart_pairings_config?.badge_text || "🧑‍🍳 Chef's Recommended Pairings";

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#090D16] text-slate-100 p-3 sm:p-5 md:p-7 max-w-5xl mx-auto space-y-6 pb-24">
      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2">
          <Link
            to="/admin"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors bg-amber-500/15 hover:bg-amber-500/25 px-3 py-1.5 rounded-xl border border-amber-500/30 hover:border-amber-400/60 shadow-sm cursor-pointer active:scale-95"
            title="Open Master Admin Control Hub"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin HQ</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-300 hover:text-white transition-colors bg-[#090D16]/[0.04] hover:bg-white/[0.08] px-2.5 py-1.5 rounded-xl border border-white/[0.08] shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Demos</span>
          </Link>
          <Link
            to="/pitch"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition-colors bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1.5 rounded-xl border border-cyan-500/30 shadow-sm cursor-pointer"
          >
            <span>📊</span>
            <span>Pitch</span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleForceRefresh}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-white/[0.08] transition-colors cursor-pointer"
            title="Force refresh"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <div className="flex items-center space-x-1.5 bg-[#0D1322] border border-white/[0.08] rounded-xl px-2.5 py-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Venue:</span>
            <select
              value={restaurant.id}
              onChange={(e) => {
                const target = restaurants.find((r) => r.id === e.target.value && !isDishNameAsRestaurant(r));
                if (target) {
                  setCurrentRestaurant(target.id);
                  navigate(`/manage/${target.slug}`);
                }
              }}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer max-w-[170px] truncate"
              title="Switch Active Venue Hub"
            >
              {restaurants
                .filter((r) => !isDishNameAsRestaurant(r))
                .map((r) => (
                  <option key={r.id} value={r.id} className="bg-[#0D1322] text-white">
                    {r.name}
                  </option>
                ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsAiStudioOpen(true)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/20 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chef AI</span>
          </button>

          <Link
            to="/kitchen"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors bg-[#090D16]/[0.04] hover:bg-white/[0.08] px-3 py-1.5 rounded-xl border border-white/[0.08] shadow-sm"
          >
            <ChefHat className="w-3.5 h-3.5 text-amber-400" />
            <span>Kitchen</span>
          </Link>
        </div>
      </div>

      {/* USB Print Banner */}
      {usbPrintStatus && (
        <div className="bg-blue-950/40 border border-blue-500/40 text-blue-200 p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-blue-400" />
            <span>{usbPrintStatus}</span>
          </div>
          <button onClick={() => setUsbPrintStatus(null)} className="text-blue-400 hover:text-blue-200 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Top Venue Title & Menu Launcher ──────────────────────── */}
      <header className="flex flex-wrap justify-between items-center pb-2 border-b border-white/[0.08] gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold font-mono tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Active Management Hub
            </span>
            <span className="text-xs text-slate-400 font-medium">{restaurant.cuisine} • Pune</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">{restaurant.name}</h1>
        </div>

        <Link
          to={`/r/${restaurant.slug}/menu?t=${activeTablesList[0]?.public_token || 'table-token-01-saffron'}`}
          className="flex items-center space-x-1.5 text-xs text-slate-950 bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 px-3.5 py-2 rounded-xl shadow-sm transition-all font-bold"
        >
          <UtensilsCrossed className="w-3.5 h-3.5 text-slate-950" />
          <span>Launch Diner Menu ({activeTablesList[0]?.label || 'Table 1'})</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </Link>
      </header>

      {/* ── Urgent Alerts (if any) ───────────────────────────────── */}
      {unreadServiceAlerts.length > 0 && (
        <div className="bg-rose-950/30 border border-rose-500/40 rounded-2xl p-4 shadow-lg animate-pulse">
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-90"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <h3 className="font-serif font-bold text-sm text-rose-200">
              🚨 Urgent Guest Assistance Required ({unreadServiceAlerts.length} Table{unreadServiceAlerts.length > 1 ? 's' : ''})
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {unreadServiceAlerts.map((notif) => (
              <div key={notif.id} className="bg-[#0D1322] p-3 rounded-xl border border-rose-500/40 flex flex-col justify-between space-y-2">
                <div>
                  <p className="font-serif font-bold text-sm text-white">{notif.table_label || 'Customer Table'}</p>
                  <p className="text-xs text-slate-300 mt-0.5">{notif.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => markNotificationRead(notif.id)}
                  className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                >
                  ✓ Attending Table Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Key Metrics Summary Strip ────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        <div className="bg-[#0D1322] p-3.5 sm:p-4 rounded-2xl border border-white/[0.08] shadow flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium">Revenue</span>
            <p className="font-serif text-base sm:text-lg font-bold text-white">₹{totalVolume.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-[#0D1322] p-3.5 sm:p-4 rounded-2xl border border-white/[0.08] shadow flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium">Orders</span>
            <p className="font-serif text-base sm:text-lg font-bold text-white">{totalOrdersCount} tickets</p>
          </div>
        </div>

        <div className="bg-[#0D1322] p-3.5 sm:p-4 rounded-2xl border border-white/[0.08] shadow flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium">Active Tables</span>
            <p className="font-serif text-base sm:text-lg font-bold text-white">{activeTablesList.length} tables</p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 📋 UNIFIED VERTICAL FUNCTIONS ROSTER (SEE ALL AT ONCE)      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        {/* ── 1. 🪑 Floor & Live Tables ──────────────────────────── */}
        <div className="bg-[#0D1322] p-4 sm:p-5 rounded-3xl border border-white/[0.08] shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="text-xl">🪑</span>
              <div>
                <h3 className="font-serif font-bold text-base text-white">1. Floor &amp; Live Tables Operations</h3>
                <p className="text-[11px] text-slate-400">{activeTablesList.length} tables configured • Live seating &amp; open tickets</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsFloorModalOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Open Window</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {activeTablesList.slice(0, 4).map((table) => {
              const tableOrders = activeOrdersList.filter((o) => o.table_id === table.id);
              const hasOpen = tableOrders.length > 0;
              return (
                <div key={table.id} className="bg-slate-900/90 p-2.5 rounded-xl border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-white block">{table.label}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{table.public_token}</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold font-mono ${
                    hasOpen ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'
                  }`}>
                    {hasOpen ? 'Open Bill' : 'Ready'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 2. 📸 Restaurant Menu & Photo Studio ───────────────── */}
        <div className="bg-[#0D1322] p-4 sm:p-5 rounded-3xl border border-white/[0.08] shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="text-xl">📸</span>
              <div>
                <h3 className="font-serif font-bold text-base text-white">2. Restaurant Menu &amp; Photo Studio</h3>
                <p className="text-[11px] text-slate-400">{activeMenuItemsList.length} menu items • Multi-angle gallery &amp; cover manager</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsRestaurantPhotoModalOpen(true)}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-white/[0.08] flex items-center space-x-1 cursor-pointer"
              >
                <Building2 className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Ambiance</span>
              </button>
              <button
                type="button"
                onClick={() => setIsMenuPhotosModalOpen(true)}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Open Window</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {activeMenuItemsList.slice(0, 4).map((dish) => (
              <div key={dish.id} className="bg-slate-900/90 rounded-xl overflow-hidden border border-white/[0.06] flex items-center p-1.5 space-x-2">
                <img
                  src={dish.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200'}
                  alt={dish.name}
                  className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                />
                <div className="truncate flex-1">
                  <span className="text-xs font-bold text-white block truncate">{dish.name}</span>
                  <span className="text-[10px] text-amber-400 font-mono">₹{dish.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. ⭐ Google Reviews & 5-Star Floor Shield ──────────── */}
        <div className="bg-[#0D1322] p-4 sm:p-5 rounded-3xl border border-white/[0.08] shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="text-xl">⭐</span>
              <div>
                <h3 className="font-serif font-bold text-base text-white">3. Google Reviews &amp; 5-Star Shield</h3>
                <p className="text-[11px] text-slate-400">4.9★ Average • Private grievance routing &amp; automated reviews</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsReviewsModalOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Open Window</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {reviews.filter((r) => r.restaurant_id === restaurant.id).slice(0, 2).map((rev) => (
              <div key={rev.id} className="bg-slate-900/90 p-2.5 rounded-xl border border-white/[0.06] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{rev.customer_name || 'Verified Diner'}</span>
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-1">"{rev.review_text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. ⚡ Smart Growth Engine & Upsell Pairings ─────────── */}
        <div className="bg-[#0D1322] p-4 sm:p-5 rounded-3xl border border-white/[0.08] shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="text-xl">⚡</span>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif font-bold text-base text-white">4. Smart Growth Engine &amp; Upsell Pairings</h3>
                  {isPairingsActive && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ✓ Pairings Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">Chef cart pairings, Happy hour schedule, and food rewards</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSmartHubModalOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Open Window</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-white/[0.06] space-y-0.5">
              <span className="text-xs font-bold text-emerald-400 block">🧑‍🍳 {pairingsBadgeText}</span>
              <p className="text-[10px] text-slate-400">Cart recommendation active with signature dishes</p>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-white/[0.06] space-y-0.5">
              <span className="text-xs font-bold text-amber-400 block">⚡ Twilight Happy Hour</span>
              <p className="text-[10px] text-slate-400">
                {restaurant.happy_hour_config?.enabled ? `${restaurant.happy_hour_config.discount_percent}% Off (${restaurant.happy_hour_config.start_time}-${restaurant.happy_hour_config.end_time})` : 'Configured (Off-peak)'}
              </p>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-white/[0.06] space-y-0.5">
              <span className="text-xs font-bold text-purple-400 block">🎁 Table Food Rewards</span>
              <p className="text-[10px] text-slate-400">Chef dessert &amp; mocktail incentives</p>
            </div>
          </div>
        </div>

        {/* ── 5. 🖨️ POS & Thermal Hardware Bridge ────────────────── */}
        <div className="bg-[#0D1322] p-4 sm:p-5 rounded-3xl border border-white/[0.08] shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="text-xl">🖨️</span>
              <div>
                <h3 className="font-serif font-bold text-base text-white">5. POS &amp; Thermal Hardware Bridge</h3>
                <p className="text-[11px] text-slate-400">Active adapter: <strong className="text-amber-400 uppercase font-mono">{restaurant.pos_provider || 'Petpooja'}</strong> • ESC/POS WebUSB Sync</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPosModalOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Open Window</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {['petpooja', 'royalpos', 'recaho', 'rancelab'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setSelectedPosTab(p as any);
                  updateRestaurant(restaurant.id, { pos_provider: p as any });
                }}
                className={`p-2 rounded-xl border text-left capitalize text-xs font-bold cursor-pointer transition-all ${
                  (restaurant.pos_provider || 'petpooja') === p
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900/90 border-white/[0.06] text-slate-400 hover:text-white'
                }`}
              >
                <span>{p}</span>
                <span className="block text-[9px] text-slate-500 font-normal">
                  {(restaurant.pos_provider || 'petpooja') === p ? '● Connected' : 'Adapter'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── 6. ⚙️ Venue Settings & Floor Plan ───────────────────── */}
        <div className="bg-[#0D1322] p-4 sm:p-5 rounded-3xl border border-white/[0.08] shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="text-xl">⚙️</span>
              <div>
                <h3 className="font-serif font-bold text-base text-white">6. Venue Settings &amp; Handover Hub</h3>
                <p className="text-[11px] text-slate-400">QR launch sheets, Chef AI knowledge persona &amp; table customizer</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Open Window</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsLaunchKitOpen(true)}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-white/[0.06] hover:border-amber-500/40 text-left transition-all cursor-pointer"
            >
              <span className="text-xs font-bold text-white block">📲 QR Launch Kit</span>
              <span className="text-[10px] text-slate-400">Printable sheets</span>
            </button>

            <button
              type="button"
              onClick={() => setIsTableModalOpen(true)}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-white/[0.06] hover:border-emerald-500/40 text-left transition-all cursor-pointer"
            >
              <span className="text-xs font-bold text-white block">🪑 Floor Editor</span>
              <span className="text-[10px] text-slate-400">Edit table tokens</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAiStudioOpen(true)}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-white/[0.06] hover:border-purple-500/40 text-left transition-all cursor-pointer"
            >
              <span className="text-xs font-bold text-white block">🧑‍🍳 Chef AI Persona</span>
              <span className="text-[10px] text-slate-400">Train dining bot</span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 🪑 POPUP WINDOW 1: FLOOR & TABLES                          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isFloorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0D1322] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-7 relative space-y-5 border border-white/[0.12] text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🪑</span>
                <div>
                  <h3 className="font-serif font-bold text-xl text-white">Floor &amp; Live Tables Manager</h3>
                  <p className="text-xs text-slate-400">Manage seating layout, open tabs, and launch diner menus</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsTableModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-white/[0.08] cursor-pointer"
                >
                  Edit Layout
                </button>
                <button
                  type="button"
                  onClick={() => setIsFloorModalOpen(false)}
                  className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {activeTablesList.map((table) => {
                const tableOrders = activeOrdersList.filter((o) => o.table_id === table.id);
                const tableTotal = tableOrders.reduce((sum, o) => sum + o.total_amount, 0);
                const hasOpenOrders = tableOrders.length > 0;

                return (
                  <div key={table.id} className="bg-slate-900/90 rounded-2xl p-4 border border-white/[0.08] space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm">{table.label}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">Token: {table.public_token}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                        hasOpenOrders ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/15 text-emerald-300'
                      }`}>
                        {hasOpenOrders ? `₹${tableTotal} Open` : 'Ready'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/r/${restaurant.slug}/menu?t=${table.public_token}`}
                        className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs rounded-xl text-center flex items-center justify-center space-x-1"
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 📸 POPUP WINDOW 2: RESTAURANT MENU & PHOTOS STUDIO          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isMenuPhotosModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0D1322] rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-7 relative space-y-5 border border-white/[0.12] text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📸</span>
                <div>
                  <h3 className="font-serif font-bold text-xl text-white">Restaurant Menu &amp; Photo Studio</h3>
                  <p className="text-xs text-slate-400">Multi-photo uploads per dish &amp; ambiance gallery</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRestaurantPhotoModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-white/[0.08] flex items-center space-x-1 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ambiance Photos</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsMenuPhotosModalOpen(false)}
                  className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-slate-300 hover:text-white transition-colors cursor-pointer"
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
                placeholder="Search dishes to edit photos..."
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
                    <div key={dish.id} className="bg-slate-900/90 rounded-2xl border border-white/[0.08] overflow-hidden flex flex-col justify-between group">
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
                      </div>

                      <div className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-white line-clamp-1">{dish.name}</h4>
                          <span className="text-xs font-bold text-amber-400 font-mono">₹{dish.price}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPhotoStudioDish(dish)}
                          className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center space-x-1.5 cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0D1322] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-7 relative space-y-5 border border-white/[0.12] text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <h3 className="font-serif font-bold text-xl text-white">Google 5-Star Reviews &amp; Reputation Shield</h3>
                  <p className="text-xs text-slate-400">Verified diner feedback and floor grievance routing</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewsModalOpen(false)}
                className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-slate-300 hover:text-white transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0D1322] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-7 relative space-y-5 border border-white/[0.12] text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="font-serif font-bold text-xl text-white">Smart Growth &amp; Upsell Engine</h3>
                  <p className="text-xs text-slate-400">Configure AI chef pairings, happy hour schedules, and food reward incentives</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSmartHubModalOpen(false)}
                className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-slate-300 hover:text-white transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0D1322] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-7 relative space-y-5 border border-white/[0.12] text-white">
            <button
              onClick={() => setIsPosModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors z-10 border border-white/[0.08] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-400">Kitchen &amp; Billing Sync</span>
              <h3 className="text-xl font-bold font-serif text-white mt-0.5">Select POS System Adapter</h3>
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
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0D1322] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-7 relative space-y-5 border border-white/[0.12] text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⚙️</span>
                <div>
                  <h3 className="font-serif font-bold text-xl text-white">Venue Settings &amp; Handover Hub</h3>
                  <p className="text-xs text-slate-400">Launch kit, table layout, persona, and offboarding</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <button
                type="button"
                onClick={() => setIsLaunchKitOpen(true)}
                className="p-4 rounded-2xl bg-slate-900 border border-white/[0.08] hover:border-amber-500/40 text-left transition-all space-y-2 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Share2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">📲 Guest Links &amp; QRs</h4>
                <p className="text-[11px] text-slate-400">WhatsApp handover &amp; QR printable sheet.</p>
              </button>

              <button
                type="button"
                onClick={() => setIsTableModalOpen(true)}
                className="p-4 rounded-2xl bg-slate-900 border border-white/[0.08] hover:border-emerald-500/40 text-left transition-all space-y-2 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <QrCode className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">🪑 Floor Plan &amp; Tables</h4>
                <p className="text-[11px] text-slate-400">Edit table names, capacities &amp; tokens.</p>
              </button>

              <button
                type="button"
                onClick={() => setIsAiStudioOpen(true)}
                className="p-4 rounded-2xl bg-slate-900 border border-white/[0.08] hover:border-purple-500/40 text-left transition-all space-y-2 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">🧑‍🍳 Chef AI Knowledge</h4>
                <p className="text-[11px] text-slate-400">Train AI dining bot persona &amp; upsells.</p>
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
                <UserMinus className="w-3.5 h-3.5" />
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
              <UserMinus className="w-7 h-7" />
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
                    navigate('/admin');
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer flex items-center space-x-1.5"
              >
                <UserMinus className="w-4 h-4" />
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
    </div>
  );
};
