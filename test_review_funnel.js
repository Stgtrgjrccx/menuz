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
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
      if (!msg.text().includes('AudioContext')) {
        errors.push(msg.text());
      }
    }
  });
  page.on('pageerror', (err) => {
    console.log('PAGE ERROR:', err.message);
    if (!err.message.includes('AudioContext')) {
      errors.push(err.message);
    }
  });

  console.log('--- TEST 1: Visiting Diner Menu ---');
  await page.goto('http://localhost:5173/#/r/saffron-house/menu?t=table-token-01-saffron', {
    waitUntil: 'networkidle0'
  });
  console.log('Diner Menu URL:', page.url());

  // Screenshot of customer page with new review banner
  await page.screenshot({
    path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/customer_review_banner.png'
  });
  console.log('Saved customer_review_banner.png');

  console.log('--- TEST 2: Opening Google Review & Win Modal ---');
  const buttons = await page.$$('button');
  let clicked = false;
  for (const b of buttons) {
    const text = await b.evaluate((el) => el.textContent);
    if (text && text.includes('Google Review & Win Rewards')) {
      await b.click();
      clicked = true;
      break;
    }
  }

  if (!clicked) {
    for (const b of buttons) {
      const text = await b.evaluate((el) => el.textContent);
      if (text && text.includes('Draft AI Review')) {
        await b.click();
        clicked = true;
        break;
      }
    }
  }

  await new Promise((r) => setTimeout(r, 800));

  // Check modal contents
  const modalHeader = await page.$eval('h3', (el) => el.textContent);
  console.log('Modal Header:', modalHeader);

  // Take screenshot of AI Review Draft generator
  await page.screenshot({
    path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/ai_review_generator_modal.png'
  });
  console.log('Saved ai_review_generator_modal.png');

  // Verify draft textarea is populated
  const draftText = await page.$eval('textarea', (el) => el.value);
  console.log('Generated AI Draft:', draftText.slice(0, 100) + '...');

  console.log('--- TEST 3: Testing Tone Switching & Regeneration ---');
  // Click Foodie tone
  const toneButtons = await page.$$('button');
  for (const b of toneButtons) {
    const text = await b.evaluate((el) => el.textContent);
    if (text && text.includes('Foodie')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 400));
  const foodieDraft = await page.$eval('textarea', (el) => el.value);
  console.log('Foodie Tone Draft:', foodieDraft.slice(0, 100) + '...');

  // Click Regenerate
  for (const b of toneButtons) {
    const text = await b.evaluate((el) => el.textContent);
    if (text && text.includes('Regenerate')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 400));
  const regenDraft = await page.$eval('textarea', (el) => el.value);
  console.log('Regenerated Draft:', regenDraft.slice(0, 100) + '...');

  console.log('--- TEST 4: Copy Review & Advance to Lucky Wheel ---');
  // Click Copy & Open Google Maps
  let copyBtn = null;
  const currentButtons = await page.$$('button');
  for (const b of currentButtons) {
    const text = await b.evaluate((el) => el.textContent);
    if (text && text.includes('Copy Review & Open Google Maps')) {
      copyBtn = b;
      break;
    }
  }

  if (copyBtn) {
    // Intercept window.open
    await page.evaluate(() => {
      window.open = () => null;
    });
    await copyBtn.click();
    console.log('Clicked Copy Review & Open Google Maps button');
    await new Promise((r) => setTimeout(r, 1600));

    // Screenshot of Lucky Wheel unlocked
    await page.screenshot({
      path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/wheel_unlocked_after_review.png'
    });
    console.log('Saved wheel_unlocked_after_review.png');

    // Verify Wheel is active
    const wheelHeader = await page.$eval('h4', (el) => el.textContent);
    console.log('Wheel Header after review:', wheelHeader);

    // Click Tap to Spin
    const spinWheelButtons = await page.$$('button');
    for (const b of spinWheelButtons) {
      const text = await b.evaluate((el) => el.textContent);
      if (text && text.includes('TAP TO SPIN')) {
        await b.click();
        console.log('Clicked Tap to Spin!');
        break;
      }
    }

    console.log('Waiting for wheel to spin (5s)...');
    await new Promise((r) => setTimeout(r, 5200));

    await page.screenshot({
      path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/review_won_voucher.png'
    });
    console.log('Saved review_won_voucher.png');
  }

  console.log('--- TEST 5: Checking Master Admin Reviews Tab ---');
  await page.goto('http://localhost:5173/#/admin', { waitUntil: 'networkidle0' });
  // Click Reviews tab
  const adminTabs = await page.$$('button');
  for (const b of adminTabs) {
    const text = await b.evaluate((el) => el.textContent);
    if (text && text.includes('Reviews & Customer CRM')) {
      await b.click();
      console.log('Navigated to Reviews & Customer CRM in Admin');
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({
    path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/admin_reviews_crm_live.png'
  });
  console.log('Saved admin_reviews_crm_live.png');

  console.log('--- SUMMARY ---');
  console.log('Errors:', errors);
  console.log('Critical Errors Count:', errors.length);

  await browser.close();
}

run().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
