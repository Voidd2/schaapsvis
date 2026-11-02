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

if (process.env.PLATTER_DETAIL_EVIDENCE) {
  const rows = JSON.parse(fs.readFileSync(process.env.PLATTER_DETAIL_EVIDENCE, "utf8"));
  assert.equal(rows.length, 36);
  assert.equal(new Set(rows.map(r => `${r.locale}/${r.slug}`)).size, 36);
  for (const row of rows) {
    const product = localizedPlatterProduct(FEESTDAGEN_PRODUCTEN.find(p => p.slug === row.slug), row.locale);
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
    const message = new URL(row.whatsapp).searchParams.get("text");
    assert.ok(message.includes(product.naam));
    assert.ok(message.includes(platterPrice(product, row.locale)));
    for (const link of row.related) {
      const url = new URL(link.href, "https://example.test");
      const slug = url.pathname.split("/").at(-1);
      const related = localizedPlatterProduct(FEESTDAGEN_PRODUCTEN.find(p => p.slug === slug), row.locale);
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

const { inquiryText, platterInquiryMessage } = load("src/lib/platter-inquiry.ts");
const { whatsappLink } = load("src/lib/bedrijf.ts");
for (const locale of ["nl", "en", "de"]) {
  const t = inquiryText(locale);
  const emptyOptional = { preference: "advies", people: "8", use: "advies", date: "2026-12-24", dateUnknown: true, budget: "  ", wishes: "  " };
  const basic = platterInquiryMessage(locale, emptyOptional);
  assert.ok(basic.includes(`${t.people}: 8`));
  assert.ok(basic.includes(t.unknown));
  assert.ok(!basic.includes("2026"));
  assert.ok(!basic.includes(t.budgetMessage));
  assert.ok(!basic.includes(t.wishesMessage));
  const full = platterInquiryMessage(locale, { ...emptyOptional, preference: "eigen", use: "maaltijd", dateUnknown: false, budget: "125.50", wishes: "Graag zalm & paling\nAllergie: sesam?" });
  assert.ok(full.includes(t.preferences.eigen));
  assert.ok(full.includes(t.uses.maaltijd));
  assert.ok(full.includes("2026"));
  assert.ok(!full.includes(t.unknown));
  assert.ok(full.includes(`${t.budgetMessage}: € 125.50`));
  assert.ok(full.includes("Graag zalm & paling\nAllergie: sesam?"));
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
