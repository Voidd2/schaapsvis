/* eslint-disable @typescript-eslint/no-require-imports */
// Local browser regression tests only; never sends orders or WhatsApp messages.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const origin=process.argv[2]||'http://localhost:3011';
if(!/^http:\/\/(localhost|127\.0\.0\.1):/.test(origin))throw new Error('Local server required');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const errors=[];let flows=0;
 try{
  for(const locale of ['nl','en','de']){
   const context=await browser.newContext({viewport:{width:390,height:844}});
   const page=await context.newPage();page.on('pageerror',e=>errors.push(locale+': '+e.message));
   await page.goto(origin+'/'+locale,{waitUntil:'networkidle'});
   assert.equal(await page.locator('h1').count(),1);
   assert.equal(await page.locator('body').evaluate(el=>el.scrollWidth<=window.innerWidth+1),true,'Homepage mobile overflow '+locale);
   await page.goto(origin+'/'+locale+'/visschalen',{waitUntil:'networkidle'});
   const special=page.locator('#bijzondere-visschalen');
   assert.ok(await special.count(),'Special platter examples '+locale);
   assert.ok(!/€\s*\d/.test(await special.innerText()),'No individual special platter prices '+locale);
   for(const link of await special.locator('a[href^="https://wa.me/"]').all()){
    const message=new URL(await link.getAttribute('href')).searchParams.get('text')||'';
    assert.ok(!/€\s*\d/.test(message),'No individual price in special platter request '+locale);
   }
   const select=page.locator('button[aria-pressed="false"]').first();
   assert.ok(await select.count(),'Platter selection button '+locale);
   await select.click();
   assert.equal(await page.locator('button[aria-pressed="true"]').count(),1);
   const summary=page.locator('aside').first();
   const name={nl:'Borrelschaal',en:'Sharing platter',de:'Snackplatte'}[locale];
   assert.ok((await summary.innerText()).includes(name),'Localized selection '+locale);
   const summaryText=await summary.innerText();
   const averagePrice=/€\s*17[.,]50|17[.,]50\s*€/;
   assert.ok(averagePrice.test(summaryText),'Average platter price '+locale);
   const noAveragePrice=summaryText.replace(averagePrice,'');
   assert.ok(!/€\s*\d+[,.]\d{2}/.test(noAveragePrice),'No fixed platter price '+locale);
   const request=summary.locator('a[href^="https://wa.me/31624811678"]');
   assert.ok(await request.count(),'Platter WhatsApp request '+locale);
   const message=new URL(await request.getAttribute('href')).searchParams.get('text')||'';
   assert.ok(message.toLowerCase().includes(name.toLowerCase()),'Selected platter in WhatsApp request '+locale);
   assert.ok(!/€\s*\d+[,.]\d{2}/.test(message),'No fixed platter amount in request '+locale);
   await page.goto(origin+'/'+locale+'/assortiment',{waitUntil:'networkidle'});
   const product=page.locator('a[href="/'+locale+'/assortiment/varlaks-zalm"]').first();
   await product.click();await page.waitForURL('**/'+locale+'/assortiment/varlaks-zalm');await page.waitForLoadState('networkidle');
   const image=page.locator('main img').first();
   await image.scrollIntoViewIfNeeded();await image.evaluate(img=>img.decode());
   assert.ok(await image.getAttribute('alt'),'Product photo description '+locale);
   await page.goto(origin+'/'+locale+'/recepten',{waitUntil:'networkidle'});
   const input=page.locator('input[type="search"]');
   if(await input.count()){
    await input.fill({nl:'kabeljauw',en:'cod',de:'Kabeljau'}[locale]);
    assert.ok(await page.locator('a[href*="/recepten/"]').count(),'Recipe filter '+locale);
    await input.fill('');
   }
   assert.equal(await page.locator('.recipe-card').count(),37,'All recipes visible '+locale);
   assert.equal(await page.locator('body').evaluate(el=>el.scrollWidth<=window.innerWidth+1),true,'Recipes mobile overflow '+locale);
   for(const img of await page.locator('main img').all()){
    await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());
    assert.ok(await img.evaluate(el=>el.naturalWidth>0),'Recipe image loaded '+locale);
   }
   if(locale==='nl'){
    await page.locator('.recipe-card').first().screenshot({path:'../../outputs/recepten-mobiel-29-september.png'});
   }
   await context.close();flows+=5;
  }
  assert.deepEqual(errors,[],'Hydration/browser errors');
  console.log(JSON.stringify({languages:3,mobileViewport:'390×844',flows,browserErrors:errors,orderSubmissions:0,whatsappMessages:0}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
