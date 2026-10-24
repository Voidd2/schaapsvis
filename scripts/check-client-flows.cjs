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
   const gallery=page.locator('#visschaal-inspiratie');
   assert.ok(await gallery.count(),'Fish platter photo gallery '+locale);
   assert.equal(await gallery.locator('li').count(),20,'All platter examples are shown '+locale);
   assert.match(await gallery.innerText(),/17[.,]50/,'Average per-person price is explained '+locale);
   assert.ok(!/\b(?:bestellen|checkout|winkelwagen)\b/i.test(await gallery.innerText()),'No online platter checkout '+locale);
   const platterCards=await gallery.locator('li').all();
   for(const card of platterCards){
    const text=await card.innerText();
    assert.ok(!/€\s*\d|\d+[,.]\d{2}\s*€/.test(text),'No individual platter price '+locale);
    const image=card.locator('img').first();
    await image.scrollIntoViewIfNeeded();await image.evaluate(img=>img.decode());
    assert.ok(await image.getAttribute('alt'),'Platter photo has descriptive alt '+locale);
    assert.ok(await image.evaluate(img=>img.naturalWidth>0),'Platter photo loads '+locale);
    const request=card.locator('a[href^="https://wa.me/31624811678"]');
    assert.equal(await request.count(),1,'Each platter uses the correct WhatsApp number '+locale);
    const message=new URL(await request.getAttribute('href')).searchParams.get('text')||'';
    assert.ok(message.length>0,'WhatsApp message is prefilled '+locale);
   }
   await page.goto(origin+'/'+locale+'/barbecue-gourmet',{waitUntil:'networkidle'});
   const barbecue=page.locator('#barbecue-gourmet');
   assert.ok(await barbecue.count(),'Barbecue and gourmet selection '+locale);
   assert.ok(await barbecue.locator('li').count()>0,'Barbecue/gourmet offers are shown '+locale);
   const salmonSkewer=barbecue.locator('#zalmspies');
   assert.ok(await salmonSkewer.count(),'Salmon skewer '+locale);
   assert.match(await salmonSkewer.innerText(),/4[.,]00|€\s*4(?:[,.]00)?/,'Salmon skewer is €4 each '+locale);
   assert.ok(await salmonSkewer.locator('a[href^="https://wa.me/31624811678"]').count(),'Salmon skewer is WhatsApp-only '+locale);
   assert.equal(await barbecue.locator('form').count(),0,'Barbecue/gourmet is not an online order form '+locale);
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
   await context.close();flows+=5;
  }
  assert.deepEqual(errors,[],'Hydration/browser errors');
  console.log(JSON.stringify({languages:3,mobileViewport:'390×844',flows,browserErrors:errors,orderSubmissions:0,whatsappMessages:0}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

