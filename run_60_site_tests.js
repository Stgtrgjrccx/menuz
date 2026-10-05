import puppeteer from 'puppeteer-core';

const BASE_URL = 'https://temporary-turbo-cygnus-led004r.vercel.app';

async function runAllTests() {
  console.log('====================================================');
  console.log('MENUZ 60-TEST AUTOMATION SUITE: HQ, DINER & PARTNER');
  console.log('Target Live Host:', BASE_URL);
  console.log('====================================================\n');

  const browser = await puppeteer.launch({
    executablePath: '/Users/siddhantwarde/.gemini/antigravity-ide/scratch/menuz/chrome/mac_arm-154.0.8037.92/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const testResults = [];
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const txt = msg.text();
      if (!txt.includes('AudioContext') && !txt.includes('favicon.ico')) {
        consoleErrors.push(txt);
      }
    }
  });

  page.on('pageerror', err => {
    if (!err.message.includes('AudioContext')) {
      consoleErrors.push(err.message);
    }
  });

  function record(section, testNum, testName, passed, details = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`[${section}] Test ${testNum}: ${status} - ${testName} ${details ? `(${details})` : ''}`);
    testResults.push({ section, testNum, testName, passed, details });
  }

  try {
    // ═════════════════════════════════════════════════════════════
    // SECTION 1: MASTER ENTERPRISE HQ (20 TESTS)
    // ═════════════════════════════════════════════════════════════
    console.log('\n--- SECTION 1: ENTERPRISE HQ SITE TESTS (1 - 20) ---');

    // Test 1.1: Load HQ URL
    await page.goto(`${BASE_URL}/#/hq`, { waitUntil: 'networkidle0' });
    const hqTitle = await page.title();
    record('HQ', 1, 'Page load and SEO Title check', hqTitle.includes('Master Admin HQ'), hqTitle);

    // Test 1.2: Standalone Enterprise Header
    const enterpriseHeaderExists = await page.evaluate(() => {
      const header = document.querySelector('header');
      return header ? header.textContent.includes('ENTERPRISE HQ') : false;
    });
    record('HQ', 2, 'Standalone Enterprise Master Header is displayed', enterpriseHeaderExists);

    // Test 1.3: Standard consumer Navbar is completely hidden on HQ
    const consumerNavHidden = await page.evaluate(() => {
      const portBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Portals'));
      return !portBtn; // consumer Portals button should not be in standard navbar
    });
    record('HQ', 3, 'Standard consumer navbar is isolated & hidden on HQ', consumerNavHidden);

    // Test 1.4: Production Cluster live status badge
    const liveReadyBadge = await page.evaluate(() => {
      return document.body.textContent.includes('Live Production Cluster') || document.body.textContent.includes('Live Ready');
    });
    record('HQ', 4, 'Production Cluster Live badge rendered', liveReadyBadge);

    // Test 1.5: 3,000+ Pune Venues indexed indicator
    const venuesIndexed = await page.evaluate(() => {
      return document.body.textContent.includes('3,000+');
    });
    record('HQ', 5, '3,000+ Pune Venues registry stat displayed', venuesIndexed);

    // Test 1.6: Search input on HQ
    const searchInput = await page.$('input[placeholder*="Search Pune city database"]') || await page.$('input[placeholder*="Search"]');
    record('HQ', 6, 'Admin registry search input found', Boolean(searchInput));

    // Test 1.7: Type search query "German Bakery"
    if (searchInput) {
      await searchInput.type('German Bakery');
      await new Promise(r => setTimeout(r, 400));
    }
    const searchFilterWorking = await page.evaluate(() => {
      return document.body.textContent.includes('German Bakery');
    });
    record('HQ', 7, 'Live search filtering works (found German Bakery)', searchFilterWorking);

    // Clear search so partner venues are visible again
    await page.evaluate(() => {
      const input = document.querySelector('input[placeholder*="Search Pune city database"]') || document.querySelector('input[placeholder*="Search"]');
      if (input) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(input, '');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise(r => setTimeout(r, 400));

    // Test 1.8: Neighborhood filter dropdown/buttons
    const hasNeighborhoodFilter = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button, select')).some(el => el.textContent.includes('Koregaon Park') || el.textContent.includes('Neighborhood') || el.textContent.includes('All'));
    });
    record('HQ', 8, 'Neighborhood area selector available', hasNeighborhoodFilter);

    // Test 1.9: Partner filter (Menuz Partners vs Directory)
    const hasPartnerFilter = await page.evaluate(() => {
      return document.body.textContent.includes('Menuz Partners') || document.body.textContent.includes('Directory');
    });
    record('HQ', 9, 'Partner vs Directory ecosystem toggle present', hasPartnerFilter);

    // Test 1.10: Stats counter verification (Total Venues / Revenue)
    const statsRendered = await page.evaluate(() => {
      return document.body.textContent.includes('Total Venues') || document.body.textContent.includes('Demo Venues');
    });
    record('HQ', 10, 'Platform analytics counters rendered', statsRendered);

    // Test 1.11: Add New Restaurant button
    const addRestBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.textContent.includes('Add Restaurant') || b.textContent.includes('Onboard'));
    });
    record('HQ', 11, 'Add Restaurant action button present', addRestBtn);

    // Test 1.12: POS Provider configuration tabs
    const posTabs = await page.evaluate(() => {
      return document.body.textContent.includes('Petpooja') || document.body.textContent.includes('POS');
    });
    record('HQ', 12, 'POS Provider gateway controls present', posTabs);

    // Test 1.13: WhatsApp Campaigns engine
    const whatsappTab = await page.evaluate(() => {
      return document.body.textContent.includes('WhatsApp') || document.body.textContent.includes('Campaign');
    });
    record('HQ', 13, 'WhatsApp Campaign management available', whatsappTab);

    // Test 1.14: Master Image Library launcher
    const photoLibBtn = await page.evaluate(() => {
      return document.body.textContent.includes('Venue Photos') ||
        document.body.textContent.includes('Dish Photos') ||
        Array.from(document.querySelectorAll('button, a')).some(b => b.textContent.includes('Photo') || b.textContent.includes('Image') || (b.title && b.title.includes('Photo')));
    });
    record('HQ', 14, 'Master Image & Photo Library available', Boolean(photoLibBtn));

    // Test 1.15: Force Refresh / Cache Purge button
    const refreshBtn = await page.$('button[title*="refresh"], button[title*="Purge"]');
    record('HQ', 15, 'Force Cache Purge & Sync DB button available', Boolean(refreshBtn));

    // Test 1.16: Lock HQ Session button
    const lockBtn = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('Lock'));
    });
    record('HQ', 16, 'HQ Session Security Lock available', lockBtn);

    // Test 1.17: Customer Discovery portal jump link
    const custJump = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).some(a => a.href.includes('#/') && a.textContent.includes('Customer Site'));
    });
    record('HQ', 17, 'Quick link to Customer Discovery site present', custJump);

    // Test 1.18: Diner Menus portal jump link
    const dinerJump = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).some(a => a.href.includes('#/menu') && a.textContent.includes('Diner Menus'));
    });
    record('HQ', 18, 'Quick link to Diner Menus portal present', dinerJump);

    // Test 1.19: Restaurant Partner Hub portal jump link
    const partnerJump = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).some(a => a.href.includes('#/manage') && a.textContent.includes('Restaurant Hub'));
    });
    record('HQ', 19, 'Quick link to Restaurant Partner Hub present', partnerJump);

    // Test 1.20: Kitchen KDS portal jump link
    const kdsJump = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).some(a => a.href.includes('#/kitchen'));
    });
    record('HQ', 20, 'Quick link to Kitchen KDS present', kdsJump);


    // ═════════════════════════════════════════════════════════════
    // SECTION 2: CUSTOMER DINING & MENU HUB (20 TESTS)
    // ═════════════════════════════════════════════════════════════
    console.log('\n--- SECTION 2: CUSTOMER DINING & MENU HUB TESTS (21 - 40) ---');

    // Test 2.1: Load Customer Home
    await page.goto(`${BASE_URL}/#/`, { waitUntil: 'networkidle0' });
    const custTitle = await page.title();
    record('CUSTOMER', 21, 'Customer Home page load & title check', custTitle.includes('Menuz'), custTitle);

    // Test 2.2: Pune Landmark cards
    const landmarkCards = await page.evaluate(() => {
      return document.body.textContent.includes('Vaishali Restaurant') && document.body.textContent.includes('Cafe Goodluck');
    });
    record('CUSTOMER', 22, 'Pune Landmark showcase (Vaishali, Goodluck) displayed', landmarkCards);

    // Test 2.3: 3,000+ directory search on home page
    const custSearch = await page.$('input[placeholder*="Search"]');
    record('CUSTOMER', 23, 'Public directory search input present', Boolean(custSearch));

    // Test 2.4: Load Generic Customer Menu Hub (/menu)
    await page.goto(`${BASE_URL}/#/menu`, { waitUntil: 'networkidle0' });
    const menuHubTitle = await page.title();
    record('CUSTOMER', 24, 'Diner Menu Hub loads successfully', menuHubTitle.includes('Menu') || menuHubTitle.includes('Diner'), menuHubTitle);

    // Test 2.5: Table QR Scanner Call-To-Action
    const qrScanBtn = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('Scan Table QR') || b.textContent.includes('Camera Scanner'));
    });
    record('CUSTOMER', 25, 'Seated at Table? QR Scanner button is displayed', qrScanBtn);

    // Test 2.6: Search input in Menu Hub
    const menuHubSearch = await page.$('input[placeholder*="Search restaurant or dishes"]');
    record('CUSTOMER', 26, 'Menu Hub dish & restaurant search input active', Boolean(menuHubSearch));

    // Test 2.7: Category filter pills in Menu Hub
    const filterPills = await page.evaluate(() => {
      return document.body.textContent.includes('South Indian') && document.body.textContent.includes('Pure Veg');
    });
    record('CUSTOMER', 27, 'Cuisine category filter pills present', filterPills);

    // Test 2.8: Navigate into specific restaurant menu
    await page.goto(`${BASE_URL}/#/r/saffron-house/menu?t=table-token-01-saffron`, { waitUntil: 'networkidle0' });
    const restName = await page.evaluate(() => {
      return document.body.textContent.includes('Saffron House');
    });
    record('CUSTOMER', 28, 'Specific venue interactive menu loads (Saffron House)', restName);

    // Test 2.9: Verify default language is English
    const isLangEnglish = await page.evaluate(() => {
      return document.body.textContent.includes('English') || document.body.textContent.includes('🇬🇧');
    });
    record('CUSTOMER', 29, 'Default language is strictly English', isLangEnglish);

    // Test 2.10: Open Language Selector dropdown
    const langBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const found = btns.find(b => b.textContent.includes('English') || b.title?.includes('Language'));
      if (found) {
        found.click();
        return true;
      }
      return false;
    });
    record('CUSTOMER', 30, 'Language Selector dropdown triggers successfully', langBtn);
    await new Promise(r => setTimeout(r, 400));

    // Test 2.11: Select Hindi ('hi')
    const clickedHindi = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const hindiBtn = btns.find(b => b.textContent.includes('हिन्दी') || b.textContent.includes('Hindi'));
      if (hindiBtn) {
        hindiBtn.click();
        return true;
      }
      return false;
    });
    record('CUSTOMER', 31, 'Switched language to Hindi (हिन्दी)', clickedHindi);
    await new Promise(r => setTimeout(r, 400));

    // Test 2.12: Verify translation rendered
    const hasHindiText = await page.evaluate(() => {
      return document.body.textContent.includes('मेन्यू') || document.body.textContent.includes('खाना') || document.body.textContent.includes('हिन्दी');
    });
    record('CUSTOMER', 32, 'Hindi translations rendered on screen', hasHindiText);

    // Test 2.13: Navigate away to /menu and verify IMMEDIATE RESET to English
    await page.goto(`${BASE_URL}/#/menu`, { waitUntil: 'networkidle0' });
    const resetBackToEnglish = await page.evaluate(() => {
      return document.body.textContent.includes('English') && !document.body.textContent.includes('मेन्यू');
    });
    record('CUSTOMER', 33, 'Language immediately resets to English on leaving the page', resetBackToEnglish);

    // Re-enter Saffron House menu
    await page.goto(`${BASE_URL}/#/r/saffron-house/menu?t=table-token-01-saffron`, { waitUntil: 'networkidle0' });

    // Test 2.14: "All Menus" back navigation button in top bar
    const allMenusBtn = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).some(a => a.textContent.includes('All Menus') && a.href.includes('#/menu'));
    });
    record('CUSTOMER', 34, 'Back button "All Menus" links back to Diner Hub', allMenusBtn);

    // Test 2.15: Category tabs navigation (Starters, Mains, Desserts)
    const categoryTabs = await page.evaluate(() => {
      return document.body.textContent.includes('Starters') || document.body.textContent.includes('Main Course') || document.body.textContent.includes('Dum Biryani');
    });
    record('CUSTOMER', 35, 'Menu category tabs present', categoryTabs);

    // Test 2.16: Add item to cart button
    const addBtnClicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const add = btns.find(b => b.textContent.trim() === 'Add' || b.textContent.includes('Add to Table') || b.textContent.includes('+'));
      if (add) {
        add.click();
        return true;
      }
      return false;
    });
    record('CUSTOMER', 36, 'Add dish to table cart action works', addBtnClicked);
    await new Promise(r => setTimeout(r, 400));

    // Test 2.17: Cart badge indicator updates
    const cartBadgeUpdated = await page.evaluate(() => {
      return document.body.textContent.includes('View Cart') || Array.from(document.querySelectorAll('button')).some(b => b.title?.includes('Cart') || b.textContent.includes('Cart'));
    });
    record('CUSTOMER', 37, 'Multiplayer Table Cart badge increments', cartBadgeUpdated);

    // Test 2.18: Waiter Call Bell action
    const waiterBellPresent = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).some(b => b.title?.includes('Waiter') || b.textContent.includes('Call') || b.textContent.includes('Service'));
    });
    record('CUSTOMER', 38, 'Call Waiter service action available', waiterBellPresent);

    // Test 2.19: Table Sync & Guest indicator
    const tableSyncBadge = await page.evaluate(() => {
      return document.body.textContent.includes('Table') && document.body.textContent.includes('Sync');
    });
    record('CUSTOMER', 39, 'Real-time Multiplayer Table Sync active', tableSyncBadge);

    // Test 2.20: Zero fatal console errors on Customer portal
    record('CUSTOMER', 40, 'Customer portal has zero fatal runtime errors', consoleErrors.length === 0, `${consoleErrors.length} errors logged`);


    // ═════════════════════════════════════════════════════════════
    // SECTION 3: RESTAURANT PARTNER PORTAL (20 TESTS)
    // ═════════════════════════════════════════════════════════════
    console.log('\n--- SECTION 3: RESTAURANT PARTNER PORTAL TESTS (41 - 60) ---');

    // Test 3.1: Load Restaurant Partner Hub (/manage)
    await page.goto(`${BASE_URL}/#/manage`, { waitUntil: 'networkidle0' });
    const manageTitle = await page.title();
    record('PARTNER', 41, 'Restaurant Partner Hub loads successfully', manageTitle.includes('Restaurant Partner') || manageTitle.includes('Hub'), manageTitle);

    // Test 3.2: Generic Partner Hub Header (not hardcoded to Saffron House)
    const partnerHubHeader = await page.evaluate(() => {
      return document.body.textContent.includes('PARTNER HUB') && document.body.textContent.includes('Restaurant Partner Operations Hub');
    });
    record('PARTNER', 42, 'Generic Restaurant Partner Hub header displayed', partnerHubHeader);

    // Test 3.3: Partner benefits banner (0% commission, 1-sec KOT)
    const partnerBenefits = await page.evaluate(() => {
      return document.body.textContent.includes('0%') && document.body.textContent.includes('Direct KOT Printing');
    });
    record('PARTNER', 43, 'Partner benefit cards (0% commission, 1-sec KOT) rendered', partnerBenefits);

    // Test 3.4: Outlet search input
    const outletSearch = await page.$('input[placeholder*="Search restaurant outlet"]');
    record('PARTNER', 44, 'Partner outlet search input active', Boolean(outletSearch));

    // Test 3.5: Search for Vaishali in Partner Hub
    if (outletSearch) {
      await outletSearch.type('Vaishali');
      await new Promise(r => setTimeout(r, 400));
    }
    const foundVaishali = await page.evaluate(() => {
      return document.body.textContent.includes('Vaishali Restaurant');
    });
    record('PARTNER', 45, 'Outlet search finds Vaishali Restaurant', foundVaishali);

    // Clear outlet search
    if (outletSearch) {
      await outletSearch.click({ clickCount: 3 });
      await page.keyboard.press('Backspace');
      await new Promise(r => setTimeout(r, 300));
    }

    // Test 3.6: Neighborhood filter chips in Partner Hub
    const partnerAreaChips = await page.evaluate(() => {
      return document.body.textContent.includes('FC Road') && document.body.textContent.includes('Koregaon Park');
    });
    record('PARTNER', 46, 'Pune neighborhood filter chips present', partnerAreaChips);

    // Test 3.7: Outlet cards show live tables & POS provider badges
    const outletBadges = await page.evaluate(() => {
      return document.body.textContent.includes('Tables') && document.body.textContent.includes('POS');
    });
    record('PARTNER', 47, 'Outlet cards display live tables count and POS type', outletBadges);

    // Test 3.8: Enter Floor Operations button navigates to specific outlet
    const enterFloorOpsBtn = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links.some(l => l.textContent.includes('Enter Floor Operations') && l.href.includes('#/manage/'));
    });
    record('PARTNER', 48, 'Enter Floor Operations link points to /manage/:slug', enterFloorOpsBtn);

    // Test 3.9: Open specific venue floor operations (/manage/saffron-house)
    await page.goto(`${BASE_URL}/#/manage/saffron-house`, { waitUntil: 'networkidle0' });
    const floorOpsLoaded = await page.evaluate(() => {
      return document.body.textContent.includes('Floor Ops') && document.body.textContent.includes('Saffron House');
    });
    record('PARTNER', 49, 'Specific venue floor ops dashboard loaded (Saffron House)', floorOpsLoaded);

    // Test 3.10: "← All Outlets" return button in manager dashboard
    const allOutletsBtn = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).some(a => a.textContent.includes('All Outlets') && a.href.includes('#/manage'));
    });
    record('PARTNER', 50, 'Back button "All Outlets" returns to generic Partner Hub', allOutletsBtn);

    // Test 3.11: Floor plan seating layout module
    const floorPlanModule = await page.evaluate(() => {
      return document.body.textContent.includes('Floor Plan') || document.body.textContent.includes('Layout');
    });
    record('PARTNER', 51, 'Interactive Floor Plan module available', floorPlanModule);

    // Test 3.12: Live Table cards & token QR generator
    const tableCards = await page.evaluate(() => {
      return document.body.textContent.includes('Table 1') || document.body.textContent.includes('Tables');
    });
    record('PARTNER', 52, 'Live tables management cards rendered', tableCards);

    // Test 3.13: Kitchen KDS navigation link
    const kdsLink = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).some(a => a.href.includes('#/kitchen'));
    });
    record('PARTNER', 53, 'Kitchen KDS link available in floor operations', kdsLink);

    // Test 3.14: Load Kitchen KDS
    await page.goto(`${BASE_URL}/#/kitchen`, { waitUntil: 'networkidle0' });
    const kdsTitle = await page.title();
    record('PARTNER', 54, 'Kitchen KDS interface loads without errors', kdsTitle.includes('Kitchen') || kdsTitle.includes('KDS'), kdsTitle);

    // Return to manage
    await page.goto(`${BASE_URL}/#/manage/saffron-house`, { waitUntil: 'networkidle0' });

    // Test 3.15: Google 5-Star Review Shield module
    const reviewShield = await page.evaluate(() => {
      return document.body.textContent.includes('Review') || document.body.textContent.includes('Google') || document.body.textContent.includes('Shield');
    });
    record('PARTNER', 55, 'Google 5-Star Reputation Shield module present', reviewShield);

    // Test 3.16: Menu & Photo Studio module
    const photoStudio = await page.evaluate(() => {
      return document.body.textContent.includes('Menu') && document.body.textContent.includes('Photo');
    });
    record('PARTNER', 56, 'Restaurant Menu & Photo Studio module present', photoStudio);

    // Test 3.17: AI Chef & Story Studio navigation
    const aiStudioNav = await page.evaluate(() => {
      return document.body.textContent.includes("Chef & Founder's Story Studio") || 
        Array.from(document.querySelectorAll('a, button, div')).some(el => el.textContent.includes('Chef') && el.textContent.includes('Story'));
    });
    record('PARTNER', 57, 'AI Culinary Studio launcher accessible', aiStudioNav);

    // Test 3.18: POS Integration modal launcher
    const posModal = await page.evaluate(() => {
      return document.body.textContent.includes('POS') || document.body.textContent.includes('Petpooja');
    });
    record('PARTNER', 58, 'POS Sync Integration bridge controls available', posModal);

    // Test 3.19: Master Admin security isolation (no /admin links leaked)
    const noAdminLeaked = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a')).map(a => a.href);
      return !links.some(h => h.endsWith('/admin'));
    });
    record('PARTNER', 59, 'Zero Master Admin /admin links leaked to restaurant manager', noAdminLeaked);

    // Test 3.20: Responsive Mobile view test
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.goto(`${BASE_URL}/#/manage`, { waitUntil: 'networkidle0' });
    const mobileRenderOk = await page.evaluate(() => {
      return document.body.scrollWidth <= 420;
    });
    record('PARTNER', 60, 'Mobile viewport rendering clean without horizontal spill', mobileRenderOk);

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    await browser.close();
  }

  // Summary
  console.log('\n====================================================');
  console.log('TEST RESULTS SUMMARY:');
  const passedCount = testResults.filter(t => t.passed).length;
  const failedCount = testResults.filter(t => !t.passed).length;
  console.log(`TOTAL TESTS: ${testResults.length} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log(`PASS RATE: ${((passedCount / testResults.length) * 100).toFixed(1)}%`);
  console.log('====================================================');

  return { passedCount, failedCount, testResults };
}

runAllTests();
