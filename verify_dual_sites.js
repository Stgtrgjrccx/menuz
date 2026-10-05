import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';

const CUSTOMER_PORT = 4181;
const OWNER_PORT = 4182;

async function testDualSites() {
  console.log('========================================================');
  console.log('VERIFYING DUAL SITES: CUSTOMER & OWNER PORTALS');
  console.log('========================================================\n');

  // Spawn customer site preview
  const customerProcess = spawn('npx', ['vite', 'preview', '--outDir', 'dist-customer', '--port', String(CUSTOMER_PORT), '--strictPort'], {
    cwd: process.cwd(),
    stdio: 'ignore'
  });

  // Spawn owner site preview
  const ownerProcess = spawn('npx', ['vite', 'preview', '--outDir', 'dist-owner', '--port', String(OWNER_PORT), '--strictPort'], {
    cwd: process.cwd(),
    stdio: 'ignore'
  });

  await new Promise(r => setTimeout(r, 2000));

  const browser = await puppeteer.launch({
    executablePath: '/Users/siddhantwarde/.gemini/antigravity-ide/scratch/menuz/chrome/mac_arm-154.0.8037.92/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900']
  });

  const page = await browser.newPage();
  let allPassed = true;

  function assert(name, condition, details = '') {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
    } else {
      console.log(`❌ FAIL: ${name} ${details ? `(${details})` : ''}`);
      allPassed = false;
    }
  }

  try {
    // ═══════════════════════════════════════════════════════════
    // SITE 1: CUSTOMER SITE TESTS
    // ═══════════════════════════════════════════════════════════
    console.log('--- 1. CUSTOMER SITE CHECKS (http://localhost:' + CUSTOMER_PORT + ') ---');
    await page.goto(`http://localhost:${CUSTOMER_PORT}/#/`, { waitUntil: 'networkidle0' });
    const custTitle = await page.title();
    assert('Customer Site Title renders correctly', custTitle.includes('Dine-In') || custTitle.includes('Menuz'), custTitle);

    const isCustomerHome = await page.evaluate(() => {
      return document.body.textContent.includes('Pune') && 
             document.body.textContent.includes('Scan Table QR') &&
             document.body.textContent.includes('Vaishali Restaurant');
    });
    assert('Customer Site default page is public Pune food discovery (not tied to single restaurant)', isCustomerHome);

    const hasOwnerLinkOnCustomer = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a')).map(a => a.href + ' ' + a.textContent);
      return links.some(l => l.includes('/manage') || l.includes('Floor Ops') || l.includes('/hq'));
    });
    assert('Customer Site has zero owner or HQ links in navigation', !hasOwnerLinkOnCustomer);

    // ═══════════════════════════════════════════════════════════
    // SITE 2: OWNER SITE TESTS
    // ═══════════════════════════════════════════════════════════
    console.log('\n--- 2. OWNER SITE CHECKS (http://localhost:' + OWNER_PORT + ') ---');
    await page.goto(`http://localhost:${OWNER_PORT}/#/`, { waitUntil: 'networkidle0' });
    const ownerTitle = await page.title();
    assert('Owner Site Title renders Partner OS', ownerTitle.includes('Partner') || ownerTitle.includes('Operations'), ownerTitle);

    const isOwnerHub = await page.evaluate(() => {
      return document.body.textContent.includes('PARTNER HUB') &&
             document.body.textContent.includes('Restaurant Partner Operations Hub') &&
             document.body.textContent.includes('Direct KOT Printing');
    });
    assert('Owner Site default root page is generic Partner Operations Hub (not tied to single restaurant)', isOwnerHub);

    const hasCustomerLinkOnOwner = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a')).map(a => a.href + ' ' + a.textContent);
      return links.some(l => l.includes('Explore Pune') || l.includes('/hq'));
    });
    assert('Owner Site has zero consumer explore links or HQ leaks', !hasCustomerLinkOnOwner);

    const ownerBrandTag = await page.evaluate(() => {
      return document.body.textContent.includes('PARTNER OS');
    });
    assert('Owner Site displays PARTNER OS branding badge', ownerBrandTag);

    console.log('\n========================================================');
    if (allPassed) {
      console.log('🎉 ALL DUAL SITE TESTS PASSED SUCCESSFULLY');
    } else {
      console.log('❌ SOME DUAL SITE CHECKS FAILED');
    }
    console.log('========================================================');

  } catch (err) {
    console.error('Error during testing:', err);
  } finally {
    await browser.close();
    customerProcess.kill();
    ownerProcess.kill();
  }
}

testDualSites();
