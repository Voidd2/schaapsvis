// Read-only check from a GitHub-hosted runner, outside the owner's IP allowlist.
// The site intentionally remains private until a separate launch decision.
import assert from 'node:assert/strict';
const origin='https://schaapsvishandel.nl';
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
const robots=await fetch(origin+'/robots.txt');assert.equal(robots.status,200);assert.match(await robots.text(),/Disallow:\s*\//);
const sitemap=await fetch(origin+'/sitemap.xml');assert.equal(sitemap.status,200);assert.ok(!(await sitemap.text()).includes('<loc>'));
console.log(JSON.stringify({origin,checks,robotsBlocked:true,sitemapEmpty:true,cookies:false,formSubmissions:0}));
