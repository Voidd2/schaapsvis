// Read-only check from a GitHub-hosted runner, outside the owner's IP allowlist.
// The production domain is public. Alternate deployment hosts stay private.
import assert from 'node:assert/strict';
import { seasonalCatalogOpen, seasonalPathPaused } from '../src/lib/seasonal-availability.ts';
const origins=[
 'https://schaapsvis.schaapsvis.workers.dev',
 'https://schaapsvis.vercel.app',
 'https://schaapsvis-9sai.vercel.app',
];
for(const origin of origins){
const checks=[];
for(const route of ['/nl','/en/assortiment','/de/feestdagen','/nl/account','/nl/beheer/start']){
 const response=await fetch(origin+route,{redirect:'manual',headers:{'User-Agent':'Schaapsvis-locked-site-check'},signal:AbortSignal.timeout(20000)});
 assert.equal(response.status,200,route);
 assert.match(response.headers.get('x-robots-tag')||'',/noindex/,route);
 assert.match(response.headers.get('cache-control')||'',/no-store/,route);
 const html=await response.text();
 assert.match(html,/<input\b[^>]*type="password"/,`${route}: password gate`);
 assert.match(html,/\/api\/unlock/,`${route}: site unlock form`);
 assert.ok(!html.includes('application/ld+json'),`${route}: no public content schema`);
 checks.push({route,status:response.status,passwordGate:true,noindex:true,noStore:true});
}
const ancillary={};
for(const route of ['/robots.txt','/sitemap.xml']){
 const response=await fetch(origin+route,{redirect:'manual',signal:AbortSignal.timeout(20000)});
 assert.equal(response.status,200,`${origin}${route}`);
 const body=await response.text();
 // The retained legacy project rewrites even crawler endpoints to its gate.
 // This is not a valid robots file, but is acceptable only if access remains
 // closed and no public sitemap or content is exposed. Current hosts stay strict.
 const legacyGate=origin==='https://schaapsvis-9sai.vercel.app' && /<input\b[^>]*type="password"/.test(body);
 if(legacyGate){
  assert.match(response.headers.get('x-robots-tag')||'',/noindex/,`${origin}${route}: gate noindex`);
  assert.match(response.headers.get('cache-control')||'',/no-store/,`${origin}${route}: gate no-store`);
  assert.ok(body.includes('/api/unlock')&&!body.includes('application/ld+json')&&!body.includes('<loc>'),`${origin}${route}: closed gate only`);
  ancillary[route]='legacy-password-gate';
 }else{
  if(route==='/robots.txt') assert.ok(/Disallow:\s*\//.test(body),`${origin}: robots must disallow crawling`);
  else assert.ok(!body.includes('<loc>')&&body.includes('<urlset'),`${origin}: empty XML sitemap`);
  ancillary[route]=route==='/robots.txt'?'disallow-all':'empty-xml';
 }
}
console.log(JSON.stringify({origin,checks,ancillary,cookies:false,formSubmissions:0}));
}

if (!process.argv.includes('--previews-only')) {
  const origin = 'https://schaapsvishandel.nl';
  async function checkPublic() {
    for (const route of ['/nl', '/nl/varlaks', '/en/assortiment', '/de/bezoek-ons']) {
      const res = await fetch(origin + route, {redirect:'manual',signal:AbortSignal.timeout(15000)});
      assert.equal(res.status, 200, route);
      assert.doesNotMatch(res.headers.get('x-robots-tag') || '', /noindex/, route);
      const body = await res.text();
      assert.doesNotMatch(body, /action="\/api\/unlock"/, route);
      assert.match(body, /<h1\b[^>]*>/i, route);
      assert.ok(body.includes('href="'+origin+route+'"'), route+' canonical URL');
    }
    const robots = await (await fetch(origin+'/robots.txt')).text();
    assert.match(robots, /^Allow:\s*\/\s*$/mi);
    assert.doesNotMatch(robots, /^Disallow:\s*\/\s*$/mi);
    const sitemap = await (await fetch(origin+'/sitemap.xml')).text();
    assert.ok(sitemap.includes(origin+'/nl/varlaks</loc>'));
    if (!seasonalCatalogOpen) {
      for (const [, url] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) assert.ok(!seasonalPathPaused(new URL(url).pathname), url);
      for (const route of ['/de/feestdagen', '/nl/feestdagen/verse-vis', '/en/barbecue-gourmet', '/nl/gourmetschotel', '/en/visschalen', '/nl/relatiegeschenken']) {
        const res = await fetch(origin+route, { redirect:'manual', signal:AbortSignal.timeout(15000) });
        assert.equal(res.status, 307, route);
        assert.equal(new URL(res.headers.get('location'), origin).pathname, route.slice(0,3)+'/assortiment', route);
      }
    }
    for (const [path, status] of [['/me',401],['/admin/student-applications',403]]) {
      const res = await fetch(origin+'/api/members'+path, {redirect:'manual'});
      assert.equal(res.status, status, path);
    }
  }
  // The GitHub runner can start before the Cloudflare production build.
  for (let attempt = 0; ; attempt++) {
    try { await checkPublic(); break; }
    catch (error) {
      if (attempt >= 20) throw error;
      await new Promise(resolve => setTimeout(resolve, 15000));
    }
  }
  console.log('Public pages, crawl controls and member/admin access verified without cookies.');
}
