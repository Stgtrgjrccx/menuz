import React, { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { MenuItem } from '../types';
import { getDishPhotos } from '../utils/dishPhotoUtils';

interface DishCardImageGalleryProps {
  dish: MenuItem;
  aspectRatioClass?: string;
  isVeg?: boolean;
  isFav?: boolean;
  onToggleFavorite?: (dishId: string, e: React.MouseEvent) => void;
  cartQuantity?: number;
  onOpenModal: () => void;
  dishNameDisplay?: string;
}

export const DishCardImageGallery: React.FC<DishCardImageGalleryProps> = ({
  dish,
  aspectRatioClass = 'aspect-square',
  isVeg = false,
  isFav = false,
  onToggleFavorite,
  cartQuantity = 0,
  onOpenModal,
  dishNameDisplay,
}) => {
  const photos = useMemo(() => getDishPhotos(dish), [dish]);
  const [activeIdx, setActiveIdx] = useState(0);

  // Swipe gesture & single-tap detection
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const wasSwiping = useRef(false);
  const lastModalOpenTime = useRef<number>(0);

  const triggerOpenModal = () => {
    // 400ms debounce prevents synthetic click from double firing after touch
    if (Date.now() - lastModalOpenTime.current < 400) return;
    lastModalOpenTime.current = Date.now();
    onOpenModal();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    wasSwiping.current = false;
  };

  const handleTouchMove = () => {
    // Keep touchmove clean so subtle finger movement does not cancel clicks
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;
    const elapsed = Date.now() - touchStartTime.current;

    // Only set wasSwiping if there was an actual deliberate horizontal swipe (> 35px)
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
      if (diffX < 0) {
        // Swipe Left -> Next Photo
        setActiveIdx((prev) => (prev + 1) % photos.length);
      } else {
        // Swipe Right -> Prev Photo
        setActiveIdx((prev) => (prev - 1 + photos.length) % photos.length);
      }
      wasSwiping.current = true;
    } else if (Math.abs(diffX) < 18 && Math.abs(diffY) < 18 && elapsed < 450) {
      // Direct clean single tap (< 18px jitter, < 450ms) -> Open modal immediately on 1 tap!
      wasSwiping.current = false;
      triggerOpenModal();
    } else {
      wasSwiping.current = false;
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (wasSwiping.current) {
      e.stopPropagation();
      wasSwiping.current = false;
      return;
    }
    triggerOpenModal();
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % photos.length);
  };

  return (
    <div
      onClick={handleCardClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full ${aspectRatioClass} rounded-xl sm:rounded-2xl overflow-hidden bg-[#18171a] border border-white/10 group-hover:border-[#ffb955]/60 transition-all duration-300 shadow-xl group-hover:shadow-[0_16px_36px_-6px_rgba(255,185,85,0.3)] select-none cursor-pointer`}
    >
      {/* Active Photo */}
      <img
        key={activeIdx}
        src={photos[activeIdx] || dish.image_url}
        alt={dishNameDisplay || dish.name}
        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        loading="lazy"
      />

      {/* Ambient Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

      {/* Top Left Veg / Non-Veg Indicator & Badges */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 sm:gap-1.5 z-20 pointer-events-none">
        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-black/70 backdrop-blur-md p-0.5 border border-white/15 flex items-center justify-center shadow">
          <div
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 border ${
              isVeg ? 'border-emerald-500' : 'border-red-500'
            } rounded-xs flex items-center justify-center`}
          >
            <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
          </div>
        </div>
        {dish.is_signature && (
          <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-[8px] sm:text-[9px] font-mono text-[#ffb955] font-bold border border-[#ffb955]/30 shadow">
            ★ SIGNATURE
          </span>
        )}
        {dish.is_bestseller && !dish.is_signature && (
          <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-[8px] sm:text-[9px] font-mono text-[#ffb955] font-bold border border-white/15 shadow">
            Chef's Pick
          </span>
        )}
        {dish.is_chef_recommended && !dish.is_signature && !dish.is_bestseller && (
          <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-[8px] sm:text-[9px] font-mono text-[#e5e1e4] font-medium border border-white/15 shadow">
            Special
          </span>
        )}
      </div>

      {/* Top Right Favorite Button */}
      {onToggleFavorite && (
        <button
          type="button"
          aria-label="Favorite"
          onClick={(e) => onToggleFavorite(dish.id, e)}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => {
            e.stopPropagation();
            onToggleFavorite(dish.id, e as any);
          }}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center transition-colors cursor-pointer z-20 ${
            isFav ? 'text-red-500' : 'text-white/70 hover:text-red-400'
          }`}
        >
          <span
            className="material-symbols-outlined text-[14px] sm:text-[16px]"
            style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
      )}

      {/* Desktop Hover Next / Prev Arrow Buttons */}
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            onTouchStart={(e) => e.stopPropagation()}
            aria-label="Previous photo"
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/60 hover:bg-black/85 text-white/80 hover:text-white backdrop-blur-md border border-white/15 hidden md:group-hover:flex items-center justify-center transition-opacity cursor-pointer z-20 shadow-md"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            onTouchStart={(e) => e.stopPropagation()}
            aria-label="Next photo"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/60 hover:bg-black/85 text-white/80 hover:text-white backdrop-blur-md border border-white/15 hidden md:group-hover:flex items-center justify-center transition-opacity cursor-pointer z-20 shadow-md"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </>
      )}

      {/* ── PAGINATION DOTS TOGGLE (EXACTLY AS IN THE VIDEO AT BOTTOM RIGHT) ── */}
      {photos.length > 1 && (
        <div
          className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 z-20 shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            setActiveIdx((prev) => (prev + 1) % photos.length);
          }}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => {
            e.stopPropagation();
            setActiveIdx((prev) => (prev + 1) % photos.length);
          }}
          title="Toggle photos"
        >
          {photos.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIdx(dotIdx);
              }}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => {
                e.stopPropagation();
                setActiveIdx(dotIdx);
              }}
              className={`transition-all duration-200 cursor-pointer ${
                activeIdx === dotIdx
                  ? 'w-2 sm:w-2.5 h-1 sm:h-1.5 rounded-full bg-white shadow-xs'
                  : 'w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Photo ${dotIdx + 1} of ${photos.length}`}
            />
          ))}
        </div>
      )}

      {/* Cart Quantity Indicator if already in table tray (placed bottom left so it does not collide with toggle) */}
      {cartQuantity > 0 && (
        <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 px-2 py-0.5 rounded-full bg-[#ffb955] text-black font-mono font-bold text-[10px] sm:text-xs shadow-lg flex items-center gap-1 z-20">
          <ShoppingBag className="w-3 h-3" />
          <span>{cartQuantity} in tray</span>
        </div>
      )}
    </div>
  );
};
