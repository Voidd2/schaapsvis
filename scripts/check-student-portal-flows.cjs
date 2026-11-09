/* eslint-disable @typescript-eslint/no-require-imports */
// UI acceptance. Every API request is intercepted; no mail or account is sent.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const jsQR = require('jsqr');
const fs = require('node:fs/promises');
const path = require('node:path');
const origin = process.argv[2] || 'http://127.0.0.1:3038';
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin) && !(process.env.STUDENT_TEST_LIVE_READONLY === '1' && origin === 'https://schaapsvishandel.nl')) throw new Error('Local origin or explicitly enabled read-only production assets required');
const output = process.env.STUDENT_TEST_OUTPUT;
const user = { id: 'local-student', name: 'Test Student', email: 'student@example.test' };
const application = { status: 'approved', education_level: 'mbo', institution: 'Test school', study_city: 'Utrecht', submitted_at: '2026-11-01T10:00:00Z' };
const pass = { displayCode: 'SV-TEST12', issuedAt: '2026-11-01T10:00:00Z', expiresAt: '2027-11-01T10:00:00Z' };
const qrPayload = Buffer.from(JSON.stringify({ p: '11111111-2222-4333-8444-555555555555', e: 1800000000000, n: 'aBcDeFgHiJkL' })).toString('base64url');
const qrToken = `SVQ1.${qrPayload}.${'a'.repeat(43)}`;
(async () => {
 const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : { channel: 'chrome' }) });
 const results = [];
 if (output) await fs.mkdir(output, { recursive: true });
 try {
  for (const locale of ['nl', 'en', 'de']) for (const width of [390, 1440]) {
   const context = await browser.newContext({ viewport: { width, height: 900 } });
   if (origin.startsWith('http:') && process.env.STUDENT_TEST_SITE_TOKEN) await context.addCookies([{ name: 'sv_access', value: process.env.STUDENT_TEST_SITE_TOKEN, url: origin }]);
   const page = await context.newPage(), errors = [], unexpected = [], posts = [];
   let state = { user: null };
   page.on('pageerror', e => errors.push(e.message));
   await context.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url()), endpoint = url.pathname;
    if (url.origin !== origin) return route.abort();
    if (endpoint.startsWith('/api/')) {
     if (endpoint === '/api/members/me') return route.fulfill({ status: state.user ? 200 : 401, json: state });
     if (endpoint === '/api/members/pass/qr') return route.fulfill({ json: { value: qrToken } });
     if (request.method() === 'POST') {
      posts.push({ endpoint, body: request.postData() });
      if (endpoint === '/api/members/register') return route.fulfill({ json: { ok: true } });
      if (endpoint === '/api/members/verify-codes') { state = { user, studentApplication: null }; return route.fulfill({ json: { ok: true } }); }
      if (endpoint === '/api/members/student-application') { state = { user, studentApplication: { ...application, status: 'pending' } }; return route.fulfill({ json: { ok: true } }); }
      if (endpoint === '/api/members/logout') { state = { user: null }; return route.fulfill({ json: { ok: true } }); }
      if (endpoint === '/api/members/newsletter/start') return route.fulfill({ json: { draftToken: 'local-draft' } });
     }
     unexpected.push(`${request.method()} ${endpoint}`);
     return route.fulfill({ status: 501, json: { error: 'unmocked-request' } });
    }
    if (!['GET', 'HEAD'].includes(request.method())) { unexpected.push(request.method()); return route.abort(); }
    return route.continue();
   });
   await page.goto(`${origin}/${locale}/account`, { waitUntil: 'networkidle' });
   await page.getByRole('tab').nth(1).click();
   const registration = page.locator('form').filter({ has: page.locator('input[name="firstName"]') });
   const consent = registration.locator('input[name="marketingConsent"]');
   assert.equal(await consent.isChecked(), false); assert.equal(await consent.evaluate(e => e.required), false);
   for (const [name, value] of Object.entries({ firstName: 'Test', lastName: 'Student', email: user.email, schoolEmail: 'student@school.example.test', password: 'local-test-password-only' })) await registration.locator(`input[name="${name}"]`).fill(value);
   await consent.check(); await registration.locator('button[type="submit"]').click();
   const verification = page.locator('form').filter({ has: page.locator('input[name="personalCode"]') });
   await verification.locator('input[name="personalCode"]').fill('123456');
   await verification.locator('input[name="schoolCode"]').fill('654321'); await verification.locator('button').click();
   const form = page.locator('form').filter({ has: page.locator('input[name="studyCity"]') }); await form.waitFor();
   assert.equal(new URL(page.url()).pathname, `/${locale}/account`, 'No login redirect after verification');
   assert.equal(await page.locator('input[type="file"],input[name="studiesInLeiden"],input[name="proofConsent"]').count(), 0);
   assert.equal(await form.locator('input[name="studyCity"]').evaluate(e => e.required), true);
   for (const level of ['mbo', 'hbo', 'wo']) assert.equal(await form.locator(`option[value="${level}"]`).count(), 1);
   await form.locator('input[name="institution"]').fill('Test school'); await form.locator('input[name="studyCity"]').fill('Utrecht');
   await form.locator('select[name="educationLevel"]').selectOption('mbo'); await form.locator('button[type="submit"]').click();
   await form.waitFor({ state: 'detached' });
   const submitted = posts.find(p => p.endpoint.endsWith('/student-application')).body;
   assert.match(submitted, /name="studyCity"\r\n\r\nUtrecht/); assert.doesNotMatch(submitted, /filename=|proofConsent|studiesInLeiden/);
   assert.deepEqual(posts.slice(0, 3).map(p => p.endpoint), ['/api/members/register', '/api/members/verify-codes', '/api/members/student-application']);
   const payload = JSON.parse(posts[0].body); assert.equal(payload.firstName, 'Test'); assert.equal(payload.lastName, 'Student'); assert.equal(payload.marketingConsent, true);
   state = { user, studentApplication: application, discountPass: pass, wallet: { apple: { available: false }, google: { available: false } } };
   await page.reload({ waitUntil: 'networkidle' });
   await page.locator('code').filter({ hasText: pass.displayCode }).waitFor(); await page.locator('main svg[role="img"]').waitFor();
   const logo = page.locator('main img[alt="Schaap\'s Vis"]'); await logo.evaluate(e => e.decode());
   assert.equal(await page.locator('form[action*="/wallet/"]').count(), 0, 'Deferred Wallet buttons hidden');
   assert.equal(await page.locator('a.fixed[aria-label]').count(), 0);
   assert.ok((await page.locator('main').innerText()).includes(user.name));
   assert.doesNotMatch(await page.locator('main').innerText(), /SVQ1\.|svpass\.|spaarpunten|loyalty points|Treuepunkte/);
   const bounds = await logo.boundingBox(); assert.equal(bounds.width, bounds.height); assert.ok(bounds.width >= 64 && bounds.width <= 72);
   assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
   const pixels = await page.locator('main svg[role="img"]').evaluate(async svg => {
    const image = new Image();
    const source = svg.cloneNode(true); source.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(source)], { type: 'image/svg+xml' }));
    try {
     image.src = url; await image.decode();
     const canvas = document.createElement('canvas'); canvas.width = canvas.height = 192;
     const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0, 192, 192);
     return Array.from(ctx.getImageData(0, 0, 192, 192).data);
    } finally { URL.revokeObjectURL(url); }
   });
   assert.equal(jsQR(new Uint8ClampedArray(pixels), 192, 192)?.data, qrToken, 'Rendered SVG decodes to complete token');
   const reject = page.getByRole('button', { name: { nl: 'Weigeren', en: 'Reject', de: 'Ablehnen' }[locale], exact: true });
   if (await reject.count()) await reject.click();
   await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
   if (output) await page.screenshot({ path: path.join(output, `student-pass-${locale}-${width}.png`), fullPage: true });
   const newsletterPanel = page.locator('footer details').filter({ has: page.locator('input[name="email"]') });
   if (!(await newsletterPanel.evaluate(panel => panel.open))) await newsletterPanel.locator('summary').click();
   await page.locator('footer input[name="email"]').fill('newsletter@example.test'); await page.locator('footer button[type="submit"]').click();
   const newsletterConsent = page.locator('footer input[name="consent"]'); await newsletterConsent.waitFor();
   assert.equal(await newsletterConsent.evaluate(e => e.required), true); assert.equal(await newsletterConsent.isChecked(), false);
   state = { user, studentApplication: application, discountPass: null, inactivePass: { ...pass, status: 'suspended' } };
   await page.reload({ waitUntil: 'networkidle' });
   const blockedText = { nl: 'Uw studentenpas is tijdelijk geblokkeerd', en: 'Your student pass is temporarily blocked', de: 'Ihr Studentenpass ist vorübergehend gesperrt' }[locale];
   await page.getByText(blockedText, { exact: false }).waitFor();
   assert.equal(await page.locator('input[name="studyCity"]').count(), 0, 'Blocked student must not be invited to reapply');
   assert.equal(await page.locator('main svg[role="img"]').count(), 0, 'Blocked pass must not show a QR');
   assert.doesNotMatch(await page.locator('main').innerText(), /Uw studentenpas is verlopen|Your student pass has expired|Ihr Studentenpass ist abgelaufen/);
   assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
   if (output) await page.screenshot({ path: path.join(output, `student-suspended-${locale}-${width}.png`), fullPage: true });
   state = { ...state, inactivePass: { ...pass, status: 'expired' } };
   await page.reload({ waitUntil: 'networkidle' });
   await page.locator('input[name="studyCity"]').waitFor();
   assert.match(await page.locator('main').innerText(), /Uw studentenpas is verlopen|Your student pass has expired|Ihr Studentenpass ist abgelaufen/);
   await page.getByRole('button', { name: { nl: 'Uitloggen', en: 'Log out', de: 'Abmelden' }[locale], exact: true }).click();
   await page.getByRole('tab').first().waitFor();
   assert.deepEqual(unexpected, []); assert.deepEqual(errors, []);
   results.push({ locale, width, registration: 'separate names; optional offers', verification: 'automatic login; same page', application: 'Utrecht/MBO; no upload', pass: 'name, original logo, short code, QR', suspended: 'correct explanation; no application or QR; no overflow', expired: 'renewal remains available', wallet: 'hidden', logout: 'passed', realSubmissions: 0 });
   await context.close();
  }
  if (output) await fs.writeFile(path.join(output, 'student-portal-acceptance.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results));
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
