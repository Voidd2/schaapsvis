/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS matches the local Playwright checks. */
/* Local Cloudflare browser regression: no external requests or order submissions. */
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const url = new URL(process.argv[2] || "http://127.0.0.1:3518");
if (!["127.0.0.1", "localhost"].includes(url.hostname)) throw new Error("Use a local test site.");

async function verifyComposers(ctx, tab) {
  await tab.goto(new URL("/nl/visschalen",url).href);
  async function review(panel, expected) {
    const opened = ctx.waitForEvent("page");
    await panel.getByRole("button", {name:/WhatsApp-concept/}).click();
    const result = await opened;
    const href = await result.getByRole("link",{name:"Open WhatsApp"}).getAttribute("href");
    const link = new URL(href);
    assert.equal(link.origin + link.pathname,"https://wa.me/31624811678");
    const message = link.searchParams.get("text");
    for (const part of expected) assert.ok(message.includes(part), part);
    await result.close();
  }
  async function openPanel(locator) {
    const panel = locator.locator("details.native-composer:visible").first();
    await panel.locator("summary").waitFor();
    if (await panel.getAttribute("open") === null) await panel.locator("summary").click();
    return panel;
  }
  await tab.locator('a[href="#gourmet-keuzes"]').click();
  const gourmet = tab.locator("#gourmet-keuzes form:visible");
  await gourmet.locator('[name="people"]').fill("4");
  await gourmet.locator('[name="fish"][value="salmon"]').check();
  await gourmet.locator('[name="salmon"]').fill("400");
  await review(gourmet, ["Zalm", "400 g", "14,00"]);
  const platter = tab.locator("#maatwerk form:visible");
  await platter.locator('[name="people"]').fill("6");
  await platter.locator('[name="fish"][value="eel"]').check();
  await platter.locator('[name="weight-eel"]').fill("150");
  await review(platter, ["Gerookte paling","150 g","8,50","12,75"]);
  const trio = await openPanel(tab.locator('[data-catalog-card="luxe-trio-klein"]'));
  await trio.locator('[name="choice0"]').selectOption("mackerel");
  await trio.getByRole("checkbox",{name:"Gerookte paling",exact:true}).check();
  await review(trio, ["makreelfilet","3 × 40 g","15,99","100 g","8,50","24,49"]);
  const salads = await openPanel(tab.locator('[data-catalog-card="salade-trio"]'));
  await salads.locator('[name="choice0"]').selectOption("spicy");
  await review(salads, ["Pikante tonijnsalade","11,99"]);
  const luxe = await openPanel(tab.locator('[data-catalog-card="zalmslaatje-de-luxe"]'));
  await luxe.locator('[name="choice0"]').selectOption("wasabi");
  await review(luxe, ["Zalm-wasabisalade","15,99"]);
  const gift = await openPanel(tab.locator("#geschenken article").first());
  await gift.locator('[name="fish"][value="salmon"]').check();
  await gift.locator('[name="weight-salmon"]').fill("200");
  await review(gift, ["200 g","Zonder cadeaudoos","11,90"]);
  await gift.locator('[name="box"]').check();
  await review(gift, ["200 g","Cadeaudoos","3,95","15,85"]);
}

