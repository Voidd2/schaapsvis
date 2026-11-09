import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

// Run the real pure TypeScript modules without introducing a test dependency.
const require = createRequire(import.meta.url);
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  if (file.endsWith(".json")) return JSON.parse(fs.readFileSync(file, "utf8"));
  const mod = { exports: {} };
  cache.set(file, mod);
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const localRequire = spec => spec.startsWith(".")
    ? load(path.resolve(path.dirname(file), spec + (path.extname(spec) ? "" : ".ts")))
    : require(spec);
  new Function("require", "exports", "module", code)(localRequire, mod.exports, mod);
  return mod.exports;
}
const { platterFamilies, platterFamily, selectedPlatter, platterSelectionParams, platterDetailHref, platterOverviewHref } = load("src/lib/platter-families.ts");
const { FEESTDAGEN_PRODUCTEN } = load("src/lib/feestdagen-producten.ts");
const { gourmetRequestLink, gourmetRequestCopy, gourmetQuote, gourmetFish } = load("src/lib/gourmet-request.ts");
assert.deepEqual(gourmetFish.slice(0, 4).map(f => f.rate), [350, 350, 350, 275]);
const { GOURMET_PORTIONS, gourmetPriceCents } = load("src/lib/gourmet-pricing.ts");
const gourmetSelection = load("src/lib/dirks-selectie.ts").DIRKS_SELECTIE;
for (const [slug, weight, price] of [["gourmet-trio-1-persoon", 300, 1550], ["gourmet-schotel-3-4-pers", 1000, 4250], ["gourmetschotel-5-6-pers", 1500, 6250]]) {
  assert.equal(GOURMET_PORTIONS[slug].grams.reduce((sum, grams) => sum + grams, 0), weight);
  assert.equal(gourmetPriceCents(slug), price);
  const product = FEESTDAGEN_PRODUCTEN.find(p => p.slug === slug);
  assert.equal(product.prijsCents, price);
  assert.equal(gourmetSelection.find(item => item.slug === slug).prijs * 100, price);
  assert.equal(product.eenheid, "per schaal");
  assert.equal(product.samenstelling.reduce((sum, line) => sum + Number(line.match(/^(\d+) gram/)?.[1] ?? 0), 0), weight);
  assert.ok(GOURMET_PORTIONS[slug].preparationCents >= 500 && GOURMET_PORTIONS[slug].preparationCents <= 1500);
}
for (const slug of ["gourmetstukjes-zalm", "gourmetstukjes-tonijn", "gourmet-stukjes-kabeljauw"]) {
  const item = gourmetSelection.find(item => item.slug === slug);
  assert.equal(item.prijs, 3.5);
  assert.equal(item.per100g, true);
}
for (const [grams, fee] of [[1,500],[500,500],[501,1000],[1500,1000],[1501,1500]]) {
  const portions = { salmon: String(grams) };
  assert.equal(gourmetQuote(portions,"premium").fee, fee);
  assert.equal(gourmetQuote(portions,"standard").fee, 0);
}
for (const portions of [{},{unknown:"100"},{salmon:""},{salmon:"0"},{salmon:"-1"},{salmon:"2.5"},{salmon:"1e3"}]) {
  assert.equal(gourmetQuote(portions,"standard"), null);
}
for (const locale of ["nl", "en", "de"]) {
  const t = gourmetRequestCopy(locale);
  const request = { people: "6", portions: {salmon:"250", seabass:"100"}, packaging:"standard", date:"", wishes:"  " };
  const url = new URL(gourmetRequestLink(locale, request)), message = url.searchParams.get("text");
  assert.equal(url.origin, "https://wa.me");
  const q = gourmetQuote(request.portions, request.packaging);
  assert.equal(q.grams,350);
  assert.equal(q.total,1175);
  assert.ok(message.includes(t.standard) && message.includes("350 g") && message.includes("250 g"));
  assert.ok(message.includes(locale === "en" ? "11.75" : "11,75"));
  assert.ok(message.includes(t.dateUnknown));
  for (const people of ["", "0", "-1", "2.5", "abc", "201", "Infinity"]) assert.equal(gourmetRequestLink(locale, { ...request, people }), null);
  for (const date of ["2026-02-30", "tomorrow", "2026-13-01"]) assert.equal(gourmetRequestLink(locale, { ...request, date }), null);
  const extra = new URL(gourmetRequestLink(locale, { ...request, date: "2026-12-24", wishes: "  Meer zalm & geen saus? #test\nAdvies graag  " }));
  assert.equal([...extra.searchParams.keys()].join(), "text");
  assert.ok(extra.searchParams.get("text").includes("24-12-2026"));
  assert.ok(extra.searchParams.get("text").includes("Meer zalm & geen saus? #test\nAdvies graag"));
}
const { giftRequestLink, giftRequestCopy, giftPackageContents, giftVoucherCents, GIFT_PACKAGE_GRAMS } = load("src/lib/gift-request.ts");
const { trioPriceCents, packagePriceCents } = load("src/lib/gift-pricing.ts");
assert.deepEqual([0, 1, 2].map(i => trioPriceCents(i)), [1146, 1594, 2042]);
assert.deepEqual([0, 1, 2].map(i => packagePriceCents(i)), [2151, 3458, 5000]);
assert.equal(packagePriceCents(0, [0, 1]), 3246);
assert.equal(packagePriceCents(1, [0, 0]), null);
assert.equal(trioPriceCents(1, [0, 1, 3]), 1534);
const giftDraft = giftRequestLink("nl", { kind: "package", product: "Test", size: 0, extras: [0, 1], fish: [], wishes: "", voucher: true, voucherAmount: "10" });
const pricedText = new URL(giftDraft).searchParams.get("text");
for (const value of ["500 g", "32,46", "42,46", "100 g Gravad lax", "100 g Hollandse garnalen"]) assert.ok(pricedText.includes(value));
assert.deepEqual(GIFT_PACKAGE_GRAMS.map(items => items.reduce((sum, grams) => sum + grams, 0)), [300, 500, 800]);
assert.deepEqual(GIFT_PACKAGE_GRAMS.map(items => items[3]), [0, 0, 100]);
for (const [input, cents] of [["25", 2500], ["25,50", 2550], ["25.50", 2550], ["0,01", 1], [" 100 ", 10000]]) assert.equal(giftVoucherCents(input), cents);
for (const input of ["", "0", "-10", "NaN", "Infinity", "1e3", "25.555", "1,000.00", "abc", "1000000"]) assert.equal(giftVoucherCents(input), null);
for (const locale of ["nl", "en", "de"]) {
  const t = giftRequestCopy(locale);
  const draft = { product: "Gift test", kind: "trio", size: 1, fish: [0, 1, 3], wishes: "  " };
  const url = new URL(giftRequestLink(locale, draft));
  assert.equal(url.origin, "https://wa.me");
  const message = url.searchParams.get("text");
  assert.ok(message.includes(t.choices[3]));
  assert.ok(!message.includes(t.choices[2]));
  assert.ok(!message.includes(t.wishesLine + ":"));
  assert.ok(message.includes(t.sizeLine + ": " + t.sizes[1]));
  for (const fish of [[0, 1], [0, 1, 2, 3], [0, 0, 1], [0, 1, 99]]) assert.equal(giftRequestLink(locale, { ...draft, fish }), null);
  for (let size = 0; size < 3; size++) {
    const packageMessage = new URL(giftRequestLink(locale, { ...draft, kind: "package", size })).searchParams.get("text");
    assert.ok(packageMessage.includes(t.sizes[size]));
    assert.ok(!packageMessage.includes(t.fishLine + ":"));
    const contents = giftPackageContents(locale, size);
    for (const line of contents.lines) assert.ok(packageMessage.includes(line));
    assert.ok(packageMessage.includes(`${t.total}: ${contents.total} g`));
    assert.equal(packageMessage.includes(t.packageFish[3]), size === 2);
    assert.ok(!packageMessage.includes(t.voucherLine));
  }
  for (const kind of ["package", "trio", "custom"]) {
    const withVoucher = new URL(giftRequestLink(locale, { ...draft, kind, voucher: true, voucherAmount: "37,50" })).searchParams.get("text");
    assert.ok(withVoucher.includes(`${t.voucherLine}:`));
    assert.ok(withVoucher.includes(locale === "en" ? "37.50" : "37,50"));
    assert.equal(giftRequestLink(locale, { ...draft, kind, voucher: true, voucherAmount: "-1" }), null);
    const unchecked = new URL(giftRequestLink(locale, { ...draft, kind, voucher: false, voucherAmount: "37,50" })).searchParams.get("text");
    assert.ok(!unchecked.includes(t.voucherLine));
  }
  const wishes = "Extra kaart & verpakking? #test\nGraag bespreken.";
  const custom = new URL(giftRequestLink(locale, { ...draft, kind: "custom", wishes }));
  assert.ok(custom.searchParams.get("text").includes(wishes));
  assert.equal(custom.hash, "");
  assert.ok(custom.searchParams.get("text").includes(t.note));
}
assert.deepEqual(Object.values(platterFamilies).map(items => items.length), [4, 5, 3]);
const all = Object.values(platterFamilies).flat();
assert.equal(new Set(all.map(item => item.slug)).size, 12);
for (const item of all) {
  const source = FEESTDAGEN_PRODUCTEN.find(product => product.slug === item.slug);
  assert.equal(item.prijs * 100, source.prijsCents);
  assert.equal(item.foto, source.afbeelding);
  assert.equal(item.naam, source.naam);
  assert.ok(item.personenVan > 0 && item.personenTot >= item.personenVan);
  const family = platterFamily(item.slug);
  const search = platterSelectionParams("utm_source=folder&luxe=visschotel-luxe-10-14-pers", family, item.slug).toString();
  assert.equal(selectedPlatter(family, new URLSearchParams(search)).slug, item.slug);
  const detail = new URL(platterDetailHref("nl", item.slug, search), "https://example.test");
  assert.equal(detail.pathname, `/nl/feestdagen/${item.slug}`);
  const back = new URL(platterOverviewHref("nl", item.slug, detail.search), "https://example.test");
  assert.equal(back.hash, `#schalen-${family}`);
  assert.equal(back.searchParams.get("utm_source"), "folder");
  assert.equal(selectedPlatter(family, back.searchParams).slug, item.slug);
  if (family !== "luxe") assert.equal(back.searchParams.get("luxe"), "visschotel-luxe-10-14-pers");
}
// Related-product navigation must carry the other two family choices.
const originalSelection = "klassiek=visschotel-groot-8-10-pers&luxe=visschotel-luxe-10-14-pers&hapjes=visschotel-hapjes-6-10-pers&utm_source=folder";
const relatedDetail = new URL(platterDetailHref("en", "visschotel-klein-3-5-pers", originalSelection), "https://example.test");
const relatedBack = new URL(platterOverviewHref("en", "visschotel-klein-3-5-pers", relatedDetail.search), "https://example.test");
assert.equal(relatedBack.searchParams.get("klassiek"), "visschotel-klein-3-5-pers");
assert.equal(relatedBack.searchParams.get("luxe"), "visschotel-luxe-10-14-pers");
assert.equal(relatedBack.searchParams.get("hapjes"), "visschotel-hapjes-6-10-pers");
assert.equal(relatedBack.searchParams.get("utm_source"), "folder");
assert.equal(relatedBack.hash, "#schalen-klassiek");
assert.equal(platterDetailHref("de", "salade-trio", originalSelection), "/de/feestdagen/salade-trio");

