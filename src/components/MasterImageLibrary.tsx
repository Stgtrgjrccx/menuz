import React, { useState, useMemo, useRef } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Search,
  ExternalLink,
  Copy,
  Check,
  Building2,
  Trash2,
  MapPin,
  Filter,
  Upload,
  Layers,
  Camera,
  FolderOpen,
  X
} from 'lucide-react';
import { MenuItem, Restaurant, isWorkingWithMenuz } from '../types';
import { useRestaurantStore } from '../store/restaurantStore';
import { DishMultiImageManagerModal } from './DishMultiImageManagerModal';
import { RestaurantPhotoManagerModal } from './RestaurantPhotoManagerModal';

export const MasterImageLibrary: React.FC = () => {
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const menuItems = useRestaurantStore((state) => state.menuItems);
  const tables = useRestaurantStore((state) => state.tables);
  const addMenuItem = useRestaurantStore((state) => state.addMenuItem);
  const deleteMenuItem = useRestaurantStore((state) => state.deleteMenuItem);

  // Partner restaurants working with Menuz
  const partnerRestaurants = useMemo(() => {
    return restaurants.filter((r) => isWorkingWithMenuz(r));
  }, [restaurants]);

  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Modals
  const [managingDish, setManagingDish] = useState<MenuItem | null>(null);
  const [managingRestaurant, setManagingRestaurant] = useState<Restaurant | null>(null);
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [targetRestaurantForNewDish, setTargetRestaurantForNewDish] = useState<string>(
    partnerRestaurants[0]?.id || ''
  );

  // New Dish Form State
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState('Chef Signature Mains');
  const [newDishPrice, setNewDishPrice] = useState('450');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishUploadedImages, setNewDishUploadedImages] = useState<string[]>([]);
  const [newDishType, setNewDishType] = useState<'food' | 'drink'>('food');
  const addDishFileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDishPhotoUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const loaded: string[] = [];
    let count = 0;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) loaded.push(result);
        count++;
        if (count === files.length) {
          setNewDishUploadedImages((prev) => [...prev, ...loaded]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCreateNewDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim() || !targetRestaurantForNewDish) return;

    const primaryImg =
      newDishUploadedImages[0] ||
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop';

    const galleryImgs = newDishUploadedImages.map((src, idx) => ({
      src,
      label: `View ${idx + 1}`,
      code: `# 0${idx + 1}`
    }));

    const newItem: MenuItem = {
      id: `dish-custom-${Date.now()}`,
      restaurant_id: targetRestaurantForNewDish,
      category_id: `cat-${newDishCategory.toLowerCase().replace(/\s+/g, '-')}`,
      name: newDishName.trim(),
      price: parseFloat(newDishPrice) || 0,
      short_description: newDishDesc.trim() || 'Culinary specialty crafted freshly in-house.',
      full_description: newDishDesc.trim() || 'Prepared with artisanal ingredients and chef spices.',
      ingredients: ['Fresh artisanal ingredients', 'Chef spices'],
      allergens: [],
      dietary_flags: [newDishType === 'drink' ? 'beverage' : 'veg'],
      spice_level: 2,
      serving_size: 'Serves 1-2',
      image_url: primaryImg,
      gallery_images: galleryImgs.length > 0 ? galleryImgs : [{ src: primaryImg, label: 'Main Presentation', code: '# 01' }],
      item_type: newDishType,
      is_available: true,
      is_signature: true,
      is_chef_recommended: false,
      is_bestseller: true,
      pairing_item_ids: [],
      sort_order: 1
    };

    addMenuItem(newItem);
    setIsAddDishModalOpen(false);
    setNewDishName('');
    setNewDishDesc('');
    setNewDishUploadedImages([]);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & ASSET CONTROLS */}
      <div className="bg-[#0D1322] p-6 rounded-3xl border border-white/[0.08] shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Master Culinary Photography Hub
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {partnerRestaurants.length} Restaurants Active
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-2">
            Restaurant Image Library &amp; Photography Sections
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Upload and manage multi-angle dish photos, gallery views, and ambiance banners directly from your device gallery. All images link natively across diner menus and tables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddDishModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish &amp; Gallery Photos</span>
          </button>
        </div>
      </div>

      {/* 2. RESTAURANT SELECTOR NAVIGATION CAROUSEL / PILLS */}
      <div className="bg-[#0D1322] p-4 rounded-3xl border border-white/[0.08] shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Filter Photos by Restaurant:</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Showing photos for{' '}
            <strong className="text-amber-400">
              {selectedRestaurantId === 'all'
                ? 'All Restaurants'
                : partnerRestaurants.find((r) => r.id === selectedRestaurantId)?.name}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedRestaurantId('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 cursor-pointer ${
              selectedRestaurantId === 'all'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>All Restaurants ({partnerRestaurants.length})</span>
          </button>

          {partnerRestaurants.map((rest) => {
            const isSelected = selectedRestaurantId === rest.id;
            const count = menuItems.filter((i) => i.restaurant_id === rest.id).length;

            return (
              <button
                key={rest.id}
                onClick={() => setSelectedRestaurantId(rest.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
                }`}
              >
                <img
                  src={rest.logo_url}
                  alt={rest.name}
                  className="w-5 h-5 rounded-full object-cover border border-white/[0.2]"
                />
                <span>{rest.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count} Dishes
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SEARCH & DIETARY FILTER BAR */}
      <div className="bg-[#0D1322] p-4 rounded-3xl border border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish photographs, ingredients, cuisines..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex bg-slate-900 p-1 rounded-xl border border-white/[0.08] text-xs">
            {(['all', 'veg', 'non-veg'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-colors cursor-pointer ${
                  filterType === type
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. RESTAURANTS PHOTO SECTIONS & DISH ROSTERS */}
      <div className="space-y-8">
        {partnerRestaurants
          .filter((r) => selectedRestaurantId === 'all' || r.id === selectedRestaurantId)
          .map((rest) => {
            const restItems = menuItems
              .filter((i) => i.restaurant_id === rest.id)
              .filter((item) => {
                if (searchQuery.trim()) {
                  const q = searchQuery.toLowerCase();
                  const matchName = item.name.toLowerCase().includes(q);
                  const matchDesc = item.short_description?.toLowerCase().includes(q);
                  const matchIng = item.ingredients?.some((ing) => ing.toLowerCase().includes(q));
                  if (!matchName && !matchDesc && !matchIng) return false;
                }
                if (filterType === 'veg') return item.dietary_flags?.includes('veg');
                if (filterType === 'non-veg') return item.dietary_flags?.includes('non-veg');
                return true;
              });

            const restTables = tables.filter((t) => t.restaurant_id === rest.id);
            const firstTable = restTables[0]?.public_token || 'table-token-01';
            const ambianceCount = rest.ambiance_photos?.length || 0;

            return (
              <div
                key={rest.id}
                className="bg-[#0D1322] rounded-3xl border border-white/[0.08] overflow-hidden shadow-xl"
              >
                {/* Restaurant Section Banner Header */}
                <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-[#101728] to-slate-900 border-b border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={rest.logo_url}
                      alt={rest.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white/[0.1] shadow-md flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                          {rest.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          {rest.cuisine}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span>{rest.location || 'Pune, MH'}</span>
                        </span>
                        <span>•</span>
                        <span>{restItems.length} Dishes in Menu</span>
                        <span>•</span>
                        <span>{ambianceCount} Venue Ambiance Photos</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Venue Ambiance Studio Button */}
                    <button
                      type="button"
                      onClick={() => setManagingRestaurant(rest)}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-xl border border-white/[0.08] flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Venue Ambiance Photos ({ambianceCount})</span>
                    </button>

                    {/* Quick Add Dish Button for this Restaurant */}
                    <button
                      onClick={() => {
                        setTargetRestaurantForNewDish(rest.id);
                        setIsAddDishModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Dish</span>
                    </button>

                    {/* Live Diner Menu Link */}
                    <a
                      href={`/#/r/${rest.slug}/menu?t=${firstTable}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-white/[0.08] transition-colors"
                      title="Open Live Menu for this restaurant"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Dish Photo Cards Grid */}
                <div className="p-5 sm:p-6">
                  {restItems.length === 0 ? (
                    <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-white/[0.04] space-y-2">
                      <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400">
                        No dishes found matching the current search filters.
                      </p>
                      <button
                        onClick={() => {
                          setTargetRestaurantForNewDish(rest.id);
                          setIsAddDishModalOpen(true);
                        }}
                        className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl inline-flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add First Dish to {rest.name}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {restItems.map((item) => {
                        const isVeg = item.dietary_flags?.includes('veg');
                        const isNonVeg = item.dietary_flags?.includes('non-veg');
                        const galleryCount = item.gallery_images?.length || 1;

                        return (
                          <div
                            key={item.id}
                            className="bg-slate-900/90 rounded-2xl border border-white/[0.08] overflow-hidden shadow-lg hover:border-amber-500/40 transition-all flex flex-col justify-between group"
                          >
                            {/* Image Container with Badges */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />

                              {/* Dietary Tags */}
                              <div className="absolute top-2 left-2 flex items-center space-x-1">
                                {isVeg && (
                                  <span className="w-4 h-4 bg-slate-950/90 backdrop-blur-sm border border-emerald-500 rounded flex items-center justify-center">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                  </span>
                                )}
                                {isNonVeg && (
                                  <span className="w-4 h-4 bg-slate-950/90 backdrop-blur-sm border border-rose-500 rounded flex items-center justify-center">
                                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                                  </span>
                                )}
                              </div>

                              {/* Multi-Photo Count Badge */}
                              <div className="absolute top-2 right-2 flex items-center space-x-1">
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/75 text-amber-300 backdrop-blur-sm border border-amber-500/30 flex items-center space-x-1">
                                  <Layers className="w-2.5 h-2.5" />
                                  <span>{galleryCount} Photos</span>
                                </span>
                              </div>
                            </div>

                            {/* Details & Actions */}
                            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                              <div>
                                <h5 className="font-bold text-xs text-white leading-tight line-clamp-1" title={item.name}>
                                  {item.name}
                                </h5>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-xs font-bold text-amber-400">
                                    ₹{item.price.toFixed(2)}
                                  </span>
                                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                                    {item.item_type || 'food'}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                                  {item.short_description}
                                </p>
                              </div>

                              <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
                                {/* Direct Multi-Photo Manager Button */}
                                <button
                                  type="button"
                                  onClick={() => setManagingDish(item)}
                                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[11px] font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 cursor-pointer"
                                >
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Upload / Manage Photos</span>
                                </button>

                                <div className="flex items-center justify-between pt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(item.image_url)}
                                    className="text-[10px] text-slate-400 hover:text-amber-400 flex items-center space-x-1 transition-colors"
                                  >
                                    {copiedUrl === item.image_url ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-400" />
                                        <span className="text-emerald-400">Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" />
                                        <span>Copy Link</span>
                                      </>
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`Remove "${item.name}" from ${rest.name}?`)) {
                                        deleteMenuItem(item.id);
                                      }
                                    }}
                                    className="text-[10px] text-slate-500 hover:text-rose-400 flex items-center space-x-1 transition-colors"
                                    title="Delete dish"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: DISH MULTI-IMAGE GALLERY MANAGER & UPLOADER                         */}
      {/* ========================================================================= */}
      <DishMultiImageManagerModal
        isOpen={!!managingDish}
        dish={managingDish}
        onClose={() => setManagingDish(null)}
      />

      {/* ========================================================================= */}
      {/* MODAL: RESTAURANT VENUE AMBIANCE & COVER PHOTO MANAGER                     */}
      {/* ========================================================================= */}
      <RestaurantPhotoManagerModal
        isOpen={!!managingRestaurant}
        restaurant={managingRestaurant}
        onClose={() => setManagingRestaurant(null)}
      />

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW DISH & PHOTO TO RESTAURANT                                  */}
      {/* ========================================================================= */}
      {isAddDishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D1322] rounded-3xl max-w-lg w-full p-6 border border-white/[0.1] shadow-2xl max-h-[92vh] overflow-y-auto space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Menu Creation
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  Add New Dish &amp; Upload Photos
                </h3>
              </div>
              <button
                onClick={() => setIsAddDishModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.04]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewDish} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-200 block mb-1">Target Restaurant *</label>
                <select
                  value={targetRestaurantForNewDish}
                  onChange={(e) => setTargetRestaurantForNewDish(e.target.value)}
                  className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-500/60"
                >
                  {partnerRestaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.cuisine})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Dish / Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artisanal Truffle Ravioli"
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Starters, Mains, Desserts"
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-200 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="450"
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Culinary Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe ingredients, cooking technique, and tasting notes..."
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-white/[0.08] rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500/60"
                />
              </div>

              {/* DIRECT PHOTO UPLOADER (NO URL INPUT) */}
              <div className="space-y-2 bg-slate-900/90 p-4 rounded-2xl border border-white/[0.08]">
                <label className="font-bold text-slate-200 block">
                  Dish Photos (Upload from Device / Phone Gallery)
                </label>
                <input
                  ref={addDishFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleDishPhotoUpload(e.target.files)}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => addDishFileInputRef.current?.click()}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow"
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span>Choose from Gallery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (addDishFileInputRef.current) {
                        addDishFileInputRef.current.setAttribute('capture', 'environment');
                        addDishFileInputRef.current.click();
                      }
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl flex items-center space-x-1.5 cursor-pointer border border-white/[0.08]"
                  >
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>Take Photo</span>
                  </button>
                </div>

                {newDishUploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {newDishUploadedImages.map((src, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden aspect-[4/3] border border-amber-500/40">
                        <img src={src} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewDishUploadedImages((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md text-[9px]"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddDishModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold shadow-lg cursor-pointer"
                >
                  Save Dish to Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
