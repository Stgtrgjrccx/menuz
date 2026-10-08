import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = process.env.DATA_PATH || 
  (fs.existsSync('/data') ? '/data/menuz_data.sqlite' : path.join(__dirname, 'menuz_data.sqlite'));

let db;

export function initDatabase() {
  if (db) return db;

  db = new DatabaseSync(DB_FILE);

  // Performance & ACID persistence optimizations
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS restaurants (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      cuisine TEXT,
      location TEXT,
      owner_name TEXT,
      contact_email TEXT,
      contact_phone TEXT,
      status TEXT DEFAULT 'active',
      logo_url TEXT,
      brand_colors TEXT,
      currency TEXT DEFAULT 'INR',
      tax_rate_percent REAL DEFAULT 5.0,
      google_place_url TEXT,
      ordering_enabled INTEGER DEFAULT 1,
      is_menuz_partner INTEGER DEFAULT 1,
      ai_persona TEXT,
      created_at INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS restaurant_tables (
      id TEXT PRIMARY KEY,
      restaurant_id TEXT NOT NULL,
      label TEXT NOT NULL,
      section TEXT,
      capacity INTEGER DEFAULT 4,
      public_token TEXT UNIQUE NOT NULL,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS menu_categories (
      id TEXT PRIMARY KEY,
      restaurant_id TEXT NOT NULL,
      name TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id TEXT PRIMARY KEY,
      restaurant_id TEXT NOT NULL,
      category_id TEXT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      short_description TEXT,
      full_description TEXT,
      dietary_flags TEXT,
      spice_level INTEGER DEFAULT 0,
      image_url TEXT,
      is_available INTEGER DEFAULT 1,
      created_at INTEGER,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      restaurant_id TEXT NOT NULL,
      table_id TEXT,
      anonymous_session_id TEXT,
      order_number TEXT NOT NULL,
      status TEXT DEFAULT 'received',
      total_amount REAL NOT NULL,
      customer_notes TEXT,
      items_json TEXT,
      created_at INTEGER,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT,
      role TEXT NOT NULL,
      restaurant_id TEXT,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug);
    CREATE INDEX IF NOT EXISTS idx_tables_rest ON restaurant_tables(restaurant_id);
    CREATE INDEX IF NOT EXISTS idx_tables_token ON restaurant_tables(public_token);
    CREATE INDEX IF NOT EXISTS idx_categories_rest ON menu_categories(restaurant_id);
    CREATE INDEX IF NOT EXISTS idx_items_rest ON menu_items(restaurant_id);
    CREATE INDEX IF NOT EXISTS idx_orders_rest ON orders(restaurant_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token);
  `);

  // Seed default core venues if table is completely empty
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM restaurants');
  const countResult = countStmt.get();

  if (countResult.count === 0) {
    seedDefaultVenues();
  }

  return db;
}

function seedDefaultVenues() {
  console.log('Seeding initial persistent database venues (Saffron House & Casa Bella Trattoria)...');
  const now = Date.now();

  const insertRest = db.prepare(`
    INSERT INTO restaurants (
      id, slug, name, cuisine, location, owner_name, contact_email, contact_phone,
      status, logo_url, brand_colors, currency, tax_rate_percent, google_place_url,
      ordering_enabled, is_menuz_partner, ai_persona, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?
    )
  `);

  insertRest.run(
    'rest-saffron-house-01',
    'saffron-house',
    'Saffron House',
    'Contemporary Indian Dining',
    'Koregaon Park, Pune',
    'Vikramaditya Singhania',
    'management@saffronhouse.in',
    '+91 20 2615 0001',
    'active',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop',
    JSON.stringify({ primary: '#E85D04', background: '#FDFBF7', text: '#1C1917', accent: '#C84B00' }),
    'INR',
    5.0,
    'https://search.google.com/local/writereview?placeid=ChIJSaffronHouseKoregaonParkPune',
    1,
    1,
    JSON.stringify({
      chef_name: 'Chef Sanjay Rawat',
      chef_title: 'Executive Head Chef',
      greeting_tone: 'warm_traditional'
    }),
    now,
    now
  );

  insertRest.run(
    'rest-casa-bella-02',
    'casa-bella-trattoria',
    'Casa Bella Trattoria',
    'Artisanal Italian & Woodfired Pizzeria',
    'Kalyani Nagar, Pune',
    'Matteo Bellini & Aarti Kulkarni',
    'ciao@casabellatrattoria.com',
    '+91 20 2665 4422',
    'active',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop',
    JSON.stringify({ primary: '#059669', background: '#F8FAF5', text: '#1E293B', accent: '#D97706' }),
    'INR',
    5.0,
    'https://search.google.com/local/writereview?placeid=ChIJCasaBellaTrattoriaKalyaniNagarPune',
    1,
    1,
    JSON.stringify({
      chef_name: 'Chef Matteo Bellini',
      chef_title: 'Pizzaiolo & Master Chef',
      greeting_tone: 'passionate_warm'
    }),
    now,
    now
  );

  // Seed default tables
  const insertTable = db.prepare(`
    INSERT INTO restaurant_tables (id, restaurant_id, label, section, capacity, public_token, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertTable.run('tbl-01', 'rest-saffron-house-01', 'Table 1', 'Indoor Main Dining', 4, 'table-token-01-saffron', 1);
  insertTable.run('tbl-02', 'rest-saffron-house-01', 'Table 2', 'Indoor Main Dining', 4, 'table-token-02-saffron', 1);
  insertTable.run('tbl-cb-01', 'rest-casa-bella-02', 'Piazza 1', 'Piazza Main Hall', 2, 'table-token-01-casabella', 1);
}

// ── Restaurant Queries ────────────────────────────────────────────────────────

export function getAllRestaurants() {
  initDatabase();
  const stmt = db.prepare('SELECT * FROM restaurants ORDER BY name ASC');
  const rows = stmt.all();
  return rows.map(r => ({
    ...r,
    brand_colors: r.brand_colors ? JSON.parse(r.brand_colors) : null,
    ai_persona: r.ai_persona ? JSON.parse(r.ai_persona) : null,
    ordering_enabled: Boolean(r.ordering_enabled),
    is_menuz_partner: Boolean(r.is_menuz_partner)
  }));
}

export function getRestaurantBySlug(slug) {
  initDatabase();
  const stmt = db.prepare('SELECT * FROM restaurants WHERE slug = ?');
  const r = stmt.get(slug);
  if (!r) return null;
  return {
    ...r,
    brand_colors: r.brand_colors ? JSON.parse(r.brand_colors) : null,
    ai_persona: r.ai_persona ? JSON.parse(r.ai_persona) : null,
    ordering_enabled: Boolean(r.ordering_enabled),
    is_menuz_partner: Boolean(r.is_menuz_partner)
  };
}

export function getRestaurantById(id) {
  initDatabase();
  const stmt = db.prepare('SELECT * FROM restaurants WHERE id = ?');
  const r = stmt.get(id);
  if (!r) return null;
  return {
    ...r,
    brand_colors: r.brand_colors ? JSON.parse(r.brand_colors) : null,
    ai_persona: r.ai_persona ? JSON.parse(r.ai_persona) : null,
    ordering_enabled: Boolean(r.ordering_enabled),
    is_menuz_partner: Boolean(r.is_menuz_partner)
  };
}

export function upsertRestaurant(r) {
  initDatabase();
  if (!r || !r.id || !r.name) {
    throw new Error('Valid restaurant id and name are required');
  }

  const now = Date.now();
  const slug = r.slug || r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const stmt = db.prepare(`
    INSERT INTO restaurants (
      id, slug, name, cuisine, location, owner_name, contact_email, contact_phone,
      status, logo_url, brand_colors, currency, tax_rate_percent, google_place_url,
      ordering_enabled, is_menuz_partner, ai_persona, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?
    )
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      name = excluded.name,
      cuisine = COALESCE(excluded.cuisine, restaurants.cuisine),
      location = COALESCE(excluded.location, restaurants.location),
      owner_name = COALESCE(excluded.owner_name, restaurants.owner_name),
      contact_email = COALESCE(excluded.contact_email, restaurants.contact_email),
      contact_phone = COALESCE(excluded.contact_phone, restaurants.contact_phone),
      status = COALESCE(excluded.status, restaurants.status),
      logo_url = COALESCE(excluded.logo_url, restaurants.logo_url),
      brand_colors = COALESCE(excluded.brand_colors, restaurants.brand_colors),
      currency = COALESCE(excluded.currency, restaurants.currency),
      tax_rate_percent = COALESCE(excluded.tax_rate_percent, restaurants.tax_rate_percent),
      google_place_url = COALESCE(excluded.google_place_url, restaurants.google_place_url),
      ordering_enabled = COALESCE(excluded.ordering_enabled, restaurants.ordering_enabled),
      is_menuz_partner = COALESCE(excluded.is_menuz_partner, restaurants.is_menuz_partner),
      ai_persona = COALESCE(excluded.ai_persona, restaurants.ai_persona),
      updated_at = excluded.updated_at
  `);

  stmt.run(
    r.id,
    slug,
    r.name,
    r.cuisine || 'Multi-Cuisine',
    r.location || 'Pune, Maharashtra',
    r.owner_name || '',
    r.contact_email || '',
    r.contact_phone || '',
    r.status || 'active',
    r.logo_url || '',
    typeof r.brand_colors === 'object' ? JSON.stringify(r.brand_colors) : (r.brand_colors || null),
    r.currency || 'INR',
    r.tax_rate_percent ?? 5.0,
    r.google_place_url || '',
    r.ordering_enabled !== false ? 1 : 0,
    r.is_menuz_partner !== false ? 1 : 0,
    typeof r.ai_persona === 'object' ? JSON.stringify(r.ai_persona) : (r.ai_persona || null),
    r.created_at || now,
    now
  );

  return getRestaurantById(r.id);
}

export function deleteRestaurant(id) {
  initDatabase();
  const stmt = db.prepare('DELETE FROM restaurants WHERE id = ?');
  return stmt.run(id);
}

// ── Tables, Categories, Menu Items ──────────────────────────────────────────

export function getTables(restaurantId) {
  initDatabase();
  const stmt = restaurantId
    ? db.prepare('SELECT * FROM restaurant_tables WHERE restaurant_id = ?')
    : db.prepare('SELECT * FROM restaurant_tables');
  return restaurantId ? stmt.all(restaurantId) : stmt.all();
}

export function upsertTable(t) {
  initDatabase();
  const stmt = db.prepare(`
    INSERT INTO restaurant_tables (id, restaurant_id, label, section, capacity, public_token, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      label = excluded.label,
      section = excluded.section,
      capacity = excluded.capacity,
      public_token = excluded.public_token,
      is_active = excluded.is_active
  `);
  stmt.run(
    t.id,
    t.restaurant_id,
    t.label,
    t.section || 'Main',
    t.capacity || 4,
    t.public_token || `token-${t.id}`,
    t.is_active !== false ? 1 : 0
  );
}

export function getCategories(restaurantId) {
  initDatabase();
  const stmt = restaurantId
    ? db.prepare('SELECT * FROM menu_categories WHERE restaurant_id = ? ORDER BY sort_order ASC')
    : db.prepare('SELECT * FROM menu_categories ORDER BY sort_order ASC');
  return restaurantId ? stmt.all(restaurantId) : stmt.all();
}

export function getMenuItems(restaurantId) {
  initDatabase();
  const stmt = restaurantId
    ? db.prepare('SELECT * FROM menu_items WHERE restaurant_id = ?')
    : db.prepare('SELECT * FROM menu_items');
  const rows = restaurantId ? stmt.all(restaurantId) : stmt.all();
  return rows.map(item => ({
    ...item,
    dietary_flags: item.dietary_flags ? JSON.parse(item.dietary_flags) : [],
    is_available: Boolean(item.is_available)
  }));
}

// ── Role-Based Sessions ───────────────────────────────────────────────────────

export function createSession(role, restaurantId = null, userId = null) {
  initDatabase();
  const token = 'menuz_sec_' + crypto.randomBytes(24).toString('hex');
  const now = Date.now();
  const expiresAt = now + 12 * 60 * 60 * 1000; // 12 hours validity

  const stmt = db.prepare(`
    INSERT INTO user_sessions (token, user_id, role, restaurant_id, created_at, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(token, userId || `user-${role}`, role, restaurantId, now, expiresAt);

  return { token, role, restaurantId, expiresAt };
}

export function getSession(token) {
  if (!token) return null;
  initDatabase();
  const stmt = db.prepare('SELECT * FROM user_sessions WHERE token = ?');
  const session = stmt.get(token);
  if (!session) return null;

  if (Date.now() > session.expires_at) {
    // Expired
    deleteSession(token);
    return null;
  }
  return session;
}

export function deleteSession(token) {
  if (!token) return;
  initDatabase();
  const stmt = db.prepare('DELETE FROM user_sessions WHERE token = ?');
  stmt.run(token);
}

// ── State Synchronization (Additively Merged, No Destruction) ─────────────────

export function getFullSyncState() {
  initDatabase();
  return {
    restaurants: getAllRestaurants(),
    tables: getTables(),
    categories: getCategories(),
    menuItems: getMenuItems(),
    timestamp: Date.now()
  };
}

export function mergeIncomingSyncState(incoming) {
  initDatabase();
  if (!incoming) return getFullSyncState();

  // Safeguard: Never allow an empty or truncated list to wipe out existing persistent restaurants!
  if (Array.isArray(incoming.restaurants) && incoming.restaurants.length > 0) {
    for (const r of incoming.restaurants) {
      if (r && r.id && r.name) {
        try {
          upsertRestaurant(r);
        } catch (e) {
          console.warn('Error upserting restaurant during sync:', e.message);
        }
      }
    }
  }

  if (Array.isArray(incoming.tables) && incoming.tables.length > 0) {
    for (const t of incoming.tables) {
      if (t && t.id && t.restaurant_id) {
        try {
          upsertTable(t);
        } catch (e) {}
      }
    }
  }

  return getFullSyncState();
}