const { localizedPlatterProduct } = load("src/lib/platter-product-text.ts");
const { platterPrice, platterPhotoAlt, platterPresentation } = load("src/lib/platter-presentation.ts");
const { feestdagenBedrag, feestdagenPrijs } = load("src/lib/feestdagen-producten.ts");
const allergens = {
  en: { Vis: "Fish", Schaaldieren: "Crustaceans", Gluten: "Gluten", Ei: "Egg", Mosterd: "Mustard", Soja: "Soy", Selderij: "Celery", Melk: "Milk", Sesam: "Sesame" },
  de: { Vis: "Fisch", Schaaldieren: "Krebstiere", Gluten: "Gluten", Ei: "Ei", Mosterd: "Senf", Soja: "Soja", Selderij: "Sellerie", Melk: "Milch", Sesam: "Sesam" },
};
for (const source of FEESTDAGEN_PRODUCTEN.filter(p => p.categorie === "visschalen")) {
  assert.equal(localizedPlatterProduct(source, "nl"), source);
  for (const locale of ["en", "de"]) {
    const translated = localizedPlatterProduct(source, locale);
    for (const field of ["slug", "prijsCents", "afbeelding", "categorie"]) assert.equal(translated[field], source[field]);
    for (const field of ["naam", "intro", "formaat", "besteltermijn", "eenheid"]) assert.notEqual(translated[field], source[field], `${source.slug}/${locale}/${field}`);
    assert.deepEqual(translated.naam.match(/\d+/g), source.naam.match(/\d+/g));
    assert.deepEqual(translated.formaat.match(/\d+/g), source.formaat.match(/\d+/g));
    assert.deepEqual(translated.allergenen, source.allergenen.map(item => allergens[locale][item]));
    assert.equal(translated.samenstelling.length, source.samenstelling.length);
    for (let i = 0; i < source.samenstelling.length; i++) assert.notEqual(translated.samenstelling[i], source.samenstelling[i]);
    assert.equal(translated.eenheid, locale === "en" ? "each" : "pro Stück");
    assert.ok(feestdagenPrijs(translated, locale).startsWith(feestdagenBedrag(source.prijsCents, locale)));
  }
}
for (const source of FEESTDAGEN_PRODUCTEN.filter(p => p.categorie !== "visschalen")) assert.equal(localizedPlatterProduct(source, "de"), source);

