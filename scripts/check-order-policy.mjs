// Run against a local, public-mode server. Never submits a valid order.
const origin = process.argv[2] || 'http://localhost:3000';
const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname);
if (!urls.length) throw new Error('Sitemap empty: start the local server with SITE_PUBLIC=on.');
const failures = [];
const images = new Set();
let checked = 0;
const queue = [...urls];
await Promise.all(Array.from({length: 6}, async () => {
  while (queue.length) {
    const path = queue.shift();
    try {
      const response = await fetch(origin + path);
      const html = await response.text();
      if (response.status !== 200) failures.push({path, status: response.status});
      for (const [, href] of html.matchAll(/<a\b[^>]*href="([^"]*)"/g)) {
        if (/^\/(nl|en|de)\/bestellen(?:\?|$)/.test(href) && !/^\/(nl|en|de)\/(visschalen|bestellen)(?:\/|$)/.test(path)) {
          failures.push({path, unsafeCheckoutLink: href});
        }
      }
      for (const [, src] of html.matchAll(/<img\b[^>]*src="([^"]*)"/g)) {
        if (src.startsWith('/')) images.add(src.replaceAll('&amp;', '&'));
      }
      checked++;
    } catch (error) { failures.push({path, error: String(error)}); }
  }
}));
for (const src of images) {
  const response = await fetch(origin + src);
  if (response.status !== 200) failures.push({image: src, status: response.status});
  await response.arrayBuffer();
}
const rejectionCases = [{soort:'verse-vis', regels:[{slug:'zalmfilet', aantal:1}]}, {}, null];
for (const body of rejectionCases) {
  const response = await fetch(`${origin}/api/bestelling`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)});
  if (response.status !== 400) failures.push({rejectedPayload:body, status:response.status});
}
console.log(JSON.stringify({pagesChecked:checked, imagesChecked:images.size, rejectedNonPlatterRequests:rejectionCases.length, failures}, null, 2));
if (failures.length) process.exitCode = 1;
