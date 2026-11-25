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
  ExternalLink,
  Gamepad2,
  Star,
  Building2
} from 'lucide-react';
import { useRestaurantStore, isDishNameAsRestaurant } from '../store/restaurantStore';
import { isWorkingWithMenuz } from '../types';
import { SEED_RESTAURANTS } from '../data/seedData';
import { QrScannerModal } from './QrScannerModal';
import { IS_OWNER_SITE, IS_CUSTOMER_SITE, getHqSiteUrl, getOwnerSiteUrl } from '../config/siteMode';

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

    if (location.pathname.startsWith('/r/') && location.pathname.includes('/menu')) {
      const restTables = tables.filter((t) => t.restaurant_id === target.id);
      const token = restTables[0]?.public_token || `table-token-01-${target.slug}`;
      navigate(`/r/${target.slug}/menu?t=${token}`);
    } else if (
      location.pathname.startsWith('/r/') ||
      location.pathname.startsWith('/restaurant') ||
      location.pathname.startsWith('/manage') ||
      location.pathname.startsWith('/dashboard')
    ) {
      navigate(`/r/${target.slug}`);
    }
  };

  // Hide on diner table view for immersion, and on Master HQ for dedicated standalone enterprise experience
  const isDinerMenuPage =
    (location.pathname.startsWith('/r/') && (location.pathname.includes('/menu') || location.pathname.split('/').length > 3)) ||
    location.pathname.startsWith('/menu/') ||
    location.pathname === '/menu';

  if (
    isDinerMenuPage ||
    location.pathname === '/admin' ||
    location.pathname === '/hq'
  ) {
    return null;
  }

  const navLinks = IS_OWNER_SITE
    ? [
        { to: '/', label: 'Floor Operations', exact: true },
        { to: '/kitchen', label: 'Kitchen KDS' },
        { to: '/ai-studio', label: 'Chef Studio' },
      ]
    : [];

  const isLinkActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    if (path === '/menu' && (location.pathname === '/menu' || (location.pathname.startsWith('/r/') && location.pathname.includes('/menu')))) return true;
    if (
      path === '/manage' &&
      (location.pathname === '/manage' ||
        location.pathname.startsWith('/manage/') ||
        location.pathname.startsWith('/restaurant') ||
        (location.pathname.startsWith('/r/') && !location.pathname.includes('/menu')))
    )
      return true;
    if (path.startsWith('/kitchen') && location.pathname.startsWith('/kitchen')) return true;
    return location.pathname === path;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-black/[0.08] text-[#141414] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand + Clean Venue Switcher */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#F4511E] to-[#F4511E] flex items-center justify-center font-black text-[#FFFFFF] text-base shadow-sm group-hover:scale-105 transition-transform">
                M
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-serif font-black text-lg tracking-tight text-[#141414] group-hover:text-[#2D4A3E] transition-colors">
                    menuz
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#F4511E]/10 text-[#2D4A3E] border border-[#F4511E]/20 font-bold">
                    {IS_OWNER_SITE ? 'RESTAURANT' : 'CUSTOMER'}
                  </span>
                </div>
              </div>
            </Link>

            {/* Clean Venue Dropdown (Owner Only) */}
            {IS_OWNER_SITE && (
              <>
                <div className="hidden sm:block w-px h-5 bg-[#FFFFFF]/[0.1]" />
                <div className="relative" ref={venueRef}>
                  <button
                    type="button"
                    onClick={() => setVenueDropdownOpen(!venueDropdownOpen)}
                    className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-[#FFFFFF]/[0.04] hover:bg-black/[0.04] border border-black/[0.08] hover:border-black/[0.15] text-xs font-semibold text-[#3A3A3A] transition-all cursor-pointer"
                    title="Switch active restaurant venue"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="max-w-[130px] sm:max-w-[160px] truncate">
                      {restaurant?.name || 'Saffron House'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#6E6E6E] transition-transform ${venueDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {venueDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-64 bg-[#FFFFFF] border border-black/[0.12] rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6E6E6E] border-b border-black/[0.06] mb-1">
                        Active Partner Outlets
                      </div>
                      {activeWorkingRestaurants.map((r) => {
                        const isSelected = r.id === restaurant?.id;
                        return (
                          <button
                            key={r.id}
                            onClick={() => handleSelectRestaurant(r.id)}
                            className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-[#F4511E]/15 text-[#2D4A3E] font-bold'
                                : 'text-[#4A4A4A] hover:bg-black/[0.04] hover:text-[#141414]'
                            }`}
                          >
                            <div>
                              <div className="truncate">{r.name}</div>
                              <div className="text-[10px] text-[#7A7A7A] font-normal">{r.cuisine}</div>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#2D4A3E]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
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
                      ? 'bg-black/[0.04] text-[#141414] font-semibold'
                      : 'text-[#6E6E6E] hover:text-[#3A3A3A] hover:bg-black/[0.04]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2">

            {/* Quick Access Portal Hub Button (Owner Only) */}
            {IS_OWNER_SITE && (
              <button
                type="button"
                onClick={() => setQuickNavOpen(true)}
                className="p-2 rounded-lg bg-[#FFFFFF]/[0.04] hover:bg-black/[0.04] border border-black/[0.08] text-[#4A4A4A] hover:text-[#141414] transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-medium"
                title="Open Quick Access Launcher"
              >
                <Compass className="w-4 h-4 text-[#2D4A3E]" />
                <span className="hidden sm:inline">Portals</span>
              </button>
            )}


            {/* Scan Table QR Button */}
            <button
              type="button"
              onClick={() => setIsQrScannerOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#F4511E] to-[#F4511E] hover:brightness-110 active:scale-95 text-[#FFFFFF] text-xs font-bold shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-[#141414]" />
              <span>Scan QR</span>
            </button>

            {/* Notifications Button (Owner & HQ Ops Only - Never visible on Customer Pages) */}
            {!IS_CUSTOMER_SITE && (
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifOpen(!notifOpen)}
                  className={`p-2 rounded-lg transition-colors relative ${
                    notifOpen ? 'bg-black/[0.04] text-[#2D4A3E]' : 'text-[#6E6E6E] hover:text-[#141414] hover:bg-black/[0.04]'
                  }`}
                  title="System Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute 1 top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#E3E0DA]" />
                  )}
                </button>

                {/* Notification Panel */}
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FFFFFF] border border-black/[0.12] rounded-2xl shadow-2xl z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="p-3.5 border-b border-black/[0.08] flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4 text-[#2D4A3E]" />
                        <h4 className="text-xs font-bold text-[#141414]">Live System Alerts</h4>
                        {unreadCount > 0 && (
                          <span className="text-[10px] bg-rose-500/20 text-[#C23A1C] px-1.5 py-0.2 rounded-full font-bold">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearAllNotifications}
                          className="text-[11px] text-[#6E6E6E] hover:text-[#C23A1C] flex items-center space-x-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Clear</span>
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-black/[0.04]">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-[#6E6E6E] text-xs">
                          No alerts right now. Table orders and waiter calls appear here.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3 text-xs transition-colors flex items-start space-x-2.5 ${
                              notif.read ? 'opacity-60' : 'bg-black/[0.04]'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-[#3A3A3A] font-medium leading-snug">{notif.message}</p>
                              <span className="text-[10px] text-[#7A7A7A] mt-1 block">
                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            {!notif.read && (
                              <button
                                onClick={() => markNotificationRead(notif.id)}
                                className="text-[11px] text-[#2D4A3E] hover:text-[#2D4A3E] font-bold shrink-0"
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
            )}

            {/* Main Three-Lines Menu Button (Top Right) */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[#4A4A4A] hover:text-[#141414] rounded-xl bg-black/[0.04] hover:bg-black/[0.04] border border-black/[0.08] transition-colors cursor-pointer"
              title="Open Navigation Menu"
            >
              {mobileOpen ? <X className="w-5 h-5 text-[#2D4A3E]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Full Navigation Drawer from the Three Lines Menu Button */}
        {mobileOpen && (
          <div className="bg-[#FFFFFF] border-t border-black/[0.08] px-4 py-4 space-y-3 shadow-2xl animate-in fade-in slide-in-from-top-2">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7A7A7A] px-2">
              Menu &amp; Main Headings
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* 1. Explore Pune Restaurants */}
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl bg-black/[0.04] hover:bg-black/[0.04] text-[#3A3A3A] hover:text-[#141414] transition-all border border-black/[0.06]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F4511E]/15 border border-[#F4511E]/30 flex items-center justify-center text-[#2D4A3E]">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#141414]">Explore Pune Restaurants</div>
                  <div className="text-[10px] text-[#6E6E6E]">Browse verified menus &amp; dining venues</div>
                </div>
              </Link>

              {/* 2. Scan Table QR Code */}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setIsQrScannerOpen(true);
                }}
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl bg-emerald-950/30 hover:bg-emerald-950/50 text-[#3A3A3A] hover:text-[#141414] transition-all border border-emerald-500/30 cursor-pointer text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#2F7A4F]">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#141414]">Scan Table QR Code</div>
                  <div className="text-[10px] text-[#6E6E6E]">Instant app-free dining ordering</div>
                </div>
              </button>

              {/* 3. Play Table Arcade Games (Moved to bottom last) */}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  window.dispatchEvent(new CustomEvent('open-table-arcade'));
                }}
                className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl bg-[#F4511E]/20 hover:bg-[#F4511E]/30 text-[#3A3A3A] hover:text-[#141414] transition-all border border-[#F4511E]/30 cursor-pointer text-left sm:col-span-2"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F4511E]/20 border border-[#F4511E]/40 flex items-center justify-center text-[#2D4A3E]">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#2D4A3E] flex items-center space-x-1.5">
                    <span>Play Table Games</span>
                    <span className="text-[9px] bg-[#F4511E]/30 text-[#2D4A3E] px-1.5 py-0.2 rounded font-mono font-black">ARCADE</span>
                  </div>
                  <div className="text-[10px] text-[#6E6E6E]">Crossword, Solitaire, Trivia &amp; Bill Roulette</div>
                </div>
              </button>
            </div>

            {/* Separator: Partner Portals */}
            <div className="pt-2.5 border-t border-black/[0.08] space-y-1.5">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7A7A7A] px-2">
                Merchant &amp; HQ Systems
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={getOwnerSiteUrl('')}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-black/[0.04] hover:bg-black/[0.04] text-[#4A4A4A] hover:text-[#141414] border border-black/[0.06] text-xs font-semibold"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#2D4A3E]" />
                  <span className="truncate">Partner Portal</span>
                </a>

                <a
                  href={getHqSiteUrl('')}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-black/[0.04] hover:bg-black/[0.04] text-[#4A4A4A] hover:text-[#141414] border border-black/[0.06] text-xs font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2D4A3E]" />
                  <span className="truncate">Master Admin HQ</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* QUICK ACCESS LAUNCHER MODAL (Owner Only)                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {quickNavOpen && IS_OWNER_SITE && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-[#F5F1E8] border border-black/[0.12] rounded-2xl shadow-2xl p-6 text-[#141414] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.08]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#141414]">System Portals &amp; Demos</h3>
                <p className="text-xs text-[#6E6E6E] mt-0.5">Jump directly to any experience in 1 click.</p>
              </div>
              <button
                type="button"
                onClick={() => setQuickNavOpen(false)}
                className="p-1.5 rounded-lg text-[#6E6E6E] hover:text-[#141414] hover:bg-black/[0.04]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Category 1: Diner Table Experiences */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6E6E]">
                  1. Live Table Experiences (Diner View)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <Link
                    to="/r/saffron-house/menu?t=table-token-01-saffron"
                    onClick={() => setQuickNavOpen(false)}
                    className="p-3 rounded-xl bg-[#FFFFFF]/[0.04] hover:bg-black/[0.04] border border-black/[0.08] hover:border-[#F4511E]/40 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#141414] group-hover:text-[#2D4A3E] transition-colors">
                        Saffron House (Table 1)
                      </div>
                      <div className="text-[11px] text-[#6E6E6E]">Dum Pukht Mughlai • AI Concierge</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7A7A7A] group-hover:text-[#2D4A3E] group-hover:translate-x-0.5 transition-all" />
                  </Link>

                  <Link
                    to="/r/casa-bella/menu?t=table-token-03-casa-bella"
                    onClick={() => setQuickNavOpen(false)}
                    className="p-3 rounded-xl bg-[#FFFFFF]/[0.04] hover:bg-black/[0.04] border border-black/[0.08] hover:border-[#F4511E]/40 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#141414] group-hover:text-[#2D4A3E] transition-colors">
                        Casa Bella (Table 3)
                      </div>
                      <div className="text-[11px] text-[#6E6E6E]">Artisanal Italian • Pizza &amp; Wine</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7A7A7A] group-hover:text-[#2D4A3E] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </div>
              </div>

              {/* Category 2: Restaurant Operations */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6E6E]">
                  2. Operations &amp; Kitchen
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <Link
                    to="/manage/saffron-house"
                    onClick={() => setQuickNavOpen(false)}
                    className="p-3 rounded-xl bg-[#FFFFFF]/[0.04] hover:bg-black/[0.04] border border-black/[0.08] hover:border-[#F4511E]/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <LayoutDashboard className="w-4 h-4 text-[#2D4A3E]" />
                      <div>
                        <div className="text-xs font-bold text-[#141414]">Floor Operations Hub</div>
                        <div className="text-[11px] text-[#6E6E6E]">Table sessions &amp; waiter calls</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7A7A7A] group-hover:text-[#2D4A3E] transition-all" />
                  </Link>

                  <Link
                    to="/kitchen"
                    onClick={() => setQuickNavOpen(false)}
                    className="p-3 rounded-xl bg-[#FFFFFF]/[0.04] hover:bg-black/[0.04] border border-black/[0.08] hover:border-[#F4511E]/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <ChefHat className="w-4 h-4 text-[#2D4A3E]" />
                      <div>
                        <div className="text-xs font-bold text-[#141414]">Kitchen Display (KDS)</div>
                        <div className="text-[11px] text-[#6E6E6E]">Live order tickets &amp; pacing</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7A7A7A] group-hover:text-[#2D4A3E] transition-all" />
                  </Link>
                </div>
              </div>

              {/* Category 3: Culinary & Menu Studio */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6E6E]">
                  3. Menu &amp; AI Studio
                </span>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  <Link
                    to="/ai-studio"
                    onClick={() => setQuickNavOpen(false)}
                    className="p-3 rounded-xl bg-[#FFFFFF]/[0.04] hover:bg-black/[0.04] border border-black/[0.08] hover:border-[#F4511E]/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Sparkles className="w-4 h-4 text-[#2D4A3E]" />
                      <div>
                        <div className="text-xs font-bold text-[#141414]">Chef &amp; Owner Culinary Studio</div>
                        <div className="text-[11px] text-[#6E6E6E]">Tasting notes, heat calibration &amp; pairings</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7A7A7A] group-hover:text-[#2D4A3E] transition-all" />
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
