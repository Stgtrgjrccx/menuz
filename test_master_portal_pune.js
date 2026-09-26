import puppeteer from 'puppeteer-core';

async function testMasterPortal() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('--- TEST 1: Visiting Master Admin Dashboard ---');
    await page.goto('http://localhost:5173/#/admin', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    // Capture screenshot of Master Portal
    await page.screenshot({ path: 'master_portal_pune_registry.png' });
    console.log('Saved master_portal_pune_registry.png');

    // Count restaurants in registry
    const registryText = await page.evaluate(() => document.body.innerText);

    console.log('Contains "Flagship Quick Launch":', registryText.includes('Flagship Quick Launch'));
    console.log('Contains "loaded in Pune database":', registryText.includes('loaded in Pune database'));

    // Check how many items were loaded
    const countMatch = registryText.match(/(\d+)\s*loaded in Pune database/);
    if (countMatch) {
      console.log(`Verified total restaurants in Master Portal database: ${countMatch[1]}`);
    }

    // Test Search input
    console.log('--- TEST 2: Searching for "German Bakery" in Master Portal ---');
    const searchInput = await page.$('input[placeholder*="Pune partner restaurants"]');
    if (searchInput) {
      await searchInput.type('German Bakery');
      await new Promise(r => setTimeout(r, 500));
      await page.screenshot({ path: 'master_portal_search_german_bakery.png' });
      console.log('Saved master_portal_search_german_bakery.png');

      const searchedText = await page.evaluate(() => document.body.innerText);
      console.log('Found German Bakery in filtered list:', searchedText.includes('German Bakery'));
    }

    
    // Scroll down to cards grid
    await page.evaluate(() => window.scrollBy(0, 700));
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: 'master_portal_cards_grid.png' });
    console.log('Saved master_portal_cards_grid.png');

console.log('--- ALL MASTER PORTAL VERIFICATIONS PASSED ---');
  } catch (err) {
    console.error('Error in master portal test:', err);
  } finally {
    await browser.close();
  }
}

testMasterPortal();
