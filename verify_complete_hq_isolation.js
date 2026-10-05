import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

async function verifyIsolation() {
  console.log('========================================================');
  console.log('VERIFYING COMPLETE HQ & ADMIN ISOLATION FROM ALL SITES');
  console.log('========================================================\n');

  // Start vite preview server
  const previewProcess = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
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
  await page.setViewport({ width: 1280, height: 900 });

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
    // 1. Customer Home Page (/#/)
    await page.goto(`${BASE_URL}/#/`, { waitUntil: 'networkidle0' });
    const homeHqLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a')).map(a => a.href + ' ' + a.textContent);
      return links.filter(l => l.includes('/hq') || l.includes('/admin') || l.includes('Enterprise HQ'));
    });
    assert('Customer Home has ZERO HQ or Admin links', homeHqLinks.length === 0, JSON.stringify(homeHqLinks));

    // 2. Portals Modal from Customer Home
    const openedPortals = await page.evaluate(() => {
      const portBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Portals'));
      if (portBtn) {
        portBtn.click();
        return true;
      }
      return false;
    });
    await new Promise(r => setTimeout(r, 500));
    const portalsHqLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a')).map(a => a.href + ' ' + a.textContent);
      return links.filter(l => l.includes('/hq') || l.includes('/admin') || l.includes('Enterprise HQ'));
    });
    assert('Portals Quick Launcher has ZERO Enterprise HQ category', portalsHqLinks.length === 0, JSON.stringify(portalsHqLinks));

    // 3. Diner Menu Hub (/#/menu)
    await page.goto(`${BASE_URL}/#/menu`, { waitUntil: 'networkidle0' });
    const dinerHubHqLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a')).map(a => a.href + ' ' + a.textContent);
      return links.filter(l => l.includes('/hq') || l.includes('/admin') || l.includes('Enterprise HQ'));
    });
    assert('Diner Menu Hub has ZERO HQ or Admin links', dinerHubHqLinks.length === 0, JSON.stringify(dinerHubHqLinks));

    // 4. Restaurant Specific Diner Menu (/#/r/saffron-house/menu?t=table-token-01-saffron)
    await page.goto(`${BASE_URL}/#/r/saffron-house/menu?t=table-token-01-saffron`, { waitUntil: 'networkidle0' });
    const venueMenuHqLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a')).map(a => a.href + ' ' + a.textContent);
      return links.filter(l => l.includes('/hq') || l.includes('/admin') || l.includes('Enterprise HQ'));
    });
    assert('Customer Table QR Menu has ZERO HQ or Admin links', venueMenuHqLinks.length === 0, JSON.stringify(venueMenuHqLinks));

    // 5. Restaurant Partner Hub (/#/manage)
    await page.goto(`${BASE_URL}/#/manage`, { waitUntil: 'networkidle0' });
    const partnerHubHqLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a')).map(a => a.href + ' ' + a.textContent);
      return links.filter(l => l.includes('/hq') || l.includes('/admin') || l.includes('Enterprise HQ'));
    });
    assert('Restaurant Partner Hub has ZERO HQ or Admin links', partnerHubHqLinks.length === 0, JSON.stringify(partnerHubHqLinks));

    // 6. Restaurant Floor Operations (/#/manage/saffron-house)
    await page.goto(`${BASE_URL}/#/manage/saffron-house`, { waitUntil: 'networkidle0' });
    const floorOpsHqLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a')).map(a => a.href + ' ' + a.textContent);
      return links.filter(l => l.includes('/hq') || l.includes('/admin') || l.includes('Enterprise HQ'));
    });
    assert('Venue Floor Operations Dashboard has ZERO HQ or Admin links', floorOpsHqLinks.length === 0, JSON.stringify(floorOpsHqLinks));

    const floorOpsTextHasHq = await page.evaluate(() => {
      return document.body.textContent.includes('Pune HQ');
    });
    assert('Venue Floor Operations Header does not contain "Pune HQ"', !floorOpsTextHasHq);

    // 7. Mobile Viewport Check (iPhone 375px)
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.goto(`${BASE_URL}/#/manage/saffron-house`, { waitUntil: 'networkidle0' });
    const mobileBottomHq = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a')).map(a => a.href + ' ' + a.textContent);
      return links.filter(l => l.includes('/hq') || l.includes('/admin') || l.trim().endsWith('HQ'));
    });
    assert('Mobile Navigation Bar has ZERO HQ or Admin tabs', mobileBottomHq.length === 0, JSON.stringify(mobileBottomHq));

    // 8. Onboarded Restaurant generated link test
    await page.goto(`${BASE_URL}/#/r/fc-road-vaishali/menu?t=test-token`, { waitUntil: 'networkidle0' });
    const generatedLinkHq = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a')).map(a => a.href + ' ' + a.textContent);
      return links.filter(l => l.includes('/hq') || l.includes('/admin') || l.includes('Enterprise HQ'));
    });
    assert('Onboarded Restaurant Digital Menu has ZERO HQ or Admin links', generatedLinkHq.length === 0, JSON.stringify(generatedLinkHq));

    // 9. Master HQ URL Security Gate (/#/hq)
    await page.goto(`${BASE_URL}/#/hq`, { waitUntil: 'networkidle0' });
    const isSecurityLocked = await page.evaluate(() => {
      return document.body.textContent.includes('Master Secret Passphrase') &&
             document.body.textContent.includes('Verify & Unlock Master HQ');
    });
    assert('Master HQ route is strictly locked behind Secret Passphrase barrier', isSecurityLocked);

    console.log('\n========================================================');
    if (allPassed) {
      console.log('🎉 ALL ISOLATION CHECKS PASSED: ZERO HQ LEAKS DETECTED');
    } else {
      console.log('❌ SOME ISOLATION CHECKS FAILED');
    }
    console.log('========================================================');

  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
    previewProcess.kill();
  }
}

verifyIsolation();
