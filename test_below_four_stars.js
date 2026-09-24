import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 950 });

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !msg.text().includes('AudioContext')) {
      console.log('BROWSER ERROR:', msg.text());
      errors.push(msg.text());
    }
  });

  console.log('--- TEST 1: Visiting Customer Site with Streamlined Reward Banner ---');
  await page.goto('http://localhost:5173/#/r/saffron-house/menu?t=table-token-01-saffron', {
    waitUntil: 'networkidle0'
  });

  // Verify single Fill Form banner is visible
  const bannerText = await page.$eval('main', () => {
    const el = document.querySelector('button');
    return el ? el.textContent : '';
  });
  console.log('Loaded Diner Page. Taking banner screenshot...');
  await page.screenshot({
    path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/streamlined_reward_banner.png'
  });
  console.log('Saved streamlined_reward_banner.png');

  console.log('--- TEST 2: Clicking Fill Form & Opening Modal ---');
  const allButtons = await page.$$('button');
  for (const b of allButtons) {
    const text = await b.evaluate((el) => el.textContent);
    if (text && text.includes('Fill Form to Win')) {
      await b.click();
      console.log('Clicked Fill Form button:', text);
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 600));

  // Take screenshot of Intriguing Reward Form
  await page.screenshot({
    path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/intriguing_form_modal.png'
  });
  console.log('Saved intriguing_form_modal.png');

  console.log('--- TEST 3: Selecting Below 4 Stars (2 Stars) -> Immediate Team Alert ---');
  // Click on the 2nd star button
  const starButtons = await page.$$('button[title*="Stars"]');
  console.log(`Found ${starButtons.length} star buttons`);
  if (starButtons.length >= 2) {
    await starButtons[1].click(); // Click 2nd star (2 Stars)
    console.log('Clicked 2 Stars (Below 4 stars)');
  }

  await new Promise((r) => setTimeout(r, 700));

  // Verify modal switched to immediate floor assistance mode
  await page.screenshot({
    path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/urgent_floor_alert_modal.png'
  });
  console.log('Saved urgent_floor_alert_modal.png');

  // Select issue chip: Food taste / temperature
  const modalButtons = await page.$$('button');
  for (const b of modalButtons) {
    const text = await b.evaluate((el) => el.textContent);
    if (text && text.includes('Food taste')) {
      await b.click();
      console.log('Selected issue: Food taste / temperature');
      break;
    }
  }

  // Type note for manager
  const textareas = await page.$$('textarea');
  if (textareas.length > 0) {
    await textareas[0].type('Dal Makhani was lukewarm, need a fresh warm bowl.');
  }

  // Click Send Manager to Table Now
  const currentModalBtns = await page.$$('button');
  for (const b of currentModalBtns) {
    const text = await b.evaluate((el) => el.textContent);
    if (text && text.includes('Send Manager to Table')) {
      await b.click();
      console.log('Clicked Send Manager to Table Now');
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 900));

  // Screenshot of Manager Dispatched Confirmation
  await page.screenshot({
    path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/manager_dispatched_screen.png'
  });
  console.log('Saved manager_dispatched_screen.png');

  console.log('--- TEST 4: Checking Manager Dashboard for Urgent Alert Banner ---');
  await page.goto('http://localhost:5173/#/manage/saffron-house', {
    waitUntil: 'networkidle0'
  });

  await new Promise((r) => setTimeout(r, 1000));

  // Verify urgent red alert banner
  const headings = await page.$$eval('h3', (els) => els.map((e) => e.textContent));
  console.log('Manager Dashboard Headings:', headings);

  await page.screenshot({
    path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/manager_urgent_red_alert_banner.png'
  });
  console.log('Saved manager_urgent_red_alert_banner.png');

  console.log('--- TEST 5: Testing 5-Star Instant Mystery Reward Flow ---');
  await page.goto('http://localhost:5173/#/r/saffron-house/menu?t=table-token-01-saffron', {
    waitUntil: 'networkidle0'
  });

  // Click Fill Form button
  const dinerBtns = await page.$$('button');
  for (const b of dinerBtns) {
    const text = await b.evaluate((el) => el.textContent);
    if (text && text.includes('Fill Form to Win')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));

  // Fill diner name & phone
  const inputs = await page.$$('input[type="text"], input[type="tel"]');
  if (inputs.length >= 2) {
    await inputs[0].type('Pooja Nair');
    await inputs[1].type('98220 54321');
  }

  // Click Submit & Reveal Reward
  const formBtns = await page.$$('button');
  for (const b of formBtns) {
    const text = await b.evaluate((el) => el.textContent);
    if (text && text.includes('Submit & Reveal My Reward')) {
      await b.click();
      console.log('Clicked Submit & Reveal My Reward!');
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 1200));

  await page.screenshot({
    path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/mystery_reward_revealed_voucher.png'
  });
  console.log('Saved mystery_reward_revealed_voucher.png');

  console.log('--- TEST RESULTS ---');
  console.log('Total Critical Errors:', errors.length);
  await browser.close();
}

run().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
