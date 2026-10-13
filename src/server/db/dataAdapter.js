import crypto from 'crypto';
import * as pgClient from './postgresClient.js';
import * as sqliteDb from '../../../database.js';

let activeEngine = 'detecting'; // 'postgres' | 'sqlite'
let postgresReady = false;

/**
 * Determine and initialize active database engine
 */
export async function initDatabaseEngine() {
  const dbUrl = pgClient.getDatabaseUrl();

  if (dbUrl) {
    try {
      const connTest = await pgClient.testConnection();
      if (connTest.connected) {
        await pgClient.initPostgresSchema();
        activeEngine = 'postgres';
        postgresReady = true;
        console.log(`[Database] Active datastore: PostgreSQL / Neon (${pgClient.sanitizeConnectionString(dbUrl)}), Latency: ${connTest.latencyMs}ms`);

        // Auto-populate from verified backups if database has no restaurants yet
        try {
          const checkRows = await pgClient.query('SELECT COUNT(*) as count FROM restaurants');
          const rowCount = Number(checkRows.rows[0]?.count || 0);
          if (rowCount === 0) {
            console.log('[Database] PostgreSQL database is empty. Running initial idempotent migration from verified backups...');
            const { runMigration } = await import('../../../scripts/migrate-to-postgres.js');
            await runMigration();
            console.log('[Database] Initial migration completed successfully.');
          } else {
            console.log(`[Database] PostgreSQL ready with ${rowCount} existing restaurants.`);
          }
        } catch (migErr) {
          console.warn(`[Database] Initial auto-migration notice: ${migErr.message}`);
        }

        return 'postgres';
      } else {
        console.warn(`[Database] PostgreSQL connection failed: ${connTest.error}. Falling back to SQLite.`);
      }
    } catch (err) {
      console.warn(`[Database] PostgreSQL init failed: ${err.message}. Falling back to SQLite.`);
    }
  }

  // Fallback to embedded SQLite
  sqliteDb.initDatabase();
  activeEngine = 'sqlite';
  console.log('[Database] Active datastore: Embedded SQLite (WAL mode).');
  return 'sqlite';
}

export function getActiveEngine() {
  return activeEngine;
}

// ─────────────────────────────────────────────────────────────────────────────
// RESTAURANTS
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllRestaurants() {
  if (activeEngine === 'postgres') {
    const res = await pgClient.query('SELECT * FROM restaurants ORDER BY name ASC');
    return res.rows.map(normalizeRestaurantFromPg);
  }
  return sqliteDb.getAllRestaurants();
}

