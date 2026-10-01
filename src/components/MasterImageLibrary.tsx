import React, { useState, useMemo } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Search,
  ExternalLink,
  Copy,
  Check,
  Star,
  Award,
  Sparkles,
  X,
  Building2,
  Trash2,
  MapPin,
  Phone,
  ChefHat,
  Filter
} from 'lucide-react';
import { MenuItem, Restaurant, isWorkingWithMenuz } from '../types';
import { useRestaurantStore } from '../store/restaurantStore';

// Curated high-res culinary photo bank
export const CURATED_CULINARY_LIBRARY = [
  {
    category: 'Indian & Mughlai',
    items: [
      { name: 'Dum Biryani with Fried Onions', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop' },
      { name: 'Butter Chicken / Murgh Makhani', url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop' },
      { name: 'Tandoori Paneer Tikka Skewers', url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop' },
      { name: 'Slow-Cooked Dal Makhani with Cream', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop' },
      { name: 'Garlic & Butter Tandoori Naan', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop' },
      { name: 'Crispy Samosas with Mint Chutney', url: 'https://images.unsplash.com/photo-1601050690187-5f724aa89617?w=800&auto=format&fit=crop' },
      { name: 'Kashmiri Mutton Rogan Josh', url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop' },
      { name: 'Gulab Jamun with Saffron Pistachio', url: 'https://images.unsplash.com/photo-1605197143949-01c3d52c7816?w=800&auto=format&fit=crop' },
    ]
  },
  {
    category: 'Italian & European',
    items: [
      { name: 'Wood-Fired Neapolitan Margherita Pizza', url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop' },
      { name: 'Truffle Tagliolini with Shaved Parmesan', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop' },
      { name: 'Fresh Burrata Pugliese with Heirloom Tomatoes', url: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef220b3?w=800&auto=format&fit=crop' },
      { name: 'Wild Mushroom Porcini Risotto', url: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=800&auto=format&fit=crop' },
      { name: 'Classic Artisanal Tiramisu al Mascarpone', url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop' },
      { name: 'Crispy Bruschetta Pomodoro', url: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&auto=format&fit=crop' },
    ]
  },
  {
    category: 'Asian & Pan-Asian',
    items: [
      { name: 'Steamed Crystal Dim Sum Dumplings', url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop' },
      { name: 'Traditional Pad Thai Noodles with Peanuts', url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&auto=format&fit=crop' },
      { name: 'Rich Tonkotsu Japanese Ramen Bowl', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop' },
      { name: 'Fresh Salmon Nigiri & Maki Sushi Platter', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop' },
      { name: 'Crispy Vietnamese Spring Rolls', url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop' },
    ]
  },
  {
    category: 'Beverages, Cocktails & Cafe',
    items: [
      { name: 'Signature Smoked Rosemary Cocktail', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop' },
      { name: 'Tropical Mango Passionfruit Mocktail', url: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&auto=format&fit=crop' },
      { name: 'Artisan Latte with Microfoam Art', url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&auto=format&fit=crop' },
      { name: 'Cold Pressed Citrus & Berry Refresher', url: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&auto=format&fit=crop' },
      { name: 'Traditional Saffron Cardamom Masala Chai', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop' },
    ]
  },
  {
    category: 'Desserts & Pastries',
    items: [
      { name: 'Warm Valrhona Molten Chocolate Lava Cake', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop' },
      { name: 'New York Baked Cheesecake with Berries', url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop' },
      { name: 'French Butter Croissant & Pain au Chocolat', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop' },
      { name: 'Artisanal Gelato Pistachio & Stracciatella', url: 'https://images.unsplash.com/photo-1560008511-318a7a08b515?w=800&auto=format&fit=crop' },
    ]
  }
];

export const MasterImageLibrary: React.FC = () => {
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const menuItems = useRestaurantStore((state) => state.menuItems);
  const tables = useRestaurantStore((state) => state.tables);
  const assignImageToItem = useRestaurantStore((state) => state.assignImageToItem);
  const updateMenuItem = useRestaurantStore((state) => state.updateMenuItem);
  const addMenuItem = useRestaurantStore((state) => state.addMenuItem);
  const deleteMenuItem = useRestaurantStore((state) => state.deleteMenuItem);

  // Partner restaurants working with Menuz
  const partnerRestaurants = useMemo(() => {
    return restaurants.filter((r) => isWorkingWithMenuz(r));
  }, [restaurants]);

  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'veg' | 'non-veg' | 'specials'>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Modals
  const [photoPickerItem, setPhotoPickerItem] = useState<MenuItem | null>(null);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [targetRestaurantForNewDish, setTargetRestaurantForNewDish] = useState<string>(
    partnerRestaurants[0]?.id || ''
  );

  // New Dish Form State
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState('Chef Signature Mains');
  const [newDishPrice, setNewDishPrice] = useState('450');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishImageUrl, setNewDishImageUrl] = useState(
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop'
  );
  const [newDishType, setNewDishType] = useState<'food' | 'drink'>('food');
  const [newDishIsSpecial, setNewDishIsSpecial] = useState(true);
  const [newDishIsFavorite, setNewDishIsFavorite] = useState(false);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleCreateNewDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim() || !targetRestaurantForNewDish) return;

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
      image_url: newDishImageUrl.trim() || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop',
      item_type: newDishType,
      is_available: true,
      is_signature: newDishIsSpecial,
      is_chef_recommended: newDishIsFavorite,
      is_bestseller: true,
      pairing_item_ids: [],
      sort_order: 1
    };

    addMenuItem(newItem);
    setIsAddDishModalOpen(false);
    setNewDishName('');
    setNewDishDesc('');
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
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200">
              {partnerRestaurants.length} Restaurants Active
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-2">
            Restaurant Image Library &amp; Photography Sections
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Below is the list of <strong>restaurants working with Menuz</strong>. Under each restaurant name, you will find all the dish photographs, menu items, and ambiance photos belonging strictly to that restaurant.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              if (selectedRestaurantId !== 'all') {
                setTargetRestaurantForNewDish(selectedRestaurantId);
              } else if (partnerRestaurants.length > 0) {
                setTargetRestaurantForNewDish(partnerRestaurants[0].id);
              }
              setIsAddDishModalOpen(true);
            }}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Dish &amp; Photo</span>
          </button>
        </div>
      </div>

      {/* 2. PROMINENT RESTAURANT DIRECTORY TABS */}
      <div className="bg-[#0D1322] p-5 rounded-3xl border border-white/[0.08] shadow-lg space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Select Restaurant to View Photos:</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              Showing {partnerRestaurants.length} onboarded venues
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1">
            <button
              onClick={() => setSelectedRestaurantId('all')}
              className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                selectedRestaurantId === 'all'
                  ? 'bg-[#090D16] text-white border-white/[0.06] shadow-md ring-2 ring-amber-500/50'
                  : 'bg-white/[0.03] text-slate-200 hover:bg-white/[0.04] border-white/[0.08]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Building2 className={`w-5 h-5 ${selectedRestaurantId === 'all' ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                  selectedRestaurantId === 'all' ? 'bg-white/20 text-white' : 'bg-white/[0.08] text-slate-400'
                }`}>
                  All
                </span>
              </div>
              <div>
                <strong className="text-xs font-bold block leading-tight">All Restaurants</strong>
                <span className={`text-[10px] block mt-0.5 ${selectedRestaurantId === 'all' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Full network catalog
                </span>
              </div>
            </button>

            {partnerRestaurants.map((r) => {
              const count = menuItems.filter((m) => m.restaurant_id === r.id).length;
              const isSelected = selectedRestaurantId === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRestaurantId(r.id)}
                  className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-600/40 shadow-md ring-2 ring-amber-400/50'
                      : 'bg-white/[0.03] text-slate-200 hover:bg-white/[0.04] border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <img
                      src={r.logo_url}
                      alt={r.name}
                      className="w-6 h-6 rounded-lg object-cover border border-white/40"
                    />
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {count} Photos
                    </span>
                  </div>
                  <div className="truncate">
                    <strong className="text-xs font-bold block truncate leading-tight" title={r.name}>
                      {r.name}
                    </strong>
                    <span className={`text-[10px] block truncate mt-0.5 ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                      {r.cuisine}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Dietary Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dish by name, spice, or ingredient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-600/40"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'all'
                  ? 'bg-[#0D1322] text-white'
                  : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.06]'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilterType('veg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 ${
                filterType === 'veg'
                  ? 'bg-green-700 text-white'
                  : 'bg-green-50 text-green-800 border border-green-200 hover:bg-green-100'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              <span>Veg</span>
            </button>
            <button
              onClick={() => setFilterType('non-veg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 ${
                filterType === 'non-veg'
                  ? 'bg-red-700 text-white'
                  : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
              <span>Non-Veg</span>
            </button>
            <button
              onClick={() => setFilterType('specials')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 ${
                filterType === 'specials'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Chef Specials</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. RESTAURANT-WISE LISTING SECTIONS */}
      <div className="space-y-8">
        {partnerRestaurants
          .filter((rest) => selectedRestaurantId === 'all' || rest.id === selectedRestaurantId)
          .map((rest) => {
            const restTables = tables.filter((t) => t.restaurant_id === rest.id);
            const defaultToken = restTables[0]?.public_token || `token-${rest.slug}-01`;
            const dinerUrl = `#/r/${rest.slug}/menu?t=${defaultToken}`;
            const managerUrl = `#/manage/${rest.slug}`;

            let restItems = menuItems.filter((m) => m.restaurant_id === rest.id);

            // Apply search
            if (searchQuery.trim()) {
              const q = searchQuery.toLowerCase();
              restItems = restItems.filter(
                (item) =>
                  item.name.toLowerCase().includes(q) ||
                  item.short_description?.toLowerCase().includes(q) ||
                  item.full_description?.toLowerCase().includes(q)
              );
            }

            // Apply dietary filter
            if (filterType === 'veg') {
              restItems = restItems.filter((i) => i.dietary_flags?.includes('veg'));
            } else if (filterType === 'non-veg') {
              restItems = restItems.filter((i) => i.dietary_flags?.includes('non-veg'));
            } else if (filterType === 'specials') {
              restItems = restItems.filter((i) => i.is_signature || i.is_chef_recommended);
            }

            return (
              <div
                key={rest.id}
                className="bg-[#0D1322] rounded-3xl border-2 border-white/[0.08]  overflow-hidden"
              >
                {/* 🌟 PROMINENT RESTAURANT NAME BANNER 🌟 */}
                <div className="bg-gradient-to-r from-[#090D16] via-[#090D16] to-[#090D16] text-white p-6 border-b-2 border-amber-500 flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="flex items-center space-x-4">
                    <img
                      src={rest.logo_url}
                      alt={rest.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-md flex-shrink-0"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs uppercase font-black tracking-wider px-3 py-1 rounded-full bg-amber-500 text-white font-mono shadow-sm flex items-center space-x-1">
                          <span>🏪 RESTAURANT:</span>
                          <span className="underline">{rest.name}</span>
                        </span>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#090D16]/20 text-amber-300">
                          {rest.cuisine}
                        </span>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                          Active Menuz Partner
                        </span>
                      </div>

                      {/* HUGE BOLD RESTAURANT NAME */}
                      <h3 className="font-serif text-2xl sm:text-3xl font-black text-white mt-2 flex flex-wrap items-center gap-2">
                        <span>{rest.name}</span>
                        <span className="text-xs font-sans font-medium text-amber-300 bg-[#090D16]/[0.03] px-2.5 py-0.5 rounded-full border border-amber-500/30">
                          {restItems.length} Photos in Gallery
                        </span>
                      </h3>

                      <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span>{rest.location || 'Pune, India'}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3.5 h-3.5 text-amber-400" />
                          <span>{rest.contact_phone || '+91 20 2600 0000'}</span>
                        </span>
                        <span className="text-amber-400 font-semibold">
                          • {restTables.length || 4} Tables Configured • {restItems.length} Dishes
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                    <button
                      onClick={() => {
                        setTargetRestaurantForNewDish(rest.id);
                        setIsAddDishModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 shadow-lg cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Dish to {rest.name}</span>
                    </button>

                    <a
                      href={dinerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 bg-[#0D1322] hover:bg-white/[0.06] text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 border border-white/[0.08]"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                      <span>Live Diner Menu</span>
                    </a>

                    <a
                      href={managerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 bg-[#0D1322] hover:bg-white/[0.06] text-slate-400 hover:text-white text-xs font-semibold rounded-xl transition-all border border-white/[0.08]"
                    >
                      <span>Manager Hub</span>
                    </a>
                  </div>
                </div>

                {/* Restaurant's Dishes & Photographs Grid */}
                <div className="p-6 bg-[#090D16]/[0.03]/50">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.08]">
                    <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                      <span>
                        📸 Photo Gallery for <strong className="text-amber-400 underline">{rest.name}</strong> ({restItems.length} items)
                      </span>
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Changes instantly sync to {rest.name}'s QR menu
                    </span>
                  </div>

                  {restItems.length === 0 ? (
                    <div className="p-8 text-center bg-[#0D1322] rounded-2xl border-2 border-dashed border-white/[0.08]">
                      <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                      <h5 className="font-serif font-bold text-sm text-white">No dishes uploaded yet for {rest.name}</h5>
                      <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                        Click below to create menu dishes and assign photography for {rest.name}.
                      </p>
                      <button
                        onClick={() => {
                          setTargetRestaurantForNewDish(rest.id);
                          setIsAddDishModalOpen(true);
                        }}
                        className="mt-3.5 px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg inline-flex items-center space-x-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add First Dish to {rest.name}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {restItems.map((item) => {
                        const isVeg = item.dietary_flags?.includes('veg');
                        const isNonVeg = item.dietary_flags?.includes('non-veg');

                        return (
                          <div
                            key={item.id}
                            className="bg-[#0D1322] rounded-2xl border border-white/[0.08] overflow-hidden shadow-lg hover: transition-all flex flex-col justify-between group"
                          >
                            {/* Image Container with Badges */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-[#090D16]/[0.04]">
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />

                              {/* Dietary / Special Tags */}
                              <div className="absolute top-2 left-2 flex items-center space-x-1">
                                {isVeg && (
                                  <span className="w-4 h-4 bg-[#090D16]/95 backdrop-blur-sm border border-green-600 rounded flex items-center justify-center">
                                    <span className="w-2 h-2 rounded-full bg-green-600" />
                                  </span>
                                )}
                                {isNonVeg && (
                                  <span className="w-4 h-4 bg-[#090D16]/95 backdrop-blur-sm border border-red-600 rounded flex items-center justify-center">
                                    <span className="w-2 h-2 rounded-full bg-red-600" />
                                  </span>
                                )}
                                {item.is_chef_recommended && (
                                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-500 text-white shadow-sm flex items-center space-x-0.5">
                                    <Award className="w-2.5 h-2.5" />
                                    <span>Chef Fav</span>
                                  </span>
                                )}
                                {item.is_signature && (
                                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-red-500 text-white shadow-sm flex items-center space-x-0.5">
                                    <Star className="w-2.5 h-2.5 fill-white" />
                                    <span>Special</span>
                                  </span>
                                )}
                              </div>

                              {/* Copy Link button */}
                              <button
                                onClick={() => handleCopy(item.image_url)}
                                className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#090D16]/80 hover:bg-[#090D16] text-white backdrop-blur-sm transition-colors"
                                title="Copy direct high-res image link"
                              >
                                {copiedUrl === item.image_url ? (
                                  <Check className="w-3.5 h-3.5 text-green-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>

                            {/* Details & Actions */}
                            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                              <div>
                                <h5 className="font-bold text-xs text-white leading-tight line-clamp-1" title={item.name}>
                                  {item.name}
                                </h5>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-xs font-bold text-amber-400">
                                    ₹{item.price.toFixed(2)}
                                  </span>
                                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                                    {item.item_type || 'food'}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                                  {item.short_description}
                                </p>
                              </div>

                              <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
                                <button
                                  onClick={() => {
                                    setPhotoPickerItem(item);
                                    setCustomPhotoUrl(item.image_url);
                                  }}
                                  className="w-full py-1.5 bg-amber-500/10 hover:bg-amber-500/10 text-amber-900 text-[11px] font-bold rounded-lg border border-amber-500/20 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                                >
                                  <ImageIcon className="w-3 h-3 text-amber-400" />
                                  <span>Change Photo</span>
                                </button>

                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => updateMenuItem(item.id, { is_chef_recommended: !item.is_chef_recommended })}
                                    className={`flex-1 py-1 text-[10px] font-semibold rounded border transition-colors cursor-pointer ${
                                      item.is_chef_recommended
                                        ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                                        : 'bg-white/[0.04] text-slate-400 border-white/[0.08] hover:bg-white/[0.06]'
                                    }`}
                                    title="Toggle Chef Favorite"
                                  >
                                    👑 Fav
                                  </button>

                                  <button
                                    onClick={() => updateMenuItem(item.id, { is_signature: !item.is_signature })}
                                    className={`flex-1 py-1 text-[10px] font-semibold rounded border transition-colors cursor-pointer ${
                                      item.is_signature
                                        ? 'bg-red-100 text-red-900 border-red-300 font-bold'
                                        : 'bg-white/[0.04] text-slate-400 border-white/[0.08] hover:bg-white/[0.06]'
                                    }`}
                                    title="Toggle Signature / Special"
                                  >
                                    ⭐ Special
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (confirm(`Remove "${item.name}" from ${rest.name}?`)) {
                                        deleteMenuItem(item.id);
                                      }
                                    }}
                                    className="p-1 text-slate-500 hover:text-red-500 rounded hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                                    title="Delete dish"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
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
      {/* MODAL: PHOTO PICKER & CURATED CULINARY VAULT                               */}
      {/* ========================================================================= */}
      {photoPickerItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1322] rounded-3xl max-w-2xl w-full p-6  border border-white/[0.08] max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Photo Editor &amp; Library
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  Update Photograph for "{photoPickerItem.name}"
                </h3>
              </div>
              <button
                onClick={() => setPhotoPickerItem(null)}
                className="p-1.5 text-slate-500 hover:text-slate-400 rounded-xl hover:bg-white/[0.04]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Custom Image URL Input & Preview */}
            <div className="space-y-3 bg-[#090D16]/[0.03] p-4 rounded-2xl border border-white/[0.08]">
              <label className="text-xs font-bold text-slate-200 block">
                Direct Image URL (Custom Upload / Web CDN):
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-[#090D16] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-600/40"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customPhotoUrl.trim()) {
                      assignImageToItem(photoPickerItem.id, customPhotoUrl.trim());
                      setPhotoPickerItem(null);
                    }
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-lg whitespace-nowrap cursor-pointer"
                >
                  Save URL
                </button>
              </div>

              {customPhotoUrl && (
                <div className="pt-2">
                  <span className="text-[10px] text-slate-500 font-semibold block mb-1">Live Image Preview:</span>
                  <img
                    src={customPhotoUrl}
                    alt="Preview"
                    className="w-full h-36 object-cover rounded-xl border border-white/[0.08] shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Curated Culinary Photography Library Picker */}
            <div className="space-y-4">
              <div>
                <h4 className="font-serif font-bold text-sm text-white flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Choose from Menuz Curated Culinary Vault (1-Click Apply)</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Select any high-resolution professional studio photography below to immediately assign it to this dish.
                </p>
              </div>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {CURATED_CULINARY_LIBRARY.map((cat) => (
                  <div key={cat.category} className="space-y-2">
                    <h5 className="text-[11px] uppercase font-bold tracking-wider text-amber-400 bg-amber-500/10/70 px-2 py-1 rounded-lg">
                      {cat.category}
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {cat.items.map((libItem) => (
                        <div
                          key={libItem.url}
                          onClick={() => {
                            assignImageToItem(photoPickerItem.id, libItem.url);
                            setPhotoPickerItem(null);
                          }}
                          className="group cursor-pointer rounded-xl overflow-hidden border border-white/[0.08] hover:border-amber-600/40 bg-[#090D16] p-1 shadow-lg hover: transition-all text-left"
                        >
                          <div className="aspect-[4/3] rounded-lg overflow-hidden relative">
                            <img
                              src={libItem.url}
                              alt={libItem.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                              Click to Apply
                            </div>
                          </div>
                          <p className="text-[10px] font-semibold text-slate-200 line-clamp-1 mt-1 px-1">
                            {libItem.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW DISH & PHOTO TO RESTAURANT                                  */}
      {/* ========================================================================= */}
      {isAddDishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1322] rounded-3xl max-w-lg w-full p-6  border border-white/[0.08] max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Menu Creation
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  Add New Dish &amp; Photograph
                </h3>
              </div>
              <button
                onClick={() => setIsAddDishModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-400 rounded-xl hover:bg-white/[0.04]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewDish} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-200 block mb-1">Target Restaurant *</label>
                <select
                  value={targetRestaurantForNewDish}
                  onChange={(e) => setTargetRestaurantForNewDish(e.target.value)}
                  className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-600/40"
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
                  className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-600/40"
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
                    className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-600/40"
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
                    className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-600/40"
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
                  className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-600/40"
                />
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Photograph URL *</label>
                <input
                  type="text"
                  required
                  value={newDishImageUrl}
                  onChange={(e) => setNewDishImageUrl(e.target.value)}
                  className="w-full bg-[#090D16]/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-600/40"
                />
                {newDishImageUrl && (
                  <img
                    src={newDishImageUrl}
                    alt="New Preview"
                    className="w-full h-24 object-cover rounded-xl mt-2 border border-white/[0.08]"
                  />
                )}
              </div>

              <div className="flex items-center space-x-4 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDishIsSpecial}
                    onChange={(e) => setNewDishIsSpecial(e.target.checked)}
                    className="rounded text-amber-400 focus:ring-0"
                  />
                  <span className="font-semibold text-slate-200">⭐ Mark as Chef's Signature</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDishIsFavorite}
                    onChange={(e) => setNewDishIsFavorite(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-0"
                  />
                  <span className="font-semibold text-slate-200">👑 Mark as Chef's Recommendation</span>
                </label>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddDishModalOpen(false)}
                  className="px-4 py-2 bg-[#090D16]/[0.04] hover:bg-white/[0.06] text-slate-400 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-700 text-white rounded-xl font-bold shadow-lg cursor-pointer"
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
