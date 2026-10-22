/* eslint-disable @typescript-eslint/no-require-imports */
// Local-only UI regression; API calls are intercepted and no account or proof is sent.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const origin = process.argv[2] || 'http://localhost:3011';
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) throw new Error('Local origin required');
const agreedTerms = {
  nl: ['Nederlandse en internationale studenten', 'Alleen kibbeling, haring, broodjes haring en drinken doen mee', 'studiejaar geldig', 'nieuw bewijs nodig'],
  en: ['Dutch and international students', 'It applies only to kibbeling, herring, herring sandwiches and drinks', 'one academic year', 'new proof is then required'],
  de: ['niederländische und internationale Studierende', 'Kibbeling, Hering, Heringsbrötchen und Getränke', 'Studienjahr gültig', 'neuer Nachweis erforderlich'],
};

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : { channel: 'chrome' }) });
  const results = [];
  try {
    for (const locale of ['nl', 'en', 'de']) {
      const guest = await browser.newPage();
      await guest.route('**/api/members/me', route => route.fulfill({ json: { user: null } }));
      await guest.goto(`${origin}/${locale}/account`, { waitUntil: 'networkidle' });
      await guest.getByRole('tab').nth(1).click();
      const marketing = guest.locator('input[name="marketingConsent"]');
      assert.equal(await marketing.count(), 1, `${locale}: optional email-offer consent`);
      assert.equal(await marketing.isChecked(), false, `${locale}: marketing consent starts unchecked`);
      assert.equal(await marketing.evaluate(input => input.required), false, `${locale}: marketing consent is optional`);
      await guest.close();

      const passView = await browser.newPage({ viewport: { width: 390, height: 844 } });
      const passUser = { id: 'local-pass-user', name: 'Student Example', email: 'student@example.test' };
      await passView.route('**/api/members/me', route => route.fulfill({ json: {
        user: passUser,
        studentApplication: { status: 'approved', education_level: 'hbo', institution: 'Hogeschool Leiden', submitted_at: '2026-10-18T10:00:00.000Z' },
        discountPass: { code: 'svpass.example', issuedAt: '2026-10-18T10:00:00.000Z', expiresAt: '2027-10-18T10:00:00.000Z' },
      } }));
      await passView.route('**/api/members/newsletter/start', route => route.fulfill({ json: { draftToken: 'local-newsletter-draft' } }));
      await passView.goto(`${origin}/${locale}/account`, { waitUntil: 'networkidle' });
      const passCode = passView.locator('code').filter({ hasText: 'svpass.example' });
      await passCode.waitFor();
      assert.equal(await passView.locator('a.fixed[aria-label]').count(), 0, `${locale}: floating WhatsApp button does not cover account pass`);
      const passBounds = await passCode.boundingBox();
      assert.ok(passBounds && passBounds.x >= 0 && passBounds.x + passBounds.width <= 390, `${locale}: pass code fits mobile width`);
      const footerColors = await passView.locator('footer').evaluate(footer => ({
        title: footer.querySelector('h2').classList.contains('text-white'),
        intro: footer.querySelector('h2 + p').classList.contains('text-slate-200'),
        email: footer.querySelector('input[name="email"]') !== null,
        button: footer.querySelector('button[type="submit"]').classList.contains('bg-white') && footer.querySelector('button[type="submit"]').classList.contains('text-slate-900'),
      }));
      assert.deepEqual(footerColors, { title: true, intro: true, email: true, button: true }, `${locale}: newsletter footer uses high-contrast text and button on the dark background`);
      await passView.locator('footer input[name="email"]').fill('newsletter@example.test');
      const newsletterNext = { nl: 'Verder', en: 'Continue', de: 'Weiter' }[locale];
      await passView.getByRole('button', { name: newsletterNext }).click();
      const newsletterConsent = passView.locator('footer input[name="consent"]');
      await newsletterConsent.waitFor();
      assert.equal(await newsletterConsent.evaluate(input => input.required), true, `${locale}: explicit newsletter consent is required to subscribe`);
      assert.equal(await newsletterConsent.evaluate(input => input.parentElement.classList.contains('text-slate-200')), true, `${locale}: newsletter consent remains readable on the dark footer`);
      await passView.close();

      const student = await browser.newPage();
      const user = { id: 'local-test-user', name: 'Test Student', email: 'student@example.test' };
      await student.route('**/api/members/me', route => route.fulfill({ json: { user, studentApplication: null } }));
      let proofRequest = '';
      await student.route('**/api/members/student-application', async route => {
        assert.equal(route.request().method(), 'POST', `${locale}: application uses POST`);
        proofRequest = route.request().postDataBuffer()?.toString('latin1') ?? '';
        await route.fulfill({ json: { ok: true } });
      });
      const failures = [];
      student.on('pageerror', error => failures.push(error.message));
      await student.goto(`${origin}/${locale}/account`, { waitUntil: 'networkidle' });
      const form = student.locator('form').filter({ has: student.locator('input[type="file"]') });
      await form.waitFor();
      const terms = await form.locator('div p').textContent();
      const normalizedTerms = (terms ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
      for (const term of agreedTerms[locale]) assert.ok(normalizedTerms.includes(term.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()), `${locale}: published student discount terms include "${term}"`);
      assert.equal(await form.locator('input[type="file"]').count(), 1, `${locale}: proof upload`);
      assert.equal(await form.locator('select[name="educationLevel"] option[value="mbo"]').count(), 1, `${locale}: MBO eligible`);
      assert.equal(await form.locator('select[name="educationLevel"] option[value="hbo"]').count(), 1, `${locale}: HBO eligible`);
      assert.equal(await form.locator('select[name="educationLevel"] option[value="wo"]').count(), 1, `${locale}: WO eligible`);
      assert.equal(await form.locator('input[name="studiesInLeiden"]').evaluate(input => input.required), true, `${locale}: Leiden study required`);
      assert.equal(await form.locator('input[name="proofConsent"]').evaluate(input => input.required), true, `${locale}: proof consent required`);
      await form.locator('input[name="institution"]').fill('Hogeschool Leiden');
      await form.locator('select[name="educationLevel"]').selectOption('mbo');
      await form.locator('input[name="studiesInLeiden"]').check();
      await form.locator('input[name="proofConsent"]').check();
      await form.locator('input[type="file"]').setInputFiles({ name: 'studiebewijs.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 local-only-test') });
      await form.locator('button[type="submit"]').click();
      await student.getByRole('status').last().waitFor();
      assert.ok(proofRequest.includes('name="proofConsent"') && proofRequest.includes('true'), `${locale}: proof-consent sent`);
      assert.ok(proofRequest.includes('name="studiesInLeiden"') && proofRequest.includes('true'), `${locale}: Leiden study confirmation sent`);
      assert.ok(proofRequest.includes('filename="studiebewijs.pdf"'), `${locale}: proof attached to request`);
      assert.deepEqual(failures, [], `${locale}: browser errors`);
      results.push({ locale, guestRegistration: 'optional email consent', studentApplication: 'required Leiden/MBO+ and proof consent; upload UI submits multipart', browserErrors: failures.length });
      await student.close();
    }
    console.log(JSON.stringify(results));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