function isLocalPreview(req) {
  const u = new URL(req.url());
  return u.origin === url.origin && (req.method() === "GET" || (u.pathname === "/api/samenstellen" && req.method() === "POST"));
}

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
    const platterEditor = p.locator("#maatwerk form:visible");
    await platterEditor.getByRole("checkbox",{name:"Gerookte zalm",exact:true}).check();
    await platterEditor.locator('[name="weight-salmon"]').fill("200");
    assert.match(await platterEditor.locator('[aria-live="polite"]').innerText(), /11,90/);
    const giftEditor = p.locator("#geschenken article").first().locator("details:visible");
    await giftEditor.locator("summary").click();
    await giftEditor.getByRole("checkbox",{name:"Gerookte paling",exact:true}).check();
    await giftEditor.locator('[name="box"]').check();
    assert.match(await giftEditor.locator('[aria-live="polite"]').innerText(), /12,45/);
    await giftEditor.locator('[name="box"]').uncheck();
    assert.match(await giftEditor.locator('[aria-live="polite"]').innerText(), /8,50/);
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
      const broken = await browser.newContext({ reducedMotion: "reduce" });
      const tab = await broken.newPage();
      const blocked = new Set();
      await broken.route("**/*", r => {
        const u = new URL(r.request().url());
        if (!isLocalPreview(r.request())) return r.abort();
        const match = u.pathname.match(/\/(Productkeuze|CatalogPhoto|CatalogCart|GourmetRequest|LiveAssemblyForm|PlatterInquiry|Bestelomgeving)-[^/]+\.js$/);
        if (match) { blocked.add(match[1]); return r.abort("blockedbyclient"); }
        return r.continue();
      });
      for (const route of ["/nl/visschalen", "/nl/feestdagen", "/nl/feestdagen/" + slug + "?catalog=visschalen"]) {
        await tab.goto(new URL(route, url).href, { waitUntil: "networkidle" });
        const product = route.includes("?") ? tab.locator("main .product-detail-actions") : tab.locator('[data-catalog-card="' + slug + '"]');
        const orderLink = product.getByRole("link", { name: "Bestellen via WhatsApp", exact: true });
        await orderLink.waitFor();
        const draft = new URL(await orderLink.getAttribute("href"));
        assert.equal(draft.origin + draft.pathname, "https://wa.me/31624811678");
        assert.match(draft.searchParams.get("text"), /3[–-]5 personen/);
        assert.equal(await tab.locator("main h1").count(), 1);
        assert.equal(await tab.locator("html#__next_error__").count(), 0);
        assert.ok((await tab.locator("main").innerText()).includes("73,50"), route);
        if (!route.includes("?")) assert.ok(await tab.locator("a.seafood-photo[href] img").first().isVisible(), route);
      }
      await tab.goto(new URL("/nl/bestellen", url).href, { waitUntil: "networkidle" });
      await tab.getByText("Het winkelmandje kon niet laden.", {exact:false}).waitFor();
      const checkoutLink = new URL(await tab.getByRole("link", { name: "Bestellen via WhatsApp", exact: true }).getAttribute("href"));
      assert.equal(checkoutLink.origin + checkoutLink.pathname, "https://wa.me/31624811678");
      assert.match(checkoutLink.searchParams.get("text"), /visschaal bestellen/);
      assert.equal(await tab.locator('main a[href^="tel:"]').count(), 0);
      for (const name of ["Productkeuze", "CatalogPhoto", "Bestelomgeving"]) assert.ok(blocked.has(name), name);
      console.log("Blocked in the same browser:", [...blocked].join(", "), "— catalogues, photos, prices and WhatsApp order drafts remain available.");
      await verifyComposers(broken,tab);
      await broken.close();
      const plain = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce" });
      await plain.route("**/*", r => isLocalPreview(r.request()) ? r.continue() : r.abort());
      const noJS = await plain.newPage();
      for (const [locale, label] of [["nl", "Bestellen via WhatsApp"], ["en", "Order via WhatsApp"], ["de", "Per WhatsApp bestellen"]]) {
        await noJS.goto(new URL("/" + locale + "/visschalen", url).href);
        const card = noJS.locator('[data-catalog-card="' + slug + '"]');
        const draft = new URL(await card.getByRole("link", { name: label, exact: true }).getAttribute("href"));
        assert.equal(draft.origin + draft.pathname, "https://wa.me/31624811678");
        assert.ok(draft.searchParams.get("text").includes(await card.locator("h3").innerText()));
      }
      await verifyComposers(plain,noJS);
      await plain.close();
    }
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
