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
      if (/\/Winkelwagen-[^/]+\.js$/.test(u.pathname) ||
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
    assert.deepEqual(forbidden, [], "The blocked basket script should never be needed");
    console.log("Information pages hydrate; checkout opens; catalogue selection survives a route change.");
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
