// Check the actual chosen image resources on both runtimes, without requests to third parties.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const origin=process.env.AUDIT_ORIGIN||'http://localhost:3037';
assert.match(origin,/^http:\/\/(localhost|127\.0\.0\.1):\d+$/);
const manifest=JSON.parse(await fs.readFile('src/lib/static-image-variants.json','utf8'));
const byPath=new Map(Object.entries(manifest).flatMap(([original,m])=>m.variants.map(v=>[v.src,{...v,original,originalBytes:m.originalBytes}])));
const browser=await chromium.launch({channel:'chrome',headless:true}),results=[];
try{
 for(const width of [390,1440]){
  const context=await browser.newContext({viewport:{width,height:900}}),requests=[],errors=[];
  await context.route('**/*',r=>new URL(r.request().url()).origin!==origin||r.request().method()!=='GET'?r.abort():r.continue());
  const page=await context.newPage();page.on('request',r=>requests.push(new URL(r.url()).pathname));page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/nl',{waitUntil:'networkidle'});
  const height=await page.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<height;y+=700){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(80);}
  await page.waitForLoadState('networkidle');
  const chosen=await page.locator('picture img').evaluateAll(images=>images.map(i=>({src:new URL(i.currentSrc).pathname,loaded:i.complete&&i.naturalWidth>0})));
  assert.equal(chosen.length,7);assert.equal(errors.length,0);
  let bytes=0,originalBytes=0;
  for(const image of chosen){assert.ok(image.loaded);const v=byPath.get(image.src);assert.ok(v,image.src);bytes+=v.bytes;originalBytes+=v.originalBytes;}
  assert.ok(!requests.some(p=>p in manifest),'Browser must not also download the original photos');
  assert.ok(bytes<originalBytes*.25,'Chosen images must retain the measured byte reduction');
  results.push({width,chosen,bytes,originalBytes,reductionPercent:Math.round((1-bytes/originalBytes)*1000)/10,errors});
  await context.close();
 }
}finally{await browser.close();}
await fs.writeFile(process.argv[2]||'../design-preview/master-audit/static-images-browser.json',JSON.stringify({origin,results},null,2));
console.log(JSON.stringify(results.map(({chosen,...summary})=>summary)));
