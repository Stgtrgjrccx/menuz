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
  ChevronRight
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

  // ── App-Style Windowed Tabs State ───────────────────────────
  const [activeManagerTab, setActiveManagerTab] = useState<'operations' | 'menu_photos' | 'reviews' | 'smart_hub' | 'pos' | 'settings'>('operations');

  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
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

  const deviceViewMode = useRestaurantStore((state) => state.deviceViewMode);
  const setDeviceViewMode = useRestaurantStore((state) => state.setDeviceViewMode);

  // Sync hash routing for instant window tab opening (e.g., #manager-photo-studio)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('photo') || hash.includes('menu')) {
        setActiveManagerTab('menu_photos');
      } else if (hash.includes('review')) {
        setActiveManagerTab('reviews');
      } else if (hash.includes('pos') || hash.includes('kot')) {
        setActiveManagerTab('pos');
      } else if (hash.includes('smart') || hash.includes('automation')) {
        setActiveManagerTab('smart_hub');
      } else if (hash.includes('setting') || hash.includes('floor')) {
        setActiveManagerTab('settings');
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

  const [isAiStudioOpen, setIsAiStudioOpen] = useState(false);
  const [usbPrintLoading, setUsbPrintLoading] = useState(false);
  const [usbPrintStatus, setUsbPrintStatus] = useState<string | null>(null);

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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#090D16] text-slate-100 p-3 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-5 sm:space-y-6 pb-20">
      {/* Top Quick Navigation Bar with Admin HQ button & Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-white/[0.08]">
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

        {/* Refresh button */}
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={handleForceRefresh}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-white/[0.08] transition-colors cursor-pointer"
            title="Force refresh"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
            <span>Chef AI Studio</span>
          </button>

          <button
            type="button"
            disabled={usbPrintLoading}
            onClick={handleTestUsbPrint}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-300 hover:text-blue-200 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3.5 py-2 rounded-xl border border-blue-500/20 shadow-sm cursor-pointer"
            title="Connect USB Thermal Printer & Test Print ESC/POS Ticket"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span>{usbPrintLoading ? 'Sending...' : 'Test ESC/POS'}</span>
          </button>

          <Link
            to="/kitchen"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors bg-[#090D16]/[0.04] hover:bg-white/[0.08] px-3.5 py-2 rounded-xl border border-white/[0.08] shadow-sm"
          >
            <ChefHat className="w-3.5 h-3.5 text-amber-400" />
            <span>Kitchen KDS</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsPosModalOpen(true)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-orange-300 hover:text-orange-200 transition-colors bg-orange-500/10 hover:bg-orange-500/20 px-3.5 py-2 rounded-xl border border-orange-500/20 shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-orange-400" />
            <span>POS & KOT</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-[#090D16]/[0.06] text-orange-300 font-bold border border-white/[0.08]">
              {restaurant.pos_provider || 'Petpooja'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setIsTableModalOpen(true)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-2 rounded-xl border border-emerald-500/20 shadow-sm cursor-pointer"
          >
            <span className="text-xs">🪑</span>
            <span>Floor Plan</span>
            <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-[#090D16]/[0.06] text-emerald-300 font-bold border border-white/[0.08]">
              {activeTablesList.length} Tables
            </span>
          </button>
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

      {/* Top Venue Header */}
      <header className="flex flex-wrap justify-between items-center pb-3 border-b border-white/[0.08] gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold font-mono tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Active Venue Hub
            </span>
            <span className="text-xs text-slate-400 font-medium">Operational Console</span>
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

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 📱 APP-STYLE WINDOWED TABS (INSTANT ZERO-SCROLL WORKSPACES) */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="bg-[#0B101D] p-1.5 rounded-2xl border border-white/[0.08] shadow-lg flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {[
          { id: 'operations', label: 'Floor & Tables', icon: '🪑', count: activeTablesList.length },
          { id: 'menu_photos', label: 'Menu & Photos', icon: '📸', count: activeMenuItemsList.length },
          { id: 'reviews', label: 'Reviews & Shield', icon: '⭐', count: reviews.filter((r) => r.restaurant_id === restaurant.id).length },
          { id: 'smart_hub', label: 'Smart Automation', icon: '⚡' },
          { id: 'pos', label: 'POS & Hardware', icon: '🖨️', badge: restaurant.pos_provider || 'Petpooja' },
          { id: 'settings', label: 'Venue Settings', icon: '⚙️' }
        ].map((tab) => {
          const isActive = activeManagerTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveManagerTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer flex-1 justify-center min-w-[130px] ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md ring-1 ring-amber-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-black/30 text-white font-bold' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono hidden md:inline ${
                  isActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-amber-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 🪑 TAB 1: FLOOR & LIVE TABLES (OPERATIONS)                  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {activeManagerTab === 'operations' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Urgent Service Alerts */}
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

          {/* Waiter Calls Alert */}
          {unreadWaiterCalls.length > 0 && (
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
                <h3 className="font-serif font-bold text-sm text-white">
                  Active Waiter Assistance Calls ({unreadWaiterCalls.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {unreadWaiterCalls.map((notif) => (
                  <div key={notif.id} className="bg-[#0D1322] p-3 rounded-xl border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <p className="font-serif font-bold text-sm text-white">{notif.table_label || 'Customer Table'}</p>
                      <p className="text-[10px] text-slate-400">Assistance Requested</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => markNotificationRead(notif.id)}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Attend
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics Summary Cards */}
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

          {/* Active Tables Roster Grid */}
          <div className="bg-[#0D1322] p-5 rounded-3xl border border-white/[0.08] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center space-x-2">
                <span className="text-base">🪑</span>
                <h3 className="font-serif font-bold text-lg text-white">Active Floor Tables ({activeTablesList.length})</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTableModalOpen(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-white/[0.08] flex items-center space-x-1 cursor-pointer"
              >
                <span>Edit Floor Plan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeTablesList.map((table) => {
                const tableOrders = activeOrdersList.filter((o) => o.table_id === table.id);
                const tableTotal = tableOrders.reduce((sum, o) => sum + o.total_amount, 0);
                const hasOpenOrders = tableOrders.length > 0;

                return (
                  <div
                    key={table.id}
                    className={`bg-slate-900/90 rounded-2xl p-4 border transition-all flex flex-col justify-between space-y-3 ${
                      hasOpenOrders ? 'border-amber-500/40 shadow-md ring-1 ring-amber-400/20' : 'border-white/[0.08] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-white text-sm">{table.label}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">({(table as any).seating_capacity || (table as any).capacity || 4} seats)</span>
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
                        className="flex-1 py-1.5 px-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-bold text-[11px] rounded-lg text-center transition-all flex items-center justify-center space-x-1"
                        title="Open Diner Menu for this table"
                      >
                        <UtensilsCrossed className="w-3 h-3" />
                        <span>Menu</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleTestUsbPrint}
                        className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold border border-white/[0.08] flex items-center space-x-1 cursor-pointer"
                        title="Print KOT ticket"
                      >
                        <Printer className="w-3 h-3 text-amber-400" />
                        <span>KOT</span>
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
      {/* 📸 TAB 2: MENU & PHOTO STUDIO (INSIDE RESTAURANT ONLY)      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {activeManagerTab === 'menu_photos' && (
        <section id="manager-photo-studio" className="bg-[#0D1322] border border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 text-white animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-serif text-xl font-bold text-white">Restaurant Menu &amp; Photo Studio</h2>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {activeMenuItemsList.length} Dishes
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload multiple photos per dish, set primary cover, and manage ambiance gallery pictures directly from your device.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsRestaurantPhotoModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Venue Ambiance Photos ({restaurant.ambiance_photos?.length || 0})</span>
            </button>
          </div>

          {/* Venue Cover / Banner Quick Preview */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <img
                src={restaurant.cover_image_url || restaurant.logo_url}
                alt={restaurant.name}
                className="w-16 h-12 sm:w-20 sm:h-14 rounded-xl object-cover border border-white/[0.1] shadow"
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block font-mono">
                  Primary Venue Cover
                </span>
                <h4 className="font-bold text-sm text-white">{restaurant.name}</h4>
                <p className="text-[11px] text-slate-400">
                  {restaurant.ambiance_photos?.length || 0} gallery photos attached
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsRestaurantPhotoModalOpen(true)}
              className="w-full md:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-white/[0.08] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Manage Ambiance Photos</span>
            </button>
          </div>

          {/* Search Dishes */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={photoStudioSearch}
                onChange={(e) => setPhotoStudioSearch(e.target.value)}
                placeholder="Search dishes to edit photos or toggle availability..."
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
              />
              {photoStudioSearch && (
                <button
                  onClick={() => setPhotoStudioSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <span className="text-xs text-slate-400">
              ⭐ Tap <strong>Upload &amp; Manage</strong> on any dish to attach multi-angle photos
            </span>
          </div>

          {/* Dish Cards Roster with Side-by-Side Photo Previews */}
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
                const hasDual = dishPhotos.length > 1;

                return (
                  <div
                    key={dish.id}
                    className="bg-slate-900/90 rounded-2xl border border-white/[0.08] overflow-hidden shadow-lg hover:border-amber-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                      {hasDual ? (
                        <div className="grid grid-cols-2 h-full w-full gap-0.5">
                          <div className="relative h-full overflow-hidden">
                            <img
                              src={dishPhotos[0]}
                              alt={`${dish.name} Photo 1`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute bottom-1 left-1 px-1 py-0.2 bg-amber-500 text-slate-950 font-bold text-[7px] rounded shadow">
                              Cover
                            </span>
                          </div>
                          <div className="relative h-full overflow-hidden">
                            <img
                              src={dishPhotos[1]}
                              alt={`${dish.name} Photo 2`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/80 text-amber-300 font-bold text-[7px] rounded border border-amber-500/30">
                              Photo 2
                            </span>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={dish.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600'}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}

                      {/* Photo count pill */}
                      <div className="absolute top-2 right-2 flex items-center space-x-1">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/80 text-amber-300 backdrop-blur-sm border border-amber-500/30 flex items-center space-x-1">
                          <Layers className="w-2.5 h-2.5" />
                          <span>{dishPhotos.length} Photos</span>
                        </span>
                      </div>

                      {/* Dietary flag */}
                      <div className="absolute top-2 left-2">
                        <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-bold ${
                          dish.dietary_flags?.includes('veg') ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                        }`}>
                          {dish.dietary_flags?.includes('veg') ? 'VEG' : 'NON-VEG'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-white line-clamp-1">{dish.name}</h4>
                          <span className="text-xs font-bold text-amber-400 font-mono">₹{dish.price}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{dish.short_description}</p>
                      </div>

                      <div className="space-y-1.5 pt-1 border-t border-white/[0.06]">
                        <button
                          type="button"
                          onClick={() => setPhotoStudioDish(dish)}
                          className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
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
                          {dish.is_available !== false ? '● In Stock (Available)' : '○ Marked Sold Out'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ⭐ TAB 3: REVIEWS & REPUTATION SHIELD                       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {activeManagerTab === 'reviews' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Google Star Rating & Reputation Shield Overview */}
          <div className="bg-[#0D1322] p-5 sm:p-6 rounded-3xl border border-white/[0.08] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex flex-col items-center justify-center text-amber-400">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                <span className="font-bold text-xs font-mono mt-0.5">4.9★</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif font-bold text-xl text-white">Google 5-Star Reputation Engine</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Floor Shield Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Automated table challenges reward 5-star Google reviews. Low-rating experiences (&lt; 4★) are shielded instantly and routed to your floor manager before publication.
                </p>
              </div>
            </div>

            <a
              href={restaurant.google_place_url || `https://search.google.com/local/writereview?placeid=${restaurant.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center space-x-1.5 transition-all self-start md:self-auto cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Live Google Place Review Link</span>
            </a>
          </div>

          {/* Live Reviews Roster */}
          <div className="bg-[#0D1322] p-5 rounded-3xl border border-white/[0.08] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h4 className="font-serif font-bold text-base text-white flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Verified Diner Feedback ({reviews.filter((r) => r.restaurant_id === restaurant.id).length})</span>
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {reviews.filter((r) => r.restaurant_id === restaurant.id).slice(0, 8).map((rev) => (
                <div key={rev.id} className="bg-slate-900/90 p-4 rounded-2xl border border-white/[0.08] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-white">{rev.customer_name || 'Verified Diner'}</span>
                      <span className="text-[10px] text-slate-500">{(rev as any).table_label || 'Dine-In'}</span>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">"{rev.review_text}"</p>
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
      {/* ⚡ TAB 4: SMART AUTOMATION & UPSELL ENGINE                  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {activeManagerTab === 'smart_hub' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-[#0D1322] rounded-3xl border border-white/[0.08] p-6 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
                    Strategic Controls
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono">
                    Automation
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-white mt-1">
                  Smart Operations, Direct KOT &amp; Growth Engine
                </h3>
                <p className="text-xs text-slate-400">
                  Configure direct kitchen routing, dynamic happy hour surge pricing, and viral Instagram story cards.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSmartSettingsTab('kot')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-white/[0.1] rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>⚙️ Configure All Smart Options</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Direct-to-Kitchen KOT */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-3.5 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <span>🔥</span>
                      <span>Direct KOT</span>
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      restaurant.direct_kitchen_kot_enabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono'
                        : 'bg-white/[0.06] text-slate-400 font-mono'
                    }`}>
                      {restaurant.direct_kitchen_kot_enabled ? 'Auto ON' : 'Manual'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">
                    Fires orders directly to kitchen KDS without waiting for manual manager approval.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !restaurant.direct_kitchen_kot_enabled;
                      updateRestaurant(restaurant.id, { direct_kitchen_kot_enabled: nextVal });
                    }}
                    className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center space-x-1 shadow-sm cursor-pointer ${
                      restaurant.direct_kitchen_kot_enabled
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-white/[0.08] hover:bg-white/[0.12] text-white'
                    }`}
                  >
                    <span>{restaurant.direct_kitchen_kot_enabled ? '✓ Auto-KOT ON' : 'Enable Auto-KOT'}</span>
                  </button>
                </div>
              </div>

              {/* Happy Hour & Surge */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-3.5 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <span>⚡</span>
                      <span>Happy Hour &amp; Surge</span>
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      restaurant.happy_hour_config?.enabled
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30 font-mono'
                        : 'bg-white/[0.06] text-slate-400 font-mono'
                    }`}>
                      {restaurant.happy_hour_config?.enabled ? `${restaurant.happy_hour_config.discount_percent}% Off` : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">
                    Off-peak discounts and optional peak Saturday evening surge markups.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSmartSettingsTab('happy_hour')}
                  className="w-full py-1.5 px-2 rounded-xl text-[10px] font-semibold text-slate-300 bg-[#090D16]/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Settings className="w-3 h-3 text-slate-400" />
                  <span>Edit Schedule</span>
                </button>
              </div>

              {/* Instagram Story Brand Studio */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-3.5 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <span>📸</span>
                      <span>Instagram Story</span>
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 font-mono">
                      Viral Card
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">
                    9:16 vertical story generator with dish photos and 1-tap caption copy.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSmartSettingsTab('instagram')}
                  className="w-full py-2 px-2 rounded-xl text-[11px] font-semibold text-slate-200 bg-[#090D16]/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Settings className="w-3 h-3 text-pink-400" />
                  <span>Customize Story</span>
                </button>
              </div>

              {/* Smart Upsell Pairings */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-3.5 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <span>🧑‍🍳</span>
                      <span>Chef's Pairings</span>
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      restaurant.smart_pairings_config?.enabled !== false
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono'
                        : 'bg-white/[0.06] text-slate-400 font-mono'
                    }`}>
                      {restaurant.smart_pairings_config?.enabled !== false ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">
                    Recommends matching wine, desserts, and sides inside diner cart.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSmartSettingsTab('pairings')}
                  className="w-full py-2 px-2 rounded-xl text-[11px] font-semibold text-slate-200 bg-[#090D16]/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Settings className="w-3 h-3 text-emerald-400" />
                  <span>Customize Upsells</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 🖨️ TAB 5: POS & HARDWARE BRIDGES                            */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {activeManagerTab === 'pos' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-[#0D1322] rounded-3xl p-6 border border-white/[0.08] shadow-xl space-y-5 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-400">Kitchen &amp; Billing Bridge</span>
                <h3 className="text-xl font-bold font-serif text-white mt-0.5">Select POS System Adapter</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Universal adapter connects your existing POS with instant kitchen ticket printing.
                </p>
              </div>

              <button
                type="button"
                disabled={usbPrintLoading}
                onClick={handleTestUsbPrint}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{usbPrintLoading ? 'Testing...' : 'Test Print ESC/POS Ticket'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'petpooja', name: 'Petpooja', tag: '50k+ Outlets', desc: 'REST API Bridge' },
                { id: 'royalpos', name: 'RoyalPOS', tag: 'Pune Local', desc: 'LAN & Tablet POS' },
                { id: 'recaho', name: 'Recaho', tag: 'PCMC / Pune', desc: 'Cloud GST & KOT' },
                { id: 'rancelab', name: 'RanceLab', tag: 'Fine Dining', desc: 'Multi-Outlet Fusion' }
              ].map((prov) => (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => {
                    setSelectedPosTab(prov.id as any);
                    updateRestaurant(restaurant.id, { pos_provider: prov.id as any });
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedPosTab === prov.id
                      ? 'bg-amber-500/15 border-amber-500/40 ring-1 ring-amber-400/40 text-amber-300'
                      : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-white">{prov.name}</span>
                    <span className="text-[8px] uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold font-mono">{prov.tag}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{prov.desc}</p>
                </button>
              ))}
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
      {/* ⚙️ TAB 6: VENUE SETTINGS & FLOOR PLAN                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {activeManagerTab === 'settings' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-[#0D1322] p-6 rounded-3xl border border-white/[0.08] shadow-xl space-y-6 text-white">
            <div className="pb-4 border-b border-white/[0.08]">
              <h3 className="font-serif font-bold text-xl text-white">Venue Management &amp; Settings</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage floor layout, table tokens, guest share links, AI persona training, and venue offboarding.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              <button
                type="button"
                onClick={() => setIsLaunchKitOpen(true)}
                className="p-4 rounded-2xl bg-slate-900 border border-white/[0.08] hover:border-amber-500/40 text-left transition-all space-y-2 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Share2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">📲 Guest Links &amp; QRs</h4>
                <p className="text-[11px] text-slate-400">Shareable WhatsApp brief, QR codes, and custom domain configuration.</p>
              </button>

              <button
                type="button"
                onClick={() => setIsTableModalOpen(true)}
                className="p-4 rounded-2xl bg-slate-900 border border-white/[0.08] hover:border-emerald-500/40 text-left transition-all space-y-2 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <QrCode className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">🪑 Floor Plan &amp; Tables</h4>
                <p className="text-[11px] text-slate-400">Edit table names, capacities, seating layout, and tokens.</p>
              </button>

              <button
                type="button"
                onClick={() => setIsAiStudioOpen(true)}
                className="p-4 rounded-2xl bg-slate-900 border border-white/[0.08] hover:border-purple-500/40 text-left transition-all space-y-2 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">🧑‍🍳 Chef AI Knowledge Persona</h4>
                <p className="text-[11px] text-slate-400">Train AI dining bot on head chef recipe secrets and upsell strategy.</p>
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




      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODAL: CONFIRM RESTAURANT OFFBOARDING                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
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
              <p className="text-[11px] text-slate-500 mt-1">
                Note: You can re-onboard this restaurant at any time from the Pune Restaurant Directory.
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

      {/* POS Integration Modal */}
      {isPosModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D1322] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 relative space-y-5 border border-white/[0.1] text-white">
            <button
              onClick={() => setIsPosModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#090D16]/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors z-10 border border-white/[0.08] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Provider Switcher inside modal */}
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-400">Kitchen & Billing Sync</span>
              <h3 className="text-xl font-bold font-serif text-white mt-0.5">Select Your Restaurant's POS System</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch adapters, configure connection credentials, and simulate live KOT dispatch to your thermal printer.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPosTab('petpooja');
                    updateRestaurant(restaurant.id, { pos_provider: 'petpooja' });
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedPosTab === 'petpooja'
                      ? 'bg-amber-500/15 border-amber-500/40 ring-1 ring-amber-400/40 text-amber-300'
                      : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-white">Petpooja</span>
                    <span className="text-[8px] uppercase px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold font-mono">50k+</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">REST API Bridge</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPosTab('royalpos');
                    updateRestaurant(restaurant.id, { pos_provider: 'royalpos' });
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedPosTab === 'royalpos'
                      ? 'bg-purple-500/15 border-purple-500/40 ring-1 ring-purple-400/40 text-purple-300'
                      : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-white">RoyalPOS</span>
                    <span className="text-[8px] uppercase px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold font-mono">Pune Local</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">LAN & Tablet POS</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPosTab('recaho');
                    updateRestaurant(restaurant.id, { pos_provider: 'recaho' });
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedPosTab === 'recaho'
                      ? 'bg-cyan-500/15 border-cyan-500/40 ring-1 ring-cyan-400/40 text-cyan-300'
                      : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-white">Recaho</span>
                    <span className="text-[8px] uppercase px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold font-mono">PCMC</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">Cloud GST & KOT</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPosTab('rancelab');
                    updateRestaurant(restaurant.id, { pos_provider: 'rancelab' });
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedPosTab === 'rancelab'
                      ? 'bg-emerald-500/15 border-emerald-500/40 ring-1 ring-emerald-400/40 text-emerald-300'
                      : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-white">RanceLab</span>
                    <span className="text-[8px] uppercase px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono">Fusion</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">Multi-Chain / Fine Dining</p>
                </button>
              </div>
            </div>

            {/* Active POS Panel */}
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
