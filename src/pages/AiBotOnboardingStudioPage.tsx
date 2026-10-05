import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ChefHat,
  Plus,
  Trash2,
  ArrowLeft,
  Flame,
  ShieldCheck,
  Star,
  Award,
  Search,
  X,
  Check,
  Save,
  Mic,
  MicOff,
  BookOpen,
  Heart,
  GlassWater,
  Utensils,
  UtensilsCrossed
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { generateCuisineMenu } from '../data/cuisineMenuGenerator';
import { MenuItem, MenuCategory, isWorkingWithMenuz } from '../types';

export const AiBotOnboardingStudioPage: React.FC = () => {
  const navigate = useNavigate();
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const setCurrentRestaurant = useRestaurantStore((state) => state.setCurrentRestaurant);
  const updateRestaurant = useRestaurantStore((state) => state.updateRestaurant);
  const menuItems = useRestaurantStore((state) => state.menuItems);
  const categories = useRestaurantStore((state) => state.categories);
  const addMenuItem = useRestaurantStore((state) => state.addMenuItem);
  const updateMenuItem = useRestaurantStore((state) => state.updateMenuItem);
  const deleteMenuItem = useRestaurantStore((state) => state.deleteMenuItem);

  const activeWorkingRestaurants = restaurants.filter((r) => isWorkingWithMenuz(r));

  // Fallback cuisine menu generation ensures all existing dishes are always populated
  const fallbackCuisineMenu = useMemo(() => {
    return generateCuisineMenu(
      restaurant.id,
      restaurant.slug || 'venue',
      restaurant.cuisine,
      restaurant.name
    );
  }, [restaurant.id, restaurant.slug, restaurant.cuisine, restaurant.name]);

  const currentRestMenuItems = menuItems.filter((m) => m.restaurant_id === restaurant.id);
  const activeMenuItemsList = currentRestMenuItems.length > 0 ? currentRestMenuItems : fallbackCuisineMenu.dishes;

  const currentRestCategories = categories.filter((c) => c.restaurant_id === restaurant.id);
  const activeCategoriesList = currentRestCategories.length > 0 ? currentRestCategories : fallbackCuisineMenu.categories;

  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  const [dishFilterType, setDishFilterType] = useState<'all' | 'veg' | 'non_veg' | 'chef_fav' | 'specials' | 'bestsellers'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [recordingDishId, setRecordingDishId] = useState<string | null>(null);

  // Add Dish Modal State
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState(activeCategoriesList[0]?.id || '');
  const [newDishPrice, setNewDishPrice] = useState('350');
  const [newDishType, setNewDishType] = useState<'food' | 'drink'>('food');
  const [newDishIsVeg, setNewDishIsVeg] = useState(true);
  const [newDishDietary, setNewDishDietary] = useState<string[]>(['Vegetarian']);
  const [newDishSpice, setNewDishSpice] = useState(2);
  const [newDishIsSpecial, setNewDishIsSpecial] = useState(false);
  const [newDishIsChefFav, setNewDishIsChefFav] = useState(false);
  const [autoGenOnCreate, setAutoGenOnCreate] = useState(true);

  // Metrics
  const vegCount = activeMenuItemsList.filter((d) => d.dietary_flags.includes('Vegetarian')).length;
  const nonVegCount = activeMenuItemsList.length - vegCount;
  const chefFavCount = activeMenuItemsList.filter((d) => d.is_chef_recommended).length;
  const specialCount = activeMenuItemsList.filter((d) => d.is_signature).length;
  const bestsellerCount = activeMenuItemsList.filter((d) => d.is_bestseller).length;

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return activeMenuItemsList.filter((dish) => {
      const matchCat = selectedCatId === 'all' || dish.category_id === selectedCatId;
      const matchSearch =
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dish.chef_notes && dish.chef_notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (dish.chef_story && dish.chef_story.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchType = true;
      const isDishVeg = dish.dietary_flags.includes('Vegetarian');
      if (dishFilterType === 'veg') matchType = isDishVeg;
      else if (dishFilterType === 'non_veg') matchType = !isDishVeg;
      else if (dishFilterType === 'chef_fav') matchType = !!dish.is_chef_recommended;
      else if (dishFilterType === 'specials') matchType = !!dish.is_signature;
      else if (dishFilterType === 'bestsellers') matchType = !!dish.is_bestseller;

      return matchCat && matchSearch && matchType;
    });
  }, [activeMenuItemsList, selectedCatId, searchQuery, dishFilterType]);

  // Craft bespoke tasting notes & secrets for a dish
  const handleAutoSuggestSecret = (dish: MenuItem) => {
    const name = dish.name.toLowerCase();
    let suggestedSecret = '';
    let suggestedStory = '';
    let suggestedPitch = '';
    let suggestedPairing = '';
    let suggestedPairingReason = '';
    let suggestedTemp = 'Served piping hot in traditional tableware';

    if (name.includes('butter chicken') || name.includes('murg') || name.includes('tikka')) {
      suggestedSecret =
        'Tandoor-charred chicken simmered for 8 hours in vine-ripened tomato reduction with slow-churned white makkhan and crushed sun-dried fenugreek.';
      suggestedStory =
        'Perfected using an 80-year-old family ratio of smoked Kashmiri mirch and hand-pounded mace.';
      suggestedPitch =
        'Our all-time crowd pleaser — velvety, naturally sweet from vine tomatoes, with zero synthetic food coloring.';
      suggestedPairing = 'Smoked Saffron & Mint Chaas';
      suggestedPairingReason = 'Chilled probiotic buttermilk balances the rich, velvety butter gravy perfectly.';
      suggestedTemp = 'Steaming hot in traditional copper handi';
    } else if (name.includes('biryani') || name.includes('rice') || name.includes('pulao')) {
      suggestedSecret =
        'Aged 2-year basmati rice sealed in heavy clay handi with pure cow ghee, saffron pistils, caramelized shallots, and whole cloves.';
      suggestedStory =
        'Prepared following the authentic slow-dum tradition of Awadhi royal kitchens with sealed dough rim.';
      suggestedPitch =
        'Every single grain is infused with aromatic rosewater, star anise, and whole spices.';
      suggestedPairing = 'Burani Garlic Raita & Nimbu Soda';
      suggestedPairingReason = 'Cool roasted garlic yogurt complements the fragrant layered spice heat.';
      suggestedTemp = 'Sealed clay handi cut open fresh at the table';
    } else if (name.includes('paneer') || name.includes('cottage cheese')) {
      suggestedSecret =
        'Made fresh daily from unhomogenized farm milk, lightly smoked over neem charcoal, folded with crushed whole coriander seeds.';
      suggestedStory =
        'We never freeze our paneer — it is churned fresh every morning for an incomparably pillowy, melt-in-mouth texture.';
      suggestedPitch =
        'Silky, fresh, and deeply aromatic without any artificial cream or thickeners.';
      suggestedPairing = 'Ginger Masala Shikanji';
      suggestedPairingReason = 'Crisp sparkling citrus & ginger elevates the gentle dairy richness.';
      suggestedTemp = 'Hot off the tawa with fresh ginger juliennes';
    } else if (name.includes('dal') || name.includes('lentil') || name.includes('makhani')) {
      suggestedSecret =
        'Black urad lentils slow-simmered for 24 hours on glowing charcoal embers with vine tomatoes and stone-churned butter.';
      suggestedStory =
        'Generational recipe that relies solely on overnight slow heat rather than excessive heavy cream.';
      suggestedPitch =
        'Rich, deeply smoky, and comforting — the true soul of traditional slow cooking.';
      suggestedPairing = 'Charcoal Garlic Butter Naan & Kokum Fizz';
      suggestedPairingReason =
        'Tandoori naan scoops the thick dal while tart kokum provides a refreshing palate cleanse.';
      suggestedTemp = 'Slow-simmering hot with a dollop of white butter';
    } else if (name.includes('kebab') || name.includes('tandoor') || name.includes('roast')) {
      suggestedSecret =
        'Double marinated for 14 hours in hung curd, cold-pressed mustard oil, crushed yellow chili, and roasted gram flour.';
      suggestedStory =
        'Charcoal roasted at 480°C in an earthen tandoor to seal the succulent juices within.';
      suggestedPitch =
        'Smoky on the outside, incredibly tender inside, served with fresh mint chutney.';
      suggestedPairing = 'Cranberry Thyme Cooler or Artisan Lager';
      suggestedPairingReason =
        'Tart fruit and crisp hops cut through the rich caramelized charred crust.';
      suggestedTemp = 'Sizzling on a pre-heated cast-iron platter';
    } else {
      suggestedSecret =
        'Handcrafted with cold-pressed oils, freshly ground regional spices, and farm-sourced produce prepared in small artisanal batches.';
      suggestedStory =
        'Developed in our kitchen to celebrate authentic heritage flavors with modern culinary precision.';
      suggestedPitch =
        'A signature favorite praised by diners for its clean, layered depth of flavor.';
      suggestedPairing = 'House Heritage Shikanji / Artisan Mocktail';
      suggestedPairingReason = 'Enhances the underlying aromatic notes of the dish.';
      suggestedTemp = 'Piping hot and freshly garnished with micro-herbs';
    }

    updateMenuItem(dish.id, {
      chef_notes: suggestedSecret,
      chef_story: suggestedStory,
      owner_pitch: suggestedPitch,
      pairing_drink_name: suggestedPairing,
      pairing_reason: suggestedPairingReason,
      temperature_style: suggestedTemp
    });
  };

  // Toggle Veg / Non-Veg for a dish
  const handleToggleDishVeg = (dish: MenuItem) => {
    const isCurrentlyVeg = dish.dietary_flags.includes('Vegetarian');
    let updatedFlags: string[];
    if (isCurrentlyVeg) {
      updatedFlags = dish.dietary_flags.filter((f) => f !== 'Vegetarian');
    } else {
      updatedFlags = [...dish.dietary_flags.filter((f) => f !== 'Non-Vegetarian'), 'Vegetarian'];
    }
    updateMenuItem(dish.id, { dietary_flags: updatedFlags });
  };

  // Apply Preset Heritage Culinary Style
  const handleApplyPresetTemplate = (dish: MenuItem, presetKey: string) => {
    if (presetKey === 'royal_awadhi') {
      updateMenuItem(dish.id, {
        chef_notes:
          '18-hour slow dum simmer in heavy copper handi with hand-ground mace, royal saffron, and stone flower.',
        chef_story:
          'Inspired by the royal Awadhi Dastarkhwan courts where patience and slow heat are the primary ingredients.',
        owner_pitch: 'Our supreme culinary centerpiece — opulent, velvety, and intensely aromatic.',
        pairing_drink_name: 'Shahi Kesar Badam Chaas',
        pairing_reason: 'Rich almond and saffron buttermilk elevates the slow-braised aromatics.',
        temperature_style: 'Steaming in heavy copper vessel',
        spice_level: 2
      });
    } else if (presetKey === 'tandoor_charcoal') {
      updateMenuItem(dish.id, {
        chef_notes:
          'Double-marinated in Kashmiri deghi mirch, cold-pressed mustard oil, and rock salt, roasted at 480°C over charcoal.',
        chef_story: 'Smoked using dried neem wood embers for an authentic earthy wood-smoke depth.',
        owner_pitch: 'Juicy core with crisp caramelized charred edges. Best enjoyed straight off the skewers.',
        pairing_drink_name: 'Zesty Smoked Cumin Nimbu Soda',
        pairing_reason: 'Sparkling citrus cuts through the rich roasted crust.',
        temperature_style: 'Sizzling on cast-iron platter with lemon wedges',
        spice_level: 3
      });
    } else if (presetKey === 'coastal_coconut') {
      updateMenuItem(dish.id, {
        chef_notes:
          'Freshly extracted thick coconut milk simmered with wild kokum rinds, fresh curry leaves, and Byadgi chilies.',
        chef_story:
          'Traditional Konkani recipe balancing gentle sweetness of coconut with tangy wild kokum.',
        owner_pitch: 'Light on the stomach yet deeply flavorful with a gorgeous natural red hue.',
        pairing_drink_name: 'Fresh Solkadhi or Tender Coconut Elixir',
        pairing_reason: 'Authentic coastal pairing that aids digestion and refreshes the palate.',
        temperature_style: 'Warm in traditional earthenware',
        spice_level: 2
      });
    } else if (presetKey === 'artisan_dessert') {
      updateMenuItem(dish.id, {
        chef_notes:
          'Slow-reduced organic whole milk, Persian saffron pistils, green cardamom, and golden pistachio slivers.',
        chef_story: 'Handcrafted over 4 hours with minimal organic unrefined sugar for delicate sweetness.',
        owner_pitch: 'The perfect concluding memory to your meal. Luxurious without being overly sweet.',
        pairing_drink_name: 'Masala Kahwa Green Tea',
        pairing_reason: 'Spiced hot tea gently cleanses the palate after dessert.',
        temperature_style: 'Chilled in earthen matka pot',
        spice_level: 0
      });
    }
  };

  // Voice Note Dictation Simulation
  const handleToggleVoiceDictation = (dishId: string) => {
    if (recordingDishId === dishId) {
      setRecordingDishId(null);
    } else {
      setRecordingDishId(dishId);
      setTimeout(() => {
        const dish = activeMenuItemsList.find((d) => d.id === dishId);
        if (dish) {
          const simulatedVoiceNotes =
            `[Chef Voice Note]: Sourced fresh weekly, ground on stone silbatta with desi ghee tempering. Never use store-bought spice pastes. Guests love the authentic warmth!`;
          updateMenuItem(dish.id, {
            chef_notes: (dish.chef_notes ? dish.chef_notes + ' ' : '') + simulatedVoiceNotes
          });
        }
        setRecordingDishId(null);
      }, 2000);
    }
  };

  // Add New Dish Handler
  const handleCreateNewDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    const dietaryFlags = newDishIsVeg ? ['Vegetarian'] : [];

    const newId = `dish-custom-${Date.now()}`;
    const newDish: MenuItem = {
      id: newId,
      restaurant_id: restaurant.id,
      category_id: newDishCategory || activeCategoriesList[0]?.id || 'cat-general',
      name: newDishName.trim(),
      item_type: newDishType,
      price: parseFloat(newDishPrice) || 350,
      short_description: `Freshly prepared ${newDishName} handcrafted in house.`,
      ingredients: ['Fresh herbs', 'Special spices', 'Artisan base'],
      allergens: [],
      dietary_flags: dietaryFlags,
      spice_level: newDishSpice,
      serving_size: 'Serves 1-2',
      image_url:
        newDishType === 'drink'
          ? 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
      is_available: true,
      is_signature: newDishIsSpecial,
      is_chef_recommended: newDishIsChefFav,
      is_bestseller: false,
      pairing_item_ids: [],
      sort_order: activeMenuItemsList.length + 1
    };

    addMenuItem(newDish);

    if (autoGenOnCreate) {
      setTimeout(() => {
        handleAutoSuggestSecret(newDish);
      }, 100);
    }

    setIsAddDishModalOpen(false);
    setNewDishName('');
    setNewDishPrice('350');
    setNewDishIsSpecial(false);
    setNewDishIsChefFav(false);
    setNewDishIsVeg(true);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 p-3 sm:p-5 md:p-6 max-w-5xl mx-auto space-y-5 pb-20">
      {/* ── Top Header Navigation Bar ────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2">
          <Link
            to={`/manage/${restaurant.slug}`}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] px-3 py-1.5 rounded-xl border border-white/[0.1] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Venue Selector */}
        <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-white/[0.1]">
          <span className="text-xs text-slate-400 font-medium">Venue:</span>
          <select
            value={restaurant.id}
            onChange={(e) => setCurrentRestaurant(e.target.value)}
            className="bg-transparent text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
          >
            {activeWorkingRestaurants.map((r) => (
              <option key={r.id} value={r.id} className="bg-[#090D16] text-white">
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Page Header / Title & Actions ────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-white/[0.08]">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-amber-400" />
            <span>Chef &amp; Owner Culinary Studio</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {activeMenuItemsList.length} Dishes
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure dish preparation secrets, drink pairings, Veg / Non-Veg classifications &amp; spice levels.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddDishModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* ── Clean Filter & Search Bar ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-white/[0.08]">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setDishFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              dishFilterType === 'all'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            All ({activeMenuItemsList.length})
          </button>

          {/* Quick Veg Filter */}
          <button
            type="button"
            onClick={() => setDishFilterType('veg')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
              dishFilterType === 'veg'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Veg ({vegCount})</span>
          </button>

          {/* Quick Non-Veg Filter */}
          <button
            type="button"
            onClick={() => setDishFilterType('non_veg')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
              dishFilterType === 'non_veg'
                ? 'bg-rose-600 text-white font-black shadow-sm'
                : 'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Non-Veg ({nonVegCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setDishFilterType('chef_fav')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
              dishFilterType === 'chef_fav'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Chef's Picks ({chefFavCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setDishFilterType('specials')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
              dishFilterType === 'specials'
                ? 'bg-orange-500 text-slate-950 font-black shadow-sm'
                : 'bg-orange-500/15 text-orange-300 border border-orange-500/30 hover:bg-orange-500/25'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Specials ({specialCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setDishFilterType('bestsellers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
              dishFilterType === 'bestsellers'
                ? 'bg-purple-600 text-white font-black shadow-sm'
                : 'bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Bestsellers ({bestsellerCount})</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Category Filter */}
          <select
            value={selectedCatId}
            onChange={(e) => setSelectedCatId(e.target.value)}
            className="bg-slate-950 text-xs font-bold text-slate-300 border border-white/[0.12] rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories ({activeCategoriesList.length})</option>
            {activeCategoriesList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative min-w-[180px]">
            <input
              type="text"
              placeholder="Search dish, spice, lore..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-white/[0.12] rounded-xl pl-2.5 pr-7 py-1.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Detailed Dish Forms List (Table Card Pattern) ─────────── */}
      <div className="space-y-4">
        {filteredDishes.length === 0 ? (
          <div className="bg-slate-900/60 rounded-2xl p-8 text-center border border-white/[0.08] text-slate-400 space-y-2">
            <UtensilsCrossed className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No dishes match your filter</p>
            <p className="text-xs text-slate-500">Try changing your search query or category filter above.</p>
          </div>
        ) : (
          filteredDishes.map((dish) => {
            const category = activeCategoriesList.find((c) => c.id === dish.category_id);
            const isVeg = dish.dietary_flags.includes('Vegetarian');
            const isRecording = recordingDishId === dish.id;

            return (
              <div
                key={dish.id}
                className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-white/[0.08] hover:border-amber-500/30 transition-all space-y-4 shadow-lg"
              >
                {/* ── Row 1: Dish Identity & Actions ────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={dish.image_url}
                      alt={dish.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-white/[0.1] shadow-sm flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        {/* Interactive Clickable Veg/Non-Veg Badge */}
                        <button
                          type="button"
                          onClick={() => handleToggleDishVeg(dish)}
                          className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 transition-transform active:scale-90 cursor-pointer ${
                            isVeg ? 'border-emerald-500 hover:bg-emerald-500/10' : 'border-rose-500 hover:bg-rose-500/10'
                          }`}
                          title={isVeg ? 'Click to change to Non-Vegetarian' : 'Click to change to Vegetarian'}
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`}
                          />
                        </button>
                        <h3 className="font-bold text-white text-base">{dish.name}</h3>

                        {/* Explicit Veg / Non-Veg Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleDishVeg(dish)}
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer flex items-center space-x-1 ${
                            isVeg
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
                              : 'bg-rose-500/15 text-rose-300 border-rose-500/40 hover:bg-rose-500/25'
                          }`}
                          title="Click to switch Veg / Non-Veg status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          <span>{isVeg ? 'Veg' : 'Non-Veg'}</span>
                        </button>
                      </div>
                      <span className="text-xs text-slate-400 font-mono block pt-0.5">
                        {category?.name || 'General'} • <strong className="text-amber-300">₹{dish.price}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Badges, Presets & Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateMenuItem(dish.id, { is_chef_recommended: !dish.is_chef_recommended })
                      }
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center space-x-1 ${
                        dish.is_chef_recommended
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-white/[0.08] hover:text-amber-300'
                      }`}
                    >
                      <Star className={`w-3 h-3 ${dish.is_chef_recommended ? 'fill-slate-950' : ''}`} />
                      <span>Chef's Pick</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateMenuItem(dish.id, { is_signature: !dish.is_signature })}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center space-x-1 ${
                        dish.is_signature
                          ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-white/[0.08] hover:text-orange-300'
                      }`}
                    >
                      <Flame className="w-3 h-3" />
                      <span>Special</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateMenuItem(dish.id, { is_bestseller: !dish.is_bestseller })}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center space-x-1 ${
                        dish.is_bestseller
                          ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-white/[0.08] hover:text-purple-300'
                      }`}
                    >
                      <Award className="w-3 h-3" />
                      <span>Bestseller</span>
                    </button>

                    {/* Presets dropdown */}
                    <select
                      onChange={(e) => {
                        if (e.target.value) handleApplyPresetTemplate(dish, e.target.value);
                      }}
                      defaultValue=""
                      className="text-xs font-bold bg-slate-950 border border-white/[0.12] rounded-xl px-2 py-1.5 text-amber-300 focus:outline-none cursor-pointer"
                    >
                      <option value="" disabled>✦ Apply Culinary Style...</option>
                      <option value="royal_awadhi">👑 Royal Awadhi 18h Slow Dum</option>
                      <option value="tandoor_charcoal">🔥 Charcoal Clay Oven Roasted</option>
                      <option value="coastal_coconut">🥥 Coastal Kokum &amp; Coconut</option>
                      <option value="artisan_dessert">🍮 Desi Ghee &amp; Saffron Sweet</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleAutoSuggestSecret(dish)}
                      className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                      title="Auto-craft authentic culinary secrets and pairing notes"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Auto-Craft</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleVoiceDictation(dish.id)}
                      className={`px-2.5 py-1.5 rounded-xl border transition-all text-xs font-bold flex items-center space-x-1 cursor-pointer ${
                        isRecording
                          ? 'bg-rose-600 text-white animate-pulse border-rose-700'
                          : 'bg-slate-950 text-slate-300 hover:text-white border-white/[0.08]'
                      }`}
                      title="Record Chef's spoken recipe notes"
                    >
                      {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-amber-400" />}
                      <span className="hidden sm:inline">{isRecording ? 'Listening...' : 'Voice'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete ${dish.name}?`)) {
                          deleteMenuItem(dish.id);
                        }
                      }}
                      className="p-2 bg-slate-950 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 rounded-xl border border-white/[0.08] transition-colors cursor-pointer"
                      title="Delete Dish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* ── Row 2: Detailed Preparation & Lore Fields ──────── */}
                <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                  {/* Field 1: Secret Cooking Technique & Spices */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1.5">
                        <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                        Secret Cooking Technique &amp; Heirloom Spices
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Shared with dining guests</span>
                    </label>
                    <textarea
                      rows={2}
                      value={dish.chef_notes || ''}
                      onChange={(e) => updateMenuItem(dish.id, { chef_notes: e.target.value })}
                      placeholder="e.g. 18-hour charcoal simmer with hand-pounded mace, stone flower, and pure white makkhan..."
                      className="w-full text-xs bg-slate-950 border border-white/[0.12] rounded-xl p-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all leading-relaxed"
                    />
                  </div>

                  {/* Field 2 & 3: Generational Origin Story & Founder's Table Pitch */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                        <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                        Generational Origin Story / Heritage Lore
                      </label>
                      <input
                        type="text"
                        value={dish.chef_story || ''}
                        onChange={(e) => updateMenuItem(dish.id, { chef_story: e.target.value })}
                        placeholder="e.g. 80-year-old family recipe from Amritsar"
                        className="w-full text-xs bg-slate-950 border border-white/[0.12] rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                        <Heart className="w-3.5 h-3.5 text-rose-400" />
                        Founder's Table Recommendation
                      </label>
                      <input
                        type="text"
                        value={dish.owner_pitch || ''}
                        onChange={(e) => updateMenuItem(dish.id, { owner_pitch: e.target.value })}
                        placeholder="e.g. Our most beloved comfort dish — light on the stomach"
                        className="w-full text-xs bg-slate-950 border border-white/[0.12] rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Field 4 & 5: Sommelier Drink Pairing & Serving Temperature */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                        <GlassWater className="w-3.5 h-3.5 text-cyan-400" />
                        Recommended Beverage Pairing &amp; Reason
                      </label>
                      <input
                        type="text"
                        value={dish.pairing_drink_name || ''}
                        onChange={(e) => updateMenuItem(dish.id, { pairing_drink_name: e.target.value })}
                        placeholder="e.g. Saffron Mint Chaas (balances rich butter)"
                        className="w-full text-xs bg-slate-950 border border-white/[0.12] rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                        <Utensils className="w-3.5 h-3.5 text-slate-400" />
                        Serving Temperature &amp; Style
                      </label>
                      <input
                        type="text"
                        value={dish.temperature_style || ''}
                        onChange={(e) => updateMenuItem(dish.id, { temperature_style: e.target.value })}
                        placeholder="e.g. Sizzling hot in pre-heated cast iron skillet"
                        className="w-full text-xs bg-slate-950 border border-white/[0.12] rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Row 3: Spice Level Pill Bar & Dietary Tags ─────── */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-slate-400 font-mono">Spice Heat:</span>
                    <div className="flex items-center space-x-1">
                      {[0, 1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => updateMenuItem(dish.id, { spice_level: lvl })}
                          className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                            dish.spice_level === lvl
                              ? 'bg-rose-600 text-white shadow-sm scale-105'
                              : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono pl-1">
                      {dish.spice_level === 0
                        ? 'Mild'
                        : dish.spice_level <= 2
                        ? 'Warm'
                        : dish.spice_level === 3
                        ? 'Traditional Heat'
                        : 'Fiery'}
                    </span>
                  </div>

                  {/* Dietary Flags */}
                  <div className="flex items-center space-x-1.5">
                    {/* Explicit Veg toggle tag */}
                    <button
                      type="button"
                      onClick={() => handleToggleDishVeg(dish)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border transition-all cursor-pointer font-bold ${
                        isVeg
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                      }`}
                    >
                      {isVeg ? '🟢 Vegetarian' : '🔴 Non-Vegetarian'}
                    </button>

                    {['Gluten-Free', 'Halal', 'Nut-Free'].map((flag) => {
                      const hasFlag = dish.dietary_flags.includes(flag);
                      return (
                        <button
                          key={flag}
                          type="button"
                          onClick={() => {
                            const updated = hasFlag
                              ? dish.dietary_flags.filter((f) => f !== flag)
                              : [...dish.dietary_flags, flag];
                            updateMenuItem(dish.id, { dietary_flags: updated });
                          }}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                            hasFlag
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold'
                              : 'bg-slate-950 text-slate-500 border-white/[0.06] hover:text-slate-300'
                          }`}
                        >
                          {flag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Modal: Add New Dish ─────────────────────────────────────── */}
      {isAddDishModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#0D1322] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/[0.12] space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add New Catalog Dish to {restaurant.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddDishModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewDish} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="e.g. Murg Dum Handi Biryani"
                  className="w-full text-xs bg-slate-950 border border-white/[0.12] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Veg / Non-Veg Selector in Add Modal */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Dietary Classification *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewDishIsVeg(true)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      newDishIsVeg
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-white/[0.08] hover:text-emerald-300'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>🟢 Vegetarian</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewDishIsVeg(false)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      !newDishIsVeg
                        ? 'bg-rose-600 text-white border-rose-500 font-black shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-white/[0.08] hover:text-rose-300'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span>🔴 Non-Vegetarian</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-white/[0.12] rounded-xl px-2.5 py-2 font-bold text-white focus:outline-none cursor-pointer"
                  >
                    {activeCategoriesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-white/[0.12] rounded-xl px-3 py-2 font-mono font-bold text-amber-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Type</label>
                  <select
                    value={newDishType}
                    onChange={(e) => setNewDishType(e.target.value as any)}
                    className="w-full text-xs bg-slate-950 border border-white/[0.12] rounded-xl px-2.5 py-2 text-white cursor-pointer"
                  >
                    <option value="food">Food Dish</option>
                    <option value="drink">Beverage / Drink</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Spice Level (0-5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={newDishSpice}
                    onChange={(e) => setNewDishSpice(parseInt(e.target.value) || 0)}
                    className="w-full text-xs bg-slate-950 border border-white/[0.12] rounded-xl px-3 py-2 font-mono text-white"
                  />
                </div>
              </div>

              {/* Special Badges */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-white/[0.08] space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block">Highlight Status:</span>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newDishIsChefFav}
                      onChange={(e) => setNewDishIsChefFav(e.target.checked)}
                      className="rounded text-amber-500"
                    />
                    <span>🌟 Chef's Pick</span>
                  </label>

                  <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newDishIsSpecial}
                      onChange={(e) => setNewDishIsSpecial(e.target.checked)}
                      className="rounded text-orange-500"
                    />
                    <span>🔥 House Special</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsAddDishModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm cursor-pointer"
                >
                  Add to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
