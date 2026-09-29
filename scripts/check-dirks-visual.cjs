// Read-only responsive smoke check; screenshots are local build artefacts.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 fs.mkdirSync('.next/visual-check',{recursive:true});
 const systemChrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
 const executablePath=process.env.CHROME_PATH||(fs.existsSync(systemChrome)?systemChrome:undefined);
 const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
 const results=[];
 for(const size of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}]){
  const page=await browser.newPage({viewport:{width:size.width,height:size.height},deviceScaleFactor:1});
  await page.goto('http://localhost:3000/nl/assortiment',{waitUntil:'networkidle'});
  await page.locator('.collection-item').first().scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>[...document.querySelectorAll('.collection-item img')].slice(0,3).every(image=>image.complete&&image.naturalWidth>0));
  await page.screenshot({path:`.next/visual-check/assortiment-${size.name}.png`});
  const cards=await page.locator('.collection-item').count();
  const imageErrors=await page.locator('.collection-item img').evaluateAll(images=>images.slice(0,3).filter(image=>!image.complete||image.naturalWidth===0).map(image=>image.src));
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  const firstCard=await page.locator('.collection-item').first().evaluate(el=>({width:Math.round(el.getBoundingClientRect().width),imageWidth:Math.round(el.querySelector('.collection-thumb').getBoundingClientRect().width)}));
  assert.ok(cards>30,`${size.name}: missing products`);
  assert.deepEqual(imageErrors,[],`${size.name}: broken images`);
  assert.equal(overflow,false,`${size.name}: horizontal overflow`);
  assert.ok(firstCard.imageWidth>size.width*(size.name==='desktop'?.18:.7),`${size.name}: tiny product photos`);
  results.push({viewport:size.name,cards,firstCard,brokenImages:imageErrors.length,overflow});
  await page.goto('http://localhost:3000/nl/visschalen',{waitUntil:'networkidle'});
  await page.locator('img[src*="visschotel-hapjes-3-5-pers"]').scrollIntoViewIfNeeded();
  await page.screenshot({path:`.next/visual-check/visschalen-${size.name}.png`});
  for(const slug of ['visschotel-hapjes-3-5-pers','visschotel-middel-5-8-pers','visschotel-luxe-10-14-pers']){
   assert.ok(await page.locator(`img[src*="${slug}"]`).count(),`${size.name}: platter image ${slug}`);
  }
  await page.close();
 }
 await browser.close();
 console.log(JSON.stringify(results));
})().catch(error=>{console.error(error);process.exitCode=1;});
