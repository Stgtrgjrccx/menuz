import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Download,
  ToggleLeft,
  ToggleRight,
  QrCode,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Plus,
  Bell,
  Award,
  X,
  Flame,
  Trash2,
  AlertCircle,
  Check,
  UtensilsCrossed,
  ExternalLink
} from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { MenuItem, MenuCategory } from '../types';

const SAMPLE_FOOD_IMAGES = [
  { label: 'Paneer / Curry', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Biryani / Rice', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tandoor / Kebab', url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80' },
  { label: 'Dal Makhani', url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80' },
  { label: 'Naan / Breads', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' },
  { label: 'Dessert / Sweet', url: 'https://images.unsplash.com/photo-1605197148560-64ab7b8c347f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Beverage / Drink', url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80' },
];

export const ManagerDashboard: React.FC = () => {
  const { restaurantSlug } = useParams<{ restaurantSlug?: string }>();
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const setCurrentRestaurant = useRestaurantStore((state) => state.setCurrentRestaurant);
  const tables = useRestaurantStore((state) => state.tables);
  const menuItems = useRestaurantStore((state) => state.menuItems);
  const categories = useRestaurantStore((state) => state.categories);
  const orders = useRestaurantStore((state) => state.orders);
  const notifications = useRestaurantStore((state) => state.notifications);
  const toggleItemAvailability = useRestaurantStore((state) => state.toggleItemAvailability);
  const deleteMenuItem = useRestaurantStore((state) => state.deleteMenuItem);
  const addMenuItem = useRestaurantStore((state) => state.addMenuItem);
  const addCategory = useRestaurantStore((state) => state.addCategory);
  const markNotificationRead = useRestaurantStore((state) => state.markNotificationRead);
  const resetToDefaults = useRestaurantStore((state) => state.resetToDefaults);

  // Sync route slug to current active restaurant
  useEffect(() => {
    if (restaurantSlug) {
      const match = restaurants.find((r) => r.slug === restaurantSlug);
      if (match && match.id !== restaurant.id) {
        setCurrentRestaurant(match.id);
      }
    }
  }, [restaurantSlug, restaurants, restaurant.id, setCurrentRestaurant]);

  // Scoped entities for active restaurant
  const currentRestTables = tables.filter((t) => t.restaurant_id === restaurant.id);
  const activeTablesList = currentRestTables.length > 0 ? currentRestTables : tables;

  const currentRestCategories = categories.filter((c) => c.restaurant_id === restaurant.id);
  const activeCategoriesList = currentRestCategories.length > 0 ? currentRestCategories : categories;

  const currentRestMenuItems = menuItems.filter((m) => m.restaurant_id === restaurant.id);
  const activeMenuItemsList = currentRestMenuItems.length > 0 ? currentRestMenuItems : menuItems;

  const currentRestOrders = orders.filter((o) => o.restaurant_id === restaurant.id);
  const activeOrdersList = currentRestOrders.length > 0 ? currentRestOrders : orders;

  const currentRestNotifications = notifications.filter((n) => !n.restaurant_id || n.restaurant_id === restaurant.id);
  const activeNotificationsList = currentRestNotifications;

  // Modal state for adding a custom dish
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [dishForm, setDishForm] = useState({
    name: '',
    categoryId: activeCategoriesList[0]?.id || '',
    newCategoryName: '',
    price: '',
    isVeg: true,
    spiceLevel: 1,
    shortDescription: '',
    fullDescription: '',
    chefNotes: '',
    ingredients: '',
    allergens: '',
    dietaryFlags: ['Vegetarian'],
    imageUrl: SAMPLE_FOOD_IMAGES[0].url,
    itemType: 'food' as 'food' | 'beverage'
  });
  const [addSuccessMsg, setAddSuccessMsg] = useState<string | null>(null);

  const totalVolume = activeOrdersList.reduce((sum, o) => sum + o.total_amount, 0);
  const totalOrdersCount = activeOrdersList.length;
  const unreadWaiterCalls = activeNotificationsList.filter((n) => n.type === 'waiter_call' && !n.read);

  const downloadTableQrSvg = (tableLabel: string, publicToken: string) => {
    const origin = window.location.origin;
    const targetUrl = `${origin}/#/r/${restaurant.slug}/menu?t=${publicToken}`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(targetUrl)}&color=1C1917&bgcolor=FFFFFF`;
    const primaryColor = restaurant.brand_colors?.primary || '#E85D04';

    const svgTemplate = `
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="560" viewBox="0 0 420 560">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&amp;family=Plus+Jakarta+Sans:wght@500;700&amp;display=swap');
      .serif { font-family: 'Playfair Display', Georgia, serif; }
      .sans { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
    </style>
  </defs>
  <!-- Background Card -->
  <rect width="420" height="560" rx="32" fill="#FDFBF7" stroke="#EFE9DE" stroke-width="2"/>
  
  <!-- Outer Gold Border -->
  <rect x="24" y="24" width="372" height="512" rx="24" fill="none" stroke="${primaryColor}" stroke-width="2" stroke-dasharray="6 4"/>
  
  <!-- Header Branding -->
  <text x="210" y="75" text-anchor="middle" fill="${primaryColor}" class="sans" font-size="11" font-weight="700" letter-spacing="3">${(restaurant.cuisine || 'CONTEMPORARY DINING').toUpperCase()}</text>
  <text x="210" y="110" text-anchor="middle" fill="#1C1917" class="serif" font-size="26" font-weight="700">${restaurant.name.toUpperCase()}</text>
  
  <!-- Table Badge -->
  <rect x="135" y="130" width="150" height="34" rx="17" fill="#FFEDD5"/>
  <text x="210" y="152" text-anchor="middle" fill="#C84B00" class="sans" font-size="14" font-weight="700">${tableLabel}</text>
  
  <!-- QR Code Framing -->
  <rect x="70" y="185" width="280" height="280" rx="20" fill="#FFFFFF" filter="drop-shadow(0 4px 12px rgba(28,25,23,0.06))"/>
  <image href="${qrApiUrl}" x="85" y="200" width="250" height="250"/>
  
  <!-- Instructions -->
  <text x="210" y="495" text-anchor="middle" fill="#1C1917" class="serif" font-size="15" font-weight="700">Scan to View Menu &amp; Order</text>
  <text x="210" y="515" text-anchor="middle" fill="#78716C" class="sans" font-size="11">No app download • Powered by Menuz AI</text>
</svg>`.trim();

    const blob = new Blob([svgTemplate], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${restaurant.name.replace(/\s+/g, '_')}_${tableLabel.replace(/\s+/g, '_')}_QR.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishForm.name.trim() || !dishForm.price) return;

    let targetCatId = dishForm.categoryId;
    if (dishForm.categoryId === '__new__' && dishForm.newCategoryName.trim()) {
      targetCatId = 'cat_' + Date.now();
      const newCat: MenuCategory = {
        id: targetCatId,
        restaurant_id: restaurant.id,
        name: dishForm.newCategoryName.trim(),
        category_type: 'food',
        sort_order: categories.length + 1,
        is_active: true
      };
      addCategory(newCat);
    }

    const priceNum = parseFloat(dishForm.price) || 0;
    const ingredientsArr = dishForm.ingredients
      ? dishForm.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Fresh Spices', 'Herbs'];
    const allergensArr = dishForm.allergens
      ? dishForm.allergens.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const flags = [...dishForm.dietaryFlags];
    if (dishForm.isVeg && !flags.includes('Vegetarian')) {
      flags.push('Vegetarian');
    }

    const newDish: MenuItem = {
      id: 'dish_' + Date.now(),
      restaurant_id: restaurant.id,
      category_id: targetCatId || categories[0]?.id || 'cat_default',
      item_type: dishForm.itemType === 'beverage' ? 'drink' : 'food',
      name: dishForm.name.trim(),
      short_description: dishForm.shortDescription.trim() || `${dishForm.name} prepared freshly in our kitchen.`,
      full_description: dishForm.fullDescription.trim() || dishForm.shortDescription.trim(),
      chef_notes: dishForm.chefNotes.trim() || undefined,
      price: priceNum,
      spice_level: dishForm.spiceLevel,
      dietary_flags: flags,
      allergens: allergensArr,
      ingredients: ingredientsArr,
      image_url: dishForm.imageUrl || SAMPLE_FOOD_IMAGES[0].url,
      is_available: true,
      is_bestseller: false,
      is_chef_recommended: true,
      serving_size: '1 Portion',
      pairing_item_ids: [],
      sort_order: menuItems.length + 1
    };

    addMenuItem(newDish);
    setIsAddDishOpen(false);
    setAddSuccessMsg(`"${newDish.name}" has been added to the live menu!`);
    setTimeout(() => setAddSuccessMsg(null), 4000);

    // Reset form
    setDishForm({
      name: '',
      categoryId: categories[0]?.id || '',
      newCategoryName: '',
      price: '',
      isVeg: true,
      spiceLevel: 1,
      shortDescription: '',
      fullDescription: '',
      chefNotes: '',
      ingredients: '',
      allergens: '',
      dietaryFlags: ['Vegetarian'],
      imageUrl: SAMPLE_FOOD_IMAGES[0].url,
      itemType: 'food'
    });
  };

  return (
    <div className="min-h-screen bg-ivory-50 p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-20">
      {/* Top Bar */}
      <header className="flex flex-wrap justify-between items-center pb-5 border-b border-ivory-200 gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-saffron-700 block">
            Restaurant Operations Console
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">{restaurant.name}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`/r/${restaurant.slug}/menu?t=${activeTablesList[0]?.public_token || 'table-token-01-saffron'}`}
            className="flex items-center space-x-1.5 text-xs text-charcoal-700 bg-white border border-ivory-200 px-3.5 py-2.5 rounded-xl shadow-subtle hover:bg-ivory-100 transition-colors font-bold"
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-saffron-600" />
            <span>Launch Diner Menu</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsAddDishOpen(true)}
            className="flex items-center space-x-1.5 text-xs text-white bg-saffron-600 hover:bg-saffron-700 font-bold px-4 py-2.5 rounded-xl shadow-subtle transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Dish</span>
          </button>

          <button
            type="button"
            onClick={resetToDefaults}
            className="flex items-center space-x-1.5 text-xs text-charcoal-700 bg-white border border-ivory-200 px-3.5 py-2 rounded-xl shadow-subtle hover:bg-ivory-100 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-saffron-600" />
            <span>Reset Demo Catalog</span>
          </button>
        </div>
      </header>

      {/* Success Notification Banner */}
      {addSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl flex items-center space-x-2 shadow-xs text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{addSuccessMsg}</span>
        </div>
      )}

      {/* Live Waiter Calls Alert Banner */}
      {unreadWaiterCalls.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <h3 className="font-serif font-bold text-base text-charcoal-900">
                Active Waiter Assistance Calls ({unreadWaiterCalls.length})
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {unreadWaiterCalls.map((notif) => (
              <div
                key={notif.id}
                className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-700 block">Table Request</span>
                  <p className="font-serif font-bold text-sm text-charcoal-900">
                    {notif.table_label || 'Customer Table'}
                  </p>
                  <p className="text-[10px] text-charcoal-500">Assistance Requested</p>
                </div>
                <button
                  type="button"
                  onClick={() => markNotificationRead(notif.id)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Attend
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-ivory-200 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-saffron-100 flex items-center justify-center text-saffron-700">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-charcoal-700/60 font-medium">Session Revenue</span>
            <p className="font-serif text-2xl font-bold text-charcoal-900">₹{totalVolume.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-ivory-200 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-charcoal-700/60 font-medium">Orders Placed</span>
            <p className="font-serif text-2xl font-bold text-charcoal-900">{totalOrdersCount} tickets</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-ivory-200 shadow-subtle flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-800">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-charcoal-700/60 font-medium">Active QR Tables</span>
            <p className="font-serif text-2xl font-bold text-charcoal-900">{activeTablesList.length} tables</p>
          </div>
        </div>
      </div>

      {/* Table QR Card Generator */}
      <section className="bg-white p-6 rounded-3xl border border-ivory-200 shadow-subtle">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal-900">Table QR Badges</h2>
            <p className="text-xs text-charcoal-700/60 mt-0.5">
              Download high-resolution, print-ready SVG cards with embedded table routing tokens.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {activeTablesList.map((table) => (
            <div
              key={table.id}
              className="bg-ivory-50/70 border border-ivory-200 rounded-2xl p-4 text-center space-y-3"
            >
              <div className="w-10 h-10 bg-saffron-100 text-saffron-700 rounded-xl mx-auto flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif font-bold text-base text-charcoal-900">{table.label}</p>
                <p className="text-[10px] text-charcoal-700/50 font-mono truncate">{table.public_token}</p>
              </div>
              <button
                type="button"
                onClick={() => downloadTableQrSvg(table.label, table.public_token)}
                className="w-full bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 shadow-subtle transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download SVG Card</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Live Menu Availability & Catalog Manager */}
      <section className="bg-white p-6 rounded-3xl border border-ivory-200 shadow-subtle">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal-900">
              Live Kitchen Stock Manager & Catalog ({activeMenuItemsList.length} dishes)
            </h2>
            <p className="text-xs text-charcoal-700/60 mt-0.5">
              Toggle dish availability instantly (86-ing) or custom add special dishes to your live menu.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddDishOpen(true)}
            className="flex items-center space-x-1 px-3.5 py-1.5 bg-saffron-50 hover:bg-saffron-100 text-saffron-700 border border-saffron-200 rounded-xl text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Dish</span>
          </button>
        </div>

        <div className="divide-y divide-ivory-100">
          {activeMenuItemsList.map((item) => (
            <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-ivory-100"
                />
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-serif font-bold text-sm text-charcoal-900 truncate">{item.name}</h4>
                    {item.is_chef_recommended && (
                      <span className="text-[9px] bg-saffron-50 text-saffron-700 px-1.5 py-0.2 rounded font-bold border border-saffron-200">
                        Chef Pick
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-xs text-saffron-700 font-semibold">₹{item.price.toFixed(2)}</span>
                    <span className="text-[10px] text-charcoal-400">
                      {activeCategoriesList.find((c) => c.id === item.category_id)?.name || 'General'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => toggleItemAvailability(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                    item.is_available
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {item.is_available ? (
                    <>
                      <ToggleRight className="w-4 h-4 text-green-700" />
                      <span>Available</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4 text-red-700" />
                      <span>Sold Out (86)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => deleteMenuItem(item.id)}
                  className="p-1.5 text-charcoal-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Remove Dish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODAL: CUSTOM ADD DISH                                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isAddDishOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-float border border-ivory-200 animate-scaleUp">
            <div className="flex justify-between items-center pb-4 border-b border-ivory-200">
              <div>
                <h3 className="font-serif text-xl font-bold text-charcoal-900">Add Custom Dish</h3>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Create and publish a new culinary item directly to the live customer menu.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddDishOpen(false)}
                className="p-1.5 rounded-full hover:bg-ivory-100 text-charcoal-400 hover:text-charcoal-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="space-y-4 pt-4">
              {/* Dish Name */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kolhapuri Mutton Sukka or Paneer Lababdar"
                  value={dishForm.name}
                  onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3.5 py-2.5 text-xs text-charcoal-900 font-medium focus:outline-none focus:border-saffron-600"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Category *</label>
                  <select
                    value={dishForm.categoryId}
                    onChange={(e) => setDishForm({ ...dishForm, categoryId: e.target.value })}
                    className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 text-xs text-charcoal-900 font-medium focus:outline-none focus:border-saffron-600"
                  >
                    {activeCategoriesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                    <option value="__new__">+ Create New Category...</option>
                  </select>

                  {dishForm.categoryId === '__new__' && (
                    <input
                      type="text"
                      placeholder="Category name"
                      value={dishForm.newCategoryName}
                      onChange={(e) => setDishForm({ ...dishForm, newCategoryName: e.target.value })}
                      className="mt-2 w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-1.5 text-xs text-charcoal-900"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    placeholder="450"
                    value={dishForm.price}
                    onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
                    className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 font-medium focus:outline-none focus:border-saffron-600"
                  />
                </div>
              </div>

              {/* Diet Type & Spice Level */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Dietary Type</label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setDishForm({ ...dishForm, isVeg: true, dietaryFlags: ['Vegetarian'] })}
                      className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center space-x-1 ${
                        dishForm.isVeg
                          ? 'bg-green-50 border-green-600 text-green-800'
                          : 'bg-white border-ivory-300 text-charcoal-600'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-green-600"></span>
                      <span>Veg</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDishForm({ ...dishForm, isVeg: false, dietaryFlags: [] })}
                      className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center space-x-1 ${
                        !dishForm.isVeg
                          ? 'bg-red-50 border-red-600 text-red-800'
                          : 'bg-white border-ivory-300 text-charcoal-600'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-red-600"></span>
                      <span>Non-Veg</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Spice Level ({dishForm.spiceLevel}/5)
                  </label>
                  <div className="flex items-center space-x-1 pt-1">
                    {[0, 1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setDishForm({ ...dishForm, spiceLevel: lvl })}
                        className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border transition-colors ${
                          dishForm.spiceLevel === lvl
                            ? 'bg-saffron-600 text-white border-saffron-600'
                            : 'bg-white text-charcoal-600 border-ivory-300 hover:bg-ivory-100'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. Slow-cooked cottage cheese cubes in rich velvety tomato-cashew gravy."
                  value={dishForm.shortDescription}
                  onChange={(e) => setDishForm({ ...dishForm, shortDescription: e.target.value })}
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3.5 py-2 text-xs text-charcoal-900 font-medium focus:outline-none focus:border-saffron-600"
                />
              </div>

              {/* Ingredients & Allergens */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Ingredients (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Paneer, Cream, Tomatoes, Spices"
                    value={dishForm.ingredients}
                    onChange={(e) => setDishForm({ ...dishForm, ingredients: e.target.value })}
                    className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 text-xs text-charcoal-900 font-medium focus:outline-none focus:border-saffron-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">Allergens (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Dairy, Cashew"
                    value={dishForm.allergens}
                    onChange={(e) => setDishForm({ ...dishForm, allergens: e.target.value })}
                    className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 text-xs text-charcoal-900 font-medium focus:outline-none focus:border-saffron-600"
                  />
                </div>
              </div>

              {/* Dish Photo Selection */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                  Dish Photograph
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {SAMPLE_FOOD_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setDishForm({ ...dishForm, imageUrl: img.url })}
                      className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all ${
                        dishForm.imageUrl === img.url ? 'border-saffron-600 scale-95 shadow-md' : 'border-ivory-200 opacity-75'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-charcoal-900/80 text-[8px] text-white text-center py-0.5 font-bold truncate">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  placeholder="Or enter custom image URL"
                  value={dishForm.imageUrl}
                  onChange={(e) => setDishForm({ ...dishForm, imageUrl: e.target.value })}
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-1.5 text-xs text-charcoal-900 font-mono"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center space-x-3 pt-3 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsAddDishOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-ivory-300 text-xs font-bold text-charcoal-700 hover:bg-ivory-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold transition-colors shadow-subtle flex items-center justify-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish to Live Menu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
