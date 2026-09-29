// Read-only browser checks: decode every catalogue photo and follow detail links.
const {chromium}=require('playwright'),assert=require('assert/strict'),path=require('path');
const origin=process.argv[2]||'http://localhost:3011';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const errors=[];let decoded=0,details=0;
 try{
  for(const locale of ['nl','en','de']){
   const page=await browser.newPage({viewport:{width:390,height:844}});
   page.on('pageerror',e=>errors.push(locale+': '+e.message));
   await page.goto(`${origin}/${locale}/assortiment`,{waitUntil:'networkidle'});
   assert.equal(await page.locator('.collection img').count(),128,locale+' catalogue coverage');
   const images=await page.locator('.collection img').evaluateAll(async imgs=>{
    imgs.forEach(img=>img.loading='eager');
    await Promise.all(imgs.map(img=>img.decode()));
    return imgs.map(img=>({width:img.naturalWidth,height:img.naturalHeight,alt:img.alt}));
   });
   assert.ok(images.every(img=>img.width>0&&img.height>0&&img.alt),locale+' image decode/description');decoded+=images.length;
   assert.ok(await page.locator('body').evaluate(el=>el.scrollWidth<=innerWidth+1),locale+' mobile overflow');
   if(locale==='nl'){
    await page.locator('input[type="search"]').fill('tonijn');
    await page.locator('.collection-item').first().screenshot({path:path.resolve('../../outputs/assortiment-internet-mobiel.png')});
    await page.locator('input[type="search"]').fill('');
   }
   for(const slug of ['scholfilet','tonijnfilet','zeewiersalade','zeeforel','sushi-mix']){
    const link=page.locator(`a[href="/${locale}/assortiment/${slug}"]`).first();
    await link.click();await page.waitForURL(`**/${locale}/assortiment/${slug}`);
    const img=page.locator('main img').first();await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());
    assert.ok(await img.evaluate(i=>i.naturalWidth>0),locale+'/'+slug+' detail decode');details++;
    if(locale==='nl'&&slug==='tonijnfilet')await page.screenshot({path:path.resolve('../../outputs/tonijnfilet-internet-mobiel.png'),fullPage:true});
    await page.goto(`${origin}/${locale}/assortiment`,{waitUntil:'networkidle'});
   }
   await page.close();
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({catalogueImagesDecoded:decoded,languages:3,overviewToDetailFlows:details,mobileOverflow:false,browserErrors:errors,ordersSent:0,messagesSent:0}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
