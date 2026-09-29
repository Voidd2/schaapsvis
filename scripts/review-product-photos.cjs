// Render original files for human visual review; photographs are not modified.
const fs=require('fs'),path=require('path'),{chromium}=require('playwright');
(async()=>{
 const records=JSON.parse(fs.readFileSync('scripts/internet-product-sources.json','utf8'));
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1500,height:1000},deviceScaleFactor:1});
 const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 for(let start=0;start<records.length;start+=15){
  const batch=records.slice(start,start+15).filter(p=>fs.existsSync('public'+p.src));
  const cards=batch.map(p=>{const bytes=fs.readFileSync('public'+p.src),mime=p.src.endsWith('.png')?'image/png':'image/jpeg';return `<figure><img src="data:${mime};base64,${bytes.toString('base64')}"/><figcaption>${escape(p.slug)}<br/>${escape(p.kind)}<br/><small>${escape(p.title||'Hartevelt productfoto')}</small></figcaption></figure>`;}).join('');
  await page.setContent(`<style>body{margin:12px;background:#eef7fb;font:16px Arial}main{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}figure{margin:0;background:white;padding:8px}img{width:100%;height:220px;object-fit:contain}figcaption{padding:8px 0;min-height:70px}small{font-size:11px}</style><main>${cards}</main>`);
  await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
  const file=path.resolve('../../outputs',`internet-photos-review-${start/15+1}.png`);
  await page.screenshot({path:file,fullPage:true});console.log(file);
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
