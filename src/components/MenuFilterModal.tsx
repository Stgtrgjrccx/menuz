import React from 'react';
import { createPortal } from 'react-dom';
import { X, SlidersHorizontal, RotateCcw, Check, Sparkles, ArrowUpDown } from 'lucide-react';

export type DietaryOption = 'all' | 'veg' | 'non_veg' | 'vegan' | 'jain' | 'gluten_free' | 'halal' | 'nut_free' | 'dairy_free' | 'keto';
export type SpiceOption = 'all' | 'mild' | 'medium' | 'hot' | 'fiery';
export type SortOption = 'default' | 'price_asc' | 'price_desc' | 'spice_asc' | 'spice_desc';
export type HighlightOption = 'all' | 'chef_pick' | 'bestseller' | 'has_pairing' | 'has_story';

export interface MenuFilterState {
  dietary: DietaryOption;
  spice: SpiceOption;
  sort: SortOption;
  highlight: HighlightOption;
}

interface MenuFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: MenuFilterState;
  onFiltersChange: (filters: MenuFilterState) => void;
  totalFilteredCount: number;
}

export const MenuFilterModal: React.FC<MenuFilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  totalFilteredCount
}) => {
  if (!isOpen) return null;

  const handleReset = () => {
    onFiltersChange({
      dietary: 'all',
      spice: 'all',
      sort: 'default',
      highlight: 'all'
    });
  };

  const isFiltered =
    filters.dietary !== 'all' ||
    filters.spice !== 'all' ||
    filters.sort !== 'default' ||
    filters.highlight !== 'all';

  const dietaryItems: { id: DietaryOption; label: string; icon: string; desc: string }[] = [
    { id: 'all', label: 'All Diets', icon: '🍽️', desc: 'Full culinary repertoire' },
    { id: 'veg', label: 'Pure Veg Only', icon: '🟢', desc: 'Strictly vegetarian' },
    { id: 'non_veg', label: 'Non-Vegetarian', icon: '🔴', desc: 'Poultry, mutton & seafood' },
    { id: 'jain', label: 'Jain Friendly', icon: '🌱', desc: 'No root vegetables, onion, or garlic' },
    { id: 'vegan', label: '100% Plant Vegan', icon: '🌿', desc: 'Zero dairy, egg, or animal derivatives' },
    { id: 'gluten_free', label: 'Gluten-Free', icon: '🌾', desc: 'Wheat & barley free recipes' },
    { id: 'halal', label: 'Halal Certified', icon: '🌙', desc: 'Permissible halal preparation' },
    { id: 'nut_free', label: 'Nut-Free', icon: '🥜', desc: 'Zero peanuts or tree nut allergens' },
    { id: 'dairy_free', label: 'Dairy-Free', icon: '🥛', desc: 'Lactose & dairy-free cooking' },
    { id: 'keto', label: 'Keto / Low-Carb', icon: '🥑', desc: 'High protein, low carbohydrate' }
  ];

  const spiceItems: { id: SpiceOption; label: string; icon: string; desc: string }[] = [
    { id: 'all', label: 'Any Heat Level', icon: '🌶️', desc: 'All spice profiles' },
    { id: 'mild', label: 'Mild (0-1 / 5)', icon: '🥗', desc: 'Gentle, aromatic, zero pungent burn' },
    { id: 'medium', label: 'Medium (2-3 / 5)', icon: '🌶️', desc: 'Balanced authentic Indian heat' },
    { id: 'hot', label: 'Spicy (4 / 5)', icon: '🔥', desc: 'Bold chili & pepper punch' },
    { id: 'fiery', label: 'Fiery Hot (5 / 5)', icon: '🌋', desc: 'Intense Kolhapuri / Bhut Jolokia heat' }
  ];

  const sortItems: { id: SortOption; label: string; icon: string }[] = [
    { id: 'default', label: "Chef's Curated Order", icon: '🧑‍🍳' },
    { id: 'price_asc', label: 'Price: Low to High (₹ ↑)', icon: '📈' },
    { id: 'price_desc', label: 'Price: High to Low (₹ ↓)', icon: '📉' },
    { id: 'spice_asc', label: 'Spice Heat: Mild to Spicy (🌶️ ↑)', icon: '🌱' },
    { id: 'spice_desc', label: 'Spice Heat: Spicy to Mild (🔥 ↓)', icon: '🔥' }
  ];

  const highlightItems: { id: HighlightOption; label: string; icon: string }[] = [
    { id: 'all', label: 'Show Everything', icon: '✨' },
    { id: 'chef_pick', label: "Chef's Recommendations", icon: '🌟' },
    { id: 'bestseller', label: 'Guest Bestsellers', icon: '⭐' },
    { id: 'has_pairing', label: 'With Drink Pairings', icon: '🍷' },
    { id: 'has_story', label: 'With Culinary Lore', icon: '📜' }
  ];

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="bg-[#0D1322] w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden border border-amber-500/30 shadow-2xl animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0A0E17]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">Menu Filters &amp; Sorting</h3>
              <p className="text-[11px] text-slate-400">Personalize your dining taste profile</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isFiltered && (
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-semibold px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-6 text-xs">
          {/* 1. Dietary & Allergens (#12) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-amber-300 text-xs tracking-wider uppercase flex items-center space-x-1.5">
                <span>🥗</span>
                <span>Dietary &amp; Allergen Preferences (#12)</span>
              </span>
              <span className="text-[10px] text-slate-400">Strict Kitchen Filtering</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {dietaryItems.map((item) => {
                const isSelected = filters.dietary === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, dietary: item.id })}
                    className={`p-2.5 rounded-xl border text-left flex items-start space-x-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm ring-1 ring-amber-400/40'
                        : 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:border-amber-500/30'
                    }`}
                  >
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs truncate">{item.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-amber-400 ml-1 flex-shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Spice Heat Level (Low to High Options) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-amber-300 text-xs tracking-wider uppercase flex items-center space-x-1.5">
                <span>🌶️</span>
                <span>Spice Heat Level Gauge</span>
              </span>
              <span className="text-[10px] text-slate-400">From Mild to Fiery</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {spiceItems.map((item) => {
                const isSelected = filters.spice === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, spice: item.id })}
                    className={`p-2.5 rounded-xl border text-left flex items-start space-x-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm ring-1 ring-amber-400/40'
                        : 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:border-amber-500/30'
                    }`}
                  >
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs truncate">{item.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-amber-400 ml-1 flex-shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Sort Order (Low to High, High to Low) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-amber-300 text-xs tracking-wider uppercase flex items-center space-x-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
                <span>Price &amp; Spice Sorting</span>
              </span>
              <span className="text-[10px] text-slate-400">Order by preference</span>
            </div>
            <div className="space-y-1.5">
              {sortItems.map((item) => {
                const isSelected = filters.sort === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, sort: item.id })}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-white font-semibold'
                        : 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{item.icon}</span>
                      <span className="text-xs">{item.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Culinary Studio Badges & Highlights */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-amber-300 text-xs tracking-wider uppercase flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Culinary Studio Curations</span>
              </span>
              <span className="text-[10px] text-slate-400">Chef &amp; Sommelier Picks</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {highlightItems.map((item) => {
                const isSelected = filters.highlight === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, highlight: item.id })}
                    className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-white font-semibold'
                        : 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:border-amber-500/30'
                    }`}
                  >
                    <span className="text-sm flex-shrink-0">{item.icon}</span>
                    <span className="text-xs truncate flex-1">{item.label}</span>
                    {isSelected && <Check className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0A0E17] border-t border-white/[0.08] flex items-center justify-between gap-3">
          <div className="text-xs text-slate-300">
            Showing <strong className="text-amber-400">{totalFilteredCount}</strong> matching dishes
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
