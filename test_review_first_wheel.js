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

  console.log('--- TEST 1: Opening Customer Diner Menu ---');
  await page.goto('http://localhost:5173/#/r/saffron-house/menu?t=table-token-01-saffron', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  console.log('--- TEST 2: Clicking Win Surprise Reward Button ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Win Surprise Reward'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Verify internal review generator is shown directly
  const hasReviewDraft = await page.evaluate(() => {
    const text = document.body.textContent || '';
    return text.includes('Ready Review for Google Maps') && text.includes('Copy & Post on Google Reviews');
  });
  console.log('Has internal review draft & Google review button:', hasReviewDraft);

  // Click Copy & Post on Google Reviews
  console.log('--- TEST 3: Clicking Copy & Post on Google Reviews ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Copy & Post on Google Reviews'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const hasVerificationPrompt = await page.evaluate(() => {
    const text = document.body.textContent || '';
    return text.includes('Did You Post Your Review on Google Maps?') && text.includes('I Posted My Review! Unlock Wheel');
  });
  console.log('Has post-review confirmation step:', hasVerificationPrompt);

  // Click "I Posted My Review! Unlock Wheel"
  console.log('--- TEST 4: Confirming Review Posted & Unlocking Wheel ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('I Posted My Review! Unlock Wheel'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const hasWheel = await page.evaluate(() => {
    const text = document.body.textContent || '';
    const hasCanvas = !!document.querySelector('canvas');
    return text.includes('Review Verified! Spin for Guaranteed Reward') && hasCanvas;
  });
  console.log('Has interactive Lucky Dining Wheel:', hasWheel);

  // Click "SPIN THE WHEEL NOW"
  console.log('--- TEST 5: Spinning the Wheel ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('SPIN THE WHEEL'));
    if (btn) btn.click();
  });

  // Wait 4.5 seconds for wheel spin animation to complete
  await new Promise(r => setTimeout(r, 4800));

  const rewardWonInfo = await page.evaluate(() => {
    const text = document.body.textContent || '';
    const hasWonTitle = text.includes('Congratulations Table 1!') && text.includes('You Won:');
    const hasPresentServerInstruction = text.includes('Present this screen to your server or at checkout to redeem immediately.');
    const hasVoucherCode = text.includes('VOUCHER CODE') || text.includes('SAFFRON-WIN-');
    return {
      hasWonTitle,
      hasPresentServerInstruction,
      hasVoucherCode // should be FALSE (user requested removal of code system)
    };
  });
  console.log('Reward Won screen info:', rewardWonInfo);

  // Close modal via "Return to Dining Menu"
  console.log('--- TEST 6: Closing Modal and Returning to Menu ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Return to Dining Menu'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Test Below 4 Stars alert
  console.log('--- TEST 7: Testing Below 4 Stars Instant Floor Alert ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Win Surprise Reward'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Click 2 stars
  await page.evaluate(() => {
    const starButtons = Array.from(document.querySelectorAll('button[title*="Stars"]'));
    if (starButtons.length >= 2) starButtons[1].click(); // 2 stars
  });
  await new Promise(r => setTimeout(r, 800));

  const floorAlertShown = await page.evaluate(() => {
    return document.body.textContent.includes('Urgent Staff Intervention Dispatched');
  });
  console.log('Urgent Staff Intervention Dispatched screen shown for < 4 stars:', floorAlertShown);

  // Check Manager Dashboard
  console.log('--- TEST 8: Checking Manager Dashboard for Urgent Alert Banner ---');
  await page.goto('http://localhost:5173/#/manager', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  const managerHasBanner = await page.evaluate(() => {
    return document.body.textContent.includes('Urgent Guest Assistance Required') && document.body.textContent.includes('Rating < 4★');
  });
  console.log('Manager Dashboard displays high-priority pulsing red alert banner:', managerHasBanner);

  console.log('Errors logged:', errors);
  await browser.close();
})();
