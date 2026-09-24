import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !msg.text().includes('AudioContext')) {
      errors.push(msg.text());
    }
  });

  console.log('1. Loading Diner Menu for Table 1...');
  await page.goto('http://localhost:5173/#/r/saffron-house/menu?t=table-token-01-saffron', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/simplified_customer_hero.png' });

  // Verify hero buttons
  const hasWinRewardBtn = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).some(b => b.textContent && b.textContent.includes('Win Surprise Reward'));
  });
  console.log('Has "Win Surprise Reward" button in hero:', hasWinRewardBtn);

  const hasTeaserCard = await page.evaluate(() => {
    return document.body.textContent.includes("Win Today's Surprise Table Reward!");
  });
  console.log('Has "Win Today\'s Surprise Table Reward!" teaser card:', hasTeaserCard);

  // Check if old "Fill 30-Sec Form" review section is gone
  const hasOldReviewWall = await page.evaluate(() => {
    return document.body.textContent.includes("Guest Reviews & Google Rating");
  });
  console.log('Is old redundant review wall removed?:', !hasOldReviewWall);

  // Check if outside page contains any "fill form" phrase
  const containsFillForm = await page.evaluate(() => {
    return document.body.textContent.toLowerCase().includes('fill form');
  });
  console.log('Does customer page contain any "fill form"?:', containsFillForm);

  // Click "Win Surprise Reward"
  console.log('2. Clicking "Win Surprise Reward" button...');
  const allButtons = await page.$$('button');
  for (const b of allButtons) {
    const text = await b.evaluate(el => el.textContent);
    if (text && text.includes('Win Surprise Reward')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/surprise_reward_modal_open.png' });

  // Test Below 4 Stars alert first
  console.log('3. Testing Below 4 Stars instant floor alert (selecting 2 stars)...');
  const starButtons = await page.$$('button[title*="Stars"]');
  console.log(`Found ${starButtons.length} star buttons`);
  if (starButtons.length >= 2) {
    await starButtons[1].click(); // 2 stars
    console.log('Clicked 2-star button');
  }
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/urgent_floor_alert_triggered.png' });

  const floorAlertDispatched = await page.evaluate(() => {
    return document.body.textContent.includes('Urgent Staff Intervention Dispatched');
  });
  console.log('Urgent Staff Intervention Dispatched screen shown:', floorAlertDispatched);

  // Check Manager Dashboard in same browser instance
  console.log('4. Checking Manager Dashboard for urgent red alert banner...');
  await page.goto('http://localhost:5173/#/manager', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/manager_urgent_red_alert_verified.png' });

  const managerHasUrgentBanner = await page.evaluate(() => {
    return document.body.textContent.includes('Urgent Guest Assistance Required') && document.body.textContent.includes('Rating < 4★');
  });
  console.log('Manager Hub displays high-priority pulsing red alert banner:', managerHasUrgentBanner);

  // Now test 5-star reward reveal
  console.log('5. Testing 5-star reward reveal...');
  await page.goto('http://localhost:5173/#/r/saffron-house/menu?t=table-token-01-saffron', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));

  const btns = await page.$$('button');
  for (const b of btns) {
    const text = await b.evaluate(el => el.textContent);
    if (text && text.includes('Win Surprise Reward')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));

  // Click "Reveal My Surprise Reward"
  const revealBtns = await page.$$('button');
  for (const b of revealBtns) {
    const text = await b.evaluate(el => el.textContent);
    if (text && text.includes('Reveal My Surprise Reward')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/surprise_reward_revealed.png' });

  const wonVoucher = await page.evaluate(() => {
    return document.body.textContent.includes('VOUCHER CODE') || document.body.textContent.includes('SAFFRON-WIN');
  });
  console.log('Voucher revealed successfully:', wonVoucher);

  console.log('Errors logged:', errors);
  await browser.close();
})();