const { catalogProduct, MAIN_PLATTERS, GOURMET, DELICACIES, SECONDARY, SALAD_REQUESTS } = load("src/lib/seafood-catalog.ts");

if (process.env.PLATTER_DETAIL_EVIDENCE) {
  const rows = JSON.parse(fs.readFileSync(process.env.PLATTER_DETAIL_EVIDENCE, "utf8"));
  assert.equal(rows.length, 36);
  assert.equal(new Set(rows.map(r => `${r.locale}/${r.slug}`)).size, 36);
  for (const row of rows) {
    const product = catalogProduct(row.slug, row.locale);
    assert.equal(row.name, product.naam);
    assert.equal(row.alt, platterPhotoAlt(product, row.locale));
    assert.ok(row.title.includes(product.naam));
    assert.equal(row.description, product.intro);
    assert.equal(row.schema.name, product.naam);
    assert.equal(row.schema.description, product.intro);
    assert.equal(row.schema.offers.price, (product.prijsCents / 100).toFixed(2));
    for (const text of [product.intro, product.formaat, product.besteltermijn, ...product.samenstelling, ...product.allergenen]) assert.ok(row.text.includes(text), `${row.locale}/${row.slug}: ${text}`);
    const price = feestdagenBedrag(product.prijsCents, row.locale);
    assert.ok(row.text.includes(platterPrice(product, row.locale)));
    assert.ok(row.option.includes(price));
    assert.ok(row.requestLink?.endsWith("#aanvraag"), "Detail leads to shared enquiry");
    for (const link of row.related) {
      const url = new URL(link.href, "https://example.test");
      const slug = url.pathname.split("/").at(-1);
      const related = catalogProduct(slug, row.locale);
      assert.ok(link.text.includes(related.naam));
      assert.ok(link.text.includes(platterPrice(related, row.locale)));
      if (platterFamily(slug) !== "luxe") assert.equal(url.searchParams.get("luxe"), "visschotel-luxe-10-14-pers");
      if (platterFamily(slug) !== "hapjes") assert.equal(url.searchParams.get("hapjes"), "visschotel-hapjes-6-10-pers");
    }
    if (row.locale !== "nl") assert.doesNotMatch(row.text, /per stuk|Schaap’s selectie|Huisgemaakte|vooraf bestellen|Ovale schaal|Een klassieke|Een luxe/);
    assert.ok(row.scrollWidth <= row.width);
  }
  console.log("36 rendered details verified: translations, canonical amounts, ingredients/allergens, metadata, schema, images, related links and WhatsApp.");
}

