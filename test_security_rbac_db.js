import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  console.log('========================================================');
  console.log('MENUZ: COMPREHENSIVE SECURITY, AUTH, RBAC & DB AUDIT TEST');
  console.log('========================================================\n');

  let failures = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failures++;
    }
  }

  // Helper function to make HTTP request
  function request(urlPath, method = 'GET', headers = {}, body = null) {
    return new Promise((resolve, reject) => {
      const req = http.request({
        hostname: '127.0.0.1',
        port: 4000,
        path: urlPath,
        method,
        headers
      }, (res) => {
        let resBody = '';
        res.on('data', chunk => resBody += chunk);
        res.on('end', () => resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: resBody
        }));
      });
      req.on('error', reject);
      if (body) {
        req.write(typeof body === 'object' ? JSON.stringify(body) : body);
      }
      req.end();
    });
  }

  // Ensure database initialized
  db.initDatabase();

  // ─────────────────────────────────────────────────────────────
  // 1. TEST DATABASE PERSISTENCE & "NO DISAPPEARING RESTAURANTS"
  // ─────────────────────────────────────────────────────────────
  console.log('[1] Testing SQLite Database Persistence & Anti-Disappearance:');

  const initialRestaurants = db.getAllRestaurants();
  console.log(`  Initial persistent restaurants in DB: ${initialRestaurants.length}`);
  assert(initialRestaurants.length >= 2, `DB initialized with core venues (got ${initialRestaurants.length})`);
  assert(initialRestaurants.some(r => r.slug === 'saffron-house'), 'Contains Saffron House');
  assert(initialRestaurants.some(r => r.slug === 'casa-bella-trattoria'), 'Contains Casa Bella Trattoria');

  // Insert a test restaurant
  const testRestId = 'rest-test-persistent-' + Date.now();
  const testRest = {
    id: testRestId,
    slug: 'test-persistent-lounge',
    name: 'Test Persistent Lounge',
    cuisine: 'Modern Continental',
    location: 'Baner, Pune',
    status: 'active'
  };

  db.upsertRestaurant(testRest);
  const fetchedAfterInsert = db.getRestaurantById(testRestId);
  assert(fetchedAfterInsert !== null, 'Newly added restaurant successfully stored in SQLite');
  assert(fetchedAfterInsert.name === 'Test Persistent Lounge', 'Name matches inserted restaurant');

  // Simulate destructive client payload that omits the restaurant
  console.log('  -> Simulating destructive client sync with empty/incomplete payload...');
  const destructivePayload = {
    restaurants: [
      { id: 'rest-saffron-house-01', name: 'Saffron House', slug: 'saffron-house' }
    ]
  };
  db.mergeIncomingSyncState(destructivePayload);

  // Verify the restaurant did NOT disappear
  const checkAfterSync = db.getRestaurantById(testRestId);
  assert(checkAfterSync !== null, 'CRITICAL: Test restaurant DID NOT disappear after destructive client sync!');

  // Cleanup test restaurant
  db.deleteRestaurant(testRestId);
  assert(db.getRestaurantById(testRestId) === null, 'Test restaurant cleaned up properly');

  // ─────────────────────────────────────────────────────────────
  // 2. TEST ROLE-BASED ACCESS (RBAC) & NO FALLBACK REDIRECTS TO HQ
  // ─────────────────────────────────────────────────────────────
  console.log('\n[2] Testing Server-Side RBAC & Redirect Safeguards:');

  // Test 2a: Unauthenticated API request to /hq
  console.log('  -> Probing /hq with Accept: application/json without credentials:');
  const hqUnauthorized = await request('/hq', 'GET', { 'Accept': 'application/json' });
  assert(hqUnauthorized.statusCode === 401, `Returns 401 Unauthorized (got ${hqUnauthorized.statusCode})`);
  const hqRedirectHeader = hqUnauthorized.headers['location'] || '';
  assert(!hqRedirectHeader.includes('/hq'), 'No redirect to /hq on unauthenticated request');
  assert(hqUnauthorized.body.includes('Master Admin authentication required'), 'Contains clear 401 error message');

  // Test 2b: Authenticated API request to /hq with admin role
  console.log('  -> Probing /hq with X-Menuz-Role: admin:');
  const hqAuthorized = await request('/hq', 'GET', {
    'Accept': 'text/html',
    'X-Menuz-Role': 'admin'
  });
  assert(hqAuthorized.statusCode === 200, `Returns 200 OK for admin (got ${hqAuthorized.statusCode})`);

  // Test 2c: Unauthenticated request to /restaurant API
  console.log('  -> Probing /restaurant/api/manage with Accept: application/json without credentials:');
  const restUnauthorized = await request('/restaurant/api/manage', 'GET', { 'Accept': 'application/json' });
  assert(restUnauthorized.statusCode === 401, `Returns 401 Unauthorized for restaurant (got ${restUnauthorized.statusCode})`);
  const restRedirectHeader = restUnauthorized.headers['location'] || '';
  assert(!restRedirectHeader.includes('/hq'), 'CRITICAL: No fallback redirect to /hq on restaurant auth failure!');

  // Test 2d: Authenticated request to /restaurant with owner role
  console.log('  -> Probing /restaurant with X-Menuz-Role: owner:');
  const restAuthorized = await request('/restaurant', 'GET', {
    'Accept': 'text/html',
    'X-Menuz-Role': 'owner'
  });
  assert(restAuthorized.statusCode === 200, `Returns 200 OK for owner (got ${restAuthorized.statusCode})`);

  // Test 2e: Public customer access to /customer and /
  console.log('  -> Probing /customer and /:');
  const customerRes = await request('/customer', 'GET', { 'Accept': 'text/html' });
  assert(customerRes.statusCode === 200, `Returns 200 OK for /customer (got ${customerRes.statusCode})`);
  const rootRes = await request('/', 'GET', { 'Accept': 'text/html' });
  assert(rootRes.statusCode === 200, `Returns 200 OK for / (got ${rootRes.statusCode})`);

  // Test 2f: Nonexistent path with Accept: text/html
  console.log('  -> Probing 404 path with Accept: text/html:');
  const notFoundRes = await request('/some-missing-page-random', 'GET', { 'Accept': 'text/html' });
  assert(notFoundRes.statusCode === 404, `Returns 404 Not Found (got ${notFoundRes.statusCode})`);
  const notFoundRedirect = notFoundRes.headers['location'] || '';
  assert(!notFoundRedirect.includes('/hq'), 'CRITICAL: 404 does NOT redirect to /hq!');

  // ─────────────────────────────────────────────────────────────
  // 3. TEST AUTHENTICATION LOGIN ENDPOINT
  // ─────────────────────────────────────────────────────────────
  console.log('\n[3] Testing Session Authentication API:');

  // Test Admin Login with invalid passcode
  const badLogin = await request('/api/auth/login', 'POST', { 'Content-Type': 'application/json' }, {
    role: 'admin',
    passcode: 'wrong-passcode'
  });
  assert(badLogin.statusCode === 401, `Rejects wrong admin passcode with 401 (got ${badLogin.statusCode})`);

  // Test Admin Login with valid passcode
  const goodLogin = await request('/api/auth/login', 'POST', { 'Content-Type': 'application/json' }, {
    role: 'admin',
    passcode: 'menuz2026'
  });
  assert(goodLogin.statusCode === 200, `Accepts valid admin passcode with 200 (got ${goodLogin.statusCode})`);
  const loginData = JSON.parse(goodLogin.body || '{}');
  assert(!!loginData.token, 'Issues valid session token');
  assert(loginData.role === 'admin', 'Session role is admin');

  // Test session verification
  const sessionCheck = await request('/api/auth/session', 'GET', {
    'Authorization': `Bearer ${loginData.token}`
  });
  assert(sessionCheck.statusCode === 200, 'Verifies valid session token');
  const sessionData = JSON.parse(sessionCheck.body || '{}');
  assert(sessionData.authenticated === true, 'Authenticated is true');
  assert(sessionData.role === 'admin', 'Role matches admin');

  // Test logout
  const logoutRes = await request('/api/auth/logout', 'POST', {
    'Authorization': `Bearer ${loginData.token}`
  });
  assert(logoutRes.statusCode === 200, 'Logout succeeds with 200');

  // Verify session terminated
  const postLogoutCheck = await request('/api/auth/session', 'GET', {
    'Authorization': `Bearer ${loginData.token}`
  });
  assert(postLogoutCheck.statusCode === 401, 'Terminated session returns 401');

  // ─────────────────────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────────────────────
  console.log('\n========================================================');
  if (failures === 0) {
    console.log('🎉 ALL SECURITY, RBAC, ROUTING & DB AUDIT TESTS PASSED!');
    console.log('========================================================\n');
    process.exit(0);
  } else {
    console.error(`❌ ${failures} AUDIT TESTS FAILED!`);
    console.log('========================================================\n');
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal audit test failure:', err);
  process.exit(1);
});
