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
Object.assign(BEELD.winkelGevel, originalGevel);
assert.equal(BEELD.historie1938.bestand, originalHistory);
assert.notEqual(BEELD.historieNu.alt, BEELD.historie1938.alt);
console.log(`Shop checks passed: 12 variants, URL round trips/fallbacks, ${scenarios.length * 5} timezone/boundary cases.`);
