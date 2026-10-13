import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as pgClient from '../src/server/db/postgresClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export async function runMigration() {
  console.log('================================================================');
  console.log('MENUZ IDEMPOTENT DATA MIGRATION TO POSTGRESQL / NEON');
  console.log('================================================================');

  const dbUrl = pgClient.getDatabaseUrl();
  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is not set. Please provide the Neon or PostgreSQL connection string.');
  }

  console.log(`Connecting to: ${pgClient.sanitizeConnectionString(dbUrl)}...`);
  const connTest = await pgClient.testConnection();
  if (!connTest.connected) {
    throw new Error(`Connection failed: ${connTest.error}`);
  }
  console.log(`✅ Connected successfully to ${connTest.database} (${connTest.version}) in ${connTest.latencyMs}ms`);

  // Ensure DDL Schema is applied
  console.log('\nStep 1: Applying/Verifying DDL schema...');
  await pgClient.initPostgresSchema();

  const report = {
    discovered: {
      restaurants: 0,
      tables: 0,
      categories: 0,
      menuItems: 0,
      challenges: 0
    },
    migrated: {
      restaurants: 0,
      tables: 0,
      categories: 0,
      menuItems: 0,
      challenges: 0
    },
    updatedOrSkipped: {
      restaurants: 0,
      tables: 0,
      categories: 0,
      menuItems: 0,
      challenges: 0
    },
    failed: []
  };

  // 1. Gather all restaurants
  console.log('\nStep 2: Collecting restaurant records from immutable backups...');
  const restaurantMap = new Map();

  // Load from menuz_state_backup_safe.json
  const safeBackupPath = path.join(rootDir, 'backups', 'menuz_state_backup_safe.json');
  if (fs.existsSync(safeBackupPath)) {
    const data = JSON.parse(fs.readFileSync(safeBackupPath, 'utf8'));
    if (Array.isArray(data.restaurants)) {
      for (const r of data.restaurants) {
        if (r && r.id && r.name) {
          restaurantMap.set(r.id, r);
        }
      }
    }
  }

  // Load from pune_directory_inventory.json
  const dirPath = path.join(rootDir, 'backups', 'pune_directory_inventory.json');
  if (fs.existsSync(dirPath)) {
    const dirData = JSON.parse(fs.readFileSync(dirPath, 'utf8'));
    if (Array.isArray(dirData.restaurants)) {
      for (const r of dirData.restaurants) {
        if (r && r.id && r.name && !restaurantMap.has(r.id)) {
          restaurantMap.set(r.id, r);
        }
      }
    }
  }

  // Load from baseline_seed_inventory.json
  const seedPath = path.join(rootDir, 'backups', 'baseline_seed_inventory.json');
  let seedData = null;
  if (fs.existsSync(seedPath)) {
    const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
    seedData = seed.seedData || null;
    if (seedData && Array.isArray(seedData.restaurants)) {
      for (const r of seedData.restaurants) {
        if (r && r.id && r.name) {
          // Keep existing or enrich
          if (!restaurantMap.has(r.id)) {
            restaurantMap.set(r.id, r);
          }
        }
      }
    }
  }

  report.discovered.restaurants = restaurantMap.size;
  console.log(`Discovered ${report.discovered.restaurants} unique restaurant records.`);

  // 2. Gather tables, categories, menuItems, challenges from baseline seed
  const tablesMap = new Map();
  const categoriesMap = new Map();
  const menuItemsMap = new Map();
  const challengesMap = new Map();

  if (seedData) {
    if (Array.isArray(seedData.tables)) {
      for (const t of seedData.tables) {
        if (t && t.id) tablesMap.set(t.id, t);
      }
    }
    if (Array.isArray(seedData.categories)) {
      for (const c of seedData.categories) {
        if (c && c.id) categoriesMap.set(c.id, c);
      }
    }
    if (Array.isArray(seedData.menuItems)) {
      for (const m of seedData.menuItems) {
        if (m && m.id) menuItemsMap.set(m.id, m);
      }
    }
    if (Array.isArray(seedData.challenges)) {
      for (const ch of seedData.challenges) {
        if (ch && ch.id) challengesMap.set(ch.id, ch);
      }
    }
  }

  // Also check safe state tables
  if (fs.existsSync(safeBackupPath)) {
    const data = JSON.parse(fs.readFileSync(safeBackupPath, 'utf8'));
    if (Array.isArray(data.tables)) {
      for (const t of data.tables) {
        if (t && t.id && !tablesMap.has(t.id)) tablesMap.set(t.id, t);
      }
    }
  }

  report.discovered.tables = tablesMap.size;
  report.discovered.categories = categoriesMap.size;
  report.discovered.menuItems = menuItemsMap.size;
  report.discovered.challenges = challengesMap.size;

  // 3. Insert/Upsert Restaurants into PostgreSQL
  console.log('\nStep 3: Migrating restaurants to PostgreSQL...');
  for (const r of restaurantMap.values()) {
    try {
      const slug = r.slug || r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const queryText = `
        INSERT INTO restaurants (
          id, slug, name, cuisine, location, owner_name, contact_email, contact_phone,
          status, logo_url, cover_image_url, brand_colors, currency, tax_rate_percent,
          google_place_url, ordering_enabled, is_menuz_partner, ai_persona, white_label,
          reward_settings, review_rewards_config, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14,
          $15, $16, $17, $18, $19,
          $20, $21, NOW(), NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug,
          name = EXCLUDED.name,
          cuisine = COALESCE(EXCLUDED.cuisine, restaurants.cuisine),
          location = COALESCE(EXCLUDED.location, restaurants.location),
          updated_at = NOW();
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
        r.review_rewards_config ? JSON.stringify(r.review_rewards_config) : null
      ];

      await pgClient.query(queryText, values);
      report.migrated.restaurants++;
    } catch (err) {
      report.failed.push({ type: 'restaurant', id: r.id, error: err.message });
    }
  }

  // 4. Insert/Upsert Tables
  console.log('\nStep 4: Migrating restaurant tables...');
  for (const t of tablesMap.values()) {
    if (!restaurantMap.has(t.restaurant_id)) continue;
    try {
      const q = `
        INSERT INTO restaurant_tables (id, restaurant_id, label, section, capacity, public_token, is_active, status, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        ON CONFLICT (id) DO UPDATE SET
          label = EXCLUDED.label,
          capacity = EXCLUDED.capacity,
          public_token = EXCLUDED.public_token,
          updated_at = NOW();
      `;
      await pgClient.query(q, [
        t.id,
        t.restaurant_id,
        t.label,
        t.section || 'Main',
        t.capacity || 4,
        t.public_token || `token-${t.id}`,
        t.is_active !== false,
        t.status || 'vacant'
      ]);
      report.migrated.tables++;
    } catch (err) {
      report.failed.push({ type: 'table', id: t.id, error: err.message });
    }
  }

  // 5. Insert/Upsert Menu Categories
  console.log('\nStep 5: Migrating menu categories...');
  for (const c of categoriesMap.values()) {
    if (!restaurantMap.has(c.restaurant_id)) continue;
    try {
      const q = `
        INSERT INTO menu_categories (id, restaurant_id, name, category_type, sort_order, is_active, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          sort_order = EXCLUDED.sort_order,
          updated_at = NOW();
      `;
      await pgClient.query(q, [
        c.id,
        c.restaurant_id,
        c.name,
        c.category_type || 'food',
        c.sort_order || 0,
        c.is_active !== false
      ]);
      report.migrated.categories++;
    } catch (err) {
      report.failed.push({ type: 'category', id: c.id, error: err.message });
    }
  }

  // 6. Insert/Upsert Menu Items
  console.log('\nStep 6: Migrating menu items...');
  for (const item of menuItemsMap.values()) {
    if (!restaurantMap.has(item.restaurant_id)) continue;
    try {
      const q = `
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
          name = EXCLUDED.name,
          price = EXCLUDED.price,
          short_description = EXCLUDED.short_description,
          is_available = EXCLUDED.is_available,
          updated_at = NOW();
      `;
      const values = [
        item.id,
        item.restaurant_id,
        categoriesMap.has(item.category_id) ? item.category_id : null,
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

      await pgClient.query(q, values);
      report.migrated.menuItems++;
    } catch (err) {
      report.failed.push({ type: 'menu_item', id: item.id, error: err.message });
    }
  }

  // 7. Insert/Upsert Review Challenges
  console.log('\nStep 7: Migrating review challenges...');
  for (const ch of challengesMap.values()) {
    if (!restaurantMap.has(ch.restaurant_id)) continue;
    try {
      const q = `
        INSERT INTO review_challenges (
          id, restaurant_id, title, description, reward_type, reward_item_name,
          win_probability_percent, is_active, terms, redemption_code_prefix
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          reward_item_name = EXCLUDED.reward_item_name,
          is_active = EXCLUDED.is_active;
      `;
      await pgClient.query(q, [
        ch.id,
        ch.restaurant_id,
        ch.title,
        ch.description || '',
        ch.reward_type || 'discount',
        ch.reward_item_name,
        ch.win_probability_percent ?? 50,
        ch.is_active !== false,
        ch.terms || '',
        ch.redemption_code_prefix || 'CHAL'
      ]);
      report.migrated.challenges++;
    } catch (err) {
      report.failed.push({ type: 'challenge', id: ch.id, error: err.message });
    }
  }

  // 8. Count verified rows in DB
  const counts = await pgClient.query(`
    SELECT
      (SELECT COUNT(*) FROM restaurants) as rest_count,
      (SELECT COUNT(*) FROM restaurant_tables) as tbl_count,
      (SELECT COUNT(*) FROM menu_categories) as cat_count,
      (SELECT COUNT(*) FROM menu_items) as item_count,
      (SELECT COUNT(*) FROM review_challenges) as chal_count
  `);

  console.log('\n================================================================');
  console.log('MIGRATION SUMMARY REPORT');
  console.log('================================================================');
  console.log(`Restaurants:  Discovered ${report.discovered.restaurants} | Migrated ${report.migrated.restaurants} | In PostgreSQL ${counts.rows[0].rest_count}`);
  console.log(`Tables:       Discovered ${report.discovered.tables} | Migrated ${report.migrated.tables} | In PostgreSQL ${counts.rows[0].tbl_count}`);
  console.log(`Categories:   Discovered ${report.discovered.categories} | Migrated ${report.migrated.categories} | In PostgreSQL ${counts.rows[0].cat_count}`);
  console.log(`MenuItems:    Discovered ${report.discovered.menuItems} | Migrated ${report.migrated.menuItems} | In PostgreSQL ${counts.rows[0].item_count}`);
  console.log(`Challenges:   Discovered ${report.discovered.challenges} | Migrated ${report.migrated.challenges} | In PostgreSQL ${counts.rows[0].chal_count}`);
  console.log(`Failed Items: ${report.failed.length}`);

  if (report.failed.length > 0) {
    console.error('Failure details:', report.failed.slice(0, 5));
  }

  return { report, counts: counts.rows[0] };
}

// Allow direct CLI invocation
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigration()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal migration error:', err.message);
      process.exit(1);
    });
}
