import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Mobile View
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 });
  await mobilePage.goto('http://localhost:5173/#/r/saffron-house/menu?t=table-token-01-saffron', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await mobilePage.screenshot({
    path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/customer_website_mobile.png',
    fullPage: false
  });
  console.log('Mobile customer website captured.');

  // Desktop View
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  await desktopPage.goto('http://localhost:5173/#/r/saffron-house/menu?t=table-token-01-saffron', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await desktopPage.screenshot({
    path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/customer_website_desktop.png',
    fullPage: false
  });
  console.log('Desktop customer website captured.');

  await browser.close();
})();