const { normalizeRequest, requestTotal, requestMessage } = load("src/lib/catalog-request.ts");
assert.equal(MAIN_PLATTERS.length, 6);
assert.equal(new Set([...MAIN_PLATTERS, ...GOURMET, ...DELICACIES, ...SECONDARY, "zalmslaatje-de-luxe"]).size, FEESTDAGEN_PRODUCTEN.length);
assert.deepEqual(MAIN_PLATTERS.map(slug => FEESTDAGEN_PRODUCTEN.find(p => p.slug === slug).prijsCents), [5950,7350,9850,16000,6750,8550]);
for (const locale of ["nl","en","de"]) for (const source of FEESTDAGEN_PRODUCTEN) {
  const localized = catalogProduct(source.slug, locale);
  assert.equal(localized.prijsCents, source.prijsCents);
  assert.equal(localized.afbeelding, source.afbeelding);
  assert.equal(localized.samenstelling.length, source.samenstelling.length);
  assert.equal(localized.allergenen.length, source.allergenen.length);
  assert.ok(fs.existsSync(path.join("public", localized.afbeelding)));
  if(source.slug === "visschotel-luxe-10-14-pers") assert.match(localized.naam, /10–14/);
}
for (const salad of SALAD_REQUESTS) assert.ok(fs.existsSync(path.join("public", salad.image)));
assert.equal(new Set(SALAD_REQUESTS.map(s => s.image)).size, 4);
const request = {items:{"visschotel-middel-5-8-pers":{quantity:2,split:false}},date:""};
assert.deepEqual(requestTotal(request), {cents:19700,incomplete:false});
request.items["luxe-trio-klein"] = {quantity:1,split:false};
assert.deepEqual(requestTotal(request), {cents:20846,incomplete:false});
request.items["extra-zalmsalade"] = {quantity:2,split:false};
assert.deepEqual(requestTotal(request), {cents:20846,incomplete:true});
request.items["visschotel-middel-5-8-pers"].split = true;
assert.deepEqual(requestTotal(request), {cents:20846,incomplete:true});
for(const locale of ["nl","en","de"]) {
  const draft = requestMessage({...request,date:"2026-12-24"},locale);
  assert.ok(draft.includes(feestdagenBedrag(20846,locale)));
  assert.ok(draft.includes("2026"));
  assert.ok(draft.includes(catalogProduct("luxe-trio-klein",locale).naam));
  assert.ok(draft.includes("5–8"));
}
assert.deepEqual(normalizeRequest({items:{unknown:{quantity:1},"luxe-trio-klein":{quantity:1.5},"extra-zalmsalade":{quantity:-1}},date:"bad"}),{items:{},date:""});
assert.deepEqual(normalizeRequest(JSON.parse(JSON.stringify(request))), {items:Object.fromEntries(Object.entries(request.items).map(([slug,line])=>[slug,{quantity:line.quantity}])), date:""});
assert.equal(normalizeRequest({items:{"luxe-trio-klein":{quantity:1,split:true}},date:""}).items["luxe-trio-klein"].split,undefined);
console.log("Shared catalogue checks passed: 6 main choices, original routes and new medium trio, 3 languages, canonical totals, unknown salads, legacy split removal and storage validation.");

