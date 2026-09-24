import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Flame, Sparkles, ShoppingBag, Plus, Minus, AlertTriangle } from 'lucide-react';
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

  const isVeg = dish.dietary_flags.includes('Vegetarian') || dish.dietary_flags.includes('Vegan') || dish.dietary_flags.includes('Jain');

  const handleOptionToggle = (groupId: string, optionId: string, name: string, priceModifier: number) => {
    setSelectedOptions((prev) => {
      const next = { ...prev };
      if (next[groupId]?.option_id === optionId) {
        delete next[groupId];
      } else {
        next[groupId] = { option_id: optionId, name, price_modifier: priceModifier };
      }
      return next;
    });
  };

  const optionsTotal = Object.values(selectedOptions).reduce((sum, opt) => sum + opt.price_modifier, 0);
  const unitPrice = dish.price + optionsTotal;
  const totalPrice = unitPrice * quantity;

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
    <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-end justify-center">
      <div 
        className="bg-white rounded-t-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-float overflow-hidden animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle & close */}
        <div className="relative pt-3 pb-2 px-5 flex items-center justify-between border-b border-ivory-200">
          <div className="w-10 h-1 bg-ivory-200 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          <span className="text-xs font-semibold text-saffron-700 tracking-wide uppercase">Signature Offering</span>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-charcoal-800 hover:bg-ivory-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Image */}
          <div className="w-full h-56 rounded-2xl overflow-hidden relative bg-ivory-100 shadow-inner">
            <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
            {!dish.is_available && (
              <div className="absolute inset-0 bg-charcoal-900/75 flex items-center justify-center backdrop-blur-xs">
                <span className="text-xs uppercase font-bold text-white tracking-widest px-3 py-1.5 bg-red-600 rounded-lg shadow-md">
                  Currently Sold Out (86)
                </span>
              </div>
            )}
          </div>

          {/* Title & Price */}
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center ${
                isVeg ? 'border-green-600' : 'border-red-600'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
              </span>
              <span className="text-xs font-semibold text-charcoal-700">{isVeg ? 'Vegetarian' : 'Non-Vegetarian'}</span>
              
              {dish.spice_level > 0 && (
                <div className="flex items-center space-x-0.5 text-saffron-600 pl-2 border-l border-ivory-200">
                  <Flame className="w-3.5 h-3.5 fill-saffron-600" />
                  <span className="text-xs font-bold">Spice {dish.spice_level}/5</span>
                </div>
              )}
              {dish.serving_size && (
                <span className="text-xs text-charcoal-700/60 pl-2 border-l border-ivory-200">
                  {dish.serving_size}
                </span>
              )}
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-serif text-2xl font-bold text-charcoal-900 leading-tight">{dish.name}</h2>
              <span className="font-bold text-xl text-saffron-700 whitespace-nowrap">₹{dish.price.toFixed(2)}</span>
            </div>
            <p className="text-sm text-charcoal-800 leading-relaxed mt-2">{dish.full_description}</p>
          </div>

          {/* Chef Notes if present */}
          {dish.chef_notes && (
            <div className="bg-saffron-50 border border-saffron-200/80 p-3 rounded-xl text-xs text-saffron-900 leading-relaxed">
              <strong className="font-serif font-bold text-saffron-800">Master Chef's Note:</strong> {dish.chef_notes}
            </div>
          )}

          {/* Badges */}
          <div className="bg-ivory-100/70 p-3 rounded-xl space-y-2 text-xs">
            {dish.dietary_flags.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-charcoal-900 w-20 flex-shrink-0">Dietary:</span>
                <div className="flex flex-wrap gap-1">
                  {dish.dietary_flags.map((d, idx) => (
                    <span key={idx} className="bg-white border border-ivory-200 text-green-800 px-2 py-0.5 rounded-md font-medium text-[11px]">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {dish.allergens.length > 0 ? (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-charcoal-900 w-20 flex-shrink-0">Allergens:</span>
                <div className="flex flex-wrap gap-1">
                  {dish.allergens.map((a, idx) => (
                    <span key={idx} className="bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded-md font-medium text-[11px]">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-charcoal-900 w-20 flex-shrink-0">Allergens:</span>
                <span className="text-charcoal-700 text-[11px]">None declared in kitchen specs</span>
              </div>
            )}

            <div className="flex items-start space-x-2">
              <span className="font-semibold text-charcoal-900 w-20 flex-shrink-0">Ingredients:</span>
              <span className="text-charcoal-700 text-[11px] leading-tight">{dish.ingredients.join(', ')}</span>
            </div>
          </div>

          {/* Option Groups */}
          {dish.option_groups && dish.option_groups.length > 0 && (
            <div className="space-y-3 pt-2">
              {dish.option_groups.map((group) => (
                <div key={group.id} className="border border-ivory-200 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-serif font-bold text-xs text-charcoal-900">{group.name}</span>
                    <span className="text-[10px] text-charcoal-700/60 uppercase font-semibold">
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
                              ? 'bg-saffron-50 border-saffron-500 text-saffron-900 font-medium'
                              : 'bg-white border-ivory-200 text-charcoal-800 hover:bg-ivory-50'
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
        <div className="p-4 bg-white border-t border-ivory-200 space-y-2.5">
          {dish.is_available ? (
            <div className="flex items-center space-x-3">
              {/* Quantity Selector */}
              <div className="flex items-center bg-ivory-100 rounded-xl border border-ivory-200 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-charcoal-800 hover:bg-ivory-50 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-charcoal-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-charcoal-800 hover:bg-ivory-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-saffron-600 hover:bg-saffron-700 text-white font-bold py-3 px-4 rounded-xl shadow-subtle flex items-center justify-between text-xs transition-colors"
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
              className="w-full bg-gray-200 text-gray-500 font-bold py-3 px-4 rounded-xl text-xs cursor-not-allowed text-center"
            >
              Currently Unavailable in Kitchen
            </button>
          )}

          {/* Ask AI Button */}
          <button
            type="button"
            onClick={() => onAskAi(dish)}
            className="w-full bg-ivory-100 hover:bg-ivory-200 text-charcoal-900 font-semibold py-2.5 px-4 rounded-xl border border-ivory-200 flex items-center justify-center space-x-1.5 text-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
            <span>Ask AI: Flavors, Spices & Pairing Details</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
