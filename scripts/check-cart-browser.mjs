/** Actual isolated-browser acceptance tests. All external traffic and writes blocked. */
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
const moduleUrl = process.env.PLAYWRIGHT_MODULE || "playwright";
const { chromium } = await import(moduleUrl);
const { expect } = await import(moduleUrl === "playwright" ? "playwright/test" : new URL("./test.mjs", moduleUrl).href);
const origin = process.env.CART_TEST_ORIGIN || "http://localhost:3035", output = path.resolve(process.env.CART_TEST_OUTPUT || "../design-preview/cart-79");
if (!["localhost","127.0.0.1"].includes(new URL(origin).hostname)) throw new Error("Use a local test site.");
await fs.mkdir(output,{recursive:true});
const browser = await chromium.launch({headless:true,channel:"chrome"});
const context = await browser.newContext({viewport:{width:1440,height:1000}});
const blocked=[],errors=[],results=[],matrix=[];
await context.route("**/*",route=>{
 const req=route.request(),url=new URL(req.url());
 if(url.origin!==origin||req.method()!=="GET") {blocked.push({host:url.hostname,method:req.method()});return route.abort();}
 if(url.pathname==="/api/members/me") return route.fulfill({json:{user:null}});
 return route.continue();
});
const page=await context.newPage();page.setDefaultTimeout(15000);page.on("pageerror",e=>errors.push(e.message));
const cart=page.locator("#catalog-cart"),trigger=page.locator(".catalog-cart-trigger");
const small="visschotel-klein-2-3-pers",medium="visschotel-klein-3-5-pers";
const card=slug=>page.locator(`[data-catalog-card="${slug}"]`);
const line=slug=>cart.locator(`[data-cart-line="${slug}"]`);
const compact=s=>s.replace(/\s/g,"");
const draft=async()=>new URL(await cart.locator(".cart-submit[href]").getAttribute("href")).searchParams.get("text");
async function add(slug){await card(slug).locator(".request-add").click();}
async function open(){await trigger.click();await expect(cart).toBeVisible();}
async function close(){await page.keyboard.press("Escape");await expect(cart).not.toBeVisible();await expect(trigger).toBeFocused();}
async function shot(name){await page.locator("main img").evaluateAll(async imgs=>Promise.all(imgs.filter(i=>{const r=i.getBoundingClientRect();return r.width>0&&r.top<innerHeight&&r.bottom>0&&i.complete;}).map(i=>i.decode().catch(()=>{}))));await page.screenshot({path:path.join(output,name)});}
try {
 await page.goto(origin+"/nl/visschalen");await page.getByRole("button",{name:"Weigeren",exact:true}).click();
 await add(medium);await card(medium).getByRole("button",{name:/Meer:/}).click();
 await expect(trigger.locator("span")).toHaveText("2");await open();
 await expect(line(medium).locator(".cart-unit")).toContainText("73,50");
 await expect(line(medium).locator("[data-line-total]")).toContainText("147,00");
 await expect(cart.locator(".request-total")).toContainText("147,00");
 let message=await draft();assert.ok(compact(message).includes("€73,50perschaal=€147,00"));assert.equal((message.match(/3–5/g)||[]).length,1);assert.doesNotMatch(message,/Wensen:|verdelen|split/);
 assert.equal(await page.evaluate(()=>document.body.style.overflow),"hidden");
 await close();await expect.poll(() => page.evaluate(()=>document.body.style.overflow)).not.toBe("hidden");
 results.push("A: 2 × €73.50 = €147; badge/unit/line/subtotal and one persons range; Escape/focus/scroll lock.");
 await page.goto(origin+`/nl/feestdagen/${small}`);await expect(page.locator("main select")).toHaveCount(0);await expect(page.locator(".product-detail-heading")).toContainText("59,50");
 await page.locator(".product-detail-actions .request-add").click();await open();await expect(line(small)).toBeVisible();await line(medium).locator(".cart-remove").click();
 for(let i=0;i<3;i++) await line(small).getByRole("button",{name:/Meer:/}).click();
 await expect(line(small).locator("[data-line-total]")).toContainText("238,00");
 await line(small).getByRole("button",{name:/Minder:/}).click();await expect(line(small).locator("[data-line-total]")).toContainText("178,50");
 await line(small).getByRole("button",{name:/Meer:/}).click();await expect(cart.locator(".request-total")).toContainText("238,00");
 await line(small).locator(".cart-remove").click();await expect(cart.locator(".cart-empty")).toBeVisible();await close();
 results.push("B/C: direct small detail has no format selector; add/open, 4 × €59.50 = €238, decrement/reincrement/removal.");
 await page.goto(origin+"/nl/visschalen");await add(medium);const trio = card("luxe-trio-klein").locator(".native-composer:visible");await trio.locator("summary").click();
 await trio.getByRole("button",{name:"Voeg toe aan winkelwagen",exact:true}).click();await expect(cart).toBeVisible();await close();
 await page.locator('[data-request-product="extra-zalm-wasabisalade-100g"] .request-add').click();await open();
 await expect(cart.locator(".request-total")).toContainText("92,99");await expect(line("extra-zalm-wasabisalade-100g")).toContainText("3,50");
 await cart.locator("textarea").fill("Geen paling; graag extra zalm indien mogelijk.");message=await draft();assert.equal(message.split("Geen paling;").length-1,1);assert.ok(message.includes("definitieve totaalprijs"));assert.ok(message.includes("Luxe vistrio"));
 await fs.writeFile(path.join(output,"whatsapp-multiple-products.txt"),message);
 const stored=await page.evaluate(()=>sessionStorage.getItem("schaapsvis-product-request-v1"));assert.ok(!stored.includes("paling"));assert.ok(!page.url().includes("paling"));
 await cart.locator('.request-date input').fill("2020-01-01");await expect(cart.locator("#pickup-error")).toBeVisible();await expect(cart.locator(".cart-submit[href]")).toHaveCount(0);
 await cart.locator('.request-date input').fill("2099-12-24");assert.match(await draft(),/2099/);await cart.locator('.request-date input').fill("");
 await page.setViewportSize({width:390,height:844});await shot("cart-multiple-390.png");await close();
 results.push("D/E: €73.50 + €15.99 + €3.50 salad = €92.99 known; wishes once, unconfirmed final price; no free text persisted; past date blocked.");
 await card(medium).locator(".seafood-detail").click();await expect(page).toHaveURL(new RegExp(`/feestdagen/${medium}`));await page.goBack();await expect(page).toHaveURL(/\/nl\/visschalen$/);await expect(card(medium).locator("output")).toHaveText("1");await page.reload();await expect(trigger.locator("span")).toHaveText("3");
 await page.goto(origin+"/nl/feestdagen");await expect(trigger.locator("span")).toHaveText("3");await open();await expect(cart.locator(".request-total")).toContainText("92,99");await expect(cart.locator("textarea")).toHaveValue("");await close();
 results.push("G: detail/back/reload and holiday route retain basket; wishes deliberately not restored after reload.");
 await page.goto(origin+"/nl/visschalen");const form=page.locator(".platter-inquiry");
 await form.locator('[name="kind"]').selectOption("luxury");await form.getByLabel("Gerookte zalm",{exact:true}).check();await form.getByLabel("Gerookte paling",{exact:true}).check();await form.locator('[name="presentation"]').selectOption("platter");await form.locator('[name="people"]').fill("6");
 await form.getByRole("button",{name:"Voeg toe aan winkelwagen"}).click();await expect(cart).toBeVisible();message=await draft();
 assert.match(message,/Gerookte zalm · 100 g/);assert.match(message,/Gerookte paling · 100 g/);assert.ok(message.includes("Aantal personen: 6"));assert.ok(message.includes("Mooi opgemaakt op een schaal"));
 await cart.locator("[data-cart-selection]").last().getByRole("button",{name:/Verwijder/}).click();await close();
 await form.locator('[name="allergies"]').fill("sesam");await form.locator('[name="kind"]').selectOption("salads");await expect(form.locator('[name="people"]')).toHaveCount(0);
 await form.locator('[name="amount"]').fill("3 bakjes");await form.getByRole("button",{name:"Voeg toe aan winkelwagen"}).click();await expect(cart).toBeVisible();
 message=await draft();assert.ok(message.includes("3 bakjes"));assert.ok(message.includes("Allergieën: sesam"));assert.ok(!message.includes("Gerookte zalm · 100 g"));
 assert.ok(!page.url().includes("sesam"));assert.ok(!(await page.evaluate(()=>sessionStorage.getItem("schaapsvis-product-request-v1"))).includes("sesam"));
 await cart.locator("[data-cart-selection]").last().getByRole("button",{name:/Verwijder/}).click();await close();
 results.push("Custom platters share the basket, ingredients and notes appear in checkout, and allergy notes stay out of storage.");
 const widths=[360,390,768,1366,1440,1920];
 for(const width of widths){
  await page.setViewportSize({width,height:width<768?844:1080});
  for(const route of ["visschalen","feestdagen",`feestdagen/${small}`]){
   await page.goto(origin+"/nl/"+route);await expect(trigger).toBeVisible();
   await expect(page.locator(".sv-whatsapp")).toHaveCount(0);
   const size=await page.evaluate(()=>({view:innerWidth,scroll:document.documentElement.scrollWidth}));assert.ok(size.scroll<=size.view+1,`${width}/${route} overflow`);
   const hit=await trigger.evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));});assert.equal(hit,true,`${width}/${route} unobstructed basket`);
   if(width===390){await shot(route==="visschalen"?"catalog-after-390.png":route==="feestdagen"?"festive-after-390.png":"detail-after-390.png");if(route.includes("/")){const r=await page.locator(".product-detail-heading").boundingBox();assert.ok(r.y+r.height<800,"Name and price above mobile fold");}}
   await open();assert.ok(await cart.evaluate(el=>el.scrollWidth<=el.clientWidth+1));await expect(cart.locator(".cart-submit")).toBeEnabled();
   await cart.locator(".cart-submit").scrollIntoViewIfNeeded();await expect(cart.locator(".cart-submit")).toBeInViewport();await close();matrix.push({width,route});
  }
 }
 // Outside click closes on desktop, close button usable; keyboard focus remains inside dialog.
 await open();await page.keyboard.press("Tab");assert.ok(await page.evaluate(()=>document.querySelector("#catalog-cart").contains(document.activeElement)));await page.mouse.click(50,500);await expect(cart).not.toBeVisible();await open();await cart.getByRole("button",{name:"Sluit winkelwagen",exact:true}).click();await expect(trigger).toBeFocused();
 // Cookie-choice coexistence and menu: no overlap, no exposed basket behind mobile navigation.
 await page.setViewportSize({width:360,height:844});await page.getByRole("button",{name:"Cookie-instellingen",exact:true}).click();
 const a=await trigger.boundingBox(),b=await page.locator(".cookie-choice-banner").boundingBox();assert.ok(a.y+a.height<=b.y||b.y+b.height<=a.y);
 await page.getByRole("button",{name:"Weigeren",exact:true}).click();await page.getByRole("button",{name:"Menu",exact:true}).click();await expect(trigger).toBeHidden();await page.keyboard.press("Escape");await expect(trigger).toBeVisible();
 results.push("H: 18 route/width combinations (360/390/768/1366/1440/1920), no overflow, reachable checkout, no floating WhatsApp; cookie/menu coexistence, close/outside/Escape/focus.");
 for(const locale of ["en","de"]){
  await page.goto(origin+`/${locale}/visschalen`);await open();message=await draft();assert.ok(message.includes(locale==="en"?"Luxury seafood trio":"Luxus-Fischtrio"));assert.ok(message.includes(locale==="en"?"Known subtotal":"Bekannte Zwischensumme"));assert.ok(!message.includes("personen"));await close();
  await page.goto(origin+`/${locale}/feestdagen/luxe-vistrio`);await expect(page.locator("h1")).toHaveText(locale==="en"?"Luxury seafood trio":"Luxus-Fischtrio");
  assert.ok((await page.title()).includes(locale==="en"?"Luxury seafood trio":"Luxus-Fischtrio"));
  const schema=await page.locator('script[type="application/ld+json"]').allTextContents();assert.ok(schema.some(s=>s.includes('15.99')&&s.includes(locale==="en"?"Luxury seafood trio":"Luxus-Fischtrio")));
 }
 results.push("I: EN/DE cart controls, translated drafts/trios, title and Product schema preserve €15.99.");
 await page.evaluate(({small})=>sessionStorage.setItem("schaapsvis-product-request-v1",JSON.stringify({items:{[small]:{quantity:4,split:true},unknown:{quantity:3}},date:"",wishes:"must-not-restore"})),{small});
 await page.goto(origin+"/nl/visschalen");await open();await expect(cart.locator(".request-total")).toContainText("238,00");await expect(cart.locator("textarea")).toHaveValue("");message=await draft();assert.doesNotMatch(message,/split|verdelen|must-not-restore/);assert.ok(!(await page.evaluate(()=>sessionStorage.getItem("schaapsvis-product-request-v1"))).includes("split"));await close();
 assert.deepEqual(errors,[]);assert.deepEqual(blocked,[]);
 results.push("J: stale split discarded and persisted clean; no external requests, messages, writes or page errors.");
 await fs.writeFile(path.join(output,"cart-browser-results.json"),JSON.stringify({results,matrix,errors,blocked},null,2));console.log(results.join("\n"));
}finally{await browser.close();}
