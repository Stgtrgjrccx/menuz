import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Flame, 
  Sparkles, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Wine, 
  UtensilsCrossed, 
  Check, 
  Scale, 
  ShieldCheck, 
  Layers, 
  ArrowLeft 
} from 'lucide-react';
import { MenuItem, SelectedOptionSnapshot } from '../types';
import { useRestaurantStore } from '../store/restaurantStore';
import { TRANSLATIONS, getTranslatedDish } from '../utils/i18n';
import { getDishPhotos, getDishGalleryImages } from '../utils/dishPhotoUtils';

interface SpatialDishShowroomModalProps {
  dish: MenuItem | null;
  onClose: () => void;
  onAskAi: (dish: MenuItem) => void;
  onOpenCart: () => void;
  categoryName?: string;
  tableLabel?: string;
}

export const SpatialDishShowroomModal: React.FC<SpatialDishShowroomModalProps> = ({
  dish,
  onClose,
  onAskAi,
  onOpenCart,
  categoryName,
  tableLabel,
}) => {
  const selectedLanguage = useRestaurantStore((state) => state.selectedLanguage);
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;
  const addItemToCart = useRestaurantStore((state) => state.addItemToCart);

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, SelectedOptionSnapshot>>({});
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [addedPuff, setAddedPuff] = useState(false);

  // Pull / Scroll Down to Minimize tracking
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [pullY, setPullY] = useState(0);
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const isPullingDown = useRef(false);
  const hasTriggeredClose = useRef(false);

  // Multi-channel Wheel listener (Desktop Mouse Wheel Down & Trackpad Pull-down)
  useEffect(() => {
    hasTriggeredClose.current = false;

    const handleGlobalWheel = (e: WheelEvent) => {
      if (hasTriggeredClose.current) return;
      const scrollTop = scrollContainerRef.current ? scrollContainerRef.current.scrollTop : 0;
      // When at top boundary of the modal:
      if (scrollTop <= 15) {
        // Scrolling down (standard mouse wheel down deltaY > 15) OR trackpad pull-down (deltaY < -15)
        if (e.deltaY > 15 || e.deltaY < -15) {
          hasTriggeredClose.current = true;
          onClose();
        }
      }
    };

    window.addEventListener('wheel', handleGlobalWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleGlobalWheel);
    };
  }, [onClose]);

  // Multi-channel Touch listener (Mobile Drag/Swipe from Up to Down)
  useEffect(() => {
    let startY = 0;
    let startX = 0;
    let canPull = false;

    const onGlobalTouchStart = (e: TouchEvent) => {
      const scrollTop = scrollContainerRef.current ? scrollContainerRef.current.scrollTop : 0;
      if (scrollTop <= 20) {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
        canPull = true;
      } else {
        canPull = false;
      }
    };

    const onGlobalTouchMove = (e: TouchEvent) => {
      if (!canPull) return;
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = currentY - startY;
      const diffX = currentX - startX;

      // Downward drag (scrolling from up to down)
      if (diffY > 12 && diffY > Math.abs(diffX)) {
        setPullY(Math.min(diffY * 0.8, 200));
      }
    };

    const onGlobalTouchEnd = (e: TouchEvent) => {
      if (!canPull) return;
      const currentY = e.changedTouches[0].clientY;
      const diffY = currentY - startY;
      if (diffY > 30 && !hasTriggeredClose.current) {
        hasTriggeredClose.current = true;
        onClose();
      }
      setPullY(0);
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
  }, [onClose]);

  // Reset internal state when a new dish is opened
  useEffect(() => {
    if (dish) {
      setQuantity(1);
      setSelectedOptions({});
      setActivePhotoIdx(0);
      setAddedPuff(false);
      setPullY(0);
      hasTriggeredClose.current = false;
    }
  }, [dish?.id]);

  // Handle ESC key to smoothly fly back to the menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!dish) return null;

  const tDish = getTranslatedDish(dish, selectedLanguage);

  // Collect available photo angles (guaranteed multiple photos for every dish)
  const photos = useMemo(() => {
    return getDishGalleryImages(dish);
  }, [dish]);

  const currentPhoto = photos[activePhotoIdx]?.src || dish.image_url;

  // Dietary and spice attributes
  const flags = Array.isArray(dish.dietary_flags) 
    ? dish.dietary_flags.map((f) => String(f).toLowerCase().replace(/[-_ ]/g, '')) 
    : [];
  const isVeg = (flags.some((f) => f.includes('veg') || f.includes('vegetarian') || f.includes('vegan') || f.includes('jain'))) 
    && !flags.some((f) => f.includes('nonveg'));

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
      image_url: currentPhoto || dish.image_url,
      selected_options: Object.values(selectedOptions),
    });

    setAddedPuff(true);
    setTimeout(() => {
      onClose();
      onOpenCart();
    }, 400);
  };

  return createPortal(
    <AnimatePresence>
      <div 
        ref={scrollContainerRef}
        className="fixed inset-0 z-50 overflow-y-auto bg-[#0a090b]/95 backdrop-blur-xl flex flex-col items-center justify-start select-none"
        style={{
          transform: pullY > 0 ? `translateY(${pullY}px)` : undefined,
          opacity: pullY > 0 ? Math.max(0.4, 1 - pullY / 350) : 1,
          transition: pullY === 0 ? 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out' : 'none',
        }}
      >
        
        {/* Ambient Dark Slate Background with Warm Culinary Light Spotlight */}
        <div 
          className="fixed inset-0 pointer-events-none -z-10 opacity-75"
          style={{
            backgroundImage: `
              radial-gradient(circle at 45% 35%, rgba(255, 185, 85, 0.10) 0%, rgba(20, 19, 21, 0.85) 55%, #080709 100%),
              linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 60px 60px, 60px 60px'
          }}
        />

        {/* Top Studio Bar - Sticky at Top of Screen */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="sticky top-0 z-50 w-full bg-[#0d0c0e]/95 backdrop-blur-md border-b border-white/10 shadow-lg px-4 pt-1.5 pb-3"
        >
          {/* Pull Down to Minimize Handle Bar */}
          <motion.div 
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.y > 20 || info.velocity.y > 100) {
                onClose();
              }
            }}
            onClick={onClose}
            className="w-full flex flex-col items-center justify-center pt-0.5 pb-2 cursor-pointer group touch-none"
            title="Scroll down, pull down, or click to minimize"
          >
            <div className="w-16 sm:w-20 h-1.5 rounded-full bg-[#ffb955]/50 group-hover:bg-[#ffb955] transition-all shadow-[0_0_8px_rgba(255,185,85,0.4)]" />
            <span className="text-[10px] font-mono text-[#ffb955]/80 group-hover:text-[#ffb955] transition-colors mt-1 font-semibold flex items-center gap-1">
              <span>↓</span> Scroll or pull down to minimize
            </span>
          </motion.div>

          <div className="w-full max-w-6xl mx-auto flex items-center justify-between text-xs font-mono tracking-wider text-[#ab8980]">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                type="button"
                className="group flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffb955]/15 hover:bg-[#ffb955] text-[#ffb955] hover:text-black border border-[#ffb955]/40 hover:border-[#ffb955] transition-all cursor-pointer shadow-md active:scale-95 font-sans font-bold text-xs"
                aria-label="Back to Menu"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="uppercase tracking-wider">Back to Menu</span>
              </button>
              <span className="hidden sm:inline-block text-white/20">•</span>
              <span className="hidden sm:inline-block text-[#ffb955] font-semibold uppercase">
                SERIES 01 / CULINARY SHOWROOM
              </span>
              {categoryName && (
                <>
                  <span className="hidden md:inline-block text-white/20">•</span>
                  <span className="hidden md:inline-block uppercase text-[#e5e1e4]/70">{categoryName}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              {tableLabel && (
                <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-black/40 border border-white/10 text-[#ab8980]">
                  {tableLabel}
                </span>
              )}
              <button
                onClick={onClose}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#e5e1e4] hover:text-white border border-white/15 transition-colors cursor-pointer text-xs font-sans font-semibold"
                aria-label="Close"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>
          </div>
        </motion.header>

        {/* Main Stage Grid: Spatial Hero Stage on Left, Brutalist Specs on Right */}
        <div className="w-full max-w-6xl flex-1 flex flex-col md:flex-row items-center md:items-start justify-center gap-4 sm:gap-6 lg:gap-10 p-4 sm:p-6 md:p-8 my-2 md:my-auto">
          
          {/* ── LEFT: Spatial Hero Plinth & Edge-Lit Floating Shelf ── */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative">
            
            {/* The Floating Canvas with Framer Motion Shared Element */}
            <motion.div
              layoutId={`dish-frame-${dish.id}`}
              className="relative w-full aspect-square max-w-[270px] sm:max-w-md lg:max-w-lg rounded-2xl overflow-hidden bg-[#161517] border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] group"
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            >
              {/* Hero Dish Image */}
              <motion.img
                layoutId={`dish-img-${dish.id}`}
                src={currentPhoto}
                alt={tDish.name || dish.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              />

              {/* Monolithic Ambient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

              {/* Floating Culinary Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                {/* Veg / Non-Veg Indicator */}
                <div className="w-6 h-6 rounded bg-black/70 backdrop-blur-md p-1 border border-white/15 flex items-center justify-center shadow-lg">
                  <div className={`w-3.5 h-3.5 border ${isVeg ? 'border-emerald-500' : 'border-red-500'} rounded-xs flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  </div>
                </div>

                {dish.is_signature && (
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#ffb955]/40 text-[11px] font-mono tracking-wider font-semibold text-[#ffb955] uppercase shadow-lg">
                    ★ Signature
                  </span>
                )}
                {dish.is_bestseller && !dish.is_signature && (
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-mono tracking-wider font-semibold text-[#e5e1e4] uppercase shadow-lg">
                    Chef's Choice
                  </span>
                )}
              </div>

              {/* Status Indicator if Sold Out */}
              {!dish.is_available && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center">
                  <span className="px-4 py-2 bg-red-600/90 text-white font-mono text-xs uppercase tracking-widest font-bold rounded-lg border border-red-400 shadow-2xl">
                    Sold Out for this Session
                  </span>
                </div>
              )}
            </motion.div>

            {/* ── THE ILLUMINATED GLASS SHELF / PLINTH (LAST DEPT. EFFECT) ── */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="w-full max-w-lg mt-3 flex flex-col items-center"
            >
              {/* Intense Golden LED Shelf Beam Line */}
              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#ffb955] to-transparent shadow-[0_0_24px_rgba(255,185,85,0.85)]" />
              
              {/* Cantilevered Glass Lip Reflection */}
              <div className="w-[94%] h-2.5 bg-gradient-to-b from-[#ffb955]/15 to-transparent backdrop-blur-md border-b border-white/5 rounded-b-md" />

              {/* Multi-Angle Photo Selector (If available) */}
              {photos.length > 1 && (
                <div className="w-full mt-4 flex items-center justify-between px-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#ab8980]">
                    Perspective Angles ({photos.length})
                  </span>
                  <div className="flex items-center gap-2">
                    {photos.map((p, idx) => (
                      <button
                        key={`angle-${idx}`}
                        type="button"
                        onClick={() => setActivePhotoIdx(idx)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-all cursor-pointer ${
                          activePhotoIdx === idx
                            ? 'bg-[#ffb955] text-black font-bold border-[#ffb955]'
                            : 'bg-white/5 text-[#ab8980] border-white/10 hover:border-white/20'
                        }`}
                      >
                        0{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* ── RIGHT: Brutalist Luxury Specs & Ordering Canvas ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-1/2 flex flex-col justify-between bg-[#131215]/90 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 lg:p-8 shadow-2xl text-[#e5e1e4] md:max-h-[82vh] md:overflow-y-auto"
          >
            <div>
              {/* Category & Serial Code */}
              <div className="flex items-center justify-between text-xs font-mono text-[#ab8980] border-b border-white/10 pb-3">
                <span className="uppercase text-[#ffb955] tracking-widest">
                  SILHOUETTE REF // {dish.id.slice(0, 8).toUpperCase()}
                </span>
                <span className="text-[11px]">{isVeg ? 'VEGETARIAN' : 'NON-VEG'}</span>
              </div>

              {/* Title & Price */}
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#f5f1ea] tracking-tight leading-tight">
                  {tDish.name || dish.name}
                </h1>
                <div className="text-right flex-shrink-0">
                  <span className="text-2xl font-mono font-bold text-[#ffb955]">
                    ₹{unitPrice}
                  </span>
                </div>
              </div>

              {/* Description / Culinary Notes */}
              <p className="mt-3 text-xs md:text-sm text-[#ab8980] leading-relaxed font-sans">
                {tDish.full_description || dish.full_description || tDish.short_description || dish.short_description}
              </p>

              {/* Chef Lore / Sourcing Story */}
              {(dish.chef_story || dish.chef_notes) && (
                <div className="mt-4 p-3 rounded-xl bg-black/40 border border-[#ffb955]/20 text-xs">
                  <span className="font-mono text-[10px] text-[#ffb955] uppercase tracking-wider block mb-1">
                    ✦ Chef's Preparation Lore:
                  </span>
                  <p className="italic text-[#e5e1e4]/90 text-[11px] leading-relaxed">
                    "{dish.chef_story || dish.chef_notes}"
                  </p>
                </div>
              )}

              {/* Architectural Specs Row: Spice Calibration + Portion */}
              <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs">
                {/* Spice Meter */}
                <div className="bg-black/30 rounded-xl p-2.5 border border-white/5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#ab8980]">
                    <span className="flex items-center gap-1 text-[#ff5722]">
                      <Flame className="w-3.5 h-3.5" />
                      <span>Heat Scale</span>
                    </span>
                    <span className="font-bold text-white">{dish.spice_level || 0}/5</span>
                  </div>
                  {/* Visual 5-segment ember bars */}
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={`spice-${lvl}`}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          lvl <= (dish.spice_level || 0)
                            ? 'bg-gradient-to-r from-[#ffb955] to-[#ff5722] shadow-[0_0_8px_rgba(255,87,34,0.6)]'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Serving Scale */}
                <div className="bg-black/30 rounded-xl p-2.5 border border-white/5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#ab8980]">
                    <span className="flex items-center gap-1 text-[#ffb955]">
                      <Scale className="w-3.5 h-3.5" />
                      <span>Portion</span>
                    </span>
                    <span className="font-bold text-white">{dish.serving_size || '1 Portion'}</span>
                  </div>
                  <div className="mt-2 text-[10px] text-[#ab8980] truncate font-mono">
                    Calibrated for dining
                  </div>
                </div>
              </div>

              {/* Contextual Sommelier Pairing (LAST DEPT. upsell style) */}
              {dish.pairing_drink_name && (
                <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-black/50 via-[#ffb955]/5 to-black/50 border border-[#ffb955]/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#ffb955]/10 border border-[#ffb955]/30 flex items-center justify-center flex-shrink-0">
                      <Wine className="w-4 h-4 text-[#ffb955]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#ffb955] block">
                        Sommelier Recommendation
                      </span>
                      <span className="text-xs font-bold text-white">
                        Pairs with {dish.pairing_drink_name}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAskAi(dish)}
                    className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-[#ffb955] text-black font-bold hover:bg-[#ffa726] transition-colors cursor-pointer"
                  >
                    View Pairing
                  </button>
                </div>
              )}

              {/* Customization Options (if any) */}
              {optionGroups.length > 0 && (
                <div className="mt-5 space-y-3 pt-3 border-t border-white/10">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#ab8980] block">
                    Preparation Specifications:
                  </span>
                  {optionGroups.map((group) => (
                    <div key={group.id} className="space-y-1.5">
                      <span className="text-xs font-semibold text-[#e5e1e4]">{group.name}</span>
                      <div className="grid grid-cols-2 gap-2">
                        {group.options.map((opt) => {
                          const isSelected = selectedOptions[group.id]?.option_id === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleOptionToggle(group.id, opt.id, opt.name, opt.price_modifier)}
                              className={`p-2 rounded-lg text-left text-xs border transition-all cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? 'bg-[#ffb955]/15 border-[#ffb955] text-[#ffb955] font-semibold'
                                  : 'bg-black/30 border-white/10 text-[#ab8980] hover:border-white/20'
                              }`}
                            >
                              <span>{opt.name}</span>
                              {opt.price_modifier > 0 && (
                                <span className="font-mono text-[10px] opacity-80">+₹{opt.price_modifier}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sourcing & Allergen Guarantee */}
              {(ingredients.length > 0 || allergens.length > 0) && (
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-[#ab8980] font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    {allergens.length > 0 
                      ? `Allergens: ${allergens.join(', ')}` 
                      : 'Verified allergen-safe & prepared in dedicated kitchen station.'}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Actions Row: Quantity Stepper, Add to Tray, Ask AI */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center bg-black/50 border border-white/10 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#e5e1e4] hover:bg-white/10 disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-sm text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#e5e1e4] hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Main Brutalist Add to Cart Button */}
                <button
                  type="button"
                  disabled={!dish.is_available}
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-5 rounded-xl font-mono text-xs md:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl ${
                    dish.is_available
                      ? addedPuff
                        ? 'bg-emerald-500 text-black scale-98 shadow-emerald-500/20'
                        : 'bg-[#ffb955] hover:bg-[#ffa726] text-black hover:shadow-[#ffb955]/20 active:scale-98'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {addedPuff 
                      ? 'Added to Tray ✓' 
                      : dish.is_available 
                        ? `Add to Table Tray • ₹${totalPrice}` 
                        : 'Currently Unavailable'}
                  </span>
                </button>
              </div>

              {/* Quick AI Sommelier Question Chip */}
              <button
                type="button"
                onClick={() => onAskAi(dish)}
                className="w-full py-2 px-3 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-[#ffb955]/30 text-xs font-mono text-[#ab8980] hover:text-[#ffb955] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ffb955]" />
                <span>Ask AI Sommelier about spice & ingredients</span>
              </button>

              {/* Prominent Secondary Back to Menu Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Back to Full Menu"
                className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#ffb955]/40 text-xs font-mono font-semibold text-[#e5e1e4] hover:text-[#ffb955] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-[#ffb955]" />
                <span>Back to Full Menu</span>
              </button>
            </div>

          </motion.div>
        </div>

      </div>
    </AnimatePresence>,
    document.body
  );
};

