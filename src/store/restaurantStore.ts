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
  SystemNotification
} from '../types';
import {
  SEED_RESTAURANTS,
  SEED_TABLES,
  SEED_CATEGORIES,
  SEED_MENU_ITEMS,
  SEED_QUESTIONNAIRES,
  SEED_REVIEWS,
  SEED_CHALLENGES,
  SEED_REDEMPTIONS,
  SEED_POS_CONFIGS
} from '../data/seedData';

export interface CartItem {
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  selected_options: SelectedOptionSnapshot[];
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

  // Master Admin Actions
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void;
  toggleRestaurantStatus: (id: string) => void;
  deleteRestaurant: (id: string) => void;
  setCurrentRestaurant: (restaurantId: string) => void;

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

export const useRestaurantStore = create<RestaurantStoreState>()(
  persist(
    (set, get) => ({
      restaurants: SEED_RESTAURANTS,
      restaurant: SEED_RESTAURANTS[0] || ({} as Restaurant),
      currentRestaurantId: SEED_RESTAURANTS[0]?.id || '',
      tables: SEED_TABLES,
      categories: SEED_CATEGORIES,
      menuItems: SEED_MENU_ITEMS,
      orders: [],
      reviews: SEED_REVIEWS,
      challenges: SEED_CHALLENGES,
      redemptions: SEED_REDEMPTIONS,
      posConfigs: SEED_POS_CONFIGS,
      questionnaires: SEED_QUESTIONNAIRES,
      campaigns: [],
      notifications: [],

      cart: [],
      customerNotes: '',
      activeTable: null,
      activeOrderId: null,

      // Restaurant Registry Actions
      addRestaurant: (newRest) => {
        const cleanSlug = newRest.slug;
        const newTables: RestaurantTable[] = [
          { id: `tbl-${cleanSlug}-01`, restaurant_id: newRest.id, label: 'Table 1', public_token: `token-${cleanSlug}-01`, is_active: true },
          { id: `tbl-${cleanSlug}-02`, restaurant_id: newRest.id, label: 'Table 2', public_token: `token-${cleanSlug}-02`, is_active: true },
          { id: `tbl-${cleanSlug}-03`, restaurant_id: newRest.id, label: 'Table 3', public_token: `token-${cleanSlug}-03`, is_active: true },
          { id: `tbl-${cleanSlug}-04`, restaurant_id: newRest.id, label: 'Table 4', public_token: `token-${cleanSlug}-04`, is_active: true },
        ];
        const newCategories: MenuCategory[] = [
          { id: `cat-${cleanSlug}-starters`, restaurant_id: newRest.id, name: 'Starters & Small Plates', sort_order: 1, is_active: true },
          { id: `cat-${cleanSlug}-mains`, restaurant_id: newRest.id, name: 'Chef Signature Mains', sort_order: 2, is_active: true },
          { id: `cat-${cleanSlug}-desserts`, restaurant_id: newRest.id, name: 'Desserts & Refreshments', sort_order: 3, is_active: true },
        ];
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
          message: `🎉 ${newRest.name} Successfully Onboarded with 4 active tables, digital QR codes, and review challenge.`,
          timestamp: new Date().toISOString(),
          read: false
        };

        set((state) => ({
          restaurants: [newRest, ...state.restaurants],
          tables: [...state.tables, ...newTables],
          categories: [...state.categories, ...newCategories],
          challenges: [newChallenge, ...state.challenges],
          notifications: [notif, ...state.notifications]
        }));
      },

      updateRestaurant: (id, updates) => {
        set((state) => ({
          restaurants: state.restaurants.map((r) => (r.id === id ? { ...r, ...updates } : r))
        }));
      },

      toggleRestaurantStatus: (id) => {
        set((state) => ({
          restaurants: state.restaurants.map((r) =>
            r.id === id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r
          )
        }));
      },

      deleteRestaurant: (id) => {
        set((state) => ({
          restaurants: state.restaurants.filter((r) => r.id !== id)
        }));
      },

      setCurrentRestaurant: (restaurantId) => {
        const target = get().restaurants.find((r) => r.id === restaurantId) || get().restaurants[0];
        set({ currentRestaurantId: restaurantId, restaurant: target });
      },

      // Menu Management Actions
      addMenuItem: (item) => {
        set((state) => ({
          menuItems: [...state.menuItems, item]
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
        let success = false;
        set((state) => {
          const updated = state.redemptions.map((r) => {
            if (r.voucher_code.trim().toUpperCase() === voucherCode.trim().toUpperCase() && r.status === 'unclaimed') {
              success = true;
              return { ...r, status: 'redeemed' as const, redeemed_at: new Date().toISOString() };
            }
            return r;
          });
          return { redemptions: updated };
        });
        return success;
      },

      completeChallenge: (challengeId, customerName, customerPhone) => {
        let redemption: ChallengeRedemption | null = null;
        set((state) => {
          const challenge = state.challenges.find((c) => c.id === challengeId);
          if (!challenge) return state;

          const voucherCode = `WIN-${Math.floor(1000 + Math.random() * 9000)}`;
          const rewardItem = challenge.reward_item_name || 'Free Dessert / ₹100 Off';
          redemption = {
            id: 'red-' + Date.now(),
            restaurant_id: challenge.restaurant_id,
            review_id: 'rev_' + Date.now(),
            customer_name: customerName || 'Valued Diner',
            voucher_code: voucherCode,
            reward_item_name: rewardItem,
            status: 'unclaimed',
            created_at: new Date().toISOString()
          };

          const notification: SystemNotification = {
            id: 'notif-' + crypto.randomUUID().slice(0, 8),
            restaurant_id: challenge.restaurant_id,
            type: 'challenge_complete',
            message: `🎉 ${redemption.customer_name} completed challenge "${challenge.title}" and won "${rewardItem}"! (Voucher: ${voucherCode})`,
            timestamp: new Date().toISOString(),
            read: false
          };

          return {
            redemptions: [redemption, ...state.redemptions],
            notifications: [notification, ...state.notifications].slice(0, 100)
          };
        });
        return redemption;
      },

      // WhatsApp Campaign
      sendWhatsAppCampaign: (campaignData) => {
        const newCamp: WhatsAppCampaign = {
          ...campaignData,
          id: 'camp-' + Date.now(),
          sent_at: new Date().toISOString()
        };
        set((state) => ({
          campaigns: [newCamp, ...state.campaigns]
        }));
      },

      // POS Integration
      triggerPosSync: (restaurantId) => {
        set((state) => {
          const existing = state.posConfigs[restaurantId] || {
            restaurant_id: restaurantId,
            provider: 'universal_api',
            connection_status: 'connected',
            last_sync_time: new Date().toISOString(),
            auto_sync_orders: true,
            sync_latency_ms: 120,
            sync_log: []
          };

          const newLog = {
            id: 'log-' + Date.now(),
            timestamp: new Date().toISOString(),
            event: 'MANUAL_SYNC_TRIGGERED',
            details: 'Master Admin triggered real-time POS catalog and order synchronization',
            status: 'success' as const
          };

          return {
            posConfigs: {
              ...state.posConfigs,
              [restaurantId]: {
                ...existing,
                connection_status: 'connected',
                last_sync_time: new Date().toISOString(),
                sync_log: [newLog, ...(existing.sync_log || []).slice(0, 19)]
              }
            }
          };
        });
      },

      simulateIncomingPosOrder: (restaurantId) => {
        const state = get();
        const targetRest = state.restaurants.find((r) => r.id === restaurantId) || state.restaurants[0];
        const restTables = state.tables.filter((t) => t.restaurant_id === targetRest.id);
        const randomTable = restTables[Math.floor(Math.random() * restTables.length)] || {
          id: 'tbl-pos',
          label: 'Bar Counter'
        };

        const restItems = state.menuItems.filter((i) => i.restaurant_id === targetRest.id && i.is_available);
        const randomItem = restItems[Math.floor(Math.random() * restItems.length)] || state.menuItems[0];

        const orderId = 'ord_pos_' + Date.now();
        const orderNumber = 'POS-' + Math.floor(1000 + Math.random() * 9000);
        const taxRate = targetRest.tax_rate_percent || 5;
        const subtotal = randomItem.price;
        const tax = Number((subtotal * (taxRate / 100)).toFixed(2));
        const total = Number((subtotal + tax).toFixed(2));

        const newOrder: Order = {
          id: orderId,
          restaurant_id: targetRest.id,
          table_id: randomTable.id,
          table_label: randomTable.label,
          anonymous_session_id: 'sess_pos_terminal',
          order_number: orderNumber,
          source: 'pos',
          status: 'received',
          currency: targetRest.currency,
          subtotal_amount: subtotal,
          tax_amount: tax,
          total_amount: total,
          customer_notes: 'Placed via POS Floor Terminal (Table Side)',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          items: [
            {
              id: 'ord_item_' + Date.now(),
              order_id: orderId,
              menu_item_id: randomItem.id,
              item_name_snapshot: randomItem.name,
              unit_price_snapshot: randomItem.price,
              quantity: 1,
              selected_options_snapshot: [],
              line_total_amount: randomItem.price
            }
          ]
        };

        const notification: SystemNotification = {
          id: 'notif_pos_' + Date.now(),
          type: 'order_placed',
          restaurant_id: targetRest.id,
          table_id: randomTable.id,
          table_label: randomTable.label,
          message: `POS Order #${orderNumber}: ${randomTable.label} ordered ${randomItem.name} (₹${total.toFixed(0)})`,
          timestamp: new Date().toISOString(),
          read: false
        };

        set((prev) => ({
          orders: [newOrder, ...prev.orders],
          notifications: [notification, ...prev.notifications]
        }));

        return newOrder;
      },

      // Diner Actions
      setCustomerNotes: (customerNotes) => set({ customerNotes }),
      setActiveTable: (activeTable) => set({ activeTable }),
      setActiveOrderId: (activeOrderId) => set({ activeOrderId }),

      addItemToCart: (newItem) => {
        set((state) => {
          const dbItem = state.menuItems.find((i) => i.id === newItem.menu_item_id);
          if (dbItem && !dbItem.is_available) return state;

          const existingIdx = state.cart.findIndex(
            (i) =>
              i.menu_item_id === newItem.menu_item_id &&
              JSON.stringify(i.selected_options) === JSON.stringify(newItem.selected_options)
          );

          if (existingIdx > -1) {
            const updated = [...state.cart];
            updated[existingIdx].quantity += newItem.quantity;
            return { cart: updated };
          }
          return { cart: [...state.cart, newItem] };
        });
      },

      updateCartQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeCartItem(id);
          return;
        }
        set((state) => ({
          cart: state.cart.map((i) => (i.menu_item_id === id ? { ...i, quantity } : i))
        }));
      },

      removeCartItem: (id) => {
        set((state) => ({
          cart: state.cart.filter((i) => i.menu_item_id !== id)
        }));
      },

      clearCart: () => set({ cart: [], customerNotes: '' }),

      placeOrder: (notes, source = 'menuz') => {
        const state = get();
        const activeTable = state.activeTable;
        if (!activeTable) return null;
        if (state.cart.length === 0) return null;

        for (const cartItem of state.cart) {
          const freshItem = state.menuItems.find((i) => i.id === cartItem.menu_item_id);
          if (!freshItem || !freshItem.is_available) {
            throw new Error(`Item "${cartItem.name}" is currently sold out and cannot be ordered.`);
          }
        }

        const currentRest = state.restaurants.find((r) => r.id === activeTable.restaurant_id) || state.restaurants[0];
        const subtotal = state.cart.reduce((sum, item) => {
          const optsSum = item.selected_options.reduce((s, o) => s + o.price_modifier, 0);
          return sum + (item.price + optsSum) * item.quantity;
        }, 0);

        const taxRate = currentRest.tax_rate_percent || 5;
        const tax = Number((subtotal * (taxRate / 100)).toFixed(2));
        const total = Number((subtotal + tax).toFixed(2));

        const orderId = 'ord_' + crypto.randomUUID();
        const orderNumber = 'ORD-' + Math.floor(100 + Math.random() * 900);
        const sessionId = sessionStorage.getItem('menuz_session_id') || 'sess_' + crypto.randomUUID();

        const newOrder: Order = {
          id: orderId,
          restaurant_id: currentRest.id,
          table_id: activeTable.id,
          table_label: activeTable.label,
          anonymous_session_id: sessionId,
          order_number: orderNumber,
          source: source,
          status: 'received',
          currency: currentRest.currency,
          subtotal_amount: subtotal,
          tax_amount: tax,
          total_amount: total,
          customer_notes: notes || state.customerNotes || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          items: state.cart.map((c) => ({
            id: 'ord_item_' + crypto.randomUUID(),
            order_id: orderId,
            menu_item_id: c.menu_item_id,
            item_name_snapshot: c.name,
            unit_price_snapshot: c.price,
            quantity: c.quantity,
            selected_options_snapshot: c.selected_options,
            line_total_amount:
              (c.price + c.selected_options.reduce((s, o) => s + o.price_modifier, 0)) * c.quantity
          }))
        };

        const notif: SystemNotification = {
          id: 'notif-' + crypto.randomUUID().slice(0, 8),
          restaurant_id: currentRest.id,
          table_id: activeTable.id,
          table_label: activeTable.label,
          type: 'order_placed',
          message: `🍽️ New Order #${orderNumber} (${activeTable.label}) - ₹${total.toFixed(2)}`,
          timestamp: new Date().toISOString(),
          read: false
        };

        set((prev) => ({
          orders: [newOrder, ...prev.orders],
          notifications: [notif, ...prev.notifications].slice(0, 100),
          cart: [],
          customerNotes: '',
          activeOrderId: orderId
        }));

        return newOrder;
      },

      advanceOrderStatus: (orderId) => {
        const nextMap: Record<OrderStatus, OrderStatus> = {
          received: 'preparing',
          preparing: 'ready',
          ready: 'served',
          served: 'served',
          cancelled: 'cancelled'
        };

        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id === orderId) {
              const nextStatus = nextMap[o.status];
              return { ...o, status: nextStatus, updated_at: new Date().toISOString() };
            }
            return o;
          })
        }));
      },

      // ── Notification System ─────────────────────────────────
      addSystemNotification: (notification) => {
        const newNotification: SystemNotification = {
          ...notification,
          id: 'notif-' + crypto.randomUUID().slice(0, 8),
          timestamp: new Date().toISOString(),
          read: false,
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 100)
        }));
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          )
        }));
      },

      clearAllNotifications: () => {
        set({ notifications: [] });
      },

      callWaiter: (restaurantId, tableId, tableLabel) => {
        const notification: SystemNotification = {
          id: 'notif-' + crypto.randomUUID().slice(0, 8),
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
        set({
          restaurants: SEED_RESTAURANTS,
          restaurant: SEED_RESTAURANTS[0] || ({} as Restaurant),
          currentRestaurantId: SEED_RESTAURANTS[0]?.id || '',
          tables: SEED_TABLES,
          categories: SEED_CATEGORIES,
          menuItems: SEED_MENU_ITEMS,
          orders: [],
          reviews: SEED_REVIEWS,
          challenges: SEED_CHALLENGES,
          redemptions: SEED_REDEMPTIONS,
          posConfigs: SEED_POS_CONFIGS,
          questionnaires: SEED_QUESTIONNAIRES,
          campaigns: [],
          notifications: [],
          cart: [],
          customerNotes: ''
        });
      }
    }),
    {
      name: 'menuz_restaurant_storage_v5',
      partialize: (state) => ({
        restaurants: state.restaurants,
        tables: state.tables,
        menuItems: state.menuItems,
        categories: state.categories,
        orders: state.orders,
        reviews: state.reviews,
        challenges: state.challenges,
        redemptions: state.redemptions,
        campaigns: state.campaigns,
        notifications: state.notifications
      })
    }
  )
);
