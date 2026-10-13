-- ==============================================================================
-- MENUZ PRODUCTION DATABASE SCHEMA (POSTGRESQL / NEON)
-- ==============================================================================

-- 1. RESTAURANTS
CREATE TABLE IF NOT EXISTS restaurants (
  id VARCHAR(128) PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  cuisine VARCHAR(255) DEFAULT 'Multi-Cuisine',
  location TEXT DEFAULT 'Pune, Maharashtra',
  owner_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(64),
  status VARCHAR(32) DEFAULT 'active',
  logo_url TEXT,
  cover_image_url TEXT,
  brand_colors JSONB DEFAULT '{"primary": "#E85D04", "background": "#090D16", "text": "#FFFFFF", "accent": "#C84B00"}'::jsonb,
  currency VARCHAR(16) DEFAULT 'INR',
  tax_rate_percent NUMERIC(5, 2) DEFAULT 5.0,
  google_place_url TEXT,
  ordering_enabled BOOLEAN DEFAULT TRUE,
  is_menuz_partner BOOLEAN DEFAULT TRUE,
  ai_persona JSONB,
  white_label JSONB,
  reward_settings JSONB,
  review_rewards_config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RESTAURANT TABLES
CREATE TABLE IF NOT EXISTS restaurant_tables (
  id VARCHAR(128) PRIMARY KEY,
  restaurant_id VARCHAR(128) NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  label VARCHAR(128) NOT NULL,
  section VARCHAR(128) DEFAULT 'Main',
  capacity INTEGER DEFAULT 4,
  public_token VARCHAR(128) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  status VARCHAR(32) DEFAULT 'vacant',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MENU CATEGORIES
CREATE TABLE IF NOT EXISTS menu_categories (
  id VARCHAR(128) PRIMARY KEY,
  restaurant_id VARCHAR(128) NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category_type VARCHAR(64) DEFAULT 'food',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MENU ITEMS
CREATE TABLE IF NOT EXISTS menu_items (
  id VARCHAR(128) PRIMARY KEY,
  restaurant_id VARCHAR(128) NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id VARCHAR(128) REFERENCES menu_categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  item_type VARCHAR(32) DEFAULT 'food',
  price NUMERIC(10, 2) NOT NULL,
  short_description TEXT,
  full_description TEXT,
  ingredients JSONB DEFAULT '[]'::jsonb,
  allergens JSONB DEFAULT '[]'::jsonb,
  dietary_flags JSONB DEFAULT '[]'::jsonb,
  spice_level INTEGER DEFAULT 0,
  sweet_level INTEGER DEFAULT 0,
  serving_size VARCHAR(128),
  image_url TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  is_available BOOLEAN DEFAULT TRUE,
  is_signature BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_seasonal BOOLEAN DEFAULT FALSE,
  is_chef_recommended BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  pairing_item_ids JSONB DEFAULT '[]'::jsonb,
  chef_notes TEXT,
  chef_story TEXT,
  owner_pitch TEXT,
  sort_order INTEGER DEFAULT 0,
  option_groups JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(128) PRIMARY KEY,
  restaurant_id VARCHAR(128) NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_id VARCHAR(128) REFERENCES restaurant_tables(id) ON DELETE SET NULL,
  anonymous_session_id VARCHAR(128),
  order_number VARCHAR(64) NOT NULL,
  source VARCHAR(32) DEFAULT 'menuz',
  status VARCHAR(32) DEFAULT 'received',
  currency VARCHAR(16) DEFAULT 'INR',
  subtotal_amount NUMERIC(10, 2) DEFAULT 0,
  tax_amount NUMERIC(10, 2) DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL,
  customer_notes TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CUSTOMER REVIEWS
CREATE TABLE IF NOT EXISTS customer_reviews (
  id VARCHAR(128) PRIMARY KEY,
  restaurant_id VARCHAR(128) NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(64),
  customer_email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  selected_keywords JSONB DEFAULT '[]'::jsonb,
  review_text TEXT,
  whatsapp_opt_in BOOLEAN DEFAULT FALSE,
  google_review_clicked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. REVIEW CHALLENGES
CREATE TABLE IF NOT EXISTS review_challenges (
  id VARCHAR(128) PRIMARY KEY,
  restaurant_id VARCHAR(128) NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  reward_type VARCHAR(64) DEFAULT 'discount',
  reward_item_name VARCHAR(255) NOT NULL,
  win_probability_percent INTEGER DEFAULT 50,
  is_active BOOLEAN DEFAULT TRUE,
  terms TEXT,
  redemption_code_prefix VARCHAR(32) DEFAULT 'CHAL',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CHALLENGE REDEMPTIONS
CREATE TABLE IF NOT EXISTS challenge_redemptions (
  id VARCHAR(128) PRIMARY KEY,
  restaurant_id VARCHAR(128) NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  challenge_id VARCHAR(128) REFERENCES review_challenges(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  voucher_code VARCHAR(64) UNIQUE NOT NULL,
  reward_item_name VARCHAR(255) NOT NULL,
  status VARCHAR(32) DEFAULT 'unclaimed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ
);

-- 9. USER SESSIONS
CREATE TABLE IF NOT EXISTS user_sessions (
  token VARCHAR(128) PRIMARY KEY,
  user_id VARCHAR(128) NOT NULL,
  role VARCHAR(64) NOT NULL,
  restaurant_id VARCHAR(128) REFERENCES restaurants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- 10. SYSTEM STATE METADATA
CREATE TABLE IF NOT EXISTS system_state_metadata (
  key VARCHAR(64) PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR HIGH-PERFORMANCE QUERYING
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_tables_restaurant ON restaurant_tables(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_tables_token ON restaurant_tables(public_token);
CREATE INDEX IF NOT EXISTS idx_categories_restaurant ON menu_categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_table ON orders(table_id);
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant ON customer_reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_challenges_restaurant ON review_challenges(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_code ON challenge_redemptions(voucher_code);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);
