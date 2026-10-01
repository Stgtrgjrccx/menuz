import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  MenuItem,
  MenuCategory,
  RestaurantTable,
  Restaurant,
  Order,
  OrderStatus,
  SelectedOptionSnapshot,
  CustomerReview,
  ReviewChallenge,
  ChallengeRedemption,
  PosIntegrationConfig,
  RestaurantAiQuestionnaire,
  OrderSource,
  SystemNotification,
  isWorkingWithMenuz
} from '../types';
import { Language } from '../utils/i18n';
import {
  SEED_RESTAURANTS,
  SEED_TABLES,
  SEED_CATEGORIES,
  SEED_MENU_ITEMS,
  SEED_QUESTIONNAIRES,
  SEED_REVIEWS,
  SEED_CHALLENGES,
  SEED_REDEMPTIONS,
  SEED_POS_CONFIGS,
  SEED_ORDERS,
  SEED_CAMPAIGNS
} from '../data/seedData';
import { generateCuisineMenu } from '../data/cuisineMenuGenerator';


export interface CartItem {
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  selected_options: SelectedOptionSnapshot[];
  added_by_guest?: string;
}

export interface WhatsAppCampaign {
  id: string;
  campaign_name: string;
  message_template: string;
  target_restaurant_id?: string;
  recipients_count: number;
  sent_at: string;
  status: 'sent' | 'scheduled' | 'draft';
}

interface RestaurantStoreState {
  // Multi-tenant registry
  restaurants: Restaurant[];
  restaurant: Restaurant;
  currentRestaurantId: string;
  
  // Catalogs & Operational Entities
  tables: RestaurantTable[];
  categories: MenuCategory[];
  menuItems: MenuItem[];
  orders: Order[];
  reviews: CustomerReview[];
  challenges: ReviewChallenge[];
  redemptions: ChallengeRedemption[];
  posConfigs: Record<string, PosIntegrationConfig>;
  questionnaires: Record<string, RestaurantAiQuestionnaire>;
  campaigns: WhatsAppCampaign[];
  notifications: SystemNotification[];

  // Diner state
  cart: CartItem[];
  customerNotes: string;
  activeTable: RestaurantTable | null;
  activeOrderId: string | null;
  selectedLanguage: Language;
  setSelectedLanguage: (lang: Language) => void;

  // Master Admin Actions
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void;
  toggleRestaurantStatus: (id: string) => void;
  deleteRestaurant: (id: string) => void;
  setCurrentRestaurant: (restaurantId: string) => void;

  // Table & Floor Plan Management
  addTable: (table: RestaurantTable) => void;
  updateTable: (id: string, updates: Partial<RestaurantTable>) => void;
  deleteTable: (id: string) => void;
  batchCreateTables: (restaurantId: string, count: number, startNumber?: number, section?: string, capacity?: number) => void;

  // Menu Management
  addMenuItem: (item: MenuItem) => void;
  addCategory: (category: MenuCategory) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (itemId: string) => void;
  assignImageToItem: (itemId: string, imageUrl: string) => void;

  // Reviews & Challenges
  addReview: (review: CustomerReview) => void;
  addChallenge: (challenge: ReviewChallenge) => void;
  toggleChallengeStatus: (id: string) => void;
  redeemVoucher: (voucherCode: string) => boolean;
  completeChallenge: (challengeId: string, customerName?: string, customerPhone?: string) => ChallengeRedemption | null;

  // Marketing & WhatsApp
  sendWhatsAppCampaign: (campaign: Omit<WhatsAppCampaign, 'id' | 'sent_at'>) => void;

  // POS Integration
  triggerPosSync: (restaurantId: string) => void;
  simulateIncomingPosOrder: (restaurantId: string) => Order;

