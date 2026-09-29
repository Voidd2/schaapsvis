// Read-only regression checks for the requested editorial and local SEO changes.
const origin = process.argv[2] || 'http://localhost:3011';
const failures = [];
let checks = 0;
const assert = (ok, issue) => { checks++; if (!ok) failures.push(issue); };
async function page(path) {
  const response = await fetch(origin + path);
  assert(response.ok, `${path}: HTTP ${response.status}`);
  const html = await response.text();
  return {html, main: html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || ''};
}
function photos(html) {
  return [...html.matchAll(/<img\b[^>]*\ssrc="([^"]+)"/g)].map(m => {
    const url = new URL(m[1].replaceAll('&amp;', '&'), origin);
    return url.searchParams.get('url') || url.pathname;
  });
}
for (const locale of ['nl', 'en', 'de']) {
  const assortment = await page(`/${locale}/assortiment`);
  assert(!assortment.main.includes(`/assortiment/koolvis`), `${locale}: removed koolvis product still listed`);
  assert(assortment.main.includes('id="barbecue-gourmet"'), `${locale}: BBQ and gourmet catalogue missing`);
  assert(!assortment.main.includes('www.dirksvishandel.nl'), `${locale}: competitor URL exposed in assortment`);
  const removedProduct = await fetch(`${origin}/${locale}/assortiment/koolvis`, {redirect: 'manual'});
  assert(removedProduct.status === 308 && new URL(removedProduct.headers.get('location'), origin).pathname === `/${locale}/assortiment`, `${locale}: removed koolvis URL should redirect to assortment`);
  const locations = await page(`/${locale}/bezoek-ons`);
  assert(locations.main.includes('De+Waag+Aalmarkt+Leiden'), `${locale}: Saturday location should link to De Waag`);
  assert(locations.main.includes('Dille+%26+Kamille+Botermarkt+10+Leiden'), `${locale}: Wednesday location should use shared Maps link`);
  assert(!locations.main.includes('Haarlemmerstraat'), `${locale}: stale Maps destination on locations page`);
  const home = await page(`/${locale}`);
  const freshFishCard = [...home.main.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
    .find(([, , content]) => /<h3\b/.test(content) && content.includes('/images/producten-hd/kabeljauw.webp'));
  assert(freshFishCard?.[1] === `/${locale}/assortiment`, `${locale}: fresh fish card should open assortment, not WhatsApp`);
  const platters = await page(`/${locale}/visschalen`);
  const images = photos(platters.main);
  for (const name of ['visschotel-middel-5-8-pers', 'visschotel-luxe-10-14-pers']) {
    assert(images.includes(`/images/dirks/${name}.webp`), `${locale}: missing ${name} photo`);
  }
  assert((platters.main.match(/<figcaption/g) || []).length >= 20, `${locale}: example captions missing`);
  assert(!platters.main.includes('www.dirksvishandel.nl'), `${locale}: competitor URL exposed in page`);
  const bio = await page(`/${locale}/biologische-vis`);
  assert(!/href="[^"\s]*\/visschalen/.test(bio.main), `${locale}: unrelated platter link on organic page`);
  assert(bio.main.includes('MSC') && bio.main.includes('/assortiment/hollandse-garnalen'), `${locale}: MSC shrimp missing`);
  assert(bio.main.includes('VÅRLAKS'), `${locale}: salmon story missing`);
}
const blog = await page('/nl/blog');
const sitemap = await page('/sitemap.xml');
assert(!sitemap.html.includes('/assortiment/koolvis'), 'Removed koolvis product in sitemap');
const gravlaks = await page('/nl/recepten/gravlaks');
assert(gravlaks.main.includes('gravlaks regelmatig kant-en-klaar in de winkel'), 'Gravlaks: regular shop availability');
assert(!/vraag expliciet|Bespreek vooraf|vraag vooraf naar geschikte|Begin alleen met vis/.test(gravlaks.main), 'Gravlaks: suitability questions removed');
assert(gravlaks.main.includes('4°C') && gravlaks.main.includes('verminderde weerstand'), 'Gravlaks: cold storage and vulnerable-group advice preserved');
const marketBlog = await page('/nl/blog/marktdag-in-leiden-achter-de-kraam');
assert((marketBlog.main.match(/Open Google Maps/g) || []).length === 2, 'Market blog: two Google Maps buttons');
assert(marketBlog.main.includes('Dille+%26+Kamille+Botermarkt+10+Leiden'), 'Market blog: correct Wednesday Maps link');
assert(marketBlog.main.includes('De+Waag+Aalmarkt+Leiden'), 'Market blog: Saturday Maps link');
const marketText = marketBlog.main.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').toLowerCase();
assert(marketText.includes('woensdag 08:30–17:00') && marketText.includes('zaterdag 08:30–17:00'), 'Market blog: both opening hours');
assert(!marketBlog.main.includes('Haarlemmerstraat'), 'Market blog: incorrect Wednesday location removed');
const blogPhotos = photos(blog.main);
assert(blogPhotos.length >= 15, 'Blog photo coverage');
assert(new Set(blogPhotos).size === blogPhotos.length, 'Repeated blog thumbnail');
const calendar = await page('/nl/viskalender');
assert((calendar.main.match(/id="maand-\d+"/g) || []).length === 12, 'Calendar month anchors');
assert(new Set(photos(calendar.main).slice(-12)).size === 12, 'Calendar month photo variety');
assert(calendar.main.includes('Deze maand'), 'Server-rendered current month');
const home = await page('/nl');
assert(/href="\/nl\/viskalender"/.test(home.html.split('</header>')[0]), 'Calendar absent from header');
const local = await page('/nl/viswinkel-voorschoten');
assert(local.main.includes('08:00') && local.main.includes('17:30'), 'Voorschoten opening hours');
assert(local.main.includes('vrijdag') && local.main.includes('Hoogvliet'), 'Voorschoten weekly stall information');
const schemas = [...local.html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(m => {
  const parsed = JSON.parse(m[1]); return Array.isArray(parsed) ? parsed : [parsed];
});
const stall = schemas.find(s => s['@id']?.endsWith('#kraam-voorschoten'));
assert(stall?.openingHoursSpecification?.[0]?.opens === '08:00' && stall?.openingHoursSpecification?.[0]?.closes === '17:30', 'Voorschoten schema hours');
console.log(JSON.stringify({checks, blogPhotos: blogPhotos.length, uniqueBlogPhotos: new Set(blogPhotos).size, failures}, null, 2));
if (failures.length) process.exitCode = 1;
