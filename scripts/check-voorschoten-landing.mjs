// Read-only checks: this does not submit forms, orders or indexing requests.
import assert from 'node:assert/strict';

const origin = process.argv[2] || 'http://localhost:3011';
const path = '/nl/viswinkel-voorschoten';
const canonical = 'https://www.schaapsvishandel.nl' + path;
let checks = 0;
function check(condition, message) { checks++; assert.ok(condition, message); }
const response = await fetch(origin + path, {redirect: 'manual'});
const html = await response.text();
const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || '';
check(response.status === 200, 'Landing page must return 200');
check(!response.headers.get('x-robots-tag')?.includes('noindex'), 'Landing page must be indexable');
check(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html), 'No noindex meta');
check(html.includes(`rel="canonical" href="${canonical}"`), 'Self canonical');
check(/<title>Visboer Voorschoten bij Hoogvliet op vrijdag/.test(html), 'Local search title');
check(html.includes('name="description" content="Visboer Voorschoten?'), 'Local description');
check(html.includes(`property="og:url" content="${canonical}"`), 'Social canonical');
check((main.match(/<h1\b/g) || []).length === 1, 'Exactly one H1');
const hero = main.match(/<header\b[^>]*class="fresh-hero"[\s\S]*?<\/header>/)?.[0] || '';
for (const text of ['Visboer Voorschoten', 'Hoogvliet', '08:00', '17:30', 'Veurseweg 18', '2252 AA', 'scherpe prijzen']) {
  check(hero.includes(text), `Hero missing ${text}`);
}
check(!/visarend|vis en maatjes/i.test(main), 'Do not target competitor names in customer-facing copy');
check(!/de scherpste|de beste|nummer [1é]/i.test(main), 'No unsupported comparative superlatives');
check(!main.includes('Voorschoterweg'), 'No stale route');
check(main.includes('Hoogvliet+Veurseweg+18+2252+AA+Voorschoten'), 'Correct Google Maps destination');
check(main.includes('Alleen visschalen'), 'Platter-only ordering policy');
const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(m => JSON.parse(m[1]));
const location = schemas.find(s => s['@id']?.endsWith('#kraam-voorschoten'));
check(location?.['@type'] === 'GroceryStore', 'Specific local business schema');
check(location?.url === canonical && location?.image?.startsWith('https://'), 'Local schema URL and image');
check(location?.address?.streetAddress === 'Veurseweg 18' && location?.address?.postalCode === '2252 AA', 'Structured address matches visible address');
check(location?.openingHoursSpecification?.[0]?.dayOfWeek?.[0] === 'Friday', 'Friday only');
check(location?.openingHoursSpecification?.[0]?.opens === '08:00' && location?.openingHoursSpecification?.[0]?.closes === '17:30', 'Correct stand hours, not supermarket hours');
const faq = schemas.find(s => s['@type'] === 'FAQPage');
check(faq?.mainEntity?.length === 7, 'Seven practical questions');
for (const q of faq.mainEntity) check(main.includes(q.name) && main.includes(q.acceptedAnswer.text), 'FAQ schema must describe visible content');
const sitemap = await (await fetch(origin + '/sitemap.xml')).text();
const entry = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => m[1]).find(v => v.includes(`<loc>${canonical}</loc>`));
check(entry?.includes('2026-09-29'), 'Accurate local page lastmod');
const home = await (await fetch(origin + '/nl')).text();
check(home.includes('Visboer Voorschoten: vrijdag bij Hoogvliet'), 'Descriptive homepage internal link');
const paths = [...new Set([...main.matchAll(/href="(\/nl[^"?#]*)/g)].map(m => m[1]))];
await Promise.all(paths.map(async p => {
  const target = await fetch(origin + p, {redirect: 'manual'});
  await target.text();
  check(target.status === 200, `Internal link ${p}: HTTP ${target.status}`);
}));
console.log(JSON.stringify({origin, path, checks, internalLinks: paths.length, failures: 0}));
