import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto('http://localhost:5173/#/r/saffron-house/menu?t=table-token-01-saffron', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await b.evaluate(el => el.textContent);
    if (text && text.includes('Win Surprise Reward')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: '/Users/siddhantwarde/.gemini/antigravity-ide/brain/8b04acd2-cb5b-4e0e-bbdb-e897af9c7ad5/surprise_reward_modal_open.png' });
  console.log('Saved surprise_reward_modal_open.png successfully');
  await browser.close();
})();