const { inquiryText, platterInquiryMessage } = load("src/lib/platter-inquiry.ts");
const { whatsappLink } = load("src/lib/bedrijf.ts");
for (const locale of ["nl", "en", "de"]) {
  const t = inquiryText(locale);
  const emptyOptional = { kind: "advice", fish: [], excluded: "", presentation: "advice", people: "8", amount: "", date: "2099-12-24", dateUnknown: true, budget: "  ", remarks: "  ", allergies: "" };
  const basic = platterInquiryMessage(locale, emptyOptional);
  assert.ok(basic.includes(`${t.people}: 8`));
  assert.ok(basic.includes(t.unknown));
  assert.ok(!basic.includes("2099"));
  assert.ok(!basic.includes(t.budgetMessage));
  assert.ok(!basic.includes(t.remarksMessage));
  const full = platterInquiryMessage(locale, { ...emptyOptional, kind: "luxury", fish: ["salmon","eel"], presentation: "platter", dateUnknown: false, budget: "125.50", remarks: "Graag zalm & paling", allergies: "sesam?" });
  assert.ok(full.includes(t.kinds.luxury));
  assert.ok(full.includes(t.presentations.platter));
  assert.ok(full.includes("2099"));
  assert.ok(!full.includes(t.unknown));
  assert.ok(full.includes(`${t.budgetMessage}: € 125.50`));
  assert.ok(full.includes("Graag zalm & paling") && full.includes(`${t.allergiesMessage}: sesam?`));
  assert.ok(full.includes(t.note));
  assert.ok(!full.includes("1004")); // Never multiply the budget by the guest count.
  const link = new URL(whatsappLink(full));
  assert.equal(link.hostname, "wa.me");
  assert.equal(link.searchParams.get("text"), full);
  for (const product of FEESTDAGEN_PRODUCTEN.filter(p => p.categorie === "visschalen")) {
    const label = platterPrice(product, locale);
    assert.ok(label.includes(feestdagenBedrag(product.prijsCents, locale)));
    assert.ok(label.includes(platterPresentation(locale).unit));
    assert.ok(label.includes(product.slug.match(/(\d+)-(\d+)-pers$/).slice(1).join("–")));
    assert.doesNotMatch(platterPhotoAlt(product, locale), /\d/); // Example image never asserts a particular size.
  }
}
console.log("Platter presentation and 3-language enquiry drafts passed; optional fields omitted and budget never multiplied.");

