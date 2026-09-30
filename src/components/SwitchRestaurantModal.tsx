import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  X,
  Search,
  QrCode,
  Home,
  UtensilsCrossed,
  MapPin,
  Star,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useRestaurantStore, isDishNameAsRestaurant } from '../store/restaurantStore';
import { isWorkingWithMenuz } from '../types';
import { QrScannerModal } from './QrScannerModal';

interface SwitchRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlug: string;
}

export const SwitchRestaurantModal: React.FC<SwitchRestaurantModalProps> = ({
  isOpen,
  onClose,
  currentSlug
}) => {
  const navigate = useNavigate();
  const rawRestaurants = useRestaurantStore((state) => state.restaurants);
  const restaurants = useMemo(
    () => rawRestaurants.filter((r) => !isDishNameAsRestaurant(r)),
    [rawRestaurants]
  );
  const tables = useRestaurantStore((state) => state.tables);

  const [query, setQuery] = useState('');
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

  // Strictly show restaurants working with Menuz (the active demos)
  const workingRestaurants = useMemo(() => {
    return restaurants.filter((r) => isWorkingWithMenuz(r) && !isDishNameAsRestaurant(r));
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return workingRestaurants;
    return workingRestaurants.filter((r) => {
      const matchName = r.name.toLowerCase().includes(q);
      const matchCuisine = r.cuisine.toLowerCase().includes(q);
      const matchLoc = (r.location || '').toLowerCase().includes(q);
      const matchAlias = r.aliases?.some((a) => a.toLowerCase().includes(q));
      return matchName || matchCuisine || matchLoc || matchAlias;
    });
  }, [workingRestaurants, query]);

  const handleSelectRestaurant = (slug: string) => {
    const target = restaurants.find((r) => r.slug === slug);
    const restTables = tables.filter((t) => t.restaurant_id === target?.id);
    const token = restTables[0]?.public_token || 'table-token-01-saffron';
    onClose();
    navigate(`/r/${slug}/menu?t=${token}`);
  };

  if (!isOpen) return null;

  return (
    <>
      {createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99998
          }}
          className="bg-charcoal-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-charcoal-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-charcoal-900 via-charcoal-800 to-charcoal-900 text-white p-4 px-5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-saffron-500/20 text-saffron-400 flex items-center justify-center border border-saffron-500/30">
                  <UtensilsCrossed className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">
                    Switch Demo Restaurant or Table
                  </h3>
                  <p className="text-[11px] text-charcoal-300">
                    Select between the active Menuz demo restaurants
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-3 bg-ivory-50 border-b border-ivory-200 flex gap-2">
              <button
                type="button"
                onClick={() => setIsQrScannerOpen(true)}
                className="flex-1 py-2.5 px-3 bg-gradient-to-r from-saffron-600 to-amber-500 hover:brightness-105 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan Table QR</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/');
                }}
                className="py-2.5 px-3 bg-white hover:bg-ivory-100 border border-ivory-300 text-charcoal-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4 text-charcoal-500" />
                <span>Menuz Home</span>
              </button>
            </div>

            {/* Live Search Input with Instant Filtering */}
            <div className="p-4 border-b border-ivory-200">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search demo restaurants (Saffron House, Casa Bella)..."
                  className="w-full py-2.5 pl-9 pr-8 rounded-xl border border-ivory-300 text-xs focus:outline-none focus:border-saffron-500 bg-ivory-50 text-charcoal-900"
                  autoFocus
                />
                <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-2.5 text-xs text-charcoal-400 hover:text-charcoal-600 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
              {query && (
                <div className="mt-2 text-[11px] text-charcoal-500 flex items-center justify-between">
                  <span>Suggestions matching "{query}":</span>
                  <span className="font-bold text-saffron-700">{filteredRestaurants.length} found</span>
                </div>
              )}
            </div>

            {/* Restaurant List - Strictly Active Demos */}
            <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
              {filteredRestaurants.length === 0 ? (
                <div className="py-8 px-4 text-center text-charcoal-600 bg-ivory-50/80 rounded-2xl border border-ivory-200">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-200 shadow-sm">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-charcoal-900">
                    No demo matches "{query}"
                  </h4>
                  <p className="text-[11px] text-charcoal-500 mt-1 mb-3 leading-relaxed">
                    Menuz is currently showcasing our two live demo experiences (Saffron House &amp; Casa Bella Trattoria). Point your camera at your table QR code or choose a demo below.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="py-1.5 px-3 bg-white border border-ivory-300 rounded-lg text-xs font-semibold text-charcoal-700 hover:bg-ivory-100"
                    >
                      View All Demos
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsQrScannerOpen(true)}
                      className="py-1.5 px-3 bg-saffron-600 text-white rounded-lg text-xs font-semibold hover:bg-saffron-700"
                    >
                      Scan Table QR
                    </button>
                  </div>
                </div>
              ) : (
                filteredRestaurants.map((item) => {
                  const isCurrent = item.slug === currentSlug;
                  return (
                    <div
                      key={item.slug}
                      onClick={() => handleSelectRestaurant(item.slug)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3.5 group ${
                        isCurrent
                          ? 'border-saffron-500 bg-saffron-50/60 shadow-sm'
                          : 'border-ivory-200 hover:border-saffron-300 hover:bg-ivory-50/80'
                      }`}
                    >
                      <img
                        src={item.logo_url}
                        alt={item.name}
                        className="w-16 h-16 min-w-[64px] max-w-[64px] rounded-xl object-cover border border-ivory-300 flex-shrink-0 shadow-xs"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="font-serif font-bold text-sm text-charcoal-900 group-hover:text-saffron-700 truncate">
                            {item.name}
                          </h4>
                          {isCurrent && (
                            <span className="text-[9px] bg-saffron-600 text-white px-2 py-0.5 rounded-full font-bold">
                              Current
                            </span>
                          )}
                          <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                            Interactive Demo
                          </span>
                        </div>

                        <p className="text-[11px] text-charcoal-600 truncate mt-0.5">{item.cuisine}</p>

                        <div className="flex items-center space-x-2 text-[10px] text-charcoal-600 mt-1">
                          <span className="flex items-center text-amber-600 font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500 mr-0.5" />
                            4.8
                          </span>
                          <span>•</span>
                          <span className="flex items-center text-charcoal-500 truncate">
                            <MapPin className="w-2.5 h-2.5 mr-0.5" />
                            {item.location ? item.location.split(',')[0] : 'Koregaon Park, Pune'}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold flex items-center">
                            <Sparkles className="w-2.5 h-2.5 mr-0.5 text-amber-500" />
                            Digital Menu &amp; Rewards
                          </span>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-charcoal-400 group-hover:text-saffron-600 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="bg-ivory-50 border-t border-ivory-200 p-3 px-5 flex items-center justify-between text-[11px] text-charcoal-600">
              <span>Showing {filteredRestaurants.length} demo restaurant{filteredRestaurants.length === 1 ? '' : 's'}</span>
              <button
                onClick={() => {
                  onClose();
                  navigate('/');
                }}
                className="text-saffron-700 hover:underline font-bold"
              >
                Go to Menuz Home Page →
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Embedded QR Scanner Modal if user clicks "Scan Table QR" */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        defaultRestaurantSlug={currentSlug}
      />
    </>
  );
};
