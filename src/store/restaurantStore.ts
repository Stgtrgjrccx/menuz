import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem, MenuCategory, RestaurantTable, Restaurant, Order, OrderStatus, SelectedOptionSnapshot } from '../types';
import { SEED_RESTAURANT, SEED_TABLES, SEED_CATEGORIES, SEED_MENU_ITEMS } from '../data/seedData';

export interface CartItem {
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  selected_options: SelectedOptionSnapshot[];
}

interface RestaurantStoreState {
  restaurant: Restaurant;
  tables: RestaurantTable[];
  categories: MenuCategory[];
  menuItems: MenuItem[];
  orders: Order[];
  cart: CartItem[];
  customerNotes: string;
  activeTable: RestaurantTable | null;
  activeOrderId: string | null;

  // Actions
  setCustomerNotes: (notes: string) => void;
  setActiveTable: (table: RestaurantTable | null) => void;
  setActiveOrderId: (orderId: string | null) => void;
  toggleItemAvailability: (itemId: string) => void;
  addItemToCart: (item: CartItem) => void;
  updateCartQuantity: (menuItemId: string, quantity: number) => void;
  removeCartItem: (menuItemId: string) => void;
  clearCart: () => void;
  placeOrder: (notes?: string) => Order | null;
  advanceOrderStatus: (orderId: string) => void;
  resetToDefaults: () => void;
}

export const useRestaurantStore = create<RestaurantStoreState>()(
  persist(
    (set, get) => ({
      restaurant: SEED_RESTAURANT,
      tables: SEED_TABLES,
      categories: SEED_CATEGORIES,
      menuItems: SEED_MENU_ITEMS,
      orders: [],
      cart: [],
      customerNotes: '',
      activeTable: null,
      activeOrderId: null,

      setCustomerNotes: (customerNotes) => set({ customerNotes }),
      setActiveTable: (activeTable) => set({ activeTable }),
      setActiveOrderId: (activeOrderId) => set({ activeOrderId }),

      toggleItemAvailability: (itemId) => {
        set((state) => ({
          menuItems: state.menuItems.map((item) =>
            item.id === itemId ? { ...item, is_available: !item.is_available } : item
          )
        }));
      },

      addItemToCart: (newItem) => {
        set((state) => {
          // Check if item is available
          const dbItem = state.menuItems.find(i => i.id === newItem.menu_item_id);
          if (dbItem && !dbItem.is_available) return state;

          const existingIdx = state.cart.findIndex(i => 
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
          cart: state.cart.map(i => i.menu_item_id === id ? { ...i, quantity } : i)
        }));
      },

      removeCartItem: (id) => {
        set((state) => ({
          cart: state.cart.filter(i => i.menu_item_id !== id)
        }));
      },

      clearCart: () => set({ cart: [], customerNotes: '' }),

      placeOrder: (notes) => {
        const state = get();
        const activeTable = state.activeTable;
        if (!activeTable) return null;
        if (state.cart.length === 0) return null;

        // Verify that no sold out items are in the cart
        for (const cartItem of state.cart) {
          const freshItem = state.menuItems.find(i => i.id === cartItem.menu_item_id);
          if (!freshItem || !freshItem.is_available) {
            throw new Error(`Item "${cartItem.name}" is currently sold out and cannot be ordered.`);
          }
        }

        const subtotal = state.cart.reduce((sum, item) => {
          const optsSum = item.selected_options.reduce((s, o) => s + o.price_modifier, 0);
          return sum + (item.price + optsSum) * item.quantity;
        }, 0);

        const taxRate = state.restaurant.tax_rate_percent || 5;
        const tax = Number((subtotal * (taxRate / 100)).toFixed(2));
        const total = Number((subtotal + tax).toFixed(2));

        const orderId = 'ord_' + crypto.randomUUID();
        const orderNumber = 'ORD-' + Math.floor(100 + Math.random() * 900);
        const sessionId = sessionStorage.getItem('menuz_session_id') || 'sess_' + crypto.randomUUID();

        const newOrder: Order = {
          id: orderId,
          restaurant_id: state.restaurant.id,
          table_id: activeTable.id,
          table_label: activeTable.label,
          anonymous_session_id: sessionId,
          order_number: orderNumber,
          status: 'received',
          currency: 'INR',
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
            line_total_amount: (c.price + c.selected_options.reduce((s, o) => s + o.price_modifier, 0)) * c.quantity
          }))
        };

        set((prev) => ({
          orders: [newOrder, ...prev.orders],
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

      resetToDefaults: () => {
        set({
          restaurant: SEED_RESTAURANT,
          tables: SEED_TABLES,
          categories: SEED_CATEGORIES,
          menuItems: SEED_MENU_ITEMS,
          orders: [],
          cart: [],
          customerNotes: ''
        });
      }
    }),
    {
      name: 'menuz_restaurant_storage',
      partialize: (state) => ({
        menuItems: state.menuItems,
        orders: state.orders,
        cart: state.cart,
        customerNotes: state.customerNotes
      })
    }
  )
);
