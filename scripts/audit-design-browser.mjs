// Isolated local inspection. External requests and every write are blocked.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin=process.env.AUDIT_ORIGIN || 'http://localhost:3035';
assert.match(origin,/^http:\/\/(localhost|127\.0\.0\.1):\d+$/);
const phase=process.argv[2] || 'after';
const dir=`../design-preview/master-audit/${phase}`;
await fs.mkdir(dir,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
const context=await browser.newContext();
let blockedWrites=0;
await context.route('**/*',route=>{
 const r=route.request();
 if(r.method()!=='GET'){blockedWrites++;return route.abort();}
 if(new URL(r.url()).origin!==origin)return route.abort();
 if(new URL(r.url()).pathname==='/api/members/me')return route.fulfill({json:{user:null}});
 return route.continue();
});
const page=await context.newPage(),errors=[],results=[];
page.on('pageerror',e=>errors.push(e.message));
const routes=['/nl','/nl/assortiment','/nl/visschalen','/nl/feestdagen','/nl/bezoek-ons','/nl/feestdagen/visschotel-klein-3-5-pers','/nl/recepten/zalm-citroen-dille','/nl/contact'];
const widths=phase==='before'?[[390,844],[1440,900]]:[[360,800],[390,844],[430,932],[768,1024],[820,1180],[1180,820],[1366,768],[1440,900],[1920,1080]];
try {
 for(const [width,height] of widths){
  await page.setViewportSize({width,height});
  for(const route of routes){
   const response=await page.goto(origin+route,{waitUntil:'networkidle'});
   if(await page.getByRole('button',{name:'Weigeren',exact:true}).isVisible())await page.getByRole('button',{name:'Weigeren',exact:true}).click();
   const measurement=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelector('h1')?.textContent,font:document.querySelector('h1')&&getComputedStyle(document.querySelector('h1')).fontFamily,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src')),button:[...document.querySelectorAll('.knop-rood')].slice(0,1).map(e=>({background:getComputedStyle(e).backgroundColor,color:getComputedStyle(e).color}))}));
   results.push({route,width,height,status:response.status(),...measurement});
   if([390,1440].includes(width)||route==='/nl'&&[820,1180].includes(width)){
    // Load lazy images by visiting each viewport before the full-page capture.
    const height=await page.evaluate(()=>document.documentElement.scrollHeight);
    for(let y=0;y<height;y+=700){await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(60);}
    await page.waitForLoadState('networkidle');
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.screenshot({path:`${dir}/${route.split('/').filter(Boolean).join('-')}-${width}.png`,fullPage:true});
   }
  }
 }
 if(phase!=='before'){
  await page.setViewportSize({width:390,height:844});
  for(const locale of ['nl','en','de']){
   const copy=JSON.parse(await fs.readFile(`src/messages/${locale}.json`,'utf8')).contactPage;
   await page.goto(origin+`/${locale}/contact`);
   const form=page.locator('form').filter({has:page.locator('textarea')});
   await form.getByLabel(copy.nameLabel,{exact:true}).fill('Local audit');
   await form.getByLabel(copy.messageLabel,{exact:true}).fill('Not sent');
   assert.equal(await form.evaluate(f=>f.checkValidity()),false);
   await form.getByLabel(copy.emailLabel,{exact:true}).fill('audit@example.invalid');
   assert.equal(await form.evaluate(f=>f.checkValidity()),true);
   await form.getByLabel(copy.emailLabel,{exact:true}).fill('');
   await form.getByLabel(copy.phoneLabel,{exact:true}).fill('+31 6 1234 5678');
   assert.equal(await form.evaluate(f=>f.checkValidity()),true);
   await form.getByLabel(copy.phoneLabel,{exact:true}).fill('invalid phone');
   await form.getByRole('button',{name:copy.send,exact:true}).click();
   assert.ok((await form.getByRole('alert').innerText()).includes(copy.replyRequired));
  }
  assert.equal(blockedWrites,0,'Client must reject invalid contact before POST');
  await page.goto(origin+'/nl/feestdagen');
  for(const link of await page.locator('.catalog-section-links a').all()){
   const href=await link.getAttribute('href');await link.click();
   assert.equal(new URL(page.url()).hash,href);
   await page.waitForFunction(selector=>{const box=document.querySelector(selector)?.getBoundingClientRect();return box && box.top>=0 && box.top<innerHeight;},href);
   const box=await page.locator(href).boundingBox();assert.ok(box.y>=0&&box.y<844,href);
  }
  // 200% text zoom/reflow approximation; physical browser zoom is reported separately.
  await page.setViewportSize({width:683,height:384});
  await page.goto(origin+'/nl/contact');
  await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  results.push({check:'200% text enlargement with 683px reflow',...await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}))});
  await page.screenshot({path:`${dir}/contact-text-zoom.png`,fullPage:true});
 }
}finally{
 await fs.writeFile(`${dir}/results.json`,JSON.stringify({results,errors,blockedWrites},null,2));
 await browser.close();
}
const failures=results.filter(r=>r.scrollWidth>r.width+1||r.status&&r.status!==200||r.brokenImages?.length);
console.log(JSON.stringify({checks:results.length,failures,errors,blockedWrites}));
if(failures.length||errors.length)process.exitCode=1;
