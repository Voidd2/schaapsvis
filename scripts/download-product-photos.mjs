// Store reviewed internet originals locally; never alter or upscale photographs.
import fs from 'node:fs/promises';
import path from 'node:path';
const records=JSON.parse(await fs.readFile('scripts/internet-product-sources.json','utf8'));
const destination=path.resolve('public/images/assortiment-internet');
const refresh=new Set(process.argv.slice(2));
await fs.mkdir(destination,{recursive:true});
for(const p of records){
 const file=path.resolve('public'+p.src);
 if(!file.startsWith(destination+path.sep))throw new Error('Unsafe target '+file);
 if(!refresh.has(p.slug)&&await fs.stat(file).then(s=>s.size>5000).catch(()=>false))continue;
 let r;
 for(let retry=0;retry<4;retry++){
  r=await fetch(p.url,{headers:{'User-Agent':'SchaapsvisPhotoAssets/1.0'}});
  if(r.status!==429)break;
  await new Promise(resolve=>setTimeout(resolve,15000));
 }
 if(!r.ok||!r.headers.get('content-type')?.startsWith('image/'))throw new Error(`${p.slug}: HTTP ${r.status}`);
 const bytes=Buffer.from(await r.arrayBuffer());
 if(bytes.length<5000)throw new Error('Suspicious thumbnail '+p.slug);
 await fs.writeFile(file,bytes);
 console.log(`${p.slug}: ${bytes.length} bytes`);
 await new Promise(resolve=>setTimeout(resolve,800));
}
