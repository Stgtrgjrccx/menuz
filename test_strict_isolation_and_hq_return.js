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
  if (reqPath === '/customer/' || reqPath === '/customer') reqPath = '/customer/index.html';
  if (reqPath === '/owner/' || reqPath === '/owner') reqPath = '/owner/index.html';
  if (reqPath === '/restaurant/' || reqPath === '/restaurant') reqPath = '/restaurant/index.html';
  if (reqPath === '/hq/' || reqPath === '/hq') reqPath = '/hq/index.html';

  const filePath = path.join(process.cwd(), 'dist-combined', reqPath);
  const ext = path.extname(filePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // SPA fallback
    if (reqPath.startsWith('/customer/')) {
      const fallback = path.join(process.cwd(), 'dist-combined', 'customer', 'index.html');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(fallback).pipe(res);
    } else if (reqPath.startsWith('/owner/') || reqPath.startsWith('/restaurant/')) {
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

  const chromePath = '/Users/siddhantwarde/.cache/puppeteer/chrome/mac_arm-151.0.7922.47/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('\n--- 1. Testing Customer Site Isolation (Root / and /customer/) ---');
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1200));
  const customerContent = await page.content();

  // Check customer site opens Customer Discovery and NEVER Admin HQ
  const isCustomerNotAdmin = customerContent.includes('Scan. Order with Friends.') && !customerContent.includes('Master Admin Authorization');
  console.log(`✓ Customer link opens Customer Site (NOT Admin HQ): ${isCustomerNotAdmin}`);

  await page.goto(`http://localhost:${PORT}/customer/`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1200));
  const customerFolderContent = await page.content();
  const isCustomerFolderClean = customerFolderContent.includes('Scan. Order with Friends.') && !customerFolderContent.includes('Master Admin Authorization');
  console.log(`✓ /customer/ link opens Customer Site: ${isCustomerFolderClean}`);

  // Check affiliated restaurants exist
  const hasSaffron = customerContent.includes('Saffron House');
  const hasCasaBella = customerContent.includes('Casa Bella');
  console.log(`✓ Has Saffron House: ${hasSaffron}`);
  console.log(`✓ Has Casa Bella: ${hasCasaBella}`);

  // Check notifications button is REMOVED on customer page
  const hasNotifOnCustomer = customerContent.includes('System Notifications') || customerContent.includes('Live System Alerts');
  console.log(`✓ Notifications option completely removed from customer page: ${!hasNotifOnCustomer}`);

  console.log('\n--- 2. Testing Restaurant Page Lands Directly on Dashboard (NOT Menu) ---');
  await page.goto(`http://localhost:${PORT}/#/r/saffron-house`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1200));
  const restDirectContent = await page.content();

  // Must land on Manager Dashboard (Floor Plan, Food Operations, Active Sessions), NOT DinerMenu
  const landsOnDashboardDirect = restDirectContent.includes('Food Operations Hub') || restDirectContent.includes('Seating Layout') || restDirectContent.includes('Live Table Orders');
  const doesNotLandOnMenuDirect = !restDirectContent.includes('Multiplayer Table Cart') && !restDirectContent.includes('Join Table Cart');
  console.log(`✓ Opening /#/r/saffron-house lands directly on Dashboard: ${landsOnDashboardDirect}`);
  console.log(`✓ Does NOT land on menu page: ${doesNotLandOnMenuDirect}`);

  // Now REFRESH the page to test persistence on refresh
  console.log('Testing page REFRESH on /#/r/saffron-house ...');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1200));
  const refreshedContent = await page.content();
  const landsOnDashboardAfterRefresh = refreshedContent.includes('Food Operations Hub') || refreshedContent.includes('Seating Layout') || refreshedContent.includes('Live Table Orders');
  console.log(`✓ Refreshing /#/r/saffron-house STAYS on Dashboard: ${landsOnDashboardAfterRefresh}`);

  console.log('\n--- 3. Testing Diner Menu ONLY When Explicitly Requested (/menu) ---');
  await page.goto(`http://localhost:${PORT}/#/r/saffron-house/menu?t=table-token-01-saffron`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1200));
  const dinerMenuContent = await page.content();
  const hasTableArcadeBtn = dinerMenuContent.includes('Table Arcade');
  console.log(`✓ Table QR route opens Diner Menu: ${hasTableArcadeBtn}`);

  console.log('\n--- 4. Testing Dedicated Owner Portal (/owner/ & /restaurant/) ---');
  await page.goto(`http://localhost:${PORT}/owner/`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1200));
  const ownerContent = await page.content();
  const hasFoodOpsHub = ownerContent.includes('Food Operations Hub');
  console.log(`✓ Food Operations Hub is first page on /owner/: ${hasFoodOpsHub}`);

  await page.goto(`http://localhost:${PORT}/restaurant/#/r/saffron-house`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1200));
  const restPortalContent = await page.content();
  const restPortalOnDashboard = restPortalContent.includes('Food Operations Hub') || restPortalContent.includes('Seating Layout');
  console.log(`✓ /restaurant/#/r/saffron-house lands on Dashboard: ${restPortalOnDashboard}`);

  console.log('\n--- 5. Testing Master HQ Portal (/hq/) ---');
  await page.goto(`http://localhost:${PORT}/hq/`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1200));
  const hqAuthContent = await page.content();
  const hasHqPasscodeInput = hqAuthContent.includes('Master Admin Authorization') || hqAuthContent.includes('type="password"');
  console.log(`✓ /hq/ strictly opens Master Admin portal: ${hasHqPasscodeInput}`);

  // Unlock HQ
  const passInput = await page.$('input[type="password"]');
  if (passInput) {
    await page.type('input[type="password"]', 'menuz2026');
    await page.keyboard.press('Enter');
    await new Promise((r) => setTimeout(r, 800));
  }
  const hqContent = await page.content();
  const hasCustomerSiteLinkInHq = hqContent.includes('Customer Site');
  console.log(`✓ HQ Site has Customer Site access link: ${hasCustomerSiteLinkInHq}`);

  await browser.close();
  server.close();

  if (
    isCustomerNotAdmin &&
    isCustomerFolderClean &&
    hasSaffron &&
    hasCasaBella &&
    !hasNotifOnCustomer &&
    landsOnDashboardDirect &&
    doesNotLandOnMenuDirect &&
    landsOnDashboardAfterRefresh &&
    hasTableArcadeBtn &&
    hasFoodOpsHub &&
    restPortalOnDashboard &&
    hasHqPasscodeInput &&
    hasCustomerSiteLinkInHq
  ) {
    console.log('\n🎉 ALL RIGOROUS ROUTING & ISOLATION TESTS PASSED 100%!');
    process.exit(0);
  } else {
    console.error('\n❌ Some validations failed!');
    process.exit(1);
  }
});
