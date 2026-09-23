-- 01_schema.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Restaurants
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    cuisine TEXT NOT NULL,
    logo_url TEXT,
    brand_colors JSONB NOT NULL DEFAULT '{"primary": "#E85D04", "background": "#FDFBF7", "text": "#1C1917"}'::jsonb,
    currency TEXT NOT NULL DEFAULT 'INR',
    tax_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Restaurant Members
DO $$ BEGIN
    CREATE TYPE member_role AS ENUM ('owner', 'manager', 'staff');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS restaurant_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role member_role NOT NULL DEFAULT 'staff',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(restaurant_id, user_id)
);

-- 3. Restaurant Tables
CREATE TABLE IF NOT EXISTS restaurant_tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    public_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Menu Categories
CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    ingredients TEXT[] NOT NULL DEFAULT '{}',
    allergens TEXT[] NOT NULL DEFAULT '{}',
    dietary_flags TEXT[] NOT NULL DEFAULT '{}',
    spice_level INT NOT NULL DEFAULT 0 CHECK (spice_level BETWEEN 0 AND 5),
    serving_size TEXT,
    image_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    pairing_item_ids UUID[] NOT NULL DEFAULT '{}',
    chef_notes TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Option Groups
CREATE TABLE IF NOT EXISTS menu_item_option_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    min_selections INT NOT NULL DEFAULT 0,
    max_selections INT NOT NULL DEFAULT 1,
    is_required BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0
);

-- 7. Options
CREATE TABLE IF NOT EXISTS menu_item_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    option_group_id UUID NOT NULL REFERENCES menu_item_option_groups(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_modifier NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0
);

-- 8. Orders
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('received', 'preparing', 'ready', 'served', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    table_id UUID NOT NULL REFERENCES restaurant_tables(id) ON DELETE RESTRICT,
    anonymous_session_id TEXT NOT NULL,
    order_number TEXT NOT NULL,
    status order_status NOT NULL DEFAULT 'received',
    currency TEXT NOT NULL DEFAULT 'INR',
    subtotal_amount NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    customer_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Order Items (Snapshots)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,
    item_name_snapshot TEXT NOT NULL,
    unit_price_snapshot NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    selected_options_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
    line_total_amount NUMERIC(10, 2) NOT NULL
);

-- Enable RLS
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_option_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Helper security function
CREATE OR REPLACE FUNCTION get_user_restaurant_ids()
RETURNS SETOF UUID AS $$
    SELECT restaurant_id FROM restaurant_members WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Public Menu Policies (Read-Only)
CREATE POLICY "Public read restaurants" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Public read active categories" ON menu_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read menu items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read option groups" ON menu_item_option_groups FOR SELECT USING (true);
CREATE POLICY "Public read options" ON menu_item_options FOR SELECT USING (true);
CREATE POLICY "Public read active tables by token" ON restaurant_tables FOR SELECT USING (is_active = true);
