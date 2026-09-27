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
  pos_provider?:
    | 'petpooja'
    | 'posist'
    | 'urbanpiper'
    | 'dotpe'
    | 'pinelabs'
    | 'royalpos'
    | 'recaho'
    | 'rancelab'
    | 'slickpos'
    | 'toast'
    | 'square'
    | 'clover'
    | 'lightspeed'
    | 'touchbistro'
    | 'micros'
    | 'aloha'
    | 'deliverect'
    | 'esc_pos_direct'
    | 'universal_api'
    | 'tri_sync_multi';
  petpooja_config?: PetpoojaConfig;
  royalpos_config?: RoyalPosConfig;
  recaho_config?: RecahoConfig;
  rancelab_config?: RancelabConfig;
  direct_printer_config?: {
    enabled: boolean;
    ip: string;
    port: number;
    model?: string;
  };
  is_menuz_partner?: boolean;
  aliases?: string[];
  ai_persona?: ChefOwnerAiPersona;
  white_label?: WhiteLabelConfig;
}

export interface WhiteLabelConfig {
  custom_domain?: string;
  domain_verified?: boolean;
  cname_target?: string;
  ssl_status?: 'active' | 'provisioning' | 'pending';
  hide_menuz_branding?: boolean;
  custom_support_email?: string;
  custom_support_phone?: string;
  custom_favicon_url?: string;
  custom_header_logo_url?: string;
  custom_footer_text?: string;
}

export const MODERN_POS_PROVIDERS = [
  { id: 'petpooja', name: 'Petpooja POS', region: 'India & UAE (55k+ Outlets)', tag: 'Popular', logoText: 'Petpooja' },
  { id: 'posist', name: 'Posist / Restroworks', region: 'Global & Enterprise (20k+ Outlets)', tag: 'Enterprise', logoText: 'Posist' },
  { id: 'urbanpiper', name: 'UrbanPiper (Prime POS & Hub)', region: 'India & Middle East', tag: 'Omnichannel', logoText: 'UrbanPiper' },
  { id: 'dotpe', name: 'DotPe Digital & In-Store POS', region: 'India (Retail & Dining)', tag: 'Digital', logoText: 'DotPe' },
  { id: 'pinelabs', name: 'Pine Labs / Plutus POS', region: 'India & Southeast Asia', tag: 'Fintech', logoText: 'Pine Labs' },
  { id: 'royalpos', name: 'RoyalPOS (Wi-Fi Local KOT)', region: 'Local Android / Windows', tag: 'Offline LAN', logoText: 'RoyalPOS' },
  { id: 'recaho', name: 'Recaho Cloud & Hybrid POS', region: 'Maharashtra & Pan-India', tag: 'Hybrid', logoText: 'Recaho' },
  { id: 'rancelab', name: 'RanceLab FusionRest', region: 'Multi-Outlet Chains & F&B', tag: 'Chains', logoText: 'RanceLab' },
  { id: 'slickpos', name: 'SlickPOS Cloud Terminal', region: 'Cafes & Quick Service', tag: 'QSR', logoText: 'SlickPOS' },
  { id: 'toast', name: 'Toast POS', region: 'US, UK & Global Leader', tag: 'Top Global', logoText: 'Toast' },
  { id: 'square', name: 'Square for Restaurants', region: 'US, UK, Australia, Japan', tag: 'Fast Setup', logoText: 'Square' },
  { id: 'clover', name: 'Clover POS (Fiserv)', region: 'US & Global Hospitality', tag: 'Hardware', logoText: 'Clover' },
  { id: 'lightspeed', name: 'Lightspeed Restaurant POS', region: 'Europe, US & APAC', tag: 'Cloud', logoText: 'Lightspeed' },
  { id: 'touchbistro', name: 'TouchBistro iPad POS', region: 'North America & UK', tag: 'iPad Native', logoText: 'TouchBistro' },
  { id: 'micros', name: 'Oracle MICROS Simphony', region: 'Luxury Hotels & Resorts', tag: 'Hotel/Resort', logoText: 'MICROS' },
  { id: 'aloha', name: 'NCR Aloha POS', region: 'Enterprise Franchise Chains', tag: 'Franchise', logoText: 'NCR Aloha' },
  { id: 'deliverect', name: 'Deliverect Aggregator Bridge', region: 'Global Delivery & In-House', tag: 'Bridge', logoText: 'Deliverect' },
  { id: 'esc_pos_direct', name: 'Direct Hardware ESC/POS LAN Printer', region: 'Network Port 9100 / Raw Socket', tag: 'Zero Software', logoText: 'LAN ESC/POS' },
  { id: 'universal_api', name: 'Universal Webhook & Cloud REST API', region: 'Custom POS & In-House IT', tag: 'Developer', logoText: 'Custom API' },
  { id: 'tri_sync_multi', name: 'Triple Redundant Bridge (All 3 Channels)', region: 'Cloud + Wi-Fi LAN + Direct ESC/POS', tag: 'Zero Downtime', logoText: 'Triple Sync' }
] as const;

export interface ChefOwnerAiPersona {
  chef_name: string;
  chef_title: string;
  chef_bio: string;
  chef_philosophy: string;
  owner_name: string;
  owner_hospitality_note: string;
  greeting_tone: 'warm_traditional' | 'modern_chic' | 'fine_dining_artisan' | 'bistro_cozy';
  signature_pairings: Array<{ dish_name: string; pairing_drink: string; why: string }>;
  secret_stories: Array<{ dish_name: string; story: string }>;
  spice_guidance: string;
  dietary_rules: string;
  custom_faqs?: Array<{ question: string; answer: string }>;
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

export const isWorkingWithMenuz = (r?: { id?: string; slug?: string; is_menuz_partner?: boolean } | null): boolean => {
  if (!r || !r.id) return false;
  // If explicitly flagged as false (e.g. unpartnered directory placeholder), return false
  if (r.is_menuz_partner === false) return false;
  // All active restaurants in the database/store are valid Menuz working venues
  return true;
};

export interface RestaurantTable {
  id: string;
  restaurant_id: string;
  label: string; // e.g. "Table 1", "VIP Booth 3", "Rooftop Terrace 2"
  public_token: string;
  nfc_tag_id?: string;
  is_active: boolean;
  capacity?: number; // Number of seats (2, 4, 6, 8, 12)
  section?: string; // "Indoor Main", "Outdoor Patio", "Rooftop Terrace", "Bar Lounge", "VIP Dining"
  status?: 'vacant' | 'occupied' | 'reserved' | 'cleaning';
  assigned_server?: string; // Server / Waiter assigned to this station
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
  chef_story?: string;
  owner_pitch?: string;
  pairing_drink_name?: string;
  pairing_reason?: string;
  temperature_style?: string;
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
