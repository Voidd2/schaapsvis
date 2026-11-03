// Real Chrome page zoom via an isolated test profile, not CSS text enlargement.
// Never uses or modifies the owner's Chrome profile.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const origin=process.env.AUDIT_ORIGIN||'http://localhost:3037';
assert.match(origin,/^http:\/\/(localhost|127\.0\.0\.1):\d+$/);
const output=path.resolve('../design-preview/master-audit/zoom');
await fs.mkdir(output,{recursive:true});
const profile=await fs.mkdtemp(path.join(output,'isolated-profile-'));
await fs.mkdir(path.join(profile,'Default'));
// Chromium ChromeZoomLevelPrefs: default partition key is x; factor=1.2^level.
await fs.writeFile(path.join(profile,'Default','Preferences'),JSON.stringify({partition:{default_zoom_level:{x:Math.log(2)/Math.log(1.2)}}}));
const context=await chromium.launchPersistentContext(profile,{channel:'chrome',headless:true,viewport:null,args:['--window-size=1366,900','--force-device-scale-factor=1']});
await context.route('**/*',r=>new URL(r.request().url()).origin!==origin||r.request().method()!=='GET'?r.abort():r.continue());
const page=await context.newPage(),results=[],errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 for(const route of ['/nl','/nl/assortiment','/nl/visschalen','/nl/feestdagen','/nl/bezoek-ons','/nl/contact','/nl/feestdagen/visschotel-klein-3-5-pers','/nl/recepten/zalm-citroen-dille']){
  await page.goto(origin+route,{waitUntil:'networkidle'});
  if(await page.getByRole('button',{name:'Weigeren',exact:true}).isVisible())await page.getByRole('button',{name:'Weigeren',exact:true}).click();
  const m=await page.evaluate(()=>({outer:outerWidth,inner:innerWidth,dpr:devicePixelRatio,scroll:document.documentElement.scrollWidth,rootFont:getComputedStyle(document.documentElement).fontSize}));
  results.push({route,...m});
  assert.ok(Math.abs(m.dpr-2)<.02,'Actual Chrome page zoom must be 200%');
  assert.ok(Math.abs(m.outer/m.inner-2)<.05,'CSS viewport must reflow at half window width');
  assert.equal(m.rootFont,'17px','Unmodified stylesheet font size, not a CSS zoom simulation');
  assert.ok(m.scroll<=m.inner+1,route+' overflow');
  const cdp=await context.newCDPSession(page);
  const shot=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});
  await fs.writeFile(path.join(output,route.split('/').filter(Boolean).join('-')+'.png'),Buffer.from(shot.data,'base64'));
  await cdp.detach();
 }
 assert.equal(errors.length,0);
}finally{await context.close();await fs.writeFile(path.join(output,'results.json'),JSON.stringify({results,errors},null,2));}
console.log(JSON.stringify({results,errors}));
