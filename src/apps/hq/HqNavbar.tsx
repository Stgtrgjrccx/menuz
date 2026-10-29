import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Bell,
  ExternalLink,
  ChevronDown,
  Check,
  Trash2,
  LogOut,
  UtensilsCrossed,
  ChefHat
} from 'lucide-react';
import { useRestaurantStore, isValidRestaurantRecord } from '../../store/restaurantStore';
import { getCustomerSiteUrl, IS_OWNER_SITE } from '../../config/siteMode';

export const HqNavbar: React.FC = () => {
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
    <nav className="sticky top-0 z-40 bg-[#FFF7E6]/90 backdrop-blur-md border-b border-[#924E00]/10 px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand & Mode Badge */}
        <div className="flex items-center space-x-3">
          <Link
            to={IS_OWNER_SITE ? "/" : "/admin"}
            className="flex items-center space-x-2.5 group focus:outline-none"
            title={IS_OWNER_SITE ? "Menuz Restaurant Operations Hub" : "Menuz Master Admin HQ"}
          >
            <div className="w-8 h-8 rounded-full bg-[#F9A620] flex items-center justify-center text-white shadow-xs">
              <span className="font-serif font-bold text-sm tracking-tight">M</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif font-black tracking-tight text-[#924E00] text-lg">menuz</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#F9A620]/15 text-[#924E00] border border-[#F9A620]/30">
                  {IS_OWNER_SITE ? 'RESTAURANT' : 'HQ'}
                </span>
              </div>
              <p className="text-[10px] text-[#924E00]/70 font-medium hidden sm:block">
                {IS_OWNER_SITE
                  ? 'Food Operations Hub & Seating Management'
                  : 'Master Platform Governance & Partner Network'}
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
              className="flex items-center space-x-2 px-3.5 py-2 rounded-full bg-white/80 border border-[#924E00]/15 hover:bg-white text-xs font-semibold text-[#924E00] transition-all cursor-pointer shadow-xs"
            >
              <Building2 className="w-3.5 h-3.5 text-[#F9A620]" />
              <span className="max-w-[160px] truncate">{restaurant?.name || 'Select Restaurant'}</span>
              <span className="text-[10px] text-[#924E00] font-mono px-1.5 py-0.5 rounded-full bg-[#F9A620]/20">
                {restaurants.length} active
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#924E00]/60 transition-transform ${venueDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {venueDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 max-h-80 overflow-y-auto rounded-2xl bg-white border border-[#924E00]/15 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#924E00]/60 border-b border-[#924E00]/10 mb-1">
                  Active Venues ({restaurants.length})
                </div>
                {restaurants.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelectRestaurant(r.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                      r.id === restaurant?.id
                        ? 'bg-[#F9A620]/15 text-[#924E00] font-semibold'
                        : 'text-[#924E00]/80 hover:bg-[#FFF7E6]'
                    }`}
                  >
                    <span className="truncate">{r.name}</span>
                    {r.id === restaurant?.id && <Check className="w-3.5 h-3.5 text-[#F9A620] shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {/* Direct Menu Launch Button for Restaurant Managers */}
          <Link
            to={`/r/${restaurant?.slug || 'saffron-house'}/menu`}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#F9A620] hover:bg-[#e89512] active:scale-95 text-white text-xs font-semibold transition-all shadow-xs"
            title="Open Live Table QR Menu"
          >
            <UtensilsCrossed className="w-3 h-3 text-white" />
            <span>Table Menu</span>
          </Link>

          {/* Kitchen Display Link */}
          <Link
            to="/kitchen"
            className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-full bg-white/80 hover:bg-white border border-[#924E00]/15 text-xs font-semibold text-[#924E00] transition-all shadow-xs"
            title="Open Kitchen Display System"
          >
            <ChefHat className="w-3 h-3 text-[#F9A620]" />
            <span>Kitchen</span>
          </Link>

          {/* External Link to Customer Site */}
          <a
            href={getCustomerSiteUrl('')}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#F9A620]/15 border border-[#F9A620]/30 text-[#924E00] hover:bg-[#F9A620]/25 text-xs font-semibold transition-all shadow-xs"
            title="Open Customer Discovery Portal in new tab"
          >
            <span>Customer Portal</span>
            <ExternalLink className="w-3 h-3 text-[#924E00]" />
          </a>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-9 h-9 rounded-full bg-white/80 border border-[#924E00]/15 hover:bg-white text-[#924E00] flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F9A620] text-[9px] font-bold text-white flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl bg-white border border-[#924E00]/15 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#924E00]/10 mb-2">
                  <span className="text-xs font-bold text-[#924E00]">System Notifications</span>
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAllNotifications}
                      className="text-[10px] text-[#924E00]/60 hover:text-red-500 transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#924E00]/60 text-center py-4">No notifications yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                          n.read ? 'bg-[#FFF7E6]/50 text-[#924E00]/60' : 'bg-[#FFF7E6] text-[#924E00] font-medium'
                        }`}
                      >
                        <p>{n.message}</p>
                        <span className="text-[9px] text-[#924E00]/50 font-mono mt-0.5 block">
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
            className="w-9 h-9 rounded-full bg-white/80 border border-[#924E00]/15 hover:bg-rose-50 text-[#924E00] hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-xs"
            title="Lock Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default HqNavbar;
