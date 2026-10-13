import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Bell,
  ExternalLink,
  ChevronDown,
  Check,
  Trash2,
  LogOut,
  Sparkles,
  BarChart3,
  QrCode
} from 'lucide-react';
import { useRestaurantStore, isValidRestaurantRecord } from '../../store/restaurantStore';
import { getCustomerSiteUrl } from '../../config/siteMode';

export const HqNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const notifications = useRestaurantStore((state) => state.notifications);
  const markNotificationRead = useRestaurantStore((state) => state.markNotificationRead);
  const clearAllNotifications = useRestaurantStore((state) => state.clearAllNotifications);
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const rawRestaurants = useRestaurantStore((state) => state.restaurants);
  const setCurrentRestaurant = useRestaurantStore((state) => state.setCurrentRestaurant);

  const restaurants = useMemo(
    () => rawRestaurants.filter(isValidRestaurantRecord),
    [rawRestaurants]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;
  const [notifOpen, setNotifOpen] = useState(false);
  const [venueDropdownOpen, setVenueDropdownOpen] = useState(false);

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

  const handleSelectRestaurant = (restaurantId: string) => {
    setCurrentRestaurant(restaurantId);
    setVenueDropdownOpen(false);
    const target = restaurants.find((r) => r.id === restaurantId);
    if (!target) return;
    navigate(`/r/${target.slug}`);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('menuz_admin_session');
    } catch (e) {}
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#090D16]/95 backdrop-blur-md border-b border-white/[0.08] px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: HQ Brand & Badges */}
        <div className="flex items-center space-x-3">
          <Link
            to="/admin"
            className="flex items-center space-x-2.5 group focus:outline-none"
            title="Menuz Master Admin HQ"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 p-0.5 shadow-md shadow-amber-500/20 group-hover:shadow-amber-500/30 transition-all flex items-center justify-center">
              <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
                <span className="font-serif font-black text-transparent bg-clip-text bg-gradient-to-tr from-amber-400 to-amber-200 text-lg">
                  M
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black tracking-tight text-white text-base">MENUZ</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  HQ
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Master Platform Governance &amp; Partner Network
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Restaurant Quick Switcher */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="relative" ref={venueRef}>
            <button
              type="button"
              onClick={() => setVenueDropdownOpen(!venueDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] text-xs font-semibold text-slate-200 transition-all cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="max-w-[160px] truncate">{restaurant?.name || 'Select Restaurant'}</span>
              <span className="text-[10px] text-amber-400 font-mono px-1.5 py-0.5 rounded bg-amber-400/10">
                {restaurants.length} active
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${venueDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {venueDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 max-h-80 overflow-y-auto rounded-2xl bg-[#0D1322] border border-white/[0.1] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/[0.06] mb-1">
                  Active Venues ({restaurants.length})
                </div>
                {restaurants.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelectRestaurant(r.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                      r.id === restaurant?.id
                        ? 'bg-amber-500/15 text-amber-300 font-semibold'
                        : 'text-slate-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="truncate">{r.name}</span>
                    {r.id === restaurant?.id && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {/* External Link to Customer Site */}
          <a
            href={getCustomerSiteUrl('')}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold transition-all"
            title="Open Customer Discovery Portal in new tab"
          >
            <span>Customer Portal</span>
            <ExternalLink className="w-3 h-3 text-indigo-400" />
          </a>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[9px] font-bold text-black flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl bg-[#0D1322] border border-white/[0.1] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] mb-2">
                  <span className="text-xs font-bold text-white">System Notifications</span>
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAllNotifications}
                      className="text-[10px] text-slate-400 hover:text-red-400 transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No notifications yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                          n.read ? 'bg-white/[0.02] text-slate-400' : 'bg-white/[0.06] text-white font-medium'
                        }`}
                      >
                        <p>{n.message}</p>
                        <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
            title="Lock HQ Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};