  // Notification System
  addSystemNotification: (notification: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  callWaiter: (restaurantId: string, tableId: string, tableLabel: string) => void;

  // Diner Ordering
  setCustomerNotes: (notes: string) => void;
  setActiveTable: (table: RestaurantTable | null) => void;
  setActiveOrderId: (orderId: string | null) => void;
  addItemToCart: (item: CartItem) => void;
  updateCartQuantity: (menuItemId: string, quantity: number) => void;
  removeCartItem: (menuItemId: string) => void;
  clearCart: () => void;
  placeOrder: (notes?: string, source?: OrderSource) => Order | null;
  advanceOrderStatus: (orderId: string) => void;

  // Reset
  resetToDefaults: () => void;
}

const DEDICATED_REST_KEY = 'menuz_custom_onboarded_restaurants';
const PERMANENT_VAULT_KEY = 'menuz_permanent_custom_restaurants_vault';
const DEDICATED_TABLES_KEY = 'menuz_custom_tables';
const DEDICATED_ITEMS_KEY = 'menuz_custom_menu_items';
const DEDICATED_CATEGORIES_KEY = 'menuz_custom_categories';
const DEDICATED_CHALLENGES_KEY = 'menuz_custom_challenges';

const STORAGE_KEY = 'menuz_master_cloud_storage_v20_permanent_venues';

const LEGACY_STORAGE_KEYS = [
  'menuz_master_cloud_storage_v20_permanent_venues',
  'menuz_permanent_custom_restaurants_vault',
  'menuz_custom_onboarded_restaurants',
  'menuz_platform_cloud_storage_v16_enterprise_all_venues',
  'menuz_platform_storage_v15_cloud_sync_working_restaurants_only',
  'menuz-storage',
  'menuz_storage'
];

// Helper to detect if an entity is actually a dish or menu category rather than a real restaurant
export const isDishNameAsRestaurant = (r: Partial<Restaurant> | string | null | undefined): boolean => {
  if (!r) return true;
  const name = typeof r === 'string' ? r : r.name || '';
  const lower = name.trim().toLowerCase();
  if (!name.trim()) return true;

  if (typeof r === 'object') {
    const obj = r as any;
    // 1. Check dish-specific and category-specific properties
    if (
      obj.price !== undefined ||
      obj.category_id !== undefined ||
      obj.dietary_flags !== undefined ||
      obj.ingredients !== undefined ||
      obj.option_groups !== undefined ||
      obj.pairing_item_ids !== undefined ||
      obj.allergens !== undefined ||
      obj.chef_notes !== undefined ||
      obj.spice_level !== undefined ||
      obj.serving_size !== undefined ||
      obj.sort_order !== undefined ||
      obj.restaurant_id !== undefined
    ) {
      return true;
    }

    // 2. Check IDs that belong to categories, dishes, or tables
    if (
      obj.id &&
      (obj.id.startsWith('item-') ||
       obj.id.includes('dish-') ||
       obj.id.includes('menu-item') ||
       obj.id.startsWith('cat-') ||
       obj.id.startsWith('cat_') ||
       obj.id.includes('category') ||
       obj.id.startsWith('tbl-') ||
       obj.id.startsWith('table-'))
    ) {
      return true;
    }

    // 3. Genuine restaurants must have a location and cuisine unless they are a seed restaurant
    const isSeed = SEED_RESTAURANTS.some((s) => s.id === obj.id || s.slug === obj.slug);
    const hasLocation = obj.location && typeof obj.location === 'string' && obj.location.trim().length > 0;
    const hasCuisine = obj.cuisine && typeof obj.cuisine === 'string' && obj.cuisine.trim().length > 0;
    if (!isSeed && (!hasLocation || !hasCuisine)) {
      return true;
    }
  }

  // 4. Exact names and substring patterns of menu categories and dishes
  const prohibitedPatterns = [
    // Menu Categories
    'clay oven (tandoor)',
    'clay oven',
    'tandoor',
    'breads & rice',
    'breads and rice',
    'breads',
    'beverages & desserts',
    'beverages and desserts',
    'beverages',
    'desserts',
    'antipasti & crudo',
    'antipasti and crudo',
    'antipasti',
    'crudo',
    'woodfired pizza',
    'wood fired pizza',
    'wood-fired pizza',
    'pizza',
    'handmade pasta',
    'pasta',
    'dolci & caffe',
    'dolci and caffe',
    'dolci',
    'appetizers',
    'heritage curries',
    'curries',
    'starters',
    'main course',
    'mains',
    'sides',
    // Common Dishes
    'dal makhani',
    'butter chicken',
    'biryani',
    'kulcha',
    'naan',
    'roti',
    'paratha',
    'tiramisu',
    'margherita',
    'tagliatelle',
    'potli samosa',
    'samosa',
    'kebab',
    'paneer tikka',
    'crispy signature starter',
    'head chef specialty main',
    'artisanal house dessert',
    'crispy truffle herb croquettes',
    'chef special slow-cooked curry bowl',
    'craft botanical refresher',
    'craft refresher',
    'house dessert',
    'signature starter',
    'specialty main',
    'slow-cooked dal makhani',
    'slow cooked dal makhani',
    'royal dal makhani'
  ];

  for (const pattern of prohibitedPatterns) {
    if (lower === pattern || lower.startsWith(pattern) || lower.includes(pattern)) {
      return true;
    }
  }

  return false;
};

// Helper to safely recover only authentic onboarded restaurants from localStorage
export const getInitialPersistedRestaurants = (): Restaurant[] => {
  if (typeof window === 'undefined' || !window.localStorage) return SEED_RESTAURANTS;
  
  const foundMap = new Map<string, Restaurant>();

  // 1. Seed base
  for (const r of SEED_RESTAURANTS) {
    if (!isDishNameAsRestaurant(r)) {
      foundMap.set(r.id, r);
    }
  }

  // 2. Read from permanent vault & dedicated keys ONLY
  for (const vKey of [PERMANENT_VAULT_KEY, DEDICATED_REST_KEY]) {
    try {
      const raw = localStorage.getItem(vKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const r of parsed) {
            if (r && r.id && r.name && !isDishNameAsRestaurant(r) && r.location && r.cuisine) {
              foundMap.set(r.id, { ...r, is_menuz_partner: true, status: r.status || 'active' });
            }
          }
        }
      }
    } catch (e) {}
  }

  const result = Array.from(foundMap.values()).filter(
    (r) => !isDishNameAsRestaurant(r) && (SEED_RESTAURANTS.some((s) => s.id === r.id) || (r.location && r.cuisine))
  );
  try {
    localStorage.setItem(DEDICATED_REST_KEY, JSON.stringify(result));
    localStorage.setItem(
      PERMANENT_VAULT_KEY,
      JSON.stringify(result.filter((r) => !SEED_RESTAURANTS.some((s) => s.id === r.id)))
    );

    // Deep purge any dish/category items from all existing storage keys in localStorage
    for (const key of [PERMANENT_VAULT_KEY, DEDICATED_REST_KEY, ...LEGACY_STORAGE_KEYS, STORAGE_KEY]) {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(
            (item) => !isDishNameAsRestaurant(item) && (SEED_RESTAURANTS.some((s) => s.id === item.id) || (item.location && item.cuisine))
          );
          localStorage.setItem(key, JSON.stringify(cleaned));
        } else if (parsed?.state?.restaurants) {
          parsed.state.restaurants = parsed.state.restaurants.filter(
            (item: any) => !isDishNameAsRestaurant(item) && (SEED_RESTAURANTS.some((s) => s.id === item.id) || (item.location && item.cuisine))
          );
          if (isDishNameAsRestaurant(parsed.state.restaurant) || !parsed.state.restaurants.some((r: any) => r.id === parsed.state.restaurant?.id)) {
            parsed.state.restaurant = parsed.state.restaurants[0] || SEED_RESTAURANTS[0];
            parsed.state.currentRestaurantId = parsed.state.restaurant?.id || '';
          }
          localStorage.setItem(key, JSON.stringify(parsed));
        }
      }
    }
  } catch (e) {}

  return result;
};

