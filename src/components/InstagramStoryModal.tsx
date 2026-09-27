import React, { useState } from 'react';
import { X, Instagram, Copy, Check, Download, Sparkles, Star, MapPin, Share2, Award } from 'lucide-react';
import { Restaurant, MenuItem } from '../types';
import { CartItem } from '../store/restaurantStore';

interface InstagramStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant;
  items: Array<CartItem | MenuItem>;
  tableLabel?: string;
  orderNumber?: string;
}

export const InstagramStoryModal: React.FC<InstagramStoryModalProps> = ({
  isOpen,
  onClose,
  restaurant,
  items,
  tableLabel = 'Table 1',
  orderNumber
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const displayItems = items.slice(0, 3);
  const handleTag = restaurant.instagram_handle || `@${restaurant.slug.replace(/-/g, '_')}`;

  const captionText = `Incredible culinary experience at ${handleTag} tonight! ✨🍽️
Feast included: ${displayItems.map((i) => i.name).join(', ')}.
Ordered seamlessly via Menuz Interactive Dining Engine 🚀 #PuneFoodie #${restaurant.slug.replace(/-/g, '')} #MenuzDining`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(captionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareToInstagram = () => {
    handleCopyCaption();
    window.open('https://instagram.com', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-charcoal-900 border border-charcoal-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-charcoal-800 flex items-center justify-between bg-charcoal-950/60">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Instagram className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <span>Foodie Instagram Story</span>
                <span className="text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
                  9:16 Viral Card
                </span>
              </h3>
              <p className="text-[11px] text-charcoal-400">Share your dining moments with followers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Story Preview Canvas */}
        <div className="p-4 overflow-y-auto flex-1 flex justify-center bg-charcoal-950/40">
          <div
            id="instagram-story-canvas"
            className="w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl relative border-2 border-saffron-500/40 flex flex-col justify-between p-4"
            style={{
              background: `linear-gradient(160deg, #18181b 0%, #09090b 60%, ${restaurant.brand_colors?.primary || '#E85D04'}33 100%)`
            }}
          >
            {/* Top Brand Bar */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={restaurant.logo_url}
                    alt={restaurant.name}
                    className="w-8 h-8 rounded-xl object-cover border border-white/20 shadow-sm"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight flex items-center space-x-1">
                      <span>{restaurant.name}</span>
                      <Award className="w-3 h-3 text-saffron-400 fill-saffron-400" />
                    </h4>
                    <p className="text-[10px] text-saffron-300 font-mono font-medium">{handleTag}</p>
                  </div>
                </div>

                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/90 backdrop-blur-sm border border-white/10">
                  {tableLabel}
                </span>
              </div>

              {/* Tagline */}
              <div className="mt-3 flex items-center space-x-1 text-amber-400">
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-white ml-1">5-Star Culinary Night</span>
              </div>
            </div>

            {/* Food Photos Carousel / Stack */}
            <div className="my-auto py-2 space-y-2">
              {displayItems.length > 0 ? (
                displayItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/15 flex items-center space-x-2.5 shadow-lg group"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-white/20"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-charcoal-300 line-clamp-1">
                        {'short_description' in item ? item.short_description : 'Signature Chef Delight'}
                      </p>
                      <p className="text-[10px] font-mono text-saffron-300 font-bold mt-0.5">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/15">
                  <Sparkles className="w-8 h-8 text-saffron-400 mx-auto mb-1" />
                  <p className="text-xs font-bold text-white">Culinary Magic at {restaurant.name}</p>
                </div>
              )}
            </div>

            {/* Bottom Footer Info */}
            <div className="pt-2 border-t border-white/15">
              <div className="flex items-center justify-between text-[9px] text-charcoal-300">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-2.5 h-2.5 text-saffron-400" />
                  <span className="truncate max-w-[120px]">{restaurant.location || 'Pune'}</span>
                </span>
                <span className="font-mono text-charcoal-400">
                  {orderNumber ? `#${orderNumber}` : 'Menuz Verified'}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-center space-x-1 text-[9px] text-white/60">
                <span>⚡ Ordered Seamlessly via</span>
                <span className="font-bold text-saffron-400">Menuz.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-charcoal-950 border-t border-charcoal-800 space-y-2.5">
          <div className="p-2.5 rounded-xl bg-charcoal-800/80 border border-charcoal-700 text-xs text-charcoal-300">
            <span className="text-white font-bold block mb-1">🎁 Restaurant Story Perk:</span>
            Tag <strong className="text-saffron-400">{handleTag}</strong> &amp; show your active story to the captain to receive a complimentary dessert treat!
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyCaption}
              className="px-3.5 py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-white text-xs font-bold transition-all border border-charcoal-700 flex items-center justify-center space-x-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Caption Copied!' : 'Copy Caption'}</span>
            </button>

            <button
              onClick={handleShareToInstagram}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-md"
            >
              <Instagram className="w-4 h-4" />
              <span>Open Instagram</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
