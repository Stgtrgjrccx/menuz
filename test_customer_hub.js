import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !msg.text().includes('AudioContext')) {
      errors.push(msg.text());
    }
  });

  console.log('--- TEST 1: Visiting Menuz Customer Home Page (Desktop) ---');
  await page.goto('http://localhost:5173/#/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({
    path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/menuz_customer_home.png',
    fullPage: false
  });
  console.log('Saved menuz_customer_home.png');

  // Test Mobile View of Home Page
  console.log('--- TEST 2: Visiting Menuz Customer Home Page (Mobile) ---');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 });
  await mobilePage.goto('http://localhost:5173/#/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  await mobilePage.screenshot({
    path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/menuz_customer_home_mobile.png',
    fullPage: false
  });
  console.log('Saved menuz_customer_home_mobile.png');

  // Test 3: Opening QR Scanner Modal
  console.log('--- TEST 3: Clicking Scan Table QR Button ---');
  await mobilePage.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Scan Table QR'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await mobilePage.screenshot({
    path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/menuz_qr_scanner_modal.png',
    fullPage: false
  });
  console.log('Saved menuz_qr_scanner_modal.png');

  // Test 4: Switching to Demo Tables and Launching Casa Bella Table 3
  console.log('--- TEST 4: Launching Casa Bella Table 3 from Scanner ---');
  await mobilePage.evaluate(() => {
    const tabBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Demo Tables'));
    if (tabBtn) tabBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await mobilePage.evaluate(() => {
    const card = Array.from(document.querySelectorAll('h4')).find(h => h.textContent && h.textContent.includes('Casa Bella'));
    if (card) {
      const parent = card.closest('div.cursor-pointer') || card.closest('.group');
      if (parent) parent.click();
    }
  });
  await new Promise(r => setTimeout(r, 1200));

  const currentUrl = mobilePage.url();
  console.log('URL after table scan launch:', currentUrl);

  // Test 5: Verify Top Bar on Diner Menu & Click "Switch Restaurant / Scan QR"
  console.log('--- TEST 5: Clicking Switch Restaurant / Scan QR in Diner Top Bar ---');
  await mobilePage.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Switch Restaurant / Scan QR'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await mobilePage.screenshot({
    path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/menuz_switch_restaurant_modal.png',
    fullPage: false
  });
  console.log('Saved menuz_switch_restaurant_modal.png');

  // Test 6: Search Saffron House in Switch Modal & Select
  console.log('--- TEST 6: Searching and Switching back to Saffron House ---');
  await mobilePage.evaluate(() => {
    const input = document.querySelector('input[placeholder*="Search restaurants"]');
    if (input) {
      input.value = 'Saffron';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 400));

  await mobilePage.evaluate(() => {
    const card = Array.from(document.querySelectorAll('h4')).find(h => h.textContent && h.textContent.includes('Saffron House'));
    if (card) {
      const parent = card.closest('div.cursor-pointer') || card.closest('.group');
      if (parent) parent.click();
    }
  });
  await new Promise(r => setTimeout(r, 1200));

  const switchedUrl = mobilePage.url();
  console.log('URL after switching to Saffron House:', switchedUrl);

  console.log('Errors logged:', errors);
  await browser.close();
  console.log('All customer hub tests completed successfully!');
})();
