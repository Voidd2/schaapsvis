/* eslint-disable @typescript-eslint/no-require-imports */
// Local-only admin UI checks; all member APIs are mocked and no emails are sent.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const origin = process.argv[2] || 'http://localhost:3011';
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) throw new Error('Local origin required');

const copy = {
  nl: { name: 'Teststudent', approve: 'Goedkeuren', saved: 'Beslissing opgeslagen', subject: 'Onderwerp', body: 'Aanbieding en voorwaarden', create: 'Concept opslaan', send: 'Stuur naar ingeschreven klanten', queued: 'Campagne in de verzendwachtrij.', verify: 'Kortingspas controleren', code: 'Pascode', check: 'Controleren', holder: 'Pas staat op naam van', eligible: 'Geldig voor', products: ['kibbeling', 'haring', 'broodjes haring', 'drinken'], invalid: 'Pas ongeldig of verlopen' },
  en: { name: 'Teststudent', approve: 'Approve', saved: 'Decision saved', subject: 'Subject', body: 'Offer and terms', create: 'Save draft', send: 'Send to subscribed customers', queued: 'Campaign added to the send queue.', verify: 'Verify discount pass', code: 'Pass code', check: 'Verify', holder: 'Pass issued to', eligible: 'Eligible products', products: ['kibbeling', 'herring', 'herring sandwiches', 'drinks'], invalid: 'Pass is invalid or expired' },
  de: { name: 'Teststudent', approve: 'Genehmigen', saved: 'Entscheidung gespeichert', subject: 'Betreff', body: 'Angebot und Bedingungen', create: 'Entwurf speichern', send: 'An angemeldete Kunden senden', queued: 'Kampagne wurde zur Warteschlange hinzugefügt.', verify: 'Rabattpass prüfen', code: 'Passcode', check: 'Prüfen', holder: 'Pass ausgestellt für', eligible: 'Gültig für', products: ['Kibbeling', 'Hering', 'Heringsbrötchen', 'Getränke'], invalid: 'Pass ungültig oder abgelaufen' },
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
      await unauthorized.locator('p[role="alert"]').waitFor();
      assert.equal(await unauthorized.getByRole('heading', { name: t.name }).count(), 0, `${locale}: unauthorized administrator sees no application data`);
      await unauthorized.route('**/api/members/admin/newsletter-campaigns', route => route.fulfill({ status: 403, json: { error: 'forbidden' } }));
      await unauthorized.goto(`${origin}/${locale}/beheer/emaildeals`, { waitUntil: 'networkidle' });
      await unauthorized.locator('p[role="alert"]').waitFor();
      assert.equal(await unauthorized.locator('input[name="subject"]').count(), 0, `${locale}: unauthorized administrator cannot create campaigns`);
      await unauthorized.close();

      const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
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
        await route.fulfill({ json: passIsValid ? { valid: true, name: 'Teststudent', discountPercent: 10, eligibleProducts: ['kibbeling', 'haring', 'broodje-haring', 'drinks'] } : { valid: false } });
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
      for (const product of t.products) assert.ok(verifiedSummary?.includes(product), `${locale}: valid pass shows eligible product ${product}`);
      passIsValid = false;
      await passForm.getByLabel(t.code).fill('invalid-pass-code');
      assert.equal(await passForm.getByRole('status').count(), 0, `${locale}: changing the code clears old verification details`);
      await passForm.getByRole('button', { name: t.check }).click();
      const invalidSummary = await passForm.getByRole('status').textContent();
      assert.equal(invalidSummary, t.invalid, `${locale}: invalid pass shows no holder or product data`);

      let campaignStatus = 'draft';
      let campaignCreated = false;
      await page.route('**/api/members/admin/newsletter-campaigns', async route => {
        if (route.request().method() === 'POST') {
          const payload = route.request().postDataJSON();
          assert.ok(payload.subject && payload.body, `${locale}: campaign content submitted`);
          campaignCreated = true;
          await route.fulfill({ status: 201, json: { id: 'campaign-1', status: 'draft' } });
          return;
        }
        await route.fulfill({ json: { subscriberCount: 2, campaigns: campaignCreated ? [{ id: 'campaign-1', subject: 'Weekdeal', status: campaignStatus, recipient_count: 2, sent_count: 0, failed_count: 0, created_at: '2026-10-18T10:00:00.000Z' }] : [] } });
      });
      await page.route('**/api/members/admin/newsletter-campaigns/campaign-1/send', async route => {
        assert.equal(route.request().method(), 'POST');
        campaignStatus = 'queued';
        await route.fulfill({ status: 202, json: { status: 'queued' } });
      });
      await page.goto(`${origin}/${locale}/beheer/emaildeals`, { waitUntil: 'networkidle' });
      await page.locator('input[name="subject"]').fill('Weekdeal');
      await page.locator('textarea[name="body"]').fill('Deze week in de winkel.');
      await page.getByRole('button', { name: t.create }).click();
      await page.getByText('Weekdeal', { exact: true }).waitFor();
      page.once('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: t.send }).click();
      await page.getByRole('status').filter({ hasText: t.queued }).waitFor();
      assert.deepEqual(errors, [], `${locale}: browser errors`);
      outcomes.push({ locale, studentDecision: 'approved and removed from pending queue', emailCampaign: 'explicitly confirmed and queued', browserErrors: errors.length });
      await page.close();
    }
    console.log(JSON.stringify(outcomes));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
