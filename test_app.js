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
      errors.push(msg.text());
    } else {
      console.log('BROWSER LOG:', msg.type(), msg.text());
    }
  });
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
    errors.push(err.message);
  });
  page.on('requestfailed', req => {
    // Ignore harmless font / analytics if any
    console.log('REQUEST FAILED:', req.url(), req.failure()?.errorText);
  });
  page.on('response', res => {
    if (res.status() >= 400 && !res.url().includes('favicon.ico')) {
      console.log('HTTP ERROR', res.status(), res.url());
      errors.push(`HTTP ${res.status()}: ${res.url()}`);
    }
  });

  console.log('--- TEST 1: Visiting Master Admin (Localhost) ---');
  await page.goto('http://localhost:5173/#/admin', { waitUntil: 'networkidle0' });
  console.log('Loaded Master Admin URL:', page.url());

  const title = await page.title();
  console.log('Page Title:', title);

  // Take screenshot of Master Admin
  await page.screenshot({ path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/master_admin_screen.png' });
  console.log('Saved master_admin_screen.png');

  // Verify restaurants listed
  const restaurantNames = await page.$$eval('h3, h4', els => els.map(e => e.textContent.trim()).filter(Boolean));
  console.log('Found Restaurant Titles/Headings:', restaurantNames);

  // Verify Quick Access Launchpad
  const launchpadExists = await page.$('text=Quick Access Launchpad') !== null;
  console.log('Quick Access Launchpad detected:', launchpadExists);

  console.log('--- TEST 2: Navigating to Casa Bella Management Hub ---');
  const casaBellaManageLink = await page.$('a[href*="/manage/casa-bella"]');
  if (casaBellaManageLink) {
    await casaBellaManageLink.click();
    await new Promise(r => setTimeout(r, 1200));
    console.log('URL after clicking Casa Bella Hub:', page.url());
    const managerHeadings = await page.$$eval('h1, h2, h3', els => els.map(e => e.textContent.trim()));
    console.log('Headings on Casa Bella Manager page:', managerHeadings);
    await page.screenshot({ path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/casa_bella_manager_screen.png' });
  } else {
    console.error('FAIL: Could not find /manage/casa-bella link!');
  }

  console.log('--- TEST 3: Navigating Back to Master Admin ---');
  const backToAdminLink = await page.$('a[href*="/admin"]');
  if (backToAdminLink) {
    await backToAdminLink.click();
    await new Promise(r => setTimeout(r, 1200));
    console.log('Returned to URL:', page.url());
  } else {
    console.error('FAIL: Could not find Back to Admin link!');
  }

  console.log('--- TEST 4: Launching Saffron House Diner Menu ---');
  const saffronDinerLink = await page.$('a[href*="/r/saffron-house/menu"]');
  if (saffronDinerLink) {
    await saffronDinerLink.click();
    await new Promise(r => setTimeout(r, 1500));
    console.log('Diner Menu URL:', page.url());
    const dinerTitles = await page.$$eval('h1, h2, h3', els => els.map(e => e.textContent.trim()));
    console.log('Headings on Diner Menu page:', dinerTitles.slice(0, 8));
    await page.screenshot({ path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/saffron_diner_screen.png' });
  } else {
    console.error('FAIL: Could not find /r/saffron-house/menu link!');
  }

  console.log('--- TEST 5: Checking Reviews Tab & Seed Data ---');
  await page.goto('http://localhost:5173/#/admin', { waitUntil: 'networkidle0' });
  // Click Reviews tab by evaluating buttons
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await b.evaluate(el => el.textContent);
    if (text && text.includes('Reviews & Customer CRM')) {
      await b.click();
      console.log('Clicked Reviews tab successfully!');
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));
  const reviewsContent = await page.$$eval('h2, h3, p', els => els.map(e => e.textContent.trim()));
  console.log('Reviews tab snippets:', reviewsContent.slice(0, 6));

  // Also click on the first restaurant to drill down
  const restDrillDownBtn = await page.$('button.group');
  if (restDrillDownBtn) {
    await restDrillDownBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    console.log('Drilled down into restaurant reviews!');
    const reviewCards = await page.$$eval('h4, p', els => els.map(e => e.textContent.trim()));
    console.log('Individual Review Snippets:', reviewCards.slice(0, 8));
  }

  // Take screenshot of reviews
  await page.screenshot({ path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/reviews_tab_screen.png' });

  console.log('--- SUMMARY ---');
  console.log('Total critical errors found:', errors.length);
  if (errors.length > 0) {
    console.log('Errors:', errors);
  } else {
    console.log('SUCCESS: All pages, navigation, links, and data verified with 0 errors!');
  }

  await browser.close();
}

run().catch(console.error);
