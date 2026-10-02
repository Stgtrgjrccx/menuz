import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  QrCode,
  UtensilsCrossed,
  LayoutDashboard,
  ChefHat,
  TrendingUp,
  Sparkles,
  Compass,
  Bell,
  Menu,
  X,
  ChevronDown,
  Check,
  Trash2,
  ShieldCheck,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useRestaurantStore, isDishNameAsRestaurant } from '../store/restaurantStore';
import { isWorkingWithMenuz } from '../types';
import { SEED_RESTAURANTS } from '../data/seedData';
import { QrScannerModal } from './QrScannerModal';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const notifications = useRestaurantStore((state) => state.notifications);
  const markNotificationRead = useRestaurantStore((state) => state.markNotificationRead);
  const clearAllNotifications = useRestaurantStore((state) => state.clearAllNotifications);
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const rawRestaurants = useRestaurantStore((state) => state.restaurants);
  const restaurants = useMemo(
    () =>
      rawRestaurants.filter(
        (r) =>
          !isDishNameAsRestaurant(r) &&
          (SEED_RESTAURANTS.some((s) => s.id === r.id || s.slug === r.slug) || (r.location && r.cuisine))
      ),
    [rawRestaurants]
  );
  const setCurrentRestaurant = useRestaurantStore((state) => state.setCurrentRestaurant);
  const tables = useRestaurantStore((state) => state.tables);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const deviceViewMode = useRestaurantStore((state) => state.deviceViewMode);
  const setDeviceViewMode = useRestaurantStore((state) => state.setDeviceViewMode);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [venueDropdownOpen, setVenueDropdownOpen] = useState(false);
  const [quickNavOpen, setQuickNavOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const venueRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (venueRef.current && !venueRef.current.contains(event.target as Node)) {
        setVenueDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter active working demo restaurants
  const activeWorkingRestaurants = useMemo(() => {
    const filtered = restaurants.filter((r) => isWorkingWithMenuz(r));
    return filtered.length > 0 ? filtered : restaurants.slice(0, 2);
  }, [restaurants]);

  const currentRestTables = tables.filter((t) => t.restaurant_id === restaurant?.id);
  const defaultToken = currentRestTables[0]?.public_token || tables[0]?.public_token || 'table-token-01-saffron';
  const venueSlug = restaurant?.slug || 'saffron-house';
  const dinerUrl = `/r/${venueSlug}/menu?t=${defaultToken}`;

  const handleSelectRestaurant = (restaurantId: string) => {
    setCurrentRestaurant(restaurantId);
    setVenueDropdownOpen(false);
    const target = restaurants.find((r) => r.id === restaurantId);
    if (!target) return;

    if (location.pathname.startsWith('/r/')) {
      const restTables = tables.filter((t) => t.restaurant_id === target.id);
      const token = restTables[0]?.public_token || `table-token-01-${target.slug}`;
      navigate(`/r/${target.slug}/menu?t=${token}`);
    } else if (location.pathname.startsWith('/manage') || location.pathname.startsWith('/dashboard')) {
      navigate(`/manage/${target.slug}`);
    }
  };

  // Hide on diner table view for immersion
  if (location.pathname.startsWith('/r/') || location.pathname.startsWith('/menu/')) {
    return null;
  }

  const navLinks = [
    { to: '/', label: 'Explore Demos', exact: true },
    { to: dinerUrl, label: 'Table Menu' },
    { to: `/manage/${venueSlug}`, label: 'Floor Operations' },
    { to: '/kitchen', label: 'Kitchen KDS' },
    { to: '/pitch', label: 'Pitch Deck' },
  ];

  const isLinkActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    if (path.startsWith('/manage') && location.pathname.startsWith('/manage')) return true;
    if (path.startsWith('/kitchen') && location.pathname.startsWith('/kitchen')) return true;
    if (path.startsWith('/pitch') && location.pathname.startsWith('/pitch')) return true;
    return location.pathname === path;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0A0E17] border-b border-white/[0.08] text-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand + Clean Venue Switcher */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center font-black text-slate-950 text-base shadow-sm group-hover:scale-105 transition-transform">
                M
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-serif font-black text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors">
                    menuz
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                    OS
                  </span>
                </div>
              </div>
            </Link>

            {/* Subtle Divider */}
            <div className="hidden sm:block w-px h-5 bg-[#090D16]/[0.1]" />

            {/* Clean Venue Dropdown */}
            <div className="relative" ref={venueRef}>
              <button
                type="button"
                onClick={() => setVenueDropdownOpen(!venueDropdownOpen)}
                className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-[#090D16]/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] text-xs font-semibold text-slate-200 transition-all cursor-pointer"
                title="Switch active restaurant venue"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="max-w-[130px] sm:max-w-[160px] truncate">
                  {restaurant?.name || 'Saffron House'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${venueDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {venueDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-[#0F1523] border border-white/[0.12] rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/[0.06] mb-1">
                    Demo Venues (Pune)
                  </div>
                  {activeWorkingRestaurants.map((r) => {
                    const isSelected = r.id === restaurant?.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => handleSelectRestaurant(r.id)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-amber-500/15 text-amber-300 font-bold'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <div>
                          <div className="truncate">{r.name}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{r.cuisine}</div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Center: Clean Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = isLinkActive(link.to, link.exact);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-white/[0.1] text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2">

            {/* Always-Visible Admin Page Top Button */}
            <Link
              to="/admin"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm ${
                location.pathname === '/admin'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-amber-500/25 ring-1 ring-amber-400'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:border-amber-400/60'
              }`}
              title="Open Master Admin Control Hub"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin HQ</span>
            </Link>

            {/* Quick Access Portal Hub Button */}
            <button
              type="button"
              onClick={() => setQuickNavOpen(true)}
              className="p-2 rounded-lg bg-[#090D16]/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-medium"
              title="Open Quick Access Launcher"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Portals</span>
            </button>

            {/* Scan Table QR Button */}
            <button
              type="button"
              onClick={() => setIsQrScannerOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 active:scale-95 text-slate-950 text-xs font-bold shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-slate-950" />
              <span>Scan QR</span>
            </button>

            {/* Notifications Button */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                className={`p-2 rounded-lg transition-colors relative ${
                  notifOpen ? 'bg-white/[0.1] text-amber-400' : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute 1 top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0A0E17]" />
                )}
              </button>

              {/* Notification Panel */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0F1523] border border-white/[0.12] rounded-2xl shadow-2xl z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-bold text-white">Live System Alerts</h4>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded-full font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center space-x-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.04]">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No alerts right now. Table orders and waiter calls appear here.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 text-xs transition-colors flex items-start space-x-2.5 ${
                            notif.read ? 'opacity-60' : 'bg-white/[0.03]'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-200 font-medium leading-snug">{notif.message}</p>
                            <span className="text-[10px] text-slate-500 mt-1 block">
                              {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {!notif.read && (
                            <button
                              onClick={() => markNotificationRead(notif.id)}
                              className="text-[11px] text-amber-400 hover:text-amber-300 font-bold shrink-0"
                            >
                              Done
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05]"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0C111D] border-t border-white/[0.08] px-4 py-3 space-y-2">
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30"
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Master Admin HQ</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-xs font-medium ${
                  isLinkActive(link.to, link.exact)
                    ? 'bg-amber-500/15 text-amber-300 font-bold'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setQuickNavOpen(true);
                }}
                className="w-full py-2 px-3 rounded-lg bg-[#090D16]/[0.05] text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Open All Portals Launcher</span>
              </button>
            </div>
          </div>
        )}

        {/* Mobile Always-Visible Headings & Options Bar */}
        <div className="lg:hidden bg-[#070B12] border-t border-white/[0.08] px-2.5 py-2 overflow-x-auto flex items-center space-x-1.5 scrollbar-none touch-pan-x text-xs font-bold shadow-inner">
          <Link
            to="/admin"
            className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1 shrink-0 transition-colors ${
              location.pathname === '/admin'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin HQ</span>
          </Link>
          <Link
            to={dinerUrl}
            className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1 shrink-0 transition-colors ${
              location.pathname.startsWith('/r/') || location.pathname.startsWith('/menu/')
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'bg-white/[0.05] text-slate-300 hover:text-white border border-white/[0.08]'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
            <span>Table Menu</span>
          </Link>
          <Link
            to={`/manage/${venueSlug}`}
            className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1 shrink-0 transition-colors ${
              location.pathname.startsWith('/manage') || location.pathname.startsWith('/dashboard')
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'bg-white/[0.05] text-slate-300 hover:text-white border border-white/[0.08]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
            <span>Operations</span>
          </Link>
          <Link
            to="/kitchen"
            className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1 shrink-0 transition-colors ${
              location.pathname === '/kitchen'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'bg-white/[0.05] text-slate-300 hover:text-white border border-white/[0.08]'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5 text-amber-400" />
            <span>Kitchen KDS</span>
          </Link>
          <Link
            to="/pitch"
            className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1 shrink-0 transition-colors ${
              location.pathname === '/pitch'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'bg-white/[0.05] text-slate-300 hover:text-white border border-white/[0.08]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
            <span>Pitch Deck</span>
          </Link>
          <Link
            to="/"
            className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1 shrink-0 transition-colors ${
              location.pathname === '/'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'bg-white/[0.05] text-slate-300 hover:text-white border border-white/[0.08]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span>Explore</span>
          </Link>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* QUICK ACCESS LAUNCHER MODAL (Easy, Neat, Clean Navigation) */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {quickNavOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-[#0D1321] border border-white/[0.12] rounded-2xl shadow-2xl p-6 text-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="font-serif font-bold text-lg text-white">System Portals &amp; Demos</h3>
                <p className="text-xs text-slate-400 mt-0.5">Jump directly to any experience in 1 click.</p>
              </div>
              <button
                type="button"
                onClick={() => setQuickNavOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Category 1: Diner Table Experiences */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  1. Live Table Experiences (Diner View)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <Link
                    to="/r/saffron-house/menu?t=table-token-01-saffron"
                    onClick={() => setQuickNavOpen(false)}
                    className="p-3 rounded-xl bg-[#090D16]/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-amber-500/40 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                        Saffron House (Table 1)
                      </div>
                      <div className="text-[11px] text-slate-400">Dum Pukht Mughlai • AI Concierge</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </Link>

                  <Link
                    to="/r/casa-bella/menu?t=table-token-03-casa-bella"
                    onClick={() => setQuickNavOpen(false)}
                    className="p-3 rounded-xl bg-[#090D16]/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-amber-500/40 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                        Casa Bella (Table 3)
                      </div>
                      <div className="text-[11px] text-slate-400">Artisanal Italian • Pizza &amp; Wine</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </div>
              </div>

              {/* Category 2: Restaurant Operations */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  2. Operations &amp; Kitchen
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <Link
                    to="/manage/saffron-house"
                    onClick={() => setQuickNavOpen(false)}
                    className="p-3 rounded-xl bg-[#090D16]/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-amber-500/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <LayoutDashboard className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Floor Operations Hub</div>
                        <div className="text-[11px] text-slate-400">Table sessions &amp; waiter calls</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-all" />
                  </Link>

                  <Link
                    to="/kitchen"
                    onClick={() => setQuickNavOpen(false)}
                    className="p-3 rounded-xl bg-[#090D16]/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-amber-500/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <ChefHat className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Kitchen Display (KDS)</div>
                        <div className="text-[11px] text-slate-400">Live order tickets &amp; pacing</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-all" />
                  </Link>
                </div>
              </div>

              {/* Category 3: Executive Strategy & Platform Management */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  3. Executive &amp; Management
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <Link
                    to="/pitch"
                    onClick={() => setQuickNavOpen(false)}
                    className="p-3 rounded-xl bg-[#090D16]/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-500/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Executive Pitch Deck</div>
                        <div className="text-[11px] text-slate-400">19 Slides • Financials &amp; ROI</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-all" />
                  </Link>

                  <Link
                    to="/admin"
                    onClick={() => setQuickNavOpen(false)}
                    className="p-3 rounded-xl bg-[#090D16]/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-emerald-500/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Platform Admin Control</div>
                        <div className="text-[11px] text-slate-400">Pune registry &amp; table config</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-all" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
      />
    </>
  );
};
export default Navbar;
