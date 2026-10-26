/* eslint-disable @typescript-eslint/no-require-imports */
// Read-only browser checks: decode every catalogue photo and follow detail links.
const {chromium}=require('playwright'),assert=require('assert/strict'),path=require('path');
const origin=process.argv[2]||'http://localhost:3011';
const decisions=JSON.parse(require('fs').readFileSync('src/lib/assortiment-besluiten.json','utf8'));
const expected=decisions.originalCount-decisions.removed.length+decisions.added.length;
async function revealAllProducts(page,locale){
 const images=page.locator('.collection img');
 for(let attempt=0;attempt<10&&(await images.count())<expected;attempt++){
  const before=await images.count();
  const more=page.locator('.collection-load-more');
  assert.ok(await more.isVisible(),`${locale} load-more control is visible`);
  await more.scrollIntoViewIfNeeded();
  await more.click();
  await page.waitForFunction(previous=>document.querySelectorAll('.collection img').length>previous,before);
 }
 assert.equal(await images.count(),expected,locale+' catalogue coverage');
}
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const errors=[];let decoded=0,details=0,recipePages=0;
 try{
  for(const locale of ['nl','en','de']){
   const page=await browser.newPage({viewport:{width:390,height:844}});
   page.on('pageerror',e=>errors.push(locale+': '+e.message));
   await page.goto(`${origin}/${locale}/assortiment`,{waitUntil:'networkidle'});
   await revealAllProducts(page,locale);
   const catalogueImages=page.locator('.collection img');
   const images=await catalogueImages.evaluateAll(async imgs=>{
    imgs.forEach(img=>img.loading='eager');
    await Promise.all(imgs.map(img=>img.decode()));
    return imgs.map(img=>({width:img.naturalWidth,height:img.naturalHeight,alt:img.alt}));
   });
   assert.ok(images.every(img=>img.width>0&&img.height>0&&img.alt),locale+' image decode/description');decoded+=images.length;
   assert.ok(await page.locator('body').evaluate(el=>el.scrollWidth<=innerWidth+1),locale+' mobile overflow');
   if(locale==='nl'){
    await page.locator('input[type="search"]').fill('tonijn');
    await page.waitForFunction(()=>!document.querySelector('.collection-favorites')&&[...document.querySelectorAll('.collection-item h3')].every(el=>/tonijn/i.test(el.textContent)));
    await page.locator('.collection-item').first().screenshot({path:path.resolve('../../outputs/assortiment-internet-mobiel.png')});
    await page.locator('input[type="search"]').fill('');
    await page.waitForFunction(count=>document.querySelector('.collection-count')?.textContent?.match(/\d+/)?.[0]===String(count),expected);
    await revealAllProducts(page,locale);
   }
   const productCards=await page.locator('.collection .favorite-card, .collection .collection-item').evaluateAll(cards=>cards.map(card=>({href:[...card.querySelectorAll('a[href]')].map(link=>link.getAttribute('href')).find(href=>href?.startsWith(`/${document.documentElement.lang}/assortiment/`)),title:card.querySelector('h3')?.textContent?.trim()})).filter(card=>card.href&&card.title));
   assert.equal(productCards.length,expected,locale+' product cards with detail links');
   assert.equal(new Set(productCards.map(card=>card.href)).size,expected,locale+' unique product links');
   const recipeHrefs=new Set();
   for(const {href,title} of productCards){
    for(let attempt=0;attempt<10&&!await page.locator(`.collection a[href="${href}"]`).count();attempt++){
     const more=page.locator('.collection-load-more');
     if(!(await more.isVisible()))break;
     const before=await page.locator('.collection img').count();
     await more.scrollIntoViewIfNeeded();await more.click();
     await page.waitForFunction(previous=>document.querySelectorAll('.collection img').length>previous,before);
    }
    const link=page.locator(`.collection a[href="${href}"]`).first();
    await link.click();await page.waitForURL(`**${href}`);
    await page.waitForFunction(expectedTitle=>{
     const heading=document.querySelector('main h1')?.textContent?.trim();
     return heading===expectedTitle&&!document.querySelector('[data-next-error]');
    },title);
    assert.equal((await page.locator('main h1').innerText()).trim(),title,locale+href+' detail heading');
    const img=page.locator('main img').first();await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());
    assert.ok(await img.evaluate(i=>i.naturalWidth>0),locale+href+' detail decode');
    details++;
    for(const recipeHref of await page.locator(`a[href^="/${locale}/recepten/"]`).evaluateAll(links=>links.map(link=>link.getAttribute('href'))))recipeHrefs.add(recipeHref);
    if(locale==='nl'&&href.endsWith('/tonijnfilet'))await page.screenshot({path:path.resolve('../../outputs/tonijnfilet-internet-mobiel.png'),fullPage:true});
    await page.goto(`${origin}/${locale}/assortiment`,{waitUntil:'networkidle'});
   }
   for(const href of recipeHrefs){
    await page.goto(`${origin}${href}`,{waitUntil:'networkidle'});
    assert.ok(await page.locator('main h1').count(),locale+href+' recipe heading');
    assert.ok(await page.locator('main h1').first().innerText(),locale+href+' recipe title');
    recipePages++;
   }
   await page.close();
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({catalogueImagesDecoded:decoded,languages:3,overviewToDetailFlows:details,uniqueRecipePagesOpened:recipePages,mobileOverflow:false,browserErrors:errors,ordersSent:0,messagesSent:0}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

