// Read-only release checks. Never sends a message or submits an order.
const origin = process.argv[2] || 'http://localhost:3000';
const failures = [];
const warnings = [];
const titles = new Map();
const descriptions = new Map();
const pageResults = [];
const sitemapResponse = await fetch(origin + '/sitemap.xml');
const xml = await sitemapResponse.text();
const paths = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname);
if (!xml.includes('<urlset') || !paths.length) throw new Error('Public sitemap unavailable');
if (paths.some(p => /\/(bestellen|bezorgen)(\/|$)/.test(p))) failures.push('Checkout or delivery in sitemap');
const robotsResponse = await fetch(origin + '/robots.txt');
const robots = await robotsResponse.text();
if (!robots.includes('Sitemap:') || /Disallow: \/\s*(?:\n|$)/.test(robots)) failures.push('Robots blocks public site');
const links = new Set();
const queue = [...paths];
let pagesChecked = 0, dishSchemas = 0;
await Promise.all(Array.from({length: 6}, async () => {
  while (queue.length) {
    const path = queue.shift();
    const response = await fetch(origin + path);
    const html = await response.text();
    const problems = [];
    if (response.status !== 200) problems.push('HTTP ' + response.status);
    if (response.headers.get('x-robots-tag')?.includes('noindex')) problems.push('Header noindex');
    if (!/<title>[^<]+<\/title>/.test(html)) problems.push('Missing title');
    if (!/name="description" content="[^"]+"/.test(html)) problems.push('Missing description');
    if (!/rel="canonical" href="https:\/\/www\.schaapsvishandel\.nl\//.test(html)) problems.push('Missing canonical');
    if (!/property="og:image" content="https:\/\//.test(html)) problems.push('Missing OG image');
    if (!/property="og:url" content="https:\/\//.test(html)) problems.push('Missing OG URL');
    if (!/name="twitter:card" content="summary_large_image"/.test(html)) problems.push('Missing Twitter card');
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
    const description = html.match(/name="description" content="([^"]+)"/)?.[1] ?? '';
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
    if (canonical && new URL(canonical).pathname !== path) problems.push('Sitemap URL differs from canonical');
    for (const [map, value, kind] of [[titles, title, 'title'], [descriptions, description, 'description']]) {
      if (value && map.has(value)) warnings.push({path, issue: `Duplicate ${kind}`, alsoAt: map.get(value)});
      else if (value) map.set(value, path);
    }
    if (title.length > 75) warnings.push({path, issue:'Long title', length:title.length});
    for (const image of html.matchAll(/<img\b[^>]*>/g)) {
      if (!/\balt="/.test(image[0])) problems.push('Image without alt attribute');
    }
    if ((html.match(/<h1\b/g) || []).length !== 1) problems.push('H1 count');
    if (html.includes('"FishStore"')) problems.push('Invalid FishStore schema');
    if (/content="noindex/.test(html)) problems.push('Page noindex');
    for (const [,href] of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      if (/^\/(nl|en|de)\/bezorgen(?:\/|$)/.test(href)) problems.push('Obsolete delivery link ' + href);
      if (href.startsWith('/') && !href.startsWith('//')) links.add(href.split('#')[0].split('?')[0]);
    }
    for (const [,body] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      const data = JSON.parse(body);
      const schemas = Array.isArray(data) ? data : [data];
      for (const schema of schemas) {
        if (schema['@type'] === 'Recipe' && schema.image?.length) dishSchemas++;
        if (path.endsWith('/gravlaks') && schema['@type'] === 'Recipe' && schema.totalTime !== 'PT48H25M') problems.push('Incorrect gravlaks duration');
      }
    }
    if (problems.length) failures.push({path, problems});
    pageResults.push({path, title, description, canonical, h1Count:(html.match(/<h1\b/g)||[]).length, problems});
    pagesChecked++;
  }
}));
for (const path of links) {
  const response = await fetch(origin + path);
  await response.text();
  if (response.status !== 200) failures.push({link:path, status:response.status});
}
for (const locale of ['nl','en','de']) {
  for (const suffix of ['', '/leiden', '/voorschoten']) {
    const response = await fetch(origin + '/' + locale + '/bezorgen' + suffix, {redirect:'manual'});
    if (response.status !== 308 || !response.headers.get('location')?.endsWith('/' + locale + '/visschalen')) failures.push({redirect:locale+suffix,status:response.status});
    await response.text();
  }
  const checkout = await (await fetch(origin + '/' + locale + '/bestellen')).text();
  if (!/name="robots" content="noindex/.test(checkout)) failures.push('Checkout not noindex: ' + locale);
}
const result = {pagesChecked, internalLinksChecked:links.size, recipesWithDishImage: dishSchemas, deliveryRedirectsChecked:9, publicRobots:!robots.includes('Disallow: /\n'), failures, warnings};
console.log(JSON.stringify(result, null, 2));
if (process.argv[3]) {
  const fs = await import('node:fs/promises');
  await fs.writeFile(process.argv[3], JSON.stringify({...result, pages:pageResults}, null, 2));
}
if (failures.length) process.exitCode = 1;
