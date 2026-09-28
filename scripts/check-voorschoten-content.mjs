import fs from 'node:fs/promises';
import ts from 'typescript';
const origin = process.argv[2] || 'http://localhost:3011';
const source = await fs.readFile('src/lib/blog-voorschoten.ts', 'utf8');
const code = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText;
const exported = {};
new Function('exports', code)(exported);
const posts = exported.VOORSCHOTEN_ARTIKELEN;
const failures = [];
const assert = (ok, message) => { if (!ok) failures.push(message); };
const hub = await (await fetch(origin + '/nl/viswinkel-voorschoten')).text();
const sitemap = await (await fetch(origin + '/sitemap.xml')).text();
const details = [];
assert(posts.length === 3, 'Expected three distinct local topics');
assert(new Set(posts.map(p => p.fotoUrl)).size === posts.length, 'Duplicate local images');
for (const post of posts) {
  const path = '/nl/blog/' + post.slug;
  const response = await fetch(origin + path);
  const html = await response.text();
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || '';
  assert(response.status === 200, `${path}: HTTP ${response.status}`);
  assert(hub.includes(path), `${path}: absent from local hub`);
  assert(sitemap.includes(path), `${path}: absent from sitemap`);
  assert(main.includes('/nl/viswinkel-voorschoten'), `${path}: no backlink to local hub`);
  assert(main.includes('08:00') && main.includes('17:30'), `${path}: local hours missing`);
  assert((main.match(/<h1\b/g) || []).length === 1, `${path}: H1 count`);
  assert(main.includes(post.fotoUrl.replaceAll('/', '%2F')) || main.includes(post.fotoUrl), `${path}: missing photo`);
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(m => JSON.parse(m[1]));
  const article = schemas.find(s => s['@type'] === 'Article');
  const faq = schemas.find(s => s['@type'] === 'FAQPage');
  assert(article?.inLanguage === 'nl-NL' && article?.mainEntityOfPage?.endsWith(path), `${path}: Article schema`);
  assert(faq?.mainEntity?.length === post.vragen.length, `${path}: FAQ coverage`);
  for (const q of post.vragen) assert(main.includes(q.v) && main.includes(q.a), `${path}: FAQ not visible in HTML`);
  for (const link of post.gerelateerdeLinks.filter(l => !l.href.startsWith('http'))) {
    const target = await fetch(origin + '/nl' + link.href, {redirect: 'manual'});
    await target.text();
    assert(target.status === 200, `${path}: related link ${link.href} HTTP ${target.status}`);
  }
  for (const slug of post.gerelateerdeRecepten || []) {
    const target = await fetch(origin + '/nl/recepten/' + slug, {redirect: 'manual'});
    await target.text();
    assert(target.status === 200, `${path}: recipe ${slug} HTTP ${target.status}`);
  }
  const words = post.secties.flatMap(s => s.alineas).join(' ').split(/\s+/).length;
  assert(words >= 400, `${path}: incomplete editorial body`);
  assert(post.excerpt.length <= 160, `${path}: overly long description`);
  for (const locale of ['en', 'de']) {
    const alias = await (await fetch(origin + '/' + locale + '/blog/' + post.slug)).text();
    assert(alias.includes(`rel="canonical" href="https://www.schaapsvishandel.nl${path}"`), `${locale}/${post.slug}: wrong language canonical`);
  }
  details.push({path, words, titleLength:post.title.length, descriptionLength:post.excerpt.length});
}
console.log(JSON.stringify({articles:posts.length, details, failures}, null, 2));
if (failures.length) process.exitCode = 1;
