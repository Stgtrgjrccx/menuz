import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Flame, Sparkles, ShoppingBag, Plus, Minus, Maximize2 } from 'lucide-react';
import { MenuItem, SelectedOptionSnapshot } from '../types';
import { useRestaurantStore } from '../store/restaurantStore';
import { DishHoverExpandGallery } from './DishHoverExpandGallery';
import { ImageLightboxModal } from './ImageLightboxModal';
import { TRANSLATIONS, getTranslatedDish } from '../utils/i18n';

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
  const selectedLanguage = useRestaurantStore((state) => state.selectedLanguage);
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, SelectedOptionSnapshot>>({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const addItemToCart = useRestaurantStore((state) => state.addItemToCart);

  if (!dish) return null;

  const tDish = getTranslatedDish(dish, selectedLanguage);

  // Extract all photos attached to dish
  const modalPhotos: { src: string; label?: string }[] = [];
  if (dish.gallery_images && dish.gallery_images.length > 0) {
    dish.gallery_images.forEach((g) => modalPhotos.push({ src: g.src, label: g.label || g.alt }));
  } else if (dish.image_url) {
    modalPhotos.push({ src: dish.image_url, label: 'Main View' });
  }
  if (dish.image_url && !modalPhotos.some((p) => p.src === dish.image_url)) {
    modalPhotos.unshift({ src: dish.image_url, label: 'Main View' });
  }

  const currentHeroPhoto = modalPhotos[activePhotoIdx]?.src || dish.image_url;

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

  const handleOpenLightbox = (index = 0) => {
    setActivePhotoIdx(index);
    setIsLightboxOpen(true);
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-50 bg-[#924E00]/40 backdrop-blur-sm flex items-end justify-center">
        <div 
          className="bg-[#FFF7E6] text-[#924E00] rounded-t-3xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200 border border-[#924E00]/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle & close */}
          <div className="relative pt-3 pb-2 px-5 flex items-center justify-between border-b border-[#924E00]/10">
            <div className="w-10 h-1 bg-[#924E00]/20 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
            <span className="text-xs font-semibold text-[#F9A620] tracking-wide uppercase">Signature Offering</span>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#924E00]/60 hover:bg-white/80 hover:text-[#924E00] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Primary / Active Hero Image with Zoom */}
            <div className="space-y-2.5">
              <div
                onClick={() => handleOpenLightbox(activePhotoIdx)}
                className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden relative bg-white group cursor-pointer border border-[#924E00]/10 hover:border-[#F9A620]/40 transition-colors shadow-xs"
                title="Click to zoom full-screen"
              >
                <img
                  src={currentHeroPhoto}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                  <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
                    <Maximize2 className="w-3 h-3 text-[#FFD188]" />
                    <span>Click to Zoom HD</span>
                  </span>
                  <span className="text-[10px] font-mono bg-black/70 px-2 py-0.5 rounded text-white border border-white/20">
                    Photo {activePhotoIdx + 1} of {modalPhotos.length}
                  </span>
                </div>
                {!dish.is_available && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-xs">
                    <span className="text-xs uppercase font-bold text-white tracking-widest px-3 py-1.5 bg-red-600 rounded-lg shadow-md">
                      Currently Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Side-by-side / Multi-Photo Thumbnails */}
              {modalPhotos.length > 1 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[#924E00]/70 px-0.5">
                    <span className="font-bold text-[#F9A620] flex items-center gap-1">
                      📸 Dish Photos ({modalPhotos.length} Views):
                    </span>
                    <span>Click any photo to preview</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {modalPhotos.map((img, idx) => {
                      const isActive = activePhotoIdx === idx;
                      return (
                        <button
                          key={`thumb-${idx}`}
                          type="button"
                          onClick={() => setActivePhotoIdx(idx)}
                          className={`relative w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                            isActive
                              ? 'border-[#F9A620] shadow-md ring-2 ring-[#F9A620]/40 scale-105'
                              : 'border-[#924E00]/15 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img.src} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                          <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 bg-black/70 text-[8px] font-mono text-white font-bold rounded">
                            #{idx + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Title & Price */}
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center ${
                  isVeg ? 'border-emerald-600' : 'border-red-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
                </span>
                <span className="text-xs font-semibold text-[#924E00]/80">{isVeg ? 'Vegetarian' : 'Non-Vegetarian'}</span>
                
                {dish.spice_level > 0 && (
                  <div className="flex items-center space-x-0.5 text-[#F9A620] pl-2 border-l border-[#924E00]/10">
                    <Flame className="w-3.5 h-3.5 fill-[#F9A620]" />
                    <span className="text-xs font-bold">Spice {dish.spice_level}/5</span>
                  </div>
                )}
                {dish.serving_size && (
                  <span className="text-xs text-[#924E00]/60 pl-2 border-l border-[#924E00]/10">
                    {dish.serving_size}
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-serif text-2xl font-bold text-[#924E00] leading-tight">{tDish.name}</h2>
                <span className="font-bold text-xl text-[#F9A620] whitespace-nowrap">₹{dish.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-[#924E00]/80 leading-relaxed mt-2">{tDish.full_description || tDish.short_description}</p>
            </div>

            {/* Heritage Lore & Origin Story */}
            {tDish.chef_story && (
              <div className="bg-white border border-[#F9A620]/30 p-4 rounded-2xl space-y-1.5 shadow-xs">
                <div className="flex items-center space-x-1.5 text-[#F9A620] text-xs font-serif font-bold">
                  <span>📜</span>
                  <span>{t.chefStoryTitle || 'Culinary Heritage & Origin Lore'}</span>
                </div>
                <p className="text-xs text-[#924E00]/85 leading-relaxed italic font-serif">
                  "{tDish.chef_story}"
                </p>
              </div>
            )}

            {/* Master Chef's Tasting Note */}
            {tDish.chef_notes && (
              <div className="bg-white border border-[#924E00]/10 p-3.5 rounded-2xl space-y-1 text-xs shadow-xs">
                <div className="flex items-center space-x-1.5 text-[#F9A620] font-bold">
                  <span>🧑‍🍳</span>
                  <span>{t.tastingNotesTitle || "Master Chef's Tasting Notes"}</span>
                </div>
                <p className="text-[#924E00]/80 leading-relaxed">
                  {tDish.chef_notes}
                </p>
              </div>
            )}

            {/* Founder's Table Pitch */}
            {tDish.owner_pitch && (
              <div className="bg-white border border-[#924E00]/10 p-3.5 rounded-2xl space-y-1 text-xs shadow-xs">
                <div className="flex items-center space-x-1.5 text-[#F9A620] font-bold">
                  <span>🎙️</span>
                  <span>Founder's Table Recommendation</span>
                </div>
                <p className="text-[#924E00]/80 leading-relaxed">
                  {tDish.owner_pitch}
                </p>
              </div>
            )}

            {/* Sommelier Beverage Pairing & Serving Technique */}
            {(dish.pairing_drink_name || dish.temperature_style) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {dish.pairing_drink_name && (
                  <div className="bg-white border border-[#924E00]/10 p-3 rounded-2xl space-y-1 text-xs shadow-xs">
                    <div className="flex items-center space-x-1.5 text-[#F9A620] font-bold">
                      <span>🍷</span>
                      <span>Ideal Beverage Pairing</span>
                    </div>
                    <p className="font-semibold text-[#924E00] text-xs">{dish.pairing_drink_name}</p>
                    {dish.pairing_reason && (
                      <p className="text-[11px] text-[#924E00]/70 leading-snug">{dish.pairing_reason}</p>
                    )}
                  </div>
                )}

                {dish.temperature_style && (
                  <div className="bg-white border border-[#924E00]/10 p-3 rounded-2xl space-y-1 text-xs shadow-xs">
                    <div className="flex items-center space-x-1.5 text-[#F9A620] font-bold">
                      <span>🌡️</span>
                      <span>Preparation &amp; Serving Style</span>
                    </div>
                    <p className="font-semibold text-[#924E00] text-xs">{dish.temperature_style}</p>
                  </div>
                )}
              </div>
            )}

            {/* Badges */}
            <div className="bg-white p-3.5 rounded-2xl space-y-2 text-xs border border-[#924E00]/10 shadow-xs">
              {flags.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#924E00] w-20 flex-shrink-0">Dietary:</span>
                  <div className="flex flex-wrap gap-1">
                    {flags.map((d, idx) => (
                      <span key={idx} className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-2 py-0.5 rounded-full font-medium text-[11px]">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {allergens.length > 0 ? (
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#924E00] w-20 flex-shrink-0">Allergens:</span>
                  <div className="flex flex-wrap gap-1">
                    {allergens.map((a, idx) => (
                      <span key={idx} className="bg-[#FFF2D6] border border-[#F9A620]/30 text-[#924E00] px-2 py-0.5 rounded-full font-medium text-[11px]">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#924E00] w-20 flex-shrink-0">Allergens:</span>
                  <span className="text-[#924E00]/60 text-[11px]">None declared in kitchen specs</span>
                </div>
              )}

              <div className="flex items-start space-x-2">
                <span className="font-semibold text-[#924E00] w-20 flex-shrink-0">Ingredients:</span>
                <span className="text-[#924E00]/75 text-[11px] leading-tight">
                  {ingredients.length > 0 ? ingredients.join(', ') : 'Chef signature culinary recipe'}
                </span>
              </div>
            </div>

            {/* Option Groups */}
            {optionGroups.length > 0 && (
              <div className="space-y-3 pt-2">
                {optionGroups.map((group) => (
                  <div key={group.id} className="border border-[#924E00]/10 rounded-2xl p-3.5 bg-white shadow-xs">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-serif font-bold text-xs text-[#924E00]">{group.name}</span>
                      <span className="text-[10px] text-[#924E00]/60 uppercase font-semibold">
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
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all border cursor-pointer ${
                              isSelected
                                ? 'bg-[#FFF2D6] border-[#F9A620] text-[#924E00] font-bold shadow-xs'
                                : 'bg-white hover:bg-[#FFF7E6] border-[#924E00]/10 text-[#924E00]/80'
                            }`}
                          >
                            <span>{opt.name}</span>
                            <span className="font-semibold text-[#F9A620]">
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
          <div className="p-4 bg-[#FFF7E6] border-t border-[#924E00]/10 space-y-2.5">
            {dish.is_available ? (
              <div className="flex items-center space-x-3">
                {/* Quantity Selector */}
                <div className="flex items-center bg-white rounded-xl border border-[#924E00]/15 p-1 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-[#FFF7E6] hover:bg-[#FFF2D6] flex items-center justify-center text-[#924E00] transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#924E00]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-[#FFF7E6] hover:bg-[#FFF2D6] flex items-center justify-center text-[#924E00] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#F9A620] hover:bg-[#e89512] active:scale-[0.98] text-white font-medium py-3 px-4 rounded-xl shadow-xs flex items-center justify-between text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <ShoppingBag className="w-4 h-4 text-white" />
                    <span>+ {t.add}</span>
                  </div>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </button>
              </div>
            ) : (
              <button
                disabled
                className="w-full bg-white text-[#924E00]/50 font-bold py-3 px-4 rounded-xl text-xs cursor-not-allowed text-center border border-[#924E00]/15"
              >
                Currently Unavailable in Kitchen
              </button>
            )}

            {/* Ask AI Button */}
            <button
              type="button"
              onClick={() => onAskAi(dish)}
              className="w-full bg-white hover:bg-[#FFF2D6] text-[#924E00] font-semibold py-2.5 px-4 rounded-xl border border-[#924E00]/15 hover:border-[#F9A620]/40 flex items-center justify-center space-x-1.5 text-xs transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F9A620]" />
              <span>{t.aiSommelier || 'Ask AI Sommelier'}</span>
            </button>
          </div>
        </div>
      </div>

    <ImageLightboxModal
      isOpen={isLightboxOpen}
      dish={dish}
      initialImageIndex={activePhotoIdx}
      onClose={() => setIsLightboxOpen(false)}
      onOpenCart={onOpenCart}
    />
  </>,
  document.body
);
};
