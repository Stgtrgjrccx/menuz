import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Flame, Sparkles, ShoppingBag, Plus, Minus } from 'lucide-react';
import { MenuItem, SelectedOptionSnapshot } from '../types';
import { useRestaurantStore } from '../store/restaurantStore';

interface DishDetailModalProps {
  dish: MenuItem | null;
  onClose: () => void;
  onAskAi: (dish: MenuItem) => void;
  onOpenCart: () => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  dish,
  onClose,
  onAskAi,
  onOpenCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, SelectedOptionSnapshot>>({});
  const addItemToCart = useRestaurantStore((state) => state.addItemToCart);

  if (!dish) return null;

  const flags = Array.isArray(dish.dietary_flags) ? dish.dietary_flags : [];
  const isVeg = flags.some((f) => {
    const lf = String(f).toLowerCase();
    return lf === 'veg' || lf === 'vegetarian' || lf === 'vegan' || lf === 'jain';
  });

  const ingredients = Array.isArray(dish.ingredients) ? dish.ingredients : [];
  const allergens = Array.isArray(dish.allergens) ? dish.allergens : [];
  const optionGroups = Array.isArray(dish.option_groups) ? dish.option_groups : [];

  const handleOptionToggle = (groupId: string, optionId: string, name: string, priceModifier: number) => {
    setSelectedOptions((prev) => {
      const next = { ...prev };
      if (next[groupId]?.option_id === optionId) {
        delete next[groupId];
      } else {
        next[groupId] = { option_id: optionId, name, price_modifier: Number(priceModifier) || 0 };
      }
      return next;
    });
  };

  const optionsTotal = Object.values(selectedOptions).reduce((sum, opt) => sum + (Number(opt.price_modifier) || 0), 0);
  const dishPrice = typeof dish.price === 'number' ? dish.price : Number(dish.price) || 0;
  const unitPrice = dishPrice + optionsTotal;
  const totalPrice = unitPrice * (quantity || 1);

