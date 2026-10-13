import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import fs from 'fs';
import crypto from 'crypto';
import * as db from '../server/db/dataAdapter.js';

test('1. Database Engine Initialization & Health', async () => {
  const engine = await db.initDatabaseEngine();
  assert(engine === 'postgres' || engine === 'sqlite', 'Active engine must be postgres or sqlite');
  
  const health = await db.getHealthInfo();
  assert.equal(health.status, 'ok');
  assert(health.restaurantsCount >= 2, 'Must have at least baseline restaurants');
});

test('2. Restaurant CRUD and Slug resolution', async () => {
  const testRest = {
    id: 'test-neon-rest-01',
    name: 'Neon Landmark Bistro',
    cuisine: 'Modern Fusion',
    location: 'Koregaon Park, Pune',
    currency: 'INR',
    tax_rate_percent: 5.0,
    ordering_enabled: true,
    is_menuz_partner: true,
    brand_colors: { primary: '#10B981', background: '#090D16', text: '#FFFFFF' }
  };

  const saved = await db.upsertRestaurant(testRest);
  assert.equal(saved.id, 'test-neon-rest-01');
  assert.equal(saved.name, 'Neon Landmark Bistro');
  assert.equal(saved.slug, 'neon-landmark-bistro');

  const fetchedById = await db.getRestaurantById('test-neon-rest-01');
  assert.ok(fetchedById);
  assert.equal(fetchedById.name, 'Neon Landmark Bistro');

  const fetchedBySlug = await db.getRestaurantBySlug('neon-landmark-bistro');
  assert.ok(fetchedBySlug);
  assert.equal(fetchedBySlug.id, 'test-neon-rest-01');

  // Clean up
  await db.deleteRestaurant('test-neon-rest-01');
  const deleted = await db.getRestaurantById('test-neon-rest-01');
  assert.equal(deleted, null);
});

test('3. Table and Menu Management', async () => {
  const table = {
    id: 'tbl-neon-test-1',
    restaurant_id: 'rest-saffron-house-01',
    label: 'Neon Table 99',
    section: 'Terrace Lounge',
    capacity: 6,
    public_token: 'token-neon-test-99',
    is_active: true
  };
  await db.upsertTable(table);
  const tables = await db.getTables('rest-saffron-house-01');
  assert(tables.some(t => t.id === 'tbl-neon-test-1'), 'Inserted table must exist in tables list');

  const category = {
    id: 'cat-neon-test-1',
    restaurant_id: 'rest-saffron-house-01',
    name: 'Chef Tasting Specials',
    sort_order: 1,
    is_active: true
  };
  await db.upsertCategory(category);
  const categories = await db.getCategories('rest-saffron-house-01');
  assert(categories.some(c => c.id === 'cat-neon-test-1'), 'Category must exist in list');

  const item = {
    id: 'item-neon-test-1',
    restaurant_id: 'rest-saffron-house-01',
    category_id: 'cat-neon-test-1',
    name: 'Truffle Malai Kofta',
    price: 650,
    short_description: 'Rich artisanal kofta infused with summer truffles',
    dietary_flags: ['vegetarian', 'gluten-free'],
    spice_level: 1,
    is_available: true
  };
  await db.upsertMenuItem(item);
  const items = await db.getMenuItems('rest-saffron-house-01');
  assert(items.some(i => i.id === 'item-neon-test-1'), 'Menu item must exist in list');
});

test('4. Session Auth Lifecycle (Create, Verify, Invalidate)', async () => {
  const session = await db.createSession('admin');
  assert.ok(session.token);
  assert.equal(session.role, 'admin');

  const fetched = await db.getSession(session.token);
  assert.ok(fetched);
  assert.equal(fetched.role, 'admin');

  await db.deleteSession(session.token);
  const terminated = await db.getSession(session.token);
  assert.equal(terminated, null);
});

test('5. Additive State Sync Contract (/api/state)', async () => {
  const current = await db.getFullSyncState();
  const initialCount = current.restaurants.length;

  const update = {
    restaurants: [
      {
        id: 'test-sync-rest-01',
        name: 'Sync Verification Restro',
        cuisine: 'Pan-Asian'
      }
    ]
  };

  const synced = await db.mergeIncomingSyncState(update);
  assert(synced.restaurants.length >= initialCount, 'Restaurant count must never decrease');
  assert(synced.restaurants.some(r => r.id === 'test-sync-rest-01'), 'Synced restaurant must be present');

  // Clean up
  await db.deleteRestaurant('test-sync-rest-01');
});

test('6. Backup Integrity Verification (All 8 Baselines Unmodified)', async () => {
  const baselines = {
    'backups/menuz_state_backup_safe.json': 'f91b11bdcec8a37061a8a31b6d43da92f228e3aa6950e7553d147298db8555c9',
    'backups/menuz_state_backup_safe_immutable.json': 'f91b11bdcec8a37061a8a31b6d43da92f228e3aa6950e7553d147298db8555c9',
    'backups/pune_directory_inventory.json': '2d406556b2eefc33786e75e0ed8ecc34c7f8d2c4afe9e729ef325a5dd90ceea6',
    'backups/pune_directory_inventory_immutable.json': '2d406556b2eefc33786e75e0ed8ecc34c7f8d2c4afe9e729ef325a5dd90ceea6',
    'backups/pune_menus_inventory.json': 'b9eb18afec9c8bf1009e6ce4828118ca9ff2d2a49bae854c49aa741732128093',
    'backups/pune_menus_inventory_immutable.json': 'b9eb18afec9c8bf1009e6ce4828118ca9ff2d2a49bae854c49aa741732128093',
    'backups/baseline_seed_inventory.json': 'c72fb9d25497c11c4c44edd188150e30b22dbc5c297061f8777625aba1c21c54',
    'backups/baseline_seed_inventory_immutable.json': 'c72fb9d25497c11c4c44edd188150e30b22dbc5c297061f8777625aba1c21c54'
  };

  for (const [file, expected] of Object.entries(baselines)) {
    assert(fs.existsSync(file), `File ${file} must exist`);
    const content = fs.readFileSync(file);
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    assert.equal(hash, expected, `SHA256 for ${file} must match baseline`);
  }
});
