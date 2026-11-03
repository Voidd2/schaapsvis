// Read-only release checks. Never sends a message or submits an order.
const origin = process.argv[2] || 'http://localhost:3000';
const locked = process.argv.includes('--locked');
const attr=(tag,name)=>tag.match(new RegExp('\\b'+name+'="([^"]*)"','i'))?.[1];
const images=new Set();
// Regenerate with audit-content-data.mjs after changing the canonical product source.
const inventory=JSON.parse(await (await import('node:fs/promises')).readFile(new URL('../docs/seo/content-inventory.json',import.meta.url),'utf8'));
const expectedPrices=new Map(inventory.festive.map(p=>[p.slug,p.priceCents]));
const expectedArticles=new Map(inventory.blogs.map(p=>[p.slug,p]));
const failures = [];
const warnings = [];
const titles = new Map();
const descriptions = new Map();
const pageResults = [];
const sitemapResponse = await fetch(origin + '/sitemap.xml');
const xml = await sitemapResponse.text();
const paths = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname);
if (locked) {
  if (paths.length) failures.push('Locked sitemap exposes URLs');
  const robots = await (await fetch(origin + '/robots.txt')).text();
  if (!/Disallow: \/\s*(?:\n|$)/.test(robots)) failures.push('Locked robots does not block crawling');
  for (const path of ['/nl','/en/feestdagen','/de/assortiment/kabeljauwfilet','/nl/account','/nl/beheer/start']) {
    const response=await fetch(origin+path,{redirect:'manual'}),html=await response.text();
    if(!response.headers.get('x-robots-tag')?.includes('noindex')) failures.push({path,issue:'Locked HTML missing noindex header'});
    if(!html.includes('/api/unlock')) failures.push({path,issue:'Anonymous request did not render password form; test outside IP allowlist'});
  }
  const result={profile:'locked',failures}; console.log(JSON.stringify(result,null,2));
  if(process.argv[3]&&!process.argv[3].startsWith('--'))await (await import('node:fs/promises')).writeFile(process.argv[3],JSON.stringify(result,null,2));
  process.exit(failures.length?1:0);
}
if (!xml.includes('<urlset') || !paths.length) throw new Error('Public sitemap unavailable');
if (paths.some(p => /\/(bestellen|bezorgen)(\/|$)/.test(p))) failures.push('Checkout or delivery in sitemap');
const robotsResponse = await fetch(origin + '/robots.txt');
const robots = await robotsResponse.text();
if (!robots.includes('Sitemap:') || /Disallow: \/\s*(?:\n|$)/.test(robots)) failures.push('Robots blocks public site');
const links = new Set();
const queue = [...paths];
let pagesChecked = 0, dishSchemas = 0;
const concurrency=/^http:\/\/(localhost|127\.0\.0\.1):/.test(origin)?1:6;
await Promise.all(Array.from({length: concurrency}, async () => {
  while (queue.length) {
    const path = queue.shift();
    const response = await fetch(origin + path, {redirect:'manual'});
    const html = await response.text();
    const problems = [];
    if (response.status !== 200) problems.push('HTTP ' + response.status);
    if (response.headers.get('x-robots-tag')?.includes('noindex')) problems.push('Header noindex');
    if (!/<title>[^<]+<\/title>/.test(html)) problems.push('Missing title');
    if (!/name="description" content="[^"]+"/.test(html)) problems.push('Missing description');
    if (!/rel="canonical" href="https:\/\/schaapsvishandel\.nl\//.test(html)) problems.push('Missing apex canonical');
    if (!/property="og:image" content="https:\/\//.test(html)) problems.push('Missing OG image');
    if (!/property="og:url" content="https:\/\//.test(html)) problems.push('Missing OG URL');
    if (!/name="twitter:card" content="summary_large_image"/.test(html)) problems.push('Missing Twitter card');
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
    const description = html.match(/name="description" content="([^"]+)"/)?.[1] ?? '';
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
    const language = html.match(/<html[^>]*\blang="([^"]+)"/)?.[1];
    if (language !== path.split('/')[1]) problems.push('Incorrect HTML language');
    const alternates=Object.fromEntries([...html.matchAll(/<link\b[^>]*>/gi)].map(m=>[attr(m[0],'hreflang'),attr(m[0],'href')]).filter(([lang])=>lang));
    for(const locale of ['nl','en','de','x-default']) {
      const target=`https://schaapsvishandel.nl/${locale==='x-default'?'nl':locale}${path.slice(3)}`;
      if(alternates[locale]!==target)problems.push('Incorrect hreflang '+locale);
      if(!paths.includes(new URL(target).pathname))problems.push('Hreflang target outside canonical sitemap '+locale);
    }
    if (canonical && new URL(canonical).pathname !== path) problems.push('Sitemap URL differs from canonical');
    for (const [map, value, kind] of [[titles, title, 'title'], [descriptions, description, 'description']]) {
      if (value && map.has(value)) warnings.push({path, issue: `Duplicate ${kind}`, alsoAt: map.get(value)});
      else if (value) map.set(value, path);
    }
    if (title.length > 75) warnings.push({path, issue:'Long title', length:title.length});
    for (const image of html.matchAll(/<img\b[^>]*>/g)) {
      if (!/\balt="/.test(image[0])) problems.push('Image without alt attribute');
      const src=attr(image[0],'src')?.replaceAll('&amp;','&');
      if(src?.startsWith('/')){
        const url=new URL(src,origin),original=url.searchParams.get('url');
        images.add(original?.startsWith('/')?original:url.pathname);
      }
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
        if(schema['@type']==='Product' && schema.offers?.availability) problems.push('Unverified product stock claim');
        if(schema['@type']==='FAQPage') problems.push('Obsolete FAQ rich-result markup');
        if(schema.aggregateRating && ['GroceryStore','LocalBusiness','Organization'].includes(schema['@type']))problems.push('Self-serving review markup');
        if(schema['@type']==='Recipe'&&!schema.image?.length)warnings.push({path,issue:'No prepared-dish image; not eligible for Recipe rich results'});
        if(schema['@type']==='Recipe'&&(!schema.recipeIngredient?.length||!schema.recipeInstructions?.length||!schema.recipeYield||!schema.totalTime))problems.push('Incomplete recipe content');
        if(schema['@type']==='Product'&&schema.offers&&(!(Number(schema.offers.price)>0)||schema.offers.priceCurrency!=='EUR'))problems.push('Invalid known product price');
        if(schema['@type']==='Product'&&schema.offers){
          const expected=expectedPrices.get(path.split('/').at(-1));
          if(expected===undefined||Math.round(Number(schema.offers.price)*100)!==expected)problems.push('Offer differs from canonical price inventory');
        }
        if(schema['@type']==='Article'){
          const article=expectedArticles.get(path.split('/').at(-1));
          if(article&&(schema.datePublished!==article.published||schema.dateModified!==(article.modified||article.published)))problems.push('Article dates differ from source');
        }
        if (schema['@type'] === 'Recipe' && schema.image?.length) dishSchemas++;
        if (path.endsWith('/gravlaks') && schema['@type'] === 'Recipe' && schema.totalTime !== 'PT48H25M') problems.push('Incorrect gravlaks duration');
      }
    }
    if (problems.length) failures.push({path, problems});
    pageResults.push({path, status:response.status, language, title, description, canonical, alternates, h1Count:(html.match(/<h1\b/g)||[]).length, problems});
    pagesChecked++;
  }
}));
const linkQueue = [...links];
await Promise.all(Array.from({length: concurrency}, async () => {
  while (linkQueue.length) {
    const path = linkQueue.shift();
    const response = await fetch(origin + path);
    await response.text();
    if (response.status !== 200) failures.push({link:path, status:response.status});
  }
}));
for (const locale of ['nl','en','de']) {
  for(const kind of ['assortiment','feestdagen','recepten','blog']){
    const path=`/${locale}/${kind}/audit-nonexistent-verify-404`;
    const response=await fetch(origin+path,{redirect:'manual'});await response.text();
    if(response.status!==404)failures.push({path,status:response.status,issue:'Unknown resource must be 404'});
  }
  const former=await fetch(`${origin}/${locale}/frischer-fisch-leiden`,{redirect:'manual'});await former.text();
  if(former.status!==308||!former.headers.get('location')?.endsWith(`/${locale}/viswinkel-leiden`))failures.push('German former landing redirect: '+locale);
  for(const path of ['account','account/klant','beheer/start']){
    const response=await fetch(`${origin}/${locale}/${path}`),html=await response.text();
    if(!/name="robots" content="noindex/.test(html)&&!response.headers.get('x-robots-tag')?.includes('noindex'))failures.push('Private route not noindex: '+locale+'/'+path);
  }
  const filtered=await fetch(`${origin}/${locale}/assortiment?category=vis&utm_source=audit`),filteredHtml=await filtered.text();
  if(!filteredHtml.includes(`rel="canonical" href="https://schaapsvishandel.nl/${locale}/assortiment"`))failures.push('Filter canonical: '+locale);
  for (const suffix of ['', '/leiden', '/voorschoten']) {
    const response = await fetch(origin + '/' + locale + '/bezorgen' + suffix, {redirect:'manual'});
    if (response.status !== 308 || !response.headers.get('location')?.endsWith('/' + locale + '/visschalen')) failures.push({redirect:locale+suffix,status:response.status});
    await response.text();
  }
  const checkout = await (await fetch(origin + '/' + locale + '/bestellen')).text();
  if (!/name="robots" content="noindex/.test(checkout)) failures.push('Checkout not noindex: ' + locale);
}
for(const image of images){const response=await fetch(origin+image,{method:'HEAD'});if(response.status!==200)failures.push({image,status:response.status});}
const result = {pagesChecked, internalLinksChecked:links.size, imagesChecked:images.size, recipesWithDishImage: dishSchemas, deliveryRedirectsChecked:9, publicRobots:!robots.includes('Disallow: /\n'), failures, warnings};
console.log(JSON.stringify(result, null, 2));
if (process.argv[3]) {
  const fs = await import('node:fs/promises');
  await fs.writeFile(process.argv[3], JSON.stringify({...result, pages:pageResults}, null, 2));
}
if (failures.length) process.exitCode = 1;
