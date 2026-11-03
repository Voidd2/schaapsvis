// Read-only check from a GitHub-hosted runner, outside the owner's IP allowlist.
// The site intentionally remains private until a separate launch decision.
import assert from 'node:assert/strict';
const origins=[
 'https://schaapsvishandel.nl',
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
