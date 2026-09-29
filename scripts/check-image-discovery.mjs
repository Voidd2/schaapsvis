// Read-only public image sitemap, crawler and verification checks.
const origin=process.argv[2]||'http://localhost:3011';
const assert=(ok,msg)=>{if(!ok)throw new Error(msg);};
const xml=await(await fetch(origin+'/sitemap.xml')).text();
const images=[...xml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map(m=>m[1]);
assert(images.length>0,'Image sitemap missing');
const paths=[...new Set(images.map(u=>new URL(u).pathname))];
const queue=[...paths];let checked=0;
await Promise.all(Array.from({length:4},async()=>{
 while(queue.length){const path=queue.shift(),r=await fetch(origin+path);assert(r.status===200,'Image HTTP '+r.status+': '+path);assert(r.headers.get('content-type')?.startsWith('image/'),'Image MIME: '+path);await r.arrayBuffer();checked++;}
}));
const verification=await fetch(origin+'/googlee89efce6ff6c8463.html');
assert(verification.status===200,'Search Console verification unavailable');
assert((await verification.text()).trim()==='google-site-verification: googlee89efce6ff6c8463.html','Search Console verification content');
const robots=await(await fetch(origin+'/robots.txt')).text();
for(const bot of ['Googlebot','Bingbot','OAI-SearchBot','Claude-SearchBot','PerplexityBot'])assert(robots.includes(bot),'Crawler policy: '+bot);
const llms=await(await fetch(origin+'/llms.txt')).text();
assert(llms.includes('Friday 08:00–17:30')&&llms.includes('Veurseweg 18'),'LLM guide local information');
console.log(JSON.stringify({imageSitemapEntries:images.length,uniqueSourceImages:checked,searchConsoleHtml:true,crawlerPolicies:5,llmsGuide:true,failures:0}));
