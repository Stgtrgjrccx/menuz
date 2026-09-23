export type OrderStatus = 'received' | 'preparing' | 'ready' | 'served' | 'cancelled';

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  cuisine: string;
  logo_url: string;
  brand_colors: {
    primary: string;
    background: string;
    text: string;
    accent?: string;
  };
  currency: string;
  tax_rate_percent: number;
}

export interface RestaurantTable {
  id: string;
  restaurant_id: string;
  label: string;
  public_token: string;
  is_active: boolean;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
}

export interface MenuItemOption {
  id: string;
  restaurant_id: string;
  option_group_id: string;
  name: string;
  price_modifier: number;
  is_available: boolean;
  sort_order: number;
}

export interface MenuItemOptionGroup {
  id: string;
  restaurant_id: string;
  menu_item_id: string;
  name: string;
  min_selections: number;
  max_selections: number;
  is_required: boolean;
  sort_order: number;
  options: MenuItemOption[];
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  price: number;
  short_description: string;
  full_description: string;
  ingredients: string[];
  allergens: string[];
  dietary_flags: string[];
  spice_level: number;
  serving_size: string;
  image_url: string;
  is_available: boolean;
  pairing_item_ids: string[];
  chef_notes?: string;
  sort_order: number;
  option_groups?: MenuItemOptionGroup[];
}

export interface SelectedOptionSnapshot {
  option_id: string;
  name: string;
  price_modifier: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  item_name_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
  selected_options_snapshot: SelectedOptionSnapshot[];
  line_total_amount: number;
}

export interface Order {
  id: string;
  restaurant_id: string;
  table_id: string;
  table_label?: string;
  anonymous_session_id: string;
  order_number: string;
  status: OrderStatus;
  currency: string;
  subtotal_amount: number;
  tax_amount: number;
  total_amount: number;
  customer_notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}
