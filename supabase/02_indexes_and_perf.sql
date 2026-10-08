-- 02_indexes_and_perf.sql
-- Performance Indexes to prevent Full Table Scans (O(1)/O(log N) lookups)

-- 1. Orders lookup & sorting (by restaurant and recency)
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_created ON orders (restaurant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_table_id ON orders (table_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);

-- 2. Order items batch lookup (prevents N+1 query table scans)
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item ON order_items (menu_item_id);

-- 3. Menu categories and items lookup & sorting
CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant ON menu_categories (restaurant_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_cat ON menu_items (restaurant_id, category_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items (is_available);

-- 4. Option groups & options batch relations
CREATE INDEX IF NOT EXISTS idx_option_groups_item ON menu_item_option_groups (menu_item_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_options_group ON menu_item_options (option_group_id, sort_order);

-- 5. Restaurant members & tables authentication tokens
CREATE INDEX IF NOT EXISTS idx_restaurant_members_user ON restaurant_members (user_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_tables_token ON restaurant_tables (public_token);
