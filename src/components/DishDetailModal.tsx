import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Flame, Sparkles, ShoppingBag, Plus, Minus, Maximize2, ArrowLeft } from 'lucide-react';
import { MenuItem, SelectedOptionSnapshot } from '../types';
import { useRestaurantStore } from '../store/restaurantStore';
import { DishHoverExpandGallery } from './DishHoverExpandGallery';
import { ImageLightboxModal } from './ImageLightboxModal';
import { TRANSLATIONS, getTranslatedDish } from '../utils/i18n';
import { getDishPhotos } from '../utils/dishPhotoUtils';

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

  // Pull / Scroll Down to Minimize tracking
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [pullY, setPullY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const closingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredClose = useRef(false);
  const mountTime = useRef(0);

  // Smooth graceful close with 1-2s (1.4s) toggle/minimize transition
  const triggerSmoothClose = useCallback(() => {
    if (hasTriggeredClose.current) return;
    hasTriggeredClose.current = true;
    setIsClosing(true);

    closingTimerRef.current = setTimeout(() => {
      onClose();
    }, 1400);
  }, [onClose]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (closingTimerRef.current) {
        clearTimeout(closingTimerRef.current);
      }
    };
  }, []);

  // Extract all photos attached to dish (guaranteed 3-4 photos) - called unconditionally
  const dishPhotos = useMemo(() => (dish ? getDishPhotos(dish) : []), [dish]);
  const modalPhotos: { src: string; label?: string }[] = useMemo(
    () =>
      dishPhotos.map((src, idx) => ({
        src,
        label: idx === 0 ? 'Main View' : `View 0${idx + 1}`
      })),
    [dishPhotos]
  );

  // Multi-channel Wheel listener (Desktop Trackpad Pull-down at top)
  useEffect(() => {
    if (!dish) return;
    mountTime.current = Date.now();
    hasTriggeredClose.current = false;

    const handleGlobalWheel = (e: WheelEvent) => {
      if (Date.now() - mountTime.current < 450) return;
      if (hasTriggeredClose.current || isClosing) return;
      const scrollTop = scrollContainerRef.current ? scrollContainerRef.current.scrollTop : 0;
      if (scrollTop <= 0 && e.deltaY < -35) {
        triggerSmoothClose();
      }
    };

    window.addEventListener('wheel', handleGlobalWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleGlobalWheel);
    };
  }, [dish, isClosing, triggerSmoothClose]);

  // Multi-channel Touch listener (Mobile Drag/Swipe from Top to Bottom)
  useEffect(() => {
    if (!dish) return;
    let startY = 0;
    let startX = 0;
    let canPull = false;

    const onGlobalTouchStart = (e: TouchEvent) => {
      if (Date.now() - mountTime.current < 450 || isClosing) return;
      const clientY = e.touches[0].clientY;
      const scrollTop = scrollContainerRef.current ? scrollContainerRef.current.scrollTop : 0;
      if (clientY < 180 || scrollTop <= 5) {
        startY = clientY;
        startX = e.touches[0].clientX;
        canPull = true;
      } else {
        canPull = false;
      }
    };

    const onGlobalTouchMove = (e: TouchEvent) => {
      if (!canPull || isClosing) return;
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = currentY - startY;
      const diffX = currentX - startX;

      if (diffY > 15 && diffY > Math.abs(diffX) * 1.3) {
        setPullY(Math.min(diffY * 0.75, 220));
      }
    };

    const onGlobalTouchEnd = (e: TouchEvent) => {
      if (!canPull || isClosing) return;
      const currentY = e.changedTouches[0].clientY;
      const diffY = currentY - startY;
      if (diffY > 70 && !hasTriggeredClose.current) {
        triggerSmoothClose();
      } else {
        setPullY(0);
      }
      canPull = false;
    };

    window.addEventListener('touchstart', onGlobalTouchStart, { passive: true });
    window.addEventListener('touchmove', onGlobalTouchMove, { passive: true });
    window.addEventListener('touchend', onGlobalTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onGlobalTouchStart);
      window.removeEventListener('touchmove', onGlobalTouchMove);
      window.removeEventListener('touchend', onGlobalTouchEnd);
    };
  }, [dish, isClosing, triggerSmoothClose]);

  // Reset internal state when a new dish is opened
  useEffect(() => {
    if (dish) {
      if (closingTimerRef.current) {
        clearTimeout(closingTimerRef.current);
      }
      setIsClosing(false);
      setQuantity(1);
      setSelectedOptions({});
      setActivePhotoIdx(0);
      setPullY(0);
      hasTriggeredClose.current = false;
    }
  }, [dish?.id]);

  if (!dish) return null;

  const tDish = getTranslatedDish(dish, selectedLanguage);
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
      <div 
        onClick={triggerSmoothClose}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center"
        style={{
          opacity: isClosing ? 0 : 1,
          transition: isClosing ? 'opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'opacity 0.25s ease-out',
          pointerEvents: isClosing ? 'none' : 'auto',
        }}
      >
        <div 
          ref={scrollContainerRef}
          style={{
            transform: isClosing
              ? 'translateY(100%) scale(0.95)'
              : pullY > 0
              ? `translateY(${pullY}px)`
              : undefined,
            opacity: isClosing
              ? 0
              : pullY > 0
              ? Math.max(0.4, 1 - pullY / 300)
              : 1,
            transition: isClosing
              ? 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1)'
              : pullY === 0
              ? 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease-out'
              : 'none',
          }}
          className="bg-[#FFFFFF] text-[#141414] rounded-t-3xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200 border border-black/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pull Down Indicator Handle with 1-2s Toggle Animation */}
          <motion.div 
            drag={isClosing ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.y > 40 || info.velocity.y > 180) {
                triggerSmoothClose();
              }
            }}
            onClick={triggerSmoothClose}
            className="w-full flex flex-col items-center justify-center pt-2 pb-1.5 bg-[#F5F1E8] cursor-pointer group touch-none"
            title="Scroll or pull down to minimize"
          >
            <div className={`w-16 h-1.5 rounded-full transition-all shadow-sm ${isClosing ? 'bg-[#F4511E] scale-110 animate-pulse' : 'bg-[#F4511E]/40 group-hover:bg-[#F4511E]'}`} />
            <span className="text-[10px] font-mono text-[#2D4A3E]/70 group-hover:text-[#2D4A3E] transition-colors mt-0.5 font-semibold flex items-center gap-1.5">
              {isClosing ? (
                <span className="text-[#2D4A3E] animate-pulse">✦ Returning to menu...</span>
              ) : (
                <>
                  <span>↓</span> Scroll or drag down to minimize
                </>
              )}
            </span>
          </motion.div>

          {/* Top Bar with Prominent Back to Menu Button */}
          <div className="relative pt-1.5 pb-2.5 px-4 flex items-center justify-between border-b border-black/10 bg-[#F5F1E8]">
            <button
              type="button"
              onClick={triggerSmoothClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4511E]/15 hover:bg-[#F4511E] text-[#2D4A3E] hover:text-black border border-[#F4511E]/40 hover:border-[#F4511E] font-semibold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Menu</span>
            </button>
            <span className="text-xs font-semibold text-[#2D4A3E] tracking-wider uppercase font-mono hidden sm:inline">Dish Details</span>
            <button
              type="button"
              onClick={triggerSmoothClose}
              className="p-1.5 rounded-full text-[#6E6E6E] hover:bg-black/[0.06] hover:text-[#141414] transition-colors cursor-pointer"
              aria-label="Close"
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
                className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden relative bg-[#F5F1E8] group cursor-pointer border border-black/10 hover:border-[#F4511E]/50 transition-colors shadow-xs"
                title="Click to zoom full-screen"
              >
                <img
                  src={currentHeroPhoto}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                  <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-black/20 flex items-center gap-1">
                    <Maximize2 className="w-3 h-3 text-[#2D4A3E]" />
                    <span>Click to Zoom HD</span>
                  </span>
                  <span className="text-[10px] font-mono bg-black/70 px-2 py-0.5 rounded text-white border border-black/20">
                    Photo {activePhotoIdx + 1} of {modalPhotos.length}
                  </span>
                </div>
                {!dish.is_available && (
                  <div className="absolute inset-0 bg-[#F5F1E8]/80 flex items-center justify-center backdrop-blur-xs">
                    <span className="text-xs uppercase font-bold text-white tracking-widest px-3 py-1.5 bg-red-600 rounded-lg shadow-md">
                      Currently Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Side-by-side / Multi-Photo Thumbnails */}
              {modalPhotos.length > 1 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[#6E6E6E] px-0.5">
                    <span className="font-bold text-[#2D4A3E] flex items-center gap-1">
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
                              ? 'border-[#F4511E] shadow-md ring-2 ring-[#F4511E]/40 scale-105'
                              : 'border-black/10 opacity-70 hover:opacity-100'
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
                <span className="text-xs font-semibold text-[#6E6E6E]">{isVeg ? 'Vegetarian' : 'Non-Vegetarian'}</span>
                
                {dish.spice_level > 0 && (
                  <div className="flex items-center space-x-0.5 text-[#2D4A3E] pl-2 border-l border-black/10">
                    <Flame className="w-3.5 h-3.5 fill-[#F4511E]" />
                    <span className="text-xs font-bold">Spice {dish.spice_level}/5</span>
                  </div>
                )}
                {dish.serving_size && (
                  <span className="text-xs text-[#6E6E6E] pl-2 border-l border-black/10">
                    {dish.serving_size}
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-serif text-2xl font-bold text-[#141414] leading-tight">{tDish.name}</h2>
                <span className="font-bold text-xl text-[#2D4A3E] whitespace-nowrap">₹{dish.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-[#6E6E6E] leading-relaxed mt-2">{tDish.full_description || tDish.short_description}</p>
            </div>

            {/* Heritage Lore & Origin Story */}
            {tDish.chef_story && (
              <div className="bg-[#F5F1E8] border border-[#F4511E]/30 p-4 rounded-2xl space-y-1.5 shadow-xs">
                <div className="flex items-center space-x-1.5 text-[#2D4A3E] text-xs font-serif font-bold">
                  <span>📜</span>
                  <span>{t.chefStoryTitle || 'Culinary Heritage & Origin Lore'}</span>
                </div>
                <p className="text-xs text-[#6E6E6E] leading-relaxed italic font-serif">
                  "{tDish.chef_story}"
                </p>
              </div>
            )}

            {/* Master Chef's Tasting Note */}
            {tDish.chef_notes && (
              <div className="bg-[#F5F1E8] border border-black/10 p-3.5 rounded-2xl space-y-1 text-xs shadow-xs">
                <div className="flex items-center space-x-1.5 text-[#2D4A3E] font-bold">
                  <span>🧑‍🍳</span>
                  <span>{t.tastingNotesTitle || "Master Chef's Tasting Notes"}</span>
                </div>
                <p className="text-[#6E6E6E] leading-relaxed">
                  {tDish.chef_notes}
                </p>
              </div>
            )}

            {/* Founder's Table Pitch */}
            {tDish.owner_pitch && (
              <div className="bg-[#F5F1E8] border border-black/10 p-3.5 rounded-2xl space-y-1 text-xs shadow-xs">
                <div className="flex items-center space-x-1.5 text-[#2D4A3E] font-bold">
                  <span>🎙️</span>
                  <span>Founder's Table Recommendation</span>
                </div>
                <p className="text-[#6E6E6E] leading-relaxed">
                  {tDish.owner_pitch}
                </p>
              </div>
            )}

            {/* Sommelier Beverage Pairing & Serving Technique */}
            {(dish.pairing_drink_name || dish.temperature_style) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {dish.pairing_drink_name && (
                  <div className="bg-[#F5F1E8] border border-black/10 p-3 rounded-2xl space-y-1 text-xs shadow-xs">
                    <div className="flex items-center space-x-1.5 text-[#2D4A3E] font-bold">
                      <span>🍷</span>
                      <span>Ideal Beverage Pairing</span>
                    </div>
                    <p className="font-semibold text-[#141414] text-xs">{dish.pairing_drink_name}</p>
                    {dish.pairing_reason && (
                      <p className="text-[11px] text-[#6E6E6E] leading-snug">{dish.pairing_reason}</p>
                    )}
                  </div>
                )}

                {dish.temperature_style && (
                  <div className="bg-[#F5F1E8] border border-black/10 p-3 rounded-2xl space-y-1 text-xs shadow-xs">
                    <div className="flex items-center space-x-1.5 text-[#2D4A3E] font-bold">
                      <span>🌡️</span>
                      <span>Preparation &amp; Serving Style</span>
                    </div>
                    <p className="font-semibold text-[#141414] text-xs">{dish.temperature_style}</p>
                  </div>
                )}
              </div>
            )}

            {/* Badges */}
            <div className="bg-[#F5F1E8] p-3.5 rounded-2xl space-y-2 text-xs border border-black/10 shadow-xs">
              {flags.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#141414] w-20 flex-shrink-0">Dietary:</span>
                  <div className="flex flex-wrap gap-1">
                    {flags.map((d, idx) => (
                      <span key={idx} className="bg-emerald-950/40 border border-emerald-500/30 text-[#2F7A4F] px-2 py-0.5 rounded-full font-medium text-[11px]">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {allergens.length > 0 ? (
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#141414] w-20 flex-shrink-0">Allergens:</span>
                  <div className="flex flex-wrap gap-1">
                    {allergens.map((a, idx) => (
                      <span key={idx} className="bg-[#F5F1E8] border border-[#F4511E]/30 text-[#141414] px-2 py-0.5 rounded-full font-medium text-[11px]">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#141414] w-20 flex-shrink-0">Allergens:</span>
                  <span className="text-[#6E6E6E] text-[11px]">None declared in kitchen specs</span>
                </div>
              )}

              <div className="flex items-start space-x-2">
                <span className="font-semibold text-[#141414] w-20 flex-shrink-0">Ingredients:</span>
                <span className="text-[#6E6E6E] text-[11px] leading-tight">
                  {ingredients.length > 0 ? ingredients.join(', ') : 'Chef signature culinary recipe'}
                </span>
              </div>
            </div>

            {/* Option Groups */}
            {optionGroups.length > 0 && (
              <div className="space-y-3 pt-2">
                {optionGroups.map((group) => (
                  <div key={group.id} className="border border-black/10 rounded-2xl p-3.5 bg-[#F5F1E8] shadow-xs">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-serif font-bold text-xs text-[#141414]">{group.name}</span>
                      <span className="text-[10px] text-[#6E6E6E] uppercase font-semibold">
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
                                ? 'bg-[#F5F1E8] border-[#F4511E] text-[#141414] font-bold shadow-xs'
                                : 'bg-[#F5F1E8] hover:bg-[#F5F1E8] border-black/10 text-[#6E6E6E]'
                            }`}
                          >
                            <span>{opt.name}</span>
                            <span className="font-semibold text-[#2D4A3E]">
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
          <div className="p-4 bg-[#F5F1E8] border-t border-black/10 space-y-2.5">
            {dish.is_available ? (
              <div className="flex items-center space-x-3">
                {/* Quantity Selector */}
                <div className="flex items-center bg-[#F5F1E8] rounded-xl border border-black/10 p-1 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-[#F5F1E8] hover:bg-[#F5F1E8] flex items-center justify-center text-[#141414] transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#141414]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-[#F5F1E8] hover:bg-[#F5F1E8] flex items-center justify-center text-[#141414] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#F4511E] hover:bg-[#E24A19] active:scale-[0.98] text-white font-medium py-3 px-4 rounded-xl shadow-xs flex items-center justify-between text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <ShoppingBag className="w-4 h-4 text-[#141414]" />
                    <span>+ {t.add}</span>
                  </div>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </button>
              </div>
            ) : (
              <button
                disabled
                className="w-full bg-[#F5F1E8] text-[#141414]/50 font-bold py-3 px-4 rounded-xl text-xs cursor-not-allowed text-center border border-black/10"
              >
                Currently Unavailable in Kitchen
              </button>
            )}

            {/* Ask AI Button */}
            <button
              type="button"
              onClick={() => onAskAi(dish)}
              className="w-full bg-[#F5F1E8] hover:bg-[#F5F1E8] text-[#141414] font-semibold py-2.5 px-4 rounded-xl border border-black/10 hover:border-[#F4511E]/50 flex items-center justify-center space-x-1.5 text-xs transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2D4A3E]" />
              <span>{t.aiSommelier || 'Ask AI Sommelier'}</span>
            </button>

            {/* Bottom Back Button */}
            <button
              type="button"
              onClick={triggerSmoothClose}
              className="w-full bg-black/[0.03] hover:bg-black/[0.06] text-[#141414] hover:text-[#2D4A3E] font-semibold py-2.5 px-4 rounded-xl border border-black/10 flex items-center justify-center gap-2 text-xs transition-all cursor-pointer active:scale-98"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#2D4A3E]" />
              <span>Back to Menu</span>
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