// Immediate client-side active localStorage sanitation on module import
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('menuz') || lowerKey.includes('restaurant')) {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              const cleaned = parsed.filter(
                (item) => !isDishNameAsRestaurant(item) && (SEED_RESTAURANTS.some((s) => s.id === item?.id) || (item?.location && item?.cuisine))
              );
              if (cleaned.length !== parsed.length) {
                localStorage.setItem(key, JSON.stringify(cleaned));
              }
            } else if (parsed?.state?.restaurants) {
              const prevLen = parsed.state.restaurants.length;
              parsed.state.restaurants = parsed.state.restaurants.filter(
                (item: any) => !isDishNameAsRestaurant(item) && (SEED_RESTAURANTS.some((s) => s.id === item?.id) || (item?.location && item?.cuisine))
              );
              if (isDishNameAsRestaurant(parsed.state.restaurant) || !parsed.state.restaurants.some((r: any) => r.id === parsed.state.restaurant?.id)) {
                parsed.state.restaurant = parsed.state.restaurants[0] || SEED_RESTAURANTS[0];
                parsed.state.currentRestaurantId = parsed.state.restaurant?.id || '';
              }
              if (parsed.state.restaurants.length !== prevLen) {
                localStorage.setItem(key, JSON.stringify(parsed));
              }
            }
          } catch (err) {}
        }
      }
    }
  } catch (e) {}
}

const getInitialPersistedTables = (): RestaurantTable[] => {
  if (typeof window === 'undefined' || !window.localStorage) return SEED_TABLES;
  const map = new Map<string, RestaurantTable>();
  for (const t of SEED_TABLES) map.set(t.id, t);
  try {
    const raw = localStorage.getItem(DEDICATED_TABLES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const t of parsed) if (t?.id) map.set(t.id, t);
      }
    }
  } catch (e) {}
  for (const key of LEGACY_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.state?.tables)) {
          for (const t of parsed.state.tables) if (t?.id && !map.has(t.id)) map.set(t.id, t);
        }
      }
    } catch (e) {}
  }
  return Array.from(map.values());
};

const cleanDishItem = (m: MenuItem, restNames: string[] = []): MenuItem => {
  if (!m || !m.name) return m;
  let newName = m.name;
  if (newName.includes('Dal Makhani Saffron House')) {
    newName = newName.replace('Dal Makhani Saffron House', 'Dal Makhani Bukhara');
  }
  if (newName.includes('Crispy Signature Starter')) {
    newName = 'Crispy Truffle Herb Croquettes';
  }
  if (newName.includes('Head Chef Specialty Main')) {
    newName = 'Chef Special Slow-Cooked Curry Bowl';
  }
  for (const rName of restNames) {
    if (rName && newName.toLowerCase().startsWith(rName.toLowerCase() + ' ')) {
      newName = newName.slice(rName.length).trim();
    }
  }
  return {
    ...m,
    name: newName,
    price: typeof m.price === 'number' && !isNaN(m.price) ? m.price : Number(m.price) || 0,
    dietary_flags: Array.isArray(m.dietary_flags) ? m.dietary_flags : ['Vegetarian'],
    ingredients: Array.isArray(m.ingredients) ? m.ingredients : [],
    allergens: Array.isArray(m.allergens) ? m.allergens : [],
    option_groups: Array.isArray(m.option_groups) ? m.option_groups : [],
    is_available: m.is_available !== false
  };
};

