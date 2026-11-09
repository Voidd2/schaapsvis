/* eslint-disable @typescript-eslint/no-require-imports */
// Local-only admin UI checks; all member APIs are mocked and no emails are sent.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const origin = process.argv[2] || 'http://localhost:3011';
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) throw new Error('Local origin required');

const copy = {
  nl: { name: 'Teststudent', approve: 'Goedkeuren', saved: 'Beslissing opgeslagen', more: 'Meer adressen laden', consent: 'Toestemming gegeven', verify: 'Kortingspas controleren', code: 'Pascode', check: 'Controleren', holder: 'Pas staat op naam van', eligible: 'Geldig voor', wholeRange: 'het hele assortiment', invalid: 'Pas ongeldig of verlopen' },
  en: { name: 'Teststudent', approve: 'Approve', saved: 'Decision saved', more: 'Load more addresses', consent: 'Opted in', verify: 'Verify discount pass', code: 'Pass code', check: 'Verify', holder: 'Pass issued to', eligible: 'Eligible products', wholeRange: 'the entire range', invalid: 'Pass is invalid or expired' },
  de: { name: 'Teststudent', approve: 'Genehmigen', saved: 'Entscheidung gespeichert', more: 'Weitere Adressen laden', consent: 'Eingewilligt', verify: 'Rabattpass prüfen', code: 'Passcode', check: 'Prüfen', holder: 'Pass ausgestellt für', eligible: 'Gültig für', wholeRange: 'das gesamte Sortiment', invalid: 'Pass ungültig oder abgelaufen' },
};

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const outcomes = [];
  try {
    for (const locale of ['nl', 'en', 'de']) {
      const t = copy[locale];
      const unauthorized = await browser.newPage();
      await unauthorized.route('**/api/members/admin/student-applications', route => route.fulfill({ status: 403, json: { error: 'forbidden' } }));
      await unauthorized.goto(`${origin}/${locale}/beheer/studenten`, { waitUntil: 'networkidle' });
      await unauthorized.getByRole('alert').filter({ has: unauthorized.locator('a[href$="/beheer/start"]') }).waitFor();
      assert.equal(await unauthorized.getByRole('heading', { name: t.name }).count(), 0, `${locale}: unauthorized administrator sees no application data`);
      await unauthorized.route('**/api/members/admin/email-addresses', route => route.fulfill({ status: 403, json: { error: 'forbidden' } }));
      await unauthorized.goto(`${origin}/${locale}/beheer/emaildeals`, { waitUntil: 'networkidle' });
      assert.equal(new URL(unauthorized.url()).pathname, `/${locale}/beheer/emailadressen`);
      await unauthorized.locator('section p[role="status"]').filter({ hasText: /beheeraccount|admin account|Administrator/ }).waitFor();
      assert.equal(await unauthorized.locator('table').count(), 0, `${locale}: unauthorized visitor sees no addresses`);
      await unauthorized.close();

      const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
      await page.addInitScript(() => localStorage.setItem('sv-analytics-consent-v1', 'declined'));
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      let decided = false;
      await page.route('**/api/members/admin/student-applications', route => route.fulfill({ json: {
        applications: decided ? [] : [{ id: 'application-1', institution: 'Hogeschool Leiden', education_level: 'hbo', submitted_at: '2026-10-18T10:00:00.000Z', full_name: t.name, email: 'student@example.test' }],
      } }));
      await page.route('**/api/members/admin/student-applications/application-1/decision', async route => {
        assert.equal(route.request().method(), 'POST');
        const payload = route.request().postDataJSON();
        assert.equal(payload.decision, 'approved');
        decided = true;
        await route.fulfill({ json: { proofDeleted: true } });
      });
      let passIsValid = true;
      await page.route('**/api/members/admin/pass/verify', async route => {
        assert.equal(route.request().method(), 'POST');
        await route.fulfill({ json: passIsValid ? { valid: true, name: 'Teststudent', discountPercent: 10, eligibleProducts: ['assortiment'] } : { valid: false } });
      });
      await page.goto(`${origin}/${locale}/beheer/studenten`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: t.name }).waitFor();
      await page.getByRole('button', { name: t.approve }).click();
      await page.getByRole('status').filter({ hasText: t.saved }).waitFor();
      assert.equal(await page.getByRole('heading', { name: t.name }).count(), 0, `${locale}: decided application removed from queue`);
      const passForm = page.locator('form').filter({ has: page.getByRole('heading', { name: t.verify }) });
      await passForm.getByLabel(t.code).fill('valid-pass-code');
      await passForm.getByRole('button', { name: t.check }).click();
      await passForm.getByRole('status').filter({ hasText: t.name }).waitFor();
      const verifiedSummary = await passForm.getByRole('status').textContent();
      assert.ok(verifiedSummary?.includes(t.holder), `${locale}: valid pass shows holder`);
      assert.ok(verifiedSummary?.includes(t.eligible), `${locale}: valid pass shows eligibility label`);
      assert.ok(verifiedSummary?.includes(t.wholeRange), `${locale}: valid pass shows eligible range`);
      passIsValid = false;
      await passForm.getByLabel(t.code).fill('invalid-pass-code');
      assert.equal(await passForm.getByRole('status').count(), 0, `${locale}: changing the code clears old verification details`);
      await passForm.getByRole('button', { name: t.check }).click();
      const invalidSummary = await passForm.getByRole('status').textContent();
      assert.equal(invalidSummary, t.invalid, `${locale}: invalid pass shows no holder or product data`);

      await page.route('**/api/members/admin/email-addresses', async route => {
        assert.equal(route.request().method(), 'POST');
        const { after } = route.request().postDataJSON();
        const emails = after
          ? [{ email: 'two@example.test', marketing: 'unsubscribed' }]
          : [{ email: 'one@example.test', marketing: 'subscribed' }];
        await route.fulfill({ json: { emails, next: after ? null : 'one@example.test' } });
      });
      await page.goto(`${origin}/${locale}/beheer/emailadressen`, { waitUntil: 'networkidle' });
      await page.getByRole('row').filter({ hasText: 'one@example.test' }).getByText(t.consent).waitFor();
      await page.getByRole('button', { name: t.more }).click();
      await page.getByRole('cell', { name: 'two@example.test' }).waitFor();
      assert.deepEqual(errors, [], `${locale}: browser errors`);
      outcomes.push({ locale, studentDecision: 'approved and removed from pending queue', emailDirectory: 'guarded, paginated and consent labelled', browserErrors: errors.length });
      await page.close();
    }
    console.log(JSON.stringify(outcomes));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
