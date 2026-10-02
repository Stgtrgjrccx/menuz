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
  Maximize2
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

  // ── Popup Windows (Modals) State for All Main Headers ─────────
  const [isFloorModalOpen, setIsFloorModalOpen] = useState(false);
  const [isMenuPhotosModalOpen, setIsMenuPhotosModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isSmartHubModalOpen, setIsSmartHubModalOpen] = useState(false);
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sub-modals & drawers
  const [isAiStudioOpen, setIsAiStudioOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isLaunchKitOpen, setIsLaunchKitOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isOffboardModalOpen, setIsOffboardModalOpen] = useState(false);
  const [photoStudioDish, setPhotoStudioDish] = useState<MenuItem | null>(null);
  const [isRestaurantPhotoModalOpen, setIsRestaurantPhotoModalOpen] = useState(false);
  const [photoStudioSearch, setPhotoStudioSearch] = useState('');
  const [smartSettingsTab, setSmartSettingsTab] = useState<'kot' | 'happy_hour' | 'instagram' | 'pairings' | null>(null);
  const [selectedPosTab, setSelectedPosTab] = useState<'petpooja' | 'royalpos' | 'recaho' | 'rancelab'>(
    (restaurant.pos_provider as any) || 'petpooja'
  );

  const [usbPrintLoading, setUsbPrintLoading] = useState(false);
  const [usbPrintStatus, setUsbPrintStatus] = useState<string | null>(null);

  // Hash navigation handler for quick popup triggers
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('photo') || hash.includes('menu')) {
        setIsMenuPhotosModalOpen(true);
      } else if (hash.includes('review')) {
        setIsReviewsModalOpen(true);
      } else if (hash.includes('pos') || hash.includes('kot')) {
        setIsPosModalOpen(true);
      } else if (hash.includes('smart') || hash.includes('automation')) {
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

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#090D16] text-slate-100 p-3 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-6 pb-24">
      {/* ── Top Navigation & Quick Switcher ─────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2">
          {/* Always-Visible Admin Page Top Button */}
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

        {/* Refresh & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleForceRefresh}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-white/[0.08] transition-colors cursor-pointer"
            title="Force refresh"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {/* Active Venue Switcher */}
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
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2 rounded-xl border border-amber-500/20 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chef AI</span>
          </button>

          <Link
            to="/kitchen"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors bg-[#090D16]/[0.04] hover:bg-white/[0.08] px-3.5 py-2 rounded-xl border border-white/[0.08] shadow-sm"
          >
            <ChefHat className="w-3.5 h-3.5 text-amber-400" />
            <span>Kitchen KDS</span>
          </Link>
        </div>
      </div>

      {/* USB Print Notification Banner */}
      {usbPrintStatus && (
        <div className="bg-blue-950/40 border border-blue-500/40 text-blue-200 p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-blue-400" />
            <span>{usbPrintStatus}</span>
          </div>
          <button onClick={() => setUsbPrintStatus(null)} className="text-blue-400 hover:text-blue-200 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Top Venue Header ─────────────────────────────────────── */}
      <header className="flex flex-wrap justify-between items-center pb-2 border-b border-white/[0.08] gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold font-mono tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Active Venue Hub
            </span>
            <span className="text-xs text-slate-400 font-medium">{restaurant.cuisine} • Pune</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">{restaurant.name}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/r/${restaurant.slug}/menu?t=${activeTablesList[0]?.public_token || 'table-token-01-saffron'}`}
            className="flex items-center space-x-1.5 text-xs text-slate-950 bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 px-3.5 py-2.5 rounded-xl shadow-sm transition-all font-bold"
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-slate-950" />
            <span>Launch Diner Menu ({activeTablesList[0]?.label || 'Table 1'})</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
      </header>

      {/* ── QUICK POPUP WINDOW OPENERS BAR ───────────────────────── */}
      <div className="bg-[#0B101D] p-2 rounded-2xl border border-white/[0.08] shadow-md flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono pl-2 hidden sm:inline">
          Popup Windows:
        </span>
        {[
          { id: 'floor', label: 'Floor & Tables', icon: '🪑', count: activeTablesList.length, open: () => setIsFloorModalOpen(true) },
          { id: 'menu_photos', label: 'Menu & Photos', icon: '📸', count: activeMenuItemsList.length, open: () => setIsMenuPhotosModalOpen(true) },
          { id: 'reviews', label: 'Reviews & Shield', icon: '⭐', count: reviews.filter((r) => r.restaurant_id === restaurant.id).length, open: () => setIsReviewsModalOpen(true) },
          { id: 'smart_hub', label: 'Smart Automation', icon: '⚡', open: () => setIsSmartHubModalOpen(true) },
          { id: 'pos', label: 'POS & Hardware', icon: '🖨️', badge: restaurant.pos_provider || 'Petpooja', open: () => setIsPosModalOpen(true) },
          { id: 'settings', label: 'Venue Settings', icon: '⚙️', open: () => setIsSettingsModalOpen(true) }
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={item.open}
            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-amber-500/20 hover:border-amber-500/40 border border-white/[0.08] transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer shadow-sm active:scale-95"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-slate-800 text-amber-300 font-bold">
                {item.count}
              </span>
            )}
            {item.badge && (
              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-mono bg-slate-800 text-orange-300 font-bold hidden md:inline">
                {item.badge}
              </span>
            )}
            <Maximize2 className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
          </button>
        ))}
      </div>

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

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 🌟 ALL-IN-ONE EXECUTIVE LISTERS OVERVIEW (ALL VISIBLE AT ONCE) */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="space-y-6">
        {/* Top Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#0D1322] p-4 rounded-2xl border border-white/[0.08] shadow flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Session Revenue</span>
              <p className="font-serif text-xl font-bold text-white">₹{totalVolume.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-[#0D1322] p-4 rounded-2xl border border-white/[0.08] shadow flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Orders Placed</span>
              <p className="font-serif text-xl font-bold text-white">{totalOrdersCount} tickets</p>
            </div>
          </div>

          <div className="bg-[#0D1322] p-4 rounded-2xl border border-white/[0.08] shadow flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Active QR Tables</span>
              <p className="font-serif text-xl font-bold text-white">{activeTablesList.length} tables</p>
            </div>
          </div>
        </div>

        {/* ── LISTER 1: FLOOR & TABLES OVERVIEW ──────────────────── */}
        <section className="bg-[#0D1322] p-5 sm:p-6 rounded-3xl border border-white/[0.08] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🪑</span>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif font-bold text-lg text-white">Floor &amp; Live Tables Lister</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {activeTablesList.length} Tables Active
                  </span>
                </div>
                <p className="text-xs text-slate-400">Live seating layout, open bills, and table token launcher</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFloorModalOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Open Floor Window</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeTablesList.slice(0, 6).map((table) => {
              const tableOrders = activeOrdersList.filter((o) => o.table_id === table.id);
              const tableTotal = tableOrders.reduce((sum, o) => sum + o.total_amount, 0);
              const hasOpenOrders = tableOrders.length > 0;

              return (
                <div
                  key={table.id}
                  className={`bg-slate-900/90 rounded-2xl p-4 border transition-all flex flex-col justify-between space-y-3 ${
                    hasOpenOrders ? 'border-amber-500/40 shadow-md ring-1 ring-amber-400/20' : 'border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-white text-sm">{table.label}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">({(table as any).seating_capacity || 4} seats)</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Token: <code className="font-mono text-amber-400">{table.public_token}</code>
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                      hasOpenOrders ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {hasOpenOrders ? `₹${tableTotal} Open` : 'Ready'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <Link
                      to={`/r/${restaurant.slug}/menu?t=${table.public_token}`}
                      className="flex-1 py-1.5 px-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-[11px] rounded-lg text-center transition-all flex items-center justify-center space-x-1"
                    >
                      <UtensilsCrossed className="w-3 h-3" />
                      <span>Launch Menu</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleTestUsbPrint}
                      className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold border border-white/[0.08] flex items-center space-x-1 cursor-pointer"
                    >
                      <Printer className="w-3 h-3 text-amber-400" />
                      <span>KOT</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── LISTER 2: MENU & PHOTO STUDIO OVERVIEW ─────────────── */}
        <section className="bg-[#0D1322] p-5 sm:p-6 rounded-3xl border border-white/[0.08] shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📸</span>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif font-bold text-lg text-white">Restaurant Menu &amp; Photo Studio Lister</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {activeMenuItemsList.length} Dishes
                  </span>
                </div>
                <p className="text-xs text-slate-400">Multi-angle photos, cover selection, and instant availability toggle</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsRestaurantPhotoModalOpen(true)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-white/[0.08] flex items-center space-x-1 cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Ambiance Photos</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMenuPhotosModalOpen(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Open Photos Window</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {activeMenuItemsList.slice(0, 4).map((dish) => {
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
                      <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-black/80 text-amber-300 backdrop-blur-sm border border-amber-500/30">
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
                      className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-[11px] rounded-lg flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Manage Photos</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── LISTER 3: GOOGLE REVIEWS & REPUTATION SHIELD ───────── */}
        <section className="bg-[#0D1322] p-5 sm:p-6 rounded-3xl border border-white/[0.08] shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⭐</span>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif font-bold text-lg text-white">Google Reviews &amp; Shield Lister</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    4.9★ Floor Shield Active
                  </span>
                </div>
                <p className="text-xs text-slate-400">Diner feedback routing &amp; automated 5-star Google review triggers</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsReviewsModalOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Open Reviews Window</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reviews.filter((r) => r.restaurant_id === restaurant.id).slice(0, 2).map((rev) => (
              <div key={rev.id} className="bg-slate-900/90 p-4 rounded-2xl border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{rev.customer_name || 'Verified Diner'}</span>
                  <div className="flex items-center text-amber-400 text-xs">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">"{rev.review_text}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── LISTER 4: SMART AUTOMATION & UPSELL HUB ─────────────── */}
        <section className="bg-[#0D1322] p-5 sm:p-6 rounded-3xl border border-white/[0.08] shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚡</span>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif font-bold text-lg text-white">Smart Automation &amp; Growth Engine</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    Auto-KOT &amp; Viral Stories
                  </span>
                </div>
                <p className="text-xs text-slate-400">Dynamic pricing, kitchen automation, and Instagram story studio</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSmartHubModalOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Open Smart Hub Window</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-white/[0.08] space-y-1.5">
              <span className="text-xs font-bold text-white">🔥 Direct KOT</span>
              <p className="text-[10px] text-slate-400">
                {restaurant.direct_kitchen_kot_enabled ? 'Auto-Fire to KDS' : 'Manual Approval'}
              </p>
            </div>
            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-white/[0.08] space-y-1.5">
              <span className="text-xs font-bold text-white">⚡ Happy Hour</span>
              <p className="text-[10px] text-slate-400">
                {restaurant.happy_hour_config?.enabled ? `${restaurant.happy_hour_config.discount_percent}% Off` : 'Disabled'}
              </p>
            </div>
            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-white/[0.08] space-y-1.5">
              <span className="text-xs font-bold text-white">📸 Instagram Card</span>
              <p className="text-[10px] text-slate-400">9:16 Viral Generator</p>
            </div>
            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-white/[0.08] space-y-1.5">
              <span className="text-xs font-bold text-white">🧑‍🍳 Pairings</span>
              <p className="text-[10px] text-slate-400">Smart Cart Upsell</p>
            </div>
          </div>
        </section>

        {/* ── LISTER 5: POS & HARDWARE BRIDGES ───────────────────── */}
        <section className="bg-[#0D1322] p-5 sm:p-6 rounded-3xl border border-white/[0.08] shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🖨️</span>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif font-bold text-lg text-white">POS &amp; Thermal Hardware Bridge</h3>
                  <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/30">
                    {restaurant.pos_provider || 'Petpooja'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Universal POS sync, ESC/POS thermal printing, and billing integration</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPosModalOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Open POS Window</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {['petpooja', 'royalpos', 'recaho', 'rancelab'].map((p) => (
              <div
                key={p}
                className={`p-3 rounded-2xl border text-left capitalize text-xs font-bold ${
                  (restaurant.pos_provider || 'petpooja') === p
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900/90 border-white/[0.08] text-slate-400'
                }`}
              >
                <span>{p}</span>
                <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                  {(restaurant.pos_provider || 'petpooja') === p ? '● Active Bridge' : 'Available'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── LISTER 6: VENUE SETTINGS & FLOOR PLAN ──────────────── */}
        <section className="bg-[#0D1322] p-5 sm:p-6 rounded-3xl border border-white/[0.08] shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚙️</span>
              <div>
                <h3 className="font-serif font-bold text-lg text-white">Venue Settings &amp; Floor Plan Lister</h3>
                <p className="text-xs text-slate-400">QR launch kit, AI training persona, and table customizer</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Open Settings Window</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setIsLaunchKitOpen(true)}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/[0.08] hover:border-amber-500/40 text-left transition-all space-y-1 cursor-pointer"
            >
              <h4 className="font-bold text-xs text-white">📲 Guest Links &amp; QRs</h4>
              <p className="text-[10px] text-slate-400">WhatsApp handover &amp; printable codes</p>
            </button>

            <button
              type="button"
              onClick={() => setIsTableModalOpen(true)}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/[0.08] hover:border-emerald-500/40 text-left transition-all space-y-1 cursor-pointer"
            >
              <h4 className="font-bold text-xs text-white">🪑 Floor Plan Editor</h4>
              <p className="text-[10px] text-slate-400">Configure capacities &amp; tokens</p>
            </button>

            <button
              type="button"
              onClick={() => setIsAiStudioOpen(true)}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/[0.08] hover:border-purple-500/40 text-left transition-all space-y-1 cursor-pointer"
            >
              <h4 className="font-bold text-xs text-white">🧑‍🍳 Chef AI Knowledge</h4>
              <p className="text-[10px] text-slate-400">Train dining concierge bot</p>
            </button>
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 🪑 MODAL POPUP WINDOW 1: FLOOR & TABLES                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isFloorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0D1322] rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-7 relative space-y-5 border border-white/[0.1] text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🪑</span>
                <div>
                  <h3 className="font-serif font-bold text-xl text-white">Floor &amp; Live Tables Manager</h3>
                  <p className="text-xs text-slate-400">Manage live seating, table tokens, and orders</p>
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
                        <span>Open Diner Menu</span>
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
      {/* 📸 MODAL POPUP WINDOW 2: RESTAURANT MENU & PHOTOS STUDIO    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isMenuPhotosModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0D1322] rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-7 relative space-y-5 border border-white/[0.1] text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📸</span>
                <div>
                  <h3 className="font-serif font-bold text-xl text-white">Restaurant Menu &amp; Photo Studio</h3>
                  <p className="text-xs text-slate-400">Multi-photo management &amp; availability toggles</p>
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

            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={photoStudioSearch}
                onChange={(e) => setPhotoStudioSearch(e.target.value)}
                placeholder="Search dishes to edit photos..."
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      {/* ⭐ MODAL POPUP WINDOW 3: GOOGLE REVIEWS & SHIELD            */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isReviewsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0D1322] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-7 relative space-y-5 border border-white/[0.1] text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <h3 className="font-serif font-bold text-xl text-white">Google 5-Star Reviews &amp; Reputation Shield</h3>
                  <p className="text-xs text-slate-400">Manage live reviews and floor shield routing</p>
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
      {/* ⚡ MODAL POPUP WINDOW 4: SMART AUTOMATION                   */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isSmartHubModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0D1322] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-7 relative space-y-5 border border-white/[0.1] text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="font-serif font-bold text-xl text-white">Smart Automation &amp; Growth Engine</h3>
                  <p className="text-xs text-slate-400">Direct KOT, surge pricing, Instagram story generator &amp; upsells</p>
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
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">🔥 Direct-to-Kitchen KOT</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    restaurant.direct_kitchen_kot_enabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {restaurant.direct_kitchen_kot_enabled ? 'Auto ON' : 'Manual'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Fires orders straight to kitchen display without waiting for approval.</p>
                <button
                  type="button"
                  onClick={() => updateRestaurant(restaurant.id, { direct_kitchen_kot_enabled: !restaurant.direct_kitchen_kot_enabled })}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  {restaurant.direct_kitchen_kot_enabled ? 'Turn OFF Auto-KOT' : 'Enable Auto-KOT'}
                </button>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">⚡ Happy Hour &amp; Surge</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300">
                    {restaurant.happy_hour_config?.enabled ? `${restaurant.happy_hour_config.discount_percent}% Off` : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Automated off-peak discounts and peak weekend surge pricing.</p>
                <button
                  type="button"
                  onClick={() => setSmartSettingsTab('happy_hour')}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-white/[0.08] cursor-pointer"
                >
                  Edit Schedule
                </button>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">📸 Instagram Story Card</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300">
                    Viral 9:16
                  </span>
                </div>
                <p className="text-xs text-slate-400">Generate high-converting vertical story cards for social media.</p>
                <button
                  type="button"
                  onClick={() => setSmartSettingsTab('instagram')}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-white/[0.08] cursor-pointer"
                >
                  Open Story Generator
                </button>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">🧑‍🍳 Smart Pairings</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-400">Recommends matching wine, desserts, and sides inside diner cart.</p>
                <button
                  type="button"
                  onClick={() => setSmartSettingsTab('pairings')}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-white/[0.08] cursor-pointer"
                >
                  Customize Upsells
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 🖨️ MODAL POPUP WINDOW 5: POS & HARDWARE INTEGRATION         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isPosModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0D1322] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-7 relative space-y-5 border border-white/[0.1] text-white">
            <button
              onClick={() => setIsPosModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors z-10 border border-white/[0.08] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-400">Kitchen &amp; Billing Sync</span>
              <h3 className="text-xl font-bold font-serif text-white mt-0.5">Select Your Restaurant's POS System</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch adapters, configure connection credentials, and simulate live KOT dispatch to your thermal printer.
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
      {/* ⚙️ MODAL POPUP WINDOW 6: VENUE SETTINGS                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0D1322] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-7 relative space-y-5 border border-white/[0.1] text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⚙️</span>
                <div>
                  <h3 className="font-serif font-bold text-xl text-white">Venue Settings &amp; Handover Hub</h3>
                  <p className="text-xs text-slate-400">Manage links, tables, persona, and venue offboarding</p>
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

      {/* ── Sub-Modals & Customizers ──────────────────────────────── */}
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
        initialTab={smartSettingsTab || 'kot'}
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