export async function getRestaurantById(id) {
  if (!id) return null;
  if (activeEngine === 'postgres') {
    const res = await pgClient.query('SELECT * FROM restaurants WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return normalizeRestaurantFromPg(res.rows[0]);
  }
  return sqliteDb.getRestaurantById(id);
}

export async function getRestaurantBySlug(slug) {
  if (!slug) return null;
  if (activeEngine === 'postgres') {
    const res = await pgClient.query('SELECT * FROM restaurants WHERE slug = $1', [slug]);
    if (res.rows.length === 0) return null;
    return normalizeRestaurantFromPg(res.rows[0]);
  }
  return sqliteDb.getRestaurantBySlug(slug);
}

export async function upsertRestaurant(r) {
  if (!r || !r.id || !r.name) {
    throw new Error('Valid restaurant id and name are required');
  }

  if (activeEngine === 'postgres') {
    const slug = r.slug || r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const now = new Date();

    const text = `
      INSERT INTO restaurants (
        id, slug, name, cuisine, location, owner_name, contact_email, contact_phone,
        status, logo_url, cover_image_url, brand_colors, currency, tax_rate_percent,
        google_place_url, ordering_enabled, is_menuz_partner, ai_persona, white_label,
        reward_settings, review_rewards_config, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19,
        $20, $21, $22
      )
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        name = EXCLUDED.name,
        cuisine = COALESCE(EXCLUDED.cuisine, restaurants.cuisine),
        location = COALESCE(EXCLUDED.location, restaurants.location),
        owner_name = COALESCE(EXCLUDED.owner_name, restaurants.owner_name),
        contact_email = COALESCE(EXCLUDED.contact_email, restaurants.contact_email),
        contact_phone = COALESCE(EXCLUDED.contact_phone, restaurants.contact_phone),
        status = COALESCE(EXCLUDED.status, restaurants.status),
        logo_url = COALESCE(EXCLUDED.logo_url, restaurants.logo_url),
        cover_image_url = COALESCE(EXCLUDED.cover_image_url, restaurants.cover_image_url),
        brand_colors = COALESCE(EXCLUDED.brand_colors, restaurants.brand_colors),
        currency = COALESCE(EXCLUDED.currency, restaurants.currency),
        tax_rate_percent = COALESCE(EXCLUDED.tax_rate_percent, restaurants.tax_rate_percent),
        google_place_url = COALESCE(EXCLUDED.google_place_url, restaurants.google_place_url),
        ordering_enabled = COALESCE(EXCLUDED.ordering_enabled, restaurants.ordering_enabled),
        is_menuz_partner = COALESCE(EXCLUDED.is_menuz_partner, restaurants.is_menuz_partner),
        ai_persona = COALESCE(EXCLUDED.ai_persona, restaurants.ai_persona),
        white_label = COALESCE(EXCLUDED.white_label, restaurants.white_label),
        reward_settings = COALESCE(EXCLUDED.reward_settings, restaurants.reward_settings),
        review_rewards_config = COALESCE(EXCLUDED.review_rewards_config, restaurants.review_rewards_config),
        updated_at = EXCLUDED.updated_at
      RETURNING *;
    `;

    const values = [
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
      r.cover_image_url || '',
      JSON.stringify(r.brand_colors || { primary: '#E85D04', background: '#090D16', text: '#FFFFFF' }),
      r.currency || 'INR',
      r.tax_rate_percent ?? 5.0,
      r.google_place_url || '',
      r.ordering_enabled !== false,
      r.is_menuz_partner !== false,
      r.ai_persona ? JSON.stringify(r.ai_persona) : null,
      r.white_label ? JSON.stringify(r.white_label) : null,
      r.reward_settings ? JSON.stringify(r.reward_settings) : null,
      r.review_rewards_config ? JSON.stringify(r.review_rewards_config) : null,
      now
    ];

    const res = await pgClient.query(text, values);
    return normalizeRestaurantFromPg(res.rows[0]);
  }

  return sqliteDb.upsertRestaurant(r);
}

export async function deleteRestaurant(id) {
  if (!id) return;
  if (activeEngine === 'postgres') {
    return pgClient.query('DELETE FROM restaurants WHERE id = $1', [id]);
  }
  return sqliteDb.deleteRestaurant(id);
}

function normalizeRestaurantFromPg(row) {
  if (!row) return null;
  return {
    ...row,
    brand_colors: typeof row.brand_colors === 'string' ? JSON.parse(row.brand_colors) : (row.brand_colors || null),
    ai_persona: typeof row.ai_persona === 'string' ? JSON.parse(row.ai_persona) : (row.ai_persona || null),
    white_label: typeof row.white_label === 'string' ? JSON.parse(row.white_label) : (row.white_label || null),
    reward_settings: typeof row.reward_settings === 'string' ? JSON.parse(row.reward_settings) : (row.reward_settings || null),
    review_rewards_config: typeof row.review_rewards_config === 'string' ? JSON.parse(row.review_rewards_config) : (row.review_rewards_config || null),
    ordering_enabled: Boolean(row.ordering_enabled),
    is_menuz_partner: Boolean(row.is_menuz_partner)
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLES
// ─────────────────────────────────────────────────────────────────────────────

export async function getTables(restaurantId) {
  if (activeEngine === 'postgres') {
    const text = restaurantId
      ? 'SELECT * FROM restaurant_tables WHERE restaurant_id = $1 ORDER BY label ASC'
      : 'SELECT * FROM restaurant_tables ORDER BY label ASC';
    const params = restaurantId ? [restaurantId] : [];
    const res = await pgClient.query(text, params);
    return res.rows.map(t => ({
      ...t,
      is_active: Boolean(t.is_active)
    }));
  }
  return sqliteDb.getTables(restaurantId);
}

export async function upsertTable(t) {
  if (!t || !t.id || !t.restaurant_id) {
    throw new Error('Table id and restaurant_id are required');
  }

  if (activeEngine === 'postgres') {
    const text = `
      INSERT INTO restaurant_tables (id, restaurant_id, label, section, capacity, public_token, is_active, status, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT (id) DO UPDATE SET
        label = EXCLUDED.label,
        section = EXCLUDED.section,
        capacity = EXCLUDED.capacity,
        public_token = EXCLUDED.public_token,
        is_active = EXCLUDED.is_active,
        status = EXCLUDED.status,
        updated_at = NOW()
      RETURNING *;
    `;
    const res = await pgClient.query(text, [
      t.id,
      t.restaurant_id,
      t.label,
      t.section || 'Main',
      t.capacity || 4,
      t.public_token || `token-${t.id}`,
      t.is_active !== false,
      t.status || 'vacant'
    ]);
    return res.rows[0];
  }

  return sqliteDb.upsertTable(t);
}

// ─────────────────────────────────────────────────────────────────────────────
// MENU CATEGORIES & ITEMS
// ─────────────────────────────────────────────────────────────────────────────

export async function getCategories(restaurantId) {
  if (activeEngine === 'postgres') {
    const text = restaurantId
      ? 'SELECT * FROM menu_categories WHERE restaurant_id = $1 ORDER BY sort_order ASC'
      : 'SELECT * FROM menu_categories ORDER BY sort_order ASC';
    const params = restaurantId ? [restaurantId] : [];
    const res = await pgClient.query(text, params);
    return res.rows.map(c => ({
      ...c,
      is_active: Boolean(c.is_active)
    }));
  }
  return sqliteDb.getCategories(restaurantId);
}

export async function upsertCategory(c) {
  if (!c || !c.id || !c.restaurant_id) {
    throw new Error('Category id and restaurant_id are required');
  }

  if (activeEngine === 'postgres') {
    const text = `
      INSERT INTO menu_categories (id, restaurant_id, name, category_type, sort_order, is_active, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category_type = EXCLUDED.category_type,
        sort_order = EXCLUDED.sort_order,
        is_active = EXCLUDED.is_active,
        updated_at = NOW()
      RETURNING *;
    `;
    const res = await pgClient.query(text, [
      c.id,
      c.restaurant_id,
      c.name,
      c.category_type || 'food',
      c.sort_order || 0,
      c.is_active !== false
    ]);
    return res.rows[0];
  }

  // SQLite fallback
  const db = sqliteDb.initDatabase();
  const stmt = db.prepare(`
    INSERT INTO menu_categories (id, restaurant_id, name, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      sort_order = excluded.sort_order,
      is_active = excluded.is_active
  `);
  stmt.run(c.id, c.restaurant_id, c.name, c.sort_order || 0, c.is_active !== false ? 1 : 0);
  return c;
}

export async function getMenuItems(restaurantId) {
  if (activeEngine === 'postgres') {
    const text = restaurantId
      ? 'SELECT * FROM menu_items WHERE restaurant_id = $1 ORDER BY sort_order ASC, name ASC'
      : 'SELECT * FROM menu_items ORDER BY sort_order ASC, name ASC';
    const params = restaurantId ? [restaurantId] : [];
    const res = await pgClient.query(text, params);
    return res.rows.map(normalizeMenuItemFromPg);
  }
  return sqliteDb.getMenuItems(restaurantId);
}

export async function upsertMenuItem(item) {
  if (!item || !item.id || !item.restaurant_id) {
    throw new Error('Menu item id and restaurant_id are required');
  }

  if (activeEngine === 'postgres') {
    const text = `
      INSERT INTO menu_items (
        id, restaurant_id, category_id, name, item_type, price,
        short_description, full_description, ingredients, allergens,
        dietary_flags, spice_level, sweet_level, serving_size,
        image_url, gallery_images, is_available, is_signature,
        is_bestseller, is_seasonal, is_chef_recommended, is_new,
        pairing_item_ids, chef_notes, chef_story, owner_pitch,
        sort_order, option_groups, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14,
        $15, $16, $17, $18,
        $19, $20, $21, $22,
        $23, $24, $25, $26,
        $27, $28, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        category_id = EXCLUDED.category_id,
        name = EXCLUDED.name,
        item_type = EXCLUDED.item_type,
        price = EXCLUDED.price,
        short_description = EXCLUDED.short_description,
        full_description = EXCLUDED.full_description,
        ingredients = EXCLUDED.ingredients,
        allergens = EXCLUDED.allergens,
        dietary_flags = EXCLUDED.dietary_flags,
        spice_level = EXCLUDED.spice_level,
        sweet_level = EXCLUDED.sweet_level,
        serving_size = EXCLUDED.serving_size,
        image_url = EXCLUDED.image_url,
        gallery_images = EXCLUDED.gallery_images,
        is_available = EXCLUDED.is_available,
        is_signature = EXCLUDED.is_signature,
        is_bestseller = EXCLUDED.is_bestseller,
        is_seasonal = EXCLUDED.is_seasonal,
        is_chef_recommended = EXCLUDED.is_chef_recommended,
        is_new = EXCLUDED.is_new,
        pairing_item_ids = EXCLUDED.pairing_item_ids,
        chef_notes = EXCLUDED.chef_notes,
        chef_story = EXCLUDED.chef_story,
        owner_pitch = EXCLUDED.owner_pitch,
        sort_order = EXCLUDED.sort_order,
        option_groups = EXCLUDED.option_groups,
        updated_at = NOW()
      RETURNING *;
    `;

    const values = [
      item.id,
      item.restaurant_id,
      item.category_id || null,
      item.name,
      item.item_type || 'food',
      item.price || 0,
      item.short_description || '',
      item.full_description || '',
      JSON.stringify(item.ingredients || []),
      JSON.stringify(item.allergens || []),
      JSON.stringify(item.dietary_flags || []),
      item.spice_level || 0,
      item.sweet_level || 0,
      item.serving_size || '',
      item.image_url || '',
      JSON.stringify(item.gallery_images || []),
      item.is_available !== false,
      Boolean(item.is_signature),
      Boolean(item.is_bestseller),
      Boolean(item.is_seasonal),
      Boolean(item.is_chef_recommended),
      Boolean(item.is_new),
      JSON.stringify(item.pairing_item_ids || []),
      item.chef_notes || '',
      item.chef_story || '',
      item.owner_pitch || '',
      item.sort_order || 0,
      JSON.stringify(item.option_groups || [])
    ];

    const res = await pgClient.query(text, values);
    return normalizeMenuItemFromPg(res.rows[0]);
  }

  // SQLite fallback
  const db = sqliteDb.initDatabase();
  const stmt = db.prepare(`
    INSERT INTO menu_items (
      id, restaurant_id, category_id, name, price, short_description,
      full_description, dietary_flags, spice_level, image_url, is_available, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      category_id = excluded.category_id,
      name = excluded.name,
      price = excluded.price,
      short_description = excluded.short_description,
      full_description = excluded.full_description,
      dietary_flags = excluded.dietary_flags,
      spice_level = excluded.spice_level,
      image_url = excluded.image_url,
      is_available = excluded.is_available
  `);
  stmt.run(
    item.id,
    item.restaurant_id,
    item.category_id || null,
    item.name,
    item.price || 0,
    item.short_description || '',
    item.full_description || '',
    JSON.stringify(item.dietary_flags || []),
    item.spice_level || 0,
    item.image_url || '',
    item.is_available !== false ? 1 : 0,
    Date.now()
  );
  return item;
}

function normalizeMenuItemFromPg(row) {
  if (!row) return null;
  return {
    ...row,
    price: Number(row.price),
    ingredients: typeof row.ingredients === 'string' ? JSON.parse(row.ingredients) : (row.ingredients || []),
    allergens: typeof row.allergens === 'string' ? JSON.parse(row.allergens) : (row.allergens || []),
    dietary_flags: typeof row.dietary_flags === 'string' ? JSON.parse(row.dietary_flags) : (row.dietary_flags || []),
    gallery_images: typeof row.gallery_images === 'string' ? JSON.parse(row.gallery_images) : (row.gallery_images || []),
    pairing_item_ids: typeof row.pairing_item_ids === 'string' ? JSON.parse(row.pairing_item_ids) : (row.pairing_item_ids || []),
    option_groups: typeof row.option_groups === 'string' ? JSON.parse(row.option_groups) : (row.option_groups || []),
    is_available: Boolean(row.is_available),
    is_signature: Boolean(row.is_signature),
    is_bestseller: Boolean(row.is_bestseller),
    is_seasonal: Boolean(row.is_seasonal),
    is_chef_recommended: Boolean(row.is_chef_recommended),
    is_new: Boolean(row.is_new)
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSIONS & AUTH
// ─────────────────────────────────────────────────────────────────────────────

export async function createSession(role, restaurantId = null, userId = null) {
  const token = 'menuz_sec_' + crypto.randomBytes(24).toString('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 12 * 60 * 60 * 1000);

  if (activeEngine === 'postgres') {
    const text = `
      INSERT INTO user_sessions (token, user_id, role, restaurant_id, created_at, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    await pgClient.query(text, [token, userId || `user-${role}`, role, restaurantId, now, expiresAt]);
    return { token, role, restaurantId, expiresAt: expiresAt.getTime() };
  }

  return sqliteDb.createSession(role, restaurantId, userId);
}

export async function getSession(token) {
  if (!token) return null;

  if (activeEngine === 'postgres') {
    const res = await pgClient.query('SELECT * FROM user_sessions WHERE token = $1', [token]);
    if (res.rows.length === 0) return null;
    const session = res.rows[0];

    if (new Date() > new Date(session.expires_at)) {
      await deleteSession(token);
      return null;
    }
    return {
      token: session.token,
      user_id: session.user_id,
      role: session.role,
      restaurant_id: session.restaurant_id,
      created_at: new Date(session.created_at).getTime(),
      expires_at: new Date(session.expires_at).getTime()
    };
  }

  return sqliteDb.getSession(token);
}

export async function deleteSession(token) {
  if (!token) return;
  if (activeEngine === 'postgres') {
    await pgClient.query('DELETE FROM user_sessions WHERE token = $1', [token]);
    return;
  }
  sqliteDb.deleteSession(token);
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE SYNCHRONIZATION (/api/state)
// ─────────────────────────────────────────────────────────────────────────────

export async function getFullSyncState() {
  if (activeEngine === 'postgres') {
    const [restaurants, tables, categories, menuItems] = await Promise.all([
      getAllRestaurants(),
      getTables(),
      getCategories(),
      getMenuItems()
    ]);
    return {
      restaurants,
      tables,
      categories,
      menuItems,
      timestamp: Date.now()
    };
  }

  return sqliteDb.getFullSyncState();
}

export async function mergeIncomingSyncState(incoming) {
  if (!incoming) return getFullSyncState();

  if (Array.isArray(incoming.restaurants) && incoming.restaurants.length > 0) {
    for (const r of incoming.restaurants) {
      if (r && r.id && r.name) {
        try {
          await upsertRestaurant(r);
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
          await upsertTable(t);
        } catch (e) {}
      }
    }
  }

  if (Array.isArray(incoming.categories) && incoming.categories.length > 0) {
    for (const c of incoming.categories) {
      if (c && c.id && c.restaurant_id) {
        try {
          await upsertCategory(c);
        } catch (e) {}
      }
    }
  }

  if (Array.isArray(incoming.menuItems) && incoming.menuItems.length > 0) {
    for (const item of incoming.menuItems) {
      if (item && item.id && item.restaurant_id) {
        try {
          await upsertMenuItem(item);
        } catch (e) {}
      }
    }
  }

  return getFullSyncState();
}

export async function getHealthInfo() {
  if (activeEngine === 'postgres') {
    const conn = await pgClient.testConnection();
    const rests = await getAllRestaurants();
    return {
      status: conn.connected ? 'ok' : 'degraded',
      dbEngine: 'postgres-neon',
      connected: conn.connected,
      latencyMs: conn.latencyMs,
      database: conn.database,
      restaurantsCount: rests.length
    };
  }

  return {
    status: 'ok',
    dbEngine: 'sqlite3-wal',
    connected: true,
    restaurantsCount: sqliteDb.getAllRestaurants().length
  };
}
