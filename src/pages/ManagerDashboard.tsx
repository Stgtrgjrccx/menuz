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
  ShieldCheck
} from 'lucide-react';
import { useRestaurantStore, isDishNameAsRestaurant } from '../store/restaurantStore';
import { SEED_RESTAURANTS } from '../data/seedData';
import { PetpoojaConfig, RoyalPosConfig, RecahoConfig, RancelabConfig } from '../types';
import { PetpoojaIntegrationPanel } from '../components/PetpoojaIntegrationPanel';
import { RoyalPosIntegrationPanel } from '../components/RoyalPosIntegrationPanel';
import { RecahoIntegrationPanel } from '../components/RecahoIntegrationPanel';
import { RancelabIntegrationPanel } from '../components/RancelabIntegrationPanel';
import { TableManagementModal } from '../components/TableManagementModal';
import { AiAssistantDrawer } from '../components/AiAssistantDrawer';
import { ChefOwnerQuestionnaireModal } from '../components/ChefOwnerQuestionnaireModal';
import { RestaurantLaunchKitModal } from '../components/RestaurantLaunchKitModal';
import { SmartOperationsSettingsModal } from '../components/SmartOperationsSettingsModal';
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
  const notifications = useRestaurantStore((state) => state.notifications);
  const markNotificationRead = useRestaurantStore((state) => state.markNotificationRead);
  const resetToDefaults = useRestaurantStore((state) => state.resetToDefaults);
  const updateRestaurant = useRestaurantStore((state) => state.updateRestaurant);

  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isLaunchKitOpen, setIsLaunchKitOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isOffboardModalOpen, setIsOffboardModalOpen] = useState(false);
  const [smartSettingsTab, setSmartSettingsTab] = useState<'kot' | 'happy_hour' | 'instagram' | 'pairings' | null>(null);
  const [selectedPosTab, setSelectedPosTab] = useState<'petpooja' | 'royalpos' | 'recaho' | 'rancelab'>(
    (restaurant.pos_provider as any) || 'petpooja'
  );

  const deviceViewMode = useRestaurantStore((state) => state.deviceViewMode);
  const setDeviceViewMode = useRestaurantStore((state) => state.setDeviceViewMode);

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
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden bg-[#090D16] text-slate-100 p-3 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-5 sm:space-y-6 pb-20 ${deviceViewMode === 'phone' ? 'max-w-md border-x border-white/[0.08] shadow-2xl' : ''}`}>
      {/* Top Quick Navigation Bar with Admin HQ button & Minimalist View Switcher */}
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

        {/* Minimalist Phone / Mac Switcher & Refresh */}
        <div className="flex items-center space-x-1.5">
          <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-white/[0.1] text-xs font-bold">
            <button
              type="button"
              onClick={() => setDeviceViewMode('phone')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1 ${
                deviceViewMode === 'phone'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to Phone layout"
            >
              <span>📱 Phone</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceViewMode('mac')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1 ${
                deviceViewMode === 'mac'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to Mac layout"
            >
              <span>💻 Mac</span>
            </button>
          </div>

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
          <button onClick={() => setUsbPrintStatus(null)} className="text-blue-400 hover:text-blue-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Bar */}
      <header className="flex flex-wrap justify-between items-center pb-5 border-b border-white/[0.08] gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold font-mono tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Active Venue Hub
            </span>
            <span className="text-xs text-slate-400 font-medium">Operational Console</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">{restaurant.name}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLaunchKitOpen(true)}
            className="flex items-center space-x-1.5 text-xs text-slate-950 bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 px-3.5 py-2.5 rounded-xl shadow-sm transition-all font-bold cursor-pointer"
            title="View & Share Guest Links, Table QR Codes, WhatsApp Handover & Custom Domain"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-950" />
            <span>📲 Links & Table QRs</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTableModalOpen(true)}
            className="flex items-center space-x-1.5 text-xs text-slate-200 bg-[#090D16]/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3.5 py-2.5 rounded-xl shadow-sm transition-all font-semibold cursor-pointer"
            title="Manage Tables, Floor Plan, Capacity, and Edit Restaurant Profile"
          >
            <span className="text-sm">🪑</span>
            <span>Floor Plan & Tables</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAiDrawerOpen(true)}
            className="flex items-center space-x-1.5 text-xs text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 px-3.5 py-2.5 rounded-xl shadow-sm transition-colors font-semibold cursor-pointer"
          >
            <span className="text-sm">🧑‍🍳</span>
            <span>Test Chef's AI</span>
          </button>

          <Link
            to={`/r/${restaurant.slug}/menu?t=${activeTablesList[0]?.public_token || 'table-token-01-saffron'}`}
            className="flex items-center space-x-1.5 text-xs text-slate-200 bg-[#090D16]/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3.5 py-2.5 rounded-xl shadow-sm transition-colors font-semibold"
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
            <span>Launch Diner Menu</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsOffboardModalOpen(true)}
            className="flex items-center space-x-1.5 text-xs text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-600 px-3.5 py-2.5 rounded-xl shadow-sm transition-all font-semibold cursor-pointer"
            title={`Offboard ${restaurant.name} from Menuz`}
          >
            <UserMinus className="w-3.5 h-3.5" />
            <span>Offboard Venue</span>
          </button>

          <button
            type="button"
            onClick={resetToDefaults}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white bg-[#090D16]/[0.03] hover:bg-white/[0.06] border border-white/[0.06] px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo</span>
          </button>
        </div>
      </header>

      {/* 🚨 LIVE URGENT SERVICE ALERTS (RATING BELOW 4 STARS) */}
      {unreadServiceAlerts.length > 0 && (
        <div className="bg-rose-950/30 border border-rose-500/40 rounded-2xl p-5 shadow-lg animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-90"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
              </span>
              <div>
                <h3 className="font-serif font-bold text-base text-rose-200 flex items-center space-x-2">
                  <span>🚨 Urgent Guest Assistance Required</span>
                  <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded-full font-sans">
                    {unreadServiceAlerts.length} Table{unreadServiceAlerts.length > 1 ? 's' : ''} (Rating &lt; 4★)
                  </span>
                </h3>
                <p className="text-xs text-rose-300/80">
                  Guest rated below 4 stars. Manager or team member must attend the table immediately to resolve!
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {unreadServiceAlerts.map((notif) => (
              <div
                key={notif.id}
                className="bg-[#0D1322] p-4 rounded-xl border border-rose-500/40 shadow-md flex flex-col justify-between space-y-2.5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800/60">
                      Immediate Action
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Floor Alert</span>
                  </div>
                  <p className="font-serif font-bold text-base text-white mt-1">
                    {notif.table_label || 'Customer Table'}
                  </p>
                  <p className="text-xs text-slate-300 mt-1 leading-snug font-medium">
                    {notif.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => markNotificationRead(notif.id)}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>✓ Attending Table Now</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Waiter Calls Alert Banner */}
      {unreadWaiterCalls.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
              </span>
              <h3 className="font-serif font-bold text-base text-white">
                Active Waiter Assistance Calls ({unreadWaiterCalls.length})
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {unreadWaiterCalls.map((notif) => (
              <div
                key={notif.id}
                className="bg-[#0D1322] p-3.5 rounded-xl border border-amber-500/30 shadow-sm flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 block font-mono">Table Request</span>
                  <p className="font-serif font-bold text-sm text-white">
                    {notif.table_label || 'Customer Table'}
                  </p>
                  <p className="text-[10px] text-slate-400">Assistance Requested</p>
                </div>
                <button
                  type="button"
                  onClick={() => markNotificationRead(notif.id)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Attend
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ⚡ SMART OPERATIONS, DIRECT KOT & GROWTH ENGINE             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="bg-[#0D1322] rounded-2xl border border-white/[0.08] p-6 shadow-xl space-y-5">
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
              Configure optional direct kitchen routing, direct restaurant access control, dynamic surge pricing, and viral Instagram story cards.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSmartSettingsTab('kot')}
            className="px-4 py-2 bg-[#090D16]/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>⚙️ Configure All Smart Options</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 1. Direct-to-Kitchen KOT Auto-Dispatch */}
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

              <div className="mt-2.5 p-2 bg-[#090D16]/[0.03] rounded-xl border border-white/[0.06] text-[10px] space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold text-slate-400">Station:</span>
                  <span className="truncate max-w-[90px] font-mono text-white">
                    {restaurant.direct_kitchen_kot_config?.station_name || 'Main Kitchen'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold text-slate-400">Buffer:</span>
                  <span className="font-mono text-amber-400">
                    {restaurant.direct_kitchen_kot_config?.auto_dispatch_delay_seconds ? `${restaurant.direct_kitchen_kot_config.auto_dispatch_delay_seconds}s` : 'Instant 0s'}
                  </span>
                </div>
              </div>
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

              <button
                type="button"
                onClick={() => setSmartSettingsTab('kot')}
                className="w-full py-1.5 px-2 rounded-xl text-[10px] font-semibold text-slate-300 bg-[#090D16]/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Settings className="w-3 h-3 text-slate-400" />
                <span>Edit Parameters</span>
              </button>
            </div>
          </div>

          {/* 2. Smart Happy Hour & Dynamic Pricing */}
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

              <div className="mt-2.5 p-2 bg-[#090D16]/[0.03] rounded-xl border border-white/[0.06] text-[10px] space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold text-slate-400">Time:</span>
                  <span className="font-mono text-white">
                    {restaurant.happy_hour_config?.start_time || '16:00'} - {restaurant.happy_hour_config?.end_time || '19:30'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold text-slate-400">Surge Mode:</span>
                  <span className="font-mono text-amber-400">
                    {restaurant.happy_hour_config?.surge_pricing_enabled ? `+${restaurant.happy_hour_config.surge_markup_percent || 10}% Surge` : 'Off'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  const isCurrentlyEnabled = !restaurant.happy_hour_config?.enabled;
                  updateRestaurant(restaurant.id, {
                    happy_hour_config: {
                      enabled: !isCurrentlyEnabled,
                      start_time: '16:00',
                      end_time: '19:30',
                      discount_percent: 20,
                      banner_label: '⚡ Twilight Happy Hour: 20% Off Beverages & Small Bites!'
                    }
                  });
                }}
                className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center space-x-1 shadow-sm cursor-pointer ${
                  restaurant.happy_hour_config?.enabled
                    ? 'bg-orange-600 hover:bg-orange-500 text-white'
                    : 'bg-white/[0.08] hover:bg-white/[0.12] text-white'
                }`}
              >
                <span>{restaurant.happy_hour_config?.enabled ? '✓ Running' : 'Turn On'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSmartSettingsTab('happy_hour')}
                className="w-full py-1.5 px-2 rounded-xl text-[10px] font-semibold text-slate-300 bg-[#090D16]/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Settings className="w-3 h-3 text-slate-400" />
                <span>Edit Schedule</span>
              </button>
            </div>
          </div>

          {/* 4. Instagram Story Brand Studio */}
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
                9:16 vertical story generator with dish photos, table stamp, and 1-tap caption copy.
              </p>

              <div className="mt-2.5 p-2 bg-[#090D16]/[0.03] rounded-xl border border-white/[0.06] text-[10px] space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold text-slate-400">Handle:</span>
                  <span className="font-mono text-white truncate max-w-[85px]">
                    {restaurant.instagram_config?.handle || restaurant.instagram_handle || `@${restaurant.slug.replace(/-/g, '_')}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold text-slate-400">Badge:</span>
                  <span className="truncate max-w-[85px] text-white">
                    {restaurant.instagram_config?.reward_badge_text || '5-Star Night'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSmartSettingsTab('instagram')}
              className="w-full py-2 px-2 rounded-xl text-[11px] font-semibold text-slate-200 bg-[#090D16]/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Settings className="w-3 h-3 text-pink-400" />
              <span>Customize Story Card</span>
            </button>
          </div>

          {/* 5. Smart Upsell Pairings */}
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
                Recommends matching wine, desserts, and sides inside diner's cart before checkout.
              </p>

              <div className="mt-2.5 p-2 bg-[#090D16]/[0.03] rounded-xl border border-white/[0.06] text-[10px] space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold text-slate-400">Section:</span>
                  <span className="truncate max-w-[90px] text-white">
                    {restaurant.smart_pairings_config?.badge_text || "Chef's Pairings"}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold text-slate-400">Bundle Deal:</span>
                  <span className="font-mono text-amber-400">
                    {restaurant.smart_pairings_config?.discount_percent ? `${restaurant.smart_pairings_config.discount_percent}% Off` : 'Regular'}
                  </span>
                </div>
              </div>
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

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0D1322] p-5 rounded-2xl border border-white/[0.08] shadow-lg flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-sm">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Session Revenue</span>
            <p className="font-serif text-2xl font-bold text-white">₹{totalVolume.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-[#0D1322] p-5 rounded-2xl border border-white/[0.08] shadow-lg flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-sm">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Orders Placed</span>
            <p className="font-serif text-2xl font-bold text-white">{totalOrdersCount} tickets</p>
          </div>
        </div>

        <div className="bg-[#0D1322] p-5 rounded-2xl border border-white/[0.08] shadow-lg flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-sm">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Active QR Tables</span>
            <p className="font-serif text-2xl font-bold text-white">{activeTablesList.length} tables</p>
          </div>
        </div>
      </div>

      {/* 🧑‍🍳 CHEF & OWNER AI KNOWLEDGE HUB & KOT ENGINE */}
      <section className="bg-gradient-to-br from-[#090D16] via-[#090D16] to-[#090D16] text-white p-6 rounded-3xl border border-white/[0.08]  space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-2xl shadow-md">
              🧑‍🍳
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif text-xl font-bold text-white">Chef &amp; Owner AI Knowledge Hub</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live on Table QRs
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Your dining concierge is trained directly on your head chef's recipes &amp; owner's upselling strategy — not generic LLM web text.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsAiDrawerOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate AI Chat as Diner</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Head Chef Training Box */}
          <div className="bg-[#090D16]/90 border border-white/[0.08] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-base">🧑‍🍳</span>
                <h3 className="font-serif font-bold text-sm text-white">Head Chef Culinary Profile</h3>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                Chef Sanjeev
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start space-x-2 bg-[#090D16] p-2.5 rounded-xl border border-white/[0.08]/60">
                <span className="text-amber-400 font-bold">✓</span>
                <div>
                  <strong className="text-white block">Calibrated 1–5 Spice Index:</strong>
                  <span>Every curry &amp; starter has verified heat notes so diners never get unpleasantly surprised.</span>
                </div>
              </div>
              <div className="flex items-start space-x-2 bg-[#090D16] p-2.5 rounded-xl border border-white/[0.08]/60">
                <span className="text-amber-400 font-bold">✓</span>
                <div>
                  <strong className="text-white block">Secret Recipe Preparation Notes:</strong>
                  <span>White butter simmering, clay tandoor smoking, and signature marination secrets are explained seamlessly.</span>
                </div>
              </div>
              <div className="flex items-start space-x-2 bg-[#090D16] p-2.5 rounded-xl border border-white/[0.08]/60">
                <span className="text-amber-400 font-bold">✓</span>
                <div>
                  <strong className="text-white block">Kitchen Allergen Guard:</strong>
                  <span>Strict warnings for nuts, dairy, and gluten with cross-contamination guidelines.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Owner Upsell Box */}
          <div className="bg-[#090D16]/90 border border-white/[0.08] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-base">💼</span>
                <h3 className="font-serif font-bold text-sm text-white">Owner Upsell &amp; Hospitality Rules</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                Owner Rohit
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start space-x-2 bg-[#090D16] p-2.5 rounded-xl border border-white/[0.08]/60">
                <span className="text-emerald-400 font-bold">✓</span>
                <div>
                  <strong className="text-white block">High-Margin Beverage Pairing:</strong>
                  <span>Automatically recommends signature coolers (Kokum Mint Cooler, Mango Lassi) with rich curries (+18% bill size).</span>
                </div>
              </div>
              <div className="flex items-start space-x-2 bg-[#090D16] p-2.5 rounded-xl border border-white/[0.08]/60">
                <span className="text-emerald-400 font-bold">✓</span>
                <div>
                  <strong className="text-white block">Bread Basket Suggestions:</strong>
                  <span>Prompts crispy Garlic Butter Naan and Amritsari Kulcha with every main course gravy.</span>
                </div>
              </div>
              <div className="flex items-start space-x-2 bg-[#090D16] p-2.5 rounded-xl border border-white/[0.08]/60">
                <span className="text-emerald-400 font-bold">✓</span>
                <div>
                  <strong className="text-white block">Post-Meal Google Review Incentive:</strong>
                  <span>Coordinates with the surprise table reward challenge to convert happy diners into 5-star reviews.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Minute KOT Self-Serve Connectivity Strip */}
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-purple-500/20 border border-amber-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-sm text-white">Universal Kitchen KOT Bridge: Active</h4>
                <span className="text-[10px] font-mono uppercase bg-black/40 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  {restaurant.pos_provider || 'Petpooja'} Configured
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Orders fire directly to your kitchen thermal printer in &lt;1 second. Connect to any new restaurant in 2 minutes without coding.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsPosModalOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>POS & Thermal Printer Settings</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>




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
    </div>
  );
};
