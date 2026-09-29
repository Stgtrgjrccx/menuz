import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, AlertCircle, Plus, Minus } from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { TRANSLATIONS } from '../utils/i18n';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tableLabel: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  tableLabel,
}) => {
  const cart = useRestaurantStore((state) => state.cart);
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const selectedLanguage = useRestaurantStore((state) => state.selectedLanguage);
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;
  const customerNotes = useRestaurantStore((state) => state.customerNotes);
  const setCustomerNotes = useRestaurantStore((state) => state.setCustomerNotes);
  const updateCartQuantity = useRestaurantStore((state) => state.updateCartQuantity);
  const removeCartItem = useRestaurantStore((state) => state.removeCartItem);
  const clearCart = useRestaurantStore((state) => state.clearCart);
  const placeOrder = useRestaurantStore((state) => state.placeOrder);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => {
    const opts = Array.isArray(item.selected_options) ? item.selected_options : [];
    const optsSum = opts.reduce((s, o) => s + (Number(o?.price_modifier) || 0), 0);
    const itemPrice = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
    return sum + (itemPrice + optsSum) * (item.quantity || 1);
  }, 0);

  const taxRate = restaurant.tax_rate_percent || 5;
  const taxAmount = Number((subtotal * (taxRate / 100)).toFixed(2));
  const totalAmount = Number((subtotal + taxAmount).toFixed(2));

  const handlePlaceOrder = () => {
    try {
      setSubmitting(true);
      setErrorMessage(null);
      const newOrder = placeOrder(customerNotes);
      if (!newOrder) {
        throw new Error('Unable to create order. Please verify table assignment.');
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit order to kitchen.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-end justify-center">
      <div 
        className="bg-white rounded-t-3xl max-w-xl w-full max-h-[92vh] flex flex-col p-5 shadow-float animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-ivory-200">
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal-900">{t.yourTableCart}</h2>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-xs bg-saffron-100 text-saffron-700 px-2 py-0.5 rounded-full font-semibold">
                {tableLabel}
              </span>
              <span className="text-xs text-charcoal-700/60">• Pay at counter/table</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-charcoal-800 hover:bg-ivory-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notice */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3 rounded-xl my-3 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Content */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-ivory-100 rounded-full flex items-center justify-center text-charcoal-700/30 mb-3">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <p className="font-serif text-charcoal-900 font-bold text-base">{t.cartEmpty}</p>
            <p className="text-xs text-charcoal-700/60 mt-1 max-w-xs">
              {t.addDishesPrompt}
            </p>
          </div>
        ) : (
          <>
            {/* Real-time shared table indicator */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl px-3 py-2 my-2 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold">{t.tableCartSyncActive}</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-mono">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} on {tableLabel}
              </span>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto py-2 divide-y divide-ivory-100">
              {cart.map((item) => {
                const opts = Array.isArray(item.selected_options) ? item.selected_options : [];
                const optsTotal = opts.reduce((s, o) => s + (Number(o?.price_modifier) || 0), 0);
                const itemPrice = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
                const lineTotal = (itemPrice + optsTotal) * (item.quantity || 1);
                return (
                  <div key={item.menu_item_id} className="py-3 flex items-start justify-between gap-3">
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200'}
                      alt={item.name || 'Dish'}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-ivory-100"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <h4 className="font-serif font-bold text-sm text-charcoal-900 leading-snug truncate">
                          {item.name}
                        </h4>
                      </div>

                      {item.added_by_guest && (
                        <span className="inline-flex items-center space-x-1 text-[10px] text-saffron-800 bg-saffron-50 border border-saffron-200 px-1.5 py-0.2 rounded-md mt-0.5 font-medium">
                          <span>👤</span>
                          <span>{item.added_by_guest}</span>
                        </span>
                      )}

                      <span className="text-xs text-saffron-700 font-semibold block mt-0.5">
                        ₹{itemPrice.toFixed(2)}
                      </span>

                      {/* Options list */}
                      {opts.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {opts.map((opt) => (
                            <span key={opt.option_id} className="inline-block bg-ivory-100 text-[10px] text-charcoal-800 px-1.5 py-0.5 rounded-sm mr-1">
                              +{opt.name} {opt.price_modifier > 0 ? `(₹${opt.price_modifier})` : ''}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end space-y-1.5">
                      <span className="font-bold text-xs text-charcoal-900">
                        ₹{lineTotal.toFixed(2)}
                      </span>
                      <div className="flex items-center space-x-1.5 bg-ivory-100 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.menu_item_id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-charcoal-800 hover:bg-ivory-50 shadow-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center text-xs font-bold text-charcoal-900">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.menu_item_id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-charcoal-800 hover:bg-ivory-50 shadow-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCartItem(item.menu_item_id)}
                          className="text-red-500 hover:text-red-700 p-1 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Chef's Smart Upsells & Recommended Pairings */}
              {(() => {
                if (restaurant.smart_pairings_config?.enabled === false) return null;
                const cartIds = new Set(cart.map((c) => c.menu_item_id));
                const allRestItems = useRestaurantStore.getState().menuItems.filter((m) => m.restaurant_id === restaurant.id && m.is_available);
                const upsellCandidates = allRestItems
                  .filter((m) => !cartIds.has(m.id))
                  .slice(0, 3);

                if (upsellCandidates.length === 0) return null;

                const badgeTitle = restaurant.smart_pairings_config?.badge_text || "🧑‍🍳 Chef's Recommended Pairings";
                const pairingDiscount = restaurant.smart_pairings_config?.discount_percent || 0;

                return (
                  <div className="pt-3 pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-charcoal-900 flex items-center space-x-1">
                        <span>{badgeTitle}</span>
                      </span>
                      <span className="text-[10px] text-saffron-700 font-bold uppercase tracking-wider">
                        {pairingDiscount > 0 ? `${pairingDiscount}% ${t.bundleDeal}` : t.add}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {upsellCandidates.map((dish) => {
                        const finalPrice = pairingDiscount > 0
                          ? Math.round(dish.price * (1 - pairingDiscount / 100))
                          : dish.price;

                        return (
                          <div
                            key={dish.id}
                            className="bg-ivory-50 border border-ivory-200 rounded-xl p-2 flex flex-col justify-between hover:border-saffron-300 transition-all text-left"
                          >
                            <img
                              src={dish.image_url}
                              alt={dish.name}
                              className="w-full aspect-[4/3] rounded-lg object-cover mb-1.5"
                            />
                            <p className="font-bold text-[11px] text-charcoal-900 truncate leading-tight">
                              {dish.name}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <div>
                                <span className="text-[10px] font-bold text-saffron-700">₹{finalPrice}</span>
                                {pairingDiscount > 0 && (
                                  <span className="text-[8px] line-through text-charcoal-400 ml-1">₹{dish.price}</span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  useRestaurantStore.getState().addItemToCart({
                                    menu_item_id: dish.id,
                                    name: dish.name,
                                    price: finalPrice,
                                    quantity: 1,
                                    image_url: dish.image_url,
                                    selected_options: [],
                                    added_by_guest: 'Quick Pairing'
                                  });
                                }}
                                className="px-2 py-0.5 bg-saffron-600 hover:bg-saffron-700 text-white text-[10px] font-bold rounded-md shadow-xs transition-colors flex items-center space-x-0.5 cursor-pointer"
                              >
                                <Plus className="w-2.5 h-2.5" />
                                <span>{t.add}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Kitchen notes */}
              <div className="pt-3">
                <label className="text-xs font-semibold text-charcoal-900 mb-1 block">{t.specialInstructions}</label>
                <input
                  type="text"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder={t.specialInstructionsPlaceholder}
                  className="w-full px-3 py-2 text-xs bg-ivory-50 border border-ivory-200 rounded-xl focus:outline-none focus:border-saffron-600 text-charcoal-900"
                />
              </div>
            </div>

            {/* Calculations & Checkout */}
            <div className="pt-3 border-t border-ivory-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-charcoal-700">
                <span>{t.itemTotal}</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-charcoal-700">
                <span>{t.taxAndGst}</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-charcoal-900 pt-2 border-t border-ivory-100">
                <span>{t.grandTotal}</span>
                <span className="text-saffron-700 text-base">₹{totalAmount.toFixed(2)}</span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handlePlaceOrder}
                  className="w-full bg-saffron-600 hover:bg-saffron-700 disabled:bg-gray-300 text-white font-bold py-3.5 px-4 rounded-xl shadow-subtle flex items-center justify-between text-xs transition-colors"
                >
                  <div className="text-left">
                    <span className="block leading-tight font-semibold">{t.sendToKitchen} ({tableLabel})</span>
                    <span className="text-[10px] opacity-80 font-normal">Pay at counter/table</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span>₹{totalAmount.toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