const polluted = new URLSearchParams("klassiek=visschotel-luxe-8-10-pers&luxe=unknown&hapjes=https://evil.test");
for (const family of Object.keys(platterFamilies)) {
  assert.equal(selectedPlatter(family, polluted).slug, platterFamilies[family][0].slug);
}
assert.equal(platterFamily("gourmet-trio-1-persoon"), undefined);
assert.equal(platterOverviewHref("de", "visschotel-hapjes-3-5-pers"), "/de/visschalen?hapjes=visschotel-hapjes-3-5-pers#schalen-hapjes");
if (process.argv[2]) {
  const evidence = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
  assert.equal(evidence.length, 12);
  assert.equal(new Set(evidence.map(row => row.selected)).size, 12);
  for (const row of evidence) {
    const product = FEESTDAGEN_PRODUCTEN.find(item => item.slug === row.selected);
    assert.ok(product);
    const image = new URL(row.photo, "https://example.test");
    assert.equal(image.searchParams.get("url") ?? image.pathname, product.afbeelding);
    const price = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(product.prijsCents / 100).replace(/\s/g, "");
    assert.ok(row.price.replace(/\s/g, "").includes(price));
    assert.ok(row.option.replace(/\s/g, "").includes(price));
    const detail = new URL(row.detail, "https://example.test");
    assert.equal(detail.pathname, `/nl/feestdagen/${product.slug}`);
    const message = new URL(row.whatsapp).searchParams.get("text");
    assert.ok(message.includes(product.naam));
    assert.ok(message.replace(/\s/g, "").includes(price));
  }
  console.log("Browser evidence matches canonical photos, prices, detail links and WhatsApp messages for all 12 variants.");
}

