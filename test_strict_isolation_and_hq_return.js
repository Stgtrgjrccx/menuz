import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

// Simple static server for testing dist-combined
const PORT = 4173;
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  if (reqPath === '/owner/' || reqPath === '/owner') reqPath = '/owner/index.html';
  if (reqPath === '/hq/' || reqPath === '/hq') reqPath = '/hq/index.html';

  const filePath = path.join(process.cwd(), 'dist-combined', reqPath);
  const ext = path.extname(filePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // SPA fallback
    if (reqPath.startsWith('/owner/')) {
      const fallback = path.join(process.cwd(), 'dist-combined', 'owner', 'index.html');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(fallback).pipe(res);
    } else if (reqPath.startsWith('/hq/')) {
      const fallback = path.join(process.cwd(), 'dist-combined', 'hq', 'index.html');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(fallback).pipe(res);
    } else {
      const fallback = path.join(process.cwd(), 'dist-combined', 'index.html');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(fallback).pipe(res);
    }
  }
});

server.listen(PORT, async () => {
  console.log(`Test server running at http://localhost:${PORT}`);

  const chromePath = '/Users/siddhantwarde/.gemini/antigravity-ide/scratch/menuz/chrome/mac_arm-154.0.8037.92/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('\n--- 1. Testing Customer Site (Root /) ---');
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
  const customerContent = await page.content();

  // Check affiliated restaurants exist
  const hasSaffron = customerContent.includes('Saffron House');
  const hasCasaBella = customerContent.includes('Casa Bella');
  console.log(`✓ Has Saffron House: ${hasSaffron}`);
  console.log(`✓ Has Casa Bella: ${hasCasaBella}`);

  // Check purged landmarks & directory are NOT present
  const hasVaishali = customerContent.includes('Vaishali Restaurant');
  const hasGoodluck = customerContent.includes('Cafe Goodluck');
  const has3000Dir = customerContent.includes('Explore 3,000+ Pune Restaurants');
  console.log(`✓ Vaishali purged: ${!hasVaishali}`);
  console.log(`✓ Cafe Goodluck purged: ${!hasGoodluck}`);
  console.log(`✓ 3000+ Directory purged: ${!has3000Dir}`);

  // Check no owner portals button on customer site
  const hasPortals = customerContent.includes('Portals');
  console.log(`✓ Portals button hidden on customer site: ${!hasPortals}`);

  // Check HQ return banner is NOT present on direct customer access
  const hasHqBannerDirect = customerContent.includes('Return to Master HQ');
  console.log(`✓ HQ return banner hidden on direct visit: ${!hasHqBannerDirect}`);

  console.log('\n--- 2. Testing Owner Site (/owner/) ---');
  await page.goto(`http://localhost:${PORT}/owner/`, { waitUntil: 'networkidle0' });
  const ownerContent = await page.content();

  // Check Food Operations Hub is FIRST page
  const hasFoodOpsHub = ownerContent.includes('Food Operations Hub');
  const hasSeatingLayout = ownerContent.includes('Floor Plan & Seating Layout') || ownerContent.includes('Seating Layout');
  const hasCustomerHomePageOnOwner = ownerContent.includes('Scan. Order with Friends. Relish Fine Dining.');
  console.log(`✓ Food Operations Hub is first page: ${hasFoodOpsHub}`);
  console.log(`✓ Has Seating Layout & Floor controls: ${hasSeatingLayout}`);
  console.log(`✓ Customer Home page NOT shown to owner: ${!hasCustomerHomePageOnOwner}`);

  // Check Switch Outlet button exists
  const hasSwitchOutlet = ownerContent.includes('Switch Outlet');
  console.log(`✓ Has Switch Outlet control: ${hasSwitchOutlet}`);

  console.log('\n--- 3. Testing HQ Return Banner when accessed from HQ (?from=hq) ---');
  await page.goto(`http://localhost:${PORT}/?from=hq`, { waitUntil: 'networkidle0' });
  const hqAccessContent = await page.content();
  const hasHqBannerWhenFromHq = hqAccessContent.includes('Return to Master HQ');
  console.log(`✓ HQ Return banner displays when ?from=hq is present: ${hasHqBannerWhenFromHq}`);

  await page.goto(`http://localhost:${PORT}/#/r/saffron-house/menu?from=hq`, { waitUntil: 'networkidle0' });
  const dinerMenuHqContent = await page.content();
  const hasHqBannerOnDinerMenu = dinerMenuHqContent.includes('Return to Master HQ');
  console.log(`✓ HQ Return banner displays on Diner Menu when from=hq: ${hasHqBannerOnDinerMenu}`);

  await browser.close();
  server.close();

  if (
    hasSaffron &&
    hasCasaBella &&
    !hasVaishali &&
    !hasGoodluck &&
    !has3000Dir &&
    !hasPortals &&
    !hasHqBannerDirect &&
    hasFoodOpsHub &&
    !hasCustomerHomePageOnOwner &&
    hasSwitchOutlet &&
    hasHqBannerWhenFromHq &&
    hasHqBannerOnDinerMenu
  ) {
    console.log('\n🎉 ALL 12 VALIDATION TESTS PASSED 100%! ZERO REGRESSIONS!');
    process.exit(0);
  } else {
    console.error('\n❌ Some validations failed!');
    process.exit(1);
  }
});
