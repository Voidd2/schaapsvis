// Verify optimized catalogue images and original zoom photos. No real requests.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const origin=process.env.AUDIT_ORIGIN||'http://localhost:3037';
assert.match(origin,/^http:\/\/(localhost|127\.0\.0\.1):\d+$/);
const manifest=JSON.parse(await fs.readFile('src/lib/static-image-variants.json','utf8'));
const variants=new Map(Object.entries(manifest).flatMap(([original,m])=>m.variants.map(v=>[v.src,{...v,original,originalBytes:m.originalBytes}])));
const output=process.argv[2]||'../design-preview/master-audit/catalog-images-browser.json';
const browser=await chromium.launch({channel:'chrome',headless:true}),rows=[];
try{
 for(const width of [390,1440]){
  const context=await browser.newContext({viewport:{width,height:900}});
  await context.route('**/*',r=>new URL(r.request().url()).origin!==origin||r.request().method()!=='GET'?r.abort():r.continue());
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const route of ['/nl','/nl/assortiment','/nl/visschalen','/nl/feestdagen','/nl/assortiment/kabeljauwfilet','/nl/feestdagen/visschotel-klein-3-5-pers']){
   await page.goto(origin+route,{waitUntil:'networkidle'});
   if(await page.getByRole('button',{name:'Weigeren',exact:true}).isVisible())await page.getByRole('button',{name:'Weigeren',exact:true}).click();
   for(const summary of await page.locator('main details > summary').all())if(await summary.isVisible())await summary.click();
   const height=await page.evaluate(()=>document.documentElement.scrollHeight);
   for(let y=0;y<height;y+=650){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(90);}
   await page.waitForLoadState('networkidle');
   const chosen=await page.locator('picture img').evaluateAll(images=>images.filter(i=>i.getClientRects().length).map(i=>({src:i.currentSrc?new URL(i.currentSrc).pathname:'',loaded:i.complete&&i.naturalWidth>0})));
   if(chosen.some(i=>!i.loaded))console.log(JSON.stringify({route,unloaded:await page.locator('picture img').evaluateAll(images=>images.filter(i=>i.getClientRects().length&&(!i.complete||!i.naturalWidth)).map(i=>({src:i.getAttribute('src'),alt:i.alt,box:i.getBoundingClientRect().toJSON(),display:getComputedStyle(i).display,visibility:getComputedStyle(i).visibility})))}));
   assert.ok(chosen.length>0,route);const unique=new Map();
   for(const image of chosen){assert.ok(image.loaded,route+image.src);const variant=variants.get(image.src);assert.ok(variant,image.src);unique.set(image.src,variant);}
   const bytes=[...unique.values()].reduce((n,v)=>n+v.bytes,0),originalBytes=[...new Map([...unique.values()].map(v=>[v.original,v.originalBytes])).values()].reduce((a,b)=>a+b,0);
   assert.ok(bytes<originalBytes*.5,`${route}: image byte reduction`);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route);
   if(route==='/nl/visschalen'){
    const button=page.locator('.seafood-photo').first();const cardSource=await button.locator('img').evaluate(i=>new URL(i.currentSrc).pathname);const original=variants.get(cardSource).original;
    await button.click();const modal=page.locator('dialog[open]');await modal.waitFor({state:'visible'});
    const enlarged=modal.locator('img');await enlarged.evaluate(i=>i.decode());
    const raw=new URL(await enlarged.getAttribute('src'),origin);assert.equal(raw.searchParams.get('url')||raw.pathname,original,'Zoom must retain the same original image');
    assert.equal(await modal.locator('picture').count(),0,'Full original retained in photo enlargement');
    await page.keyboard.press('Escape');assert.equal(await modal.count(),0);
   }
   await page.screenshot({path:output.replace('.json',`-${width}-${route.slice(1).replaceAll('/','-')}.png`),fullPage:true});
   rows.push({route,width,images:chosen.length,uniqueVariants:unique.size,bytes,originalBytes,reductionPercent:Math.round((1-bytes/originalBytes)*1000)/10});
  }
  assert.deepEqual(errors,[]);await context.close();
 }
}finally{await browser.close();}
await fs.writeFile(output,JSON.stringify({origin,rows,realSubmissions:0},null,2));console.log(JSON.stringify(rows));
