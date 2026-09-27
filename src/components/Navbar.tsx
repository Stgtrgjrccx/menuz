import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChefHat, LayoutDashboard, ShieldCheck, Bell, Menu, X, Check, Trash2, Award, ShoppingBag, UtensilsCrossed, TrendingUp, Sparkles } from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { isWorkingWithMenuz } from '../types';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const notifications = useRestaurantStore((state) => state.notifications);
  const markNotificationRead = useRestaurantStore((state) => state.markNotificationRead);
  const clearAllNotifications = useRestaurantStore((state) => state.clearAllNotifications);
  
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const restaurant = useRestaurantStore((state) => state.restaurant);
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const setCurrentRestaurant = useRestaurantStore((state) => state.setCurrentRestaurant);
  const tables = useRestaurantStore((state) => state.tables);

  // Strictly filter restaurants working with Menuz
  const activeWorkingRestaurants = useMemo(() => {
    return restaurants.filter((r) => isWorkingWithMenuz(r));
  }, [restaurants]);

  const handleSelectRestaurant = (restaurantId: string) => {
    setCurrentRestaurant(restaurantId);
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
  const currentRestTables = tables.filter((t) => t.restaurant_id === restaurant?.id);
  const defaultToken = currentRestTables[0]?.public_token || tables[0]?.public_token || 'table-token-01-saffron';
  const dinerUrl = `/r/${restaurant?.slug || 'saffron-house'}/menu?t=${defaultToken}`;

  const navLinks = [
    { to: '/', label: 'Customer Home', icon: UtensilsCrossed },
    { to: '/admin', label: 'Master Admin', icon: ShieldCheck, highlight: true },
    { to: '/ai-studio', label: 'AI Bot Studio', icon: Sparkles },
    { to: '/pitch', label: 'Pitch Mode', icon: TrendingUp },
    { to: dinerUrl, label: 'Table Menu', icon: ShoppingBag },
    { to: `/manage/${restaurant?.slug || 'saffron-house'}`, label: 'Manager Hub', icon: LayoutDashboard },
    { to: '/kitchen', label: 'Kitchen KDS', icon: ChefHat },
  ];

  const isActive = (path: string) => {
    if (path.startsWith('/manage') && location.pathname.startsWith('/manage')) return true;
    if (path.startsWith('/r/') && location.pathname.startsWith('/r/')) return true;
    return location.pathname === path;
  };

  const formatTime = (iso: string) => {
    const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    return `${Math.floor(diffSec / 3600)}h ago`;
  };

  // 1. Hide completely on customer-facing routes and pitch presentation
  if (location.pathname.startsWith('/r/') || location.pathname === '/' || location.pathname === '/pitch') {
    return null;
  }

  // 2. Venue Operations Portal: Scoped strictly to the active restaurant (No Master Admin leakage)
  const isVenueOperations = location.pathname.startsWith('/manage') || location.pathname.startsWith('/kitchen') || location.pathname.startsWith('/ai-studio');

  if (isVenueOperations) {
    const venueName = restaurant?.name || 'Restaurant Hub';
    const venueSlug = restaurant?.slug || 'saffron-house';
    const venueDinerUrl = `/r/${venueSlug}/menu?t=${defaultToken}`;

    return (
      <nav className="bg-charcoal-900 text-white border-b border-charcoal-800 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Restaurant Brand Identity */}
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <div className="flex items-center space-x-1.5">
                <span className="font-serif font-bold text-sm text-white truncate max-w-[180px] sm:max-w-none">
                  {venueName}
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Operations Hub
                </span>
              </div>
            </div>

            {/* Venue Scoped Navigation Links */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Link
                to={`/manage/${venueSlug}`}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  location.pathname.startsWith('/manage')
                    ? 'bg-saffron-600 text-white shadow-xs'
                    : 'text-charcoal-300 hover:text-white hover:bg-charcoal-800'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Manager Hub</span>
              </Link>

              <Link
                to="/kitchen"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  location.pathname.startsWith('/kitchen')
                    ? 'bg-saffron-600 text-white shadow-xs'
                    : 'text-charcoal-300 hover:text-white hover:bg-charcoal-800'
                }`}
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kitchen KDS</span>
              </Link>

              <Link
                to="/ai-studio"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  location.pathname.startsWith('/ai-studio')
                    ? 'bg-amber-500 text-charcoal-950 shadow-xs'
                    : 'text-amber-400/90 hover:text-amber-300 hover:bg-charcoal-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Chef AI Studio</span>
              </Link>

              <a
                href={`#${venueDinerUrl}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-200 hover:text-white border border-charcoal-700 transition-all ml-1"
                title="Open live customer dining menu in a new tab"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-saffron-400" />
                <span className="hidden sm:inline">Live Diner Menu</span>
                <span className="sm:hidden">Diner</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // 3. Master Super Admin Portal (Full network oversight)
  const masterNavLinks = [
    { to: '/admin', label: 'Master Admin Hub', icon: ShieldCheck, highlight: true },
    { to: '/pitch', label: 'Pitch Deck', icon: TrendingUp },
    { to: `/manage/${restaurant?.slug || 'saffron-house'}`, label: 'Active Venue Hub', icon: LayoutDashboard },
    { to: '/kitchen', label: 'Kitchen KDS', icon: ChefHat },
    { to: '/ai-studio', label: 'Chef AI Studio', icon: Sparkles },
    { to: dinerUrl, label: 'Table Menu', icon: ShoppingBag }
  ];

  return (
    <nav className="bg-charcoal-900 text-white border-b border-charcoal-800 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo → links to Dashboard (/admin) */}
          <div className="flex items-center space-x-3">
            <Link
              to="/admin"
              className="flex items-center space-x-2 group"
              title="Go to Master Admin Dashboard"
            >
              <span className="font-serif font-bold text-base tracking-wide text-saffron-500 group-hover:text-saffron-400 transition-colors">
                Menuz HQ
              </span>
              <span className="text-[9px] text-amber-300 bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono hidden sm:inline font-bold">
                Master Control
              </span>
            </Link>

            {/* Quick Restaurant Hub Selector */}
            <div className="hidden sm:block">
              <select
                value={restaurant?.id || ''}
                onChange={(e) => handleSelectRestaurant(e.target.value)}
                className="bg-charcoal-800 text-saffron-400 hover:text-saffron-300 border border-charcoal-700 hover:border-saffron-500/50 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer max-w-[200px] truncate transition-colors"
                title="Super Admin: Switch Active Restaurant Hub"
              >
                {activeWorkingRestaurants.map((r) => (
                  <option key={r.id} value={r.id} className="bg-charcoal-900 text-white">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {masterNavLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? link.highlight
                        ? 'bg-saffron-600 text-white font-bold shadow-sm'
                        : 'bg-charcoal-700 text-white font-semibold'
                      : link.highlight
                        ? 'text-saffron-400 hover:text-white hover:bg-charcoal-800 border border-saffron-500/30'
                        : 'text-charcoal-300 hover:text-white hover:bg-charcoal-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Notification Bell with interactive dropdown */}
            <div className="relative ml-2" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                className={`relative p-1.5 rounded-lg transition-colors ${
                  notifOpen ? 'bg-charcoal-800 text-saffron-400' : 'text-charcoal-300 hover:text-white hover:bg-charcoal-800'
                }`}
                title="View System Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-charcoal-900 border border-charcoal-700 rounded-2xl shadow-float z-50 overflow-hidden text-left">
                  <div className="p-3.5 border-b border-charcoal-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-saffron-400" />
                      <h4 className="font-serif font-bold text-sm text-white">Live System Alerts</h4>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.2 rounded-full font-bold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] text-charcoal-400 hover:text-red-400 flex items-center space-x-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear All</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-charcoal-800/60">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-charcoal-400">
                        <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 text-charcoal-600" />
                        <p className="text-xs font-medium">All caught up!</p>
                        <p className="text-[10px] text-charcoal-500 mt-0.5">
                          Waiter requests, completed challenges, and customer orders appear here.
                        </p>
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        const isWaiter = notif.type === 'waiter_call';
                        const isChallenge = notif.type === 'challenge_complete';
                        const isOrder = notif.type === 'order_placed';

                        return (
                          <div
                            key={notif.id}
                            className={`p-3 transition-colors flex items-start space-x-3 ${
                              notif.read ? 'bg-charcoal-900/60' : 'bg-charcoal-800/80 border-l-2 border-saffron-500'
                            }`}
                          >
                            <div
                              className={`p-2 rounded-xl flex-shrink-0 ${
                                isWaiter
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : isChallenge
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}
                            >
                              {isWaiter && <Bell className="w-4 h-4" />}
                              {isChallenge && <Award className="w-4 h-4" />}
                              {isOrder && <ShoppingBag className="w-4 h-4" />}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-white leading-snug font-medium break-words">
                                {notif.message}
                              </p>
                              <div className="flex items-center justify-between mt-1 text-[10px] text-charcoal-400">
                                <span>{formatTime(notif.timestamp)}</span>
                                {!notif.read && (
                                  <button
                                    onClick={() => markNotificationRead(notif.id)}
                                    className="text-saffron-400 hover:text-saffron-300 flex items-center space-x-0.5"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Acknowledge</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Notification Bell (mobile) */}
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-1.5 text-charcoal-300 hover:text-white"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 text-charcoal-300 hover:text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-charcoal-900 border-t border-charcoal-800 px-4 pb-3 pt-2 space-y-2">
          {/* Mobile Restaurant Selector */}
          <div className="pb-2 border-b border-charcoal-800">
            <label className="text-[10px] uppercase font-bold text-saffron-400 block mb-1">
              Select Restaurant
            </label>
            <select
              value={restaurant?.id || ''}
              onChange={(e) => {
                handleSelectRestaurant(e.target.value);
                setMobileOpen(false);
              }}
              className="w-full bg-charcoal-800 text-saffron-300 border border-charcoal-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
            >
              {activeWorkingRestaurants.map((r) => (
                <option key={r.id} value={r.id} className="bg-charcoal-900 text-white">
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'bg-saffron-600 text-white font-bold'
                    : 'text-charcoal-300 hover:text-white hover:bg-charcoal-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};
