// Local, read-only browser regression for the extended seafood platter and BBQ catalogue.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const origin = process.argv[2] || 'http://localhost:3011';
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) throw new Error('Local origin required');
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
const results = [];
try {
  for (const [locale, sharing, bbq] of [
    ['nl', 'Borrelbox klein (2–3 personen)', 'Visbarbecuepakket'],
    ['en', 'Small seafood sharing box (2–3 people)', 'Seafood barbecue pack'],
    ['de', 'Kleine Fisch-Snackbox (2–3 Personen)', 'Fisch-Grillpaket'],
  ]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${origin}/${locale}/visschalen`, { waitUntil: 'networkidle' });
    const main = page.locator('main');
    const card = main.locator('article').filter({ hasText: sharing });
    if (await card.count() !== 1) throw new Error(`${locale}: sharing box card missing`);
    await card.locator('img').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const image = [...document.querySelectorAll('article img')].find(img => img.alt.includes('sharing box') || img.alt.includes('Borrelbox') || img.alt.includes('Snackbox'));
      return image?.naturalWidth > 0;
    });
    await card.getByRole('button').click();
    if (!(await page.locator('aside').innerText()).includes('35,55')) throw new Error(`${locale}: selected price incorrect`);
    const width = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (width > 2) throw new Error(`${locale}: horizontal overflow ${width}px`);
    if (errors.length) throw new Error(`${locale}: ${errors.join('; ')}`);
    const assortment = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await assortment.goto(`${origin}/${locale}/assortiment`, { waitUntil: 'networkidle' });
    const bbqSection = assortment.locator('#barbecue-gourmet');
    if (await bbqSection.getByRole('heading', { name: bbq, exact: true }).count() !== 1) throw new Error(`${locale}: BBQ pack missing`);
    const whatsapp = bbqSection.locator('a[href*="wa.me"]');
    if (await whatsapp.count() !== 13) throw new Error(`${locale}: expected 13 BBQ WhatsApp links`);
    results.push({ locale, platterCards: await main.locator('article').count(), bbqCards: await bbqSection.locator('li').count(), whatsappLinks: await whatsapp.count(), selectedPrice: '€35,55', horizontalOverflow: width });
    await assortment.close();
    await page.close();
  }
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await mobile.goto(`${origin}/nl/visschalen`, { waitUntil: 'networkidle' });
  const mobileOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (mobileOverflow > 2) throw new Error(`Mobile horizontal overflow ${mobileOverflow}px`);
  results.push({ mobileOverflow });
  await mobile.close();
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
