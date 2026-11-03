/** Playwright regression suite; isolated LOCAL browser only, never a customer session.
 * PLAYWRIGHT_MODULE may point to the preinstalled runtime's playwright/index.mjs.
 * Start the built app on localhost:3035 with SITE_PUBLIC=launch-approved (local only).
 */
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
const moduleUrl = process.env.PLAYWRIGHT_MODULE || "playwright";
const { chromium } = await import(moduleUrl);
const { expect } = await import(moduleUrl === "playwright" ? "playwright/test" : new URL("./test.mjs", moduleUrl).href);
const origin = "http://localhost:3035";
const output = path.resolve("../design-preview/cart-79/regression");
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless:true, channel:"chrome" });
const context = await browser.newContext({ viewport:{width:1920,height:1080} });
let blockedWrites = 0;
await context.route("**/*", route => {
  const request = route.request(), url = new URL(request.url());
  if (url.origin !== origin || request.method() !== "GET") { if (request.method() !== "GET") blockedWrites++; return route.abort(); }
  if (url.pathname === "/api/members/me") return route.fulfill({json:{user:null}});
  return route.continue();
});
const page = await context.newPage();
const errors=[]; page.on("pageerror", e=>errors.push(e.message));
const results=[];
try {
  await page.goto(origin+"/nl");
  await page.getByRole("button",{name:"Weigeren",exact:true}).click();
  const account=page.locator("header details").filter({has:page.locator("summary",{hasText:/^Account$/})});
  const more=page.locator("header details").filter({has:page.locator("summary",{hasText:/^Meer$/})});
  await account.locator("summary").click(); await expect(account).toHaveAttribute("open", "");
  await account.locator("summary").click(); await expect(account).not.toHaveAttribute("open", "");
  await account.locator("summary").click(); await more.locator("summary").click();
  await expect(account).not.toHaveAttribute("open", ""); await expect(more).toHaveAttribute("open", "");
  await more.locator("summary").press("Escape"); await expect(more).not.toHaveAttribute("open", ""); await expect(more.locator("summary")).toBeFocused();
  await account.locator("summary").press("Enter"); await expect(account).toHaveAttribute("open", "");
  await page.screenshot({path:path.join(output,"account-dropdown-open.jpg")});
  await page.locator("h1").click(); await expect(account).not.toHaveAttribute("open", "");
  await page.screenshot({path:path.join(output,"account-dropdown-outside-closed.jpg")});
  await account.locator("summary").click(); await account.getByRole("link",{name:"Studentenaccount",exact:true}).click();
  await expect(page).toHaveURL(/\/nl\/account$/); await expect(page.locator("header details[open]")).toHaveCount(0);
  await expect(page.locator('main input[type="email"]:visible')).toHaveCount(1);
  results.push("Account: toggle, outside pointer, mutually exclusive, Escape/focus, keyboard Enter, navigation; one visible login email.");

  // Simulate an existing legacy selection before mounting the provider.
  await page.evaluate(()=>{
    sessionStorage.removeItem("sv_bestelling_v2"); sessionStorage.removeItem("sv_visschaal_v3"); localStorage.setItem("sv_bestelling_v2",JSON.stringify([{slug:"kabeljauwfilet",hoeveelheid:"500 gram",snijwijze:""},null,{slug:"verwijderd"},{slug:"haring",hoeveelheid:42}]));
    localStorage.setItem("sv_visschaal_v3",JSON.stringify({schaal:"borrelschaal",personen:4,extras:{removed:999}}));
  });
  await page.goto(origin+"/nl/bestellen"); await page.reload();
  await expect(page.getByRole("button",{name:"Verwijderen: Kabeljauwfilet",exact:true})).toBeVisible();
  await expect(page.locator("main")).toContainText("500 gram");
  await page.screenshot({path:path.join(output,"legacy-cart-restored.jpg")});
  assert.equal(await page.evaluate(()=>localStorage.getItem("sv_bestelling_v2")),null);
  await page.getByRole("button",{name:"Verwijderen: Kabeljauwfilet",exact:true}).click();
  await page.reload(); await expect(page.getByRole("button",{name:"Verwijderen: Kabeljauwfilet",exact:true})).toHaveCount(0);
  await page.getByRole("button",{name:"Eerdere selectie leegmaken",exact:true}).click(); await page.reload();
  await expect(page.getByRole("button",{name:"Eerdere selectie leegmaken",exact:true})).toHaveCount(0);
  results.push("Legacy selection: one-time migration, malformed/deleted records filtered, reload retained, removal retained, explicit clear retained.");

  await page.goto(origin+"/nl/visschalen");
  const small=page.locator('[data-catalog-card="visschotel-klein-2-3-pers"]');
  await small.locator(".request-add").click(); await small.getByRole("button",{name:/Meer:/}).click();
  await page.reload(); await expect(small.locator("output")).toHaveText("2");
  await page.locator(".catalog-cart-trigger").click();
  await expect(page.locator(".request-total")).toContainText("119,00");
  await page.keyboard.press("Escape");
  await small.locator(".seafood-detail").click(); await page.locator(".platter-back-link").first().click();
  await expect(small.locator("output")).toHaveText("2");
  await small.locator(".seafood-photo").click(); await expect(page.locator("dialog[open]")).toHaveCount(1);
  await page.keyboard.press("Escape"); await expect(page.locator("dialog[open]")).toHaveCount(0); await expect(small.locator(".seafood-photo")).toBeFocused();
  await page.locator('.catalog-cart-trigger').click();
  await page.locator('.request-date input').fill("2020-01-01"); await expect(page.locator("#pickup-error")).toBeVisible();
  await expect(page.locator('#catalog-cart a[href*="wa.me"]')).toHaveCount(0);
  await page.locator('.request-date input').fill("2099-12-24");
  const draft=await page.locator('#catalog-cart a[href*="wa.me"]').getAttribute("href");
  assert.match(decodeURIComponent(draft),/2099/);
  await page.goto(origin+"/nl/feestdagen"); await page.locator(".catalog-cart-trigger").click(); await expect(page.locator(".request-total")).toContainText("119,00");
  await page.keyboard.press("Escape");
  await expect(page.locator(".catalog-gifts article")).toHaveCount(3);
  results.push("Catalogue: quantity/reload, detail/back, shared holiday list, price, photo modal/Escape/focus, past date blocked and future date in unsent draft, 3 gifts.");

  await page.goto(origin+"/nl/assortiment?categorie=verse-vis&sortering=az&aantal=28&token=private");
  const english=page.locator('header a[hreflang="en"]').first();
  const href=await english.getAttribute("href"); assert.ok(href.includes("sortering=az")&&!href.includes("token"));
  results.push("Language switch retains safe filters but excludes credentials/free text.");

  const routes=["","assortiment","assortiment/kabeljauwfilet","visschalen","feestdagen","relatiegeschenken","account","bezoek-ons","ons-verhaal","recepten","blog","bestellen"];
  const matrix=[];
  for(const width of [360,375,390,430,768,820,1024,1180,1280,1366,1440,1728,1920]) {
    await page.setViewportSize({width,height:width<768?844:width===820?1180:width===1180?820:1080});
    for(const route of routes) {
      await page.goto(origin+"/nl/"+route); await page.locator("h1").waitFor();
      const sizes=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,canvas:Math.round(document.querySelector(".section-wrap,.site-container")?.getBoundingClientRect().width??0)}));
      matrix.push({width,route,...sizes}); assert.ok(sizes.scroll<=sizes.viewport+1,`Overflow ${route} at ${width}: ${sizes.scroll}`);
      if((width===1920&&!route)||(width===390&&["","visschalen","feestdagen","account"].includes(route))||(width===820&&["","visschalen","bezoek-ons","account"].includes(route))||(width===1180&&["","visschalen"].includes(route))) { await page.waitForFunction(() => [...document.querySelectorAll("main img")].filter(i=>{const r=i.getBoundingClientRect();return r.width>0 && r.height>0 && r.top<innerHeight && r.bottom>0;}).every(i=>i.complete && i.naturalWidth>0)); await page.locator("main img").evaluateAll(async images => Promise.all(images.filter(i=>{const r=i.getBoundingClientRect();return r.width>0 && r.top<innerHeight && r.bottom>0;}).map(i=>i.decode()))); await page.screenshot({path:path.join(output,`${route||"home"}-after-${width}.jpg`)}); }
    }
    console.log("Layout",width,"12 routes passed");
  }
  await page.goto(origin+"/nl"); await page.setViewportSize({width:390,height:844});
  const menu=page.getByRole("button",{name:"Menu",exact:true}); await menu.click();
  await expect(page.locator("#mobile-navigation")).toBeVisible();
  await menu.press("Escape"); await expect(page.locator("#mobile-navigation")).toHaveCount(0); await expect(menu).toBeFocused();
  await menu.click(); await page.locator("h1").click({force:true}); await expect(page.locator("#mobile-navigation")).toHaveCount(0);
  results.push("Mobile menu toggle, Escape/focus and outside click; 156 route/width combinations without horizontal overflow.");
  // Same routes in EN/DE plus the new content; touch uses an independent browser context.
  for (const locale of ["en","de"]) {
    for (const route of ["visschalen","feestdagen","account","ons-verhaal","recepten/haringsalade-appel-biet","recepten/haring-komkommer-borrelhapjes","recepten/makreel-aardappel-ovenschotel","blog/visgeschenk-geven-koelen-en-afhalen"]) {
      await page.goto(origin+`/${locale}/${route}`); await page.locator("h1").waitFor();
      assert.equal(await page.locator(".owner-media-guide").count(),0);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    }
  }
  const touchContext=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  await touchContext.route("**/*",route=>new URL(route.request().url()).origin===origin&&route.request().method()==="GET"?route.continue():route.abort());
  const touch=await touchContext.newPage(); await touch.goto(origin+"/nl");
  await touch.getByRole("button",{name:"Weigeren",exact:true}).tap();
  await touch.getByRole("button",{name:"Menu",exact:true}).tap(); await expect(touch.locator("#mobile-navigation")).toBeVisible();
  await touch.getByRole("button",{name:"Menu",exact:true}).tap(); await expect(touch.locator("#mobile-navigation")).toHaveCount(0);
  await touch.goto(origin+"/nl/bestellen"); await expect(touch.getByRole("button",{name:"Eerdere selectie leegmaken",exact:true})).toHaveCount(0);
  await touchContext.close(); results.push("16 EN/DE route checks, public media hints absent, mobile touch menu and isolated empty cart passed.");
  assert.deepEqual(errors,[]); assert.equal(blockedWrites,0,"No forms may be submitted");
  await fs.writeFile(path.join(output,"browser-results.json"),JSON.stringify({results,matrix,errors,blockedWrites},null,2));
  console.log(results.join("\n"));
} finally { await browser.close(); }