const getInitialPersistedMenuItems = (knownRestaurants: Restaurant[] = []): MenuItem[] => {
  const restNames = [
    ...SEED_RESTAURANTS.map((r) => r.name),
    ...knownRestaurants.map((r) => r.name)
  ];
  if (typeof window === 'undefined' || !window.localStorage) {
    return SEED_MENU_ITEMS.map((m) => cleanDishItem(m, restNames));
  }
  const map = new Map<string, MenuItem>();
  for (const m of SEED_MENU_ITEMS) map.set(m.id, cleanDishItem(m, restNames));
  try {
    const raw = localStorage.getItem(DEDICATED_ITEMS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const m of parsed) if (m?.id) map.set(m.id, cleanDishItem(m, restNames));
      }
    }
  } catch (e) {}
  for (const key of LEGACY_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.state?.menuItems)) {
          for (const m of parsed.state.menuItems) {
            if (m?.id && !map.has(m.id)) map.set(m.id, cleanDishItem(m, restNames));
          }
        }
      }
    } catch (e) {}
  }
  return Array.from(map.values());
};

const getInitialPersistedCategories = (): MenuCategory[] => {
  if (typeof window === 'undefined' || !window.localStorage) return SEED_CATEGORIES;
  const map = new Map<string, MenuCategory>();
  for (const c of SEED_CATEGORIES) map.set(c.id, c);
  try {
    const raw = localStorage.getItem(DEDICATED_CATEGORIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const c of parsed) if (c?.id) map.set(c.id, c);
      }
    }
  } catch (e) {}
  for (const key of LEGACY_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.state?.categories)) {
          for (const c of parsed.state.categories) if (c?.id && !map.has(c.id)) map.set(c.id, c);
        }
      }
    } catch (e) {}
  }
  return Array.from(map.values());
};

const initialRestaurants = getInitialPersistedRestaurants();
const initialTables = getInitialPersistedTables();
const initialMenuItems = getInitialPersistedMenuItems(initialRestaurants);
const initialCategories = getInitialPersistedCategories();

