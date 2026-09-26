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
  ArrowRight,
  Check,
  Building2
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { PUNE_RESTAURANT_DIRECTORY, PuneRestaurantEntry } from '../data/puneRestaurantDirectory';
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
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const addRestaurant = useRestaurantStore((state) => state.addRestaurant);
  const tables = useRestaurantStore((state) => state.tables);

  const [query, setQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

  // Combine store restaurants with full Pune directory
  const allAvailableRestaurants = useMemo(() => {
    // Map of unique slugs
    const map = new Map<string, {
      name: string;
      slug: string;
      cuisine: string;
      location: string;
      rating: number;
      avgCostForTwo: string;
      imageUrl: string;
      isStoreActive: boolean;
    }>();

    // 1. Registered restaurants in store
    restaurants.forEach((r) => {
      map.set(r.slug, {
        name: r.name,
        slug: r.slug,
        cuisine: r.cuisine,
        location: r.location || 'Pune',
        rating: 4.8,
        avgCostForTwo: '₹1,500',
        imageUrl: r.logo_url,
        isStoreActive: true
      });
    });

    // 2. Curated Pune directory
    PUNE_RESTAURANT_DIRECTORY.forEach((p) => {
      const slug = p.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      if (!map.has(slug)) {
        map.set(slug, {
          name: p.name,
          slug: slug,
          cuisine: p.cuisine,
          location: p.location,
          rating: p.rating,
          avgCostForTwo: p.avgCostForTwo,
          imageUrl: p.imageUrl,
          isStoreActive: false
        });
      }
    });

    return Array.from(map.values());
  }, [restaurants]);

  const neighborhoods = ['all', 'Koregaon Park', 'Baner', 'Shivajinagar', 'Kalyani Nagar', 'Viman Nagar'];

  const filteredRestaurants = useMemo(() => {
    return allAvailableRestaurants.filter((item) => {
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.cuisine.toLowerCase().includes(query.toLowerCase()) ||
        item.location.toLowerCase().includes(query.toLowerCase());

      const matchesNeighborhood =
        selectedNeighborhood === 'all' ||
        item.location.toLowerCase().includes(selectedNeighborhood.toLowerCase());

      return matchesQuery && matchesNeighborhood;
    });
  }, [allAvailableRestaurants, query, selectedNeighborhood]);

  const handleSelectRestaurant = (item: typeof allAvailableRestaurants[0]) => {
    // If not in store, add it
    const existing = restaurants.find((r) => r.slug === item.slug);
    if (!existing) {
      addRestaurant({
        id: `rest-${item.slug}`,
        slug: item.slug,
        name: item.name,
        cuisine: item.cuisine,
        location: item.location,
        logo_url: item.imageUrl,
        brand_colors: {
          primary: '#E85D04',
          background: '#FDFBF7',
          text: '#1C1917',
          accent: '#C84B00'
        },
        currency: 'INR',
        tax_rate_percent: 5.0,
        google_place_url: `https://search.google.com/local/writereview?placeid=${item.slug}`
      });
    }

    const restTables = tables.filter((t) => t.restaurant_id === existing?.id || t.id.includes(item.slug));
    const token = restTables[0]?.public_token || `token-${item.slug}-01`;

    onClose();
    navigate(`/r/${item.slug}/menu?t=${token}`);
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
                    Switch Restaurant or Table
                  </h3>
                  <p className="text-[11px] text-charcoal-300">
                    Explore digital menus across Pune's top dining spots
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-3 bg-ivory-50 border-b border-ivory-200 flex gap-2">
              <button
                type="button"
                onClick={() => setIsQrScannerOpen(true)}
                className="flex-1 py-2.5 px-3 bg-gradient-to-r from-saffron-600 to-amber-500 hover:brightness-105 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan New Table QR</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/');
                }}
                className="py-2.5 px-3 bg-white hover:bg-ivory-100 border border-ivory-300 text-charcoal-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Home className="w-4 h-4 text-charcoal-500" />
                <span>Menuz Home</span>
              </button>
            </div>

            {/* Search Input & Filter Pills */}
            <div className="p-4 border-b border-ivory-200 space-y-2.5">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search restaurants, cuisines (Italian, Indian, Asian)..."
                  className="w-full py-2.5 pl-9 pr-3.5 rounded-xl border border-ivory-300 text-xs focus:outline-none focus:border-saffron-500 bg-ivory-50 text-charcoal-900"
                />
                <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-2.5 text-xs text-charcoal-400 hover:text-charcoal-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Neighborhood Chips */}
              <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1 text-[11px]">
                {neighborhoods.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setSelectedNeighborhood(n)}
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
                      selectedNeighborhood === n
                        ? 'bg-charcoal-900 text-white font-bold'
                        : 'bg-ivory-100 hover:bg-ivory-200 text-charcoal-700 border border-ivory-200'
                    }`}
                  >
                    {n === 'all' ? 'All Areas' : n}
                  </button>
                ))}
              </div>
            </div>

            {/* Restaurant List */}
            <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
              {filteredRestaurants.length === 0 ? (
                <div className="py-12 text-center text-charcoal-400">
                  <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 text-charcoal-300" />
                  <p className="text-xs font-semibold">No restaurants found matching "{query}"</p>
                  <p className="text-[11px] text-charcoal-500 mt-1">Try another keyword or neighborhood</p>
                </div>
              ) : (
                filteredRestaurants.map((item) => {
                  const isCurrent = item.slug === currentSlug;
                  return (
                    <div
                      key={item.slug}
                      onClick={() => handleSelectRestaurant(item)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3 group ${
                        isCurrent
                          ? 'border-saffron-500 bg-saffron-50/60 shadow-sm'
                          : 'border-ivory-200 hover:border-saffron-300 hover:bg-ivory-50/80'
                      }`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 min-w-[64px] max-w-[64px] rounded-xl object-cover border border-ivory-300 flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="font-serif font-bold text-xs text-charcoal-900 group-hover:text-saffron-700 truncate">
                            {item.name}
                          </h4>
                          {isCurrent && (
                            <span className="text-[9px] bg-saffron-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                              Current
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-charcoal-500 truncate mt-0.5">{item.cuisine}</p>

                        <div className="flex items-center space-x-2 text-[10px] text-charcoal-600 mt-1">
                          <span className="flex items-center text-amber-600 font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500 mr-0.5" />
                            {item.rating}
                          </span>
                          <span>•</span>
                          <span className="flex items-center text-charcoal-500 truncate">
                            <MapPin className="w-2.5 h-2.5 mr-0.5" />
                            {item.location.split(',')[0]}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold flex items-center">
                            <Sparkles className="w-2.5 h-2.5 mr-0.5 text-amber-500" />
                            Table Rewards
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
              <span>Showing {filteredRestaurants.length} restaurants</span>
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

      {/* Embedded QR Scanner Modal if user clicks "Scan New Table QR" */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        defaultRestaurantSlug={currentSlug}
      />
    </>
  );
};
