import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Flame,
  Plus,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { MenuItem } from '../types';
import { useRestaurantStore } from '../store/restaurantStore';

interface ImageLightboxModalProps {
  isOpen: boolean;
  dish: MenuItem | null;
  initialImageIndex?: number;
  onClose: () => void;
  onOpenCart?: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  dish,
  initialImageIndex = 0,
  onClose,
  onOpenCart,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);
  const [zoomScale, setZoomScale] = useState(1);
  const addItemToCart = useRestaurantStore((state) => state.addItemToCart);

  // Collect all images for the dish
  const allImages = React.useMemo(() => {
    if (!dish) return [];
    const list: Array<{ src: string; alt?: string; label?: string; code?: string }> = [];

    if (dish.image_url) {
      list.push({
        src: dish.image_url,
        alt: `${dish.name} - Signature Plating`,
        label: `${dish.name} - Signature Plating`,
        code: '# 01 Primary',
      });
    }

    if (Array.isArray(dish.gallery_images)) {
      dish.gallery_images.forEach((img, idx) => {
        // avoid exact duplicate of main image
        if (img.src !== dish.image_url) {
          list.push({
            src: img.src,
            alt: img.alt || `${dish.name} - Angle ${idx + 2}`,
            label: img.label || `${dish.name} - Perspective ${idx + 2}`,
            code: img.code || `# 0${list.length + 1}`,
          });
        }
      });
    }

    return list;
  }, [dish]);

  // Sync index when initialImageIndex or dish changes
  useEffect(() => {
    if (initialImageIndex >= 0 && initialImageIndex < allImages.length) {
      setCurrentIndex(initialImageIndex);
    } else {
      setCurrentIndex(0);
    }
    setZoomScale(1);
  }, [initialImageIndex, allImages.length, dish?.id]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % (allImages.length || 1));
        setZoomScale(1);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + allImages.length) % (allImages.length || 1));
        setZoomScale(1);
      } else if (e.key === '+' || e.key === '=') {
        setZoomScale((prev) => Math.min(prev + 0.5, 3));
      } else if (e.key === '-') {
        setZoomScale((prev) => Math.max(prev - 0.5, 1));
      }
    },
    [isOpen, allImages.length, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen || !dish || allImages.length === 0) return null;

  const currentImage = allImages[currentIndex] || allImages[0];
  const flags = Array.isArray(dish.dietary_flags) ? dish.dietary_flags : [];
  const isVeg = flags.some((f) => {
    const lf = String(f).toLowerCase();
    return lf === 'veg' || lf === 'vegetarian' || lf === 'vegan' || lf === 'jain';
  });

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 0.5, 1));
  const handleResetZoom = () => setZoomScale(1);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
    setZoomScale(1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setZoomScale(1);
  };

  const handleQuickAdd = () => {
    if (!dish.is_available) return;
    addItemToCart({
      menu_item_id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      image_url: dish.image_url,
      selected_options: [],
    });
    onClose();
    if (onOpenCart) onOpenCart();
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between select-none touch-none overflow-hidden"
        onClick={onClose}
      >
        {/* Top Floating Control Header */}
        <div
          className="relative z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Dish info & badge */}
          <div className="flex items-center space-x-3 min-w-0">
            <span
              className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center flex-shrink-0 ${
                isVeg ? 'border-emerald-500' : 'border-red-500'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
            </span>
            <div className="min-w-0">
              <h2 className="font-serif font-bold text-sm sm:text-base text-white truncate drop-shadow">
                {dish.name}
              </h2>
              <div className="flex items-center space-x-2 text-[11px] text-amber-300 font-semibold">
                <span>₹{dish.price.toFixed(2)}</span>
                {allImages.length > 1 && (
                  <span className="text-slate-400 font-normal">
                    • Photo {currentIndex + 1} of {allImages.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Zoom controls & Close */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            {/* Zoom Out */}
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomScale <= 1}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white disabled:opacity-30 disabled:hover:bg-white/10 transition-colors cursor-pointer"
              title="Zoom out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            {/* Zoom Level Indicator / Reset */}
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-mono font-bold text-amber-300 border border-white/10 transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              {Math.round(zoomScale * 100)}%
            </button>

            {/* Zoom In */}
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomScale >= 3}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white disabled:opacity-30 disabled:hover:bg-white/10 transition-colors cursor-pointer"
              title="Zoom in (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/15 hover:bg-red-500/80 text-white transition-colors cursor-pointer ml-1"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Central Viewport & Image */}
        <div
          className="relative flex-1 flex items-center justify-center overflow-hidden px-2 sm:px-8 py-2"
          onClick={(e) => {
            // Clicking central area toggles 1x -> 1.8x zoom or resets
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          {/* Previous Arrow Button */}
          {allImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-2xl active:scale-95 transition-all cursor-pointer backdrop-blur-md"
              title="Previous photo"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Animated Zoomable Image Container */}
          <motion.div
            key={currentImage.src}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: zoomScale }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative max-w-4xl max-h-[70vh] sm:max-h-[75vh] flex items-center justify-center cursor-zoom-in"
            onClick={(e) => {
              e.stopPropagation();
              setZoomScale((prev) => (prev === 1 ? 1.8 : 1));
            }}
          >
            <img
              src={currentImage.src}
              alt={currentImage.alt || dish.name}
              className="max-h-[68vh] sm:max-h-[72vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 select-none pointer-events-auto"
              draggable={false}
            />

            {/* Label overlay on bottom right of the image */}
            {currentImage.label && (
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20 shadow-md">
                  {currentImage.label}
                </span>
                {currentImage.code && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono text-[10px] font-bold shadow-md">
                    {currentImage.code}
                  </span>
                )}
              </div>
            )}
          </motion.div>

          {/* Next Arrow Button */}
          {allImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-2xl active:scale-95 transition-all cursor-pointer backdrop-blur-md"
              title="Next photo"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>

        {/* Bottom Floating Bar with Thumbnails & Quick Order CTA */}
        <div
          className="relative z-20 px-4 py-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent space-y-2 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Thumbnails Gallery Strip if multiple images */}
          {allImages.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-none">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx);
                    setZoomScale(1);
                  }}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105 opacity-100'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.src} alt={img.alt || `Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-center text-amber-200 font-mono py-0.2">
                    #{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Description & Add to Order Bar */}
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3 pt-1">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-300 line-clamp-1">
                {dish.short_description || dish.full_description || 'Master Chef Signature Dish'}
              </p>
              {dish.chef_notes && (
                <p className="text-[10px] text-amber-300/90 truncate mt-0.5">
                  ✨ <strong>Chef's Note:</strong> {dish.chef_notes}
                </p>
              )}
            </div>

            {dish.is_available ? (
              <button
                type="button"
                onClick={handleQuickAdd}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-slate-950 text-xs font-bold rounded-xl shadow-xl flex items-center space-x-1.5 flex-shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add • ₹{dish.price.toFixed(2)}</span>
              </button>
            ) : (
              <span className="px-3 py-1.5 bg-red-600/80 text-white text-[11px] font-bold rounded-xl">
                Sold Out
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
