import assert from 'assert';
import fs from 'fs';
import path from 'path';

export function runApplicationSeparationTests(): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  function check(desc: string, fn: () => void) {
    try {
      fn();
      passed++;
      console.log(`  [PASS]: ${desc}`);
    } catch (err: any) {
      console.error(`❌ [FAIL]: ${desc}`, err.message);
      failed++;
    }
  }

  console.log('=== RUNNING APPLICATION SEPARATION VERIFICATION TESTS ===');

  const rootDir = process.cwd();

  // TEST 1: Dedicated source entry points exist
  check('1. Dedicated source entry points exist', () => {
    assert.strictEqual(fs.existsSync(path.join(rootDir, 'src/apps/hq/main.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(rootDir, 'src/apps/hq/HqApp.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(rootDir, 'src/apps/hq/HqNavbar.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(rootDir, 'src/apps/customer/main.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(rootDir, 'src/apps/customer/CustomerApp.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(rootDir, 'src/apps/customer/CustomerNavbar.tsx')), true);
  });

  // TEST 2: Distinct HTML entry points target their respective apps
  check('2. Distinct HTML entry points target correct apps', () => {
    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
    const customerHtml = fs.readFileSync(path.join(rootDir, 'customer.html'), 'utf8');

    assert.strictEqual(indexHtml.includes('/src/apps/hq/main.tsx'), true, 'index.html points to HQ main');
    assert.strictEqual(customerHtml.includes('/src/apps/customer/main.tsx'), true, 'customer.html points to Customer main');
  });

  // TEST 3: Customer bundle strictly excludes MasterAdminDashboard and admin code
  check('3. Customer bundle excludes MasterAdminDashboard code', () => {
    const customerDistDir = path.join(rootDir, 'dist-customer', 'assets');
    assert.strictEqual(fs.existsSync(customerDistDir), true, 'dist-customer/assets exists');
    const files = fs.readdirSync(customerDistDir);
    const jsFile = files.find((f) => f.endsWith('.js'));
    assert.ok(jsFile, 'Found customer JS bundle');

    const content = fs.readFileSync(path.join(customerDistDir, jsFile), 'utf8');
    assert.strictEqual(content.includes('MasterAdminDashboard'), false, 'Customer bundle must NOT contain MasterAdminDashboard');
    assert.strictEqual(content.includes('getHqSiteUrl'), false, 'Customer bundle must NOT contain getHqSiteUrl');
    assert.strictEqual(content.includes('ReturnToHqBanner'), false, 'Customer bundle must NOT contain ReturnToHqBanner');
  });

  // TEST 4: HQ bundle includes Master Platform Command Center
  check('4. HQ bundle contains Master Platform Command Center code', () => {
    const hqDistDir = path.join(rootDir, 'dist-hq', 'assets');
    assert.strictEqual(fs.existsSync(hqDistDir), true, 'dist-hq/assets exists');
    const files = fs.readdirSync(hqDistDir);
    const jsFile = files.find((f) => f.endsWith('.js'));
    assert.ok(jsFile, 'Found HQ JS bundle');

    const content = fs.readFileSync(path.join(hqDistDir, jsFile), 'utf8');
    assert.strictEqual(content.includes('Master Platform Command Center'), true, 'HQ bundle must contain Command Center');
  });

  // TEST 5: Customer Navbar has ZERO links to HQ or admin
  check('5. Customer Navbar contains zero admin or HQ navigation links', () => {
    const navbarContent = fs.readFileSync(path.join(rootDir, 'src/apps/customer/CustomerNavbar.tsx'), 'utf8');
    assert.strictEqual(navbarContent.includes('Master Admin HQ'), false);
    assert.strictEqual(navbarContent.includes('Merchant & HQ Systems'), false);
    assert.strictEqual(navbarContent.includes('getHqSiteUrl'), false);
    assert.strictEqual(navbarContent.includes('ReturnToHqBanner'), false);
  });

  // TEST 6: Customer Home Page footer has ZERO links to HQ or admin
  check('6. Customer Home Page contains zero admin or HQ navigation links', () => {
    const homeContent = fs.readFileSync(path.join(rootDir, 'src/pages/CustomerHomePage.tsx'), 'utf8');
    assert.strictEqual(homeContent.includes('getHqSiteUrl'), false);
    assert.strictEqual(homeContent.includes('Master Admin HQ'), false);
  });

  // TEST 7: Assembled dist-combined directory structure
  check('7. Assembled dist-combined has isolated root HQ and nested Customer', () => {
    const distCombined = path.join(rootDir, 'dist-combined');
    assert.strictEqual(fs.existsSync(path.join(distCombined, 'index.html')), true, 'Root index.html exists');
    assert.strictEqual(fs.existsSync(path.join(distCombined, '404.html')), true, 'Root 404.html exists');
    assert.strictEqual(fs.existsSync(path.join(distCombined, 'customer', 'index.html')), true, 'Customer index.html exists');
    assert.strictEqual(fs.existsSync(path.join(distCombined, 'customer', '404.html')), true, 'Customer 404.html exists');

    const rootHtml = fs.readFileSync(path.join(distCombined, 'index.html'), 'utf8');
    const custHtml = fs.readFileSync(path.join(distCombined, 'customer', 'index.html'), 'utf8');

    assert.ok(rootHtml.includes('assets/index-'), 'Root index.html loads HQ assets');
    assert.ok(custHtml.includes('assets/customer-'), 'Customer index.html loads Customer assets');
  });

  // TEST 8: Dedicated PWA manifests placed correctly
  check('8. Dedicated PWA manifests placed correctly', () => {
    const distCombined = path.join(rootDir, 'dist-combined');
    const rootManifest = fs.readFileSync(path.join(distCombined, 'manifest.json'), 'utf8');
    const custManifest = fs.readFileSync(path.join(distCombined, 'customer', 'manifest.json'), 'utf8');

    assert.ok(rootManifest.includes('HQ') || rootManifest.includes('Master'), 'Root manifest is HQ');
    assert.ok(custManifest.includes('Dine In') || custManifest.includes('Customer'), 'Customer manifest is Customer Dine In');
  });

  // TEST 9: Service Worker cache isolation
  check('9. HQ main unregisters legacy service workers to prevent cache pollution', () => {
    const hqMain = fs.readFileSync(path.join(rootDir, 'src/apps/hq/main.tsx'), 'utf8');
    assert.ok(hqMain.includes('unregister'), 'HQ main unregisters service workers');
  });

  // TEST 10: Routing boundary isolation in CustomerApp
  check('10. Customer App redirects /admin and /hq cleanly to /', () => {
    const custApp = fs.readFileSync(path.join(rootDir, 'src/apps/customer/CustomerApp.tsx'), 'utf8');
    assert.ok(custApp.includes('path="/admin"'), 'Customer handles /admin');
    assert.ok(custApp.includes('element={<Navigate to="/" replace />}'), 'Customer redirects /admin to /');
    assert.strictEqual(custApp.includes('MasterAdminDashboard'), false, 'Customer App does not import MasterAdminDashboard');
  });

  return { passed, failed };
}

// Auto-run when executed directly
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('applicationSeparation.test')) {
  const result = runApplicationSeparationTests();
  console.log(`\nTotal Separation Tests: ${result.passed + result.failed} | Passed: ${result.passed} | Failed: ${result.failed}`);
  if (result.failed > 0) process.exit(1);
}
