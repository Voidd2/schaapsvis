// Owner-approved inventory regression; optional read-only HTTP checks.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),ts=require('typescript'),cache=new Map();
function load(name){
 const file=path.resolve('src/lib',name+'.ts');
 if(cache.has(file))return cache.get(file);
 const exports={};cache.set(file,exports);
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 new Function('exports','require',code)(exports,n=>n.startsWith('./')?load(n.slice(2)):n.startsWith('@/lib/')?load(n.slice(6)):require(n));
 return exports;
}
const decisions=JSON.parse(fs.readFileSync('src/lib/assortiment-besluiten.json','utf8'));
const {products}=load('assortiment-data'),{productPhoto}=load('product-beeld');
const {productAvailability}=load('product-availability');
const recipes=load('recepten').recepten,blogs=load('blog').blogPosts;
const slugs=new Set(products.map(p=>p.slug));
assert.equal(slugs.size,products.length,'Unique catalogue entries');
assert.equal(products.length,decisions.originalCount-decisions.removed.length+decisions.added.length);
for(const slug of decisions.removed)assert.ok(!slugs.has(slug),'Removed '+slug);
for(const slug of decisions.added)assert.ok(slugs.has(slug),'Added '+slug);
for(const [slug,status] of Object.entries(decisions.availability))assert.equal(products.find(p=>p.slug===slug)?.beschikbaar,status,slug+' owner availability');
for(const r of recipes)assert.ok(!r.hoofdproduct||slugs.has(r.hoofdproduct),'Recipe product '+r.slug);
for(const b of blogs)for(const link of b.gerelateerdeLinks??[]){
 const slug=link.href.match(/^\/assortiment\/([^/?#]+)/)?.[1];
 if(slug)assert.ok(slugs.has(slug),'Retired blog link '+b.slug+' '+slug);
}
for(const [slug,target] of Object.entries(decisions.aliases)){
 assert.ok(decisions.removed.includes(slug),'Alias source is removed');
 const [,kind,targetSlug]=target.split('/');
 if(kind==='assortiment')assert.ok(slugs.has(targetSlug),'Alias product exists');
 if(kind==='recepten')assert.ok(recipes.some(r=>r.slug===targetSlug),'Alias recipe exists');
}
for(const p of products)for(const l of ['nl','en','de']){
 const photo=productPhoto(p,l),stock=productAvailability(p,l);
 assert.ok(photo?.src.startsWith('/images/'),'Self-hosted photo '+p.slug);
 assert.ok(fs.existsSync('public'+photo.src),'Local bytes '+p.slug);
 assert.ok(photo.alt&&stock.label&&stock.note,'Localized photo and stock '+l+'/'+p.slug);
 if(photo.credit)assert.ok(!/hartevelt|visarend|visenmaatjes/i.test(photo.credit.source),'No competitor source link');
}
assert.equal(products.find(p=>p.slug==='inktvis').beschikbaar,'request');
assert.match(products.find(p=>p.slug==='kibbeling').desc,/pollak/i);
assert.match(products.find(p=>p.slug==='lekkerbek').desc,/heek/i);
const origin=process.argv[2];let removedRoutes=0,activePages=0,redirects=0;
if(origin){
 const sitemap=await(await fetch(origin+'/sitemap.xml')).text();
 const tasks=['nl','en','de'].flatMap(l=>[
  ...decisions.removed.map(slug=>({l,slug,removed:true})),
  ...products.map(p=>({l,slug:p.slug,product:p}))
 ]);
 await Promise.all(Array.from({length:5},async()=>{
  while(tasks.length){
   const task=tasks.shift(),url=origin+'/'+task.l+'/assortiment/'+task.slug;
   const r=await fetch(url,{redirect:'manual'});
   if(task.removed){
    assert.ok(!sitemap.includes('<loc>https://www.schaapsvishandel.nl/'+task.l+'/assortiment/'+task.slug+'</loc>'),'Retired sitemap URL');
    const target=decisions.aliases[task.slug];
    assert.equal(r.status,target?308:404,url);
    if(target){assert.equal(new URL(r.headers.get('location'),origin).pathname,'/'+task.l+target);redirects++;}
    removedRoutes++;await r.text();continue;
   }
   assert.equal(r.status,200,url);const html=await r.text();
   const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]??'';
   const imgTags=[...main.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);
   assert.ok(imgTags.length>0,'Photo rendered '+url);
   for(const tag of imgTags)assert.ok(!/src="https?:\/\/(?!www\.schaapsvishandel\.nl)/.test(tag),'External image server '+url);
   assert.ok(!/href="[^"]*(?:hartevelt|visarend|visenmaatjes)/i.test(main),'Competitor link '+url);
   assert.ok(!/href="\/[^"]*\/bestellen/.test(main),'No ordinary product checkout '+url);
   activePages++;
  }
 }));
}
console.log(JSON.stringify({products:products.length,removedOrMerged:decisions.removed.length,added:decisions.added.length,availabilityRules:Object.keys(decisions.availability).length,recipes:recipes.length,allPhotosSelfHosted:true,removedRoutes,redirects,activePages,ordersSent:0,messagesSent:0,failures:0}));
