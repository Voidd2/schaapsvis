/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS matches the local Playwright checks. */
/* Local Cloudflare browser regression: no external requests or order submissions. */
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const url = new URL(process.argv[2] || "http://127.0.0.1:3518");
if (!["127.0.0.1", "localhost"].includes(url.hostname)) throw new Error("Use a local test site.");

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  try {
    const ctx = await browser.newContext({ viewport: { width: 456, height: 1136 } });
    await ctx.addInitScript(() => localStorage.setItem("sv-analytics-consent-v1", "declined"));
    const p = await ctx.newPage(), errors = [], forbidden = [];
    let editorial = true;
    p.on("pageerror", e => errors.push(e.message));
    await ctx.route("**/*", r => {
      const u = new URL(r.request().url());
      if (u.origin !== url.origin || r.request().method() !== "GET") return r.abort();
      if (/\/(?:Winkelwagen|RequestControls)-[^/]+\.js$/.test(u.pathname) ||
          (editorial && /\/(?:CatalogCart|mandje)-[^/]+\.js$/.test(u.pathname))) {
        forbidden.push(u.pathname);
        return r.abort("blockedbyclient");
      }
      return r.continue();
    });
    async function visit(route) {
      const res = await p.goto(new URL(route, url).href, { waitUntil: "networkidle" });
      assert.equal(res.status(), 200, route);
      assert.equal(await p.locator("main#inhoud h1").count(), 1, route);
      assert.equal(await p.locator("html#__next_error__").count(), 0);
    }
    for (const route of ["/nl", "/nl/viswinkel-leiden", "/nl/assortiment", "/nl/blog/welke-vis-voor-gourmet", "/en", "/de"]) {
      await visit(route);
      assert.equal(await p.locator(".catalog-cart-trigger").count(), 0);
      const menu = p.locator('button[aria-controls="mobile-navigation"]');
      await menu.click();
      assert.equal(await menu.getAttribute("aria-expanded"), "true", route);
      await menu.click();
    }
    editorial = false;
    await visit("/nl/visschalen");
    const slug = "visschotel-klein-3-5-pers";
    await p.locator('[data-catalog-card="' + slug + '"] .request-add').click();
    await visit("/nl/feestdagen");
    await p.locator(".catalog-cart-trigger").click();
    assert.ok(await p.locator("#catalog-cart").isVisible());
    assert.match(await p.locator('[data-cart-line="' + slug + '"]').innerText(), /73,50/);
    await p.keyboard.press("Escape");
    await visit("/nl/bestellen");
    await p.locator("header button").click();
    await p.keyboard.press("Escape");
    assert.deepEqual(errors, []);
    // The router may prefetch linked catalogues. Their blocked requests must
    // not prevent the current information page or its menu from working.
    assert.ok(!forbidden.some(path => /\/(?:Winkelwagen|RequestControls)-/.test(path)), "No obsolete shared shopping entry");
    console.log("Information pages hydrate; checkout opens; catalogue selection survives a route change.");

    // Exercise the *current* Cloudflare module failing, not just a stale URL.
    if (process.argv.includes("--cloudflare")) {
      const broken = await browser.newContext();
      const tab = await broken.newPage();
      let blocks = 0;
      await broken.route("**/*", r => {
        const u = new URL(r.request().url());
        if (u.origin !== url.origin || r.request().method() !== "GET") return r.abort();
        if (/\/Productkeuze-[^/]+\.js$/.test(u.pathname)) { blocks++; return r.abort("blockedbyclient"); }
        return r.continue();
      });
      for (const route of ["/nl/visschalen", "/nl/feestdagen", "/nl/feestdagen/" + slug + "?catalog=visschalen"]) {
        await tab.goto(new URL(route, url).href, { waitUntil: "networkidle" });
        await tab.getByRole("link", { name: /Telefonisch bestellen/ }).first().waitFor();
        assert.equal(await tab.locator("main h1").count(), 1);
        assert.equal(await tab.locator("html#__next_error__").count(), 0);
        assert.ok((await tab.locator("main").innerText()).includes("73,50"), route);
      }
      assert.ok(blocks > 0);
      console.log("Current Cloudflare product module blocked: both catalogues, product details, prices and telephone fallback still available.");
      await broken.close();
    }
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
