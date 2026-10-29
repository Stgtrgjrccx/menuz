import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, AlertCircle, Plus, Minus } from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { TRANSLATIONS, translateDishName } from '../utils/i18n';

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
    <div className="fixed inset-0 z-50 bg-[#924E00]/40 backdrop-blur-sm flex items-end justify-center">
      <div 
        className="bg-[#FFF7E6] text-[#924E00] rounded-t-3xl max-w-xl w-full max-h-[92vh] flex flex-col p-5 animate-in slide-in-from-bottom duration-200 border border-[#924E00]/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-[#924E00]/10">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#924E00]">{t.yourTableCart}</h2>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-xs bg-[#FFF2D6] text-[#924E00] px-2.5 py-0.5 rounded-full font-semibold border border-[#F9A620]/30">
                {tableLabel}
              </span>
              <span className="text-xs text-[#924E00]/60">• Pay at counter / table</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#924E00]/60 hover:bg-white/80 hover:text-[#924E00] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notice */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-300 text-red-800 text-xs p-3 rounded-2xl my-3 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Content */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#924E00]/40 mb-3 shadow-xs">
              <ShoppingBag className="w-7 h-7 text-[#F9A620]" />
            </div>
            <p className="font-serif text-[#924E00] font-bold text-base">{t.cartEmpty}</p>
            <p className="text-xs text-[#924E00]/70 mt-1 max-w-xs">
              {t.addDishesPrompt}
            </p>
          </div>
        ) : (
          <>
            {/* Real-time shared table indicator */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl px-3.5 py-2 my-2 flex items-center justify-between text-xs text-emerald-800 shadow-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="font-bold">{t.tableCartSyncActive}</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-mono font-bold">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} on {tableLabel}
              </span>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto py-2 divide-y divide-[#924E00]/10">
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
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-white border border-[#924E00]/10"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <h4 className="font-serif font-bold text-sm text-[#924E00] leading-snug truncate">
                          {translateDishName(item.name, selectedLanguage)}
                        </h4>
                      </div>

                      {item.added_by_guest && (
                        <span className="inline-flex items-center space-x-1 text-[10px] text-[#924E00] bg-[#FFF2D6] border border-[#F9A620]/30 px-2 py-0.5 rounded-full mt-0.5 font-medium">
                          <span>👤</span>
                          <span>{item.added_by_guest}</span>
                        </span>
                      )}

                      <span className="text-xs text-[#F9A620] font-bold block mt-0.5">
                        ₹{itemPrice.toFixed(2)}
                      </span>

                      {/* Options list */}
                      {opts.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {opts.map((opt) => (
                            <span key={opt.option_id} className="inline-block bg-white text-[10px] text-[#924E00]/80 px-2 py-0.5 rounded-md mr-1 border border-[#924E00]/10">
                              +{opt.name} {opt.price_modifier > 0 ? `(₹${opt.price_modifier})` : ''}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end space-y-1.5">
                      <span className="font-bold text-xs text-[#924E00]">
                        ₹{lineTotal.toFixed(2)}
                      </span>
                      <div className="flex items-center space-x-1.5 bg-white rounded-lg p-0.5 border border-[#924E00]/15 shadow-xs">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.menu_item_id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md bg-[#FFF7E6] flex items-center justify-center text-[#924E00] hover:bg-[#FFF2D6] transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center text-xs font-bold text-[#924E00]">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.menu_item_id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md bg-[#FFF7E6] flex items-center justify-center text-[#924E00] hover:bg-[#FFF2D6] transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCartItem(item.menu_item_id)}
                          className="text-red-600 hover:text-red-700 p-1 ml-1 cursor-pointer"
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
                      <span className="text-xs font-bold text-[#924E00] flex items-center space-x-1">
                        <span>{badgeTitle}</span>
                      </span>
                      <span className="text-[10px] text-[#F9A620] font-bold uppercase tracking-wider">
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
                            className="bg-white border border-[#924E00]/10 rounded-2xl p-2.5 flex flex-col justify-between hover:border-[#F9A620]/40 transition-all text-left shadow-xs"
                          >
                            <img
                              src={dish.image_url}
                              alt={dish.name}
                              className="w-full aspect-[4/3] rounded-lg object-cover mb-1.5"
                            />
                            <p className="font-bold text-[11px] text-[#924E00] truncate leading-tight">
                              {translateDishName(dish.name, selectedLanguage)}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <div>
                                <span className="text-[10px] font-bold text-[#F9A620]">₹{finalPrice}</span>
                                {pairingDiscount > 0 && (
                                  <span className="text-[8px] line-through text-[#924E00]/50 ml-1">₹{dish.price}</span>
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
                                className="px-2 py-0.5 bg-[#F9A620] hover:bg-[#e89512] text-white text-[10px] font-bold rounded-md shadow-xs transition-colors flex items-center space-x-0.5 cursor-pointer"
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
                <label className="text-xs font-semibold text-[#924E00] mb-1 block">{t.specialInstructions}</label>
                <input
                  type="text"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder={t.specialInstructionsPlaceholder}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#924E00]/15 rounded-xl focus:outline-none focus:border-[#F9A620] text-[#924E00] placeholder-[#924E00]/40 shadow-xs"
                />
              </div>
            </div>

            {/* Calculations & Checkout */}
            <div className="pt-3 border-t border-[#924E00]/10 space-y-1.5 text-xs">
              <div className="flex justify-between text-[#924E00]/75">
                <span>{t.itemTotal}</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#924E00]/75">
                <span>{t.taxAndGst}</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#924E00] pt-2 border-t border-[#924E00]/10">
                <span>{t.grandTotal}</span>
                <span className="text-[#F9A620] text-base">₹{totalAmount.toFixed(2)}</span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handlePlaceOrder}
                  className="w-full bg-[#F9A620] hover:bg-[#e89512] active:scale-[0.98] disabled:opacity-50 text-white font-medium py-3.5 px-4 rounded-xl shadow-xs flex items-center justify-between text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <div className="text-left">
                    <span className="block leading-tight font-bold text-white">{t.sendToKitchen} ({tableLabel})</span>
                    <span className="text-[10px] text-white/80 font-normal">Pay at counter / table</span>
                  </div>
                  <div className="flex items-center space-x-1.5 font-bold">
                    <span>₹{totalAmount.toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4 text-white" />
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

export default CartDrawer;