export const useRestaurantStore = create<RestaurantStoreState>()(
  persist(
    (set, get) => ({
      restaurants: initialRestaurants,
      restaurant: initialRestaurants[0] || SEED_RESTAURANTS[0],
      currentRestaurantId: initialRestaurants[0]?.id || SEED_RESTAURANTS[0].id,
      tables: initialTables,
      categories: initialCategories,
      menuItems: initialMenuItems,
      orders: SEED_ORDERS,
      reviews: SEED_REVIEWS,
      challenges: SEED_CHALLENGES,
      redemptions: SEED_REDEMPTIONS,
      posConfigs: SEED_POS_CONFIGS,
      questionnaires: SEED_QUESTIONNAIRES,
      campaigns: SEED_CAMPAIGNS,
      notifications: [],

      cart: [],
      customerNotes: '',
      activeTable: null,
      activeOrderId: null,

      // Restaurant Registry Actions
      addRestaurant: (newRestInput) => {
        const newRest: Restaurant = {
          ...newRestInput,
          is_menuz_partner: true,
          status: 'active'
        };
        const cleanSlug = newRest.slug;
        const newTables: RestaurantTable[] = [
          { id: `tbl-${cleanSlug}-01`, restaurant_id: newRest.id, label: 'Table 1', public_token: `token-${cleanSlug}-01`, is_active: true, capacity: 4, section: 'Indoor Dining', status: 'vacant' },
          { id: `tbl-${cleanSlug}-02`, restaurant_id: newRest.id, label: 'Table 2', public_token: `token-${cleanSlug}-02`, is_active: true, capacity: 2, section: 'Indoor Dining', status: 'vacant' },
          { id: `tbl-${cleanSlug}-03`, restaurant_id: newRest.id, label: 'Table 3', public_token: `token-${cleanSlug}-03`, is_active: true, capacity: 6, section: 'Outdoor Patio', status: 'vacant' },
          { id: `tbl-${cleanSlug}-04`, restaurant_id: newRest.id, label: 'Table 4', public_token: `token-${cleanSlug}-04`, is_active: true, capacity: 4, section: 'Outdoor Patio', status: 'vacant' },
          { id: `tbl-${cleanSlug}-05`, restaurant_id: newRest.id, label: 'VIP Booth 1', public_token: `token-${cleanSlug}-05`, is_active: true, capacity: 8, section: 'VIP Dining', status: 'vacant' },
          { id: `tbl-${cleanSlug}-06`, restaurant_id: newRest.id, label: 'Bar Counter 1', public_token: `token-${cleanSlug}-06`, is_active: true, capacity: 2, section: 'Bar Lounge', status: 'vacant' }
        ];

        const generatedMenu = generateCuisineMenu(
          newRest.id,
          cleanSlug,
          newRest.cuisine,
          newRest.name
        );
        const newCategories: MenuCategory[] = generatedMenu.categories;
        const newDishes: MenuItem[] = generatedMenu.dishes;


        const newChallenge: ReviewChallenge = {
          id: `chal-${cleanSlug}-01`,
          restaurant_id: newRest.id,
          title: `⭐ ${newRest.name} Review & Win Challenge`,
          description: 'Share your dining feedback on Google to win a complimentary house dessert or beverage!',
          reward_type: 'free_dessert',
          reward_item_name: 'Complimentary House Specialty',
          win_probability_percent: 100,
          is_active: true,
          terms: 'Valid on today’s dining bill for table orders.',
          redemption_code_prefix: `${cleanSlug.toUpperCase().slice(0, 4)}-WIN-`
        };

        const notif: SystemNotification = {
          id: 'notif_onboard_' + Date.now(),
          type: 'order_placed',
          restaurant_id: newRest.id,
          message: `🎉 ${newRest.name} Successfully Onboarded with ${newTables.length} tables, ${newDishes.length} menu dishes, and Google Review Challenge.`,
          timestamp: new Date().toISOString(),
          read: false
        };

        const updatedRestaurants = [newRest, ...get().restaurants.filter((r) => r.id !== newRest.id)];
        const updatedTables = [...get().tables, ...newTables];
        const updatedCategories = [...get().categories, ...newCategories];
        const updatedMenuItems = [...get().menuItems, ...newDishes];
        const updatedChallenges = [newChallenge, ...get().challenges];

        // Synchronous write to localStorage to guarantee zero data loss on refresh
        try {
          localStorage.setItem(DEDICATED_REST_KEY, JSON.stringify(updatedRestaurants));
          localStorage.setItem(DEDICATED_TABLES_KEY, JSON.stringify(updatedTables));
          localStorage.setItem(DEDICATED_ITEMS_KEY, JSON.stringify(updatedMenuItems));
          localStorage.setItem(DEDICATED_CATEGORIES_KEY, JSON.stringify(updatedCategories));
          localStorage.setItem(DEDICATED_CHALLENGES_KEY, JSON.stringify(updatedChallenges));
          const onlyCustom = updatedRestaurants.filter((r) => !SEED_RESTAURANTS.some((s) => s.id === r.id));
          localStorage.setItem(PERMANENT_VAULT_KEY, JSON.stringify(onlyCustom));
        } catch (e) {
          console.error('Failed to sync to dedicated storage:', e);
        }

        set((state) => ({
          restaurants: updatedRestaurants,
          restaurant: newRest,
          currentRestaurantId: newRest.id,
          tables: updatedTables,
          categories: updatedCategories,
          menuItems: updatedMenuItems,
          challenges: updatedChallenges,
          notifications: [notif, ...state.notifications]
        }));
      },

      updateRestaurant: (id, updates) => {
        set((state) => {
          const updatedRestaurants = state.restaurants.map((r) => (r.id === id ? { ...r, ...updates } : r));
          try {
            localStorage.setItem(DEDICATED_REST_KEY, JSON.stringify(updatedRestaurants));
          } catch (e) {}
          return {
            restaurants: updatedRestaurants,
            restaurant: state.restaurant?.id === id ? { ...state.restaurant, ...updates } : state.restaurant
          };
        });
      },

      toggleRestaurantStatus: (id) => {
        set((state) => {
          const updatedRestaurants: Restaurant[] = state.restaurants.map((r) =>
            r.id === id ? { ...r, status: (r.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive' } : r
          );
          try {
            localStorage.setItem(DEDICATED_REST_KEY, JSON.stringify(updatedRestaurants));
          } catch (e) {}
          return { restaurants: updatedRestaurants };
        });
      },

      deleteRestaurant: (id) => {
        set((state) => {
          const updated = state.restaurants.filter((r) => r.id !== id);
          try {
            localStorage.setItem(DEDICATED_REST_KEY, JSON.stringify(updated));
            const customOnly = updated.filter(
              (r) => !SEED_RESTAURANTS.some((s) => s.id === r.id) && !isDishNameAsRestaurant(r)
            );
            localStorage.setItem(PERMANENT_VAULT_KEY, JSON.stringify(customOnly));

            // Also clean from all legacy and current storage keys
            for (const key of [PERMANENT_VAULT_KEY, DEDICATED_REST_KEY, ...LEGACY_STORAGE_KEYS, STORAGE_KEY]) {
              const raw = localStorage.getItem(key);
              if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                  localStorage.setItem(key, JSON.stringify(parsed.filter((item) => item.id !== id)));
                } else if (parsed?.state?.restaurants) {
                  parsed.state.restaurants = parsed.state.restaurants.filter((item: any) => item.id !== id);
                  if (parsed.state.restaurant?.id === id) {
                    parsed.state.restaurant = updated[0] || SEED_RESTAURANTS[0];
                    parsed.state.currentRestaurantId = parsed.state.restaurant?.id || '';
                  }
                  localStorage.setItem(key, JSON.stringify(parsed));
                }
              }
            }
          } catch (e) {}

          const nextRest = updated[0] || SEED_RESTAURANTS[0];
          return {
            restaurants: updated,
            restaurant: state.restaurant?.id === id ? nextRest : state.restaurant,
            currentRestaurantId: state.restaurant?.id === id ? (nextRest?.id || '') : state.currentRestaurantId
          };
        });
      },

      setCurrentRestaurant: (restaurantId) => {
        const target = get().restaurants.find((r) => r.id === restaurantId) || get().restaurants[0];
        set({ currentRestaurantId: restaurantId, restaurant: target });
      },

      // Table & Floor Plan Management Actions
      addTable: (table) => {
        set((state) => ({
          tables: [...state.tables, table]
        }));
      },

      updateTable: (id, updates) => {
        set((state) => ({
          tables: state.tables.map((t) => (t.id === id ? { ...t, ...updates } : t))
        }));
      },

      deleteTable: (id) => {
        set((state) => ({
          tables: state.tables.filter((t) => t.id !== id)
        }));
      },

      batchCreateTables: (restaurantId, count, startNumber = 1, section = 'Indoor Dining', capacity = 4) => {
        const targetRest = get().restaurants.find((r) => r.id === restaurantId);
        const slug = targetRest?.slug || 'venue';
        const newBatch: RestaurantTable[] = [];

        for (let i = 0; i < count; i++) {
          const num = startNumber + i;
          newBatch.push({
            id: `tbl-${slug}-batch-${num}-${Date.now()}`,
            restaurant_id: restaurantId,
            label: `Table ${num}`,
            public_token: `token-${slug}-tbl-${num}`,
            is_active: true,
            capacity: capacity,
            section: section,
            status: 'vacant'
          });
        }

        set((state) => ({
          tables: [...state.tables, ...newBatch]
        }));
      },

      // Menu Actions
      addMenuItem: (item) => {
        set((state) => ({
          menuItems: [item, ...state.menuItems]
        }));
      },

      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, category]
        }));
      },

      updateMenuItem: (id, updates) => {
        set((state) => ({
          menuItems: state.menuItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
        }));
      },

      deleteMenuItem: (id) => {
        set((state) => ({
          menuItems: state.menuItems.filter((item) => item.id !== id)
        }));
      },

      toggleItemAvailability: (itemId) => {
        set((state) => ({
          menuItems: state.menuItems.map((item) =>
            item.id === itemId ? { ...item, is_available: !item.is_available } : item
          )
        }));
      },

      assignImageToItem: (itemId, imageUrl) => {
        set((state) => ({
          menuItems: state.menuItems.map((item) =>
            item.id === itemId ? { ...item, image_url: imageUrl } : item
          )
        }));
      },

      // Reviews & Challenges
      addReview: (review) => {
        set((state) => ({
          reviews: [review, ...state.reviews]
        }));
      },

      addChallenge: (challenge) => {
        set((state) => ({
          challenges: [challenge, ...state.challenges]
        }));
      },

      toggleChallengeStatus: (id) => {
        set((state) => ({
          challenges: state.challenges.map((c) =>
            c.id === id ? { ...c, is_active: !c.is_active } : c
          )
        }));
      },

      redeemVoucher: (voucherCode) => {
        const redemptions = get().redemptions;
        const exists = redemptions.some((r) => r.voucher_code === voucherCode && r.status === 'unclaimed');
        if (exists) {
          set((state) => ({
            redemptions: state.redemptions.map((r) =>
              r.voucher_code === voucherCode ? { ...r, status: 'redeemed', redeemed_at: new Date().toISOString() } : r
            )
          }));
          return true;
        }
        return false;
      },

      completeChallenge: (challengeId, customerName = 'Guest Diner', customerPhone = '+91 98765 43210') => {
        const state = get();
        const chal = state.challenges.find((c) => c.id === challengeId);
        if (!chal) return null;

        const targetRest = state.restaurants.find((r) => r.id === chal.restaurant_id) || state.restaurant;
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const code = `${chal.redemption_code_prefix || 'WIN-'}${randomNum}`;

        const restItems = state.menuItems.filter((i) => i.restaurant_id === targetRest.id && i.is_available);
        const randomItem = restItems[Math.floor(Math.random() * restItems.length)] || state.menuItems[0];

        const newRedemption: ChallengeRedemption = {
          id: 'redempt_' + Date.now(),
          restaurant_id: chal.restaurant_id,
          review_id: 'rev_' + Date.now(),
          customer_name: customerName,
          voucher_code: code,
          reward_item_name: chal.reward_item_name || 'Chef Specialty Dessert',
          status: 'unclaimed',
          created_at: new Date().toISOString()
        };

        const notification: SystemNotification = {
          id: 'notif_chal_' + Date.now(),
          restaurant_id: chal.restaurant_id,
          type: 'challenge_complete',
          message: `🎁 ${customerName} won "${newRedemption.reward_item_name}" (${code})`,
          timestamp: new Date().toISOString(),
          read: false
        };

        set((s) => ({
          redemptions: [newRedemption, ...s.redemptions],
          notifications: [notification, ...s.notifications]
        }));

        return newRedemption;
      },

      sendWhatsAppCampaign: (campaign) => {
        const newCamp: WhatsAppCampaign = {
          ...campaign,
          id: 'camp_' + Date.now(),
          sent_at: new Date().toISOString(),
          status: 'sent'
        };
        set((state) => ({
          campaigns: [newCamp, ...state.campaigns]
        }));
      },

      triggerPosSync: (restaurantId) => {
        set((state) => {
          const currentConfig = state.posConfigs[restaurantId];
          if (!currentConfig) return state;

          return {
            posConfigs: {
              ...state.posConfigs,
              [restaurantId]: {
                ...currentConfig,
                last_sync_time: new Date().toISOString(),
                connection_status: 'connected'
              }
            }
          };
        });
      },

      simulateIncomingPosOrder: (restaurantId) => {
        const state = get();
        const targetRest = state.restaurants.find((r) => r.id === restaurantId) || state.restaurant;
        const availableItems = state.menuItems.filter((i) => i.restaurant_id === targetRest.id && i.is_available);
        const randomItem = availableItems[0] || state.menuItems[0];
        const orderId = 'pos_ord_' + Date.now().toString().slice(-4);
        const price = randomItem ? randomItem.price : 450;

        const simulatedOrder: Order = {
          id: orderId,
          restaurant_id: targetRest.id,
          table_id: 'tbl-01',
          table_label: 'Table 1',
          anonymous_session_id: 'session_pos_' + Date.now(),
          order_number: 'POS-' + Date.now().toString().slice(-4),
          source: 'pos',
          status: 'received',
          currency: 'INR',
          subtotal_amount: price,
          tax_amount: (price * (targetRest.tax_rate_percent || 5)) / 100,
          total_amount: price + (price * (targetRest.tax_rate_percent || 5)) / 100,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          items: [
            {
              id: 'pos_item_1',
              order_id: orderId,
              menu_item_id: randomItem ? randomItem.id : 'item-app-1',
              item_name_snapshot: randomItem ? randomItem.name : 'Chef Specialty',
              unit_price_snapshot: price,
              quantity: 1,
              selected_options_snapshot: [],
              line_total_amount: price
            }
          ]
        };

        set((s) => ({
          orders: [simulatedOrder, ...s.orders]
        }));

        return simulatedOrder;
      },

      // Diner Ordering Actions
      selectedLanguage: 'en',
      setSelectedLanguage: (lang) => set({ selectedLanguage: lang }),
      setCustomerNotes: (notes) => set({ customerNotes: notes }),
      setActiveTable: (table) => set({ activeTable: table }),
      setActiveOrderId: (orderId) => set({ activeOrderId: orderId }),

      addItemToCart: (newItem) => {
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (c) =>
              c.menu_item_id === newItem.menu_item_id &&
              JSON.stringify(c.selected_options) === JSON.stringify(newItem.selected_options)
          );

          if (existingIndex > -1) {
            const updated = [...state.cart];
            updated[existingIndex].quantity += newItem.quantity;
            return { cart: updated };
          }
          return { cart: [...state.cart, newItem] };
        });
      },

      updateCartQuantity: (menuItemId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((i) => i.menu_item_id !== menuItemId) };
          }
          return {
            cart: state.cart.map((i) =>
              i.menu_item_id === menuItemId ? { ...i, quantity } : i
            )
          };
        });
      },

      removeCartItem: (menuItemId) => {
        set((state) => ({
          cart: state.cart.filter((i) => i.menu_item_id !== menuItemId)
        }));
      },

      clearCart: () => set({ cart: [], customerNotes: '' }),

      placeOrder: (notes = '', source = 'menuz') => {
        const state = get();
        if (state.cart.length === 0) return null;

        const currentRest = state.restaurant;
        const currentTable = state.activeTable;

        const subtotal = state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const tax = (subtotal * (currentRest.tax_rate_percent || 5)) / 100;
        const grandTotal = subtotal + tax;

        const orderId = 'ord_' + Date.now().toString().slice(-6);

        const newOrder: Order = {
          id: orderId,
          restaurant_id: currentRest.id,
          table_id: currentTable?.id || 'tbl-walkin',
          table_label: currentTable?.label || 'Direct Table',
          anonymous_session_id: 'session_' + Date.now(),
          order_number: 'ORD-' + Date.now().toString().slice(-4),
          source: source,
          status: 'received',
          currency: 'INR',
          subtotal_amount: subtotal,
          tax_amount: tax,
          total_amount: grandTotal,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          customer_notes: notes || state.customerNotes,
          items: state.cart.map((cartItem, idx) => ({
            id: `item_${orderId}_${idx}`,
            order_id: orderId,
            menu_item_id: cartItem.menu_item_id,
            item_name_snapshot: cartItem.name,
            unit_price_snapshot: cartItem.price,
            quantity: cartItem.quantity,
            selected_options_snapshot: cartItem.selected_options,
            line_total_amount: cartItem.price * cartItem.quantity
          }))
        };

        const notification: SystemNotification = {
          id: 'notif_order_' + Date.now(),
          restaurant_id: currentRest.id,
          table_id: currentTable?.id,
          table_label: currentTable?.label,
          type: 'order_placed',
          message: `🛒 New order received from ${currentTable?.label || 'Table'}: ₹${grandTotal.toFixed(2)}`,
          timestamp: new Date().toISOString(),
          read: false
        };

        set((s) => ({
          orders: [newOrder, ...s.orders],
          cart: [],
          customerNotes: '',
          activeOrderId: orderId,
          notifications: [notification, ...s.notifications]
        }));

        return newOrder;
      },

      advanceOrderStatus: (orderId) => {
        set((state) => {
          const statusOrder: OrderStatus[] = ['received', 'preparing', 'ready', 'served'];
          return {
            orders: state.orders.map((o) => {
              if (o.id === orderId) {
                const currentIndex = statusOrder.indexOf(o.status);
                if (currentIndex < statusOrder.length - 1) {
                  return { ...o, status: statusOrder[currentIndex + 1] };
                }
              }
              return o;
            })
          };
        });
      },

      // Notifications
      addSystemNotification: (notification) => {
        const newNotif: SystemNotification = {
          ...notification,
          id: 'notif_' + Date.now(),
          timestamp: new Date().toISOString(),
          read: false
        };
        set((state) => ({
          notifications: [newNotif, ...state.notifications].slice(0, 100)
        }));
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        }));
      },

      clearAllNotifications: () => set({ notifications: [] }),

      callWaiter: (restaurantId, tableId, tableLabel) => {
        const notification: SystemNotification = {
          id: 'notif_waiter_' + Date.now(),
          restaurant_id: restaurantId,
          table_id: tableId,
          table_label: tableLabel,
          type: 'waiter_call',
          message: `🔔 Waiter requested at ${tableLabel}`,
          timestamp: new Date().toISOString(),
          read: false,
        };
        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 100)
        }));
      },

      resetToDefaults: () => {
        // Recover any custom user-added venues from vault so they are never destroyed by a demo catalog reset!
        const customVaultRests = getInitialPersistedRestaurants().filter(
          (r) => !SEED_RESTAURANTS.some((s) => s.id === r.id) && !isDishNameAsRestaurant(r)
        );
        const resetRestaurants = [...SEED_RESTAURANTS.filter((r) => !isDishNameAsRestaurant(r)), ...customVaultRests];
        const primaryRest = resetRestaurants[0] || SEED_RESTAURANTS[0];
        set({
          restaurants: resetRestaurants,
          restaurant: primaryRest,
          currentRestaurantId: primaryRest?.id || SEED_RESTAURANTS[0].id,
          tables: SEED_TABLES,
          categories: SEED_CATEGORIES,
          menuItems: SEED_MENU_ITEMS,
          orders: SEED_ORDERS,
          reviews: SEED_REVIEWS,
          challenges: SEED_CHALLENGES,
          redemptions: SEED_REDEMPTIONS,
          posConfigs: SEED_POS_CONFIGS,
          questionnaires: SEED_QUESTIONNAIRES,
          campaigns: SEED_CAMPAIGNS,
          notifications: [],
          cart: [],
          customerNotes: ''
        });
      }
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        restaurants: state.restaurants,
        restaurant: state.restaurant,
        currentRestaurantId: state.currentRestaurantId,
        tables: state.tables,
        menuItems: state.menuItems,
        categories: state.categories,
        orders: state.orders,
        reviews: state.reviews,
        challenges: state.challenges,
        redemptions: state.redemptions,
        campaigns: state.campaigns,
        notifications: state.notifications
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Merge missing seeds AND any custom onboarded restaurants from localStorage, strictly rejecting any dish items
        const isRealRestaurant = (r: any) =>
          r &&
          r.id &&
          r.name &&
          !isDishNameAsRestaurant(r) &&
          (SEED_RESTAURANTS.some((s) => s.id === r.id || s.slug === r.slug) || (r.location && r.cuisine));

        const persistedAll = getInitialPersistedRestaurants().filter(isRealRestaurant);
        const currentMap = new Map<string, Restaurant>();
        for (const r of state.restaurants || []) {
          if (isRealRestaurant(r)) currentMap.set(r.id, r);
        }
        for (const r of persistedAll) {
          if (isRealRestaurant(r) && !currentMap.has(r.id)) {
            currentMap.set(r.id, r);
          }
        }
        state.restaurants = Array.from(currentMap.values());

        // Also ensure tables, categories, menuItems for these restaurants are merged
        const persistedTables = getInitialPersistedTables();
        const tablesMap = new Map<string, RestaurantTable>();
        for (const t of state.tables || []) if (t?.id) tablesMap.set(t.id, t);
        for (const t of persistedTables) if (t?.id && !tablesMap.has(t.id)) tablesMap.set(t.id, t);
        state.tables = Array.from(tablesMap.values());

        const persistedItems = getInitialPersistedMenuItems();
        const itemsMap = new Map<string, MenuItem>();
        for (const m of state.menuItems || []) if (m?.id) itemsMap.set(m.id, cleanDishItem(m));
        for (const m of persistedItems) if (m?.id && !itemsMap.has(m.id)) itemsMap.set(m.id, cleanDishItem(m));
        state.menuItems = Array.from(itemsMap.values());

        const persistedCats = getInitialPersistedCategories();
        const catsMap = new Map<string, MenuCategory>();
        for (const c of state.categories || []) if (c?.id) catsMap.set(c.id, c);
        for (const c of persistedCats) if (c?.id && !catsMap.has(c.id)) catsMap.set(c.id, c);
        state.categories = Array.from(catsMap.values());

        if (
          !state.restaurant ||
          isDishNameAsRestaurant(state.restaurant) ||
          !state.restaurants.some((r: Restaurant) => r.id === state.restaurant.id)
        ) {
          state.restaurant = state.restaurants.find((r) => !isDishNameAsRestaurant(r)) || SEED_RESTAURANTS[0];
          state.currentRestaurantId = state.restaurant?.id || '';
        }

        try {
          localStorage.setItem(DEDICATED_REST_KEY, JSON.stringify(state.restaurants));
          const onlyCustom = state.restaurants.filter(
            (r) => !SEED_RESTAURANTS.some((s) => s.id === r.id) && !isDishNameAsRestaurant(r)
          );
          localStorage.setItem(PERMANENT_VAULT_KEY, JSON.stringify(onlyCustom));
        } catch (e) {}
      }
    }
  )
);