const { getLocationStatus } = load("src/lib/openingHours.ts");
const scenarios = [
  ["2026-11-03T07:59:00Z", { isOpen: false, soort: "vandaagVanaf", tijd: "09:00" }],
  ["2026-11-03T08:00:00Z", { isOpen: true, soort: "openTot", tijd: "18:00" }],
  ["2026-11-03T16:59:00Z", { isOpen: true, soort: "openTot", tijd: "18:00" }],
  ["2026-11-03T17:00:00Z", { isOpen: false, soort: "morgenVanaf", tijd: "09:00" }],
  ["2026-11-02T12:00:00Z", { isOpen: false, soort: "morgenVanaf", tijd: "09:00" }],
  ["2026-11-07T15:59:00Z", { isOpen: true, soort: "openTot", tijd: "17:00" }],
  ["2026-11-07T16:00:00Z", { isOpen: false, soort: "dagVanaf", dag: 2, tijd: "09:00" }],
  ["2026-11-08T12:00:00Z", { isOpen: false, soort: "dagVanaf", dag: 2, tijd: "09:00" }],
  // Before/after summer time, plus autumn return to winter time.
  ["2026-03-27T08:00:00Z", { isOpen: true, soort: "openTot", tijd: "18:00" }],
  ["2026-03-31T06:59:00Z", { isOpen: false, soort: "vandaagVanaf", tijd: "09:00" }],
  ["2026-03-31T07:00:00Z", { isOpen: true, soort: "openTot", tijd: "18:00" }],
  ["2026-10-23T07:00:00Z", { isOpen: true, soort: "openTot", tijd: "18:00" }],
  ["2026-10-27T07:59:00Z", { isOpen: false, soort: "vandaagVanaf", tijd: "09:00" }],
];
const oldTZ = process.env.TZ;
for (const zone of ["UTC", "Europe/Amsterdam", "America/Los_Angeles", "Pacific/Auckland", "Asia/Tokyo"]) {
  process.env.TZ = zone;
  for (const [instant, expected] of scenarios) assert.deepEqual(getLocationStatus("winkel", new Date(instant)), expected, `${zone}: ${instant}`);
}
if (oldTZ === undefined) delete process.env.TZ; else process.env.TZ = oldTZ;
const { BEELD, homepageHeroBeeld } = load("src/lib/beeld.ts");
const originalGevel = { ...BEELD.winkelGevel };
const originalHistory = BEELD.historie1938.bestand;
BEELD.winkelGevel.bestand = "";
assert.equal(homepageHeroBeeld("nl").src, "/images/recepten/zalm-citroen-dille.webp");
assert.match(homepageHeroBeeld("en").caption, /salmon/);
Object.assign(BEELD.winkelGevel, { bestand: "/images/test-owner-front.webp", alt: "Werkelijk aangeleverde gevel", bijschrift: "Onze eigen winkel" });
assert.deepEqual(homepageHeroBeeld("nl"), { src: "/images/test-owner-front.webp", alt: "Werkelijk aangeleverde gevel", caption: "Onze eigen winkel" });
for (const locale of ["en", "de"]) {
  const hero = homepageHeroBeeld(locale);
  assert.equal(hero.src, "/images/test-owner-front.webp");
  assert.equal(hero.alt, originalGevel.vertalingen[locale].alt);
  assert.equal(hero.caption, originalGevel.vertalingen[locale].bijschrift);
  assert.notEqual(hero.alt, BEELD.winkelGevel.alt);
}
Object.assign(BEELD.winkelGevel, originalGevel);
assert.equal(BEELD.historie1938.bestand, originalHistory);
assert.notEqual(BEELD.historieNu.alt, BEELD.historie1938.alt);
console.log(`Shop checks passed: 12 variants, URL round trips/fallbacks, ${scenarios.length * 5} timezone/boundary cases.`);

// Real old-cart helpers: add -> reload/read -> remove -> reload, malformed storage and separate sessions.
const storage = () => { const values = new Map(); return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)}; };
globalThis.localStorage=storage(); globalThis.sessionStorage=storage();
const cart=load("src/lib/mandje.ts");
localStorage.setItem(cart.MANDJE_OPSLAG, JSON.stringify([null,{slug:"removed"},{slug:"kabeljauwfilet",hoeveelheid:"500 gram"},{slug:"kabeljauwfilet"},{slug:"haring",hoeveelheid:42}]));
assert.equal(cart.leesMandje().length,2); assert.equal(cart.leesMandje()[0].hoeveelheid,"500 gram"); assert.equal(cart.leesMandje()[1].hoeveelheid,"");
assert.equal(localStorage.getItem(cart.MANDJE_OPSLAG),null);
cart.bewaarMandje([cart.maakRegel("haring")]); assert.equal(cart.leesMandje()[0].slug,"haring");
cart.bewaarMandje([]); assert.deepEqual(cart.leesMandje(),[]);
localStorage.setItem(cart.MANDJE_OPSLAG,JSON.stringify([{slug:"haring"}])); assert.deepEqual(cart.leesMandje(),[]); // deliberate empty beats stale legacy
localStorage.removeItem(cart.MANDJE_OPSLAG); globalThis.sessionStorage=storage(); assert.deepEqual(cart.leesMandje(),[]);
const dates=load("src/lib/pickup-date.ts");
assert.equal(dates.amsterdamToday(new Date("2026-11-03T23:30:00Z")),"2026-11-04");
assert.equal(dates.amsterdamToday(new Date("2026-07-03T22:30:00Z")),"2026-07-04");
assert.equal(dates.validPickupDate("2026-11-03",new Date("2026-11-03T23:30:00Z")),false);
assert.equal(dates.validPickupDate("2026-11-04",new Date("2026-11-03T23:30:00Z")),true);
assert.equal(dates.calendarDate("2027-02-29"),false); assert.equal(dates.calendarDate("2028-02-29"),true);
assert.equal(dates.validPickupDate(""),true);
console.log("Legacy cart migration/reload/removal/session isolation and Amsterdam pickup-date boundaries passed.");
