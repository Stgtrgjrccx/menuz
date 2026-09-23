import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Search, ShoppingBag, Sparkles, Flame, AlertCircle, RefreshCw } from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { MenuItem } from '../types';
import { DishDetailModal } from '../components/DishDetailModal';
import { CartDrawer } from '../components/CartDrawer';
import { AiAssistantDrawer } from '../components/AiAssistantDrawer';
import { OrderTrackerModal } from '../components/OrderTrackerModal';

export const DinerMenu: React.FC = () => {
  const { restaurantSlug } = useParams<{ restaurantSlug: string }>();
  const [searchParams] = useSearchParams();
  const tableToken = searchParams.get('t') || '';

  const restaurant = useRestaurantStore((state) => state.restaurant);
  const tables = useRestaurantStore((state) => state.tables);
  const categories = useRestaurantStore((state) => state.categories);
  const menuItems = useRestaurantStore((state) => state.menuItems);
  const cart = useRestaurantStore((state) => state.cart);
  const activeTable = useRestaurantStore((state) => state.activeTable);
  const setActiveTable = useRestaurantStore((state) => state.setActiveTable);
  const activeOrderId = useRestaurantStore((state) => state.activeOrderId);
  const setActiveOrderId = useRestaurantStore((state) => state.setActiveOrderId);
  const addItemToCart = useRestaurantStore((state) => state.addItemToCart);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDish, setActiveDish] = useState<MenuItem | null>(null);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [aiFocusDish, setAiFocusDish] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Table Token Verification
  useEffect(() => {
    if (!tableToken) {
      setErrorMsg('No table token supplied. Please scan the QR code located on your table.');
      return;
    }

    const matchedTable = tables.find(
      (t) => t.public_token === tableToken && t.is_active
    );

    if (!matchedTable) {
      setErrorMsg('Invalid or inactive table token. Please request assistance from your server.');
      return;
    }

    setActiveTable(matchedTable);
    setErrorMsg(null);

    // Ensure session ID
    if (!sessionStorage.getItem('menuz_session_id')) {
      sessionStorage.setItem('menuz_session_id', 'sess_' + crypto.randomUUID());
    }
  }, [tableToken, tables, setActiveTable]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredDishes = useMemo(() => {
    return menuItems.filter((dish) => {
      const matchesCat = selectedCategory === 'all' || dish.category_id === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        dish.name.toLowerCase().includes(q) ||
        dish.short_description.toLowerCase().includes(q) ||
        dish.ingredients.some(ing => ing.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-subtle text-center border border-red-100">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="font-serif text-xl font-bold text-charcoal-900 mb-2">QR Code Issue</h2>
          <p className="text-charcoal-800 text-sm mb-4 leading-relaxed">{errorMsg}</p>
          <a
            href="/r/saffron-house/menu?t=table-token-01-saffron"
            className="inline-block bg-saffron-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-subtle hover:bg-saffron-700 transition-colors"
          >
            Launch Table 1 Demo
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-50 pb-28">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-ivory-50/95 backdrop-blur-md border-b border-ivory-200 px-4 py-3 shadow-xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-saffron-700">
              {restaurant.name}
            </span>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif text-xl font-bold text-charcoal-900">Contemporary Menu</h1>
              <span className="bg-saffron-100 text-saffron-800 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                {activeTable?.label || 'Table'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                setAiFocusDish(null);
                setIsAiOpen(true);
              }}
              className="flex items-center space-x-1.5 bg-saffron-600 hover:bg-saffron-700 text-white text-xs px-3 py-2 rounded-full font-semibold shadow-subtle transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-charcoal-900 bg-white rounded-full border border-ivory-200 shadow-subtle hover:bg-ivory-50 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-charcoal-800" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-saffron-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mt-2.5 relative">
          <Search className="w-4 h-4 text-charcoal-700/40 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saffron paneer, butter chicken, naan..."
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl text-xs border border-ivory-200 focus:outline-none focus:border-saffron-600 placeholder-charcoal-700/40 text-charcoal-900 shadow-xs"
          />
        </div>

        {/* Sticky Category Chips */}
        <div className="max-w-xl mx-auto mt-3 flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-charcoal-900 text-white shadow-xs'
                : 'bg-white text-charcoal-800 border border-ivory-200 hover:bg-ivory-100'
            }`}
          >
            All Offerings
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-charcoal-900 text-white shadow-xs'
                  : 'bg-white text-charcoal-800 border border-ivory-200 hover:bg-ivory-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Menu Item Cards */}
      <main className="max-w-xl mx-auto px-4 mt-4 space-y-3">
        {filteredDishes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl p-6 border border-ivory-200 shadow-subtle">
            <p className="font-serif font-bold text-charcoal-900 text-base">No dishes found</p>
            <p className="text-xs text-charcoal-700/60 mt-1">Try adjusting your search keywords or filter category.</p>
          </div>
        ) : (
          filteredDishes.map((dish) => {
            const isVeg = dish.dietary_flags.includes('Vegetarian') || dish.dietary_flags.includes('Vegan') || dish.dietary_flags.includes('Jain');

            return (
              <div
                key={dish.id}
                onClick={() => setActiveDish(dish)}
                className={`bg-white rounded-2xl p-3.5 shadow-subtle border border-ivory-200/90 flex items-start space-x-3 cursor-pointer transition-all hover:border-saffron-500/40 hover:shadow-md ${
                  !dish.is_available ? 'opacity-65 bg-gray-50/80' : ''
                }`}
              >
                <div className="w-24 h-24 rounded-xl flex-shrink-0 bg-ivory-100 overflow-hidden relative shadow-inner">
                  <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
                  {!dish.is_available && (
                    <div className="absolute inset-0 bg-charcoal-900/70 flex items-center justify-center p-1 text-center">
                      <span className="text-[9px] uppercase font-bold text-white tracking-widest px-1.5 py-0.5 rounded bg-red-600/90">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className={`w-3 h-3 rounded-xs border flex items-center justify-center ${
                      isVeg ? 'border-green-600' : 'border-red-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                    </span>
                    {dish.spice_level > 0 && (
                      <div className="flex items-center text-saffron-600 pl-1 border-l border-ivory-200">
                        <Flame className="w-3 h-3 fill-saffron-600" />
                        <span className="text-[10px] font-bold ml-0.5">{dish.spice_level}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-sm text-charcoal-900 leading-tight truncate">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-charcoal-700/70 line-clamp-2 mt-0.5 leading-snug">
                    {dish.short_description}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-ivory-100">
                    <span className="font-bold text-sm text-charcoal-900">
                      ₹{dish.price.toFixed(2)}
                    </span>
                    {dish.is_available ? (
                      <span className="text-xs text-saffron-700 font-semibold hover:underline">
                        Customize & Add +
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400 font-medium">Currently Unavailable</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Floating Bottom Cart Bar if Tray has items */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-40">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-saffron-600 hover:bg-saffron-700 text-white font-bold py-3.5 px-5 rounded-2xl shadow-float flex items-center justify-between transition-all"
          >
            <div className="flex items-center space-x-2">
              <span className="bg-white text-saffron-700 text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                {totalCartCount}
              </span>
              <span className="text-sm font-serif">View Dining Tray</span>
            </div>
            <div className="flex items-center space-x-1 text-sm font-sans">
              <span>Pay at Table</span>
              <span>→</span>
            </div>
          </button>
        </div>
      )}

      {/* Dish Detail Modal */}
      <DishDetailModal
        dish={activeDish}
        onClose={() => setActiveDish(null)}
        onAskAi={(dish) => {
          setActiveDish(null);
          setAiFocusDish(dish);
          setIsAiOpen(true);
        }}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* AI Assistant Drawer */}
      <AiAssistantDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        focusDish={aiFocusDish}
        onConfirmAdd={(dish) => {
          addItemToCart({
            menu_item_id: dish.id,
            name: dish.name,
            price: dish.price,
            quantity: 1,
            image_url: dish.image_url,
            selected_options: []
          });
          setIsCartOpen(true);
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        tableLabel={activeTable?.label || 'Table'}
      />

      {/* Order Status Modal */}
      {activeOrderId && (
        <OrderTrackerModal
          orderId={activeOrderId}
          onClose={() => setActiveOrderId(null)}
        />
      )}
    </div>
  );
};
