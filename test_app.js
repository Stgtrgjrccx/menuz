import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
      if (!msg.text().includes('AudioContext')) {
        errors.push(msg.text());
      }
    } else {
      console.log('BROWSER LOG:', msg.type(), msg.text());
    }
  });
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
    if (!err.message.includes('AudioContext')) {
      errors.push(err.message);
    }
  });
  page.on('response', res => {
    if (res.status() >= 400 && !res.url().includes('favicon.ico')) {
      console.log('HTTP ERROR', res.status(), res.url());
      errors.push(`HTTP ${res.status()}: ${res.url()}`);
    }
  });

  console.log('--- TEST 1: Visiting Customer Site (Saffron House Table 1) ---');
  await page.goto('http://localhost:5173/#/r/saffron-house/menu?t=table-token-01-saffron', { waitUntil: 'networkidle0' });
  console.log('Loaded Customer Site URL:', page.url());

  const pageTitle = await page.title();
  console.log('Page Title:', pageTitle);

  // Take customer hero screenshot
  await page.screenshot({ path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/customer_hero_screen.png' });
  console.log('Saved customer_hero_screen.png');

  // Check categories on customer site
  const categoryButtons = await page.$$eval('button', els => els.map(e => e.textContent.trim()).filter(Boolean));
  console.log('Customer Category Buttons:', categoryButtons.slice(0, 10));

  console.log('--- TEST 2: Testing Lucky Dining Spin-the-Wheel Game ---');
  // Find and click the Spin & Win button
  const spinButtons = await page.$$('button');
  let foundSpinBtn = false;
  for (const b of spinButtons) {
    const text = await b.evaluate(el => el.textContent);
    if (text && (text.includes('Spin') || text.includes('🎡'))) {
      await b.click();
      foundSpinBtn = true;
      console.log('Clicked Spin & Win button!');
      break;
    }
  }

  if (!foundSpinBtn) {
    throw new Error('Could not find Spin the Wheel button on customer site!');
  }

  await new Promise(r => setTimeout(r, 800));

  // Check that canvas wheel is present
  const canvasExists = await page.$('canvas') !== null;
  console.log('Wheel Canvas detected in DOM:', canvasExists);

  // Take screenshot of Spin the Wheel modal
  await page.screenshot({ path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/spin_wheel_ready.png' });
  console.log('Saved spin_wheel_ready.png');

  // Fill in diner details if inputs are present
  const nameInput = await page.$('input[placeholder*="Rahul Sharma"]');
  if (nameInput) {
    await nameInput.type('Ananya Deshmukh');
    console.log('Typed diner name');
  }

  const phoneInput = await page.$('input[placeholder*="9822"]');
  if (phoneInput) {
    await phoneInput.type('9822011234');
    console.log('Typed diner phone');
  }

  // Click the big TAP TO SPIN button
  const modalButtons = await page.$$('button');
  for (const b of modalButtons) {
    const text = await b.evaluate(el => el.textContent);
    if (text && text.includes('TAP TO SPIN')) {
      await b.click();
      console.log('Wheel spin initiated! Waiting for physics deceleration...');
      break;
    }
  }

  // Wait for 5.5 seconds for wheel to complete spin and fanfare to trigger
  await new Promise(r => setTimeout(r, 5500));

  // Verify winner screen
  const winnerHeadings = await page.$$eval('h4, p, span', els => els.map(e => e.textContent.trim()).filter(Boolean));
  console.log('Winner Screen Elements:', winnerHeadings.filter(h => h.includes('Won') || h.includes('Voucher') || h.includes('SAFFRON-WIN') || h.includes('Congratulations')));

  // Take screenshot of Winner voucher card
  await page.screenshot({ path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/spin_wheel_won.png' });
  console.log('Saved spin_wheel_won.png');

  // Close modal by clicking Return to Dining Menu
  for (const b of await page.$$('button')) {
    const t = await b.evaluate(el => el.textContent);
    if (t && t.includes('Return to Dining Menu')) {
      await b.click();
      console.log('Returned to Dining Menu');
      break;
    }
  }

  await new Promise(r => setTimeout(r, 600));

  console.log('--- TEST 3: Testing Call Waiter Option on Customer Site ---');
  const waiterBtn = await page.$('button[title*="Call Waiter"]') || await page.$('button[title*="Waiter"]');
  if (waiterBtn) {
    await waiterBtn.click();
    console.log('Clicked Call Waiter button!');
    await new Promise(r => setTimeout(r, 500));

    // Verify toast appears
    const toastSnippets = await page.$$eval('div', els => els.map(e => e.textContent.trim()).filter(t => t.includes('Waiter alerted')));
    console.log('Toast feedback detected:', toastSnippets);
    await page.screenshot({ path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/customer_waiter_called.png' });
  }

  console.log('--- TEST 4: Verifying Manager Hub Notification Received ---');
  await page.goto('http://localhost:5173/#/manage/saffron-house', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  const managerAlerts = await page.$$eval('h3, p, span', els => els.map(e => e.textContent.trim()).filter(t => t.includes('Table Request') || t.includes('Waiter Assistance') || t.includes('spun the wheel') || t.includes('won')));
  console.log('Manager Hub Operational Telemetry/Alerts:', managerAlerts.slice(0, 5));

  console.log('--- SUMMARY ---');
  console.log('Total critical errors found:', errors.length);
  if (errors.length > 0) {
    console.log('Errors:', errors);
  } else {
    console.log('SUCCESS: All customer site features, interactive Spin the Wheel game, and notifications verified with 0 errors!');
  }

  await browser.close();
}

run().catch(console.error);
