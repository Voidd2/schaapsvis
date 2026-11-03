// Local unthrottled lab observations, NOT Lighthouse scores or field Core Web Vitals.
import fs from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:'chrome'}),rows=[];
try{
 for(const width of [390,1440])for(const path of ['/nl','/nl/assortiment','/nl/feestdagen'])for(let sample=1;sample<=3;sample++){
  const context=await browser.newContext({viewport:{width,height:900}});
  await context.route('**/*',r=>new URL(r.request().url()).origin!=='http://localhost:3035'||r.request().method()!=='GET'?r.abort():r.continue());
  const page=await context.newPage();
  await page.addInitScript(()=>{
   window.auditLab={lcp:0,cls:0,shifts:[]};
   new PerformanceObserver(list=>{for(const e of list.getEntries())window.auditLab.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
   new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput){window.auditLab.cls+=e.value;window.auditLab.shifts.push({value:e.value,time:e.startTime,nodes:e.sources?.map(s=>({tag:s.node?.tagName,class:s.node?.className,previous:s.previousRect,current:s.currentRect}))});}}).observe({type:'layout-shift',buffered:true});
  });
  await page.goto('http://localhost:3035'+path,{waitUntil:'networkidle'});
  rows.push({path,width,sample,...await page.evaluate(()=>({...window.auditLab,domContentLoaded:performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,transferBytes:performance.getEntriesByType('resource').reduce((n,r)=>n+r.transferSize,0),requests:performance.getEntriesByType('resource').length}))});
  await context.close();
 }
}finally{await browser.close();}
await fs.writeFile('../design-preview/master-audit/performance-local.json',JSON.stringify({environment:'Unthrottled localhost, headless installed Chrome, fresh context per sample; no real-user INP or field data',rows},null,2));
console.log(JSON.stringify(rows));
