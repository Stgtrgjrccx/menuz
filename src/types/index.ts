export type OrderStatus = 'received' | 'preparing' | 'ready' | 'served' | 'cancelled';
export type OrderSource = 'menuz' | 'pos' | 'external_system';
export type UserRole = 'master_admin' | 'restaurant_owner' | 'restaurant_manager' | 'restaurant_staff' | 'customer';

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  cuisine: string;
  location?: string;
  owner_name?: string;
  contact_email?: string;
  contact_phone?: string;
  status?: 'active' | 'inactive';
  logo_url: string;
  brand_colors: {
    primary: string;
    background: string;
    text: string;
    accent?: string;
  };
  currency: string;
  tax_rate_percent: number;
  ordering_enabled?: boolean;
  google_place_url?: string;
  authentic_photography_statement?: string;
  pos_provider?: 'petpooja' | 'royalpos' | 'recaho' | 'rancelab' | 'toast' | 'square' | 'clover' | 'micros' | 'universal_api';
  petpooja_config?: PetpoojaConfig;
  royalpos_config?: RoyalPosConfig;
  recaho_config?: RecahoConfig;
  rancelab_config?: RancelabConfig;
  is_menuz_partner?: boolean;
  aliases?: string[];
}

export interface PetpoojaConfig {
  enabled: boolean;
  rest_id: string;
  app_key: string;
  app_secret: string;
  access_token?: string;
  environment: 'sandbox' | 'production';
  auto_push_kot: boolean;
  auto_sync_menu: boolean;
  mapping_table_prefix?: string;
  last_kot_number?: number;
  last_synced_at?: string;
}

export interface PetpoojaKotReceipt {
  kot_number: string;
  petpooja_order_id: string;
  table_label: string;
  restaurant_name: string;
  timestamp: string;
  server_name: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    options?: string[];
    special_notes?: string;
  }>;
  subtotal: number;
  discount_amount: number;
  discount_name?: string;
  taxes: number;
  grand_total: number;
  raw_payload?: any;
}

// ─── Shared KOT receipt shape used by RoyalPOS, Recaho & RanceLab ─────────────
export interface GenericKotReceipt {
  kot_number: string;
  pos_order_id: string;
  pos_provider: 'RoyalPOS' | 'Recaho' | 'RanceLab';
  table_label: string;
  restaurant_name: string;
  timestamp: string;
  server_name: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    options?: string[];
    special_notes?: string;
  }>;
  subtotal: number;
  discount_amount: number;
  discount_name?: string;
  taxes: number;
  grand_total: number;
  raw_payload?: any;
}

// ─── RoyalPOS Configuration ────────────────────────────────────────────────────
export interface RoyalPosConfig {
  enabled: boolean;
  outlet_id: string;       // From RoyalPOS admin → Settings → Outlet Info
  bearer_token: string;    // From RoyalPOS admin → Settings → Integrations → API Token
  device_ip: string;       // LAN IP of the Android/Windows POS terminal (e.g. 192.168.1.101)
  device_port: number;     // Usually 8080
  environment: 'sandbox' | 'production';
  auto_push_kot: boolean;
  last_synced_at?: string;
}

// ─── Recaho Configuration ──────────────────────────────────────────────────────
export interface RecahoConfig {
  enabled: boolean;
  outlet_token: string;    // Per-outlet token from Recaho partner dashboard
  api_key: string;         // Account-level key from Recaho (X-Api-Key header)
  environment: 'sandbox' | 'production';
  auto_push_kot: boolean;
  auto_sync_menu: boolean;
  last_synced_at?: string;
}

// ─── RanceLab Configuration ────────────────────────────────────────────────────
export interface RancelabConfig {
  enabled: boolean;
  branch_code: string;     // Unique branch code from RanceLab admin panel
  partner_key: string;     // X-Partner-Key header (issued by RanceLab to Menuz as integration partner)
  environment: 'sandbox' | 'production';
  auto_push_kot: boolean;
  auto_sync_menu: boolean;
  gst_slab: 5 | 12 | 18 | 28;  // Indian GST slab applicable to this restaurant
  last_synced_at?: string;
}

export const isWorkingWithMenuz = (r?: { id?: string; slug?: string } | null): boolean => {
  if (!r || !r.id) return false;
  return (
    r.id === 'rest-saffron-house-01' ||
    r.id === 'rest-casa-bella-02' ||
    r.slug === 'saffron-house' ||
    r.slug === 'casa-bella' ||
    r.id.startsWith('rest-onboarded-') ||
    r.id.startsWith('rest-custom-')
  );
};

export interface RestaurantTable {
  id: string;
  restaurant_id: string;
  label: string;
  public_token: string;
  nfc_tag_id?: string;
  is_active: boolean;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  category_type?: 'food' | 'drink' | 'all';
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
  item_type?: 'food' | 'drink';
  price: number;
  short_description: string;
  full_description?: string;
  ingredients: string[];
  allergens: string[];
  dietary_flags: string[];
  spice_level: number;
  sweet_level?: number;
  serving_size: string;
  image_url: string;
  is_available: boolean;
  is_signature?: boolean;
  is_bestseller?: boolean;
  is_seasonal?: boolean;
  is_chef_recommended?: boolean;
  is_new?: boolean;
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
  source: OrderSource;
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

export interface RestaurantAiQuestionnaire {
  restaurant_id: string;
  concept: string;
  cuisine_style: string;
  dining_experience: string;
  price_positioning: string;
  target_customer: string;
  signature_dishes: string[];
  chef_recommendations: string[];
  best_sellers: string[];
  pairings_overview: string;
  custom_rules: string;
}

export interface CustomerReview {
  id: string;
  restaurant_id: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  rating: number;
  selected_keywords: string[];
  review_text: string;
  whatsapp_opt_in: boolean;
  google_review_clicked: boolean;
  created_at: string;
}

export interface ReviewChallenge {
  id: string;
  restaurant_id: string;
  title: string;
  description: string;
  reward_type: 'free_drink' | 'free_dessert' | 'free_starter' | 'free_food_item' | 'discount';
  reward_item_name: string;
  win_probability_percent: number;
  is_active: boolean;
  terms: string;
  redemption_code_prefix: string;
}

export interface ChallengeRedemption {
  id: string;
  restaurant_id: string;
  review_id: string;
  customer_name: string;
  voucher_code: string;
  reward_item_name: string;
  status: 'unclaimed' | 'redeemed';
  created_at: string;
  redeemed_at?: string;
}

export interface PosSyncEvent {
  id: string;
  timestamp: string;
  event: string;
  details: string;
  status: 'success' | 'warning' | 'info';
}

export interface PosIntegrationConfig {
  restaurant_id: string;
  provider: 'toast' | 'square' | 'clover' | 'micros' | 'universal_api';
  connection_status: 'connected' | 'syncing' | 'offline';
  last_sync_time: string;
  auto_sync_orders: boolean;
  sync_latency_ms: number;
  sync_log: PosSyncEvent[];
}

export type NotificationType = 'waiter_call' | 'challenge_complete' | 'order_placed' | 'review_submitted' | 'service_alert';

export interface SystemNotification {
  id: string;
  restaurant_id: string;
  table_id?: string;
  table_label?: string;
  type: NotificationType;
  message: string;
  customer_name?: string;
  timestamp: string;
  read: boolean;
}
