import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, Sparkles, Layers } from 'lucide-react';
import { cn } from '../lib/utils';
import { DishGalleryImage } from '../types';

interface DishHoverExpandGalleryProps {
  images: DishGalleryImage[];
  dishName: string;
  onEnlargeImage?: (imageSrc: string, imageIndex: number) => void;
  className?: string;
}

export const DishHoverExpandGallery: React.FC<DishHoverExpandGalleryProps> = ({
  images,
  dishName,
  onEnlargeImage,
  className,
}) => {
  const [activeImage, setActiveImage] = useState<number | null>(0);

  if (!images || images.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full space-y-2", className)}
    >
      <div className="flex items-center justify-between text-xs px-1">
        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Culinary Gallery ({images.length} Views)</span>
        </span>
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <span>Tap to expand</span>
          <span className="text-amber-400">•</span>
          <span>Click to zoom</span>
        </span>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-1.5">
        {images.map((image, index) => {
          const isActive = activeImage === index;
          return (
            <motion.div
              key={index}
              className={cn(
                "group relative w-full cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300",
                isActive
                  ? "border-amber-400/60 shadow-xl ring-1 ring-amber-400/20"
                  : "border-white/[0.08] hover:border-amber-500/30 opacity-80 hover:opacity-100"
              )}
              initial={{ height: "3.25rem" }}
              animate={{
                height: isActive ? "16rem" : "3.25rem",
              }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              onClick={() => {
                if (isActive && onEnlargeImage) {
                  onEnlargeImage(image.src, index);
                } else {
                  setActiveImage(index);
                }
              }}
              onHoverStart={() => setActiveImage(index)}
            >
              {/* Image Background */}
              <img
                src={image.src}
                alt={image.alt || `${dishName} - View ${index + 1}`}
                className="w-full h-full object-cover select-none"
              />

              {/* Gradient Overlay when expanded */}
              <AnimatePresence>
                {isActive ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none"
                  />
                ) : (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px] flex items-center justify-between px-3.5" />
                )}
              </AnimatePresence>

              {/* Collapsed Bar Preview Content */}
              {!isActive && (
                <div className="absolute inset-0 flex items-center justify-between px-3.5 z-10">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/60 text-amber-300 border border-amber-500/30">
                      {image.code || `# 0${index + 1}`}
                    </span>
                    <span className="text-xs font-semibold text-slate-100 drop-shadow truncate max-w-[200px] sm:max-w-xs">
                      {image.label || image.alt || `Angle View ${index + 1}`}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                    Expand
                  </span>
                </div>
              )}

              {/* Expanded Card Header & Enlarge Trigger */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-auto"
                  >
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-300 border border-amber-400/40 shadow-sm flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      <span>{image.code || `# 0${index + 1}`}</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onEnlargeImage) {
                          onEnlargeImage(image.src, index);
                        }
                      }}
                      className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-slate-100 hover:text-white border border-white/20 hover:border-amber-400 text-[10px] font-bold shadow-lg flex items-center space-x-1 active:scale-95 transition-all"
                    >
                      <Maximize2 className="w-3 h-3 text-amber-300" />
                      <span>Zoom View</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expanded Card Bottom Caption */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.25 }}
                    className="absolute bottom-0 left-0 right-0 p-3.5 flex flex-col justify-end z-10"
                  >
                    <p className="text-xs font-bold text-white leading-tight drop-shadow-sm">
                      {image.label || image.alt || `${dishName} - View ${index + 1}`}
                    </p>
                    <p className="text-[10px] text-slate-300 mt-0.5 drop-shadow-sm flex items-center gap-1">
                      <span>Tap image to open in full screen ultra-zoom</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
