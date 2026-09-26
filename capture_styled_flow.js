import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/#/r/saffron-house/menu?t=table-token-01-saffron', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Step 1: Open modal (Rate & Keywords)
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Win Surprise Reward'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/customer_step1_review_builder.png',
    fullPage: false
  });

  // Step 2: Click Copy & Post on Google Reviews
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Copy & Post on Google Reviews'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/customer_step2_verification_gate.png',
    fullPage: false
  });

  // Step 3: Confirm Review Posted -> Unlock Wheel
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('I Posted My Review! Unlock Wheel'));
    if (btn) btn.click();
  });
  // Wait for step === 'wheel' to be active
  await page.waitForFunction(() => document.body.textContent.includes('SPIN THE WHEEL NOW'), { timeout: 5000 });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/customer_step3_lucky_wheel.png',
    fullPage: false
  });

  // Step 4: Spin the wheel
  await page.evaluate(() => {
    const spinBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('SPIN THE WHEEL NOW'));
    if (spinBtn) spinBtn.click();
  });
  // Wait for wheel animation (4000ms) and reward won screen
  await page.waitForFunction(() => document.body.textContent.includes('Congratulations Table 1!'), { timeout: 10000 });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/customer_step4_reward_won.png',
    fullPage: false
  });

  await browser.close();
  console.log('All customer flow screenshots successfully captured!');
})();