  const handleAddToCart = () => {
    if (!dish.is_available) return;

    addItemToCart({
      menu_item_id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity,
      image_url: dish.image_url,
      selected_options: Object.values(selectedOptions),
    });

    onClose();
    onOpenCart();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center">
      <div 
        className="bg-[#0D1322] rounded-t-3xl max-w-xl w-full max-h-[92vh] flex flex-col  overflow-hidden animate-in slide-in-from-bottom duration-200 border border-white/[0.08]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle & close */}
        <div className="relative pt-3 pb-2 px-5 flex items-center justify-between border-b border-white/[0.08]">
          <div className="w-10 h-1 bg-[#090D16]/20 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          <span className="text-xs font-semibold text-amber-400 tracking-wide uppercase">Signature Offering</span>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-white/[0.08] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Image */}
          <div className="w-full h-56 rounded-2xl overflow-hidden relative bg-[#090D16]">
            <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
            {!dish.is_available && (
              <div className="absolute inset-0 bg-black/75 flex items-center justify-center backdrop-blur-xs">
                <span className="text-xs uppercase font-bold text-white tracking-widest px-3 py-1.5 bg-red-600 rounded-lg shadow-md">
                  Currently Sold Out
                </span>
              </div>
            )}
          </div>

          {/* Title & Price */}
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center ${
                isVeg ? 'border-emerald-500' : 'border-red-500'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
              </span>
              <span className="text-xs font-semibold text-slate-400">{isVeg ? 'Vegetarian' : 'Non-Vegetarian'}</span>
              
              {dish.spice_level > 0 && (
                <div className="flex items-center space-x-0.5 text-amber-400 pl-2 border-l border-white/[0.08]">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="text-xs font-bold">Spice {dish.spice_level}/5</span>
                </div>
              )}
              {dish.serving_size && (
                <span className="text-xs text-slate-500 pl-2 border-l border-white/[0.08]">
                  {dish.serving_size}
                </span>
              )}
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-serif text-2xl font-bold text-slate-100 leading-tight">{dish.name}</h2>
              <span className="font-bold text-xl text-amber-400 whitespace-nowrap">₹{dish.price.toFixed(2)}</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mt-2">{dish.full_description}</p>
          </div>

          {/* Chef Notes if present */}
          {dish.chef_notes && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-200 leading-relaxed">
              <strong className="font-serif font-bold text-amber-300">Master Chef's Note:</strong> {dish.chef_notes}
            </div>
          )}

          {/* Badges */}
          <div className="bg-white/[0.04] p-3 rounded-xl space-y-2 text-xs border border-white/[0.06]">
            {flags.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-300 w-20 flex-shrink-0">Dietary:</span>
                <div className="flex flex-wrap gap-1">
                  {flags.map((d, idx) => (
                    <span key={idx} className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-md font-medium text-[11px]">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {allergens.length > 0 ? (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-300 w-20 flex-shrink-0">Allergens:</span>
                <div className="flex flex-wrap gap-1">
                  {allergens.map((a, idx) => (
                    <span key={idx} className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-md font-medium text-[11px]">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-300 w-20 flex-shrink-0">Allergens:</span>
                <span className="text-slate-500 text-[11px]">None declared in kitchen specs</span>
              </div>
            )}

            <div className="flex items-start space-x-2">
              <span className="font-semibold text-slate-300 w-20 flex-shrink-0">Ingredients:</span>
              <span className="text-slate-400 text-[11px] leading-tight">
                {ingredients.length > 0 ? ingredients.join(', ') : 'Chef signature culinary recipe'}
              </span>
            </div>
          </div>

          {/* Option Groups */}
          {optionGroups.length > 0 && (
            <div className="space-y-3 pt-2">
              {optionGroups.map((group) => (
                <div key={group.id} className="border border-white/[0.08] rounded-xl p-3 bg-[#090D16]/[0.02]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-serif font-bold text-xs text-slate-200">{group.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      {group.is_required ? 'Required' : 'Optional'}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {group.options.map((opt) => {
                      const isSelected = selectedOptions[group.id]?.option_id === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleOptionToggle(group.id, opt.id, opt.name, opt.price_modifier)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all border ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-medium'
                              : 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:border-amber-500/30'
                          }`}
                        >
                          <span>{opt.name}</span>
                          <span className="font-semibold">
                            {opt.price_modifier > 0 ? `+₹${opt.price_modifier.toFixed(2)}` : 'Included'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 bg-[#090D16] border-t border-white/[0.08] space-y-2.5">
          {dish.is_available ? (
            <div className="flex items-center space-x-3">
              {/* Quantity Selector */}
              <div className="flex items-center bg-[#090D16]/[0.04] rounded-xl border border-white/[0.08] p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-[#090D16]/[0.08] flex items-center justify-center text-slate-300 hover:bg-white/[0.12] transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-slate-100">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-[#090D16]/[0.08] flex items-center justify-center text-slate-300 hover:bg-white/[0.12] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-between text-xs transition-all"
              >
                <div className="flex items-center space-x-1.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Order Tray</span>
                </div>
                <span>₹{totalPrice.toFixed(2)}</span>
              </button>
            </div>
          ) : (
            <button
              disabled
              className="w-full bg-[#090D16]/[0.05] text-slate-500 font-bold py-3 px-4 rounded-xl text-xs cursor-not-allowed text-center border border-white/[0.08]"
            >
              Currently Unavailable in Kitchen
            </button>
          )}

          {/* Ask AI Button */}
          <button
            type="button"
            onClick={() => onAskAi(dish)}
            className="w-full bg-[#090D16]/[0.04] hover:bg-white/[0.08] text-slate-300 font-semibold py-2.5 px-4 rounded-xl border border-white/[0.08] hover:border-amber-500/30 flex items-center justify-center space-x-1.5 text-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask AI: Flavors, Spices &amp; Pairing Details</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
